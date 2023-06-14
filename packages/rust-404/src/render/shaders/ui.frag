#version 300 es

precision mediump float;
out vec4 out_color;

in vec2 pass_tex;

uniform vec4 color;
uniform sampler2D t;

void main() {
    if(color.a < 0.01) {
        vec4 sampled = texture(t, pass_tex);
        if (sampled.a < 0.01) discard;
        out_color = sampled;
    } else {
        out_color = color;
    }
}
