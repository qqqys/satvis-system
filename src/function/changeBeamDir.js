import * as Cesium from "cesium";
const changeBeamPos = function (viewer, Beam, satellite) {
    const entity = viewer.entities.getById(Beam.TargetObject);
    entity.orientation = new Cesium.Quaternion(
        satellite.Q0,
        satellite.Q1,
        satellite.Q2,
        satellite.Q3
    )
};

export default changeBeamPos