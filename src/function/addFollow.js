import * as Cesium from "cesium";
const addFollow = function (viewer, beamId, ownerId, targetId) {
    const entity = viewer.entities.getById(beamId)
    const beamOwner = viewer.entities.getById(ownerId)
    const beamTarget = viewer.entities.getById(targetId)
    console.log(beamOwner);
    console.log(beamTarget);
    let beamOwnerPositon = beamOwner.position._value
    let beamTargetPostion = beamTarget.position._value
    

    var d = Cesium.Cartesian3.distance(beamOwnerPositon, beamTargetPostion);

    entity.cylinder = {
        topRadius: 0,
        bottomRadius: 500000,
        length: d,
        material: Cesium.Color.RED.withAlpha(0.7),
    }

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
    let m = getModelMatrix(beamOwnerPositon, beamTargetPostion)
    let hpr = Cesium.Transforms.fixedFrameToHeadingPitchRoll(m)
    hpr.pitch = hpr.pitch + 3.14 / 2
    entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(beamOwnerPositon, hpr);
    entity.position = Cesium.Cartesian3.midpoint(beamOwnerPositon, beamTargetPostion, new Cesium.Cartesian3())
}

export default addFollow
