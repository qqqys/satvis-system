import * as Cesium from "cesium";
import { ElMessage } from "element-plus";
const createBeam = function (viewer, Beam) {
  let satellite = viewer.entities.getById(Beam.BeamOwner);
  if(satellite === undefined){
    ElMessage.warning("波束"+Beam.TargetObject+"对应的卫星"+Beam.BeamOwner+"不存在, 波束添加失败")
    return
  }
  viewer.entities.add({
    id: Beam.TargetObject,
    position:satellite.position?._value,
    type: Beam.BeamType,
    cylinder: {
      length:Beam.BeamLength,
      topRadius: 0.0,
      bottomRadius: Math.tan(Beam.BeamAngle*180/3.14)*Beam.BeamLength,
      material: Cesium.Color.fromCssColorString("rgb" + Beam.Color).withAlpha(Beam.Transparency),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString("rgb" + Beam.Color).withAlpha(Beam.Transparency),
      outlineWidth: 1.0
    },
  })
  console.log(viewer.entities.getById(Beam.TargetObject));
};

export default createBeam