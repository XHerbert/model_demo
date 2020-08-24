
import { WebUtils } from '../usr/WebUtils.js'
import { wd_zljf } from '../cfg/wanda_zljf.js'


var app, viewer;
const INTEGRATION_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtil = new WebUtils();

webUtil.getViewtoken(1850344282898048, INTEGRATION_FILE).then((token) => {
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

        window.viewer = viewer;
        webUtil.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            //helper.createAixsHelper(viewer);
            let scene = webUtil.getScene(), camera = webUtil.getPerspectiveCamera(), renderer = webUtil.getRender();
            window.myscene = scene;
            document.getElementById('open-button').style.display = 'block';
            viewer.getViewer().rendererManager.renderer.renderer.shadowMap.enabled = true;
            viewer.getViewer().rendererManager.renderer.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene.children[0].castShadow = true;
            bindEvent();

            // 万达制冷机房
            wd_zljf.init_zljf(scene, viewer);
            wd_zljf.init_model();

            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, function (e) {

                if (!e.objectId) return;
                if (window.bim.queryCondition) {
                    let condition = viewer.getObjectDataById(e.objectId);
                    webUtil.layerPanel("#json-renderer", "auto", "auto", "筛选条件", 'layui-layer-molv', condition);
                }

                if (window.bim.component) {
                    webUtil.layerPanel("#json-renderer", "auto", undefined, "构件信息", 'layui-layer-lan', e);
                }
            });
        });
    }
};

function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};

function bindEvent() {
    document.getElementById("white").addEventListener("click", () => {
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(234, 234, 234, 1));
        viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }, { "specialty": "结构" }], new Glodon.Web.Graphics.Color(167, 167, 167, 1));
        viewer.overrideComponentsColorByObjectData([{ "specialty": "暖通空调" }], new Glodon.Web.Graphics.Color(248, 226, 31, 1));
        viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2008049" }, { "categoryId": "-2008055" }, { "systemType": "空调送风风管" }, { "systemType": "排油烟管" }, { "systemType": "排烟风管" }, { "systemType": "新风风管" }, { "systemType": "通风排风风管" }, { "systemType": "正压送风风管" }, { "systemType": "回风风管" }, { "systemType": "给水管" }, { "systemType": "补风管" }, { "systemType": "消防供水管" }, { "family": "管道类型" }, { "systemType": "喷淋管" }, { "systemType": "污水管" }, { "systemType": "雨水管" }, { "systemType": "冷、热水回水管" }, { "systemType": "冷凝水管" }, { "systemType": "冷、热水供水管" }], new Glodon.Web.Graphics.Color(13, 173, 247, 1));

        viewer.overrideComponentsColorById(["1850332718385088.5299047"], new Glodon.Web.Graphics.Color(157, 14, 70, 1));
        viewer.overrideComponentsColorById(["1850332718385088.4491258"], new Glodon.Web.Graphics.Color(157, 14, 70, 1));
        viewer.overrideComponentsColorById(["1850332718385088.5300720"], new Glodon.Web.Graphics.Color(113, 162, 160, 1));
        viewer.overrideComponentsColorById(["1850332718385088.4900920"], new Glodon.Web.Graphics.Color(113, 162, 160, 1));
        viewer.overrideComponentsColorById(["1850332718385088.5300592"], new Glodon.Web.Graphics.Color(113, 162, 160, 1));
        viewer.overrideComponentsColorById(["1850332718385088.4901277"], new Glodon.Web.Graphics.Color(157, 14, 70, 1));//热水泵

        viewer.setCameraStatus({
            "name": "persp",
            "position": {
                "x": 26901.74082165596,
                "y": 68238.12140633317,
                "z": 9605.27260912674
            },
            "target": {
                "x": -26628.16725904094,
                "y": 32216.845880673605,
                "z": -55250.891849645945
            },
            "up": {
                "x": -0.588164848827757,
                "y": -0.39579193684720787,
                "z": 0.7052736017533603
            },
            "fov": 45,
            "zoom": 0,
            "version": 1,
            "coordinateSystem": "world"
        });
        viewer.render();
    });
}