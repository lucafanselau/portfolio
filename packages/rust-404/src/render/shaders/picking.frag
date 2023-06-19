#version 300 es

precision mediump float;
out uvec4 out_color;

flat in uvec4 pass_color;

void main() {
    out_color = pass_color;
}
