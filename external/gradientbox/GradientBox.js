/**
 * @author xuhbd
 * @function gradient box for white house
 */

import { MathLibrary } from '../../js/usr/MathLibrary.js'
import { ModelShaderChunk } from '../../shaders/common/ModelShaderChunk.js'

var scene = null;
var camera = null;
var mesh = null;
var controls = null;
var renderer = null;
var axesHelper = null;
var width = window.innerWidth;
var height = window.innerHeight;

var uniforms = {
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2() },
    u_height: { value: 0.0 },
    u_color: { value: new THREE.Vector3() }
}


let initScene = () => {
    axesHelper = new THREE.AxisHelper(1000);
    scene = new THREE.Scene();
    scene.add(axesHelper);
};

let initCamera = () => {
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 1000, 1000);
    camera.lookAt(0, 0, 0);
};

let initRenderer = () => {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xD1BEBE);
    document.body.appendChild(renderer.domElement);
    renderer.domElement.addEventListener('click', callback);
};

let callback = (event) => {

    let pointX = event.clientX;
    let pointY = event.clientY;
    let point = new THREE.Vector2(pointX, pointY);

    let math = new MathLibrary();
    let width = math.getRandomInt(10, 500);
    let height = math.getRandomInt(10, 500);
    let depth = math.getRandomInt(10, 1000);
    uniforms.u_height.value = depth;
    let size = new THREE.Vector3(width, height, depth);

    let mesh_position = math.getLocalPosition(event, camera);
    let x = math.getRandomInt(10, 500);
    let y = math.getRandomInt(10, 500);
    console.log(mesh_position);
    let z = 0;

    uniforms.u_color.value.x = 0.75;
    uniforms.u_color.value.y = 0.22;
    uniforms.u_color.value.z = 0.11;
    //let position = new THREE.Vector3(mesh_position.x, mesh_position.y, z);
    let position = new THREE.Vector3(x, y, z);
    initGeometry(size, position);
}

let initLight = () => {
    var light = new THREE.DirectionalLight(0x695DEE);
    light.position.set(100, 0, 10);
    scene.add(light);

};

let initGeometry = (size, position) => {
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
    // var boxGeometry = new THREE.BoxGeometry(10, 2, 25);
    !size && size.set(10, 2, 25);
    !position && position.set(0, 0, 0);
    var boxGeometry = new THREE.BoxGeometry(size.x || 10, size.y || 2, size.z || 25);
    var boxMaterial = new THREE.ShaderMaterial({
        vertexShader: ModelShaderChunk.gradient_box_vertex_shader,
        fragmentShader: ModelShaderChunk.gradient_box_fragment_shader,
        uniforms: uniforms,
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: false
    });
    mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    position && mesh.position.set(position.x, position.y, position.z);
    scene.add(mesh);
};

var rollTexture;
let initPlaneGeometry = () => {

    // 依靠移动材质的offset属性实现动画
    var rollMat = new THREE.MeshBasicMaterial();
    rollTexture = new THREE.TextureLoader().load('../images/icon_arrow_right_pow.png', function (map) {
        rollMat.map = map;
        rollMat.wireframe = false;
        rollMat.needsUpdate = true;
        rollMat.transparent = true;
        rollMat.side = THREE.DoubleSide;
    });
    rollTexture.wrapS = THREE.RepeatWrapping;
    rollTexture.wrapT = THREE.RepeatWrapping;
    rollTexture.repeat.x = 10;

    var planeGeometry2 = new THREE.PlaneGeometry(100, 5, 100, 20);
    var planeGeometry3 = new THREE.PlaneGeometry(100, 5, 100, 20);

    var obj2 = new THREE.Mesh(planeGeometry2, rollMat);
    obj2.position.set(0, 0, 0);
    obj2.translateX(50);

    var obj3 = new THREE.Mesh(planeGeometry3, rollMat);
    obj3.position.set(50, 50, 0);
    obj3.rotation.z = Math.PI / 2;

    scene.add(obj2);
    scene.add(obj3);
}

let initControl = () => {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // 使用阻尼,指定是否有惯性
    controls.enableDamping = true;
    // 动态阻尼系数 就是鼠标拖拽旋转灵敏度，阻尼越小越灵敏
    controls.dampingFactor = 0.25;
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
let render = () => {

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    uniforms.u_time.value += 0.05;
};
let init = () => {
    window.onresize = onWindowResize;

    initScene();
    initCamera();
    initRenderer();
    initLight();
    // initGeometry();
    //initPlaneGeometry();
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
