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

    // 获取URL参数
    getURLParameter: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    },

    // 根据modelId获取viewToken
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

    // 获取Scene对象
    getScene: function () {
        return this.viewer.getViewer().modelManager.getScene();
    },

    // 获取透视相机Camera对象
    getPerspectiveCamera: function () {
        return this.viewer.getViewer().camera;
    },

    // 获取Render对象
    getRender: function () {
        return this.viewer.getViewer().rendererManager.renderer;
    },

    // 加载js脚本
    loadScript: function (url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = function () {
            callback && callback();
        }
        script.src = url;
        document.head.appendChild(script);
    },

    // 初始化模型公共配置
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