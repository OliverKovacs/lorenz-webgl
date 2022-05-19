attribute vec4 a_position;

uniform mat4 u_matrix;
uniform vec2 u_resolution;
uniform vec3 u_list;
uniform vec4 u_config;
uniform float u_offset;

varying vec4 color;

#define a_index a_position[3]

#define u_index u_list[0]
#define u_length u_list[1]
#define u_time u_list[2]
#define u_time_speed u_config[0]
#define u_offset_speed u_config[1]
#define u_frequency u_config[2]
#define u_phase u_config[3]

#define PI 3.1415926535897932384626433832795
#define TIME_SPEED 0.0002
#define OFFSET_SPEED 0.002
#define FREQUENCY 0.1

void main() {
    vec4 position = vec4(a_position[0], a_position[1], a_position[2], 1.0);

    float index = a_index * u_frequency * FREQUENCY * 2.0 * PI / u_length;
    float value = index
        + u_time * u_time_speed * TIME_SPEED
        + u_offset * u_offset_speed * OFFSET_SPEED
        + u_phase * PI / 50.0;

    vec3 rgb = vec3(
        (cos(value + 0.0 * PI / 3.0) + 1.0) / 2.0,
        (cos(value + 2.0 * PI / 3.0) + 1.0) / 2.0,
        (cos(value + 4.0 * PI / 3.0) + 1.0) / 2.0
    );

    color = vec4(
        rgb * sqrt(mod((a_index - u_index), u_length) / u_length),
        1.0
    );

    vec4 p = u_matrix * position / vec4(u_resolution, 1000.0, 1.0);
    gl_Position = vec4(p[0], p[1], p[2], 1);
}
