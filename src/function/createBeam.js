import * as Cesium from "cesium";
const createBeam = function (viewer, Beam) {
  let satellite = viewer.entities.getById(Beam.BeamOwner);
  viewer.entities.add({
    id: Beam.TargetObject,
    position:satellite.position._value,
    cylinder: {
      length:Beam.BeamLength,
      topRadius: 0.0,
      bottomRadius: Math.tan(Beam.BeamAngle*180/3.14)*Beam.BeamLength,
      material: Cesium.Color.RED.withAlpha(1),
    },
  })
};

export default createBeam