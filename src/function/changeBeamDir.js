import * as Cesium from "cesium";
const changeBeamDir = function (viewer, Beam) {
    const entity = viewer.entities.getById(Beam.TargetObject);


    const satellite = viewer.entities.getById(Beam.BeamOwner)

    //let headingPitchRoll = new Cesium.HeadingPitchRoll()
      //Cesium.HeadingPitchRoll.fromQuaternion(new Cesium.Quaternion(-0.13000214746494262,0.6950957093700982,-0.7037393293347388,0.06850075048694769), headingPitchRoll)
      //var orientation = Cesium.Transforms.headingPitchRollQuaternion(new Cesium.Cartesian3(-8204011.227106312,27988689.29170859,22881.078117065277), headingPitchRoll);
      var rotationMatrix = Cesium.Matrix3.fromQuaternion(new Cesium.Quaternion(Beam.Q1,Beam.Q2,Beam.Q3,Beam.Q0));
      var offsetVector = new Cesium.Cartesian3(0, 0, Beam.BeamLength/2);
      offsetVector = Cesium.Matrix3.multiplyByVector(rotationMatrix, offsetVector, offsetVector);
    
      var newPosition = new Cesium.Cartesian3(satellite.position._value.x,satellite.position._value.y,satellite.position._value.z)
      Cesium.Cartesian3.add(newPosition, offsetVector, newPosition);
    entity.position = newPosition
    entity.orientation = new Cesium.Quaternion(
        Beam.Q1,
        Beam.Q2,
        Beam.Q3,
        Beam.Q0
    )
    entity.cylinder = {
        topRadius: Beam.BeamLength*Math.tan(Math.PI*Beam.BeamAngle/360),
        bottomRadius: 0,
        length:Beam.BeamLength,
        material: Cesium.Color.RED.withAlpha(0.7),
    }
    console.log()
};

export default changeBeamDir