/* @layer bridge-wasm @kind data */
const MIRROR_FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_gameTexture;
uniform vec2 u_resolution;
uniform float u_blackLeft;
uniform float u_blackRight;
uniform float u_blackBottom;
uniform float u_blackTop;
uniform float u_swizzleBR;

void main() {
  float pixelX = v_uv.x * u_resolution.x;
  float pixelY = v_uv.y * u_resolution.y;

  float leftBound = u_blackLeft * 2.0;
  float rightBound = u_resolution.x - u_blackRight * 2.0;
  float bottomBound = u_resolution.y - u_blackBottom * 2.0;
  float topBound = u_blackTop * 2.0;

  bool inLeft = pixelX < leftBound && u_blackLeft > 0.0;
  bool inRight = pixelX > rightBound && u_blackRight > 0.0;
  bool inBottom = pixelY > bottomBound && u_blackBottom > 0.0;
  bool inTop = pixelY < topBound && u_blackTop > 0.0;

  if (!inLeft && !inRight && !inBottom && !inTop) {
    vec4 c = texture2D(u_gameTexture, v_uv);
    if (u_swizzleBR > 0.5) c = vec4(c.b, c.g, c.r, c.a);
    gl_FragColor = c;
    return;
  }

  vec2 mirrorUV = v_uv;

  if (inLeft) {
    float mirrorX = 2.0 * leftBound - pixelX;
    mirrorUV.x = mirrorX / u_resolution.x;
  } else if (inRight) {
    float mirrorX = 2.0 * rightBound - pixelX;
    mirrorUV.x = mirrorX / u_resolution.x;
  }

  if (inBottom) {
    float mirrorY = 2.0 * bottomBound - pixelY;
    mirrorUV.y = mirrorY / u_resolution.y;
  } else if (inTop) {
    float mirrorY = 2.0 * topBound - pixelY;
    mirrorUV.y = mirrorY / u_resolution.y;
  }

  mirrorUV = clamp(mirrorUV, 0.0, 1.0);
  vec4 c = texture2D(u_gameTexture, mirrorUV);
  if (u_swizzleBR > 0.5) c = vec4(c.b, c.g, c.r, c.a);
  gl_FragColor = c;
}
`;

export { MIRROR_FRAG };
