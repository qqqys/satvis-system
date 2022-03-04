import * as Cesium from "cesium";
const changeCamera = function (viewer, camera) {
    let entity = viewer.entities.getById(camera.TargetObject)
    console.log(entity);
    if(entity === undefined){
        viewer.camera.flyHome()
    }
    else{
        var heading = Cesium.Math.toRadians(camera.CameraHeading);
        var pitch = Cesium.Math.toRadians(camera.CameraPitch);
        var range = camera.CameraRange;
        viewer.flyTo(entity, {
            offset: new Cesium.HeadingPitchRange(heading, pitch, range),
        });
    }

};

export default changeCamera