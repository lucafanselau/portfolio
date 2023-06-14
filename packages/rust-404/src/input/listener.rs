use super::InputEvent;

pub trait EventListener {
    fn handle(&mut self, event: InputEvent);
}
