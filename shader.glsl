precision highp float;
uniform vec2 resolution;
uniform vec2 mousePos;
uniform float zoom;
uniform int steps;

#define TWO_PI      6.2831853
#define QUARTER_PI  0.7853981
#define EIGHT_PI    0.3926990

#define MAX_STEPS   1000

// Square a complex number
vec2 cSquare(vec2 a) {
  return vec2(
    a.x * a.x - a.y * a.y,
    2.0 * (a.x * a.y)
  );
}

vec2 z(vec2 c) {
  vec2 current = vec2(0.0, 0.0);

  for (int i = 0; i < MAX_STEPS; i++) {
    if (i > steps) break;
    current = cSquare(current) + c;
  }

  return current;
}

vec3 getColor(vec2 p) {
  float x = log(length(z(p)));

  return vec3(
    1.0 - abs(sin(x)),
    1.0 - abs(sin(x + EIGHT_PI)),
    1.0 - abs(sin(x + QUARTER_PI))
  );
}

void main() {
  vec2 pos = gl_FragCoord.xy / resolution.y;
  pos.x -= (resolution.x / resolution.y) / 2.0;
  pos.y -= 0.5;

  vec3 color = getColor(pos / zoom + mousePos);

  gl_FragColor = vec4(color, 1.0);
 }