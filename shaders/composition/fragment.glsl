uniform float uTime;
uniform sampler2D uDefaultTexture;
uniform sampler2D uDistortionTexture;
uniform vec2 uConvergencePosition;

varying vec2 vUv;


void main() {
  float distortionStrength = texture(uDistortionTexture, vUv).r;
  vec2 toConvergence = uConvergencePosition - vUv;
  vec2 distoredUv = vUv + toConvergence * distortionStrength;

  float r = texture(uDefaultTexture, distoredUv).r;
  float g = texture(uDefaultTexture, distoredUv).g;
  float b = texture(uDefaultTexture, distoredUv).b;
  vec4 color = vec4(r, g, b, 1.0);
  gl_FragColor = color;
}
