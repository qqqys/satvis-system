import * as Cesium from "cesium";
const addTrack = function(viewer, Track) {
    const position = [];
    const entity = viewer.entities.getById(Track.TargetObject)

    for (var i = 0; i < Track.TrackPoints.length; i += 3) {
        position.push(Cesium.Cartesian3.fromArray(Track.TrackPoints, i));
    }
    // line.push(line[0])

    if (!entity) {
        viewer.entities.add({
            name: Track.TargetObject,
            id: Track.TargetObject,
            polyline: {
                positions: position,
                width: Track.LineWidth,
                material: Cesium.Color.fromCssColorString("rgb" + Track.Color),
            },
        });
    } else {
        entity.polyline.positions = position
    }

};

export default addTrack