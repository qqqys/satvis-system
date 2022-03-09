import * as Cesium from "cesium";
const loadFile = (name) => {
    const xhr = new XMLHttpRequest()
    const okStatus = document.location.protocol === 'file:' ? 0 : 200
    xhr.open('GET', name, false)
    xhr.overrideMimeType('text/html;charset=utf-8')// 默认为utf-8
    xhr.send(null)
    return xhr.status === okStatus ? xhr.responseText : null
}


const addBeamPattern = function (viewer, BeamPattern) {
    let satellite = viewer.entities.getById(BeamPattern.BeamOwner);
    let satellite_pos = satellite.position._value
    let file = loadFile('/BeamPatterns/pattern1.Pattern').split('\n').slice(6,-1)

    for(let i = 0; i < file.length-1; i++){
        let data_s = file[i].split(' ').filter((value,index,self) =>{
            return value !== ''
        })
        let data_e = file[i+1].split(' ').filter((value,index,self) =>{
            return value !== ''
        })
        viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy([
                    satellite_pos, 
                    Cesium.Cartesian3.fromDegrees( data_s[0], data_s[0], 0),
                    Cesium.Cartesian3.fromDegrees( data_e[1], data_e[1], 0),
                ]),
                material:Cesium.Color.fromCssColorString("rgb(155,0,0)"),
                perPositionHeight:true
            },
        });
    }
};

export default addBeamPattern