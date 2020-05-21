import { evacuate } from '../usr/evacuate.js'
import { loadScript, initModel } from '../usr/utils.js'
import { getURLParameter, getViewtoken, getScene, getPerspectiveCamera, getRender } from '../usr/utils.js'
import { textObject } from '../usr/text.js'
import { FogObject } from '../usr/fog.js'
import { helper } from '../usr/helper.js'
import { light } from '../usr/light.js'
import { material } from '../usr/material.js'
import { initParkModel } from '../cfg/park.js'
import { initGdGeneralModel } from '../cfg/general_gd.js'

import { wd_config } from '../cfg/wanda_dongba.js'
import { wd_zljf } from '../cfg/wanda_zljf.js'
import { pathAnimation } from '../usr/path_animation.js'
import { Elevator } from '../usr/elevator.js'



var app, viewer;
const INTEGRATION_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
getViewtoken(1868625060216672, INTEGRATION_FILE).then((token) => {
    BimfaceLoaderConfig.viewToken = token;
    BimfaceSDKLoader.load(BimfaceLoaderConfig, onSDKLoadSucceeded, onSDKLoadFailed);
});

function onSDKLoadSucceeded(viewMetaData) {
    if (viewMetaData.viewType == "3DView") {
        var view = document.getElementById('view');
        var config = new Glodon.Bimface.Application.WebApplication3DConfig();
        config.domElement = view;
        var eventManager = Glodon.Bimface.Application.WebApplication3DEvent;
        app = new Glodon.Bimface.Application.WebApplication3D(config);
        viewer = app.getViewer();
        viewer.setCameraAnimation(true);
        //CLOUD.EnumRendererType.IncrementRender = true;
        app.addView(BimfaceLoaderConfig.viewToken);
        ///viewer.addModel(viewMetaData);//该方法加入的模型不能渲染烘焙
        //viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(105, 105, 105, 1), new Glodon.Web.Graphics.Color(105, 10, 105, 0.5));
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1), new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 0.5));
        viewer.setBorderLineEnabled(false);
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(7, 1, 18, 1));
        viewer.hideViewHouse();
        window.viewer = viewer;

        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            helper.createAixsHelper(viewer);
            // viewer.enableBlinkComponents(true);
            let scene = getScene(viewer), camera = getPerspectiveCamera(viewer), renderer = getRender(viewer);
            window.myscene = scene;
            document.getElementById('open-button').style.display = 'block';
            viewer.getViewer().rendererManager.renderer.shadowMap.enabled = true;
            viewer.getViewer().rendererManager.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            addComponents();
            overrideComponents();
            setupPointsCloud();
            setupCameraAnimation();


        });
    }
};

//通过GUI控制灯光参数
var gui = new dat.GUI();
var colors = gui.addFolder("ColorParameters");
var whiteHousePosition = gui.addFolder("whiteHousePosition");
// 配置Data-GUI
var myControls;
myControls = new function () {
    this.distance = 1500;
    this.wallColor = [48, 46, 177]
    this.backgroundColor = [28, 45, 55];
    this.floorColor = [9, 46, 81];

    this.whiteHouseX = -50000;
    this.whiteHouseY = 10000;
};


function addComponents() {

    // 创建承载底板
    let planeGeometry = new THREE.PlaneGeometry(800000, 800000);
    let planeMaterial = new THREE.MeshLambertMaterial({ color: 0x092E58, transparent: true, opacity: 1.0, side: THREE.DoubleSide });
    let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    // 如果接收阴影效果，底板需要单独处理
    planeMesh.receiveShadow = true;
    planeMesh.position.set(200000, 200000, -5000);

    // 创建平面网格辅助
    let gridHelper = new THREE.GridHelper(400000, 40);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.set(100000, 100000, -4900);

    viewer.addExternalObject("plane", planeMesh);
    // viewer.addExternalObject("gridHelper", gridHelper);
    viewer.render();
};


function overrideComponents() {
    viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2000011" }, { "categoryId": "-2000170" }], new Glodon.Web.Graphics.Color(48, 46, 177, 1));

    let changeWallColor = () => {
        viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2000011" }, { "categoryId": "-2000170" }], new Glodon.Web.Graphics.Color(myControls.wallColor[0], myControls.wallColor[1], myControls.wallColor[2], 1));
        viewer.render();
    };

    let changeBgColor = () => {
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(myControls.backgroundColor[0], myControls.backgroundColor[1], myControls.backgroundColor[2], 1));
        viewer.render();
    };


    colors.addColor(myControls, 'backgroundColor').onChange(changeBgColor);
    colors.addColor(myControls, 'wallColor').onChange(changeWallColor);


};

function setupPointsCloud() {
    let geometry = new THREE.BufferGeometry();
    let positions = [];
    let colors = [];
    let pointColor = new THREE.Color();
    let n = 1920, n2 = n / 4;

    var texture = new THREE.TextureLoader().load("../../images/star.png");
    var pointsMaterial = new THREE.PointsMaterial(
        {
            size: 3,
            sizeAttenuation: true,
            map: texture,
            vertexColors: THREE.VertexColors,
            transparent: true,
            opacity: 0.7,
            depthWrite: false,
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusSrcAlphaFactor
        });

    for (let j = 0; j < 5500; j++) {
        // 点
        let x = Math.random() * n - n2;
        let y = Math.random() * n - n2;
        let z = Math.random() * n - n2;

        positions.push(x, y, z);

        // 颜色
        let vx = (x / n) + 0.3;
        let vy = (y / n) + 0.3;
        let vz = (z / n) + 0.3;
        // let vx = 1.0;
        // let vy = 1.0;
        // let vz = 1.0;

        pointColor.setRGB(vx, vy, vz);
        colors.push(pointColor.r, pointColor.g, pointColor.b);

    }
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    let points = new THREE.Points(geometry, pointsMaterial);
    getScene(viewer).add(points);
    // viewer.addExternalObject("points", points);
};

function setupWhiteHouses() {
    let ratio = 2
    let height = 18000;
    let boxGeometry = new THREE.BoxBufferGeometry(5000 * ratio, 5000 * ratio, height * ratio);
    let boxMaterial = new THREE.MeshLambertMaterial({ color: 0x1B1946, transparent: true, opacity: 0.55 });
    let boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    let edges = new THREE.EdgesHelper(boxMesh, 0x2449A6);
    let unitWhiteHouse = new THREE.Group();
    unitWhiteHouse.add(boxMesh);
    unitWhiteHouse.add(edges);

    let interval = 150;
    let cloneMesh = null;
    let index = 0;


    let changeWhitehouse = () => {
        viewer.getExternalComponentManager().setTransform('index0', { x: myControls.whiteHouseX, y: myControls.whiteHouseY, z: (height * ratio + 10) });
        viewer.render();
    }
    whiteHousePosition.add(myControls, 'whiteHouseX', -10000, 20000).onChange(changeWhitehouse);
    whiteHousePosition.add(myControls, 'whiteHouseY', 0, 20000).onChange(changeWhitehouse);

    let whiteHouseGroup = new THREE.Group();
    //TODO:划定范围，随机宽高度
    for (let g = 0; g < 10; g++) {
        cloneMesh = unitWhiteHouse.clone();
        cloneMesh.position.set(Math.random() * 1000000, Math.random() * 1000000, (height * ratio) / 2 - 5000);
        whiteHouseGroup.add(cloneMesh);
        index++;
    }
    viewer.addExternalObject("whiteHouseGroup", whiteHouseGroup);
    viewer.render();

    //用于动态递增效果
    // let id = setInterval(() => {
    //     cloneMesh = unitWhiteHouse.clone();
    //     cloneMesh.position.set(myControls.whiteHouseX, myControls.whiteHouseY, (height * ratio) / 2 * (index + 1) - 5000);
    //     viewer.addExternalObject("index" + index, cloneMesh);
    //     viewer.render();
    //     index++;
    //     if (index >= 1) {
    //         clearInterval(id);
    //     }
    // }, interval);
};

function setupCameraAnimation() {
    let start = {
        "name": "persp",
        "position": {
            "x": 97453.0197917097,
            "y": -338623.23033853434,
            "z": 204649.9843120962
        },
        "target": {
            "x": 97453.00276979106,
            "y": 130620.81137323385,
            "z": 19063.456096175596
        },
        "up": {
            "x": -1.3341470586563286e-8,
            "y": 0.36778132687924164,
            "z": 0.929912305327198
        },
        "fov": 45,
        "version": 1
    };
    let target = {
        "name": "persp",
        "position": {
            "x": 99020.39664100873,
            "y": -142832.3617884503,
            "z": 87136.00327163817
        },
        "target": {
            "x": 109877.61724960494,
            "y": 331046.838803767,
            "z": -85933.20608485528
        },
        "up": {
            "x": 0.007856064638586022,
            "y": 0.34288546847153273,
            "z": 0.9393443659060567
        },
        "fov": 45,
        "version": 1
    };
    viewer.setCameraStatus(start, () => {
        setTimeout(() => {

        }, viewer.setCameraStatus(target, () => {
            setupWhiteHouses();
        }), 1000);
    })
};


// function setupSpotLight() {

//     myscene.children[0].traverseVisible(function (obj) {
//         if (obj instanceof THREE.Mesh && obj.visible == true) {
//             obj.castShadow = true;
//             obj.receiveShadow = true;
//         }
//     });

//     let spotLight = light.createSpotLight(0xffffff, 2.5, 10000, Math.PI / 3, 0.65, 0.54);
//     let spotHelper = new THREE.SpotLightHelper(spotLight);
//     //TODO:灯光位置需要根据报警设备进行计算
//     //spotLight.position.set(-12234.669891357422, 26111.396484375, 7309.98787689209);

//     // 根据报警设备计算出聚光灯位置
//     let base = 2000;
//     let alarmPos = { x: -13309.474801123268, y: 22771.806640624985, z: 3009.999755859375 };
//     spotLight.position.set(alarmPos.x + base * 0, alarmPos.y + base * 0.5, alarmPos.z + base * 2);
//     let targetObject = new THREE.Object3D();
//     // targetObject.position.set(-13721.8359375, 20874.232421875, 0);
//     targetObject.position.set(alarmPos.x, alarmPos.y, alarmPos.z * 0);
//     viewer.addExternalObject("targetObject", targetObject);
//     spotLight.target = targetObject;
//     spotLight.castShadow = true;
//     viewer.addExternalObject("spotLight", spotLight);
//     // viewer.addExternalObject("spotHelper", spotHelper);


//     //通过GUI控制灯光参数
//     var gui = new dat.GUI();

//     // 配置Data-GUI
//     var myControls;
//     myControls = new function () {
//         this.spotPX = alarmPos.x + base * 0;
//         this.spotPY = alarmPos.y + base * 0.5;
//         this.spotPZ = alarmPos.z + base * 2;
//         this.distance = 1500;

//         // this.backgroundColor = [28, 45, 55];
//         // this.floorColor = [9, 46, 81];
//     };


//     var setPosition = function () {
//         viewer.getExternalComponentManager().setTransform("spotLight", { x: myControls.spotPX, y: myControls.spotPY, z: myControls.spotPZ });
//         viewer.render();
//     };

//     var setParameters = function () {
//         spotLight.distance = myControls.distance;
//         viewer.render();
//     };

//     var spotPosition = gui.addFolder("SpotLightPosition");
//     spotPosition.add(myControls, 'spotPX', 0, 80000).onChange(setPosition);
//     spotPosition.add(myControls, 'spotPY', 0, 80000).onChange(setPosition);
//     spotPosition.add(myControls, 'spotPZ', 0, 80000).onChange(setPosition);

//     var spotParameters = gui.addFolder("SpotLightParameters");
//     spotParameters.add(myControls, 'distance', 0, 50000).onChange(setParameters);
// }

function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};