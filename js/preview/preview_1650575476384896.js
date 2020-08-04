/**
 * @author:xuhongbo
 * @function:shop sapce split and combine
 */

import { WebUtils } from '../usr/WebUtils.js'
import { ModelHelper } from '../usr/ModelHelper.js'
import { RoomUtils } from '../usr/RoomUtils.js'
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
            var roomUtils = new RoomUtils(viewer);

            let leftArea = { "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999873737, "x": 38506.136268202223 }, { "z": 0.0, "y": 99.99999999985306, "x": 44906.136268202215 }], [{ "z": 0.0, "y": 99.99999999985306, "x": 44906.136268202215 }, { "z": 0.0, "y": 8899.9999999998527, "x": 44906.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998527, "x": 44906.136268202237 }, { "z": 0.0, "y": 8899.9999999998672, "x": 41006.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998672, "x": 41006.136268202237 }, { "z": 0.0, "y": 8899.9999999998745, "x": 38506.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998745, "x": 38506.136268202237 }, { "z": 0.0, "y": 99.999999999873737, "x": 38506.136268202223 }]]] };
            let rightArea = { "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999895067, "x": 31906.136268202226 }, { "z": 0.0, "y": 99.999999999874376, "x": 38306.13626820223 }], [{ "z": 0.0, "y": 99.999999999874376, "x": 38306.13626820223 }, { "z": 0.0, "y": 8899.9999999998745, "x": 38306.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998745, "x": 38306.136268202237 }, { "z": 0.0, "y": 8899.9999999998963, "x": 31906.136268202241 }], [{ "z": 0.0, "y": 8899.9999999998963, "x": 31906.136268202241 }, { "z": 0.0, "y": 99.999999999894968, "x": 31906.136268202226 }]]] };
            let areaList = [];
            areaList.push(leftArea);
            areaList.push(rightArea);
            roomUtils.mergeBoundaryPipeline(areaList);

            var roomUtils2 = new RoomUtils(viewer);
            let areaLists = [];
            areaLists.push({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 8899.9999999999982, "x": 100.00000000001437 }, { "z": 0.0, "y": 99.99999999999784, "x": 100.00000000000017 }], [{ "z": 0.0, "y": 99.99999999999784, "x": 100.00000000000017 }, { "z": 0.0, "y": 99.999999999977135, "x": 6506.1362682022218 }], [{ "z": 0.0, "y": 99.999999999977135, "x": 6506.1362682022218 }, { "z": 0.0, "y": 8899.9999999999764, "x": 6506.1362682022354 }], [{ "z": 0.0, "y": 8899.9999999999764, "x": 6506.1362682022354 }, { "z": 0.0, "y": 8899.9999999999873, "x": 3606.1362682022323 }], [{ "z": 0.0, "y": 8899.9999999999873, "x": 3606.1362682022323 }, { "z": 0.0, "y": 8899.9999999999982, "x": 100.00000000001462 }]]] });
            areaLists.push({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999976481, "x": 6706.1362682022218 }, { "z": 0.0, "y": 99.999999999955818, "x": 13106.136268202223 }], [{ "z": 0.0, "y": 99.999999999955818, "x": 13106.136268202223 }, { "z": 0.0, "y": 8899.9999999999563, "x": 13106.136268202239 }], [{ "z": 0.0, "y": 8899.9999999999563, "x": 13106.136268202239 }, { "z": 0.0, "y": 8899.9999999999764, "x": 6706.1362682022354 }], [{ "z": 0.0, "y": 8899.9999999999764, "x": 6706.1362682022354 }, { "z": 0.0, "y": 99.999999999977263, "x": 6706.1362682022218 }]]] });
            areaLists.push({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999955165, "x": 13306.136268202221 }, { "z": 0.0, "y": 99.999999999934474, "x": 19706.136268202226 }], [{ "z": 0.0, "y": 99.999999999934474, "x": 19706.136268202226 }, { "z": 0.0, "y": 8899.9999999999345, "x": 19706.136268202241 }], [{ "z": 0.0, "y": 8899.9999999999345, "x": 19706.136268202241 }, { "z": 0.0, "y": 8899.9999999999563, "x": 13306.136268202235 }], [{ "z": 0.0, "y": 8899.9999999999563, "x": 13306.136268202235 }, { "z": 0.0, "y": 99.9999999999556, "x": 13306.136268202221 }]]] });
            roomUtils2.mergeBoundaryPipeline(areaLists);
            viewer.render();

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

            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, function (e) {
                console.log(e);
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
function cleanBoundaryData(boundaryData) {
    for (let m = 0, len = boundaryData.loops[0].length; m < len; m++) {
        let root = boundaryData.loops[0];
        for (let n = 0, sublen = root[m].length; n < sublen; n++) {
            let sub = root[m];

            //对数据进行简化
            sub[n].x = Math.round(sub[n].x);
            sub[n].y = Math.round(sub[n].y);
            sub[n].z = Math.round(sub[n].z);
        }
    }

    let points = storePointArray(boundaryData);
    return boundaryData;
}

//将处理后的点位数据依次存储到数组
function storePointArray(boundaryData) {
    let pointArray = [];
    for (let m = 0, len = boundaryData.loops[0].length; m < len; m++) {
        let root = boundaryData.loops[0];
        for (let n = 0, sublen = root[m].length; n < sublen; n++) {
            let sub = root[m];

            //依次存储边界点数据
            pointArray.push(sub[n]);

        }
    }
    let result = validatePointData(pointArray);
    if (!result) {
        console.warn("边界数据不合法", pointArray);
        return;
    }

    //pointCollection用于存储多个空间的点位数据
    pointCollection = pointCollection.concat(pointArray);
    console.log("pointArray", pointArray);
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
function extremumBoundaryPoint(pointCollection, direction) {
    let extremumPoint = [];
    direction = vertical;
    minX = maxX = pointCollection[0].x;
    minY = maxY = pointCollection[0].y;
    for (let n = 1, len = pointCollection.length; n < len; n++) {
        pointCollection[n].x > maxX ? maxX = pointCollection[n].x : null;
        pointCollection[n].x < minX ? minX = pointCollection[n].x : null;
        pointCollection[n].y > maxY ? maxY = pointCollection[n].y : null;
        pointCollection[n].y < minY ? minY = pointCollection[n].y : null;
    }
    console.log("minX", minX);//31906
    console.log("minY", minY);//100
    console.log("maxX", maxX);//44906
    console.log("maxY", maxY);//8900

    for (let k = 0, len = pointCollection.length; k < len; k++) {
        let currentPoint = pointCollection[k];
        if (direction === vertical) {
            if (!(currentPoint.x > minX && currentPoint.x < maxX)) {
                let exist = extremumPoint.some(item => {
                    if (item.x == currentPoint.x && item.y == currentPoint.y) {
                        return true;
                    }
                    return false;
                })

                if (!exist) {
                    extremumPoint.push(currentPoint);
                }

            } else {
                console.log("分割方向：纵向");
            }
        }
        if (direction === horizontal) {
            if (!(currentPoint.y > minY && currentPoint.y < maxY)) {
                let exist = extremumPoint.some(item => {
                    if (item.x == currentPoint.x && item.y == currentPoint.y) {
                        return true;
                    }
                    return false;
                })

                if (!exist) {
                    extremumPoint.push(currentPoint);
                }
                console.log("分割方向：横向");
            }
        }
    }
    console.log("extremumPoint", extremumPoint);
    //对符合条件的点集进行顺时针排序，思路是找到最大和最小占1、3索引，剩余的两个点随机
    return extremumPoint;

}

//为坐标点进行排序（顺时针或逆时针），构造符合边界的数组数据
function buildBoundary(extremumPoints) {
    let copy = Object.assign([], extremumPoints);
    console.log(copy);
    copy.forEach(item => {
        if (item.x === maxX && item.y === maxY) {
            extremumPoints[0] = item;
        }
        if (item.x === minX && item.y === minY) {
            extremumPoints[2] = item;
        }
        if (item.x === maxX && item.y === minY) {
            extremumPoints[1] = item;
        }
        if (item.x === minX && item.y === maxY) {
            extremumPoints[3] = item;
        }
    });
    //TODO:排序完成后开始构造新的边界数据
    let boundaryArray = {};
    boundaryArray.version = "2.0";
    boundaryArray.loops = [];
    boundaryArray.loops[0] = [];

    for (let j = 0, len = extremumPoints.length; j < len; j++) {
        let arrayItem = [];
        if (j == len - 1) {
            arrayItem.push(extremumPoints[j]);
            arrayItem.push(extremumPoints[0]);
        } else {
            arrayItem.push(extremumPoints[j]);
            arrayItem.push(extremumPoints[j + 1]);
        }

        boundaryArray.loops[0].push(arrayItem);
    }

    return boundaryArray;
}





//边界数据处理管线
function mergeBoundaryPipeline(boundaryArray, id, height, faceColor, frameColor) {

    for (let n = 0, len = boundaryArray.length; n < len; n++) {
        //第一步：清理数据
        let cleanData = cleanBoundaryData(boundaryArray[n]);
        //第二步：将所有的点数据存储至一维数组
        storePointArray(cleanData);
    }


    //let cleanLeftData = cleanBoundaryData(leftArea);
    //let cleanRightData = cleanBoundaryData(rightArea);


    //storePointArray(cleanLeftData);
    //storePointArray(cleanRightData);
    console.log(pointCollection);

    //第三步：验证边界数组合法性
    //let validateData = validatePointData(storeData);

    //第四步：获取点位集合中的极值
    let extremum = extremumBoundaryPoint(pointCollection, vertical);
    console.log("pointCollection", pointCollection);

    //第五步：建立新的空间边界数据
    let newBoundary = buildBoundary(extremum);
    viewer.createRoom(newBoundary, height || 5500, id || Math.random(10), faceColor || new Glodon.Web.Graphics.Color('#ff0000', 0.25), frameColor || new Glodon.Web.Graphics.Color('#ff0000'));
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

