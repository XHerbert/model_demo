/**
 * @author:xuhongbo
 * @function:wanda highlight blue effiective
 */

import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer, composer, outlinePass, effectFXAA;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();

webUtils.getViewtoken(1893582365950144, INTEGRATE_FILE).then((token) => {
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
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1), new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 0.5));
        viewer.setBorderLineEnabled(false);

        window.viewer = viewer;
        webUtils.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            let modelHelper = new ModelHelper(viewer);
            let open = true;
            //helper.createAixsHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            renderer.domElement.addClass('canvasClass');
            window.myscene = scene;
            renderer.shadowMap.enabled = true;
            viewer.enableShadow(true);
            //viewer.setExposureShift(0.2);
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);
            viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(214, 214, 214, 1));
            let uniform = {
                time: { value: 0.0 },
                alpha: 1.0
            }

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);

            // 轮廓线不明显
            viewer.overrideComponentsFrameColorByObjectData([], new Glodon.Web.Graphics.Color(255, 255, 255, 1));

            // 全楼蓝透
            viewer.overrideComponentsColorByObjectData([], new Glodon.Web.Graphics.Color(114, 116, 203, uniform.alpha));
            // viewer.overrideComponentsColorByObjectData([], new Glodon.Web.Graphics.Color(146, 146, 146, uniform.alpha));


            if (!open) {
                myscene.children[0].traverse((mesh) => {
                    //只检测了第一层子节点，还需检查Group下的子节点
                    if (mesh.isMesh) {
                        if (mesh.material.length) {
                            for (let f = 0; f < mesh.material.length; f++) {
                                //mesh.material[f].depthTest = false;
                                mesh.material[f].wireframe = false;
                            }
                        } else {
                            //mesh.material.depthTest = false;
                            mesh.material.wireframe = false;
                        }
                        console.log(mesh);
                        mesh.visible = false;
                    }

                }, true)
            }

            let material = new THREE.MeshBasicMaterial({
                color: 0x3032B8,
                // color: 0x929292,
                wireframe: false,
                transparent: true,
                opacity: uniform.alpha
            });

            //通过包围盒创建线框

            let geometryList = [
                '1893575056377824.3055097',
                '1893575056377824.3048897',
                '1893575056377824.3048896',
                '1893575056377824.3051366',
                '1893575056377824.3055159',
                '1893537376946272.2738421',
                '1893537376946272.2751160',
                '1893537376946272.2771234',
                "1893580694636640.2855094",
                "1893574719907808.2751863",
            ];

            let exteralList = [];
            let edgesList = [];
            let lines = 80;
            let lineGroup = new THREE.Group();
            for (let g = 0, len = geometryList.length; g < len; g++) {
                let item = [];
                item.push(geometryList[g]);
                let main = viewer.convertToExternalObject("main" + geometryList[g], item, true);
                main.children[0].material = material;
                exteralList.push(main);

                var edges = new THREE.EdgesGeometry(new THREE.Geometry().fromBufferGeometry(main.children[0].geometry));
                var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
                for (let idx = (-1) * lines; idx < lines; idx++) {
                    let lineClone = line.clone();
                    lineClone.position.x = line.position.x + idx;
                    lineClone.position.y = line.position.y + idx;
                    lineGroup.add(lineClone);
                }
                edgesList.push(lineGroup);
            }

            viewer.addExternalObject("main", exteralList);
            viewer.addExternalObject("edges", edgesList);

            //如果构件不是Mesh类型，通过包围盒方式创建边框
            let offset = 150;
            let YZ = 1, XY = 2, XZ = 3;
            let boundboxlist = [];

            //参数d用于指定所在平面，1：YZ 2：XY 3:XZ
            let m_3047070 = { max: { x: -200, y: 133999.9921875, z: 59899.99609375 }, min: { x: -500, y: 65999.9921875, z: 32600.000061035156 }, d: YZ };
            let m_3052775 = { max: { x: 137099.9375, y: 89400.017578125, z: 50699.99609375 }, min: { x: 136799.9375, y: 39549.998046875, z: 31199.99609375 }, d: YZ };
            let m_3051987 = { max: { x: 70100, y: 18300.048828125, z: 50900 }, min: { x: 69800, y: -699.94921875, z: 31400 }, d: YZ };
            let m_3046473 = { max: { x: 18699.998046875, y: 66000, z: 59899.99609375 }, min: { x: -500, y: 65700, z: 38299.99609375 }, d: XY };
            let m_3055113 = { max: { x: 18399.998046875, y: 133937.07421875, z: 59899.999992370605 }, min: { x: -200, y: 66000.00390625, z: 59700.000007629395 }, d: XZ };
            let m_3055079 = { max: { x: 156099.994140625, y: 92239.998046875, z: 50899.999992370605 }, min: { x: 136799.943359375, y: 39400.001953125, z: 50700.000007629395 }, d: XZ };
            let m_2870335 = { max: { x: 46200, y: 17180.609375, z: 10749.9990234375 }, min: { x: 46000, y: -2700, z: 5649.9990234375 }, d: XY };
            let m_2738435 = { max: { x: -1982.5788650512695, y: 104314.998046875, z: 26099.998046875 }, min: { x: -2182.5788497924805, y: 39400.001953125, z: 20949.998046875 }, d: YZ };
            let m_3048897 = { max: { x: -3300, y: 192800, z: 59900 }, min: { x: -3600, y: 158100, z: 33600 }, d: XY };

            boundboxlist.push(m_3047070);
            boundboxlist.push(m_3052775);
            boundboxlist.push(m_3051987);
            boundboxlist.push(m_3046473);
            boundboxlist.push(m_3055113);
            boundboxlist.push(m_3055079);
            boundboxlist.push(m_2870335);

            let boundingGroup = new THREE.Group();
            for (let m = 0, len = boundboxlist.length; m < len; m++) {
                let item = boundboxlist[m];
                let planeGeometry = null;
                if (item.d == YZ) {
                    planeGeometry = new THREE.PlaneBufferGeometry(item.max.z - item.min.z, item.max.y - item.min.y);
                } else if (item.d == XY) {
                    planeGeometry = new THREE.PlaneBufferGeometry(item.max.x - item.min.x, item.max.z - item.min.z);
                } else {
                    planeGeometry = new THREE.PlaneBufferGeometry(item.max.x - item.min.x, item.max.y - item.min.y);
                }

                let planeMaterial = new THREE.MeshBasicMaterial({});
                let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
                let targetPos = { x: (item.max.x + item.min.x) / 2, y: (item.max.y + item.min.y) / 2, z: (item.max.z + item.min.z) / 2 };

                var edges2 = new THREE.EdgesGeometry(new THREE.Geometry().fromBufferGeometry(planeMesh.geometry));
                var line2 = new THREE.LineSegments(edges2, new THREE.LineBasicMaterial({ color: 0xffffff }));

                if (item.d == YZ) {
                    line2.position.set(targetPos.x - offset, targetPos.y, targetPos.z);
                    line2.rotation.y = Math.PI / 2;
                } else if (item.d == XY) {
                    line2.position.set(targetPos.x, targetPos.y, targetPos.z + offset);
                    line2.rotation.x = Math.PI / 2;
                } else {
                    line2.position.set(targetPos.x, targetPos.y, targetPos.z + offset);
                }

                boundingGroup.add(line2);
                for (let idx = (-1) * lines; idx < lines; idx++) {
                    let lineClone = line2.clone();
                    lineClone.position.x = line2.position.x + idx;
                    lineClone.position.y = line2.position.y + idx;
                    boundingGroup.add(lineClone);
                }
            }

            viewer.addExternalObject("edges2", boundingGroup);

            //开始绘制网格
            let linesGroup = new THREE.Group();
            let lMaterial = new THREE.LineBasicMaterial({ color: 0xeeeeee, opacity: 0.125, transparent: true });
            let h_segments = 20, v_segments = 60;
            let mo = [m_3047070, m_3052775, m_3051987, m_3048897];

            for (let m = 0, len = mo.length; m < len; m++) {
                let geometry = new THREE.Geometry();
                let v_geometry = geometry.clone();
                geometry.vertices.push(new THREE.Vector3(mo[m].min.x, mo[m].min.y, mo[m].min.z));
                geometry.vertices.push(new THREE.Vector3(mo[m].max.x, mo[m].max.y, mo[m].min.z));
                let h_devides = (mo[m].max.z - mo[m].min.z) / h_segments;

                for (let i = 1; i <= h_segments; i++) {
                    //画横线
                    let line = new THREE.Line(geometry, lMaterial);
                    line.position.z = i * h_devides;
                    line.position.x = line.position.x - offset * 2;
                    linesGroup.add(line);
                }
                v_geometry.vertices.push(new THREE.Vector3(mo[m].min.x, mo[m].min.y, mo[m].min.z));
                v_geometry.vertices.push(new THREE.Vector3(mo[m].min.x, mo[m].min.y, mo[m].max.z));
                let v_devides = (mo[m].max.y - mo[m].min.y) / v_segments;
                for (let i = 1; i <= v_segments; i++) {
                    //画竖线
                    let line = new THREE.Line(v_geometry, lMaterial);
                    line.position.y = i * v_devides;
                    line.position.x = line.position.x - offset * 2;
                    linesGroup.add(line);
                }
            }

            viewer.addExternalObject("lineGrid", linesGroup);

            //光源
            let light = new THREE.PointLight(0xff0000, 0.35, 10000);
            light.position.set(53789.66668783984, 116882.37157129617, -18220.363535766293);
            //myscene.add(light);


            //基础设置
            viewer.hideViewHouse();
            document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
            document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
            document.getElementById('open-button').style.display = 'block';
            //处理顶部扶栏
            let dir = 1.0;
            //run();
            setCamera(viewer);
            function run() {
                viewer.render();
                requestAnimationFrame(run);
                uniform.time.value += 0.314 * dir;
            };
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
            "x": -107442.87554028918,
            "y": -89694.07910020031,
            "z": 217252.7366836951
        },
        "target": {
            "x": 77050.52929109448,
            "y": 94800.00528216573,
            "z": 32760.00182532339
        },
        "up": {
            "x": 0,
            "y": -0.00000367321638693107,
            "z": 0.9999999999932536
        },
        "fov": 45,
        "zoom": 1,
        "version": 1
    };

    let target = {
        "name": "persp",
        "position": {
            "x": -50468.45125108154,
            "y": -41532.70259805236,
            "z": 54345.663685087944
        },
        "target": {
            "x": 175010.08582327646,
            "y": 181013.83515566576,
            "z": 12561.448168924051
        },
        "up": {
            "x": 0.09306534718061688,
            "y": 0.0918514713941837,
            "z": 0.9914142163378912
        },
        "fov": 45,
        "zoom": 1,
        "version": 1
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
