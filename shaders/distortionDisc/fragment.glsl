uniform float angle; 

varying vec2 vUv;

float inverseLerp(float v, float minValue, float maxValue) {
    return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
    float t = inverseLerp(v, inMin, inMax);
    return mix(outMin, outMax, t);
}

void main() {
    vec2 center = vec2(0.5, 0.5); 
    float distanceToCenter = length(vUv - center);

    float s = sin(radians(angle));
    float c = cos(radians(angle));
    mat2 rotationMatrix = mat2(c, -s, s, c);
    vec2 rotatedUV = rotationMatrix * (vUv - center) + center;

    float strength = remap(distance(rotatedUV, center), 0.2 / 3.0, 0.5 / 3.0, 1.0, 0.0);
    strength = smoothstep(0.0, 1.0, strength);

    float alpha = remap(distance(rotatedUV, center), 0.4, 0.5, 1.0, 0.0);
    alpha = smoothstep(0.0, 1.0, alpha);

    if (rotatedUV.x < 0.5) {
        gl_FragColor = vec4(vec3(strength), alpha);
    } else {
        discard;
    }
}
