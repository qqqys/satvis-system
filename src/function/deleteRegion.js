const deleteRegion = function(viewer, Region) {
    viewer.entities.removeById(Region.TargetObject)
    viewer.entities.removeById(Region.TargetObject + '1')
    viewer.entities.removeById(Region.TargetObject + 'streamer')
};

export default deleteRegion