pub mod element;
pub mod renderer;

pub use element::*;
use glow::Texture;
pub use renderer::*;

use crate::world::block::BlockType;

use super::mesh::Face;

pub fn inventory(
    frame: &mut UiFrame,
    types: &Vec<BlockType>,
    active_type: &usize,
    atlas: &Texture,
) {
    // 2 px outer padding
    // 2 px padding around sprite
    // 36px sprite

    // let extend = glam::vec2((40 * 10 + 8) as f32, 48.0);
    // let tl = glam::vec2(0.5, 1.0) * (glam::vec2(600.0, 400.0) - extend);

    // Draw background
    // frame.rect(UiRect::new(tl, extend), UiMaterial::WHITE);
    let base = 100u32;

    let active = *active_type;
    // take the active type and the one's arround
    let curr_types = types
        .iter()
        .cycle()
        .skip(if active == 0 {
            types.len() - 1
        } else {
            active - 1
        })
        .take(3)
        .collect::<Vec<_>>();

    let mut draw = |rect: UiRect, t: &BlockType, material: UiMaterial| {
        frame.rect(rect.clone(), material);
        let inset = rect.inset(8);

        let texture = t
            .textures()
            .expect("failed to get texture for item")
            .for_face(&Face::PositiveX);
        let tex_coord = UiRect::new(texture.base(), texture.extend());
        frame.rect_with_tex(inset, tex_coord, UiMaterial::Sprite(*atlas))
    };

    draw(
        UiRect::from_coords(208, 340, 60, 60),
        curr_types[0],
        UiMaterial::DARK,
    );
    draw(
        UiRect::from_coords(260, 320, 80, 80),
        curr_types[1],
        UiMaterial::DARK,
    );
    draw(
        UiRect::from_coords(332, 340, 60, 60),
        curr_types[2],
        UiMaterial::DARK,
    );

    // log!("{:?}", curr_types);
    // const SIZE: u32 = 36;
    // let base = 300 - (1.5 * SIZE as f32) as u32;
}
