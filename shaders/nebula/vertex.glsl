attribute vec3 color;
attribute float sizes;
attribute float randomValue;

varying vec3 vColor;
varying float vAlpha;
varying float vRandomValue;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = sizes * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vColor = color;
    vAlpha = 1.0; 
    vRandomValue = randomValue;
}
