/**
 * @author xuhbd
 * @function light box animation
 */

var scene = null;
var camera = null;
var mesh = null;
var controls = null;
var renderer = null;
var axesHelper = null;
var width = window.innerWidth;
var height = window.innerHeight;
var pointLight;


initScene = () => {
    axesHelper = new THREE.AxisHelper(100);
    scene = new THREE.Scene();
    scene.add(axesHelper);
};

initCamera = () => {
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);
};

initRenderer = () => {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xD1BEBE);
    document.body.appendChild(renderer.domElement);
};


initLight = () => {
    // var light = new THREE.DirectionalLight(0x695DEE);
    var light = new THREE.DirectionalLight(0xeeeeee);
    light.position.set(100, 100, 100);

    let sphereSize = 1;
    pointLight = new THREE.PointLight(0xff0000, 2, 100, 1);
    pointLight.position.set(0, 0, 50);


    var pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    // scene.add(pointLightHelper);
    // scene.add(light);
    scene.add(pointLight);
    window.myscene = scene;

};

initGeometry = () => {
    var boxMaterial = new THREE.MeshLambertMaterial({
        transparent: true,
        wireframe: false,
        color: 0xffffff,
        opacity: 0.5
    });

    var boxGeometry = new THREE.BoxGeometry(40, 40, 40);
    mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(mesh);
};


initControl = () => {
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
let dir = 1;
render = () => {

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    //window.requestAnimationFrame(render.bind(this));
    pointLight.position.y += 0.5 * dir;
    if (pointLight.position.y >= 60) {
        dir = -1;
    }
    if (pointLight.position.y <= 0) {
        dir = 1;
    }

};
init = () => {
    window.onresize = onWindowResize;

    initScene();
    initCamera();
    initRenderer();
    initLight();
    initGeometry();
    // initPlaneGeometry();
    initControl();
    render();
};


onWindowResize = () => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
}

init();
