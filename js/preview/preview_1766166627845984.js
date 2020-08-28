/**
 * @author:xuhongbo
 * @function:guomao effiective
 */

import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'
import { ModelShaderChunk } from '../../shaders/common/ModelShaderChunk.js'

var app, viewer, mesh, meshId, animationId;
const SINGLE_FILE = 0;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();

webUtils.getViewtoken(1766166627845984, SINGLE_FILE).then((token) => {
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
            window.bim = {};
            // helper.createAixsHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            renderer.domElement.addClass('canvasClass');
            window.scene = scene;
            renderer.shadowMap.enabled = true;
            viewer.enableShadow(false);
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);


            let uniform = {
                u_height: 50.0,
                u_time: 0.0,
                u_opacity: 1.0,
                u_color: {
                    value: new THREE.Vector3(30 / 255, 144 / 255, 255 / 255) //颜色归一化
                }
            };

            var cylinderShaderMaterial = new THREE.ShaderMaterial({
                vertexShader: ModelShaderChunk.gradient_box_vertex_shader,
                fragmentShader: ModelShaderChunk.gradient_box_fragment_shader,
                uniforms: uniform,
                side: THREE.DoubleSide,
                transparent: true,
                wireframe: false,
                depthTest: false
            });

            //参数4与5可以控制Mesh的形状，3代表三角形，4代表矩形，值越大越接近圆形
            let scaleChange = 3000;
            var cylinderGeometry = new THREE.CylinderGeometry(15, 15, 15, 100, 100, true, 0, Math.PI * 2.0);
            mesh = new THREE.Mesh(cylinderGeometry, cylinderShaderMaterial);
            mesh.position.z = 15 * scaleChange / 2;
            mesh.position.y = 15 * scaleChange;
            mesh.position.x = 15 * scaleChange + 25500;
            mesh.rotation.x = Math.PI / 2;
            mesh.scale.set(scaleChange, scaleChange, scaleChange);
            mesh.name = "cylinder";
            viewer.addExternalObject("cylinder", mesh.clone());
            let extObjMng = new Glodon.Bimface.Viewer.ExternalObjectManager(viewer);
            meshId = extObjMng.getObjectIdByName('cylinder');
            console.log(meshId);
            //scene.add(mesh);


            //光源
            let light = new THREE.PointLight(0xff0000, 1.35, 1000);
            let Z = -18220.363535766293;
            light.position.set(53789.66668783984, 116882.37157129617, Z);
            viewer.addExternalObject("light", light);

            //基础设置
            viewer.hideViewHouse();
            document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
            document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
            document.getElementById('open-button').style.display = 'block';

            mesh.material.opacity = 1.0;
            let scales = 1;

            // bimface的实现方式，还原大小时有问题
            let animation = () => {
                uniform.u_color.value.x += 0.001;
                mesh.material.opacity -= 0.0065;
                if (mesh.material.opacity <= 0) {
                    cancelAnimationFrame(animationId);
                    //如果Mesh消失，还原Mesh
                    extObjMng.removeById(meshId);
                    extObjMng.addObject("cylinder", mesh.clone());
                    meshId = extObjMng.getObjectIdByName('cylinder');
                    mesh.material.opacity = 1.0;
                    scales = 1.0;
                    //extObjMng.scale(meshId, { x: 1, y: 1, z: 1 });

                    //viewer.addExternalObject("cylinder", mesh);
                    //meshId = extObjMng.getObjectIdByName('cylinder');
                    //extObjMng.scale(meshId, { x: 0.8, y: 1, z: 0.8 });
                    // bimface 逻辑有问题，暂时先移除再添加在开启
                    // console.warn("less than 0");
                    // console.warn(scales);

                    //return;

                } else {
                    scales += 0.0001;
                    extObjMng.scale(meshId, { x: scales, y: 1, z: scales });

                }
                viewer.render();
                animationId = requestAnimationFrame(animation);
            }


            // threejs的方式
            /*let animation = () => {
                uniform.u_color.value.x += 0.01;
                scales += 0.1;
                mesh.scale.set(scales, 1, scales);
                mesh.material.opacity -= 0.01;
                if (mesh.material.opacity <= 0) {
                    //如果Mesh消失，还原Mesh
                    scales = 1.0;
                    mesh.scale.set(scales, scales, scales);
                    mesh.material.opacity = 1.0;
                }
                if (uniform.u_color.value.x > 1.0) {
                    uniform.u_color.value.x = 0;
                }
                viewer.render();
                renderer.render(scene, camera);
                requestAnimationFrame(animation);
            }*/



            //相机视角
            setCamera(viewer, animation);

            // let extObjMng = new Glodon.Bimface.Viewer.ExternalObjectManager(viewer);
            // var box = new THREE.BoxBufferGeometry(10000, 10000, 100000);
            // var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            // var boxMesh = new THREE.Mesh(box, material);

            // extObjMng.addObject("boxMesh", boxMesh);
            // let v = 1.0;
            // let an = () => {
            //     v += 1.5;
            //     //boxMesh.scale.set(v, v, v);
            //     extObjMng.scale(meshId, { x: v, y: v, z: v });
            //     viewer.render();
            //     requestAnimationFrame(an);

            // }
            // an();

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
            "x": -694395.9651171766,
            "y": -298369.9639863784,
            "z": 202400.53965853408
        },
        "target": {
            "x": -404251.69383963005,
            "y": -164850.6019335325,
            "z": 192283.34676764798
        },
        "up": {
            "x": 0.028762711172524155,
            "y": 0.013232425840408122,
            "z": 0.999498679014827
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    };

    let target = {
        "name": "persp",
        "position": {
            "x": -337656.9579019549,
            "y": 215486.24732650723,
            "z": 134141.3680497233
        },
        "target": {
            "x": -45409.279311981794,
            "y": 87420.49778987166,
            "z": 151575.1196500488
        },
        "up": {
            "x": -0.04997098410901617,
            "y": 0.021894088189029905,
            "z": 0.9985106657665442
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
