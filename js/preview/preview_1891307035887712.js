/**
 * @author:xuhongbo
 * @function:wanda F01 effiective
 */

import { WebUtils } from '../usr/WebUtils.js'

var app, viewer;
const SINGLE_FILE = 0;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
webUtils.getViewtoken(1891307035887712, SINGLE_FILE).then((token) => {
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
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1), new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 0.5));
        viewer.setBorderLineEnabled(false);
        //雾化颜色
        //viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(204, 224, 255, 1));
        window.viewer = viewer;
        webUtils.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            // helper.createAixsHelper(viewer);
            let scene = webUtils.getScene(), camera = webUtils.getPerspectiveCamera(), renderer = webUtils.getRender();
            window.myscene = scene;
            document.getElementById('open-button').style.display = 'block';
            viewer.getViewer().rendererManager.renderer.renderer.shadowMap.enabled = true;
            viewer.getViewer().rendererManager.renderer.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene.children[0].castShadow = true;

            viewer.setBackgroundColor(new Glodon.Web.Graphics.Color("#333333"));
            //空间
            viewer.overrideComponentsColorById(["2933839"], new Glodon.Web.Graphics.Color(117, 78, 56, 0.7));
            viewer.overrideComponentsColorById(["2935384"], new Glodon.Web.Graphics.Color(133, 36, 48, 0.6));
            viewer.overrideComponentsColorById(["2932489"], new Glodon.Web.Graphics.Color(255, 255, 255, 0.61));
            viewer.overrideComponentsColorById(["2934706"], new Glodon.Web.Graphics.Color(133, 36, 48, 0.6));

            //设备
            viewer.overrideComponentsColorById(["1765452"], new Glodon.Web.Graphics.Color(255, 31, 18, 0.8));
            viewer.overrideComponentsColorById(["2263790"], new Glodon.Web.Graphics.Color(255, 31, 18, 0.8));

            //平面
            var planeGeometry = new THREE.PlaneGeometry(20000, 20000, 20, 20);
            var planeMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true
            });
            var plane = new THREE.Mesh(planeGeometry, planeMaterial);
            viewer.addExternalObject("plane", plane);


            viewer.render();
        });
    }
};

function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};