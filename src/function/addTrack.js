import * as Cesium from "cesium";
const addTrack = function(viewer, Track) {
    const line = [];
    const entity = viewer.entities.getById(Track.TargetObject)
    const interval = Track.TrackPoints.length / 10

    for (var i = 0; i < Track.TrackPoints.length; i += interval) {
        line.push(Cesium.Cartesian3.fromArray(Track.TrackPoints, i));
    }
    line.push(line[0])

    if (!entity) {
        viewer.entities.add({
            name: Track.TargetObject,
            id: Track.TargetObject,
            polyline: {
                positions: line,
                width: Track.LineWidth,
                material: Cesium.Color.fromCssColorString("rgb" + Track.Color),
            },
        });
    } else {
        entity.polyline.positions = line
    }

};

export default addTrack