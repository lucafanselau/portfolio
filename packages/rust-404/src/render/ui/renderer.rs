use std::{
    cell::RefCell,
    ops::{Add, Sub},
};

use anyhow::anyhow;
use bytemuck::{Pod, Zeroable};
use glow::{Buffer, HasContext, Program, Texture, VertexArray};

use crate::render::{Renderer, FLOAT_SIZE};

use super::Color;

#[derive(Debug, Clone, Copy, Zeroable, Pod)]
#[repr(C)]
struct UiVertex {
    pos: glam::Vec2,
    tex_coord: glam::Vec2,
}

#[derive(Debug, Clone)]
pub enum UiMaterial {
    Solid(Color),
    Sprite(Texture),
}

impl UiMaterial {
    const fn from_triplet(r: u8, g: u8, b: u8) -> Self {
        UiMaterial::Solid(glam::const_vec4!([
            r as f32 / 255.0,
            g as f32 / 255.0,
            b as f32 / 255.0,
            1.0
        ]))
    }

    pub const WHITE: Self = UiMaterial::Solid(glam::const_vec4!([1.0; 4]));
    pub const BLACK: Self = UiMaterial::Solid(glam::const_vec4!([0.0, 0.0, 0.0, 1.0]));
    pub const DARKER: Self = Self::from_triplet(36, 39, 47);
    pub const DARK: Self = Self::from_triplet(62, 66, 81);
}

#[derive(Debug, Clone)]
pub struct UiRect {
    pub(crate) tl: glam::Vec2,
    pub(crate) extend: glam::Vec2,
}

impl UiRect {
    pub const DEFAULT_TEX: Self = Self {
        tl: glam::const_vec2!([0.0, 0.0]),
        extend: glam::const_vec2!([1.0, 1.0]),
    };
    pub fn new(tl: glam::Vec2, extend: glam::Vec2) -> Self {
        Self { tl, extend }
    }
    pub fn from_coords(x: u32, y: u32, width: u32, height: u32) -> Self {
        Self {
            tl: glam::uvec2(x, y).as_vec2(),
            extend: glam::uvec2(width, height).as_vec2(),
        }
    }
    /// Construct a new UiRect by insetting by value
    pub fn inset(self: &Self, v: u32) -> Self {
        let values = glam::vec2(v as f32, v as f32);
        Self::new(self.tl.add(values), self.extend.sub(2.0 * values))
    }
}

#[derive(Debug, Clone)]
struct UiGeometry {
    first: i32,
    count: i32,
    material: UiMaterial,
}

pub struct UiFrame {
    buffer: Vec<UiVertex>,
    indices: Vec<u16>,
    geometry: Vec<UiGeometry>,
}

impl UiFrame {
    pub fn new() -> Self {
        Self {
            buffer: Default::default(),
            indices: Default::default(),
            geometry: Default::default(),
        }
    }

    pub fn rect(&mut self, rect: UiRect, material: UiMaterial) {
        let (first, count) = self.add_rect(rect);
        self.geometry.push(UiGeometry {
            first,
            count,
            material,
        });
    }

    pub fn rect_with_tex(&mut self, rect: UiRect, tex_coord: UiRect, material: UiMaterial) {
        let (first, count) = self.add_rect_with_tex_coord(rect, tex_coord);
        self.geometry.push(UiGeometry {
            first,
            count,
            material,
        });
    }

    fn add_rect(&mut self, rect: UiRect) -> (i32, i32) {
        self.add_rect_with_tex_coord(rect, UiRect::DEFAULT_TEX)
    }

    fn add_rect_with_tex_coord(&mut self, rect: UiRect, tex_coord: UiRect) -> (i32, i32) {
        const B: [f32; 2] = [0.0, 1.0];
        const A: [f32; 2] = [0.0, 1.0];

        const INDICES: [u16; 6] = [0, 1, 2, 1, 3, 2];

        let first_vertex = self.buffer.len() as u16;

        // Construct the Vertices
        self.buffer.extend(
            A.iter()
                .flat_map(|a| B.iter().map(move |b| glam::vec2(*a, *b)))
                .map(|t| UiVertex {
                    pos: rect.tl + t * rect.extend,
                    tex_coord: tex_coord.tl + t * tex_coord.extend,
                }),
        );

        let first_index = self.indices.len() as i32;
        self.indices
            .extend(INDICES.iter().map(|i| i + first_vertex));

        (first_index, INDICES.len() as i32)
    }
}

pub struct UiRenderer {
    program: Program,
    view_projection: glam::Mat4,
    vertex_array: VertexArray,
    vertex_buffer: Buffer,
    index_buffer: Buffer,
}

const UI_VERTEX_CODE: &'static str = include_str!("../shaders/ui.vert");
const UI_FRAGMENT_CODE: &'static str = include_str!("../shaders/ui.frag");

fn build_view(size: (i32, i32)) -> glam::Mat4 {
    glam::Mat4::orthographic_rh_gl(0.0, size.0 as f32, size.1 as f32, 0.0, -1.0, 1.0)
}

impl UiRenderer {
    pub unsafe fn new(context: &glow::Context, size: (i32, i32)) -> anyhow::Result<Self> {
        let program = {
            let vert = Renderer::compile_shader(&context, glow::VERTEX_SHADER, UI_VERTEX_CODE)?;
            let frag = Renderer::compile_shader(&context, glow::FRAGMENT_SHADER, UI_FRAGMENT_CODE)?;
            Renderer::link_program(&context, vert, frag)?
        };

        let view_projection = build_view(size);

        let vertex_buffer = context
            .create_buffer()
            .map_err(|e| anyhow!("failed to create buffer: {}", e))?;

        let index_buffer = context
            .create_buffer()
            .map_err(|e| anyhow!("failed to create buffer: {}", e))?;

        let vertex_array = context
            .create_vertex_array()
            .map_err(|e| anyhow!("failed to create buffer: {}", e))?;

        // TODO: Set those up
        context.bind_vertex_array(Some(vertex_array));
        context.bind_buffer(glow::ARRAY_BUFFER, Some(vertex_buffer));
        context.bind_buffer(glow::ELEMENT_ARRAY_BUFFER, Some(index_buffer));

        const ATTRIB_DATA: [i32; 2] = [2, 2];
        let total_size = ATTRIB_DATA.iter().sum::<i32>() * FLOAT_SIZE;
        let mut offset = 0;
        for (index, size) in ATTRIB_DATA.iter().copied().enumerate() {
            context.vertex_attrib_pointer_f32(
                index as u32,
                size,
                glow::FLOAT,
                false,
                total_size,
                offset * FLOAT_SIZE,
            );

            offset += size;
        }

        ATTRIB_DATA
            .iter()
            .enumerate()
            .for_each(|(i, _)| context.enable_vertex_attrib_array(i as u32));

        Ok(Self {
            program,
            view_projection,
            vertex_array,
            vertex_buffer,
            index_buffer,
        })
    }

    pub fn resize(&mut self, size: (i32, i32)) {
        self.view_projection = build_view(size);
    }

    pub unsafe fn render(&self, context: &glow::Context, frame: UiFrame) {
        context.disable(glow::DEPTH_TEST);

        context.use_program(Some(self.program));

        // Setup view projection
        let vp_loc = context.get_uniform_location(self.program, "view_projection");
        context.uniform_matrix_4_f32_slice(vp_loc.as_ref(), false, self.view_projection.as_ref());

        let color_loc = context.get_uniform_location(self.program, "color");

        context.bind_vertex_array(Some(self.vertex_array));

        context.bind_buffer(glow::ARRAY_BUFFER, Some(self.vertex_buffer));
        context.buffer_data_u8_slice(
            glow::ARRAY_BUFFER,
            bytemuck::cast_slice(&frame.buffer),
            glow::STREAM_DRAW,
        );

        context.bind_buffer(glow::ELEMENT_ARRAY_BUFFER, Some(self.index_buffer));
        context.buffer_data_u8_slice(
            glow::ELEMENT_ARRAY_BUFFER,
            bytemuck::cast_slice(&frame.indices),
            glow::STREAM_DRAW,
        );

        for UiGeometry {
            first,
            count,
            material,
        } in frame.geometry.into_iter()
        {
            let t = match &material {
                UiMaterial::Solid(_) => None,
                UiMaterial::Sprite(t) => Some(t).cloned(),
            };
            context.bind_texture(glow::TEXTURE_2D, t);

            let color = match material {
                UiMaterial::Solid(color) => color,
                UiMaterial::Sprite(_) => glam::Vec4::ZERO,
            };
            context.uniform_4_f32_slice(color_loc.as_ref(), color.as_ref());

            const U16_SIZE: i32 = std::mem::size_of::<u16>() as i32;

            context.draw_elements(
                glow::TRIANGLES,
                count,
                glow::UNSIGNED_SHORT,
                first * U16_SIZE,
            );
        }

        context.enable(glow::DEPTH_TEST);
    }
}
