import * as Cesium from "cesium";

//计算夹角弧线
export default function drawArc(center, startPoint, endPoint,index) {

    var distance1 = distanceCenter(startPoint, center);
    var distance2 = distanceCenter(endPoint, center);

    var radius = distance1 < distance2 ? distance1 : distance2;
    var startAngle = getAzimuth(startPoint, center);
    var endAngle = getAzimuth(endPoint, center);
    //优化绘制大扇形时像椭圆的问题
    var d_1 = startAngle * 180 / Math.PI;
    var d_2 = endAngle * 180 / Math.PI;
    let num  =( 180- Number(index))/40 +2 ;
    console.log(num);
    var pList1 = getArcPoints(center, radius/num, startAngle, endAngle);;

    return pList1

};
function getArcPoints (center, radius, startAngle, endAngle) {
    let [x, y, pnts, angleDiff] = [null, null, [], (endAngle - startAngle)]
    // angleDiff = ((angleDiff < 0) ? (angleDiff + (Math.PI * 2)) : angleDiff)

    if(Math.abs(angleDiff)>Math.PI)
    {
        angleDiff=angleDiff + (Math.PI * 2);
    }
    for (let i = 0; i <= 100; i++) {
        let angle = startAngle + angleDiff * i / 100
        x = center[0] + radius * Math.cos(angle)
        y = center[1] + radius * Math.sin(angle)
        pnts.push([x, y])
    }
    let point3d =poin2dsToPoint3ds(pnts,center[2])
     return point3d;
    return pnts
}
/**
 * 计算两个坐标之间的距离
 * @param pnt1
 * @param pnt2
 * @returns {number}
 * @constructor
 */
function distanceCenter(pnt1, pnt2) {
    return (Math.sqrt(Math.pow((pnt1[0] - pnt2[0]), 2) + Math.pow((pnt1[1] - pnt2[1]), 2)))
}

/**
 * 获取方位角（地平经度）
 * @param startPoint
 * @param endPoint
 * @returns {*}
 */
function getAzimuth(startPoint, endPoint) {
    let azimuth
    let angle = Math.asin(Math.abs(endPoint[1] - startPoint[1]) / (distanceCenter(startPoint, endPoint)))
    if (endPoint[1] >= startPoint[1] && endPoint[0] >= startPoint[0]) {
        azimuth = angle + Math.PI
    } else if (endPoint[1] >= startPoint[1] && endPoint[0] < startPoint[0]) {
        azimuth = Math.PI * 2 - angle
    } else if (endPoint[1] < startPoint[1] && endPoint[0] < startPoint[0]) {
        azimuth = angle
    } else if (endPoint[1] < startPoint[1] && endPoint[0] >= startPoint[0]) {
        azimuth = Math.PI - angle
    }
    return azimuth
}


//计算两个点的距离
function distance(lngLat1, lngLat2) {
    var radLat1 = lngLat1[1] * Math.PI / 180.0;
    var radLat2 = lngLat2[1] * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lngLat1[0] * Math.PI / 180.0 - lngLat2[0] * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10;
    return s
}

//获取一个圆的边缘坐标
function generatSectorPoints(center, radius, startAngle, endAngle) {
    startAngle = 90 - startAngle;
    endAngle = 90 - endAngle;
    console.log(startAngle, endAngle);
    if(startAngle>endAngle)
    {
        endAngle=startAngle*2-endAngle;
    }
    debugger
    console.log(startAngle, endAngle);
    let points = [];
    if (startAngle < endAngle) {
        for (let i = startAngle; i < endAngle; i += 2) {
            points.push(getCirclePoint(center[0], center[1], i, radius))
        }
    } else {
        for (let i = startAngle; i > endAngle; i -= 2) {
            points.push(getCirclePoint(center[0], center[1], i, radius))
        }
    }
    console.log(points);
   let point3d =poin2dsToPoint3ds(points,center[2])
    return point3d;
}

function getCirclePoint(lon, lat, angle, radius) {
    let dx = radius * Math.sin(angle * Math.PI / 180.0);
    let dy = radius * Math.cos(angle * Math.PI / 180.0);
    let ec = 6356725 + (6378137 - 6356725) * (90.0 - lat) / 90.0;
    let ed = ec * Math.cos(lat * Math.PI / 180);
    let newLon = (dx / ed + lon * Math.PI / 180.0) * 180.0 / Math.PI;
    let newLat = (dy / ec + lat * Math.PI / 180.0) * 180.0 / Math.PI;
    return [newLon, newLat];
}

export function point2dToPoint3d(point2d, height) {
    return Cesium.Cartesian3.fromDegrees(point2d[0], point2d[1], height);
}

export function poin2dsToPoint3ds(point2ds, height) {
    let point3ds = [];
    height = height || 0;
    for (let i = 0; i < point2ds.length; i++) {
        point3ds.push(point2dToPoint3d(point2ds[i], height));
        // point3ds.push(point2ds[i][0])
        // point3ds.push(point2ds[i][1])
        // point3ds.push(height)
    }
    // console.log(point3ds);
    // for (let index = 0; index < array.length; index++) {
    //     const element = array[index];

    // }


    return point3ds;

}
