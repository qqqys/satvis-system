<template>
</template>

<script>
import * as Cesium from 'cesium'
import dat from 'dat.gui'
import PolylineTrailLinkMaterialProperty from '../function/addstreamer'
const Entities = [
  {
    id: 'Sat11',
    show: true,
    Beam: [
      {
        id: 'Beam11',
        color: 'red',
      },
      {
        id: 'Beam12',
        color: 'pink',
      },
    ],
  },
  {
    id: 'Sat12',
    show: false,
    Beam: ['Beam11', 'Beam12'],
  },
]
export default {
  // props: ["Entities"],
  setup() {
    setTimeout(() => {
      let entitiesCollection = window.viewer.entities._entities._array
      console.log(entitiesCollection)
      let gui = new dat.GUI()
      let style = {
        position: 'absolute',
        left: '0px',
        top: '20px',
      }
      gui.domElement.style.position = style.position
      gui.domElement.style.left = style.left
      gui.domElement.style.top = style.top
      for (let i = 0; i < entitiesCollection.length; i++) {
        let id = entitiesCollection[i]._id
        if (
          id.includes('Sat') ||
          id.includes('Beam') ||
          id == 'RegionSpecial'
        ) {
          let title = gui.addFolder(id)
          let fixInfoTitle = title.addFolder('信息')
          let flexInfoTitle = title.addFolder('操作')
          if (id.includes('Sat')) {
            let value = viewer.entities.getById(id).position._value
            let ori = viewer.entities.getById(id).orientation._value
            console.log(ori)
            let prop = {
              '经度/°': Number(
                Cesium.Math.toDegrees(
                  Cesium.Cartographic.fromCartesian(value).latitude
                ).toFixed(6)
              ),
              '纬度/°': Number(
                Cesium.Math.toDegrees(
                  Cesium.Cartographic.fromCartesian(value).longitude
                ).toFixed(6)
              ),
              '高度/km': Number(
                Cesium.Math.toDegrees(
                  Cesium.Cartographic.fromCartesian(value).height
                ).toFixed(6) / 1000
              ),
              '坐标(x,y,z)/km':
                '(' +
                (value.x / 1000).toFixed(0) +
                ',' +
                (value.y / 1000).toFixed(0) +
                ',' +
                (value.z / 1000).toFixed(0) +
                ')',
              转向w: ori.w.toFixed(6),
              转向x: ori.x.toFixed(6),
              转向y: ori.y.toFixed(6),
              转向z: ori.z.toFixed(6),
            }
            let scale = viewer.entities.getById(id)._model._scale._value
            console.log(scale)
            var prop2 = {
              大小: scale,
            }
            fixInfoTitle.add(prop, '经度/°')
            fixInfoTitle.add(prop, '纬度/°')
            fixInfoTitle.add(prop, '高度/km')
            fixInfoTitle.add(prop, '坐标(x,y,z)/km')
            fixInfoTitle.add(prop, '转向w')
            fixInfoTitle.add(prop, '转向x')
            fixInfoTitle.add(prop, '转向y')
            fixInfoTitle.add(prop, '转向z')
            flexInfoTitle
              .add(prop2, '大小', 50, 400)
              .step(1)
              .onChange(function (val) {
                {
                  let entity = viewer.entities.getById(id)
                  entity._model._scale._value = val
                }
              })
            // fixInfoTitle.add(prop, '大小')
          } else if (id.includes('Beam')) {
            let value =
              window.viewer.entities.getById(id).cylinder.material._color._value
            console.log(window.viewer.entities.getById(id).cylinder)
            let prop = {
              alpha: value.alpha,
              red: value.red * 255,
              blue: value.blue * 255,
              green: value.green * 255,
              length:
                window.viewer.entities.getById(id).cylinder._length._value + '',
            }

            let entity = window.viewer.entities.getById(id)
            flexInfoTitle
              .add(prop, 'alpha', 0, 1)
              .step(0.05)
              .onChange(function (val) {
                {
                  entity.cylinder.material = Cesium.Color.fromAlpha(
                    entity.cylinder.material._color._value,
                    val
                  )
                }
              })
            flexInfoTitle
              .add(prop, 'red', 0, 255)
              .step(1)
              .onChange(function (val) {
                {
                  entity.cylinder.material = Cesium.Color.fromCssColorString(
                    'rgb(' + val + ',' + prop.green + ',' + prop.blue + ')'
                  ).withAlpha(prop.alpha)
                }
              })
            flexInfoTitle
              .add(prop, 'green', 0, 255)
              .step(1)
              .onChange(function (val) {
                {
                  entity.cylinder.material = Cesium.Color.fromCssColorString(
                    'rgb(' + prop.red + ',' + val + ',' + prop.blue + ')'
                  ).withAlpha(prop.alpha)
                }
              })
            flexInfoTitle
              .add(prop, 'blue', 0, 255)
              .step(1)
              .onChange(function (val) {
                {
                  entity.cylinder.material = Cesium.Color.fromCssColorString(
                    'rgb(' + prop.red + ',' + prop.green + ',' + val + ')'
                  ).withAlpha(prop.alpha)
                }
              })
            fixInfoTitle.add(prop, 'length')
          } else {
            let value =
              viewer.entities.getById(id).polygon.material._color._value
            let prop = {
              alpha: value.alpha,
              red: value.red * 255,
              blue: value.blue * 255,
              green: value.green * 255,
            }
            let entity = viewer.entities.getById(id)
            let streamer = viewer.entities.getById(id + 'streamer')

            flexInfoTitle
              .add(prop, 'alpha', 0, 1)
              .step(0.05)
              .onChange(function (val) {
                {
                  entity.polygon.material = Cesium.Color.fromAlpha(
                    entity.polygon.material._color._value,
                    val
                  )
                }
              })
            flexInfoTitle
              .add(prop, 'red', 0, 255)
              .step(1)
              .onChange(function (val) {
                {
                  let color =
                    'rgb(' + val + ',' + prop.green + ',' + prop.blue + ')'
                  entity.polygon.material = Cesium.Color.fromCssColorString(
                    color
                  ).withAlpha(prop.alpha)
                  streamer.wall.material =
                    new PolylineTrailLinkMaterialProperty(
                      Cesium.Color.fromCssColorString(color),
                      1500
                    )
                }
              })
            flexInfoTitle
              .add(prop, 'green', 0, 255)
              .step(1)
              .onChange(function (val) {
                {
                  let color =
                    'rgb(' + prop.red + ',' + val + ',' + prop.blue + ')'
                  entity.polygon.material = Cesium.Color.fromCssColorString(
                    color
                  ).withAlpha(prop.alpha)
                  streamer.wall.material =
                    new PolylineTrailLinkMaterialProperty(
                      Cesium.Color.fromCssColorString(color),
                      1500
                    )
                }
              })
            flexInfoTitle
              .add(prop, 'blue', 0, 255)
              .step(1)
              .onChange(function (val) {
                {
                  let color =
                    'rgb(' + prop.red + ',' + prop.green + ',' + val + ')'
                  entity.polygon.material = Cesium.Color.fromCssColorString(
                    color
                  ).withAlpha(prop.alpha)
                  streamer.wall.material =
                    new PolylineTrailLinkMaterialProperty(
                      Cesium.Color.fromCssColorString(color),
                      1500
                    )
                }
              })
          }
        }
      }
      let inputNode = document.getElementsByClassName('c')
      for (let i of inputNode) {
        i.firstChild.disabled = true
      }
      let inputNode2 = document.getElementsByTagName('input')
      for (let i of inputNode2) {
        i.style.color = '#edffff'
      }
      let inputNode3 = document.getElementsByClassName('cr')
      for (let i of inputNode3) {
        i.style['border-left'] = '3px solid #edffff'
      }
      let inputNode4 = document.getElementsByClassName('slider-fg')
      for (let i of inputNode4) {
        i.style['background'] = '#edffff'
      }
      document.querySelector(
        'body > div.dg.ac > div:nth-child(1) > div.close-button.close-bottom'
      ).style.display = 'none'
    }, 1000)

    return {
      Entities,
    }
  },
}
</script>

<style>
</style>