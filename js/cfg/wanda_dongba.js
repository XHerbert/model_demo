/**
 * @author:xuhongbo
 * @description:1862412174108736
 */

import { light } from '../usr/light.js'

var wd_config = {
    scene: null,
    viewer: null,
    targetMesh: null,
    drawableConfig: null,
    drawableContainer: null,



    init_scene: function (scene, viewer) {
        this.scene = scene;
        this.viewer = viewer;

        // scene.overrideMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

        //配置背景色
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(17, 25, 48, 1));
        let target = {
            "name": "persp",
            "position": {
                "x": 49644.27405194369,
                "y": 123924.08516083205,
                "z": 40903.24339613964
            },
            "target": {
                "x": -165610.81064635832,
                "y": 333303.8650391486,
                "z": -286606.3453421098
            },
            "up": {
                "x": -0.4779036088198181,
                "y": 0.5631608497369422,
                "z": 0.6741349998335346
            },
            "fov": 45,
            "version": 1
        };
        let start = {
            "name": "persp",
            "position": {
                "x": -240057.2553095202,
                "y": -146317.55375275147,
                "z": 259138.32299000377
            },
            "target": {
                "x": 16481.999380017936,
                "y": 110222.64585687037,
                "z": 2599.9999023204928
            },
            "up": {
                "x": 0,
                "y": -0.0000036732373949049126,
                "z": 0.9999999999932535
            },
            "fov": 45,
            "version": 1
        };


        viewer.addBlinkComponentsById(["2187458"]);
        viewer.setBlinkColor(new Glodon.Web.Graphics.Color(250, 33, 179, 0.05));
        // viewer.setBlinkIntervalTime(300);
        viewer.render();

        viewer.setCameraStatus(start, () => {
            setTimeout(() => {
                viewer.setCameraStatus(target, () => {
                    // 添加设备标签
                    var position = new Object();
                    let max = { x: 48267.05078125, y: 145279.40625, z: 4566.999938964844 };
                    let min = { x: 47267.050842285156, y: 143739.40625, z: 3833 };
                    position = { x: (max.x + min.x) / 2, y: (max.y + min.y) / 2, z: max.z };

                    this.createTag(position, "tag", "暖通空调 1#");

                    let areaPos1 = { x: 10849.856525750167, y: 140403.73229127374, z: 3.259261749377629e-8 };
                    this.createTag(areaPos1, "tag3", "23.5℃");

                    let areaPos2 = { x: 35966.909079778336, y: 154820.3624507177, z: 3.5935210029869324e-8 };
                    this.createTag(areaPos2, "tag4", "29.8℃");

                    let areaPos3 = { x: 11014.188939933792, y: 129270.36637729005, z: 3.000482423631823e-8 };
                    this.createTag(areaPos3, "tag", "37.8℃");
                });
            }, 800);
        });

        // 创建标签容器
        var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
        drawableConfig.viewer = viewer;
        var drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);
        this.drawableConfig = drawableConfig;
        this.drawableContainer = drawableContainer;

        // 配置聚光灯
        light.init(0xff0000);
        let spotLight = light.createSpotLight(0xffffff, 3, 10000, Math.PI / 2.5, 0.5, 2);
        spotLight.castShadow = true;
        spotLight.shadowDarkness = 1.0;
        spotLight.shadow.mapSize.width = 4096;
        spotLight.shadow.mapSize.height = 4096;
        spotLight.shadowCameraVisible = true;

        var targetObject = new THREE.Object3D();
        targetObject.position.set(24000.234344482422, 150799.96871948242, 0);
        viewer.addExternalObject("targetObject", targetObject);

        spotLight.position.set(24000.234344482422, 150799.96871948242, 18397);
        spotLight.target = targetObject;

        var spotLightHelper = new THREE.SpotLightHelper(spotLight, 0xce3ced);
        var helper = new THREE.DirectionalLightHelper(spotLight, 5);
        // viewer.addExternalObject("helper", helper);
        viewer.addExternalObject("spotLight", spotLight);

        //隐藏构件
        viewer.hideComponentsByObjectData([{ "levelName": "F2" }, { "levelName": "B1" }, { "levelName": "B2" }]);
        // viewer.hideComponentsByObjectData([{ "levelName": "F2" }, { "levelName": "B1" }, { "levelName": "B2" }, { "family": "楼板" }]);


        // 处理墙面
        viewer.overrideComponentsFrameColorByObjectData([{ "family": "基本墙" }], new Glodon.Web.Graphics.Color('#1E90FF', 0.7));
        viewer.overrideComponentsColorByObjectData([{ "family": "基本墙" }, { "family": "砼矩形柱" }, { "family": "砼圆形柱" }], new Glodon.Web.Graphics.Color('#6699FF', 0.65)); viewer.render();

        //楼板颜色
        viewer.overrideComponentsColorByObjectData([{ "family": "楼板" }], new Glodon.Web.Graphics.Color(9, 46, 88, 1));


        //添加楼板
        // let planeGeometry = new THREE.PlaneBufferGeometry(200000, 200000);
        // let planeMatrial = new THREE.MeshLambertMaterial({ color: 0x222222 });
        // let plane = new THREE.Mesh(planeGeometry, planeMatrial);

        // plane.receiveShadow = true;
        // plane.position.set(100000, 100000, 100);
        // viewer.addExternalObject("plane", plane);

        // 设备
        viewer.overrideComponentsColorById(["2187458"], new Glodon.Web.Graphics.Color(250, 33, 179, 1));

        // 设备关联设备
        viewer.overrideComponentsColorById(["1572573", "1572574", "1572576", "1572577", "1572578", "1572579", "1572580", "1572581", "1572582", "1572583", "1572584", "1572585", "1572586", "1572587", "1572588", "1572589", "1572590", "1572591", "1572592", "1572593", "1572594", "1572595", "1572596", "1572597", "1578246", "1578247", "1578254", "1578255", "1578256", "1578257", "1578258", "1578977", "1578978", "1578979", "1578980", "1578981", "1578982", "2026231"], new Glodon.Web.Graphics.Color(250, 227, 175, 1));

        // yellow
        viewer.overrideComponentsColorById(["2548998"], new Glodon.Web.Graphics.Color(209, 195, 96, 1));
        // pink
        viewer.overrideComponentsColorById(["2545707"], new Glodon.Web.Graphics.Color(237, 116, 121, 1));
        // green
        viewer.overrideComponentsColorById(["2548922"], new Glodon.Web.Graphics.Color(116, 199, 91, 1));

        //viewer.overrideComponentsColorById(["2548589"], new Glodon.Web.Graphics.Color(78, 70, 171, 1));
        viewer.overrideComponentsColorById(["2547739"], new Glodon.Web.Graphics.Color(78, 70, 171, 1));
        viewer.render();

        // 配置Data-GUI
        var myControls;
        myControls = new function () {
            this.spotPX = 24000.234344482422;
            this.spotPY = 150799.96871948242;
            this.spotPZ = 18397;
        };

        var setSpot = function () {
            viewer.getExternalComponentManager().setTransform("spotLight", { x: myControls.spotPX, y: myControls.spotPY, z: myControls.spotPZ });
            viewer.render();
        };

        var gui = new dat.GUI();
        var spotPosition = gui.addFolder("spotPosition");
        spotPosition.add(myControls, 'spotPX', -1000, 24000).onChange(setSpot);
        spotPosition.add(myControls, 'spotPY', -1000, 150799).onChange(setSpot);
        spotPosition.add(myControls, 'spotPZ', -1000, 20000).onChange(setSpot);



        let idx = 1;
        scene.traverseVisible(function (child) {
            if (child instanceof CLOUD.MeshEx || child instanceof CLOUD.Object3DEx || child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.name = idx;
                child.receiveShadow = true;
                if (child.material.length) {
                    // child.material[0].wireframe = true;
                    // child.visible = false;
                    // console.log(child);
                } else {
                    // console.log("----begin----");
                    //child.material.wireframe = true;
                    // console.log("----over----");

                }
                idx++;
            }
        }, true);
        console.log(idx);
    },

    init_model: function () {
        this.viewer.hideViewHouse();
        document.getElementsByClassName('dg ac')[0].style.display = "none";
        document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
        document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
    },
    createTag: function (position, styleClass, text) {
        var config = new Glodon.Bimface.Plugins.Drawable.CustomItemConfig();
        var content = document.createElement('div');
        content.innerHTML = '<div class="leadTips"><div style="width:49px;height:35px;"><img src="https://static.bimface.com/attach/24ce9654e88a4218908f46279e5c4b04_line.png" height="35" width="49"/></div><div  id="canvasDiv" class="' + styleClass + '">' + text + '</div></div>'
        config.content = content;
        config.viewer = viewer;
        config.worldPosition = position;
        var customItem = new Glodon.Bimface.Plugins.Drawable.CustomItem(config);
        this.drawableContainer.addItem(customItem);
    }
}

export { wd_config }