/**
 * @author:xuhongbo
 * @function:wanda
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
var hidetoken;

webUtils.getViewtoken(1938169418687136, INTEGRATE_FILE).then((token) => {
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

        viewer.setBorderLineEnabled(true);
        window.viewer = viewer;
        viewer.setBackgroundColor = webUtils.fromColor(53, 53, 66, 1);
        webUtils.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {

            let modelHelper = new ModelHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            renderer.domElement.addClass('canvasClass');
            window.myscene = scene;
            renderer.shadowMap.enabled = true;
            viewer.enableShadow(false);
            viewer.setExposureShift(0.0);//曝光会影响色值
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);
            webUtils.initModel();
            buildCondition(viewer);
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
        //TODO:设置模型起始视角    
    };

    let target = {
        //TODO:设置模型最终视角
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

function buildCondition(viewer) {
    viewer.hideAllComponents();
    let showCondition = [];
    let hideCondition = [];
    showCondition.push({ "categoryId": "-2001320", "levelName": "B01" });//结构框架 - 排除{"family": "砼梁梯"}
    showCondition.push({ "categoryId": "-2001140", "levelName": "B01" });//机械设备 - 排除{"family": "FSHB-消火栓连体箱"}
    showCondition.push({ "familyType": "地下室外墙 - 300", "levelName": "B01" }, { "familyType": "地下室外墙 - 350", "levelName": "B01" }, { "familyType": "外墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M5.0 - 200", "levelName": "B01" });//B01墙
    showCondition.push({ "familyType": "砼板 - 200", "levelName": "B01" }, { "familyType": "砼板 - 350", "levelName": "B01" }, { "familyType": "砼板 - 550", "levelName": "B01" }, { "familyType": "砼板 - 250", "levelName": "B01" }, { "familyType": "砼板 - 180", "levelName": "B01" }, { "familyType": "砼板 - 300", "levelName": "B01" }, { "familyType": "砼板 - 500", "levelName": "B01" }, { "familyType": "砼板 - 120", "levelName": "B01" }, { "familyType": "砼板 - 150", "levelName": "B01" });//B01楼板
    viewer.showComponentsByObjectData(showCondition);

    hideCondition.push({ "familyType": "消火栓连体箱", "levelName": "B01" });
    viewer.hideComponentsByObjectData(hideCondition);
    viewer.render();
}