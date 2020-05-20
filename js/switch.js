// 目录开关
let onDirClickHandler = (obj) => {
    if (obj.checked) {
        document.getElementsByClassName('gld-bf-tree')[0].style.display = 'block';
    } else {
        document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
    }
}

// 工具栏开关
let onToolClickHandler = (obj) => {
    if (obj.checked) {
        document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'block';
    } else {
        document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
    }
}

// 楼层按钮
let onLevelClickHandler = (obj) => {
    if (obj.checked) {
        document.getElementById('levels').style.display = 'block';
    } else {
        document.getElementById('levels').style.display = 'none';
    }
    viewer.render();
}

// 模型轮廓线开关
let onWireFrameClickHandler = (obj) => {
    if (obj.checked) {
        viewer.setBorderLineEnabled(true);
    } else {
        viewer.setBorderLineEnabled(false);
    }
    viewer.render();
}

// 辅助坐标轴开关
let onAxisClickHandler = (obj) => {
    if (obj.checked) {
        viewer.addExternalObject("axis", axis);
    } else {
        viewer.removeExternalObjectByName("axis");
    }
    viewer.render();
}

// ViewHouse开关
let onViewHouseClickHandler = (obj) => {
    if (obj.checked) {
        viewer.showViewHouse();
    } else {
        viewer.hideViewHouse();
    }
    viewer.render();
}

// 悬停开关
let onMouseHoverClickHandler = (obj) => {
    if (obj.checked) {
        viewer.enableHover(true);
    } else {
        viewer.enableHover(false);
    }
    viewer.render();
}

// 参数控制器
let onParameterClickHandler = (obj) => {
    if (obj.checked && document.getElementsByClassName('dg ac')) {
        document.getElementsByClassName('dg ac')[0].style.display = "block";
    } else {
        document.getElementsByClassName('dg ac')[0].style.display = "none";
    }
}

// 冷水机房图例
let onLegendClickHandler = (obj) => {
    if (obj.checked && document.getElementById('identity')) {
        document.getElementById('identity').style.display = "block";
    } else {
        document.getElementById('identity').style.display = "none";
    }
}

let onEnableBlinkClickHandler = (obj) => {
    if (obj.checked && viewer) {
        viewer.enableBlinkComponents(true);
    } else {
        viewer.enableBlinkComponents(false);
    }
}