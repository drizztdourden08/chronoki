/* @layer bridge-wasm @kind data */
const BLUR_V_FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_radius;

void main() {
  vec2 texel = vec2(0.0, 1.0 / u_resolution.y);
  vec4 sum = vec4(0.0);
  float totalWeight = 0.0;

  for (float i = -20.0; i <= 20.0; i += 1.0) {
    float offset = i * u_radius / 20.0;
    float weight = exp(-0.5 * (i / 8.0) * (i / 8.0));
    sum += texture2D(u_texture, v_uv + texel * offset) * weight;
    totalWeight += weight;
  }

  gl_FragColor = sum / totalWeight;
}
`;

export { BLUR_V_FRAG };
