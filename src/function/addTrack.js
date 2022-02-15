import * as Cesium from "cesium";
const addTrack = function(viewer, Track) {
    const line = [];
    for (var i = 0; i < Track.TrackPoints.length; i += 30) {
        line.push(Cesium.Cartesian3.fromArray(Track.TrackPoints, i));
    }
    line.push(line[0])

    viewer.entities.add({
        name: Track.TargetObject,
        id: Track.TargetObject,
        polyline: {
            positions: line,
            width: Track.LineWidth,
            material: Cesium.Color.fromCssColorString("rgb" + Track.Color),
        },
    });
};

export default addTrack