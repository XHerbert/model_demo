/**
 * @author:xuhongbo
 * @function:Math Library
 */

import { WebUtils } from './WebUtils.js'

function MathLibrary() {
    this.type = "glodon.math.library";
};

MathLibrary.prototype = Object.assign(MathLibrary.prototype, {

    /**
     * 获取指定大小区间随机数
     * @param {最小值} min 
     * @param {最大值} max 
     */
    getRandomInt: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    },

    // 2D 坐标转3D
    getLocalPosition: function (event, camera) {
        let webUtils = new WebUtils();
        let ca = webUtils.getPerspectiveCamera(camera);

        let mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        return new THREE.Vector3(mouse.x, mouse.y, 0);
    },

    // 3D 坐标转 2D
    get2dPosition(vector3, camera) {
        if (!camera) {
            return;
        }
        var standardVector = vector3.project(camera);//世界坐标转标准设备坐标
        var a = window.innerWidth / 2;
        var b = window.innerHeight / 2;
        var x = Math.round(standardVector.x * a + a);//标准设备坐标转屏幕坐标
        var y = Math.round(-standardVector.y * b + b);//标准设备坐标转屏幕坐标
        return new THREE.Vector2(x, y);
    }
});

export { MathLibrary }