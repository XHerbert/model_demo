/**
 * @author:xuhongbo
 * @function:helper
 */

import { WebUtils } from './WebUtils.js'

var helper = {
    axisHelper: null,
    ambientLightHelper: null,
    axisSize: 100,
    viewer: null,

    createAixsHelper: function (viewer) {
        var webUtils = new WebUtils();
        this.viewer = viewer;
        this.axisHelper = new THREE.AxisHelper(this.axisSize);
        webUtils.getScene(this.viewer).add(this.axisHelper);
        window.axis = this.axisHelper;
    },

    createAmbientLightHelper: function (viewer) {
        var webUtils = new WebUtils();
        this.ambientLightHelper = new THREE.DirectionalLightHelper();
        webUtils.getScene(this.viewer).add(this.axisHelper);
    }

}

export { helper }