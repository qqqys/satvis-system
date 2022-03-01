import * as Cesium from "cesium";
const changePos = function(viewer, satellite) {
    const entity = viewer.entities.getById(satellite.TargetObject);
    entity.position = new Cesium.Cartesian3(
            satellite.Rx,
            satellite.Ry,
            satellite.Rz
        ),
        entity.orientation = new Cesium.Quaternion(
            satellite.Q1,
            satellite.Q2,
            satellite.Q3,
            satellite.Q0
        )
};

export default changePos