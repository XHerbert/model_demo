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
import { pathAnimation } from '../usr/path_animation.js'
import { Elevator } from '../usr/elevator.js'



var app, viewer;
const SINGLE_FILE = 0;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
getViewtoken(1862412174108736, SINGLE_FILE).then((token) => {
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
        //雾化颜色
        //viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(204, 224, 255, 1));
        window.viewer = viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            // helper.createAixsHelper(viewer);
            // viewer.enableBlinkComponents(true);
            let scene = getScene(viewer), camera = getPerspectiveCamera(viewer), renderer = getRender(viewer);
            window.myscene = scene;
            document.getElementById('open-button').style.display = 'block';
            viewer.getViewer().rendererManager.renderer.shadowMap.enabled = true;
            viewer.getViewer().rendererManager.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene.children[0].castShadow = true;

            // 万达F01
            wd_config.init_scene(scene, viewer);
            wd_config.init_model();
        });
    }
};

function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};