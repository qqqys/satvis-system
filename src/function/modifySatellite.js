import * as Cesium from "cesium";
import createSatellite from "./createSatellite";
const modifySatellite = function(viewer, satellite) {
    let entity = viewer.entities.getById(satellite.TargetObject);
    if(entity === undefined){
        createSatellite(viewer, satellite)
        entity = viewer.entities.getById(satellite.TargetObject);
    }
    if(satellite.Visible !== undefined){
        if(satellite.Visible == 1){
            entity.show = true
        }
        else if(satellite.Visible == 0){
            entity.show = false
        }
    }
    if(satellite.Rx){
        entity.position = new Cesium.Cartesian3(satellite.Rx, satellite.Ry, satellite.Rz)
        entity.orientation = new Cesium.Quaternion(satellite.Q1, satellite.Q2, satellite.Q3, satellite.Q0)
    }

};

export default modifySatellite