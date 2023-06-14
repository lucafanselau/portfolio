#version 300 es

uniform mat4 view_projection;
uniform mat4 model;

in vec3 position;
in vec3 norm;
in vec2 tex_coord;

out vec3 pass_normal;
out vec2 pass_tex;
out vec3 pass_frag_pos;

void main() {
    gl_Position = view_projection * model * vec4(position.xyz, 1.0);

    pass_normal = mat3(transpose(inverse(model))) * norm;
    pass_tex = tex_coord;
    pass_frag_pos = vec3(model * vec4(position.xyz, 1.0));
}