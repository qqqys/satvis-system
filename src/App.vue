<template>
  <div class="container">
    <div
      style="background-image: url(../src/assets/back.png); background-size: 100%;"
      id="cesiumContainer"
    >
      <test-header></test-header>
      <!-- <object-menu></object-menu> -->
      <web-socket @cmsg="fmsg"></web-socket>
    </div>
  </div>
</template>

<script>
import * as Cesium from "cesium";
import dat from "dat.gui";
import { defineComponent, onMounted } from "@vue/runtime-core";
import _ from "lodash";
import changePos from "./function/changePos";
import createSat from "./function/createSat";
import WebSocket from "./components/WebSocket.vue";
import addTrack from "./function/addTrack";
import createBeam from "./function/createBeam";
import changeCamera from "./function/changeCamera";
import TestHeader from "./components/TestHeader.vue";
import changeBeamDir from "./function/changeBeamDir";
import addFollow from "./function/addFollow";
import addLine from "./function/addLine";

export default defineComponent({
  components: {
    WebSocket,
    TestHeader,
  },
  setup() {
    onMounted(() => {
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTdmMTdmNS00NzZhLTQwOGMtODQwYy1kZjAyMzNiOTg0ZTYiLCJpZCI6MzMwMjQsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTc4OTE3ODl9.yqF540oYBpSme38SIPKUP4t14FA6hXCLFHnvOqPf_Fw";
      let viewer = new Cesium.Viewer("cesiumContainer", {
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
      });
      viewer.scene.globe.enableLighting = false; //启用以太阳为光源的地球
      viewer._cesiumWidget._creditContainer.style.display = "none"; //取消版权信息显示
      viewer.scene.debugShowFramesPerSecond = true;
      viewer.scene.skyBox.show = false;
      viewer.scene.backgroundColor = new Cesium.Color(0, 0, 0, 0);

      window.viewer = viewer;

      let sat1 = {
        MessageType: "Add",
        UserName: "admin",
        TargetObject: "Sat11",
        TargetType: "3DModel",
        Model3DFile: "model/weixin.gltf",
        ModelIconFile: "model/weixin.png",
        ModelInfoString: "卫星11",
      };
      let sat2 = {
        MessageType: "Add",
        UserName: "admin",
        TargetObject: "Sat12",
        TargetType: "3DModel",
        Model3DFile: "model/weixin.gltf",
        ModelIconFile: "model/weixin.png",
        ModelInfoString: "卫星12",
      };

      let beam1 = {
        MessageType: "Add",
        UserName: "admin",
        TargetObject: "Beam11",
        TargetType: "Beam",
        BeamType: "follow",
        BeamOwner: "Sat11",
        BeamStyle: "Cone",
        BeamAngle: 45.0,
        Transparency: 0.7,
        Color: "(255,0,0)",
      };
      let beam2 = {
        MessageType: "Add",
        UserName: "admin",
        TargetObject: "Beam12",
        TargetType: "Beam",
        BeamType: "follow",
        BeamOwner: "Sat12",
        BeamStyle: "Cone",
        BeamAngle: 45.0,
        Transparency: 0.7,
        Color: "(255,0,0)",
      };

      let pos1 = {
        MessageType: "Modify",
        UserName: "admin",
        TargetObject: "Sat11",
        TargetType: "3DModel",
        Rx: -2572561.123207285,
        Ry: 6486629.874361761,
        Rz: 0.0,
        Q0: 0.25269339688973574,
        Q1: 0.6900551829752857,
        Q2: -0.32263943016806307,
        Q3: 0.5965514979598148,
      };
      let pos2 = {
        MessageType: "Modify",
        UserName: "admin",
        TargetObject: "Sat12",
        TargetType: "3DModel",
        Rx: -524624.8844767694,
        Ry: 3545383.3181513655,
        Rz: 5987442.168201857,
        Q0: 0.19937521545539486,
        Q1: 0.8070889266217429,
        Q2: -0.5268981449388109,
        Q3: 0.17673520545357566,
      };

      createSat(window.viewer, sat1);
      createSat(window.viewer, sat2);
      changePos(window.viewer, pos1);
      changePos(window.viewer, pos2);

      createBeam(window.viewer, beam1);
      createBeam(window.viewer, beam2);

      let preid = "";
      let GUI = null;

      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function (movement) {
        var pick = viewer.scene.pick(movement.position);
        console.log(pick);
        if (pick === undefined) {
          preid = "";
            if (GUI) {
              GUI.destroy();
              GUI = null;
            }
        } else {
          var id = pick.id._id;
          if (id !== preid) {
            if (GUI) GUI.destroy();
            var gui = new dat.GUI();
            if (id.slice(0, 4) === "Beam") {
              GUI = gui;
              preid = id;
              gui.domElement.style.position = "absolute";
              gui.domElement.style.left = "0px";
              gui.domElement.style.top = "100px";

              let value =
                viewer.entities.getById(id).cylinder.material._color._value;
              var prop = {
                alpha: value.alpha,
                red: value.red * 255,
                blue: value.blue * 255,
                green: value.green * 255,
              };
              gui
                .add(prop, "alpha", 0, 1)
                .step(0.05)
                .onChange(function (val) {
                  {
                    let entity = viewer.entities.getById(id);
                    entity.cylinder.material = Cesium.Color.fromAlpha(
                      entity.cylinder.material._color._value,
                      val
                    );
                  }
                });
              gui
                .add(prop, "red", 0, 255)
                .step(1)
                .onChange(function (val) {
                  {
                    let entity = viewer.entities.getById(id);
                    entity.cylinder.material = Cesium.Color.fromCssColorString(
                      "rgb(" + val + "," + prop.green + "," + prop.blue + ")"
                    ).withAlpha(prop.alpha);
                  }
                });
              gui
                .add(prop, "green", 0, 255)
                .step(1)
                .onChange(function (val) {
                  {
                    let entity = viewer.entities.getById(id);
                    entity.cylinder.material = Cesium.Color.fromCssColorString(
                      "rgb(" + prop.red + "," + val + "," + prop.blue + ")"
                    ).withAlpha(prop.alpha);
                  }
                });
              gui
                .add(prop, "blue", 0, 255)
                .step(1)
                .onChange(function (val) {
                  {
                    let entity = viewer.entities.getById(id);
                    entity.cylinder.material = Cesium.Color.fromCssColorString(
                      "rgb(" + prop.red + "," + prop.green + "," + val + ")"
                    ).withAlpha(prop.alpha);
                  }
                });
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    });

    const fmsg = (msg) => {
      console.log(msg);
      let ret = JSON.parse(msg);
      if (ret.MessageType === "Modify") {
        if (ret.TargetType === "3DModel") {
          changePos(window.viewer, ret);
        } else if (ret.TargetType === "Track") {
          addTrack(window.viewer, ret);
        } else if (ret.TargetType === "Beam") {
          if (ret.TargetObject === "Beam12") {
            ret.BeamLength = ret.BeamLength - 6371000;
          }
          changeBeamDir(window.viewer, ret);
        }
      } else if (ret.MessageType === "Add") {
        if (ret.TargetType === "3DModel") {
          createSat(window.viewer, ret);
        } else if (ret.TargetType === "Track") {
          addTrack(window.viewer, ret);
        } else if (ret.TargetType === "Beam") {
          createBeam(window.viewer, ret);
        }
      }
    };

    return {
      fmsg,
    };
  },
});
</script>

<style scoped>
</style>