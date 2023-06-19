use glam;

use crate::{
    input::{EventListener, InputEvent, InputState, Key},
    world::WOLD_SIZE,
};

pub const UP: glam::Vec3 = glam::const_vec3!([0.0, 1.0, 0.0]);
pub struct Camera {
    pub(crate) pos: glam::Vec3,
    pub(crate) dir: glam::Vec3,
    size: (i32, i32),
    yaw: f32,
    pitch: f32,

    recompute_dir: bool,

    pub(crate) projection_view: glam::Mat4,
}

impl Camera {
    const SPEED: f32 = 7.568;
    const MOUSE_SENSITIVITY: f32 = 0.432;

    pub fn move_dir(&self, key: &Key) -> glam::Vec3 {
        match key {
            Key::W => glam::vec3(self.dir.x, 0.0, self.dir.z).normalize(),
            Key::A => UP.cross(self.move_dir(&Key::W)),
            Key::S => -1.0 * self.move_dir(&Key::W),
            Key::D => -1.0 * self.move_dir(&Key::A),
            Key::Space => UP,
            Key::LShift => -UP,
            _ => glam::Vec3::ZERO,
        }
    }

    pub fn new(size: (i32, i32)) -> Self {
        let base = WOLD_SIZE as f32 / 2.0;
        let mut c = Camera {
            pos: glam::vec3(base, 16.0, base),
            dir: glam::vec3(0.0, 0.0, -1.0),
            size,
            yaw: 0.0,
            pitch: 0.0,

            recompute_dir: true,

            projection_view: glam::Mat4::IDENTITY,
        };

        c.calc_matrix();
        c
    }

    fn calc_matrix(&mut self) {
        let projection = glam::Mat4::perspective_rh_gl(
            45.0f32.to_radians(),
            self.size.0 as f32 / self.size.1 as f32,
            0.1,
            100.0,
        );
        let view = glam::Mat4::look_at_rh(self.pos, self.pos + self.dir, UP);
        self.projection_view = projection * view
    }

    pub fn resize(&mut self, size: (i32, i32)) {
        self.size = size;
        self.calc_matrix();
    }

    pub fn update(&mut self, dt: f32, input: &InputState) {
        let mut recompute_matrix = false;

        for pressed in input.pressed_keys() {
            recompute_matrix = true;
            self.pos += dt * Self::SPEED * self.move_dir(pressed);
        }

        if self.recompute_dir {
            let pitch = self.pitch.to_radians();
            let yaw = self.yaw.to_radians();
            let xz_l = pitch.cos();
            self.dir = glam::vec3(xz_l * yaw.cos(), pitch.sin(), xz_l * yaw.sin());
            self.recompute_dir = false;
            recompute_matrix = true;
        }

        if recompute_matrix {
            self.calc_matrix()
        }
    }
}

impl EventListener for Camera {
    fn handle(&mut self, event: InputEvent) {
        if let InputEvent::MouseMoved(dx, dy) = event {
            // Compute new dir
            self.yaw += Self::MOUSE_SENSITIVITY * dx as f32;
            self.pitch -= Self::MOUSE_SENSITIVITY * dy as f32;
            self.pitch = self.pitch.clamp(-89.9, 89.9);

            self.recompute_dir = true;
        }
    }
}
