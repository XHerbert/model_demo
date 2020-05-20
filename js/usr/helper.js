/**
 * @author:xuhongbo
 * @function:helper
 */

import { getScene } from './utils.js'

var helper = {
    axisHelper: null,
    ambientLightHelper: null,
    axisSize: 100,
    viewer: null,

    createAixsHelper: function (viewer) {
        this.viewer = viewer;
        this.axisHelper = new THREE.AxisHelper(this.axisSize);
        getScene(this.viewer).add(this.axisHelper);
        window.axis = this.axisHelper;
    },

    createAmbientLightHelper: function (viewer) {
        this.ambientLightHelper = new THREE.DirectionalLightHelper();
        getScene(this.viewer).add(this.axisHelper);
    }

}

export { helper }