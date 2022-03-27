import * as Cesium from "cesium";
import { ElMessage } from "element-plus";
const modifyBeam = function(viewer, Beam) {
    let entity = viewer.entities.getById(Beam.TargetObject);
    const satellite = viewer.entities.getById(Beam.BeamOwner);
    if(entity === undefined){
        ElMessage.warning("未添加波束"+Beam.TargetObject)
        return
    }
    if(satellite.position === undefined){
        ElMessage.warning("卫星"+Beam.BeamOwne+"位置不明确")
    }

    var rotationMatrix = Cesium.Matrix3.fromQuaternion(new Cesium.Quaternion(Beam.Q1, Beam.Q2, Beam.Q3, Beam.Q0));
    var offsetVector = new Cesium.Cartesian3(0, 0, Beam.BeamLength / 2);
    offsetVector = Cesium.Matrix3.multiplyByVector(rotationMatrix, offsetVector, offsetVector);

    var newPosition = new Cesium.Cartesian3(satellite.position._value.x, satellite.position._value.y, satellite.position._value.z)
    Cesium.Cartesian3.add(newPosition, offsetVector, newPosition);
    entity.position = newPosition
    entity.orientation = new Cesium.Quaternion(
        Beam.Q1,
        Beam.Q2,
        Beam.Q3,
        Beam.Q0
    )
    entity.cylinder.topRadius = Beam.BeamLength * Math.tan(Math.PI * Beam.BeamAngle / 360)
    entity.cylinder.bottomRadius = 0
    entity.cylinder.length = Beam.BeamLength
};

export default modifyBeam