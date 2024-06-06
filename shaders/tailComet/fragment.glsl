uniform float globalOpacity; 

varying vec3 vColor;
varying float vAlpha;
varying float vOpacity;  

void main() {
    vec2 coord = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(coord);

    if (dist > 0.5) discard;

    float gradient = smoothstep(0.2, 0.5, dist);

    vec4 color = vec4(vColor, vAlpha * vOpacity * globalOpacity);
    gl_FragColor = color * (1.0 - gradient);
}
