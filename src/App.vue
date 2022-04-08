<template>
  <div class="container" style="background-image: url(../src/assets/back.jpg); background-size: 100%;">
    <div style="z-index: 1000;" id="cesiumContainer">
      <test-header></test-header>
      <change-menu></change-menu>
      <web-socket @cmsg="fmsg"></web-socket>
    </div>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import dat from 'dat.gui'
import { defineComponent, onMounted, reactive } from '@vue/runtime-core'
import _ from 'lodash'
import changePos from './function/changePos'
import createSat from './function/createSatellite'
import WebSocket from './components/WebSocket.vue'
import addTrack from './function/addTrack'
import createBeam from './function/createBeam'
import changeCamera from './function/changeCamera'
import TestHeader from './components/TestHeader.vue'
import ObjectMenu from './components/ObjectMenu.vue'
import ChangeMenu from './components/ChangeMenu.vue'
import changeBeamDir from './function/changeBeamDir'
import addFollow from './function/addFollow'
import addRegion from './function/addRegion'
import PolylineTrailLinkMaterialProperty from './function/addstreamer'

export default defineComponent({
  components: {
    WebSocket,
    TestHeader,
    ObjectMenu,
    ChangeMenu,
  },
  setup() {
    onMounted(() => {
      Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTdmMTdmNS00NzZhLTQwOGMtODQwYy1kZjAyMzNiOTg0ZTYiLCJpZCI6MzMwMjQsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTc4OTE3ODl9.yqF540oYBpSme38SIPKUP4t14FA6hXCLFHnvOqPf_Fw'
      let viewer = new Cesium.Viewer('cesiumContainer', {
        geocoder: false, //一种地理位置搜索工具，用于显示相机访问的地理位置。默认使用微软的Bing地图。
        homeButton: true, //首页位置，点击之后将视图跳转到默认视角。
        sceneModePicker: true, //切换2D、3D 和 Columbus View (CV) 模式。
        baseLayerPicker: false, //选择三维数字地球的底图（imagery and terrain）。
        navigationHelpButton: true, //帮助提示，如何操作数字地球。
        animation: false, //控制视窗动画的播放速度。
        creditsDisplay: false, //展示商标版权和数据源。
        timeline: false, //展示当前时间和允许用户在进度条上拖动到任何一个指定的时间。
        showRenderLoopErrors: true,
        fullscreenButton: true, //视察全屏按钮,
        //terrainProvider: Cesium.createWorldTerrain()//地形
        animation: true,
        timeline: true,
        orderIndependentTranslucency: false,
        contextOptions: {
          webgl: {
            alpha: true,
          },
        },
        // imageryProvider:new Cesium.UrlTemplateImageryProvider({
        // url : 'http://127.0.0.1:9191/map/{z}/{x}/{y}.png',
        // })
      })

      viewer.scene.globe.enableLighting = false //启用以太阳为光源的地球
      viewer._cesiumWidget._creditContainer.style.display = 'none' //取消版权信息显示
      viewer.scene.debugShowFramesPerSecond = true
      viewer.scene.skyBox.show = false
      viewer.scene.backgroundColor = new Cesium.Color(0, 0, 0, 0)
      viewer.scene.globe.depthTestAgainstTerrain = true
      window.viewer = viewer

      function icrf(scene, time) {
        if (scene.mode !== Cesium.SceneMode.SCENE3D) {
          return
        }
        let icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time)
        if (Cesium.defined(icrfToFixed)) {
          let camera = viewer.camera
          let offset = Cesium.Cartesian3.clone(camera.position)
          let transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed)
          camera.lookAtTransform(transform, offset)
        }
      }
      viewer.scene.postUpdate.addEventListener(icrf)

      let sat1 = {
        MessageType: 'Add',
        UserName: 'admin',
        TargetObject: 'Sat11',
        TargetType: '3DModel',
        Model3DFile: 'model/weixin.gltf',
        ModelIconFile: 'model/weixin.png',
        ModelInfoString: '卫星11',
      }
      let sat2 = {
        MessageType: 'Add',
        UserName: 'admin',
        TargetObject: 'Sat12',
        TargetType: '3DModel',
        Model3DFile: 'model/weixin.gltf',
        ModelIconFile: 'model/weixin.png',
        ModelInfoString: '卫星12',
      }

      let beam1 = {
        MessageType: 'Add',
        UserName: 'admin',
        TargetObject: 'Beam11',
        TargetType: 'Beam',
        BeamType: 'follow',
        BeamOwner: 'Sat11',
        BeamStyle: 'Cone',
        BeamAngle: 45.0,
        Transparency: 0.7,
        Color: '(255,0,0)',
      }
      let beam2 = {
        MessageType: 'Add',
        UserName: 'admin',
        TargetObject: 'Beam12',
        TargetType: 'Beam',
        BeamType: 'follow',
        BeamOwner: 'Sat12',
        BeamStyle: 'Cone',
        BeamAngle: 45.0,
        Transparency: 0.7,
        Color: '(255,0,0)',
      }

      let pos1 = {
        MessageType: 'Modify',
        UserName: 'admin',
        TargetObject: 'Sat11',
        TargetType: '3DModel',
        Rx: -8114193.097953206,
        Ry: 28014869.522684038,
        Rz: 3418.4962867393365,
        Q0: 0.09003470616684159,
        Q1: -0.11613209224078529,
        Q2: 0.562332591581207,
        Q3: -0.813750050865001,
      }

      let pos2 = {
        MessageType: 'Modify',
        UserName: 'admin',
        TargetObject: 'Sat12',
        TargetType: '3DModel',
        Rx: 998677.174102344,
        Ry: -6168785.282645439,
        Rz: 10438754.127219586,
        Q0: 0.1782164783424022,
        Q1: -0.5218734162375451,
        Q2: -0.8103400285781025,
        Q3: -0.1980809489976914,
      }
      let beam1Pos = {
        MessageType: 'Modify',
        UserName: 'admin',
        TargetObject: 'Beam11',
        TargetType: 'Beam',
        BeamOwner: 'Sat11',
        BeamAngle: 5.0,
        Q0: 0.06850075048694769,
        Q1: -0.13000214746494262,
        Q2: 0.6950957093700982,
        Q3: -0.7037393293347388,
        BeamLength: 29166300.000000004,
      }
      let beam2Pos = {
        MessageType: 'Modify',
        UserName: 'admin',
        TargetObject: 'Beam12',
        TargetType: 'Beam',
        BeamOwner: 'Sat12',
        BeamAngle: 15.0,
        Q0: 0.1782164783424022,
        Q1: -0.5218734162375451,
        Q2: -0.8103400285781025,
        Q3: -0.1980809489976914,
        BeamLength: 12166299.999999998,
      }

      let Region = {
        MessageType: 'Add',
        UserName: 'admin',
        TargetObject: 'RegionSpecial',
        TargetType: 'Region',
        Color: '(0,128,255)',
        TrackPoints: [
          2014075.449, 5470994.897, 2578283.422, 733492.267, 3111826.929,
          5500477.134, -739558.858, 3387437.955, 5335456.353, -2761450.073,
          4029818.936, 4086932.165, -2915677.58, 5532538.106, 1248985.416,
        ],
      }

      createSat(window.viewer, sat1)
      createSat(window.viewer, sat2)
      changePos(window.viewer, pos1)
      changePos(window.viewer, pos2)

      createBeam(window.viewer, beam1)
      createBeam(window.viewer, beam2)
      addRegion(window.viewer, Region)
      changeBeamDir(window.viewer, beam1Pos)
      changeBeamDir(window.viewer, beam2Pos)

      // var collection = viewer.scene.postProcessStages
      // var snow = Cesium.PostProcessStageLibrary.createSnowStage()
      // console.log(postProcessStages)
      // collection.add(snow)
      // scene.skyAtmosphere.hueShift = -0.8
      // scene.skyAtmosphere.saturationShift = -0.7
      // scene.skyAtmosphere.brightnessShift = -0.33

      // scene.fog.density = 0.001
      // scene.fog.minimumBrightness = 0.8

      // *************************下雨

 const scene = viewer.scene;
      const resetCameraFunction = function () {
        scene.camera.setView({
          destination: Cesium.Cartesian3.fromElements(2014075.449, 5470994.897, 2985563.7039122293),
          orientation: {
            heading: 4.731089976107251,
            pitch: -0.32003481981370063,
          },
        });
      };
      resetCameraFunction();
      let cartographic = Cesium.Cartographic.fromCartesian(scene.camera.position)
      cartographic.height=0
      let tempLoc=Cesium.Cartesian3.fromDegrees(cartographic.longitude,cartographic.latitude,cartographic.height)
      console.log(tempLoc)
      // snow
      const snowParticleSize = 12.0;
      const snowRadius = 1000000.0;
      const minimumSnowImageSize = new Cesium.Cartesian2(
        snowParticleSize,
        snowParticleSize
      );
      const maximumSnowImageSize = new Cesium.Cartesian2(
        snowParticleSize * 2.0,
        snowParticleSize * 2.0
      );
      let snowGravityScratch = new Cesium.Cartesian3();
      const snowUpdate = function (particle, dt) {
        snowGravityScratch = Cesium.Cartesian3.normalize(
          particle.position,
          snowGravityScratch
        );
        Cesium.Cartesian3.multiplyByScalar(
          snowGravityScratch,
          Cesium.Math.randomBetween(-30.0, -300.0),
          snowGravityScratch
        );
        particle.velocity = Cesium.Cartesian3.add(
          particle.velocity,
          snowGravityScratch,
          particle.velocity
        );
        const distance = Cesium.Cartesian3.distance(
          scene.camera.position,
          particle.position
        );
        // if(distance > ){

        // }
        if (distance > snowRadius) {
          particle.endColor.alpha = 0.0;
        } else {
          particle.endColor.alpha = 1.0 / (distance / snowRadius + 0.1);
        }
      };

      // rain
      // const rainParticleSize = 15.0;
      // const rainRadius = 100000.0;
      // const rainImageSize = new Cesium.Cartesian2(
      //   rainParticleSize,
      //   rainParticleSize * 2.0
      // );
      // let rainGravityScratch = new Cesium.Cartesian3();
      // const rainUpdate = function (particle, dt) {
      //   rainGravityScratch = Cesium.Cartesian3.normalize(
      //     particle.position,
      //     rainGravityScratch
      //   );
      //   rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(
      //     rainGravityScratch,
      //     -1050.0,
      //     rainGravityScratch
      //   );

      //   particle.position = Cesium.Cartesian3.add(
      //     particle.position,
      //     rainGravityScratch,
      //     particle.position
      //   );

      //   const distance = Cesium.Cartesian3.distance(
      //     scene.camera.position,
      //     particle.position
      //   );
      //   if (distance > rainRadius) {
      //     particle.endColor.alpha = 0.0;
      //   } else {
      //     particle.endColor.alpha =
      //       Cesium.Color.BLUE.alpha / (distance / rainRadius + 0.1);
      //   }
      // };




          function snow() {
            // scene.primitives.removeAll();
            scene.primitives.add(
              new Cesium.ParticleSystem({
                modelMatrix: new Cesium.Matrix4.fromTranslation(
                  scene.camera.position
                  // tempLoc
                  // Cesium.Cartesian3.fromElements(2014075.449, 5470994.897, 2985563.7039122293-6371000)
                ),
                minimumSpeed: -1.0,
                maximumSpeed: 0.0,
                lifetime: 10.0,
                emitter: new Cesium.SphereEmitter(snowRadius),
                startScale: 0.5,
                endScale: 1.0,
                image: "../src/assets/雨滴.png",
                emissionRate: 7000.0,
                startColor: Cesium.Color.WHITE.withAlpha(0.0),
                endColor: Cesium.Color.WHITE.withAlpha(1.0),
                minimumImageSize: minimumSnowImageSize,
                maximumImageSize: maximumSnowImageSize,
                updateCallback: snowUpdate,
              })
            );

            // scene.skyAtmosphere.hueShift = -0.8;
            // scene.skyAtmosphere.saturationShift = -0.7;
            // scene.skyAtmosphere.brightnessShift = -0.33;
            // scene.fog.density = 0.001;
            // scene.fog.minimumBrightness = 0.8;
          }
          snow()
          console.log(Cesium.SphereEmitter())
          // function rain() {
          //   // scene.primitives.removeAll();
          //   scene.primitives.add(
          //     new Cesium.ParticleSystem({
          //       modelMatrix: new Cesium.Matrix4.fromTranslation(
          //         scene.camera.position
          //       ),
          //       speed: -1.0,
          //       lifetime: 15.0,
          //       emitter: new Cesium.SphereEmitter(rainRadius),
          //       startScale: 1.0,
          //       endScale: 0.0,
          //       image: "../src/assets/雨滴.png",
          //       emissionRate: 9000.0,
          //       startColor: new Cesium.Color(0.27, 0.5, 0.7, 0.0),
          //       endColor: new Cesium.Color(0.27, 0.5, 0.7, 0.98),
          //       imageSize: rainImageSize,
          //       updateCallback: rainUpdate,
          //     })
          //   );

          //   scene.skyAtmosphere.hueShift = -0.97;
          //   scene.skyAtmosphere.saturationShift = 0.25;
          //   scene.skyAtmosphere.brightnessShift = -0.4;
          //   scene.fog.density = 0.00025;
          //   scene.fog.minimumBrightness = 0.01;
          // }


      //**********************选中目标************************

      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handler.setInputAction(function (movement) {
        // 右显示框样式修改
        let info = document.getElementsByClassName('cesium-infoBox')['0']
        console.log(info.firstChild.parentElement)
        info.firstChild.parentElement.setAttribute(
          'style',
          'top: 110px;width:20%'
        )
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    })

    //******************************************************

    // setTimeout(() => {
    //   let imgUrl = '../src/assets/cloud.jpg'
    //   let imgMaterial = new Cesium.ImageMaterialProperty({
    //     image: imgUrl,
    //     color: Cesium.Color.WHITE.withAlpha(0.2),
    //   })

    //   let i = viewer.entities.add({
    //     id: '大气',
    //     position: new Cesium.Cartesian3(0, 0, 0),
    //     ellipsoid: {
    //       radii: new Cesium.Cartesian3(6400000.0, 6400000.0, 6400000.0),
    //       material: imgMaterial,
    //     },
    //   })
    // }, 500)

    setTimeout(() => {
      let info2 = document.getElementsByClassName(
        'cesium-performanceDisplay-ms'
      )['0']
      let info3 = document.getElementsByClassName(
        'cesium-performanceDisplay-fps'
      )['0']
      // console.log(info2)
      info2.firstChild.parentElement.setAttribute('style', 'color: #edffff')
      info3.firstChild.parentElement.setAttribute('style', 'color: #edffff')
    }, 1000)

    //**********************报文************************

    const fmsg = (msg) => {
      console.log(msg)
      let ret = JSON.parse(msg)
      if (ret.MessageType === 'Modify') {
        if (ret.TargetType === '3DModel') {
          changePos(window.viewer, ret)
        } else if (ret.TargetType === 'Track') {
          addTrack(window.viewer, ret)
        } else if (ret.TargetType === 'Beam') {
          if (ret.TargetObject === 'Beam12') {
            ret.BeamLength = ret.BeamLength - 6371000
          }
          changeBeamDir(window.viewer, ret)
        }
      } else if (ret.MessageType === 'Add') {
        if (ret.TargetType === '3DModel') {
          createSat(window.viewer, ret)
        } else if (ret.TargetType === 'Track') {
          addTrack(window.viewer, ret)
        } else if (ret.TargetType === 'Beam') {
          createBeam(window.viewer, ret)
        }
      }
    }

    //********************************************************

    //******************************************************************
    //**************************************************************** */

    return {
      fmsg,
    }
  },
     
})
</script>

<style scoped>
</style>