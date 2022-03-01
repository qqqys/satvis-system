import * as Cesium from "cesium";
const createSat = function(viewer, satellite) {
    viewer.entities.add({
        id: satellite.TargetObject,
        model:{
            uri: '/models/sat12/scene.gltf',
            scale: 500
        }
    });
};

export default createSat