/**
 * @author:xuhongbo 
 * @function:carport scene condition
 * @default:1845201402357696
 * 
 */


// 初始化模型
export function initParkModel(viewer) {
    //document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
    document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
    document.getElementById('open-button').style.display = 'block';
    //viewer.hideComponentsByObjectData([{ "categoryId": "-2000011" }]);

    viewer.isolateComponentsByObjectData([{ familyType: "停车位B01常规" }, { family: "矩形柱1" }, { family: "基本墙" }, { familyType: "楼板300" }, { familyType: "常规 - 350mm" }, { familyType: "常规 - 300mm" }], "MakeOthersTranslucent");
    //viewer.isolateComponentsByObjectData([{ familyType: "停车位B01常规" }, { family: "矩形柱1" }, { family: "墙" }], "MakeOthersTranslucent");
    viewer.hideComponentsByObjectData([{ levelName: "F01" }]);


    viewer.setBorderLineEnabled(true);
    //全部轮廓改色
    viewer.overrideComponentsFrameColorByObjectData([], new Glodon.Web.Graphics.Color("#CECBCB", 0.3));
    viewer.overrideComponentsColorByObjectData([{ family: "矩形柱1" }], new Glodon.Web.Graphics.Color("#CECBCB", 0.8));
    viewer.overrideComponentsColorByObjectData([{ family: "基本墙" }], new Glodon.Web.Graphics.Color("#CECBCB", 0.8));
    viewer.restoreComponentsColorByObjectData([{ familyType: "常规 - 350mm" }, { familyType: "常规 - 300mm" }]);
    //调整缩放范围
    viewer.setMaximalRangeofCamera(1);
    //设置曝光
    viewer.setExposureShift(0.2);
    //限制转角
    viewer.lockAxis(Glodon.Bimface.Viewer.AxisOption.Z, [Math.PI / 8, Math.PI / 2]);
    //bimface默认环境光强度0.4
    viewer.getViewer().modelManager.getScene().intensity = 0.6;


    //默认视角
    viewer.setCameraStatus({
        "name": "persp",
        "position": {
            "x": -2642.2093718196634,
            "y": 41494.89012578672,
            "z": 13068.18527129716
        },
        "target": {
            "x": -19161.307356902587,
            "y": -2482869.2570793624,
            "z": -1063680.8022196142
        },
        "up": {
            "x": -0.002567729832577266,
            "y": -0.39232667278913413,
            "z": 0.9198223679503095
        },
        "fov": 45,
        "version": 1
    }, () => { console.log("finish") });
    viewer.render();
}