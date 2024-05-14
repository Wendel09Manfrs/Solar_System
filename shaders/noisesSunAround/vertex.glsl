varying vec3 vNormal;
varying vec3 vViewPosition;
void main(){
    vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    vNormal=normalize(normalMatrix*normal);
    vViewPosition=-mvPosition.xyz;
    gl_Position=projectionMatrix*mvPosition;
}