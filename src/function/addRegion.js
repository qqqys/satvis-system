import * as Cesium from "cesium";
const addRegion = function(viewer, Region) {
    const position = [];
    const entity = viewer.entities.getById(Region.TargetObject)

    for (var i = 0; i < Region.TrackPoints.length; i += 3) {
        position.push(Cesium.Cartesian3.fromArray(Region.TrackPoints, i));
    }

    if (!entity) {
        viewer.entities.add({
            name: Region.TargetObject,
            id: Region.TargetObject,
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(position),
                material: Cesium.Color.fromCssColorString("rgb" + Region.Color)
            },
        });

    } else {
        entity.polyline.positions = position
    }

};

export default addRegion