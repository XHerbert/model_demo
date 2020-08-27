/**
 * @author:xuhongbo
 * @function:model helper,such as light 、axis 、plane
 */

import { WebUtils } from './WebUtils.js'


function ModelHelper(viewer) {

    this.viewer = viewer || null;
    this.webUtils = new WebUtils(this.viewer);
    this.type = "Glodon.Helper.ModelHelper";
}

ModelHelper.prototype = Object.assign(ModelHelper.prototype, {

    /**
     * 创建坐标轴Helper
     * @param {Object} viewer 
     */
    createAixsHelper: function () {
        this.axisHelper = new THREE.AxisHelper(this.axisSize || 300);
        this.webUtils.getScene().add(this.axisHelper);
        window.axis = this.axisHelper;
    },

    /**
     * 创建环境光Helper
     * @param {Object} viewer 
     */
    createAmbientLightHelper: function () {
        this.ambientLightHelper = new THREE.DirectionalLightHelper();
        this.webUtils.getScene(this.viewer).add(this.axisHelper);
    },

    /**
     * 创建边界信息对象
     * @param {Array} pointArray 用于创建边界的点集 
     * @returns 边界对象
     */
    buildAreaBoundary: function (pointArray) {
        var boundarys = {};
        boundarys.version = "2.0";
        boundarys.loops = [];
        boundarys.loops[0] = [];

        for (let j = 0, len = pointArray.length; j < len; j++) {
            let arrayItem = [];
            if (j == len - 1) {
                arrayItem.push(pointArray[j]);
                arrayItem.push(pointArray[0]);
            } else {
                arrayItem.push(pointArray[j]);
                arrayItem.push(pointArray[j + 1]);
            }
            boundarys.loops[0].push(arrayItem);
        }
        return boundarys;
    },

    /**
     * 场景中创建雾化效果
     * @param {String} color 雾颜色
     * @param {Number} near 近视点
     * @param {Number} far 远视点
     */
    buildFog: function (color, near, far) {
        color = color || 0xcce0ff;
        near = near || 180;
        far = far || 250;
        return new THREE.Fog(color, near, far);
    }
});

export { ModelHelper }
