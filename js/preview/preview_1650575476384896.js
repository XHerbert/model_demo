/**
 * @author:xuhongbo
 * @function:shop sapce split and combine
 */

import { WebUtils } from '../usr/WebUtils.js'
import { ModelHelper } from '../usr/ModelHelper.js'
import { DragControls } from '../../node_modules/_three@0.115.0@three/examples/jsm/controls/DragControls.js'
import { TransformControls } from '../../node_modules/_three@0.115.0@three/examples/jsm/controls/TransformControls.js'

var app, viewer, maxX, maxY, minX, minY, objects = [], pointCollection = [];
const SINGLE_FILE = 0;
const vertical = 1;
const horizontal = 2;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();

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
            viewer.createRoom(cleanBoundaryData({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999873737, "x": 38506.136268202223 }, { "z": 0.0, "y": 99.99999999985306, "x": 44906.136268202215 }], [{ "z": 0.0, "y": 99.99999999985306, "x": 44906.136268202215 }, { "z": 0.0, "y": 8899.9999999998527, "x": 44906.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998527, "x": 44906.136268202237 }, { "z": 0.0, "y": 8899.9999999998672, "x": 41006.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998672, "x": 41006.136268202237 }, { "z": 0.0, "y": 8899.9999999998745, "x": 38506.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998745, "x": 38506.136268202237 }, { "z": 0.0, "y": 99.999999999873737, "x": 38506.136268202223 }]]] })
                , 5500, 5500, new Glodon.Web.Graphics.Color('#ff0000', 0.25), new Glodon.Web.Graphics.Color('#ff0000'));

            viewer.createRoom(cleanBoundaryData({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999895067, "x": 31906.136268202226 }, { "z": 0.0, "y": 99.999999999874376, "x": 38306.13626820223 }], [{ "z": 0.0, "y": 99.999999999874376, "x": 38306.13626820223 }, { "z": 0.0, "y": 8899.9999999998745, "x": 38306.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998745, "x": 38306.136268202237 }, { "z": 0.0, "y": 8899.9999999998963, "x": 31906.136268202241 }], [{ "z": 0.0, "y": 8899.9999999998963, "x": 31906.136268202241 }, { "z": 0.0, "y": 99.999999999894968, "x": 31906.136268202226 }]]] })
                , 5500, 5550, new Glodon.Web.Graphics.Color('#ff0000', 0.25), new Glodon.Web.Graphics.Color('#ff0000'));

            //合并
            //viewer.createRoom({ version: "2.0", loops: [[[{ z: 0, y: 100, x: 44906 }, { z: 0, y: 8900, x: 44906 }], [{ z: 0, y: 8900, x: 44906 }, { z: 0, y: 8900, x: 31906 }], [{ z: 0, y: 8900, x: 31906 }, { z: 0, y: 100, x: 31906 }], [{ z: 0, y: 100, x: 31906 }, { z: 0, y: 100, x: 44906 }]]] },
            //  6500, 6500, new Glodon.Web.Graphics.Color('#ffff00', 0.25), new Glodon.Web.Graphics.Color('#ffff00'));
            viewer.createRoom({ "version": "2.0", "loops": [[[{ z: 0, y: 8900, x: 44906 }, { z: 0, y: 100, x: 44906 }], [{ z: 0, y: 100, x: 44906 }, { z: 0, y: 100, x: 31906 }], [{ z: 0, y: 100, x: 31906 }, { z: 0, y: 8900, x: 31906 }], [{ z: 0, y: 8900, x: 31906 }, { z: 0, y: 8900, x: 44906 }]]] },
                6500, 6500, new Glodon.Web.Graphics.Color('#ffff00', 0.25), new Glodon.Web.Graphics.Color('#ffff00'));


            viewer.render();

            console.log(pointCollection);
            buildBoundaryPoint(pointCollection);
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

            });

            //配置相机
            setCamera(viewer, null);
        });
    }
};

function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};


//处理边界数据，小数部分四舍五入
function cleanBoundaryData(data) {
    for (let m = 0, len = data.loops[0].length; m < len; m++) {
        let root = data.loops[0];
        for (let n = 0, sublen = root[m].length; n < sublen; n++) {
            let sub = root[m];

            //对数据进行简化
            sub[n].x = Math.round(sub[n].x);
            sub[n].y = Math.round(sub[n].y);
            sub[n].z = Math.round(sub[n].z);
        }
    }

    let points = storePointArray(data);
    console.log(points);
    console.log(data);
    return data;
}

//将处理后的点位数据依次存储到数组
function storePointArray(data) {
    let pointArray = [];
    for (let m = 0, len = data.loops[0].length; m < len; m++) {
        let root = data.loops[0];
        for (let n = 0, sublen = root[m].length; n < sublen; n++) {
            let sub = root[m];

            //依次存储边界点数据
            pointArray.push(sub[n]);

        }
    }
    pointCollection = pointCollection.concat(pointArray);
    validatePointData(pointArray);
    return pointArray;
}

//验证点位数组的逻辑合法性，是否首尾相接，如果不是则进行数据纠错
function validatePointData(pointArray) {
    let len = pointArray.length;
    let result = true;
    for (let i = 1; i < len; i += 2) {
        //如果是最后一个点
        if (i >= len - 1) {
            let first = pointArray[0];
            let last = pointArray[len - 1];
            if (!isObjectEqual(first, last)) {
                console.warn("数据未闭合");
                result = false;
            }
        } else {
            let before = pointArray[i];
            let after = pointArray[i + 1];
            if (!isObjectEqual(before, after)) {
                console.warn("数据未闭合");
                result = false;
            }
        }
    }
    console.warn("result", result);
    return result;
}

//计算极值点，移除中间点，构造新的空间边界
function buildBoundaryPoint(pointCollection, direction) {
    let leftPoint = [];
    let resultPoint = [];
    direction = vertical;
    minX = maxX = pointCollection[0].x;
    minY = maxY = pointCollection[0].y;
    for (let n = 1, len = pointCollection.length; n < len; n++) {
        pointCollection[n].x > maxX ? maxX = pointCollection[n].x : null;
        pointCollection[n].x < minX ? minX = pointCollection[n].x : null;
        pointCollection[n].y > maxY ? maxY = pointCollection[n].y : null;
        pointCollection[n].y < minY ? minY = pointCollection[n].y : null;
    }
    console.log("minX", minX);
    console.log("minY", minY);
    console.log("maxX", maxX);
    console.log("maxY", maxY);

    for (let k = 0, len = pointCollection.length; k < len; k++) {
        let currentPoint = pointCollection[k];
        if (direction === vertical) {
            if (!(currentPoint.x > minX && currentPoint.x < maxX)) {
                let exist = leftPoint.some(item => {
                    if (item.x == currentPoint.x && item.y == currentPoint.y) {
                        return true;
                    }
                    return false;
                })

                if (!exist) {
                    leftPoint.push(currentPoint);
                }

            } else {
                console.log("分割方向：纵向");
            }
        }
        if (direction === horizontal) {
            if (!(currentPoint.y > minY && currentPoint.y < maxY)) {
                leftPoint.push(currentPoint);
                console.log("分割方向：横向");
            }
        }
    }
    console.log("leftPoint", leftPoint);
    //对符合条件的点集进行顺时针排序，思路是找到最大和最小占1、3索引，剩余的两个点随机
    orderPointList(leftPoint);

}

//为坐标点进行排序（顺时针或逆时针），构造符合边界的数组数据
function orderPointList(pointList) {
    let copy = Object.assign([], pointList);
    console.log(copy);
    copy.forEach(item => {
        if (item.x === maxX && item.y === maxY) {
            pointList[0] = item;
        }
        if (item.x === minX && item.y === minY) {
            pointList[2] = item;
        }
        if (item.x === maxX && item.y === minY) {
            pointList[1] = item;
        }
        if (item.x === minX && item.y === maxY) {
            pointList[3] = item;
        }
    });
    console.log("order point", pointList);
    //TODO:排序完成后开始构造新的边界数据

}

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

//比较对象值是否相等
function isObjectEqual(obj1, obj2) {
    var props1 = Object.getOwnPropertyNames(obj1);
    var props2 = Object.getOwnPropertyNames(obj2);
    if (props1.length != props2.length) {
        return false;
    }
    for (var i = 0, max = props1.length; i < max; i++) {
        var propName = props1[i];
        if (obj1[propName] !== obj2[propName]) {
            return false;
        }
    }
    return true;
}

