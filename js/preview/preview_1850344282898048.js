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
import { wd_zljf } from '../cfg/wanda_zljf.js'
import { pathAnimation } from '../usr/path_animation.js'
import { Elevator } from '../usr/elevator.js'



var app, viewer;
const SINGLE_FILE = 0;
const INTEGRATION_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
// BimfaceLoaderConfig.viewToken = getURLParameter('viewToken');
getViewtoken(1850344282898048, INTEGRATION_FILE).then((token) => {
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
        // loadScript("https://static.bimface.com/attach/341bb8bde7bf4a5898ecdf58c2a476fb_TDSLoader.js");
        // loadScript("https://static.bimface.com/attach/eb19d39099ef4cf1b53f333a7066694f_inflate.min.js");
        // loadScript("https://static.bimface.com/attach/9b1a9a0eab054241974a2b1c436921bc_FBXLoader.js");
        // 
        // viewer.render();
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            //helper.createAixsHelper(viewer);
            // viewer.enableBlinkComponents(true);
            let scene = getScene(viewer), camera = getPerspectiveCamera(viewer), renderer = getRender(viewer);
            window.myscene = scene;
            document.getElementById('open-button').style.display = 'block';
            viewer.getViewer().rendererManager.renderer.shadowMap.enabled = true;
            viewer.getViewer().rendererManager.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene.children[0].castShadow = true;

            // 万达制冷机房
            wd_zljf.init_zljf(scene, viewer);
            wd_zljf.init_model();

        });
    }
};

function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};