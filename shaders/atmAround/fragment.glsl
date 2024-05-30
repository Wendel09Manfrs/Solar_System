uniform vec3 color1;
uniform vec3 color2;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(vViewPosition);
    float dotProduct = max(dot(normal, lightDir), 0.0);
    float alpha = pow(dotProduct, 4.0);

    vec3 finalColor = mix(color1, color2, alpha);

    gl_FragColor = vec4(finalColor, alpha);
}
