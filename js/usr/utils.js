/**
 * 
 * @author:xuhb
 * @function:工具包
 */

// 获取url参数
export function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}


// 根据modelId获取viewToken
export function getViewtoken(modelId, type) {
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
}

// 获取Scene对象
export function getScene(viewer) {
    return viewer.getViewer().modelManager.getScene();
}

// 获取透视相机Camera对象
export function getPerspectiveCamera(viewer) {
    //return viewer.getViewer().camera.perspectiveCamera;
    return viewer.getViewer().camera;
}

// 获取Render对象
export function getRender(viewer) {
    //return viewer.getViewer().getRenderer();
    return viewer.getViewer().rendererManager.renderer;
}

// 初始化模型公共配置
export function initModel(viewer) {
    document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
    document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
    document.getElementById('open-button').style.display = 'block';
}

// 加载js脚本
export function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.onload = function () {
        callback && callback();
    }
    script.src = url;
    document.head.appendChild(script);
}