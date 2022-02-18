const addFollow = function(viewer, orientation, targetPosition){
    viewer.entities.add({
        orientation: new Cesium.CallbackProperty(e => {
            let m = this.getModelMatrix(this.originPosition, this.targetPosition);
            let hpr = this.getHeadingPitchRoll(m);
            hpr.pitch = hpr.pitch + 3.14 / 2 + 3.14;
            return Cesium.Transforms.headingPitchRollQuaternion(this.originPosition, hpr);
        }, false),
        position: new Cesium.CallbackProperty(e => {
            return Cesium.Cartesian3.midpoint(this.originPosition, this.targetPosition, new Cesium.Cartesian3())
        }, false),
        cylinder: {
            length: new Cesium.CallbackProperty(e => {
                return Cesium.Cartesian3.distance(this.originPosition, this.targetPosition)
            }, false),
            topRadius: 15.0,
            bottomRadius: 0.0,
            material: Cesium.Color.RED.withAlpha(0.4),
        },
    });
}
