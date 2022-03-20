import * as Cesium from "cesium";
import image from "../assets/colors1.png"


const addRegion = function(viewer, Region) {
    const position = [];
    const entity = viewer.entities.getById(Region.TargetObject)

    for (var i = 0; i < Region.TrackPoints.length; i += 3) {
        position.push(Cesium.Cartesian3.fromArray(Region.TrackPoints, i));
    }
    viewer.entities.add({
        name: Region.TargetObject,
        id: Region.TargetObject,
        polygon: {
            hierarchy: new Cesium.PolygonHierarchy(position),
            material: Cesium.Color.fromCssColorString("rgb" + Region.Color).withAlpha(0.7),
            height: 50000,
            outlineWidth: 1000000,
            outlineColor: Cesium.Color.WHITE
        },
    });

    viewer.entities.add({
        name: 'yscNoNeedEntity',
        id: Region.TargetObject + '1',
        polygon: {
            hierarchy: new Cesium.PolygonHierarchy(position),
            material: new PolylineTrailLinkMaterialProperty(Cesium.Color.fromCssColorString("rgb" + Region.Color), 1000),
            height: 49700
        }
    })

};

function PolylineTrailLinkMaterialProperty(color, duration) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
    this.duration = duration;
    this._time = (new Date()).getTime();
}

Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
    isConstant: {
        get: function() {
            return false;
        }
    },
    definitionChanged: {
        get: function() {
            return this._definitionChanged;
        }
    },
    color: Cesium.createPropertyDescriptor('color')
});

PolylineTrailLinkMaterialProperty.prototype.getType = function(time) {
    return 'PolylineTrailLink';
}
PolylineTrailLinkMaterialProperty.prototype.getValue = function(time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.PolylineTrailLinkImage;
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    return result;
}
PolylineTrailLinkMaterialProperty.prototype.equals = function(other) {
    return this === other || (other instanceof PolylineTrailLinkMaterialProperty && Property.equals(this._color, other._color))
};

Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
Cesium.Material.PolylineTrailLinkImage = image; //图片
Cesium.Material.PolylineTrailLinkSource = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
    {\n\
        czm_material material = czm_getDefaultMaterial(materialInput);\n\
        vec2 st = materialInput.st;\n\
        vec4 colorImage = texture2D(image, vec2(fract(-(st.s + time)), st.t));\n\
        material.alpha = colorImage.a * color.a;\n\
        material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
        return material;\n\
    }";

Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
    fabric: {
        type: Cesium.Material.PolylineTrailLinkType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.PolylineTrailLinkImage,
            time: 0
        },
        source: Cesium.Material.PolylineTrailLinkSource
    },
    translucent: function(material) {
        return true;
    }
})

export default addRegion