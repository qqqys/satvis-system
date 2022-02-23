import * as Cesium from "cesium";
const addFollow = function (viewer, beam, origin, target, beamdata) {
    const entity = viewer.entities.getById(beam.TargetObject)
    let originPosition = new Cesium.Cartesian3(
        origin.Rx,
        origin.Ry,
        origin.Rz
    )
    let targetPosition = new Cesium.Cartesian3(
        target.Rx,
        target.Ry,
        target.Rz
    )
    var d = Cesium.Cartesian3.distance(originPosition, targetPosition);
    // entity.cylinder.length = beamdata.BeamLength
    entity.cylinder.length = d
    let getModelMatrix = function (pointA, pointB) {
        //向量AB
        const vector2 = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3())
        //归一化
        const normal = Cesium.Cartesian3.normalize(vector2, new Cesium.Cartesian3())
        //旋转矩阵 rotationMatrixFromPositionVelocity源码中有，并未出现在cesiumAPI中
        const rotationMatrix3 = Cesium.Transforms.rotationMatrixFromPositionVelocity(pointA, normal, Cesium.Ellipsoid.WGS84)
        const orientation = Cesium.Quaternion.fromRotationMatrix(rotationMatrix3)
        const modelMatrix4 = Cesium.Matrix4.fromRotationTranslation(rotationMatrix3, pointA)
        //点B的模型矩阵
        //const modelMatrix4 = Cesium.Matrix4.fromRotationTranslation(rotationMatrix3, pointB)
        const hpr = Cesium.HeadingPitchRoll.fromQuaternion(orientation)
        return modelMatrix4
    }
    let m = getModelMatrix(originPosition, targetPosition)
    let hpr = Cesium.Transforms.fixedFrameToHeadingPitchRoll(m)
    hpr.pitch = hpr.pitch + 3.14 / 2
    entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(originPosition, hpr);
    entity.position = Cesium.Cartesian3.midpoint(originPosition, targetPosition, new Cesium.Cartesian3())

}

export default addFollow
