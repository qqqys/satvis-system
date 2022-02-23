import * as Cesium from "cesium";
const createBeam = function (viewer, Beam) {
  viewer.entities.add({
    id: Beam.TargetObject,
    cylinder: {

      topRadius: 250000.0,
      bottomRadius: 0,
      material: Cesium.Color.RED.withAlpha(0.7),
    },
  })
};

export default createBeam