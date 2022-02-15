import * as Cesium from "cesium";
import { ElMessage } from 'element-plus'
var line = []
const addProperty = function(viewers, property) {
    for (var i = 0; i < property.TrackPoints.length; i += 3) {
        line.push(Cesium.Cartesian3.fromArray(property.TrackPoints, i));
    }
    viewers.entities.add({
        name: property.TargetObject,
        id: property.TargetObject,
        polyline: {
            positions: line,
            width: property.LineWidth,
            material: Cesium.Color.fromCssColorString("rgb" + property.Color),
        },
    });
};

export default addProperty