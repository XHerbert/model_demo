/**
 * @author:xuhongbo
 * @function:wanda water system white
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
var hidetoken;

webUtils.getViewtoken(1874263567704000, INTEGRATE_FILE).then((token) => {
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

            let flag = webUtils.getURLParameter('flag');
            if (flag == 0) {
                let hideCondition = [];
                //此处思考精简
                hideCondition.push({ "specialty": "结构" }, { "familyType": "内墙面5 - 水泥砂浆（防水防霉涂料）墙面 - 16", }, { "specialty": "电气" }, { "specialty": "给排水" }, { "specialty": "暖通空调" }, { "specialty": "消防" }, { "specialty": "装饰" }, { "specialty": "智能化" }, { "specialty": "空间" });
                viewer.hideComponentsByObjectData(hideCondition);

                viewer.showComponentsById(["1771858151688000.5295009"]);
                viewer.overrideComponentsColorById(["1771858151688000.5295009"], webUtils.fromColor(12, 234, 199, 1));
                viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], webUtils.fromColor(167, 167, 167, 1));
            } else if (flag == 1) {
                //配电相关
                let hideCondition = [];

                hideCondition.push(
                    { "familyType": "顶棚8 - 板底刮腻子顶棚 - 2" },
                    { "familyType": "顶棚3 - 水泥砂浆乳胶漆顶棚 - 16" },
                    { "familyType": "顶棚6 - 板底刮腻子（防水防霉涂料）顶棚 - 2" }, { "familyType": "顶棚5 - 板底刮腻子（防水防霉防油涂料）顶棚 - 2" }, { "familyType": "楼面4A - 380防滑地砖防水楼面 - 1.5 - 防水" },
                    { "specialty": "暖通空调" },
                    { "specialty": "消防" }, { "specialty": "装饰" }, { "specialty": "电气" },
                    { "specialty": "智能化" }, { "specialty": "空间" });
                viewer.hideComponentsByObjectData(hideCondition);

                viewer.showComponentsByObjectData([{ "family": "电缆桥架配件" }, { "family": "电缆桥架" }, { "family": "电气设备" }])
                viewer.showComponentsById(["1771858151688000.5294710", "1771858151688000.5294770"]);
                viewer.overrideComponentsColorById(["1771858151688000.5294710", "1771858151688000.5294770"], webUtils.fromColor(12, 234, 199, 1));
                viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], webUtils.fromColor(167, 167, 167, 1));
            } else {
                let hideCondition = [];
                hideCondition.push(
                    { "specialty": "暖通空调" }, { "specialty": "结构" }, { "specialty": "给排水" },
                    { "specialty": "消防" }, { "specialty": "装饰" }, { "specialty": "电气" }, { "familyType": "顶棚6 - 板底刮腻子（防水防霉涂料）顶棚 - 2" },
                    { "specialty": "智能化" }, { "specialty": "空间" });
                viewer.hideComponentsByObjectData(hideCondition);
                viewer.showComponentsById(["1771858151688000.5295315", "1771858151688000.5294356", "1771858151688000.5294550"]);
                viewer.overrideComponentsColorById(["1771858151688000.5295315"], webUtils.fromColor(212, 24, 19, 1));
                viewer.overrideComponentsColorById(["1771858151688000.5294356", "1771858151688000.5294550"], webUtils.fromHexColor("#708090", 0.5));
                viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], webUtils.fromColor(167, 167, 167, 1));
            }

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
            "x": -78486.49207493637,
            "y": -124224.07283052756,
            "z": 180391.6230819797
        },
        "target": {
            "x": 106151.25156954145,
            "y": 60414.35089409518,
            "z": -4245.450062834535
        },
        "up": {
            "x": 0,
            "y": -0.0000036732050583096847,
            "z": 0.9999999999932538
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    };

    let target = {
        "name": "persp",
        "position": {
            "x": -14185.246126477363,
            "y": 7502.177432238632,
            "z": 43613.44126264117
        },
        "target": {
            "x": 170452.49751800043,
            "y": 192140.60115686138,
            "z": -141023.63188217313
        },
        "up": {
            "x": 0,
            "y": -0.0000036732050583096847,
            "z": 0.9999999999932538
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
    document.getElementById('elctric').addEventListener("click", function () {

    });
}