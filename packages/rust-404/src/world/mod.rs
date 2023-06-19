use crate::{
    input::{Button, EventListener, InputEvent, Key},
    render::{Face, Mesh, RenderTask, Renderer},
};
use enum_iterator::IntoEnumIterator;

use glam::Vec3Swizzles;
use noise::{NoiseFn, Perlin, Seedable, SuperSimplex};
use rand::Rng;
use std::{
    cell::RefCell,
    collections::HashMap,
    ops::{Div, Mul},
    rc::Rc,
};

pub mod block;
pub mod chunk;

pub use block::*;
pub use chunk::*;

pub struct World {
    renderer: Rc<RefCell<Renderer>>,
    chunks: HashMap<glam::IVec2, (Chunk, Mesh)>,
    pub(crate) types: Vec<BlockType>,
    pub(crate) active_type: usize,
    pub(crate) last_picked: Option<(glam::Vec3, Face)>,
}

pub const CHUNK_COUNT: usize = 8;
pub const WOLD_SIZE: usize = CHUNK_COUNT * CHUNK_SIZE;

impl World {
    pub fn new(renderer: Rc<RefCell<Renderer>>) -> Self {
        let mut chunks: HashMap<_, _> = Default::default();

        let noise = SuperSimplex::new();
        let noise = noise.set_seed(rand::thread_rng().gen_range(0..123456));

        // a closure that generates a height value, for world coordinates
        let noise_fn = move |x: i32, z: i32| {
            // scale input variables
            let x = x as f64 / 100.0;
            let z = z as f64 / 100.0;

            let noise_value = noise.get([x, z]) as f32;
            // scale the value from -1..1 to 0..CHUNK_SIZE range
            let noise_value = (noise_value + 1.0) * (CHUNK_SIZE as f32 / 2.0);
            noise_value.floor() as i32
        };

        {
            let mut add_chunk = |pos: glam::IVec2| {
                let pos = pos * CHUNK_SIZE as i32;
                let mut chunk = Chunk::new(&noise_fn, pos);
                let mesh = renderer
                    .borrow()
                    .create_mesh(&chunk.chunk_vertices())
                    .expect("failed to create mesh");

                chunks.insert(pos, (chunk, mesh));
            };

            (0..CHUNK_COUNT).for_each(|x| {
                (0..CHUNK_COUNT).for_each(|z| add_chunk(glam::ivec2(x as i32, z as i32)))
            });
        }

        let types = BlockType::into_enum_iter()
            .filter(|t| t.textures().is_some())
            .collect();

        Self {
            renderer,
            chunks,
            types,
            active_type: 0,
            last_picked: None,
        }
    }

    pub fn render<'a>(&'a self, task: &mut RenderTask<'a>) {
        for (_, (chunk, mesh)) in self.chunks.iter() {
            task.push_with_pos(mesh, chunk.pos());
        }
    }
}

impl EventListener for World {
    fn handle(&mut self, event: InputEvent) {
        match event {
            InputEvent::MouseClicked(button) => {
                // And maybe place a block
                if let Some((pos, face)) = self.last_picked.as_ref() {
                    let pos = pos.as_ivec3();

                    let recompute = match button {
                        Button::Primary => {
                            // Set the currently selected block to be air

                            // construct the chunk vector
                            // NOTE: div for *i32* should "floor" (eg. truncate the number)
                            let mut chunk_pos = pos.div(CHUNK_SIZE as i32).mul(CHUNK_SIZE as i32);
                            chunk_pos.y = 0;

                            let (chunk, mesh) =
                                self.chunks.get_mut(&chunk_pos.xz()).expect("invalid chunk");
                            let local_pos = pos - chunk_pos;
                            Some((chunk.set(local_pos, BlockType::Air).is_ok(), chunk, mesh))
                        }
                        Button::Secondary => {
                            // construct the chunk vector
                            // NOTE: div for *i32* should "floor" (eg. truncate the number)
                            let pos = pos + face.neighbor_dir();
                            let mut chunk_pos = pos.div(CHUNK_SIZE as i32).mul(CHUNK_SIZE as i32);
                            chunk_pos.y = 0;
                            let (chunk, mesh) =
                                self.chunks.get_mut(&chunk_pos.xz()).expect("invalid chunk");
                            let local_pos = pos - chunk_pos;
                            // log!("{}, {}, {}", pos, chunk_pos, local_pos);
                            // Add a block in the direction of the face
                            let block_type = *self
                                .types
                                .get(self.active_type)
                                .unwrap_or(&BlockType::Stone);
                            Some((chunk.set(local_pos, block_type).is_ok(), chunk, mesh))
                        }
                        _ => None,
                    };
                    if let Some((recompute, chunk, mesh)) = recompute {
                        if recompute {
                            *mesh = self
                                .renderer
                                .borrow()
                                .create_mesh(&chunk.chunk_vertices())
                                .expect("failed to create mesh");
                        }
                    }
                }
            }
            InputEvent::KeyDown(key) => match key {
                Key::E => self.active_type = (self.active_type + 1) % self.types.len(),
                Key::Q => {
                    if self.active_type == 0 {
                        self.active_type = self.types.len() - 1;
                    } else {
                        self.active_type = (self.active_type - 1) % self.types.len()
                    }
                }
                _ => (),
            },
            _ => (),
        }
    }
}

impl Drop for World {
    fn drop(&mut self) {
        for (_, (_, mesh)) in self.chunks.drain() {
            self.renderer.borrow().destroy_mesh(mesh);
        }
    }
}
