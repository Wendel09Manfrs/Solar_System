varying vec2 vUv;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}


void main() {
  float distanceToCenter = length(vUv - 0.5);

  float strength = remap(distanceToCenter, 0.2, 0.5, 1.0, 0.0);

  strength = smoothstep(0.0, 1.0, strength);
  gl_FragColor = vec4(vec3(strength), 1.0);
}
