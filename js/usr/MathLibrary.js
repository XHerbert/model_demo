/**
 * @author:xuhongbo
 * @function:Math Library
 */

import { WebUtils } from './WebUtils.js'
import { RoomUtils } from './RoomUtils.js'

function MathLibrary() {
    this.type = "Glodon.Math.Library";
};

MathLibrary.prototype = Object.assign(MathLibrary.prototype, {

    /**
     * 获取指定大小区间随机数
     * @param {最小值} min 
     * @param {最大值} max 
     */
    getRandomInt: function (min, max, scale) {
        (scale <= 0 || !scale) && (scale = 1.0);
        min = Math.ceil(min);
        max = Math.floor(max);
        return (Math.floor(Math.random() * (max - min)) + min) * scale;
    },

    // 2D 坐标转3D
    getLocalPosition: function (event, camera) {
        let webUtils = new WebUtils();
        let ca = webUtils.getPerspectiveCamera(camera);

        let mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        return new THREE.Vector3(mouse.x, mouse.y, 0);
    },

    // 3D 坐标转 2D
    get2dPosition(vector3, camera) {
        if (!camera) {
            return;
        }
        var standardVector = vector3.project(camera);//世界坐标转标准设备坐标
        var a = window.innerWidth / 2;
        var b = window.innerHeight / 2;
        var x = Math.round(standardVector.x * a + a);//标准设备坐标转屏幕坐标
        var y = Math.round(-standardVector.y * b + b);//标准设备坐标转屏幕坐标
        return new THREE.Vector2(x, y);
    },

    /**
     * 根据二维坐标点集和求解二元一次方程直线
     * @param {Array} pointArray 二维坐标点集合 [{x:100,y:200},{x:200,y:400}]
     * @returns 返回直线【Y = Ax + b】的斜率【A】和截距【b】  
     */
    resolveEquation: function (pointArray) {
        let result = {
            A: 0, b: 0
        };
        if (!pointArray || !pointArray.length) {
            console.warn("parameter pointArray invalidate!");
            return;
        }

        //解方程 Y = Ax + b 核心算法
        let A, b
        //不存在斜率
        if (Math.round(pointArray[1].y) === Math.round(pointArray[0].y)) {
            A = 0;
            b = pointArray[0].y;
            console.log("点集" + JSON.stringify(pointArray) + "对应的二元一次方程为：Y = " + b);
        } else if (Math.round(pointArray[0].x) === Math.round(pointArray[1].x)) {
            A = 0;
            b = pointArray[0].x;
            console.log("点集" + JSON.stringify(pointArray) + "对应的二元一次方程为：X = " + b);
        }
        //存在斜率
        else {
            A = (pointArray[1].y - pointArray[0].y) / (pointArray[1].x - pointArray[0].x);
            b = pointArray[0].y - pointArray[0].x * (pointArray[0].y - pointArray[1].y) / (pointArray[0].x - pointArray[1].x);
            console.log("点集" + JSON.stringify(pointArray) + "对应的二元一次方程为：Y = " + A + "*x + " + b);
        }
        result.A = A;
        result.b = b;
        return result;
    },

    /**
     * 根据点集合与边界计算交点
     * @param {Object} boundary 空间边界数据
     * @param {Array} pointArray 分割点集合
     */
    findCrossPoint: function (boundary, pointArray) {
        let roomUtils = new RoomUtils();
        //整理边界数据
        boundary = roomUtils.cleanBoundaryData(boundary);
        //计算分割点集所在的直线方程 Y = Ax + b
        let { A, b } = this.resolveEquation(pointArray);
        let pointList = boundary.loops[0];
        //直线与边界的交点集合，N条边N个点，最终会保留两个交点
        let pointCollection = [];

        for (let n = 0, len = pointList.length; n < len; n++) {
            //item => 标识线段的两端点集合 [{x:x,y:y},{x:x,y:y}]
            let item = pointList[n];
            if (item[0].x === item[1].x) {
                let y = this.calculateCoordinate(A, b, item[0].x, 0);
                let point = { x: item[0].x, y: y };
                //如果交点Y坐标在线段两端之间则加入到集合
                if (Math.min(item[0].y, item[1].y) < y && Math.max(item[0].y, item[1].y) > y) {
                    pointCollection.push(point);
                }
            }

            if (item[0].y === item[1].y) {
                let x = this.calculateCoordinate(A, b, 0, item[0].y);
                let point = { x: x, y: item[0].y };
                //如果交点X坐标在线段两端之间则加入到集合
                if (Math.min(item[0].x, item[1].x) < x && Math.max(item[0].x, item[1].x) > x) {
                    pointCollection.push(point);
                }
            }
        }
        console.log(pointCollection);
    },

    /**
     * 根据直线方程求坐标点
     * @param {Number} A 直线斜率 
     * @param {Number} b 直线截距
     * @param {Number} x X坐标，如果X已知则Y传0
     * @param {Number} y Y坐标，如果Y已知则X传0
     */
    calculateCoordinate: function (A, b, x, y) {
        //如果x没有传值，求x；如果y没有传值，求y；
        if (!x) {
            if (A == 0) {
                console.warn("A can not be zero!");
                return;
            }
            return (y - b) / A;
        } else {
            return A * x + b;
        }
    }
});

export { MathLibrary }