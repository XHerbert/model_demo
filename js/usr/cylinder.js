/**
 * @author xuhbd
 * @function cylinder animation
 */

import { ModelShaderChunk } from '../../shaders/common/ModelShaderChunk.js'

var scene = null;
var camera = null;
var mesh = null;
var controls = null;
var renderer = null;
var axesHelper = null;
var width = window.innerWidth;
var height = window.innerHeight;


let initScene = () => {
    axesHelper = new THREE.AxisHelper(100);
    scene = new THREE.Scene();
    //scene.add(axesHelper);
};

let initCamera = () => {
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 100, 0);
    camera.lookAt(0, 0, 0);
};

let initRenderer = () => {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xD1BEBE);
    document.body.appendChild(renderer.domElement);
};


let initLight = () => {
    var light = new THREE.DirectionalLight(0x695DEE);
    light.position.set(100, 0, 10);
    scene.add(light);

};

let uniform = {
    u_height: 20.0,
    u_time: 0.0,
    u_color: {
        value: new THREE.Vector3(0.23, 0.54, 0.11)
    }
}

let initGeometry = () => {
    var cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xEE2F5F, transparent: true, side: THREE.DoubleSide, wireframe: false, depthTest: false });
    var cylinderShaderMaterial = new THREE.ShaderMaterial({
        vertexShader: ModelShaderChunk.gradient_box_vertex_shader,
        fragmentShader: ModelShaderChunk.gradient_box_fragment_shader,
        uniforms: uniform,
        side: THREE.DoubleSide,
        transparent: true,
        wireframe: false,
        depthTest: false
    });
    window["mt"] = cylinderShaderMaterial;
    var cylinderGeometry = new THREE.CylinderGeometry(10, 10, 20, 100, 100, true, 0, Math.PI * 2.0);
    mesh = new THREE.Mesh(cylinderGeometry, cylinderShaderMaterial);
    mesh.position.y = 10;
    scene.add(mesh);
};

var rollTexture;
let initPlaneGeometry = () => {

    var gridHelper = new THREE.GridHelper(400, 100, 0xffffff, 0xff0000);
    scene.add(gridHelper);
}

let initControl = () => {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // 使用阻尼,指定是否有惯性
    controls.enableDamping = true;
    // 动态阻尼系数 就是鼠标拖拽旋转灵敏度，阻尼越小越灵敏
    controls.dampingFactor = 0.05;
    // 是否可以缩放
    controls.enableZoom = true;
    //是否自动旋转
    controls.autoRotate = false;
    //设置相机距离原点的最近距离
    controls.minDistance = 10;
    //设置相机距离原点的最远距离
    controls.maxDistance = 600;
    //是否开启右键拖拽
    controls.enablePan = true;
};

let scale = 1.000;
let render = () => {
    //mesh.scale.x += scale;
    //mesh.scale.z += scale;
    uniform.u_time += 0.01;
    scale += 0.01;
    mesh.scale.set(scale, 1, scale);
    mesh.material.opacity -= 0.01;
    if (mesh.material.opacity <= 0) {
        //如果Mesh消失，还原Mesh
        scale = 1.0;
        mesh.scale.set(scale, scale, scale);
        mesh.material.opacity = 1.0;
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};
let init = () => {
    window.onresize = onWindowResize;

    initScene();
    initCamera();
    initRenderer();
    initLight();
    initGeometry();
    initPlaneGeometry();
    initControl();
    render();
};


let onWindowResize = () => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
}

init();
