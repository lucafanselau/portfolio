#version 300 es

precision mediump float;
out vec4 out_color;

uniform sampler2D uSampler;
uniform vec3 light_dir;
uniform vec3 view_pos;
uniform vec4 solid_color;

in vec3 pass_normal;
in vec2 pass_tex;
in vec3 pass_frag_pos;

const vec3 light_color = vec3(1.0);

void main() {
    vec3 color;
    if(solid_color.a > 0.01)
        color = solid_color.xyz;
    else
        color = vec3(texture(uSampler, pass_tex.xy));

    // vec3 light_dir = normalize(light_pos - pass_frag_pos);

    // ambient
    float ambient_strength = 0.4;
    vec3 ambient = ambient_strength * light_color;

    // diffuse 
    float diffuse_strength = 0.6;
    vec3 norm = normalize(pass_normal);
    float diff = max(dot(norm, light_dir), 0.0);
    vec3 diffuse = diffuse_strength * diff * light_color;

    // specular
    float specular_strength = 0.3;
    vec3 view_dir = normalize(view_pos - pass_frag_pos);
    vec3 reflect_dir = reflect(-light_dir, norm);
    float spec = pow(max(dot(view_dir, reflect_dir), 0.0), 2.0);
    vec3 specular = specular_strength * spec * light_color;

    vec3 result = (ambient + diffuse + specular) * color;
    out_color = vec4(result, 1.0);
}
