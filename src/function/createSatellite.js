import * as Cesium from "cesium";
const createSatellite = function(viewer, satellite) {
    let modelPath = satellite.Model3DFile?satellite.Model3DFile:"model/weixin.gltf"
    console.log(modelPath);
    viewer.entities.add({
        id: satellite.TargetObject,
        model:{
            uri: '/'+modelPath,
            scale: 100
        }
    });
};

export default createSatellite