/**
 * @author:xuhongbo
 * @function:
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
var hidetoken;

webUtils.getViewtoken(1862968863022880, INTEGRATE_FILE).then((token) => {
    BimfaceLoaderConfig.viewToken = token;
    hidetoken = token;
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
        CLOUD.GlobalData.Renderer = CLOUD.EnumRendererType.FULL;
        viewer.setBackgroundColor = webUtils.fromColor(53, 53, 66, 1);
        webUtils.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {

            let modelHelper = new ModelHelper(viewer);
            //helper.createAixsHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            renderer.domElement.addClass('canvasClass');
            window.myscene = scene;
            renderer.shadowMap.enabled = true;
            viewer.enableShadow(true);
            viewer.setExposureShift(0.0);//曝光会影响色值
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);
            webUtils.initModel();

            viewer.hideAllComponents();
            let showCondition = [];
            let overrideColor = [];
            overrideColor.push({ "specialty": "建筑", "levelName": "B02" }, { "family": "基本墙", "levelName": "B02" }, { "categoryId": "-2001330", "levelName": "B02" }, { "family": "现场浇注楼梯", "levelName": "B02" }, { "family": "整体梯段", "levelName": "B02" });
            showCondition.push({ "categoryId": "-2001040", "levelName": "B02" });
            viewer.showComponentsByObjectData(showCondition.concat(overrideColor));
            viewer.overrideComponentsColorByObjectData(overrideColor, webUtils.fromColor(167, 167, 167, 1));
            viewer.render();

            //相机视角
            setCamera(viewer);

            //TODO:声明下方单击事件中需要的变量
            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, function (e) {
                if (!e.objectId) return;
                if (window.bim.queryCondition) {
                    let condition = viewer.getObjectDataById(e.objectId);
                    webUtils.layerPanel("#json-renderer", "auto", "auto", "筛选条件", 'layui-layer-molv', condition);
                }

                if (window.bim.component) {
                    webUtils.layerPanel("#json-renderer", "auto", undefined, "构件信息", 'layui-layer-lan', e);
                }
                if (window.bim.recordObjectId) {
                    webUtils.copyStringValue(e.objectId);
                }
                //TODO:Click logic

            });
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
            "x": -134513.92419107025,
            "y": -113134.19568564258,
            "z": 234283.14366988678
        },
        "target": {
            "x": 82080.00495402997,
            "y": 103460.53124727444,
            "z": 17690.00106813517
        },
        "up": {
            "x": 0,
            "y": -0.0000036732045631523782,
            "z": 0.9999999999932537
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    };

    let target = {
        "name": "persp",
        "position": {
            "x": -23815.932801721097,
            "y": 162646.09523226146,
            "z": 20639.694402335514
        },
        "target": {
            "x": 250460.47923506817,
            "y": 26271.201956491688,
            "z": -195954.7043794108
        },
        "up": {
            "x": 0.5169713096512818,
            "y": -0.25705141960453465,
            "z": 0.8164957027913446
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    };

    viewer.setCameraStatus(start, () => {
        setTimeout(() => {
            viewer.setCameraStatus(target, () => {
                bindEvent();
                if (callback) {
                    callback();
                };
                viewer.recordCustomedHomeview(target);
            })
        }, 800);
    });
}

function bindEvent() {
    //TODO:bind dom event
}