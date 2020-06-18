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
    }
});

export { ModelHelper }
