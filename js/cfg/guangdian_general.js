/**
 * @author:xuhongbo
 * @function:
 * @default:1846137953222272
 */

import { FogObject } from '../usr/fog.js'
import { WebUtils } from '../usr/WebUtils.js'
import { pathAnimation } from '../usr/path_animation.js';

export function initGdGeneralModel(viewer) {
    var webUtils = new WebUtils(viewer);
    //document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
    document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
    document.getElementById('open-button').style.display = 'block';
    viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(204, 224, 255, 1));
    //调整缩放范围
    viewer.setMaximalRangeofCamera(1);
    //设置曝光
    viewer.setExposureShift(0.0);
    //限制转角
    viewer.lockAxis(Glodon.Bimface.Viewer.AxisOption.Z, [Math.PI / 8, Math.PI / 2]);
    //雾化效果
    webUtils.getScene(viewer).fog = FogObject.enbaleRenderFog();
    //全部轮廓改色
    viewer.overrideComponentsFrameColorByObjectData([], new Glodon.Web.Graphics.Color("#CECBCB", 0.3));

    viewer.setMinimumFPS(30);
    let defaultCamera = { "name": "persp", "position": { "x": -161093.50418382723, "y": 90502.30678185826, "z": 42983.72726476737 }, "target": { "x": 2191307.4781882036, "y": -1263808.991913971, "z": -421322.4598276285 }, "up": { "x": 0.14611740050740646, "y": -0.0841256918525428, "z": 0.9856838099711738 }, "fov": 45, "version": 1 };
    viewer.setCameraStatus(defaultCamera, () => {
        viewer.recordCustomedHomeview(defaultCamera);
    });


    var obj3ds = '../../model/6db9d5bcf88640f997b23be61e870ee8_car.3ds';
    var loader = new THREE.TDSLoader();


    let keyValue = { 0: "Two", 1: "Three", 2: "Four" };
    loader.load(obj3ds, function (object) {
        pathAnimation.init(viewer, "One", 8000, "vehicle");
        viewer.addExternalObject("vehicle", object);
        viewer.getExternalComponentManager().setTransform("vehicle", pathAnimation.path.getPointAt(0));
        pathAnimation.startPathAnimation();

        //初始化4个汽车
        let times = 3;
        for (let m = 0; m < times; m++) {
            let objectCopy = object.clone(true);
            let pathAnimationCopy = Object.assign({}, pathAnimation);
            let name = "vehicle" + (m + 1);
            pathAnimationCopy.init(viewer, keyValue[m], 5000 + (m % 2) * 50000, name);
            viewer.addExternalObject(name, objectCopy);
            viewer.getExternalComponentManager().setTransform(name, pathAnimationCopy.path.getPointAt(0));
            pathAnimationCopy.startPathAnimation();
        }

        let progress = 0;
        pathAnimation.path.arcLengthDivisions = 1000;
    });
}