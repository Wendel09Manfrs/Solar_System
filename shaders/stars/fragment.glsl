uniform sampler2D particleTexture;
uniform float opacity;

varying vec3 vColor;
varying float vAlpha;

void main() {
    vec4 textureColor = texture2D(particleTexture, gl_PointCoord);

    if (textureColor.a < 0.1) discard;

    vec3 opaqueColor = textureColor.rgb * textureColor.a;

    gl_FragColor = vec4(vColor * opaqueColor, textureColor.a * vAlpha * opacity); 
}
