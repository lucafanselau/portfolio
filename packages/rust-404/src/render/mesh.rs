use glow::{Buffer, VertexArray};

use crate::atlas::BlockTexture;

use super::camera::UP;
use super::Vertex;

pub struct Mesh {
    pub vao: VertexArray,
    pub buffer: Buffer,
    pub vertices_count: i32,
}

impl Mesh {
    pub fn new(vao: VertexArray, buffer: Buffer, vertices_count: i32) -> Self {
        Self {
            vao,
            buffer,
            vertices_count,
        }
    }
}

pub fn cube(scale: glam::Vec3) -> Vec<Vertex> {
    let scale = 0.5 * scale;

    let mut vertices = Vec::with_capacity(36);

    let mut calc_from_norm = |norm: glam::Vec3, orthogonal: glam::Vec3| {
        let base = norm * scale;
        let orthogonal = orthogonal * scale;

        let right = (base.cross(orthogonal)).normalize() * scale;

        let vec = |a: f32, b: f32| -> Vertex {
            let local_coord = glam::vec2(a, b) * 0.5 + glam::vec2(0.5, 0.5);
            // let tex_coord = Textures::DIRT.base + tex_coord * Textures::DIRT.extend;
            const TEXTURE: BlockTexture = BlockTexture::Stone;

            Vertex {
                pos: base + (a * right + b * orthogonal),
                normal: norm,
                tex_coord: TEXTURE.tex_coord(local_coord),
                base_loc: glam::Vec3::splat(0.0),
            }
        };

        // First triangle
        vertices.push(vec(-1.0, 1.0));
        vertices.push(vec(-1.0, -1.0));
        vertices.push(vec(1.0, -1.0));

        // second triangle
        vertices.push(vec(-1.0, 1.0));
        vertices.push(vec(1.0, -1.0));
        vertices.push(vec(1.0, 1.0));
    };

    // X Normals
    calc_from_norm(glam::vec3(1.0, 0.0, 0.0), UP);
    calc_from_norm(glam::vec3(-1.0, 0.0, 0.0), UP);
    // Z Normals
    calc_from_norm(glam::vec3(0.0, 0.0, 1.0), UP);
    calc_from_norm(glam::vec3(0.0, 0.0, -1.0), UP);
    // Y Normals
    calc_from_norm(glam::vec3(0.0, 1.0, 0.0), glam::vec3(1.0, 0.0, 0.0));
    calc_from_norm(glam::vec3(0.0, -1.0, 0.0), glam::vec3(1.0, 0.0, 0.0));

    vertices
}

pub fn build_selection_ring() -> Vec<Vertex> {
    const WIDTH: f32 = 0.05f32;
    const SCALE: f32 = 0.5 - (WIDTH / 2.0);
    let dirs = [glam::Vec3::X, glam::Vec3::Z];
    let signs = [-1f32, 1f32];
    let mut result = Vec::new();
    for (dir, sign, add_length) in dirs
        .iter()
        .enumerate()
        .flat_map(|(index, d)| signs.iter().map(move |s| (d.clone(), s, index == 0)))
    {
        let base = sign * SCALE * dir;
        let side = dir.cross(UP).normalize();
        let side = if add_length {
            side
        } else {
            side * (1.0 - 2.0 * WIDTH)
        };
        let extend = side + WIDTH * dir + WIDTH * UP;
        result.extend(cube(extend).into_iter().map(|v| Vertex {
            pos: v.pos + base + (WIDTH * 0.5 * UP),
            ..v
        }));
    }

    result
}

#[derive(Debug, Clone)]
pub enum Face {
    NegativeX,
    PositiveX,
    NegativeY,
    PositiveY,
    NegativeZ,
    PositiveZ,
}

impl Face {
    pub const FACES: [Self; 6] = [
        Self::NegativeX,
        Self::PositiveX,
        Self::NegativeY,
        Self::PositiveY,
        Self::NegativeZ,
        Self::PositiveZ,
    ];

    pub fn normal(&self) -> glam::Vec3 {
        self.neighbor_dir().as_vec3()
    }

    pub fn neighbor_dir(&self) -> glam::IVec3 {
        match *self {
            Face::NegativeX => -glam::IVec3::X,
            Face::PositiveX => glam::IVec3::X,
            Face::NegativeY => -glam::IVec3::Y,
            Face::PositiveY => glam::IVec3::Y,
            Face::NegativeZ => -glam::IVec3::Z,
            Face::PositiveZ => glam::IVec3::Z,
        }
    }

    pub fn orthogonal(&self) -> glam::Vec3 {
        match *self {
            Face::NegativeX => UP,
            Face::PositiveX => UP,
            Face::NegativeY => glam::Vec3::X,
            Face::PositiveY => glam::Vec3::X,
            Face::NegativeZ => UP,
            Face::PositiveZ => UP,
        }
    }
}

fn calc_face(
    norm: glam::Vec3,
    orthogonal: glam::Vec3,
    pos: &glam::IVec3,
    vertices: &mut Vec<Vertex>,
    t: BlockTexture,
) {
    let scale = 0.5f32;
    let base = pos.as_vec3() + norm * scale;
    let orthogonal = orthogonal * scale;

    let right = (norm.cross(orthogonal)).normalize() * scale;

    let vec = |a: f32, b: f32| -> Vertex {
        let local_coord = glam::vec2(a, -b) * 0.5 + glam::vec2(0.5, 0.5);
        // let tex_coord = Textures::DIRT.base + tex_coord * Textures::DIRT.extend;

        Vertex {
            pos: base + (a * right + b * orthogonal),
            normal: norm,
            tex_coord: t.tex_coord(local_coord),
            base_loc: pos.as_vec3(),
        }
    };

    // First triangle
    vertices.push(vec(-1.0, 1.0));
    vertices.push(vec(-1.0, -1.0));
    vertices.push(vec(1.0, -1.0));

    // second triangle
    vertices.push(vec(-1.0, 1.0));
    vertices.push(vec(1.0, -1.0));
    vertices.push(vec(1.0, 1.0));
}

pub fn build_face(vec: &mut Vec<Vertex>, face: &Face, pos: &glam::IVec3, t: BlockTexture) {
    calc_face(face.normal(), face.orthogonal(), pos, vec, t)
}
