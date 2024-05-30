uniform float uTime;
uniform sampler2D uGradientTexture;
uniform sampler2D uNoisesTexture;

varying vec2 vUv;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

void main() {
  float noise1 = texture(uNoisesTexture, vUv - uTime * 1.0).r;
  float noise2 = texture(uNoisesTexture, vUv - uTime * 0.8).g;
  float noise3 = texture(uNoisesTexture, vUv - uTime * 0.6).b;
  float noise4 = texture(uNoisesTexture, vUv - uTime * 0.4).a;
  vec4 noiseVector = vec4(noise1, noise2, noise3, noise4);
  float noiseLength = length(noiseVector);

  float distanceToCenter = length(vUv - vec2(0.5, 0.5));
  float outerFalloff = remap(distanceToCenter, 0.2, 0.5, 1.0, 0.0);
  float innerFalloff = remap(distanceToCenter, 0.0, 0.1, 0.0, 1.0);
  float falloff = min(outerFalloff, innerFalloff);
  falloff = smoothstep(0.0, 1.0, falloff);

  vec2 uv = vUv;
  uv.y += noiseLength * 0.4;
  uv.y *= falloff;

  vec4 color = texture(uGradientTexture, uv);
  color.a *= falloff;  
  gl_FragColor = color;
}
