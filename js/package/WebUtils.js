/**
 * @author:xuhb
 * @function:web utils
 */



function WebUtils(viewer) {
    this.viewer = viewer || window.viewer;
    this.type = "Glodon.Utils.Web";
}

/**
 * @fileOverview 模块功能：Web通用工具包
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
     * 复制单击的构件Id
     * @param {Object} e 鼠标点击事件对象
     */
    copyObjectId: function (e) {
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', e.objectId);
        input.setAttribute('id', "cp_o_input");
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
        }
        document.getElementById('cp_o_input').remove();
        layer.msg("【" + e.objectId + "】 copy success!");
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
     * @param {Number} red 红色分量
     * @param {Number} green 绿色分量
     * @param {Number} blue 蓝色分量
     * @param {Number} alpha alpha分量
     */
    fromColor: function (red, green, blue, alpha) {
        return new Glodon.Web.Graphics.Color(red, green, blue, alpha);
    },

    /**
     * 获取十六进制颜色值
     * @param {Number} color 十六进制色值
     * @param {Number} alpha alpha分量
     */
    fromHexColor: function (color, alpha) {
        return new Glodon.Web.Graphics.Color(color, alpha);
    },


    /**
     * 产生随机字符
     * @public
     * @author xuhongbo
     * @version 1.0
     */
    guid: function () {
        return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
});

export { WebUtils }