uniform float time;
attribute vec3 color;
attribute vec4 shift;
attribute float sizes;
attribute float randomValue;

varying vec3 vColor;
varying float vAlpha;
varying float vRandomValue;

void main() {
    float distance = length((modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_PointSize = sizes * (300.0 / distance);

    vec3 transformed = position;
    float t = time;
    float moveT = mod(shift.x + shift.z * t, 6.28);
    float moveS = mod(shift.y + shift.z * t, 6.28);
    transformed += vec3(cos(moveS) * sin(moveT), cos(moveT), sin(moveT) * sin(moveS)) * shift.w;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);

    vColor = color;
    vAlpha = 1.0;
    vRandomValue = randomValue;
}
