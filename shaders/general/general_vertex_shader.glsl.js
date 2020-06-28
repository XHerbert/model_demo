export default /*glsl*/`
    uniform float time;
    uniform float size;
    varying vec3 iPosition;

    void main(){ 
        iPosition = position;           
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
`;