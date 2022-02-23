import * as Cesium from "cesium";
const changeTimeline = function (viewer, timelineData) {


    let currentTime = new Date(
        timelineData.CurrentTime.substring(0, 4),
        timelineData.CurrentTime.substring(5, 7) - 1,
        timelineData.CurrentTime.substring(8, 10),
        timelineData.CurrentTime.substring(11, 13),
        timelineData.CurrentTime.substring(14, 16),
        timelineData.CurrentTime.substring(17, 19),
    )
    let startTime = new Date(
        timelineData.StartTime.substring(0, 4),
        timelineData.StartTime.substring(5, 7) - 1,
        timelineData.StartTime.substring(8, 10),
        timelineData.StartTime.substring(11, 13),
        timelineData.StartTime.substring(14, 16),
        timelineData.StartTime.substring(17, 19),
    )
    let stopTime = new Date(
        timelineData.StopTime.substring(0, 4),
        timelineData.StopTime.substring(5, 7) - 1,
        timelineData.StopTime.substring(8, 10),
        timelineData.StopTime.substring(11, 13),
        timelineData.StopTime.substring(14, 16),
        timelineData.StopTime.substring(17, 19),
    )

    viewer.clock.startTime = Cesium.JulianDate.fromDate(startTime);
    viewer.clock.currentTime = Cesium.JulianDate.fromDate(currentTime);
    viewer.clock.stopTime = Cesium.JulianDate.fromDate(stopTime);

    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.timeline.zoomTo(Cesium.JulianDate.fromDate(startTime), Cesium.JulianDate.fromDate(stopTime));
};

export default changeTimeline