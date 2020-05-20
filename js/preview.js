import { evacuate } from '/js/usr/evacuate.js'
import { loadScript, initModel } from '/js/usr/utils.js'
import { getURLParameter, getScene, getPerspectiveCamera, getRender } from '/js/usr/utils.js'
import { textObject } from '/js/usr/text.js'
import { FogObject } from '/js/usr/fog.js'
import { helper } from './usr/helper.js'
import { light } from './usr/light.js'
import { material } from './usr/material.js'
import { initParkModel } from './cfg/park.js'
import { initGdGeneralModel } from './cfg/general_gd.js'

import { wd_config } from './cfg/wanda_dongba.js'
import { wd_zljf } from './cfg/wanda_zljf.js'
import { LineSegmentsGeometry } from '../node_modules/three/examples/jsm/lines/LineSegmentsGeometry.js'
import { LineGeometry } from '../node_modules/three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from '../node_modules/three/examples/jsm/lines/LineMaterial.js'
import { LineSegments2 } from '../node_modules/three/examples/jsm/lines/LineSegments2.js'
import { Line2 } from '../node_modules/three/examples/jsm/lines/Line2.js'
import { pathAnimation } from './usr/path_animation.js'
import { Elevator } from './usr/elevator.js'



var app, viewer, curve;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
BimfaceLoaderConfig.viewToken = getURLParameter('viewToken');

BimfaceSDKLoader.load(BimfaceLoaderConfig, onSDKLoadSucceeded, onSDKLoadFailed);
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
        //雾化颜色
        //viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(204, 224, 255, 1));
        window.viewer = viewer;
        // loadScript("https://static.bimface.com/attach/341bb8bde7bf4a5898ecdf58c2a476fb_TDSLoader.js");
        // loadScript("https://static.bimface.com/attach/eb19d39099ef4cf1b53f333a7066694f_inflate.min.js");
        // loadScript("https://static.bimface.com/attach/9b1a9a0eab054241974a2b1c436921bc_FBXLoader.js");
        // 
        // viewer.render();
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            // helper.createAixsHelper(viewer);
            // // viewer.enableBlinkComponents(true);
            // let scene = getScene(viewer), camera = getPerspectiveCamera(viewer), renderer = getRender(viewer);
            // window.myscene = scene;
            // document.getElementById('open-button').style.display = 'block';
            // viewer.getViewer().rendererManager.renderer.shadowMap.enabled = true;
            // viewer.getViewer().rendererManager.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            // scene.children[0].castShadow = true;
            //scene.traverse(function (child) { if (child.type == 'MeshEx' || child.type == 'Mesh' || true) { child.castShadow = true; child.receiveShadow = true; } }, true);
            viewer.showExclusiveComponentsByObjectData([{ levelName: "B01", specialty: "建筑" }]);



        });
    }
};

function successCallback() {
    // var bimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
    // bimfaceLoaderConfig.viewToken = getURLParameter('viewToken');
    // BimfaceSDKLoader.load(BimfaceLoaderConfig, onSubSDKLoadSucceeded, onSDKLoadFailed);
}

function onSubSDKLoadSucceeded() {
    viewer.showExclusiveComponentsByObjectData([
        { "specialty": "建筑", "levelName": "B01" },
        { "specialty": "建筑", "levelName": "F01" },
        { "specialty": "建筑", "levelName": "F02" },
        { "specialty": "建筑", "levelName": "F03" },
        { "specialty": "建筑", "levelName": "F04" },
        { "specialty": "建筑", "levelName": "F05" },
        { "specialty": "建筑", "levelName": "F06" }],
        function () { console.log("loading") }, loadElevator);
    viewer.render();
}



function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};

function makeLine(scene, camera) {
    var geometry = new THREE.Geometry();
    // for (var j = 0; j < Math.PI; j += 2 * Math.PI / 100) {
    //     var v = new THREE.Vector3(Math.cos(j), Math.sin(j), 0);
    //     geometry.vertices.push(v);
    // }
    // geometry.vertices.push(new THREE.Vector3(-5087 + 15, 27992, 4449));
    // geometry.vertices.push(new THREE.Vector3(-5287 + 15, 33472, -253));
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(-13288.043267634897 / 10000, 18283.86990887209 / 10000, 70.98206523071069 / 10000));



    var line = new MeshLine();
    line.setGeometry(geometry, function (p) { console.log(p); return 2 + Math.sin(50 * p); });
    var option = {
        color: 0x00ff00,
        sizeAttenuation: 0,
        lineWidth: 1,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
        near: camera.near,
        far: camera.far
    };
    var material = new MeshLineMaterial(option);
    var mesh = new THREE.Mesh(line.geometry, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);

    // ---


    var material = new THREE.LineBasicMaterial({
        color: 0xff00ff,
        linewidth: 5
    });

    var points = [];
    points.push(new THREE.Vector3(- 10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));

    var geometry = new THREE.Geometry();
    geometry.vertices.push(points);

    var line = new THREE.Line(geometry, material);
    let layer = new THREE.Layers();
    layer.set(3);
    line.layers = layer;
    console.log(layer.mask)
    scene.add(line);
}

function makeCurveLine(scene) {
    var geometry = new LineGeometry();
    var pointArr = [-100, 0, 0,
    -100, 100, 0,
        0, 0, 0,
        100, 100, 0,
        100, 0, 0,]; geometry.setPositions(pointArr);
    var material = new LineMaterial({
        color: 0xff0000,
        // 线宽度
        linewidth: 5,
    });
    material.resolution.set(window.innerWidth, window.innerHeight);
    var line = new THREE.Mesh(geometry, material);

    scene.add(line);

}

function traverse(scene) {

    scene.traverse((obj) => {
        console.log("===>  " + obj.type);
        if (obj.type === "MeshEx") {
            //console.log(obj);
            if (obj.material instanceof Array) {
                obj.material[0].color.set(0xff1100);
                obj.material[0].opacity = 0.55;
                obj.material[0].transparent = true;
            }
            else {
                obj.material.color.set(0x00ff00);
            }

        }
    }, true);
}

function loadElevator() {
    viewer.setCameraStatus({
        "name": "persp",
        "position": {
            "x": -3174.4283102839795,
            "y": -12507.162627065214,
            "z": 15696.314411543794
        },
        "target": {
            "x": -1536966.8155806973,
            "y": 2250766.6650343672,
            "z": -313852.917396662
        },
        "up": {
            "x": -0.06713655419659409,
            "y": 0.09906334325213187,
            "z": 0.9928137474442615
        },
        "fov": 45,
        "version": 1
    }, () => {
        //[571759]电梯轿厢包围盒
        let max = { x: -8820.9755859375, y: 32028.869079589844, z: 2600.0000000000045 };
        let min = { x: -10050.9755859375, y: 31013.869140625, z: 0 };
        let pos = { x: (max.x + min.x) / 2, y: (max.y + min.y) / 2, z: (max.z + min.z) / 2 };
        var elevator = new Elevator(viewer, "el", pos, 0, 1, 571759);
        elevator.build();

        //[571758]电梯轿厢包围盒
        let max2 = { x: -11420.9765625, y: 32028.869079589844, z: 2600.0000000000045 };
        let min2 = { x: -12650.9765625, y: 31013.869140625, z: 0 };
        let pos2 = { x: (max2.x + min2.x) / 2, y: (max2.y + min2.y) / 2, z: (max2.z + min2.z) / 2 };
        var elevator2 = new Elevator(viewer, "el2", pos2, 0, 1, 571758);
        elevator2.build();


        //[581194]电梯轿厢包围盒
        let max3 = { x: -35242.54302978515, y: 22197.302734375004, z: 2600.0000000000045 };
        let min3 = { x: -36257.54470825195, y: 20967.302734375, z: 0 };
        let pos3 = { x: (max3.x + min3.x) / 2, y: (max3.y + min3.y) / 2, z: (max3.z + min3.z) / 2 };
        var elevator3 = new Elevator(viewer, "el3", pos3, 1, 1, 581194);
        elevator3.build();

        //[581193]电梯轿厢包围盒
        let max4 = { x: -35242.54302978515, y: 24797.302734375004, z: 2600.0000000000045 };
        let min4 = { x: -36257.54470825195, y: 23567.302734375, z: 0 };
        let pos4 = { x: (max4.x + min4.x) / 2, y: (max4.y + min4.y) / 2, z: (max4.z + min4.z) / 2 };
        var elevator4 = new Elevator(viewer, "el4", pos4, 1, 1, 581193);
        elevator4.build();
    });
}