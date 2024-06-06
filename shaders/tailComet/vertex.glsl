attribute vec3 color;
attribute float sizes;
attribute float opacity; 

varying vec3 vColor;
varying float vAlpha;
varying float vOpacity;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = sizes * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vColor = color;
    vAlpha = 1.0;
    vOpacity = opacity; 
}
