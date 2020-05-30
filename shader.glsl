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
  float dori; // Distance from origin
  int _steps = steps;

  for (int i = 0; i < MAX_STEPS; i++) {
    if (i > _steps) break;
    current = cSquare(current) + c;
    dori = length(current);

    if (dori > 3.0) {
      _steps /= 2;
      // _steps /= log(10, steps);
      // current /= (dori / 6.0);
    }
  }

  return current;
}

vec3 getColor(vec2 p) {
  float x = log(length(z(p)));

  if (x <= 1.0) {
    return vec3(0.0);
  }

  // return vec3(1.0);

  return vec3(
    1.0 - abs(sin(x * 0.05)),
    1.0 - abs(sin(x * 0.05 + EIGHT_PI)),
    1.0 - abs(sin(x * 0.05 + QUARTER_PI))
  );
}

void main() {
  vec2 pos = gl_FragCoord.xy / resolution.y;
  pos.x -= (resolution.x / resolution.y) / 2.0;
  pos.y -= 0.5;

  vec3 color = getColor(pos / zoom + mousePos);

  gl_FragColor = vec4(color, 1.0);
 }