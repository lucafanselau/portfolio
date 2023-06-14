#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Key {
    W,
    A,
    S,
    D,
    Q,
    E,
    Escape,
    Space,
    LShift,
}

impl Key {
    pub fn from_keycode(key: u32) -> Option<Self> {
        match key {
            87 => Some(Key::W),
            65 => Some(Key::A),
            83 => Some(Key::S),
            68 => Some(Key::D),
            69 => Some(Key::E),
            81 => Some(Key::Q),
            27 => Some(Key::Escape),
            32 => Some(Key::Space),
            16 => Some(Key::LShift),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Copy)]
pub enum Button {
    Primary,
    Secondary,
    Middle,
}

impl Button {
    pub fn from_code(code: i16) -> Option<Self> {
        // FROM: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        match code {
            0 => Some(Self::Primary),
            1 => Some(Self::Middle),
            2 => Some(Self::Secondary),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, Copy)]
pub enum InputEvent {
    KeyDown(Key),
    KeyUp(Key),
    MouseClicked(Button),
    MouseScrolled,
    MouseMoved(i32, i32),
}
