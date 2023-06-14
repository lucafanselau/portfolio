use std::collections::HashMap;

use super::Key;

pub struct InputState {
    pub(super) keys: HashMap<Key, bool>,
}

impl InputState {
    pub fn new() -> Self {
        Self {
            keys: Default::default(),
        }
    }

    pub fn is_pressed(&self, key: &Key) -> bool {
        self.keys.get(key).cloned().unwrap_or(false)
    }

    pub fn pressed_keys(&self) -> impl Iterator<Item = &'_ Key> + '_ {
        self.keys
            .iter()
            .filter_map(|(k, pressed)| pressed.then(|| k))
    }
}

impl Default for InputState {
    fn default() -> Self {
        Self::new()
    }
}
