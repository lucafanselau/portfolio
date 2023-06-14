#version 300 es

uniform mat4 view_projection;

in vec2 position;
in vec2 tex_coord;

out vec2 pass_tex;

void main() {
    gl_Position = view_projection * vec4(position.xy, 0.0, 1.0);
    pass_tex = tex_coord;
}