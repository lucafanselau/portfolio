//! This is a dead simple ui implementation that aims to be as simple as possible, while enabling a few nice features
#![allow(dead_code)]

pub type Color = glam::Vec4;

pub trait UiElement {
    fn draw(&self, gl: &glow::Context);
}

/// An UI Node that can contain children
pub struct Div {
    // background: Color,
    children: Vec<Box<dyn UiElement>>,
}

impl UiElement for Div {
    fn draw(&self, gl: &glow::Context) {
        // First draw the div and then the children
        // TODO: Draw background
        for child in self.children.iter() {
            child.draw(gl);
        }
    }
}

pub struct Sprite {
    sprite: glow::Texture,
}
