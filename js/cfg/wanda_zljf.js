/**
 * @author:xuhongbo
 * @description:集成Id 1850344282898048 万达制冷机房效果
 */

import { light } from '../usr/light.js'
import { unreal } from '../usr/custom-pass.js'


var camera, scene, renderer, myControls, clock;
// 万达制冷机房效果 制冷机房-0423

var wd_zljf = {

    scene: null,
    viewer: null,
    targetMesh: null,
    drawableConfig: null,
    drawableContainer: null,


    init_zljf: function (scene, viewer) {


        this.scene = scene;
        this.viewer = viewer;

        window.ea = viewer.getExternalComponentManager();
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(28, 45, 55, 1));

        let start = {
            "name": "persp",
            "position": {
                "x": -36719.46122559318,
                "y": -17073.75669740723,
                "z": 47722.03040187795
            },
            "target": {
                "x": 16098.799241644685,
                "y": 35744.698317162394,
                "z": -5096.038260086816
            },
            "up": {
                "x": 0,
                "y": -0.000003673204978973533,
                "z": 0.9999999999932538
            },
            "fov": 45,
            "version": 1
        };

        let target = {
            "name": "persp",
            "position": {
                "x": 47672.90064514055,
                "y": 74332.24584790962,
                "z": 29380.518148928408
            },
            "target": {
                "x": -5857.008696355016,
                "y": 38310.96947432557,
                "z": -35475.64783653954
            },
            "up": {
                "x": -0.5881648488319571,
                "y": -0.3957919368526773,
                "z": 0.7052736017467882
            },
            "fov": 45,
            "version": 1
        };

        viewer.setCameraStatus(start, () => {
            setTimeout(() => {
                viewer.setCameraStatus(target, () => {
                    // // 添加设备标签
                    // var position = new Object();
                    // let max = { x: 48267.05078125, y: 145279.40625, z: 4566.999938964844 };
                    // let min = { x: 47267.050842285156, y: 143739.40625, z: 3833 };
                    // position = { x: (max.x + min.x) / 2, y: (max.y + min.y) / 2, z: max.z };

                    // this.createTag(position, "tag", "暖通空调 1#");

                    // let areaPos1 = { x: 10849.856525750167, y: 140403.73229127374, z: 3.259261749377629e-8 };
                    // this.createTag(areaPos1, "tag3", "23.5℃");

                    // let areaPos2 = { x: 35966.909079778336, y: 154820.3624507177, z: 3.5935210029869324e-8 };
                    // this.createTag(areaPos2, "tag4", "29.8℃");

                    // let areaPos3 = { x: 11014.188939933792, y: 129270.36637729005, z: 3.000482423631823e-8 };
                    // this.createTag(areaPos3, "tag", "37.8℃");
                });
            }, 800);
        });

        // 创建标签容器
        var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
        drawableConfig.viewer = viewer;
        var drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);
        this.drawableConfig = drawableConfig;
        this.drawableContainer = drawableContainer;


        let idx = 1;
        scene.traverse(function (child) {
            if (child instanceof CLOUD.MeshEx || child instanceof CLOUD.Object3DEx || child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.name = idx;
                child.receiveShadow = true;
                // if (child.material.length) {
                //     for (let v = 0; v < child.material.length; v++) {
                //         // child.material[v].wireframe = true;
                //     }
                //     // child.visible = false;
                // }
                console.log(child);
                idx++;

            } else if (child instanceof CLOUD.ObjectGroup) {
                // child.castShadow = true;
                // child.name = idx;
                // child.receiveShadow = true;
                // console.log(child);
            }
        }, true);

        var boxMesh = new THREE.Object3D();
        // var boxMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: true });
        // var boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        boxMesh.position.set(18196, 52936, -385)
        viewer.addExternalObject("boxMesh", boxMesh);



        // 配置聚光灯
        let spotLight = light.createSpotLight(0xffffff, 1.5, 1500, Math.PI / 3, 0.5, 2);
        spotLight.castShadow = true;
        spotLight.shadowDarkness = 1.0;
        spotLight.visible = true;
        spotLight.shadow.mapSize.width = 4096;
        spotLight.shadow.mapSize.height = 4096;
        // spotLight.shadowCameraVisible = true;

        //var targetObject = new THREE.Object3D();
        // targetObject.position.set({ x: 12352.515431644013, y: 53333.174581496525, z: -5899.999372838399 });
        // viewer.addExternalObject("targetObject", targetObject);

        spotLight.position.set(18196, 52936, 6285);
        spotLight.target = boxMesh;

        // var spotLightHelper = new THREE.SpotLightHelper(spotLight, 0xce3ced);
        // spotLightHelper.position.set(7055.299652797337, 39462.99907105393, -797.9316783322747);

        //var helper = new THREE.DirectionalLightHelper(spotLight, 5);
        // viewer.addExternalObject("shadow", new THREE.CameraHelper(spotLight.shadow.camera));
        viewer.addExternalObject("spotLight", spotLight);
        //viewer.getExternalComponentManager().setTransform("spotLight", { x: 10583.111505163692, y: 65108.77472340918, z: -4180.216448552426 });
        // viewer.addExternalObject("spotLightHelper", spotLightHelper);
        var spotLightHelper = new THREE.SpotLightHelper(spotLight);
        viewer.addExternalObject("spotLightHelper", spotLightHelper);


        // 配置Data-GUI
        var myControls;
        myControls = new function () {
            this.spotPX = 18196;
            this.spotPY = 52936;
            this.spotPZ = 6285;
            this.distance = 1500;

            this.backgroundColor = [28, 45, 55];
            this.floorColor = [9, 46, 81];
        };

        var setPosition = function () {
            viewer.getExternalComponentManager().setTransform("spotLight", { x: myControls.spotPX, y: myControls.spotPY, z: myControls.spotPZ });
            viewer.render();
        };

        var setParameters = function () {
            spotLight.distance = myControls.distance;
            viewer.render();
        };

        var changeBgColor = function () {
            viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(myControls.backgroundColor[0], myControls.backgroundColor[1], myControls.backgroundColor[2], 1));
            viewer.render();
        };

        var changeFloorColor = function () {
            viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2001300" }], new Glodon.Web.Graphics.Color(myControls.floorColor[0], myControls.floorColor[1], myControls.floorColor[2], 0.85));
            viewer.render();
        }

        var gui = new dat.GUI();
        var spotPosition = gui.addFolder("SpotLightPosition");
        spotPosition.add(myControls, 'spotPX', -10000, 80000).onChange(setPosition);
        spotPosition.add(myControls, 'spotPY', -10000, 80000).onChange(setPosition);
        spotPosition.add(myControls, 'spotPZ', -10000, 80000).onChange(setPosition);

        var spotParameters = gui.addFolder("SpotLightParameters");
        spotParameters.add(myControls, 'distance', 0, 5000).onChange(setParameters);

        var colors = gui.addFolder("ColorParameters");
        colors.addColor(myControls, 'backgroundColor').onChange(changeBgColor);
        colors.addColor(myControls, 'floorColor').onChange(changeFloorColor);



        //配置直射光，太刺眼，暂时去掉
        let dir = light.createDirectilyLight(0xffffff, 10);
        dir.target = boxMesh;
        dir.castShadow = true;

        // viewer.addExternalObject("dir", dir);

        //隐藏管道隔热层和建筑楼板
        viewer.hideComponentsByObjectData([{ "categoryId": "-2008122" }, { "categoryId": "-2000032" }]);

        viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }, { "specialty": "结构" }], new Glodon.Web.Graphics.Color('#6699FF', 0.25));
        //设置机械设备颜色
        viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2001140" }], new Glodon.Web.Graphics.Color(118, 205, 162, 0.95));

        //设置楼板颜色
        viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2001300" }], new Glodon.Web.Graphics.Color(9, 46, 81, 1));

        //故障设备
        viewer.overrideComponentsColorById(["1850332718385088.5299047"], new Glodon.Web.Graphics.Color(228, 119, 111, 0.98));

        //关闭设备
        viewer.overrideComponentsColorById(["1850332718385088.5300592"], new Glodon.Web.Graphics.Color(78, 114, 167, 0.98));
        viewer.render();

    },

    init_model: function () {
        document.getElementById("identity").style.display = "block";
        this.viewer.hideViewHouse();
        document.getElementsByClassName('dg ac')[0].style.display = "none";
        document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
        document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
    }

}

export { wd_zljf }