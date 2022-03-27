import image from "../assets/colors1.png"
import * as Cesium from "cesium";

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
PolylineTrailLinkMaterialProperty.prototype.equals = function(other) {};

Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
Cesium.Material.PolylineTrailLinkImage = image; //图片
Cesium.Material.PolylineTrailLinkSource = `czm_material czm_getMaterial(czm_materialInput materialInput)
  {
      czm_material material = czm_getDefaultMaterial(materialInput);
      vec2 st = materialInput.st;
      vec4 colorImage = texture2D(image, vec2(fract(-(st.s + time)), st.t));
      material.alpha = colorImage.a * color.a;
      material.diffuse = color.rgb;
      material.emission = vec3(0.8);
      return material;
  }`;

Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
    fabric: {
        type: Cesium.Material.PolylineTrailLinkType,
        uniforms: {
            color: new Cesium.Color(255, 255, 255, 1),
            image: Cesium.Material.PolylineTrailLinkImage,
            time: 0
        },
        source: Cesium.Material.PolylineTrailLinkSource
    },
    translucent: function(material) {
        return true;
    }
})

export default PolylineTrailLinkMaterialProperty