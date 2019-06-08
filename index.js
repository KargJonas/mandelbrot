let p = document.querySelector("input"); let c = document.querySelector("canvas"); let g = c.getContext("webgl") || c.getContext("experimental-webgl"); let s = g.createProgram(); let e = addEventListener; let z = 0.3;

let w = 0;
let h = 0;

class V {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  s(other) {
    return new V(
      this.x - other.x,
      this.y - other.y
    );
  }

  a(other) {
    return new V(
      this.x + other.x,
      this.y + other.y
    );
  }

  d(factor) {
    return new V(
      this.x / factor,
      this.y / factor
    );
  }

  c() {
    return new V(
      this.x,
      this.y
    );
  }
}

class M {
  constructor() {
    this.p = new V(0, 0);
    this.l = new V(0, 0);
    this.d = 0;

    e("mousedown", (e) => this.down(e));
    e("mouseup", ()=>this.up());
    e("mousemove", (e) => this.move(e));
  }

  down(e) {
    this.d = 1;
    this.l = new V(
      1 - e.clientX / w,
      e.clientY / h
    );
  }

  up() {
    this.d = 0;
  }

  move(e) {
    if (this.d){b();const C = new V(1-e.clientX/w,e.clientY/h);let D = C.s(this.l);this.p = this.p.a(D.d(z));this.p = this.p.a(D.d(z));this.l = C.c();}}}function b(){w=innerWidth;h=innerHeight;c.width=w;c.height=h;let u=(...a)=>g.getUniformLocation(...a);g.uniform1f(u(s,"h"),h);g.uniform2f(u(s,"m"),m.p.x,m.p.y);g.uniform1f(u(s,"o"),z);g.uniform1i(u(s,"s"),p.value*p.value);g.viewport(0,0,w,h);}let m=new M();e("mousewheel",v=>{z*=v.wheelDelta<0?.95:1.05;b()});e("resize",b);p.addEventListener("change",b);function u(){g.drawArrays(5,0,4);requestAnimationFrame(u)}function G(y,t){const S=g.createShader(y);g.shaderSource(S,t);g.compileShader(S);g.attachShader(s,S);}G(35633,`attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`);G(35632,`precision mediump float;uniform float h;uniform vec2 m;uniform float o;uniform int s;vec2 z(vec2 c){vec2 n=vec2(0.,0.);for(int i=0;i<3600;i++){if(i>s)break;n=vec2(n.x*n.x-n.y*n.y,2.*(n.x*n.y))+c;}return n;}vec3 g(vec2 p){float x=log(length(z(p)));return vec3(abs(sin(x)),abs(sin(x+.39)),abs(sin(x+.78)));}void main(){vec2 p=gl_FragCoord.xy/h;p-=.5;float x=log(length(z(p/o+m)));vec3 c=vec3(abs(sin(x)),abs(sin(x+.39)),abs(sin(x+.78)));gl_FragColor=vec4(c,1.);}`);g.linkProgram(s);g.useProgram(s);g.bindBuffer(34962,g.createBuffer());g.bufferData(34962,new Float32Array([-1,-1,-1,1,1,-1,1,1]),35044);g.vertexAttribPointer(0,2,5126,0,0,0);g.enableVertexAttribArray(0);g.viewport(0,0,w,h);b();u();