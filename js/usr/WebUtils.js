/**
 * @author:xuhb
 * @function:web utils
 */



function WebUtils(viewer) {
    this.viewer = viewer || window.viewer;
}

/**
 * @fileOverview 通用工具包
 * @module WebUtils
 */
WebUtils.prototype = Object.assign(WebUtils.prototype, {

    constructor: WebUtils,

    /**
     * viewer 对象
     * @memberOf module:WebUtils#
     */
    viewer: null,

    /**
     * 获取URL参数
     * @param {String} name 根据名称获取url地址中的参数值
     */
    getURLParameter: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    },

    /**
     * 根据modelId获取viewToken
     * @param {Number} modelId 模型文件Id
     * @param {Number} type 模型类型，0：单模型 1：集成模型
     * @private
     */
    getViewtoken: function (modelId, type) {
        let _fileUrl = 'http://10.0.197.82:8078/bim/token/getFilePreviewToken?fileId=' + modelId;
        let _integrateUrl = 'http://10.0.197.82:8078/bim/token/getIntegratePreviewToken?integrateId=' + modelId;

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
        return renderer || this.viewer.getViewer().rendererManager.renderer.renderer;
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
     * @private
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
    },

    /**
     * 颜色归一化
     * @param {Vector3} color 三维颜色向量，如Vector3(120,120,255)
     * @returns {Vector3} 归一化后的三维颜色向量
     */
    normalizeColor: function (color) {
        return new THREE.Vector3(color.x / 255, color.y / 255, color.z / 255);
    },

    /**
     * 绘制直线
     * @param {Array} pointArray 用于绘制直线的点集
     * @returns {String} 返回直线的名称
     */
    drawLine: function (pointArray, color) {
        let lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(
            pointArray[0], pointArray[1]
        );
        lineGeometry.colors.push(
            new THREE.Color(0xFFFF00 || color),
            new THREE.Color(0x808000 || color)
        )
        let lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true });
        let line = new THREE.Line(lineGeometry, lineMaterial);
        let lineName = "line" + Math.random();
        this.viewer.addExternalObject(lineName, line);
        return lineName;
    },


    /**
     * 弾层显示JSON格式数据
     * @param {String} selector  DOM
     * @param {String} width 弾层宽度，可设置为auto
     * @param {String} height 弾层高度，可设置为auto
     * @param {String} title 弾层标题
     * @param {String} skin 弾层皮肤
     * @param {Object} data JSON数据
     */
    layerPanel: function (selector, width, height, title, skin, data) {
        layer.open({
            type: 1,
            area: [width || "", height || ""],
            title: title || "",
            skin: skin,
            closeBtn: 1,
            anim: 5,
            shade: 0,
            content: this.formatHtml(selector, data)
        });
    },

    /**
     * 格式化JSON数据
     * @param {String} selector DOM节点 
     * @param {Object} data JSON数据 
     */
    formatHtml: function (selector, data) {
        var options = {
            collapsed: false,
            rootCollapsable: true,
            withQuotes: false,
            withLinks: false
        };
        return $(selector).jsonViewer(data, options);
    },

    /**
     * 比较两个对象属性值是否完全相同
     * @param {Object} obj1 被比较的第一个对象
     * @param {Object} obj2 被比较的第二个对象
     */
    isObjectEqual: function (obj1, obj2) {
        let props1 = Object.getOwnPropertyNames(obj1);
        let props2 = Object.getOwnPropertyNames(obj2);
        if (props1.length != props2.length) {
            return false;
        }
        for (let i = 0, max = props1.length; i < max; i++) {
            let propName = props1[i];
            if (obj1[propName] !== obj2[propName]) {
                return false;
            }
        }
        return true;
    },

    /**
     * 获取十进制颜色值
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     * @param {Number} a 
     */
    fromColor: function (r, g, b, a) {
        return new Glodon.Web.Graphics.Color(r, g, b, a);
    },

    /**
     * 获取十六进制颜色值
     * @param {Number} color 
     * @param {Number} a 
     */
    fromHexColor: function (color, a) {
        return new Glodon.Web.Graphics.Color(color, a);
    },


    /**
     * 产生随机字符
     */
    guid: function () {
        return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
});

export { WebUtils }