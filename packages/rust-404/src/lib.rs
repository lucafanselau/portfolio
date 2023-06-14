#![feature(const_fn_floating_point_arithmetic)]

#[macro_use]
mod utils;
pub mod atlas;
mod game;
pub mod input;
mod render;
mod world;

pub use game::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
