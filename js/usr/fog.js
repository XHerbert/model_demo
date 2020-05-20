/**
 * @author:xuhbd
 * @function:为场景添加雾化效果，如果需要自行调整参数，需调用init方法
 */


var FogObject = {
    viewer: null,
    near: 0,
    far: 0,
    color: null,

    init: function init(color, near, far) {
        this.color = 0xcce0ff;
        this.near = near || 180;
        this.far = far || 250;
    },

    enbaleRenderFog: function () {
        this.init();
        return new THREE.Fog(this.color, this.near, this.far);
    }
}

export { FogObject }