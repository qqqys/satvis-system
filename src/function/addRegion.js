import * as Cesium from "cesium";
import PolylineTrailLinkMaterialProperty from './addstreamer'


const addRegion = function(viewer, Region) {
    const position = [];

    for (var i = 0; i < Region.TrackPoints.length; i += 3) {
        position.push(Cesium.Cartesian3.fromElements(Region.TrackPoints[i], Region.TrackPoints[i + 1], Region.TrackPoints[i + 2]));
    }
    position.push(position[0])
    viewer.entities.add({
        name: Region.TargetObject,
        id: Region.TargetObject,
        polygon: {
            hierarchy: new Cesium.PolygonHierarchy(position),
            material: Cesium.Color.fromCssColorString("rgb" + Region.Color).withAlpha(0.7),
            height: 50000
        },
    });

    viewer.entities.add({
        name: 'saomiao',
        id: Region.TargetObject + '1',
        polygon: {
            hierarchy: new Cesium.PolygonHierarchy(position),
            material: new PolylineTrailLinkMaterialProperty(Cesium.Color.fromCssColorString("rgb" + Region.Color), 1000),
            height: 49700
        }
    })

    viewer.entities.add({
        name: 'streamer',
        id: Region.TargetObject + 'streamer',
        wall: {
            positions: position,
            material: new PolylineTrailLinkMaterialProperty(Cesium.Color.fromCssColorString("rgb" + Region.Color), 1500),
            minimumHeights: Array(position.length).fill(50000),
            maximumHeights: Array(position.length).fill(100000)
        }
    })

};

export default addRegion