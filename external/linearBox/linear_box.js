/**
 * @author xuhbd
 * @function plane animation
 */

var scene = null;
var camera = null;
var mesh = null;
var controls = null;
var renderer = null;
var axesHelper = null;
var width = window.innerWidth;
var height = window.innerHeight;

var uniforms = {
    time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2() },
    u_height: { value: 250.0 }
}


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
    renderer.domElement.addEventListener('click', callback);
};

callback = (event) => {
    console.log(JSON.stringify(event));
}

initLight = () => {
    var light = new THREE.DirectionalLight(0x695DEE);
    light.position.set(100, 0, 10);
    scene.add(light);

};

initGeometry = () => {
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
    var boxGeometry = new THREE.BoxGeometry(10, 10, 250);
    var boxMaterial = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('vertex').textContent,
        fragmentShader: document.getElementById('fragment').textContent,
        uniforms: uniforms,
        transparent: true,
        side: THREE.DoubleSide
    });
    mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    console.log(uniforms.u_resolution);
    scene.add(mesh);
};

var rollTexture;
initPlaneGeometry = () => {

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

initControl = () => {
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
render = () => {

    // mesh.position.x += 0.01;
    // rollTexture.offset.x -= 0.01;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    //window.requestAnimationFrame(render.bind(this));
};
init = () => {
    window.onresize = onWindowResize;

    initScene();
    initCamera();
    initRenderer();
    initLight();
    initGeometry();
    //initPlaneGeometry();
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
