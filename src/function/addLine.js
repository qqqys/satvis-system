import * as Cesium from "cesium";
const addLine = function(viewer, line) {
    const pos1 = viewer.entities.getById(line.LineStartObject).position._value;
    const pos2 = viewer.entities.getById(line.LineEndObject).position._value;
    let material
    if (line.LineType === 1.0)
        material = Cesium.Color.fromCssColorString("rgb" + line.Color)
    else {
        material = new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.fromCssColorString("rgb" + line.Color),
            dashLength: 20, //短划线长度
        })
    }
    const entity =  viewer.entities.getById(line.TargetObject)
    if(entity){
        entity.polyline = {
            arcType: Cesium.ArcType.NONE,
            positions: [pos1, pos2],
            width: line.LineWidth,
            material: material,
        }
    }
    else{
        viewer.entities.add({
            id: line.TargetObject,
            polyline: {
                arcType: Cesium.ArcType.NONE,
                positions: [pos1, pos2],
                width: line.LineWidth,
                material: material,
            },
        });
    }

};

export default addLine