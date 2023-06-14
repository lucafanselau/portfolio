use crate::{
    render::{
        mesh::{build_face, Face},
        Vertex,
    },
    world::block::BlockType,
};
use anyhow::anyhow;
use noise::{NoiseFn, Seedable};
use rand::Rng;

// NOTE: That has to be kept in sync with picking.vert
pub const CHUNK_SIZE: usize = 16;

pub struct Chunk {
    blocks: [[[BlockType; CHUNK_SIZE]; CHUNK_SIZE]; CHUNK_SIZE],
}

fn gen_3d_range(from: i32, to: i32) -> impl Iterator<Item = glam::IVec3> {
    (from..to).flat_map(move |a| {
        (from..to).flat_map(move |b| (from..to).map(move |c| glam::ivec3(a, b, c)))
    })
}

impl Chunk {
    pub fn new() -> Self {
        let mut blocks = [[[BlockType::Air; CHUNK_SIZE]; CHUNK_SIZE]; CHUNK_SIZE];

        let perlin = noise::Perlin::new();
        let perlin = perlin.set_seed(rand::thread_rng().gen_range(0..123456));
        let size = CHUNK_SIZE as f64 + 2.0;
        for x in 0..CHUNK_SIZE {
            for z in 0..CHUNK_SIZE {
                let height = perlin.get([(x as f64 + 1.0) / size, (z as f64 + 1.0) / size])
                    * (CHUNK_SIZE as f64 / 2.0)
                    + (CHUNK_SIZE as f64 / 2.0);
                let height = height.floor() as i32;
                for y in 0..CHUNK_SIZE {
                    let block_type = match (y as i32) - height {
                        0 => BlockType::Grass,
                        -3..=-1 => BlockType::Dirt,
                        -100..=-4 => BlockType::Stone,
                        _ => BlockType::Air,
                    };
                    blocks[x][y][z] = block_type;
                }
            }
        }

        // blocks.iter_mut().for_each(|b| *b = rand::random());

        Chunk { blocks }
    }

    pub fn set(&mut self, pos: glam::IVec3, block_type: BlockType) -> anyhow::Result<()> {
        if pos
            .as_ref()
            .iter()
            .any(|c| *c < 0 || *c >= CHUNK_SIZE as i32)
        {
            Err(anyhow!("pos: {:?} is out of bounds for chunk", pos))
        } else {
            self.blocks[pos.x as usize][pos.y as usize][pos.z as usize] = block_type;
            Ok(())
        }
    }

    fn sample_vec(&self, vec: glam::IVec3) -> Option<BlockType> {
        if vec
            .as_ref()
            .iter()
            .any(|c| *c < 0 || *c >= CHUNK_SIZE as i32)
        {
            None
        } else {
            Some(self.blocks[vec.x as usize][vec.y as usize][vec.z as usize])
        }
    }

    pub fn chunk_vertices(&self) -> Vec<Vertex> {
        let mut vertices = Vec::new();
        for pos in gen_3d_range(0, CHUNK_SIZE as i32) {
            if let Some(block) = self.sample_vec(pos) {
                if let Some(textures) = block.textures() {
                    for face in Face::FACES.iter() {
                        let neighbor = self.sample_vec(pos + face.neighbor_dir());
                        if neighbor.is_none()
                            || neighbor.map(|v| v.textures().is_none()).unwrap_or(false)
                        {
                            let texture = textures.for_face(face);
                            build_face(&mut vertices, face, &pos, texture)
                        }
                    }
                }
            }
        }
        vertices
    }
}
