import * as Cesium from "cesium";
const parseOrStartTime = function (viewer, timelineData) {
    viewer.clock.shouldAnimate = (timelineData.ShouldAnimate == 1);
};

export default parseOrStartTime