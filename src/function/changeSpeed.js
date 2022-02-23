import * as Cesium from "cesium";
const changeSpeed = function (viewer, timelineData) {
    viewer.clockViewModel.multiplier = timelineData.Multiplier
};

export default changeSpeed