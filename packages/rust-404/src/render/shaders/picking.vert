#version 300 es

#define CHUNK_SIZE 16.0

in vec3 position;
layout(location = 3) in vec3 base_loc;

uniform mat4 view_projection;
uniform vec3 object_position;

flat out uvec4 pass_color;

void main() {

     uint local_x = uint(base_loc.x);
     uint local_y = uint(base_loc.y);
     uint local_z = uint(base_loc.z);

     
     uint chunk_x = uint(object_position.x);
     uint chunk_y = uint(object_position.z); 

     pass_color = uvec4((local_x << 16) | (local_y << 0), (local_z << 16), chunk_x, chunk_y);
    gl_Position = view_projection * vec4(object_position + position.xyz, 1.0f);
}