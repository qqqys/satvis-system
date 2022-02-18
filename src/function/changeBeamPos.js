import * as Cesium from "cesium";
const changeBeamPos = function (viewer, Beam, satellite) {
    const entity = viewer.entities.getById(Beam.TargetObject);
    // 坐标转换
    let ellipsoid = viewer.scene.globe.ellipsoid;
    const cartesian3 = new Cesium.Cartesian3(satellite.Rx, satellite.Ry, satellite.Rz);
    let cartograhphic = ellipsoid.cartesianToCartographic(cartesian3);
    let lat = Cesium.Math.toDegrees(cartograhphic.latitude);
    let lng = Cesium.Math.toDegrees(cartograhphic.longitude);
    let hig = cartograhphic.height / 2;

    entity.cylinder.length = cartograhphic.height
    entity.position = Cesium.Cartesian3.fromDegrees(lng, lat, hig)


};

export default changeBeamPos