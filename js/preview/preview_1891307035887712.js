/**
 * @author:xuhongbo
 * @function:wanda F01 effiective
 */

import { WebUtils } from '../usr/WebUtils.js'
import { ModelHelper } from '../usr/ModelHelper.js'
// import { EffectComposer } from '../../node_modules/_three@0.85.2@three/examples/js/postprocessing/EffectComposer.js'
// import { RenderPass } from '../../node_modules/_three@0.85.2@three/examples/js/postprocessing/RenderPass.js'
// import { OutlinePass } from '../../node_modules/_three@0.85.2@three/examples/js/postprocessing/OutlinePass.js'

var app, viewer, drawableContainer, composer, outlinePass, effectFXAA;
const SINGLE_FILE = 0;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();

BimfaceLoaderConfig.viewToken = '24847c73fa6b4cd8a252828c00a01ea8';
BimfaceSDKLoader.load(BimfaceLoaderConfig, onSDKLoadSucceeded, onSDKLoadFailed);
// webUtils.getViewtoken(1891307035887712, SINGLE_FILE).then((token) => {

// });

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
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1), new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 0.5));
        viewer.setBorderLineEnabled(false);
        //雾化颜色
        //viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(204, 224, 255, 1));
        window.viewer = viewer;
        webUtils.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            let helper = new ModelHelper(viewer);
            //helper.createAixsHelper(viewer);
            let scene = webUtils.getScene(), camera = webUtils.getPerspectiveCamera(), renderer = webUtils.getRender();
            window.myscene = scene;
            renderer.shadowMap.enabled = true;
            renderer.alpha = true;
            // renderer.setClearAlpha(0.8);
            let uniform = {
                time: { value: 0.0 }
            }

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);

            document.getElementById('open-button').style.display = 'block';
            viewer.getViewer().rendererManager.renderer.renderer.shadowMap.enabled = true;
            viewer.getViewer().rendererManager.renderer.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene.children[0].castShadow = true;

            viewer.setBackgroundColor(new Glodon.Web.Graphics.Color("#333333"));
            //空间
            viewer.overrideComponentsColorById(["2933839"], new Glodon.Web.Graphics.Color(117, 78, 56, 0.7));
            viewer.overrideComponentsColorById(["2935384"], new Glodon.Web.Graphics.Color(133, 36, 48, 0.6));
            viewer.overrideComponentsColorById(["2932489"], new Glodon.Web.Graphics.Color(255, 255, 255, 0.51));
            viewer.overrideComponentsColorById(["2934706"], new Glodon.Web.Graphics.Color(133, 36, 48, 0.6));

            //设备
            viewer.overrideComponentsColorById(["1765452"], new Glodon.Web.Graphics.Color(255, 31, 18, 0.8));
            viewer.overrideComponentsColorById(["2263790"], new Glodon.Web.Graphics.Color(255, 31, 18, 0.8));

            //白色空间内的风管
            viewer.overrideComponentsColorById(["2059701", "1740248", "1740251", "1740249", "1740677", "1740247", "2220209", "2220206", "2220324", "2220327", "2314358", "2314355", "1733863", "2314580", "2314578", "1733882", "1733864", "2220271", "2220268"], new Glodon.Web.Graphics.Color(255, 255, 255, 0.98));

            //地平面
            let wid = 200000, hei = 200000;
            var planeGeometry = new THREE.PlaneBufferGeometry(wid, hei);
            let loader = new THREE.TextureLoader();
            var planeMaterial = new THREE.MeshBasicMaterial({});

            //TODO:替换底图图片，最好是径向渐变，与背景色融合在一起
            let others = loader.load('../../images/back.jpg', function (map) {
                planeMaterial.map = map;
                var plane = new THREE.Mesh(planeGeometry, planeMaterial);
                plane.translateX(wid / 2);
                plane.translateY(hei / 2);
                viewer.addExternalObject("plane", plane);
            });

            //空间转换
            let whiteArea = viewer.convertToExternalObject("mainArea", ['2932489'], true);
            let box = new THREE.BoxBufferGeometry(10000, 10000, 10000);

            let material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: false,
                transparent: true,
                opacity: 0.5
            });
            whiteArea.children[0].material = material;
            viewer.addExternalObject("area", whiteArea);

            //顶部扶栏
            let arrays = ['2785404', "2784673", "2785383", "2842603", "2785481", "2785443", "2785463"];
            let fulanMaterial = new THREE.ShaderMaterial({
                uniforms: uniform,
                vertexShader: document.getElementById('vertex').textContent,
                fragmentShader: document.getElementById('fragment').textContent
            });
            let fulanGroup = new THREE.Group();
            for (let a = 0; a < arrays.length; a++) {
                let _ = [];
                _.push(arrays[a]);
                let name = "fulan" + a;
                let fulan = viewer.convertToExternalObject(name, _, true);
                fulan.children[0].material = fulanMaterial;
                viewer.addExternalObject(name, fulan);
            }

            //描边效果可以产生，但是太差，暂时不用composer去渲染，希望bimface升级threejs
            /*
            let selectedObjects = [];
            selectedObjects.push(whiteArea.children[0]);
             webUtils.loadScript("../../node_modules/_three@0.85.2@three/examples/js/shaders/CopyShader.js", () => {
                webUtils.loadScript("../../node_modules/_three@0.85.2@three/examples/js/shaders/FXAAShader.js", () => {
                    webUtils.loadScript("../../node_modules/_three@0.85.2@three/examples/js/postprocessing/EffectComposer.js", () => {
                        webUtils.loadScript("../../node_modules/_three@0.85.2@three/examples/js/postprocessing/RenderPass.js", () => {
                            webUtils.loadScript("../../node_modules/_three@0.85.2@three/examples/js/postprocessing/ShaderPass.js", () => {
                                webUtils.loadScript("../../node_modules/_three@0.85.2@three/examples/js/postprocessing/OutlinePass.js", () => {
                                    composer = new THREE.EffectComposer(renderer);
                                    var renderPass = new THREE.RenderPass(scene, camera);
                                    composer.addPass(renderPass);

                                    outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
                                    // outlinePass.renderToScreen = true;
                                    outlinePass.edgeStrength = 3.0;
                                    outlinePass.edgeThickness = 1.0;
                                    outlinePass.visibleEdgeColor.set(0xff0000);
                                    outlinePass.hiddenEdgeColor.set(0xff0000);
                                    outlinePass.selectedObjects = selectedObjects;
                                    composer.addPass(outlinePass);


                                    effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
                                    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
                                    effectFXAA.renderToScreen = true;
                                    composer.addPass(effectFXAA);
                                    viewer.render();
                                    //run();
                                });
                            });
                        });
                    })
                });
            });**/

            //产生边缘，并追加到场景中，不透明度1，由于不能设置线宽，所以通过克隆、偏移的方式解决线宽问题
            var edges = new THREE.EdgesGeometry(new THREE.Geometry().fromBufferGeometry(whiteArea.children[0].geometry));
            // var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
            var line = new THREE.LineSegments(edges, new THREE.ShaderMaterial({
                uniforms: uniform,
                vertexShader: document.getElementById('edgevertex').textContent,
                fragmentShader: document.getElementById('edgefragment').textContent
            }));
            let lineGroup = new THREE.Group();
            lineGroup.add(line);

            for (let idx = -50; idx < 50; idx++) {
                let lineClone = line.clone();
                lineClone.position.x = line.position.x + idx;
                lineClone.position.y = line.position.y + idx;
                lineGroup.add(lineClone);
            }
            viewer.addExternalObject("edges", lineGroup);

            //创建标签
            setCamera(viewer, () => {
                createTag({ x: 106848.99342876796, y: 159958.46350893454, z: 15849.999883117878 }, "bigcircle2", "");
                createTag({ x: 147259.284137998, y: 104541.69746192008, z: 15850.064883335008 }, "bigcircle2", "");
                createTag({ x: 99081.2708190525, y: 13990.056421873413, z: 15850.01312551748 }, "bigcircle2", "");
                createTag({ x: 28789.34954544223, y: 70984.95282537282, z: 14392.88910126507 }, "bigcircle2", "");
            });

            function createTag(position, styleClass, text) {
                var config = new Glodon.Bimface.Plugins.Drawable.CustomItemConfig();
                var content = document.createElement('div');
                //TODO:替换图标
                content.innerHTML = '<div class="item"><div style="width:49px;height:35px;"><img src="../../images/icon.png" height="32" width="32"/></div><div  id="canvasDiv" class="1' + styleClass + '">' + text + '</div></div>'
                // content.innerHTML = '<div class="item"></div>';
                config.content = content;
                config.viewer = viewer;
                config.worldPosition = position;
                var customItem = new Glodon.Bimface.Plugins.Drawable.CustomItem(config);
                drawableContainer.addItem(customItem);
            };

            //处理顶部扶栏
            let dir = 1.0;
            run();

            function run() {
                viewer.render();
                requestAnimationFrame(run);
                uniform.time.value += 0.314 * dir;
                // if (uniform.time.value >= 1.0) {
                //     dir = -1.0;
                // }
                // if (uniform.time.value <= 0.0) {
                //     dir = 1.0;
                // }
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
            "x": -87876.72699139986,
            "y": -70229.03759091756,
            "z": 177726.35885637588
        },
        "target": {
            "x": 76800.0291669729,
            "y": 94448.32512707186,
            "z": 13050.200708430179
        },
        "up": {
            "x": 0,
            "y": -0.0000036732161161965555,
            "z": 0.9999999999932538
        },
        "fov": 45,
        "zoom": 1,
        "version": 1
    };

    let target = {
        "name": "persp",
        "position": {
            "x": -65819.22381067692,
            "y": 20026.144011659544,
            "z": 100344.9821103466
        },
        "target": {
            "x": 134715.02658292453,
            "y": 138445.01443164545,
            "z": -64331.338046253855
        },
        "up": {
            "x": 0.4971421741856359,
            "y": 0.29356637301827576,
            "z": 0.8164976688753457
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
