#version 300 es

#define CHUNK_SIZE 16.0

in vec3 position;
layout(location = 3) in vec3 base_loc;

uniform mat4 view_projection;

out vec3 pass_color;

void main() {
    pass_color = (1.0f / (CHUNK_SIZE - 1.0)) * base_loc;
    gl_Position = view_projection * vec4(position.xyz, 1.0f);
}