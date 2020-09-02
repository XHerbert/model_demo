/**
 * @author:xuhongbo
 * @function:wanda water system white
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'
import { RoomUtils } from '../package/RoomUtils.js'

var app, viewer, drawableContainer;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
var roomUtils = new RoomUtils();
var hidetoken;

webUtils.getViewtoken(1940267310858912, INTEGRATE_FILE).then((token) => {
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
        roomUtils.viewer = window.viewer;
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

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);

            //基础设置
            viewer.hideViewHouse();
            document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
            document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
            document.getElementById('open-button').style.display = 'block';

            //相机视角
            setCamera(viewer);
            //创建空间

            document.getElementById('red').addEventListener("click", function () {
                drawArea(viewer, [], false);
            });

            document.getElementById('white').addEventListener("click", function () {
                drawArea(viewer, [], true);
            });

            //配电箱
            document.getElementById("blue").addEventListener("click", function () {
                viewer.overrideComponentsColorById(["1862928619006016.3240219"], webUtils.fromColor(255, 1, 1, 1));
                // viewer.setSelectedComponentsById(["1862928619006016.3240219"]);
                // viewer.zoomToSelectedComponents(0.5, null);
                // viewer.clearSelectedComponents();
                viewer.setCameraStatus({
                    "name": "persp",
                    "position": {
                        "x": 45860.300174246186,
                        "y": 28393.768680588306,
                        "z": 29928.23749073099
                    },
                    "target": {
                        "x": 47427.062878303936,
                        "y": 28760.64618264102,
                        "z": 28951.00212144469
                    },
                    "up": {
                        "x": 0.5054067296820809,
                        "y": 0.11834314464739062,
                        "z": 0.8547274054966476
                    },
                    "fov": 45,
                    "zoom": 1,
                    "version": 1,
                    "coordinateSystem": "world"
                })
                viewer.render();
            })

            let pickupFinished = false;
            window.bim.tagEventBind = false;
            let points = [];
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
                if (!window.bim.tagEventBind) {
                    if (document.getElementById("draw_id")) {
                        document.getElementById("draw_id").addEventListener("click", function () {
                            if (!points || points.length < 3) {
                                layer.msg("at leaset three point!");
                                return;
                            }
                            drawArea(viewer, points);
                            pickupFinished = true;
                            points = [];
                            console.log(points);
                        });
                    }
                    window.bim.tagEventBind = true;
                }
                if (window.bim.drawCustomArea) {
                    points.push(new THREE.Vector3(e.worldPosition.x, e.worldPosition.y, e.worldPosition.z));
                } else {
                    points = [];
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
            "x": -237064.0508064344,
            "y": -45799.35622859913,
            "z": 160730.6538084428
        },
        "target": {
            "x": 1105.306596852934,
            "y": 71157.0747650439,
            "z": 89179.98166582313
        },
        "up": {
            "x": 0.2337039015948217,
            "y": 0.11475980135636756,
            "z": 0.9655116127587512
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

function drawArea(viewer, pointArray, multi) {


    let mm = 5000;

    let a1 = { "version": "2.0", "loops": [[[{ "x": 46476.00883965482, "y": 19315.960006890236, "z": 15850.078666008912 }, { "x": 18763.90717402297, "y": 47251.56649402153, "z": 10800.000368634475 }], [{ "x": 18763.90717402297, "y": 47251.56649402153, "z": 10800.000368634475 }, { "x": 18763.90717402297, "y": 59766.69134018571, "z": 15849.999564442958 }], [{ "x": 18763.90717402297, "y": 59766.69134018571, "z": 15849.999564442958 }, { "x": 19434.361246578566, "y": 64236.385410131, "z": 15849.999564442873 }], [{ "x": 19434.361246578566, "y": 64236.385410131, "z": 15849.999564442873 }, { "x": 18093.45310146735, "y": 68035.64391926714, "z": 10800.000368634084 }], [{ "x": 18093.45310146735, "y": 68035.64391926714, "z": 10800.000368634084 }, { "x": 16082.09088380052, "y": 71611.39917522339, "z": 10800.000368634077 }], [{ "x": 16082.09088380052, "y": 71611.39917522339, "z": 10800.000368634077 }, { "x": 15858.606192948659, "y": 74963.66972768233, "z": 10800.000368634013 }], [{ "x": 15858.606192948659, "y": 74963.66972768233, "z": 10800.000368634013 }, { "x": 15635.12150209678, "y": 100440.92592637053, "z": 10800.000368633537 }], [{ "x": 15635.12150209678, "y": 100440.92592637053, "z": 10800.000368633537 }, { "x": -4310.157497100468, "y": 99781.61958346392, "z": 15850.000320538897 }], [{ "x": -4310.157497100468, "y": 99781.61958346392, "z": 15850.000320538897 }, { "x": -4329.268094990014, "y": 105621.36660192252, "z": 15850.000320538551 }], [{ "x": -4329.268094990014, "y": 105621.36660192252, "z": 15850.000320538551 }, { "x": 8631.809665415294, "y": 105958.62997562687, "z": 15150.02786086252 }], [{ "x": 8631.809665415294, "y": 105958.62997562687, "z": 15150.02786086252 }, { "x": 8414.248094169137, "y": 104148.3143948544, "z": 10800.000368633466 }], [{ "x": 8414.248094169137, "y": 104148.3143948544, "z": 10800.000368633466 }, { "x": 15789.203454991526, "y": 104172.4489752762, "z": 10800.000368633524 }], [{ "x": 15789.203454991526, "y": 104172.4489752762, "z": 10800.000368633524 }, { "x": 16181.04372074004, "y": 121019.33658353316, "z": 10800.00036863315 }], [{ "x": 16181.04372074004, "y": 121019.33658353316, "z": 10800.00036863315 }, { "x": 15497.550470724744, "y": 125002.54720346462, "z": 15849.999536919695 }], [{ "x": 15497.550470724744, "y": 125002.54720346462, "z": 15849.999536919695 }, { "x": 16583.909331647403, "y": 134497.13921050515, "z": 10800.000368632898 }], [{ "x": 16583.909331647403, "y": 134497.13921050515, "z": 10800.000368632898 }, { "x": 18360.914043301003, "y": 137822.52568607297, "z": 15770.812708580563 }], [{ "x": 18360.914043301003, "y": 137822.52568607297, "z": 15770.812708580563 }, { "x": 21694.628814214764, "y": 143498.18689845083, "z": 10800.00036863273 }], [{ "x": 21694.628814214764, "y": 143498.18689845083, "z": 10800.00036863273 }, { "x": 26155.386147306992, "y": 146236.27314289648, "z": 14996.024821727726 }], [{ "x": 26155.386147306992, "y": 146236.27314289648, "z": 14996.024821727726 }, { "x": 35531.07271266228, "y": 149512.29333814635, "z": 13991.178331385792 }], [{ "x": 35531.07271266228, "y": 149512.29333814635, "z": 13991.178331385792 }, { "x": 48938.6256849743, "y": 149999.97577516036, "z": 14044.949960368016 }], [{ "x": 48938.6256849743, "y": 149999.97577516036, "z": 14044.949960368016 }, { "x": 49135.50685126268, "y": 158130.01186817096, "z": 15849.999886820882 }], [{ "x": 49135.50685126268, "y": 158130.01186817096, "z": 15849.999886820882 }, { "x": 53380.85576086089, "y": 158400.00384809368, "z": 15536.090226453862 }], [{ "x": 53380.85576086089, "y": 158400.00384809368, "z": 15536.090226453862 }, { "x": 54076.40116437975, "y": 150734.10466549647, "z": 15849.999483890595 }], [{ "x": 54076.40116437975, "y": 150734.10466549647, "z": 15849.999483890595 }, { "x": 67041.38590484444, "y": 149878.11501511597, "z": 15849.999564441208 }], [{ "x": 67041.38590484444, "y": 149878.11501511597, "z": 15849.999564441208 }, { "x": 79555.72525448912, "y": 150143.67998454356, "z": 15849.999484417413 }], [{ "x": 79555.72525448912, "y": 150143.67998454356, "z": 15849.999484417413 }, { "x": 89842.39456769095, "y": 148213.3622380999, "z": 10800.00036863264 }], [{ "x": 89842.39456769095, "y": 148213.3622380999, "z": 10800.00036863264 }, { "x": 97687.87109877823, "y": 141041.342199313, "z": 15379.003597896273 }], [{ "x": 97687.87109877823, "y": 141041.342199313, "z": 15379.003597896273 }, { "x": 105310.88078439413, "y": 133557.94803269397, "z": 14099.999504708981 }], [{ "x": 105310.88078439413, "y": 133557.94803269397, "z": 14099.999504708981 }, { "x": 112471.74752157343, "y": 130710.49388804063, "z": 15849.981009753492 }], [{ "x": 112471.74752157343, "y": 130710.49388804063, "z": 15849.981009753492 }, { "x": 118524.09784076374, "y": 125139.44461907298, "z": 13368.84805178965 }], [{ "x": 118524.09784076374, "y": 125139.44461907298, "z": 13368.84805178965 }, { "x": 120555.39213204947, "y": 119051.96827695548, "z": 13664.903157836452 }], [{ "x": 120555.39213204947, "y": 119051.96827695548, "z": 13664.903157836452 }, { "x": 129526.97869693287, "y": 109227.37526110678, "z": 15616.344528269545 }], [{ "x": 129526.97869693287, "y": 109227.37526110678, "z": 15616.344528269545 }, { "x": 134237.76804778617, "y": 103853.60729388458, "z": 15602.295658617311 }], [{ "x": 134237.76804778617, "y": 103853.60729388458, "z": 15602.295658617311 }, { "x": 138047.4524438606, "y": 91925.82811249196, "z": 15849.999564442352 }], [{ "x": 138047.4524438606, "y": 91925.82811249196, "z": 15849.999564442352 }, { "x": 108100.50386874985, "y": 93106.3574719508, "z": 10800.000368633615 }], [{ "x": 108100.50386874985, "y": 93106.3574719508, "z": 10800.000368633615 }, { "x": 107206.56509956377, "y": 100069.17128889835, "z": 10800.000368633602 }], [{ "x": 107206.56509956377, "y": 100069.17128889835, "z": 10800.000368633602 }, { "x": 113240.65174827688, "y": 105235.12993283028, "z": 10800.000368633446 }], [{ "x": 113240.65174827688, "y": 105235.12993283028, "z": 10800.000368633446 }, { "x": 115475.49865292879, "y": 109894.38115512981, "z": 15849.986869129083 }], [{ "x": 115475.49865292879, "y": 109894.38115512981, "z": 15849.986869129083 }, { "x": 115698.98334152398, "y": 112589.65677040884, "z": 15850.058158193968 }], [{ "x": 115698.98334152398, "y": 112589.65677040884, "z": 15850.058158193968 }, { "x": 109441.41199657298, "y": 113937.29814930832, "z": 15850.058158193939 }], [{ "x": 109441.41199657298, "y": 113937.29814930832, "z": 15850.058158193939 }, { "x": 105418.67899163235, "y": 116407.96986993706, "z": 15850.000053053227 }], [{ "x": 105418.67899163235, "y": 116407.96986993706, "z": 15850.000053053227 }, { "x": 102960.35595683576, "y": 120001.68437217466, "z": 15850.058158193826 }], [{ "x": 102960.35595683576, "y": 120001.68437217466, "z": 15850.058158193826 }, { "x": 101395.96311824885, "y": 123139.01068313039, "z": 13683.024302397254 }], [{ "x": 101395.96311824885, "y": 123139.01068313039, "z": 13683.024302397254 }, { "x": 100502.02435141975, "y": 127285.93747974945, "z": 14884.999689378274 }], [{ "x": 100502.02435141975, "y": 127285.93747974945, "z": 14884.999689378274 }, { "x": 94691.42239028357, "y": 126066.06873185755, "z": 15850.076712881904 }], [{ "x": 94691.42239028357, "y": 126066.06873185755, "z": 15850.076712881904 }, { "x": 88880.82043129553, "y": 122257.79295259756, "z": 15750.000537591026 }], [{ "x": 88880.82043129553, "y": 122257.79295259756, "z": 15750.000537591026 }, { "x": 87986.88166577819, "y": 124799.99644728702, "z": 12798.641856301996 }], [{ "x": 87986.88166577819, "y": 124799.99644728702, "z": 12798.641856301996 }, { "x": 91562.63671698447, "y": 127695.81964925675, "z": 10800.000368633026 }], [{ "x": 91562.63671698447, "y": 127695.81964925675, "z": 10800.000368633026 }, { "x": 95138.39176858423, "y": 130166.4955230103, "z": 10800.00036863298 }], [{ "x": 95138.39176858423, "y": 130166.4955230103, "z": 10800.00036863298 }, { "x": 95138.39176709297, "y": 131963.35070175552, "z": 10800.000368632946 }], [{ "x": 95138.39176709297, "y": 131963.35070175552, "z": 10800.000368632946 }, { "x": 94020.96831157651, "y": 133478.10408462762, "z": 15849.999564441516 }], [{ "x": 94020.96831157651, "y": 133478.10408462762, "z": 15849.999564441516 }, { "x": 89998.24387301957, "y": 137361.87204652835, "z": 15197.69965356554 }], [{ "x": 89998.24387301957, "y": 137361.87204652835, "z": 15197.69965356554 }, { "x": 85975.51943617049, "y": 139163.50649275875, "z": 12911.573557043079 }], [{ "x": 85975.51943617049, "y": 139163.50649275875, "z": 12911.573557043079 }, { "x": 82846.73376371585, "y": 139824.5920986087, "z": 10800.000368632798 }], [{ "x": 82846.73376371585, "y": 139824.5920986087, "z": 10800.000368632798 }, { "x": 79717.94809339021, "y": 137896.07623235352, "z": 14350.661786439527 }], [{ "x": 79717.94809339021, "y": 137896.07623235352, "z": 14350.661786439527 }, { "x": 71002.04515229489, "y": 135332.45414189497, "z": 10800.000368632882 }], [{ "x": 71002.04515229489, "y": 135332.45414189497, "z": 10800.000368632882 }, { "x": 68990.68293462804, "y": 135332.45414022566, "z": 10800.000368632884 }], [{ "x": 68990.68293462804, "y": 135332.45414022566, "z": 10800.000368632884 }, { "x": 48877.06075856677, "y": 134601.13853389036, "z": 15849.999564441556 }], [{ "x": 48877.06075856677, "y": 134601.13853389036, "z": 15849.999564441556 }, { "x": 45077.821020805604, "y": 126515.29159815266, "z": 15849.985892566297 }], [{ "x": 45077.821020805604, "y": 126515.29159815266, "z": 15849.985892566297 }, { "x": 46642.21385951719, "y": 123203.68166508444, "z": 10800.00036863311 }], [{ "x": 46642.21385951719, "y": 123203.68166508444, "z": 10800.00036863311 }, { "x": 50441.453607157775, "y": 119385.36441339467, "z": 10800.00036863324 }], [{ "x": 50441.453607157775, "y": 119385.36441339467, "z": 10800.00036863324 }, { "x": 47312.667937851416, "y": 116240.86784795125, "z": 10800.00036863324 }], [{ "x": 47312.667937851416, "y": 116240.86784795125, "z": 10800.00036863324 }, { "x": 41278.58128055347, "y": 121406.82648190798, "z": 10800.000368633144 }], [{ "x": 41278.58128055347, "y": 121406.82648190798, "z": 10800.000368633144 }, { "x": 34797.52524660497, "y": 120508.39888712412, "z": 10800.00036863316 }], [{ "x": 34797.52524660497, "y": 120508.39888712412, "z": 10800.00036863316 }, { "x": 30998.284616604426, "y": 118429.4335832803, "z": 15850.0001394913 }], [{ "x": 30998.284616604426, "y": 118429.4335832803, "z": 15850.0001394913 }, { "x": 26528.591687951503, "y": 117049.29556561545, "z": 13935.45840974197 }], [{ "x": 26528.591687951503, "y": 117049.29556561545, "z": 13935.45840974197 }, { "x": 23846.775399332073, "y": 115117.8333417837, "z": 10800.000368633202 }], [{ "x": 23846.775399332073, "y": 115117.8333417837, "z": 10800.000368633202 }, { "x": 23176.321331250223, "y": 109727.26780496704, "z": 10800.000368633362 }], [{ "x": 23176.321331250223, "y": 109727.26780496704, "z": 10800.000368633362 }, { "x": 27422.53046395999, "y": 101866.02640142484, "z": 10800.00036863351 }], [{ "x": 27422.53046395999, "y": 101866.02640142484, "z": 10800.00036863351 }, { "x": 31668.739599465884, "y": 90635.68153775016, "z": 10800.00036863372 }], [{ "x": 31668.739599465884, "y": 90635.68153775016, "z": 10800.00036863372 }, { "x": 34350.555890453215, "y": 89719.8935208347, "z": 15450.008339852033 }], [{ "x": 34350.555890453215, "y": 89719.8935208347, "z": 15450.008339852033 }, { "x": 34350.55589358198, "y": 85949.97949622301, "z": 14967.608338631648 }], [{ "x": 34350.55589358198, "y": 85949.97949622301, "z": 14967.608338631648 }, { "x": 31445.254912762626, "y": 85636.83489838308, "z": 15849.99956444247 }], [{ "x": 31445.254912762626, "y": 85636.83489838308, "z": 15849.99956444247 }, { "x": 31445.254922408123, "y": 74014.77113409771, "z": 10800.000368634031 }], [{ "x": 31445.254922408123, "y": 74014.77113409771, "z": 10800.000368634031 }, { "x": 29210.408016126315, "y": 71319.48836411284, "z": 10800.000368634082 }], [{ "x": 29210.408016126315, "y": 71319.48836411284, "z": 10800.000368634082 }, { "x": 26975.561110217302, "y": 68174.99179944755, "z": 10800.000368634199 }], [{ "x": 26975.561110217302, "y": 68174.99179944755, "z": 10800.000368634199 }, { "x": 27199.045812860495, "y": 53967.266778736375, "z": 15849.955619129036 }], [{ "x": 27199.045812860495, "y": 53967.266778736375, "z": 15849.955619129036 }, { "x": 32786.16309008606, "y": 46829.28272119026, "z": 15357.256242008092 }], [{ "x": 32786.16309008606, "y": 46829.28272119026, "z": 15357.256242008092 }, { "x": 33903.58654322043, "y": 48184.977941565674, "z": 10800.000368634517 }], [{ "x": 33903.58654322043, "y": 48184.977941565674, "z": 10800.000368634517 }, { "x": 53123.26997309983, "y": 28137.460867401813, "z": 15850.082572258883 }], [{ "x": 53123.26997309983, "y": 28137.460867401813, "z": 15850.082572258883 }, { "x": 46476.00883965482, "y": 19315.960006890236, "z": 15850.078666008912 }]]], "offsetZ": 15850.078666008912 };
    let a2 = { "version": "2.0", "loops": [[[{ "x": 107800.0365469665, "y": 93500.01245251947, "z": mm + 10800.000368633697 }, { "x": 110648.51897106318, "y": 81101.79797484135, "z": mm + 10800.000368633928 }], [{ "x": 110648.51897106318, "y": 81101.79797484135, "z": mm + 10800.000368633928 }, { "x": 110469.53574004455, "y": 61055.6754935226, "z": mm + 10800.000368634273 }], [{ "x": 110469.53574004455, "y": 61055.6754935226, "z": mm + 10800.000368634273 }, { "x": 98835.62572383259, "y": 48884.823171688586, "z": mm + 10800.000368634472 }], [{ "x": 98835.62572383259, "y": 48884.823171688586, "z": mm + 10800.000368634472 }, { "x": 79863.40323585617, "y": 48705.83856587632, "z": mm + 10800.000368634477 }], [{ "x": 79863.40323585617, "y": 48705.83856587632, "z": mm + 10800.000368634477 }, { "x": 73598.99015020358, "y": 47273.97267434512, "z": mm + 10800.000368634532 }], [{ "x": 73598.99015020358, "y": 47273.97267434512, "z": mm + 10800.000368634532 }, { "x": 52836.935415491724, "y": 28301.646371369843, "z": mm + 38288.0788083054 }], [{ "x": 52836.935415491724, "y": 28301.646371369843, "z": mm + 38288.0788083054 }, { "x": 46214.555867801864, "y": 19710.45102223048, "z": mm + 38288.07880830556 }], [{ "x": 46214.555867801864, "y": 19710.45102223048, "z": mm + 38288.07880830556 }, { "x": 46214.55580435082, "y": 19352.58778964623, "z": mm + 10800.000368635056 }], [{ "x": 46214.55580435082, "y": 19352.58778964623, "z": mm + 10800.000368635056 }, { "x": 51942.019196947476, "y": 16846.803498989695, "z": mm + 15849.999564443788 }], [{ "x": 51942.019196947476, "y": 16846.803498989695, "z": mm + 15849.999564443788 }, { "x": 121029.54637014463, "y": 17741.73866168259, "z": mm + 10800.000368635085 }], [{ "x": 121029.54637014463, "y": 17741.73866168259, "z": mm + 10800.000368635085 }, { "x": 129799.72469005825, "y": 20963.436917609855, "z": mm + 10800.000368635026 }], [{ "x": 129799.72469005825, "y": 20963.436917609855, "z": mm + 10800.000368635026 }, { "x": 132305.4899243193, "y": 23648.185464219903, "z": mm + 10800.000368634974 }], [{ "x": 132305.4899243193, "y": 23648.185464219903, "z": mm + 10800.000368634974 }, { "x": 135169.2216206176, "y": 27406.833429464354, "z": mm + 10800.000368634905 }], [{ "x": 135169.2216206176, "y": 27406.833429464354, "z": mm + 10800.000368634905 }, { "x": 138748.8862409905, "y": 27764.799902349165, "z": mm + 10800.000368634897 }], [{ "x": 138748.8862409905, "y": 27764.799902349165, "z": mm + 10800.000368634897 }, { "x": 138927.86947200916, "y": 32418.36404979964, "z": mm + 10800.000368634812 }], [{ "x": 138927.86947200916, "y": 32418.36404979964, "z": mm + 10800.000368634812 }, { "x": 137853.97008589728, "y": 32418.36404979964, "z": mm + 10800.00036863478 }], [{ "x": 137853.97008589728, "y": 32418.36404979964, "z": mm + 10800.00036863478 }, { "x": 137317.02039284137, "y": 41904.47558114102, "z": mm + 10800.000368634603 }], [{ "x": 137317.02039284137, "y": 41904.47558114102, "z": mm + 10800.000368634603 }, { "x": 136243.1210067295, "y": 45305.13809301769, "z": mm + 15849.999564443255 }], [{ "x": 136243.1210067295, "y": 45305.13809301769, "z": mm + 15849.999564443255 }, { "x": 134811.25515858032, "y": 52106.52005824399, "z": mm + 10800.000368634412 }], [{ "x": 134811.25515858032, "y": 52106.52005824399, "z": mm + 10800.000368634412 }, { "x": 134990.238389599, "y": 59981.78246162971, "z": mm + 10800.000368634295 }], [{ "x": 134990.238389599, "y": 59981.78246162971, "z": mm + 10800.000368634295 }, { "x": 138032.95331691595, "y": 66962.12868278945, "z": mm + 10800.000368634133 }], [{ "x": 138032.95331691595, "y": 66962.12868278945, "z": mm + 10800.000368634133 }, { "x": 137853.97008589728, "y": 75374.34079548839, "z": mm + 10800.000368634006 }], [{ "x": 137853.97008589728, "y": 75374.34079548839, "z": mm + 10800.000368634006 }, { "x": 138211.9365479346, "y": 83607.5696717629, "z": mm + 10800.000368633853 }], [{ "x": 138211.9365479346, "y": 83607.5696717629, "z": mm + 10800.000368633853 }, { "x": 140538.71855117695, "y": 84144.50077644066, "z": mm + 15750.00053759174 }], [{ "x": 140538.71855117695, "y": 84144.50077644066, "z": mm + 15750.00053759174 }, { "x": 140180.75208913969, "y": 87724.18410989219, "z": mm + 10800.000368633804 }], [{ "x": 140180.75208913969, "y": 87724.18410989219, "z": mm + 10800.000368633804 }, { "x": 138032.95331691595, "y": 87724.16512940104, "z": mm + 15849.999564442403 }], [{ "x": 138032.95331691595, "y": 87724.16512940104, "z": mm + 15849.999564442403 }, { "x": 137496.00368731105, "y": 92198.66178060073, "z": mm + 38288.0788083042 }], [{ "x": 137496.00368731105, "y": 92198.66178060073, "z": mm + 38288.0788083042 }, { "x": 107800.0365469665, "y": 93500.01245251947, "z": mm + 10800.000368633697 }]]], "offsetZ": 10800.000368633697 };


    let height = 2438;
    let modelHelper = new ModelHelper(viewer);
    let webHelper = new WebUtils(viewer);

    let grid = modelHelper.createGridHelper(500000, 100, 0xff0000, 0xffffff, -Math.PI / 2);
    // viewer.addExternalObject(webUtils.guid(), grid);
    //以下的点来自于正交模式模型中点击拾取
    let points = pointArray || [];
    let zz = -5000;
    points.push(new THREE.Vector3(-3299.8672575981836, 192798.79199477535, 15849.999134357151 + zz));
    points.push(new THREE.Vector3(-4181.60852485701, 100424.69266292894, 10800.000368633537 + zz));
    points.push(new THREE.Vector3(-2452.2247203906095, 100411.38971121753, 10800.000368633539 + zz));
    points.push(new THREE.Vector3(-2201.6768143405056, 39212.696527869404, 10749.999390365505 + zz));
    points.push(new THREE.Vector3(22758.420951861433, 39216.06970060643, 10749.999390365505 + zz));
    points.push(new THREE.Vector3(24386.68664072444, 40817.64241209257, 10749.999390365474 + zz));
    points.push(new THREE.Vector3(46480.442555937116, 18744.205431626862, 15849.999564443726 + zz));
    points.push(new THREE.Vector3(46012.767403248865, 18276.530274090866, 15849.999564443733 + zz));
    points.push(new THREE.Vector3(46018.80711720518, -2581.784259933921, 10749.999390366289 + zz));
    points.push(new THREE.Vector3(138354.41836075613, -2663.194425534672, 10749.999390366289 + zz));
    points.push(new THREE.Vector3(158068.006812759, 17051.496926248787, 10749.99939036592 + zz));
    points.push(new THREE.Vector3(157991.5059574183, 169593.08273708628, 10749.999390363062 + zz));
    points.push(new THREE.Vector3(49047.13283878665, 169863.7279629242, 10800.000368632234 + zz));
    points.push(new THREE.Vector3(49112.636277178724, 192759.5089394638, 10749.999103897402 + zz));

    let faceColor = webHelper.fromHexColor("#575757", 0.5);
    let borderColor = webHelper.fromHexColor("#575757", 0.0);

    let innerFaceColor = webHelper.fromHexColor("#A8A8A8", 1);
    // let innerFaceColor = webHelper.fromHexColor("#717171", 1);
    let innerBorderColor = webHelper.fromHexColor("#A8A8A8", 0.0);

    viewer.hideView(hidetoken);
    let area_name = webUtils.guid();
    let left_area_name = webUtils.guid();
    let right_area_name = webUtils.guid();
    roomUtils.drawAreaByClickPoints(points, height, area_name, faceColor, borderColor);
    viewer.createRoom(a1, height, left_area_name, innerFaceColor, innerBorderColor);
    viewer.createRoom(a2, height, right_area_name, innerFaceColor, innerBorderColor);

    if (multi) {
        let source = modelHelper.getExternalObjectByName(myscene, area_name);
        let left_source = modelHelper.getExternalObjectByName(myscene, left_area_name);
        let right_source = modelHelper.getExternalObjectByName(myscene, right_area_name);

        let level = 28000;
        for (let m = 0; m < 4; m++) {
            let another = source.clone();
            let another_left = left_source.clone();
            let another_right = right_source.clone();
            another.position.z += level * (1 + m);
            another_left.position.z += level * (1 + m);
            another_right.position.z += level * (1 + m);
            viewer.addExternalObject(webUtils.guid(), another);
            viewer.addExternalObject(webUtils.guid(), another_left);
            viewer.addExternalObject(webUtils.guid(), another_right);
        }
    }
    viewer.render();
}
