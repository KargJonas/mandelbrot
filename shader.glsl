precision mediump float;
uniform vec2 resolution;
uniform vec2 mousePos;
uniform float zoom;

#define TWO_PI     6.2831853
#define QUARTER_PI 0.7853981
#define EIGHT_PI   0.3926990

#define MAX_STEPS  30

struct Complex {
  float r;
  float i;
};

Complex cMult(Complex a, Complex b) {
  return Complex(
    a.r * b.r - a.i * b.i,
    a.r * b.i + b.r * a.i
  );
}

Complex cAdd(Complex a, Complex b) {
  return Complex(
    a.r + b.r,
    a.i + b.i
  );
}

float cDist(Complex a, Complex b) {
  return sqrt(
    pow(a.r - b.r, 2.0) +
    pow(a.i - b.i, 2.0)
  );
}

Complex z(Complex c) {
  Complex current = Complex(0.0, 0.0);

  for (int i = 0; i < MAX_STEPS; i++) {
    current = cAdd(cMult(current, current), c);
  }

  return current;
}

vec3 getColor(Complex p) {
  Complex center = Complex(0.0, 0.0);
  float x = log(cDist(z(p), center)) * TWO_PI;

  return vec3(
    1.0 - abs(sin(x)),
    1.0 - abs(sin(x + EIGHT_PI)),
    1.0 - abs(sin(x + QUARTER_PI))
  );
}

void main() {
  vec2 pos = gl_FragCoord.xy / resolution.y;
  // pos = pos * 2.0 - 1.0;
  pos = pos - 0.5;

  vec3 color = getColor(Complex((pos.x + mousePos.x) / zoom, (pos.y + mousePos.y) / zoom));
  gl_FragColor = vec4(color, 1.0);
 }