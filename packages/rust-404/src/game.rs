use super::utils;
use crate::input::ControlFlow;
use crate::input::InputManager;
use crate::input::InputState;
use crate::render::camera::Camera;
use crate::render::camera::UP;
use crate::render::mesh::build_selection_ring;
use crate::render::ui;
use std::cell::RefCell;
use std::rc::Rc;

use crate::render::Material;

use crate::render::*;
use crate::world::World;

use glow::Texture;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

use web_sys::WebGl2RenderingContext;

#[wasm_bindgen]
pub struct Game {
    camera: Camera,
    input: InputManager,
    input_state: InputState,
    renderer: Rc<RefCell<Renderer>>,

    
    world: World,

    // Rendering Stuff
    light_dir: glam::Vec3,
    // UI Stuff
    selection_ring: Mesh,
    crosshair: Texture,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(catch)]
    pub async fn new() -> Result<Game, JsValue> {
        utils::set_panic_hook();

        let window = web_sys::window().unwrap();
        let document = window.document().unwrap();
        let canvas = document.get_element_by_id("canvas").unwrap();
        let canvas: web_sys::HtmlCanvasElement =
            canvas.dyn_into::<web_sys::HtmlCanvasElement>().unwrap();


        let size = (canvas.width() as i32, canvas.height() as i32);
        
        let context = canvas
            .get_context("webgl2")?
            .ok_or("missing context")?
            .dyn_into::<WebGl2RenderingContext>()?;

        // TODO: This is only a valid function for the wasm32 target (catch that, w/o rust-analyzer sucking hard)
        let context = glow::Context::from_webgl2_context(context);

        let input = InputManager::new(&*window.document().ok_or("missing document")?)
            .map_err(|e| e.to_string())?; // ..expect("failed to create input manager");
        let camera = Camera::new(size);

        let renderer = Rc::new(
            RefCell::new(Renderer::new(context, size).await.map_err(|e| e.to_string())?) // .expect("failed to create renderer"),)
        );

        // let vertices = cube(glam::Vec3::splat(1.0));

        let selection_ring = renderer.borrow()
            .create_mesh(&build_selection_ring())
            .expect("failed to create selection ring mesh");

        let crosshair = renderer.borrow()
            .load_texture("crosshair.png")
            .await
            .expect("failed to create crosshair texture");

        let world = World::new(renderer.clone());

        Ok(Self {
            input,
            input_state: Default::default(),
            camera,
            renderer,

            world,

            light_dir: glam::Vec3::ZERO,

            selection_ring,
            crosshair,
        })
    }

    pub fn update(&mut self, dt: f32, total: f32) -> bool {
        // Update the input
        if self.input.update(
            &mut self.input_state,
            &mut [&mut self.camera, &mut self.world],
        ) == ControlFlow::Break
        {
            return true;
        }

        // log!("Got dt: {}", dt);
        self.camera.update(dt, &self.input_state);

        // Update sun position
        let axis = UP;
        self.light_dir = (glam::Mat3::from_axis_angle(axis, total / 10.0) * glam::Vec3::X
            + glam::vec3(0.0, 1.0, 0.0))
        .normalize();
        return false;
    }


    pub fn resize(&mut self, width: i32, height: i32) {
        let size = (width, height);
        self.renderer.borrow_mut().resize(size);
        self.camera.resize(size);
       }

    pub fn render(&mut self) {
        let renderer = self.renderer.borrow();
        let (mut task, mut frame) = renderer.start_frame();
        self.world.render(&mut task);

        // Pick with the chunks
        let picked = renderer.pick(&task, &self.camera);
        if let Some((focused, face)) = &picked {
            // -> if we currently pick a block, add a selection ring
            let normal = face.normal();
            let transform = glam::Mat4::from_translation(focused.clone() + 0.5 * normal);
            let transform =
                transform * glam::Mat4::from_axis_angle(UP.cross(normal), UP.angle_between(normal));
            task.push_with_transform_and_material(
                &self.selection_ring,
                transform,
                Material::Solid(glam::vec4(0.7, 0.7, 0.7, 1.0)),
            )
        }

        // Draw some ui at the end
        {
            let (width, height) = renderer.get_size();
            
            frame.rect(



                
                
                       UiRect::from_center((width / 2) as _, (height /2) as _, 20, 20),
            UiMaterial::Sprite(self.crosshair),
        );
            }

        ui::inventory(
            &mut frame,
            renderer.get_size(),
                 &self.world.types,
            &self.world.active_type,
            &renderer.get_atlas(),
        );

        renderer
            .render(task, frame, &self.camera, &self.light_dir);

        // Update the world with the last picked
        self.world.last_picked = picked;
    }
}

impl Drop for Game {
    fn drop(&mut self) {
        unsafe {
            // This is safe, since it is called inside of the drop function
            self.renderer.borrow().destroy_mesh_ref(&self.selection_ring);
        }
    }
}
