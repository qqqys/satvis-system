import * as Cesium from "cesium";
const createSat = function(viewer, satellite) {
    viewer.entities.add({
        id: satellite.TargetObject,
        box: {
            dimensions: new Cesium.Cartesian3(500000.0, 200000.0, 200000.0),
            material: Cesium.Color.RED.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.BLACK,
        }
    });
};

export default createSat