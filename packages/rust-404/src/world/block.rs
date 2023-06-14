use rand::{distributions::Standard, prelude::Distribution};

use crate::{atlas::BlockTexture, render::mesh::Face};
use enum_iterator::IntoEnumIterator;

#[derive(Debug, Clone, Copy, PartialEq, Eq, IntoEnumIterator)]
pub enum BlockType {
    Grass,
    Stone,
    Dirt,
    Air,
    OakLog,
    BirchLog,
    Plank,
    Silver,
    Coal,
    Emerald,
    Iron,
    Gold,
    Gravel,
    Oven,
    Workbench,
    Diamond,
    Sand,
    Brick,
}

impl Distribution<BlockType> for Standard {
    fn sample<R: rand::Rng + ?Sized>(&self, rng: &mut R) -> BlockType {
        match rng.gen_range(0..4) {
            0 => BlockType::Grass,
            1 => BlockType::Stone,
            2 => BlockType::Dirt,
            _ => BlockType::Air,
        }
    }
}

pub enum BlockTextures {
    Uniform(BlockTexture),
    SideTopBottom {
        side: BlockTexture,
        top: BlockTexture,
        bottom: BlockTexture,
    },
    Axis {
        x: BlockTexture,
        y: BlockTexture,
        z: BlockTexture,
    },
}

impl BlockTextures {
    pub fn for_face(&self, face: &Face) -> BlockTexture {
        match self {
            BlockTextures::Uniform(t) => t.clone(),
            BlockTextures::SideTopBottom { side, top, bottom } => match face {
                Face::NegativeY => bottom.clone(),
                Face::PositiveY => top.clone(),
                Face::NegativeX | Face::PositiveX | Face::NegativeZ | Face::PositiveZ => {
                    side.clone()
                }
            },
            BlockTextures::Axis { x, y, z } => match face {
                Face::NegativeX | Face::PositiveX => x,
                Face::NegativeY | Face::PositiveY => y,
                Face::NegativeZ | Face::PositiveZ => z,
            }
            .clone(),
        }
    }
}

fn uniform(t: BlockTexture) -> Option<BlockTextures> {
    Some(BlockTextures::Uniform(t))
}
fn side_top_bottom(
    side: BlockTexture,
    top: BlockTexture,
    bottom: BlockTexture,
) -> Option<BlockTextures> {
    Some(BlockTextures::SideTopBottom { side, top, bottom })
}

impl BlockType {
    pub fn textures(&self) -> Option<BlockTextures> {
        use BlockTexture::*;
        match &*self {
            BlockType::Dirt => uniform(Dirt),
            BlockType::Air => None,
            BlockType::Grass => side_top_bottom(DirtGrass, GrassTop, Dirt),
            BlockType::Stone => uniform(Stone),
            BlockType::OakLog => side_top_bottom(TrunkSide, TrunkTop, TrunkTop),
            BlockType::BirchLog => side_top_bottom(TrunkWhiteSide, TrunkWhiteTop, TrunkWhiteTop),
            BlockType::Plank => uniform(Wood),
            BlockType::Silver => uniform(StoneSilver),
            BlockType::Coal => uniform(StoneCoal),
            BlockType::Emerald => uniform(StoneIron),
            BlockType::Iron => uniform(StoneBrowniron),
            BlockType::Gold => uniform(StoneGold),
            BlockType::Gravel => uniform(GravelStone),
            BlockType::Oven => Some(BlockTextures::Axis {
                x: Oven,
                y: Stone,
                z: Stone,
            }),
            BlockType::Workbench => Some(BlockTextures::Axis {
                x: Table,
                y: Wood,
                z: Wood,
            }),
            BlockType::Diamond => uniform(StoneDiamond),
            BlockType::Sand => uniform(Sand),
            BlockType::Brick => uniform(BrickRed),
        }
    }
}

// #[derive(Debug, Clone, Copy)]
// pub struct Block {
//     pub block_type: BlockType,
//     pub opaque: bool,
// }

// impl Block {
//     pub const DEFAULT: Self = Block {
//         block_type: BlockType::Dirt,
//         opaque: true,
//     };

//     pub const DIRT: Block = Block {
//         block_type: BlockType::Dirt,
//         ..Self::DEFAULT
//     };
//     pub const AIR: Block = Block {
//         block_type: BlockType::Air,
//         opaque: false,
//         ..Self::DEFAULT
//     };
//     pub const GRASS: Block = Block {
//         block_type: BlockType::Grass,
//         ..Self::DEFAULT
//     };
//     pub const STONE: Block = Block {
//         block_type: BlockType::Stone,
//         ..Self::DEFAULT
//     };
// }
