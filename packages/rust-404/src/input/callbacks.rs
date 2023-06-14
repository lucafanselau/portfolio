use std::borrow::Cow;

use wasm_bindgen::{prelude::*, JsCast};
use web_sys::{EventTarget, KeyboardEvent, MouseEvent};

#[derive(Debug)]
pub struct KeyboardCallback {
    closure: Closure<dyn FnMut(KeyboardEvent)>,
    target: EventTarget,
    event: Cow<'static, str>,
}

impl KeyboardCallback {
    pub fn new<F>(
        target: &EventTarget,
        event: impl Into<Cow<'static, str>>,
        cb: F,
    ) -> anyhow::Result<Self>
    where
        F: FnMut(KeyboardEvent) + 'static,
    {
        let target = target.clone();
        let event = event.into();
        let closure = Closure::wrap(Box::new(cb) as Box<dyn FnMut(KeyboardEvent)>);
        target
            .add_event_listener_with_callback(&event, closure.as_ref().unchecked_ref())
            .map_err(|e| {
                anyhow::anyhow!("failed to add event callback for event: {}: {:?}", event, e)
            })?;
        Ok(Self {
            closure,
            target,
            event,
        })
    }
}

impl Drop for KeyboardCallback {
    fn drop(&mut self) {
        self.target
            .remove_event_listener_with_callback(&self.event, self.closure.as_ref().unchecked_ref())
            .map_err(|e| {
                anyhow::anyhow!(
                    "failed to remove event callback for event: {}: {:?}",
                    self.event,
                    e
                )
            })
            .unwrap();
    }
}

#[derive(Debug)]
pub struct MouseCallback {
    closure: Closure<dyn FnMut(MouseEvent)>,
    target: EventTarget,
    event: Cow<'static, str>,
}

impl MouseCallback {
    pub fn new<F>(
        target: &EventTarget,
        event: impl Into<Cow<'static, str>>,
        cb: F,
    ) -> anyhow::Result<Self>
    where
        F: FnMut(MouseEvent) + 'static,
    {
        let target = target.clone();
        let event = event.into();
        let closure = Closure::wrap(Box::new(cb) as Box<dyn FnMut(MouseEvent)>);
        target
            .add_event_listener_with_callback(&event, closure.as_ref().unchecked_ref())
            .map_err(|e| {
                anyhow::anyhow!("failed to add event callback for event: {}: {:?}", event, e)
            })?;
        Ok(Self {
            closure,
            target,
            event,
        })
    }
}

impl Drop for MouseCallback {
    fn drop(&mut self) {
        self.target
            .remove_event_listener_with_callback(&self.event, self.closure.as_ref().unchecked_ref())
            .map_err(|e| {
                anyhow::anyhow!(
                    "failed to remove event callback for event: {}: {:?}",
                    self.event,
                    e
                )
            })
            .unwrap();
    }
}
