import * as Cesium from "cesium";
const changeClock = function (viewer, timelineData) {
    let currentTime = new Date(
        timelineData.CurrentTime.substring(0, 4),
        timelineData.CurrentTime.substring(5, 7),
        timelineData.CurrentTime.substring(8, 10),
        timelineData.CurrentTime.substring(11, 13),
        timelineData.CurrentTime.substring(14, 16),
        timelineData.CurrentTime.substring(17, 19),
    )
    viewer.clock.currentTime = Cesium.JulianDate.fromDate(currentTime)
};

export default changeClock