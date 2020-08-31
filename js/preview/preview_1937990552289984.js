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

webUtils.getViewtoken(1937990552289984, INTEGRATE_FILE).then((token) => {
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

        viewer.setBorderLineEnabled(true);

        window.viewer = viewer;
        webUtils.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            let modelHelper = new ModelHelper(viewer);
            //helper.createAixsHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            renderer.domElement.addClass('canvasClass');
            window.myscene = scene;
            renderer.shadowMap.enabled = true;
            viewer.enableShadow(false);
            viewer.setExposureShift(0.0);//曝光会影响色值
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);
            // viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(234, 234, 234, 1));
            // viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(46, 65, 84, 1));

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);

            // 轮廓线不明显
            viewer.overrideComponentsFrameColorByObjectData([], new Glodon.Web.Graphics.Color(214, 214, 214, 0.6));//214

            // 建筑
            viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], new Glodon.Web.Graphics.Color(167, 167, 167, 0.1));

            // 机械设备
            viewer.overrideComponentsColorByObjectData([{ "familyType": "机械设备" }], new Glodon.Web.Graphics.Color(248, 226, 31, 1));

            // 机械设备 - 管道
            viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2008000" }, { "categoryId": "-2001140" }, { "categoryId": "-2008122" }, { "categoryId": "-2001160" }, { "categoryId": "-2008010" }, { "categoryId": "-2008049" }, { "categoryId": "-2008044" }], new Glodon.Web.Graphics.Color(13, 173, 247, 1));

            //手动调整设备颜色
            viewer.overrideComponentsColorById(["1771855777580864.4711684"], new Glodon.Web.Graphics.Color(157, 14, 70, 1));
            viewer.overrideComponentsColorById(["1771855777580864.4711685"], new Glodon.Web.Graphics.Color(113, 162, 160, 1));

            drawArea(viewer);


            //基础设置
            viewer.hideViewHouse();
            document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
            document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
            document.getElementById('open-button').style.display = 'block';

            //相机视角
            setCamera(viewer);

            document.getElementById("white").addEventListener("click", function () {
                singleFloor(viewer);
            });

            document.getElementById("blue").addEventListener("click", function () {
                water();
            })

            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, function (e) {

                if (!e.objectId) return;
                if (window.bim.queryCondition) {
                    let condition = viewer.getObjectDataById(e.objectId);
                    webUtils.layerPanel("#json-renderer", "auto", "auto", "筛选条件", 'layui-layer-molv', condition);
                }

                if (window.bim.component) {
                    webUtils.layerPanel("#json-renderer", "auto", undefined, "构件信息", 'layui-layer-lan', e);
                }

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
            "x": -52217.15707794107,
            "y": -101089.74056823357,
            "z": 181791.32205288325
        },
        "target": {
            "x": 106446.99686331685,
            "y": 57574.99830420925,
            "z": 23127.7493188045
        },
        "up": {
            "x": 0,
            "y": -0.0000036732052505499887,
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
            "x": -58466.900361232,
            "y": -65841.548494197,
            "z": 45386.62036006717
        },
        "target": {
            "x": 121256.04813040385,
            "y": 135725.8053610624,
            "z": -5536.867116585027
        },
        "up": {
            "x": 0.1233208337926485,
            "y": 0.13830611258904568,
            "z": 0.9826817344253389
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

function drawArea(viewer) {
    let dashangye6 = { "version": "2.0", "loops": [[[{ "z": -10699.999571472328, "y": 141899.99275585884, "x": 147749.99408271411 }, { "z": -10699.999571472328, "y": 141899.99275585884, "x": 146849.99411875923 }], [{ "z": -10699.999571472328, "y": 141899.99275585884, "x": 146849.99411875923 }, { "z": -10699.999571472328, "y": 136750.048281431, "x": 146749.99412276418 }], [{ "z": -10699.999571472328, "y": 136750.048281431, "x": 146749.99412276418 }, { "z": -10699.999571472328, "y": 136750.048281431, "x": 151249.89168745661 }], [{ "z": -10699.999571472328, "y": 136750.048281431, "x": 151249.89168745661 }, { "z": -10699.999571472328, "y": 140183.34459762424, "x": 151349.89168345169 }], [{ "z": -10699.999571472328, "y": 140183.34459762424, "x": 151349.89168345169 }, { "z": -10699.999571472328, "y": 141899.99275585884, "x": 151399.89168145327 }], [{ "z": -10699.999571472328, "y": 141899.99275585884, "x": 151399.89168145327 }, { "z": -10699.999571472328, "y": 141899.99275585884, "x": 150999.99432542175 }], [{ "z": -10699.999571472328, "y": 141899.99275585884, "x": 150999.99432542175 }, { "z": -10699.999571472328, "y": 141899.99275585884, "x": 147749.99408271411 }]]] };

    let jiudianzhongshui = { "version": "2.0", "loops": [[[{ "z": -10699.999571472328, "y": 108549.99565264684, "x": 10451.601528169891 }, { "z": -10699.999571472328, "y": 108549.99565264684, "x": 18500.017618577625 }], [{ "z": -10699.999571472328, "y": 108549.99565264684, "x": 18500.017618577625 }, { "z": -10699.999571472328, "y": 116699.99525929277, "x": 18500.017618577625 }], [{ "z": -10699.999571472328, "y": 116699.99525929277, "x": 18500.017618577625 }, { "z": -10699.999571472328, "y": 116699.99525929277, "x": 15957.746474183112 }], [{ "z": -10699.999571472328, "y": 116699.99525929277, "x": 15957.746474183112 }, { "z": -10699.999571472328, "y": 116699.99525929277, "x": 14457.746534257083 }], [{ "z": -10699.999571472328, "y": 116699.99525929277, "x": 14457.746534257083 }, { "z": -10699.999571472328, "y": 116699.99525929277, "x": 10450.006255997865 }], [{ "z": -10699.999571472328, "y": 116699.99525929277, "x": 10450.006255997865 }, { "z": -10699.999571472328, "y": 108549.99565264684, "x": 10450.006255997865 }], [{ "z": -10699.999571472328, "y": 108549.99565264684, "x": 10450.006255997865 }, { "z": -10699.999571472328, "y": 108549.99565264684, "x": 10451.601528169891 }]], [[{ "z": -10699.999571472328, "y": 115619.99536626029, "x": 17379.989171427362 }, { "z": -10699.999571472328, "y": 115619.99536626029, "x": 17619.989161815523 }], [{ "z": -10699.999571472328, "y": 115619.99536626029, "x": 17619.989161815523 }, { "z": -10699.999571472328, "y": 111879.99551604473, "x": 17619.989161815523 }], [{ "z": -10699.999571472328, "y": 111879.99551604473, "x": 17619.989161815523 }, { "z": -10699.999571472328, "y": 111879.99551604473, "x": 17379.989171427362 }], [{ "z": -10699.999571472328, "y": 111879.99551604473, "x": 17379.989171427362 }, { "z": -10699.999571472328, "y": 115619.99536626029, "x": 17379.989171427362 }]], [[{ "z": -10699.999571472328, "y": 115619.99536626029, "x": 16379.989211476675 }, { "z": -10699.999571472328, "y": 115619.99536626029, "x": 16619.989201864839 }], [{ "z": -10699.999571472328, "y": 115619.99536626029, "x": 16619.989201864839 }, { "z": -10699.999571472328, "y": 111879.99551604473, "x": 16619.989201864839 }], [{ "z": -10699.999571472328, "y": 111879.99551604473, "x": 16619.989201864839 }, { "z": -10699.999571472328, "y": 111879.99551604473, "x": 16379.989211476675 }], [{ "z": -10699.999571472328, "y": 111879.99551604473, "x": 16379.989211476675 }, { "z": -10699.999571472328, "y": 115619.99536626029, "x": 16379.989211476675 }]], [[{ "z": -10699.999571472328, "y": 115619.99536626029, "x": 15379.989251525991 }, { "z": -10699.999571472328, "y": 115619.99536626029, "x": 15619.989241914154 }], [{ "z": -10699.999571472328, "y": 115619.99536626029, "x": 15619.989241914154 }, { "z": -10699.999571472328, "y": 111879.99551604473, "x": 15619.989241914154 }], [{ "z": -10699.999571472328, "y": 111879.99551604473, "x": 15619.989241914154 }, { "z": -10699.999571472328, "y": 111879.99551604473, "x": 15379.989251525991 }], [{ "z": -10699.999571472328, "y": 111879.99551604473, "x": 15379.989251525991 }, { "z": -10699.999571472328, "y": 115619.99536626029, "x": 15379.989251525991 }]], [[{ "z": -10699.999571472328, "y": 115619.99536626029, "x": 14379.989291575306 }, { "z": -10699.999571472328, "y": 115619.99536626029, "x": 14619.98928196347 }], [{ "z": -10699.999571472328, "y": 115619.99536626029, "x": 14619.98928196347 }, { "z": -10699.999571472328, "y": 111879.99551604473, "x": 14619.98928196347 }], [{ "z": -10699.999571472328, "y": 111879.99551604473, "x": 14619.98928196347 }, { "z": -10699.999571472328, "y": 111879.99551604473, "x": 14379.989291575306 }], [{ "z": -10699.999571472328, "y": 111879.99551604473, "x": 14379.989291575306 }, { "z": -10699.999571472328, "y": 115619.99536626029, "x": 14379.989291575306 }]], [[{ "z": -10699.999571472328, "y": 115619.99536626029, "x": 13379.989331624622 }, { "z": -10699.999571472328, "y": 115619.99536626029, "x": 13619.989322012785 }], [{ "z": -10699.999571472328, "y": 115619.99536626029, "x": 13619.989322012785 }, { "z": -10699.999571472328, "y": 111879.99551604473, "x": 13619.989322012785 }], [{ "z": -10699.999571472328, "y": 111879.99551604473, "x": 13619.989322012785 }, { "z": -10699.999571472328, "y": 111879.99551604473, "x": 13379.989331624622 }], [{ "z": -10699.999571472328, "y": 111879.99551604473, "x": 13379.989331624622 }, { "z": -10699.999571472328, "y": 115619.99536626029, "x": 13379.989331624622 }]], [[{ "z": -10699.999571472328, "y": 115619.99536626029, "x": 12379.989371673937 }, { "z": -10699.999571472328, "y": 115619.99536626029, "x": 12619.9893620621 }], [{ "z": -10699.999571472328, "y": 115619.99536626029, "x": 12619.9893620621 }, { "z": -10699.999571472328, "y": 111879.99551604473, "x": 12619.9893620621 }], [{ "z": -10699.999571472328, "y": 111879.99551604473, "x": 12619.9893620621 }, { "z": -10699.999571472328, "y": 111879.99551604473, "x": 12379.989371673937 }], [{ "z": -10699.999571472328, "y": 111879.99551604473, "x": 12379.989371673937 }, { "z": -10699.999571472328, "y": 115619.99536626029, "x": 12379.989371673937 }]], [[{ "z": -10699.999571472328, "y": 115619.99536626029, "x": 11379.989411723251 }, { "z": -10699.999571472328, "y": 115619.99536626029, "x": 11619.989402111416 }], [{ "z": -10699.999571472328, "y": 115619.99536626029, "x": 11619.989402111416 }, { "z": -10699.999571472328, "y": 111879.99551604473, "x": 11619.989402111416 }], [{ "z": -10699.999571472328, "y": 111879.99551604473, "x": 11619.989402111416 }, { "z": -10699.999571472328, "y": 111879.99551604473, "x": 11379.989411723251 }], [{ "z": -10699.999571472328, "y": 111879.99551604473, "x": 11379.989411723251 }, { "z": -10699.999571472328, "y": 115619.99536626029, "x": 11379.989411723251 }]]] };

    let shangye = { "version": "2.0", "loops": [[[{ "z": -10699.999571472328, "y": 24249.999028804035, "x": 71499.997136475024 }, { "z": -10699.999571472328, "y": 24249.999028804035, "x": 54949.997799290417 }], [{ "z": -10699.999571472328, "y": 24249.999028804035, "x": 54949.997799290417 }, { "z": -10699.999571472328, "y": 15399.999383240458, "x": 54949.997799290417 }], [{ "z": -10699.999571472328, "y": 15399.999383240458, "x": 54949.997799290417 }, { "z": -10699.999571472328, "y": 8599.9996555757134, "x": 54949.997799290417 }], [{ "z": -10699.999571472328, "y": 8599.9996555757134, "x": 54949.997799290417 }, { "z": -10699.999571472328, "y": 8299.9996675924685, "x": 54949.997799290417 }], [{ "z": -10699.999571472328, "y": 8299.9996675924685, "x": 54949.997799290417 }, { "z": -10699.999571472328, "y": 8299.9996675924685, "x": 55199.997789278241 }], [{ "z": -10699.999571472328, "y": 8299.9996675924685, "x": 55199.997789278241 }, { "z": -10699.999571472328, "y": 8299.9996675924685, "x": 62799.997484903448 }], [{ "z": -10699.999571472328, "y": 8299.9996675924685, "x": 62799.997484903448 }, { "z": -10699.999571472328, "y": 8299.9996675924685, "x": 63599.997452863994 }], [{ "z": -10699.999571472328, "y": 8299.9996675924685, "x": 63599.997452863994 }, { "z": -10699.999571472328, "y": 8299.9996675924685, "x": 71199.9971484892 }], [{ "z": -10699.999571472328, "y": 8299.9996675924685, "x": 71199.9971484892 }, { "z": -10699.999571472328, "y": 8299.9996675924685, "x": 71499.997136475024 }], [{ "z": -10699.999571472328, "y": 8299.9996675924685, "x": 71499.997136475024 }, { "z": -10699.999571472328, "y": 16399.999343191124, "x": 71499.997136475024 }], [{ "z": -10699.999571472328, "y": 16399.999343191124, "x": 71499.997136475024 }, { "z": -10699.999571472328, "y": 24249.999028804035, "x": 71499.997136475024 }]], [[{ "z": -10699.999571472328, "y": 9179.9996323473442, "x": 55679.516984006746 }, { "z": -10699.999571472328, "y": 14420.295273734837, "x": 55679.516984006746 }], [{ "z": -10699.999571472328, "y": 14420.295273734837, "x": 55679.516984006746 }, { "z": -10699.999571472328, "y": 14420.295273734837, "x": 55919.997760443439 }], [{ "z": -10699.999571472328, "y": 14420.295273734837, "x": 55919.997760443439 }, { "z": -10699.999571472328, "y": 9179.9996323473442, "x": 55919.997760443439 }], [{ "z": -10699.999571472328, "y": 9179.9996323473442, "x": 55919.997760443439 }, { "z": -10699.999571472328, "y": 9179.9996323473442, "x": 55679.516984006746 }]], [[{ "z": -10699.999571472328, "y": 9179.9996323473424, "x": 56679.516943957431 }, { "z": -10699.999571472328, "y": 14420.295273734833, "x": 56679.516943957431 }], [{ "z": -10699.999571472328, "y": 14420.295273734833, "x": 56679.516943957431 }, { "z": -10699.999571472328, "y": 14420.295273734833, "x": 56919.997720394116 }], [{ "z": -10699.999571472328, "y": 14420.295273734833, "x": 56919.997720394116 }, { "z": -10699.999571472328, "y": 9179.9996323473424, "x": 56919.997720394116 }], [{ "z": -10699.999571472328, "y": 9179.9996323473424, "x": 56919.997720394116 }, { "z": -10699.999571472328, "y": 9179.9996323473424, "x": 56679.516943957431 }]], [[{ "z": -10699.999571472328, "y": 9179.9996323473388, "x": 57679.516903908116 }, { "z": -10699.999571472328, "y": 14420.295273734831, "x": 57679.516903908116 }], [{ "z": -10699.999571472328, "y": 14420.295273734831, "x": 57679.516903908116 }, { "z": -10699.999571472328, "y": 14420.295273734831, "x": 57919.9976803448 }], [{ "z": -10699.999571472328, "y": 14420.295273734831, "x": 57919.9976803448 }, { "z": -10699.999571472328, "y": 9179.9996323473388, "x": 57919.9976803448 }], [{ "z": -10699.999571472328, "y": 9179.9996323473388, "x": 57919.9976803448 }, { "z": -10699.999571472328, "y": 9179.9996323473388, "x": 57679.516903908116 }]], [[{ "z": -10699.999571472328, "y": 9179.999632347337, "x": 58679.5168638588 }, { "z": -10699.999571472328, "y": 14420.29527373483, "x": 58679.5168638588 }], [{ "z": -10699.999571472328, "y": 14420.29527373483, "x": 58679.5168638588 }, { "z": -10699.999571472328, "y": 14420.29527373483, "x": 58919.997640295493 }], [{ "z": -10699.999571472328, "y": 14420.29527373483, "x": 58919.997640295493 }, { "z": -10699.999571472328, "y": 9179.999632347337, "x": 58919.997640295493 }], [{ "z": -10699.999571472328, "y": 9179.999632347337, "x": 58919.997640295493 }, { "z": -10699.999571472328, "y": 9179.999632347337, "x": 58679.5168638588 }]], [[{ "z": -10699.999571472328, "y": 9179.9996323473351, "x": 59679.997609858045 }, { "z": -10699.999571472328, "y": 14420.295273734828, "x": 59679.997609858045 }], [{ "z": -10699.999571472328, "y": 14420.295273734828, "x": 59679.997609858045 }, { "z": -10699.999571472328, "y": 14420.295273734828, "x": 59920.478386294737 }], [{ "z": -10699.999571472328, "y": 14420.295273734828, "x": 59920.478386294737 }, { "z": -10699.999571472328, "y": 9179.9996323473351, "x": 59920.478386294737 }], [{ "z": -10699.999571472328, "y": 9179.9996323473351, "x": 59920.478386294737 }, { "z": -10699.999571472328, "y": 9179.9996323473351, "x": 59679.997609858045 }]], [[{ "z": -10699.999571472328, "y": 9179.9996323473333, "x": 60679.516783760169 }, { "z": -10699.999571472328, "y": 14420.295273734826, "x": 60679.516783760169 }], [{ "z": -10699.999571472328, "y": 14420.295273734826, "x": 60679.516783760169 }, { "z": -10699.999571472328, "y": 14420.295273734826, "x": 60919.997560196854 }], [{ "z": -10699.999571472328, "y": 14420.295273734826, "x": 60919.997560196854 }, { "z": -10699.999571472328, "y": 9179.9996323473333, "x": 60919.997560196854 }], [{ "z": -10699.999571472328, "y": 9179.9996323473333, "x": 60919.997560196854 }, { "z": -10699.999571472328, "y": 9179.9996323473333, "x": 60679.516783760169 }]], [[{ "z": -10699.999571472328, "y": 9179.9996323473315, "x": 61679.516743710854 }, { "z": -10699.999571472328, "y": 14420.295273734822, "x": 61679.516743710854 }], [{ "z": -10699.999571472328, "y": 14420.295273734822, "x": 61679.516743710854 }, { "z": -10699.999571472328, "y": 14420.295273734822, "x": 61919.997520147539 }], [{ "z": -10699.999571472328, "y": 14420.295273734822, "x": 61919.997520147539 }, { "z": -10699.999571472328, "y": 9179.9996323473315, "x": 61919.997520147539 }], [{ "z": -10699.999571472328, "y": 9179.9996323473315, "x": 61919.997520147539 }, { "z": -10699.999571472328, "y": 9179.9996323473315, "x": 61679.516743710854 }]], [[{ "z": -10699.999571472328, "y": 9179.99963234733, "x": 62679.516703661546 }, { "z": -10699.999571472328, "y": 14420.295273734821, "x": 62679.516703661546 }], [{ "z": -10699.999571472328, "y": 14420.295273734821, "x": 62679.516703661546 }, { "z": -10699.999571472328, "y": 14420.295273734821, "x": 62919.997480098231 }], [{ "z": -10699.999571472328, "y": 14420.295273734821, "x": 62919.997480098231 }, { "z": -10699.999571472328, "y": 9179.99963234733, "x": 62919.997480098231 }], [{ "z": -10699.999571472328, "y": 9179.99963234733, "x": 62919.997480098231 }, { "z": -10699.999571472328, "y": 9179.99963234733, "x": 62679.516703661546 }]], [[{ "z": -10699.999571472328, "y": 9179.999632347326, "x": 63679.516663612223 }, { "z": -10699.999571472328, "y": 14420.295273734819, "x": 63679.516663612223 }], [{ "z": -10699.999571472328, "y": 14420.295273734819, "x": 63679.516663612223 }, { "z": -10699.999571472328, "y": 14420.295273734819, "x": 63919.997440048915 }], [{ "z": -10699.999571472328, "y": 14420.295273734819, "x": 63919.997440048915 }, { "z": -10699.999571472328, "y": 9179.999632347326, "x": 63919.997440048915 }], [{ "z": -10699.999571472328, "y": 9179.999632347326, "x": 63919.997440048915 }, { "z": -10699.999571472328, "y": 9179.999632347326, "x": 63679.516663612223 }]], [[{ "z": -10699.999571472328, "y": 9179.9996323473242, "x": 64679.516623562908 }, { "z": -10699.999571472328, "y": 14420.295273734817, "x": 64679.516623562908 }], [{ "z": -10699.999571472328, "y": 14420.295273734817, "x": 64679.516623562908 }, { "z": -10699.999571472328, "y": 14420.295273734817, "x": 64919.9973999996 }], [{ "z": -10699.999571472328, "y": 14420.295273734817, "x": 64919.9973999996 }, { "z": -10699.999571472328, "y": 9179.9996323473242, "x": 64919.9973999996 }], [{ "z": -10699.999571472328, "y": 9179.9996323473242, "x": 64919.9973999996 }, { "z": -10699.999571472328, "y": 9179.9996323473242, "x": 64679.516623562908 }]], [[{ "z": -10699.999571472328, "y": 9179.9996323473224, "x": 65679.516583513585 }, { "z": -10699.999571472328, "y": 14420.295273734815, "x": 65679.516583513585 }], [{ "z": -10699.999571472328, "y": 14420.295273734815, "x": 65679.516583513585 }, { "z": -10699.999571472328, "y": 14420.295273734815, "x": 65919.997359950285 }], [{ "z": -10699.999571472328, "y": 14420.295273734815, "x": 65919.997359950285 }, { "z": -10699.999571472328, "y": 9179.9996323473224, "x": 65919.997359950285 }], [{ "z": -10699.999571472328, "y": 9179.9996323473224, "x": 65919.997359950285 }, { "z": -10699.999571472328, "y": 9179.9996323473224, "x": 65679.516583513585 }]], [[{ "z": -10699.999571472328, "y": 9179.99963234732, "x": 66679.516543464284 }, { "z": -10699.999571472328, "y": 14420.295273734813, "x": 66679.516543464284 }], [{ "z": -10699.999571472328, "y": 14420.295273734813, "x": 66679.516543464284 }, { "z": -10699.999571472328, "y": 14420.295273734813, "x": 66919.997319900969 }], [{ "z": -10699.999571472328, "y": 14420.295273734813, "x": 66919.997319900969 }, { "z": -10699.999571472328, "y": 9179.99963234732, "x": 66919.997319900969 }], [{ "z": -10699.999571472328, "y": 9179.99963234732, "x": 66919.997319900969 }, { "z": -10699.999571472328, "y": 9179.99963234732, "x": 66679.516543464284 }]], [[{ "z": -10699.999571472328, "y": 9179.9996323473188, "x": 67679.9972894635 }, { "z": -10699.999571472328, "y": 14420.29527373481, "x": 67679.9972894635 }], [{ "z": -10699.999571472328, "y": 14420.29527373481, "x": 67679.9972894635 }, { "z": -10699.999571472328, "y": 14420.29527373481, "x": 67920.478065900184 }], [{ "z": -10699.999571472328, "y": 14420.29527373481, "x": 67920.478065900184 }, { "z": -10699.999571472328, "y": 9179.9996323473188, "x": 67920.478065900184 }], [{ "z": -10699.999571472328, "y": 9179.9996323473188, "x": 67920.478065900184 }, { "z": -10699.999571472328, "y": 9179.9996323473188, "x": 67679.9972894635 }]], [[{ "z": -10699.999571472328, "y": 9179.9996323473151, "x": 68679.516463365653 }, { "z": -10699.999571472328, "y": 14420.295273734808, "x": 68679.516463365653 }], [{ "z": -10699.999571472328, "y": 14420.295273734808, "x": 68679.516463365653 }, { "z": -10699.999571472328, "y": 14420.295273734808, "x": 68919.997239802338 }], [{ "z": -10699.999571472328, "y": 14420.295273734808, "x": 68919.997239802338 }, { "z": -10699.999571472328, "y": 9179.9996323473151, "x": 68919.997239802338 }], [{ "z": -10699.999571472328, "y": 9179.9996323473151, "x": 68919.997239802338 }, { "z": -10699.999571472328, "y": 9179.9996323473151, "x": 68679.516463365653 }]], [[{ "z": -10699.999571472328, "y": 9179.9996323473133, "x": 69679.516423316352 }, { "z": -10699.999571472328, "y": 14420.295273734806, "x": 69679.516423316352 }], [{ "z": -10699.999571472328, "y": 14420.295273734806, "x": 69679.516423316352 }, { "z": -10699.999571472328, "y": 14420.295273734806, "x": 69919.997199753037 }], [{ "z": -10699.999571472328, "y": 14420.295273734806, "x": 69919.997199753037 }, { "z": -10699.999571472328, "y": 9179.9996323473133, "x": 69919.997199753037 }], [{ "z": -10699.999571472328, "y": 9179.9996323473133, "x": 69919.997199753037 }, { "z": -10699.999571472328, "y": 9179.9996323473133, "x": 69679.516423316352 }]], [[{ "z": -10699.999571472328, "y": 16979.999319962692, "x": 55679.8837126094 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 55679.8837126094 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 55679.8837126094 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 55919.997760443417 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 55919.997760443417 }, { "z": -10699.999571472328, "y": 16979.999319962692, "x": 55919.997760443417 }], [{ "z": -10699.999571472328, "y": 16979.999319962692, "x": 55919.997760443417 }, { "z": -10699.999571472328, "y": 16979.999319962692, "x": 55679.8837126094 }]], [[{ "z": -10699.999571472328, "y": 16979.999319962692, "x": 56679.8836725601 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 56679.8836725601 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 56679.8836725601 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 56919.997720394116 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 56919.997720394116 }, { "z": -10699.999571472328, "y": 16979.999319962692, "x": 56919.997720394116 }], [{ "z": -10699.999571472328, "y": 16979.999319962692, "x": 56919.997720394116 }, { "z": -10699.999571472328, "y": 16979.999319962692, "x": 56679.8836725601 }]], [[{ "z": -10699.999571472328, "y": 16979.999319962688, "x": 57679.883632510784 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 57679.883632510784 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 57679.883632510784 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 57919.9976803448 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 57919.9976803448 }, { "z": -10699.999571472328, "y": 16979.999319962688, "x": 57919.9976803448 }], [{ "z": -10699.999571472328, "y": 16979.999319962688, "x": 57919.9976803448 }, { "z": -10699.999571472328, "y": 16979.999319962688, "x": 57679.883632510784 }]], [[{ "z": -10699.999571472328, "y": 16979.999319962688, "x": 58679.883592461461 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 58679.883592461461 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 58679.883592461461 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 58919.997640295485 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 58919.997640295485 }, { "z": -10699.999571472328, "y": 16979.999319962688, "x": 58919.997640295485 }], [{ "z": -10699.999571472328, "y": 16979.999319962688, "x": 58919.997640295485 }, { "z": -10699.999571472328, "y": 16979.999319962688, "x": 58679.883592461461 }]], [[{ "z": -10699.999571472328, "y": 16979.999319962684, "x": 59679.883552412146 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 59679.883552412146 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 59679.883552412146 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 59919.99760024617 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 59919.99760024617 }, { "z": -10699.999571472328, "y": 16979.999319962684, "x": 59919.99760024617 }], [{ "z": -10699.999571472328, "y": 16979.999319962684, "x": 59919.99760024617 }, { "z": -10699.999571472328, "y": 16979.999319962684, "x": 59679.883552412146 }]], [[{ "z": -10699.999571472328, "y": 16979.999319962681, "x": 60679.883512362831 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 60679.883512362831 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 60679.883512362831 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 60919.997560196847 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 60919.997560196847 }, { "z": -10699.999571472328, "y": 16979.999319962681, "x": 60919.997560196847 }], [{ "z": -10699.999571472328, "y": 16979.999319962681, "x": 60919.997560196847 }, { "z": -10699.999571472328, "y": 16979.999319962681, "x": 60679.883512362831 }]], [[{ "z": -10699.999571472328, "y": 16979.999319962681, "x": 61679.883472313515 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 61679.883472313515 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 61679.883472313515 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 61919.997520147532 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 61919.997520147532 }, { "z": -10699.999571472328, "y": 16979.999319962681, "x": 61919.997520147532 }], [{ "z": -10699.999571472328, "y": 16979.999319962681, "x": 61919.997520147532 }, { "z": -10699.999571472328, "y": 16979.999319962681, "x": 61679.883472313515 }]], [[{ "z": -10699.999571472328, "y": 16979.999319962677, "x": 62679.883432264192 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 62679.883432264192 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 62679.883432264192 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 62919.997480098216 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 62919.997480098216 }, { "z": -10699.999571472328, "y": 16979.999319962677, "x": 62919.997480098216 }], [{ "z": -10699.999571472328, "y": 16979.999319962677, "x": 62919.997480098216 }, { "z": -10699.999571472328, "y": 16979.999319962677, "x": 62679.883432264192 }]], [[{ "z": -10699.999571472328, "y": 16979.999319962677, "x": 63679.883392214877 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 63679.883392214877 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 63679.883392214877 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 63919.9974400489 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 63919.9974400489 }, { "z": -10699.999571472328, "y": 16979.999319962677, "x": 63919.9974400489 }], [{ "z": -10699.999571472328, "y": 16979.999319962677, "x": 63919.9974400489 }, { "z": -10699.999571472328, "y": 16979.999319962677, "x": 63679.883392214877 }]], [[{ "z": -10699.999571472328, "y": 16979.999319962673, "x": 64679.883352165576 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 64679.883352165576 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 64679.883352165576 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 64919.9973999996 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 64919.9973999996 }, { "z": -10699.999571472328, "y": 16979.999319962673, "x": 64919.9973999996 }], [{ "z": -10699.999571472328, "y": 16979.999319962673, "x": 64919.9973999996 }, { "z": -10699.999571472328, "y": 16979.999319962673, "x": 64679.883352165576 }]], [[{ "z": -10699.999571472328, "y": 16979.99931996267, "x": 65679.883312116261 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 65679.883312116261 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 65679.883312116261 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 65919.997359950285 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 65919.997359950285 }, { "z": -10699.999571472328, "y": 16979.99931996267, "x": 65919.997359950285 }], [{ "z": -10699.999571472328, "y": 16979.99931996267, "x": 65919.997359950285 }, { "z": -10699.999571472328, "y": 16979.99931996267, "x": 65679.883312116261 }]], [[{ "z": -10699.999571472328, "y": 16979.99931996267, "x": 66679.883272066945 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 66679.883272066945 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 66679.883272066945 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 66919.997319900969 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 66919.997319900969 }, { "z": -10699.999571472328, "y": 16979.99931996267, "x": 66919.997319900969 }], [{ "z": -10699.999571472328, "y": 16979.99931996267, "x": 66919.997319900969 }, { "z": -10699.999571472328, "y": 16979.99931996267, "x": 66679.883272066945 }]], [[{ "z": -10699.999571472328, "y": 16979.999319962666, "x": 67679.88323201763 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 67679.88323201763 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 67679.88323201763 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 67919.997279851639 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 67919.997279851639 }, { "z": -10699.999571472328, "y": 16979.999319962666, "x": 67919.997279851639 }], [{ "z": -10699.999571472328, "y": 16979.999319962666, "x": 67919.997279851639 }, { "z": -10699.999571472328, "y": 16979.999319962666, "x": 67679.88323201763 }]], [[{ "z": -10699.999571472328, "y": 16979.999319962666, "x": 68679.883191968314 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 68679.883191968314 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 68679.883191968314 }, { "z": -10699.999571472328, "y": 23720.069605586195, "x": 68919.997239802324 }], [{ "z": -10699.999571472328, "y": 23720.069605586195, "x": 68919.997239802324 }, { "z": -10699.999571472328, "y": 16979.999319962666, "x": 68919.997239802324 }], [{ "z": -10699.999571472328, "y": 16979.999319962666, "x": 68919.997239802324 }, { "z": -10699.999571472328, "y": 16979.999319962666, "x": 68679.883191968314 }]], [[{ "z": -10699.999571472328, "y": 16979.999319962662, "x": 69679.883151919 }, { "z": -10699.999571472328, "y": 23720.069605586192, "x": 69679.883151919 }], [{ "z": -10699.999571472328, "y": 23720.069605586192, "x": 69679.883151919 }, { "z": -10699.999571472328, "y": 23720.069605586192, "x": 69919.997199753023 }], [{ "z": -10699.999571472328, "y": 23720.069605586192, "x": 69919.997199753023 }, { "z": -10699.999571472328, "y": 16979.999319962662, "x": 69919.997199753023 }], [{ "z": -10699.999571472328, "y": 16979.999319962662, "x": 69919.997199753023 }, { "z": -10699.999571472328, "y": 16979.999319962662, "x": 69679.883151919 }]]] };

    let height = 2438;
    viewer.createRoom(dashangye6, height, "dashangye6", new Glodon.Web.Graphics.Color(255, 136, 0, 0.25), new Glodon.Web.Graphics.Color(255, 136, 0, 0.35));
    viewer.createRoom(jiudianzhongshui, height, "jiudianzhongshui", new Glodon.Web.Graphics.Color(255, 0, 0, 0.25), new Glodon.Web.Graphics.Color(255, 0, 0, 0.35));
    viewer.createRoom(shangye, height + 3000, "shangye", new Glodon.Web.Graphics.Color(255, 136, 0, 0.25), new Glodon.Web.Graphics.Color(255, 136, 0, 0.35));

    viewer.overrideComponentsColorById(["1862936787126336.5556129"], new Glodon.Web.Graphics.Color(255, 0, 0, 1));
    viewer.overrideComponentsColorById(["1862936787126336.5469963"], new Glodon.Web.Graphics.Color(171, 171, 171, 1));
    viewer.overrideComponentsColorById(["1862936787126336.5472022"], new Glodon.Web.Graphics.Color(171, 171, 171, 1));

    viewer.overrideComponentsColorById(["1862936787126336.5554791"], new Glodon.Web.Graphics.Color(247, 183, 7, 1));

    viewer.render();
}

function singleFloor(viewer) {
    viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], new Glodon.Web.Graphics.Color(167, 167, 167, 1));
    viewer.isolateComponentsByObjectData([{ "levelName": "B01" }], Glodon.Bimface.Viewer.IsolateOption.HideOthers);
    viewer.render();
}

function water() {
    viewer.setCameraStatus({
        "name": "persp",
        "position": {
            "x": 383.5899590046742,
            "y": 91927.3277909603,
            "z": 12111.760942340503
        },
        "target": {
            "x": 122267.02007998478,
            "y": 254579.96797597955,
            "z": -172851.69908618843
        },
        "up": {
            "x": 0.4036068411717696,
            "y": 0.5386057228121012,
            "z": 0.7395981294685648
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    });
    viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], new Glodon.Web.Graphics.Color(167, 167, 167, 1));
    viewer.isolateComponentsByObjectData([{ "levelName": "B02" }], Glodon.Bimface.Viewer.IsolateOption.HideOthers);
    viewer.render();
}