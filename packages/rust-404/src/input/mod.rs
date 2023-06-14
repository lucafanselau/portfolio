pub mod callbacks;
pub mod event;
pub mod listener;
pub mod state;

pub use callbacks::*;
pub use event::*;
pub use listener::*;
pub use state::*;

use web_sys::EventTarget;

use std::sync::mpsc::{channel, Receiver};

#[derive(Debug, PartialEq, Eq)]
pub enum ControlFlow {
    Break,
    Continue,
}

pub struct InputManager {
    receiver: Receiver<InputEvent>,
    _keyboard: Vec<KeyboardCallback>,
    _mouse: Vec<MouseCallback>,
}

impl InputManager {
    pub fn new(target: &EventTarget) -> anyhow::Result<Self> {
        let (sender, receiver) = channel();
        let mut keyboard = Vec::new();
        let mut mouse = Vec::new();

        // Keyboard events
        {
            let sender = sender.clone();
            keyboard.push(KeyboardCallback::new(target, "keydown", move |event| {
                if let Some(key) = Key::from_keycode(event.key_code()) {
                    sender
                        .send(InputEvent::KeyDown(key))
                        .expect("failed to send KeyDown event");
                }
            })?);
        }
        {
            let sender = sender.clone();
            keyboard.push(KeyboardCallback::new(target, "keyup", move |event| {
                if let Some(key) = Key::from_keycode(event.key_code()) {
                    sender
                        .send(InputEvent::KeyUp(key))
                        .expect("failed to send KeyUp event");
                }
            })?);
        }

        // Mouse events
        {
            let sender = sender.clone();
            mouse.push(MouseCallback::new(target, "mousemove", move |event| {
                sender
                    .send(InputEvent::MouseMoved(
                        event.movement_x(),
                        event.movement_y(),
                    ))
                    .expect("failed to send MouseMoved event");
            })?);
        }
        {
            let sender = sender.clone();
            mouse.push(MouseCallback::new(target, "mousedown", move |event| {
                if let Some(button) = Button::from_code(event.button()) {
                    sender
                        .send(InputEvent::MouseClicked(button))
                        .expect("failed to send MouseClicked");
                }
            })?);
        }

        Ok(Self {
            receiver,
            _keyboard: keyboard,
            _mouse: mouse,
        })
    }

    fn poll(&self) -> impl Iterator<Item = InputEvent> + '_ {
        self.receiver.try_iter()
    }

    pub fn update(
        &self,
        state: &mut InputState,
        listeners: &mut [&mut dyn EventListener],
    ) -> ControlFlow {
        for event in self.poll() {
            match event {
                InputEvent::KeyDown(key) => {
                    match key {
                        Key::Escape => return ControlFlow::Break,
                        _ => {}
                    }
                    state.keys.insert(key, true);
                }
                InputEvent::KeyUp(key) => {
                    state.keys.insert(key, false);
                }
                _ => (),
            }
            for listener in listeners.into_iter() {
                listener.handle(event);
            }
        }
        return ControlFlow::Continue;
    }
}
