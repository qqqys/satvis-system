const deleteRegion = function(viewer, Region) {
    viewer.entities.removeById(Region.TargetObject)
    viewer.entities.removeById(Region.TargetObject + '1')
};

export default deleteRegion