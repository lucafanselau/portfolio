use crate::{
    input::{Button, EventListener, InputEvent, Key},
    render::{Face, Mesh, RenderTask, Renderer},
};
use enum_iterator::IntoEnumIterator;
use std::{collections::HashMap, rc::Rc};

pub mod block;
pub mod chunk;

pub use block::*;
pub use chunk::*;

pub struct World {
    renderer: Rc<Renderer>,
    chunks: HashMap<glam::IVec2, (Chunk, Mesh)>,
    pub(crate) types: Vec<BlockType>,
    pub(crate) active_type: usize,
    pub(crate) last_picked: Option<(glam::Vec3, Face)>,
}

impl World {
    pub fn new(renderer: Rc<Renderer>) -> Self {
        let mut chunks: HashMap<_, _> = Default::default();

        let chunk = Chunk::new();

        let mesh = renderer
            .create_mesh(&chunk.chunk_vertices())
            .expect("failed to create mesh");

        chunks.insert(glam::ivec2(0, 0), (chunk, mesh));

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
        for (_, (_, mesh)) in self.chunks.iter() {
            task.push(mesh);
        }
    }
}

impl EventListener for World {
    fn handle(&mut self, event: InputEvent) {
        match event {
            InputEvent::MouseClicked(button) => {
                // And maybe place a block
                if let Some((pos, face)) = self.last_picked.as_ref() {
                    // TODO: find chunk based on pos
                    let (_, (chunk, mesh)) = self.chunks.iter_mut().next().unwrap();

                    let recompute = match button {
                        Button::Primary => {
                            // Set the currently selected block to be air

                            chunk
                                .set(pos.as_ivec3(), BlockType::Air)
                                .expect("failed to set air");
                            true
                        }
                        Button::Secondary => {
                            // Add a block in the direction of the face
                            let pos = pos.as_ivec3() + face.neighbor_dir();
                            let block_type = *self
                                .types
                                .get(self.active_type)
                                .unwrap_or(&BlockType::Stone);
                            chunk.set(pos, block_type).is_ok()
                        }
                        _ => false,
                    };
                    if recompute {
                        *mesh = self
                            .renderer
                            .create_mesh(&chunk.chunk_vertices())
                            .expect("failed to create mesh");
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
            self.renderer.destroy_mesh(mesh);
        }
    }
}
