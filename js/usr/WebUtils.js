/**
 * @author:xuhb
 * @function:web utils
 */

function WebUtils(viewer) {
    this.viewer = viewer || window.viewer;
}

WebUtils.prototype = Object.assign(WebUtils.prototype, {

    constructor: WebUtils,

    // viewer 对象
    viewer: null,

    /**
     * 获取URL参数
     * @param {String} name 
     */
    getURLParameter: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    },

    /**
     * 根据modelId获取viewToken
     * @param {Number} modelId 模型文件Id
     * @param {Number} type 模型类型，0：单模型 1：集成模型
     */
    getViewtoken: function (modelId, type) {
        let _fileUrl = 'http://10.0.197.82:8078/api/token/getFilePreviewToken?fileId=' + modelId;
        let _integrateUrl = 'http://10.0.197.82:8078/api/token/getIntegratePreviewToken?integrateId=' + modelId;

        return new Promise(function (resolve, reject) {
            let option = {
                url: type == 0 ? _fileUrl : _integrateUrl,
                type: 'GET',
                contentType: 'application/json',
                success: (res) => {
                    if (res.code === 20000) {
                        resolve(res.data);
                    } else {
                        console.error(res.message);
                    }
                }
            };
            $.ajax(option);
        })
    },

    /**
     * 获取Scene对象
     * @param {Object} scene 非bimface场景时，传入的camera对象 
     */
    getScene: function (scene) {
        return scene || this.viewer.getViewer().modelManager.getScene();
    },

    /**
     * 获取透视相机Camera对象
     * @param {Object} camera  非bimface场景时，传入的camera对象
     */
    getPerspectiveCamera: function (camera) {
        return camera || this.viewer.getViewer().camera;
    },

    /**
     * 获取Render对象
     * @param {Object} renderer 非bimface场景时，传入的renderer对象
     */
    getRender: function (renderer) {
        return renderer || this.viewer.getViewer().rendererManager.renderer;
    },

    /**
     * 加载js脚本
     * @param {String} url 脚本地址 
     * @param {Function} callback 加载成功回调 
     */
    loadScript: function (url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = function () {
            callback && callback();
        }
        script.src = url;
        document.head.appendChild(script);
    },

    /**
     * 为场景添加天空盒
     * @param {String} path 图片路径  
     * @param {Array} imageArray 图片组，六张图片分别是朝前的（posz）、朝后的（negz）、朝上的（posy）、朝下的（negy）、朝右的（posx）和朝左的（negx） 
     * @param {Object} scene scene 可选
     */
    setSkyBox: function (path, imageArray, scene) {
        //给场景添加天空盒子纹理
        let cubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.setPath(path);

        // var cubeTexture = cubeTextureLoader.load([
        //     'right.jpg', 'left.jpg',
        //     'top.jpg', 'bottom.jpg',
        //     'front.jpg', 'back.jpg'
        // ]);

        var cubeTexture = cubeTextureLoader.load(imageArray);
        let currentScene = this.getScene(scene);
        currentScene.background = cubeTexture;
    },


    /**
     * 初始化模型公共配置
     */
    initModel: function () {
        const tree = document.getElementsByClassName('gld-bf-tree');
        const toolbar = document.getElementsByClassName('bf-toolbar bf-toolbar-bottom');
        const open_button = document.getElementById('open-button');

        if (tree && tree.length) {
            tree[0].style.display = 'none';
        }

        if (toolbar && toolbar.length) {
            toolbar[0].style.display = 'none';
        }

        if (open_button) {
            open_button.style.display = 'block';
        }
    }
});

export { WebUtils }