/**
 * @author:xuhongbo
 * @function:shop sapce split and combine
 */

import { WebUtils } from '../usr/WebUtils.js'
import { ModelHelper } from '../usr/ModelHelper.js'
import { RoomUtils } from '../usr/RoomUtils.js'
import { MathLibrary } from '../usr/MathLibrary.js';
// import { DragControls } from '../../node_modules/_three@0.115.0@three/examples/jsm/controls/DragControls.js'
// import { TransformControls } from '../../node_modules/_three@0.115.0@three/examples/jsm/controls/TransformControls.js'

var app, viewer, maxX, maxY, minX, minY, objects = [], pointCollection = [];
const SINGLE_FILE = 0;
const vertical = 1;
const horizontal = 2;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
var math = new MathLibrary();

webUtils.getViewtoken(1650575476384896, SINGLE_FILE).then((token) => {
    BimfaceLoaderConfig.viewToken = token;
    BimfaceSDKLoader.load(BimfaceLoaderConfig, onSDKLoadSucceeded, onSDKLoadFailed);
});


function onSDKLoadSucceeded(viewMetaData) {
    if (viewMetaData.viewType == "3DView") {
        var view = document.getElementById('view');
        var config = new Glodon.Bimface.Application.WebApplication3DConfig();
        config.domElement = view;
        app = new Glodon.Bimface.Application.WebApplication3D(config);
        viewer = app.getViewer();
        viewer.setCameraAnimation(true);
        app.addView(BimfaceLoaderConfig.viewToken);
        viewer.setBorderLineEnabled(false);
        window.bim = {};

        window.viewer = viewer;
        webUtils.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            let helper = new ModelHelper(viewer);

            helper.createAixsHelper(viewer);
            let scene = webUtils.getScene(), camera = webUtils.getPerspectiveCamera(), renderer = webUtils.getRender();
            renderer.domElement.addClass('canvasClass');
            window.scene = scene;
            renderer.shadowMap.enabled = true;
            viewer.enableShadow(false);
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);

            //基础设置
            viewer.hideViewHouse();
            document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
            document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
            document.getElementById('open-button').style.display = 'block';

            //创建房间
            pointCollection = [];
            var roomUtils = new RoomUtils(viewer);

            let leftArea = { "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999873737, "x": 38506.136268202223 }, { "z": 0.0, "y": 99.99999999985306, "x": 44906.136268202215 }], [{ "z": 0.0, "y": 99.99999999985306, "x": 44906.136268202215 }, { "z": 0.0, "y": 8899.9999999998527, "x": 44906.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998527, "x": 44906.136268202237 }, { "z": 0.0, "y": 8899.9999999998672, "x": 41006.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998672, "x": 41006.136268202237 }, { "z": 0.0, "y": 8899.9999999998745, "x": 38506.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998745, "x": 38506.136268202237 }, { "z": 0.0, "y": 99.999999999873737, "x": 38506.136268202223 }]]] };
            let rightArea = { "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999895067, "x": 31906.136268202226 }, { "z": 0.0, "y": 99.999999999874376, "x": 38306.13626820223 }], [{ "z": 0.0, "y": 99.999999999874376, "x": 38306.13626820223 }, { "z": 0.0, "y": 8899.9999999998745, "x": 38306.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998745, "x": 38306.136268202237 }, { "z": 0.0, "y": 8899.9999999998963, "x": 31906.136268202241 }], [{ "z": 0.0, "y": 8899.9999999998963, "x": 31906.136268202241 }, { "z": 0.0, "y": 99.999999999894968, "x": 31906.136268202226 }]]] };
            let areaList = [];
            areaList.push(leftArea);
            areaList.push(rightArea);
            roomUtils.mergeBoundaryPipeline(areaList);

            viewer.createRoom({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 8899.9999999999982, "x": 100.00000000001437 }, { "z": 0.0, "y": 99.99999999999784, "x": 100.00000000000017 }], [{ "z": 0.0, "y": 99.99999999999784, "x": 100.00000000000017 }, { "z": 0.0, "y": 99.999999999977135, "x": 6506.1362682022218 }], [{ "z": 0.0, "y": 99.999999999977135, "x": 6506.1362682022218 }, { "z": 0.0, "y": 8899.9999999999764, "x": 6506.1362682022354 }], [{ "z": 0.0, "y": 8899.9999999999764, "x": 6506.1362682022354 }, { "z": 0.0, "y": 8899.9999999999873, "x": 3606.1362682022323 }], [{ "z": 0.0, "y": 8899.9999999999873, "x": 3606.1362682022323 }, { "z": 0.0, "y": 8899.9999999999982, "x": 100.00000000001462 }]]] }, 3300, "1151511");
            viewer.createRoom({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999976481, "x": 6706.1362682022218 }, { "z": 0.0, "y": 99.999999999955818, "x": 13106.136268202223 }], [{ "z": 0.0, "y": 99.999999999955818, "x": 13106.136268202223 }, { "z": 0.0, "y": 8899.9999999999563, "x": 13106.136268202239 }], [{ "z": 0.0, "y": 8899.9999999999563, "x": 13106.136268202239 }, { "z": 0.0, "y": 8899.9999999999764, "x": 6706.1362682022354 }], [{ "z": 0.0, "y": 8899.9999999999764, "x": 6706.1362682022354 }, { "z": 0.0, "y": 99.999999999977263, "x": 6706.1362682022218 }]]] }, 3300, "vdfvf");
            viewer.createRoom({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999955165, "x": 13306.136268202221 }, { "z": 0.0, "y": 99.999999999934474, "x": 19706.136268202226 }], [{ "z": 0.0, "y": 99.999999999934474, "x": 19706.136268202226 }, { "z": 0.0, "y": 8899.9999999999345, "x": 19706.136268202241 }], [{ "z": 0.0, "y": 8899.9999999999345, "x": 19706.136268202241 }, { "z": 0.0, "y": 8899.9999999999563, "x": 13306.136268202235 }], [{ "z": 0.0, "y": 8899.9999999999563, "x": 13306.136268202235 }, { "z": 0.0, "y": 99.9999999999556, "x": 13306.136268202221 }]]] }, 3300, "ssdsds");
            viewer.render();

            var roomUtils2 = new RoomUtils(viewer);
            let areaLists = [];
            areaLists.push({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 8899.9999999999982, "x": 100.00000000001437 }, { "z": 0.0, "y": 99.99999999999784, "x": 100.00000000000017 }], [{ "z": 0.0, "y": 99.99999999999784, "x": 100.00000000000017 }, { "z": 0.0, "y": 99.999999999977135, "x": 6506.1362682022218 }], [{ "z": 0.0, "y": 99.999999999977135, "x": 6506.1362682022218 }, { "z": 0.0, "y": 8899.9999999999764, "x": 6506.1362682022354 }], [{ "z": 0.0, "y": 8899.9999999999764, "x": 6506.1362682022354 }, { "z": 0.0, "y": 8899.9999999999873, "x": 3606.1362682022323 }], [{ "z": 0.0, "y": 8899.9999999999873, "x": 3606.1362682022323 }, { "z": 0.0, "y": 8899.9999999999982, "x": 100.00000000001462 }]]] });
            areaLists.push({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999976481, "x": 6706.1362682022218 }, { "z": 0.0, "y": 99.999999999955818, "x": 13106.136268202223 }], [{ "z": 0.0, "y": 99.999999999955818, "x": 13106.136268202223 }, { "z": 0.0, "y": 8899.9999999999563, "x": 13106.136268202239 }], [{ "z": 0.0, "y": 8899.9999999999563, "x": 13106.136268202239 }, { "z": 0.0, "y": 8899.9999999999764, "x": 6706.1362682022354 }], [{ "z": 0.0, "y": 8899.9999999999764, "x": 6706.1362682022354 }, { "z": 0.0, "y": 99.999999999977263, "x": 6706.1362682022218 }]]] });
            areaLists.push({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999955165, "x": 13306.136268202221 }, { "z": 0.0, "y": 99.999999999934474, "x": 19706.136268202226 }], [{ "z": 0.0, "y": 99.999999999934474, "x": 19706.136268202226 }, { "z": 0.0, "y": 8899.9999999999345, "x": 19706.136268202241 }], [{ "z": 0.0, "y": 8899.9999999999345, "x": 19706.136268202241 }, { "z": 0.0, "y": 8899.9999999999563, "x": 13306.136268202235 }], [{ "z": 0.0, "y": 8899.9999999999563, "x": 13306.136268202235 }, { "z": 0.0, "y": 99.9999999999556, "x": 13306.136268202221 }]]] });
            roomUtils2.mergeBoundaryPipeline(areaLists);
            viewer.render();

            /**
            //经过验证，bimface平台下不支持构件的拖动，通过算法实现拆分与合并
            document.getElementById('horizon').addEventListener('click', () => {
                let boxGeometry = new THREE.BoxBufferGeometry(1000, 5000, 2500);
                let boxMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
                let box = new THREE.Mesh(boxGeometry, boxMaterial);
                objects.push(box);
                viewer.addExternalObject("box", box);

                var transformControls = new TransformControls(camera, renderer.domElement);
                var dragControls = new DragControls(objects, camera, renderer.domElement);
                scene.add(transformControls);
                // 鼠标略过事件
                dragControls.addEventListener('hoveron', function (event) {
                    // 让变换控件对象和选中的对象绑定
                    transformControls.attach(event.object);
                    console.log("+++");
                });
                // 开始拖拽
                dragControls.addEventListener('dragstart', function (event) {
                    // controls.enabled = false;
                    viewer.enableScale(false);
                    viewer.enableTranslate(false);
                    viewer.enableOrbit(false);
                    event.object.material.emissive.set(0xaaaaaa);
                    console.log("+-+-+");
                });
                // 拖拽结束
                dragControls.addEventListener('dragend', function (event) {
                    // controls.enabled = true;
                    viewer.enableScale(true);
                    viewer.enableTranslate(true);
                    viewer.enableOrbit(true);
                    event.object.material.emissive.set(0x000000);
                    console.log("---");
                });
            });

            document.getElementById('vertial').addEventListener('click', () => {

            });**/

            let pointArray = [];
            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, function (e) {
                if (!e.objectId) return;
                console.log(e);

                if (window.bim.queryCondition) {
                    let condition = viewer.getObjectDataById(e.objectId, (condition) => {
                        console.log("condition", condition);
                    });
                    layer.open({
                        type: 1,
                        area: "500px",
                        title: "筛选条件",
                        skin: 'layui-layer-molv',
                        closeBtn: 1,
                        anim: 5,
                        shade: 0,
                        content: formatHtml(condition),
                    });
                }

                if (window.bim.component) {
                    layer.open({
                        type: 1,
                        area: "500px",
                        title: "构件信息",
                        skin: 'layui-layer-lan',
                        closeBtn: 1,
                        anim: 5,
                        shade: 0,
                        content: formatHtml(e),
                    });
                }


                var temp = {
                    x: e.clientPosition.x,
                    y: e.clientPosition.y
                };
                var worldPos = e.worldPosition;
                var worldPosition = viewer.clientToWorld(temp);

                console.log("temp", temp);
                console.log("worldPosition", worldPosition);

                pointArray.push(new THREE.Vector3(e.worldPosition.x, e.worldPosition.y, e.worldPosition.z));
                if (pointArray.length == 2) {
                    webUtils.drawLine(pointArray);
                    math.resolveEquation(pointArray);
                    pointArray = [];
                }
            });

            //配置相机
            setCamera(viewer, null);
        });
    }
};

function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};


function setCamera(viewer, callback) {
    let start = {
        "name": "persp",
        "position": {
            "x": -19160.77874765213,
            "y": -27160.436944213947,
            "z": 48351.901994318665
        },
        "target": {
            "x": 26441.290265272833,
            "y": 18441.800185267017,
            "z": 2750.0000276237247
        },
        "up": {
            "x": 0,
            "y": -0.0000036732050930154486,
            "z": 0.9999999999932538
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    };

    let target = {
        "name": "persp",
        "position": {
            "x": 50031.246990425294,
            "y": -12343.379487725882,
            "z": 15045.743836760397
        },
        "target": {
            "x": 5982.546590778242,
            "y": 41689.91280856774,
            "z": -22085.9341374516
        },
        "up": {
            "x": -0.2970451696282537,
            "y": 0.36437272858367964,
            "z": 0.8826078868132814
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    };

    viewer.setCameraStatus(start, () => {
        setTimeout(() => {
            viewer.setCameraStatus(target, () => {
                if (callback) {
                    callback();
                };
                viewer.recordCustomedHomeview(target);
            })
        }, 800);
    });
}

function formatHtml(data) {
    return $('#json-renderer').jsonViewer(data);
}
