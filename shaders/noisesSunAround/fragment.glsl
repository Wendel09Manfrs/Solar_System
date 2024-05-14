varying vec3 vNormal;
varying vec3 vViewPosition;
void main(){
    vec3 normal=normalize(vNormal);
    vec3 lightDir=normalize(vViewPosition);
    float dotProduct=max(dot(normal,lightDir),0.);
    float alpha=pow(dotProduct,4.);
    
    vec3 yellowColor=vec3(1.,1.,0.);
    vec3 orangeColor=vec3(.9,.25,0.);
    
    vec3 finalColor=mix(yellowColor,orangeColor,alpha);
    
    gl_FragColor=vec4(finalColor,alpha);
}