<template>
  <div
    class="container"
    style="background-image: url(../src/assets/back.png); background-size: 100%;"
  >
    <div
      style="z-index: 1000;"
      id="cesiumContainer"
    >
      <!-- <test-header></test-header> -->
      <!-- <object-menu></object-menu> -->
      <!-- <web-socket @cmsg="fmsg"></web-socket> -->
    </div>
  </div>
</template>

<script>
import * as Cesium from "cesium";
import dat from "dat.gui";
import { defineComponent, onMounted, reactive } from "@vue/runtime-core";
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
import addRegion from "./function/addRegion";
import PolylineTrailLinkMaterialProperty from "./function/addstreamer";

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
      viewer.scene.globe.depthTestAgainstTerrain = true;
      window.viewer = viewer;

      function icrf(scene, time) {
        if (scene.mode !== Cesium.SceneMode.SCENE3D) {
          return;
        }
        let icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
        if (Cesium.defined(icrfToFixed)) {
          let camera = viewer.camera;
          let offset = Cesium.Cartesian3.clone(camera.position);
          let transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
          camera.lookAtTransform(transform, offset);
        }
      }
      viewer.scene.postUpdate.addEventListener(icrf);

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

      let Region = {
        MessageType: "Add",
        UserName: "admin",
        TargetObject: "RegionSpecial",
        TargetType: "Region",
        Color: "(0,128,255)",
        TrackPoints: [
          2014075.449, 5470994.897, 2578283.422, 733492.267, 3111826.929,
          5500477.134, -739558.858, 3387437.955, 5335456.353, -2761450.073,
          4029818.936, 4086932.165, -2915677.58, 5532538.106, 1248985.416,
        ],
      };

      createSat(window.viewer, sat1);
      createSat(window.viewer, sat2);
      changePos(window.viewer, pos1);
      changePos(window.viewer, pos2);

      createBeam(window.viewer, beam1);
      createBeam(window.viewer, beam2);
      addRegion(window.viewer, Region);

      //*************************下雨

      //   const position = [];

      // for (var i = 0; i < Region.TrackPoints.length; i += 3) {
      //     position.push(Cesium.Cartesian3.fromElements(Region.TrackPoints[i], Region.TrackPoints[i + 1], Region.TrackPoints[i + 2]));
      // }

      //   viewer.entities.add({
      //     name: Region.TargetObject,
      //     id: Region.TargetObject,
      //     polygon: {
      //       hierarchy: new Cesium.PolygonHierarchy(position),
      //       height: 50002,
      //     },
      //   });

      //     let Rain =  `
      //                 uniform sampler2D colorTexture;//输入的场景渲染照片
      //                 varying vec2 v_textureCoordinates;
      //                 uniform float vrain;

      //                 float hash(float x){
      //                     return fract(sin(x*133.3)*13.13);
      //                 }

      //                 void main(void){
      //                     float time = czm_frameNumber / vrain;
      //                     vec2 resolution = czm_viewport.zw;

      //                     vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
      //                     vec3 c=vec3(.6,.7,.8);
      //                     float a=0.4;
      //                     float si=sin(a),co=cos(a);
      //                     uv*=mat2(co,-si,si,co);
      //                     uv*=length(uv+vec2(0,4.9))*.3+1.;

      //                     float v=1.-sin(hash(floor(uv.x*100.))*2.);
      //                     float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;

      //                     c*=v*b; //屏幕上雨的颜色
      //                     gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5); //将雨和三维场景融合
      //                 }
      //       `
      //     let Snow = `
      // uniform sampler2D colorTexture; //输入的场景渲染照片
      // varying vec2 v_textureCoordinates;

      // float snow(vec2 uv, float scale) {
      //     float time = czm_frameNumber / 60.0;
      //     float w = smoothstep(1., 0., -uv.y * (scale / 10.));
      //     if (w < .1)
      //         return 0.;
      //     uv += time / scale;
      //     uv.y += time * 2. / scale;
      //     uv.x += sin(uv.y + time * .5) / scale;
      //     uv *= scale;
      //     vec2 s = floor(uv), f = fract(uv), p;
      //     float k = 3., d;
      //     p = .5 + .35 * sin(11. * fract(sin((s + p + scale) * mat2(7, 3, 6, 5)) * 5.)) - f;
      //     d = length(p);
      //     k = min(d, k);
      //     k = smoothstep(0., k, sin(f.x + f.y) * 0.01);
      //     return k * w;
      // }

      // void main(void) {
      //     vec2 resolution = czm_viewport.zw;
      //     vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
      //     vec3 finalColor = vec3(0);
      //     // float c=smoothstep(1.,0.3,clamp(uv.y*.3+.8,0.,.75));
      //     float c = 0.0;
      //     c += snow(uv, 30.) * .0;
      //     c += snow(uv, 20.) * .0;
      //     c += snow(uv, 15.) * .0;
      //     c += snow(uv, 10.);
      //     c += snow(uv, 8.);
      //     c += snow(uv, 6.);
      //     c += snow(uv, 5.);
      //     finalColor = (vec3(c));                                                                      //屏幕上雪的颜色
      //     gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor, 1), 0.5); //将雪和三维场景融合
      // }
      // `
      // viewer.shadowMap.darkness = 0.9; //阴影强度
      // let collection = viewer.scene.postProcessStages;
      // let snow = new Cesium.PostProcessStage({
      //   name: "czm_rain",
      //   fragmentShader:Snow,
      //   uniforms: {
      //     vrain: function () {
      //       return 30; //value:时间
      //     },
      //   },
      // });
      // collection.add(snow);

      //**********************信息展示************************

      let preid = "";
      let flexGUI = null;
      let fixGUI = null;

      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function (movement) {
        var pick = viewer.scene.pick(movement.position);
        console.log(pick);
        if (pick === undefined || pick.id._id === "大气") {
          preid = "";
          if (fixGUI) {
            fixGUI.destroy();
            fixGUI = null;
          }
          if (flexGUI) {
            flexGUI.destroy();
            flexGUI = null;
          }
        } else {
          var id = pick.id._id;
          if (id !== preid) {
            if (fixGUI) {
              fixGUI.destroy();
              fixGUI = null;
            }
            if (flexGUI) {
              flexGUI.destroy();
              flexGUI = null;
            }
            if (id.slice(0, 4) === "Beam") {
              var gui = new dat.GUI();
              var fgui = new dat.GUI();
              fixGUI = fgui;
              flexGUI = gui;
              preid = id;
              gui.domElement.style.position = "absolute";
              gui.domElement.style.left = "0px";
              gui.domElement.style.top = "100px";

              document.querySelector(
                "body > div.dg.ac > div:nth-child(1) > div.close-button.close-bottom"
              ).style.display = "none";

              document.querySelector(
                "body > div.dg.ac > div:nth-child(2) > div.close-button.close-bottom"
              ).style.display = "none";

              fgui.domElement.style.position = "absolute";
              fgui.domElement.style.left = "0px";
              fgui.domElement.style.top = "250px";
              let value =
                viewer.entities.getById(id).cylinder.material._color._value;
              console.log(viewer.entities.getById(id).cylinder);
              var prop = {
                alpha: value.alpha,
                red: value.red * 255,
                blue: value.blue * 255,
                green: value.green * 255,
                length:
                  viewer.entities.getById(id).cylinder._length._value + "",
              };
              let len = prop.length;
              let entity = viewer.entities.getById(id);
              gui
                .add(prop, "alpha", 0, 1)
                .step(0.05)
                .onChange(function (val) {
                  {
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
              fgui.add(prop, "length").onChange(function () {
                {
                  prop.length = len;
                }
              });
              let inputNode = document.getElementsByClassName("c");
              inputNode[4].firstChild.disabled = true;
            } else if (id.slice(0, 3) === "Sat") {
              var gui = new dat.GUI();
              fixGUI = gui;
              preid = id;
              gui.domElement.style.position = "absolute";
              gui.domElement.style.left = "0px";
              gui.domElement.style.top = "100px";

              let value = viewer.entities.getById(id).position._value;
              console.log(value);

              var prop = {
                "经度/°": Number(
                  Cesium.Math.toDegrees(
                    Cesium.Cartographic.fromCartesian(value).latitude
                  ).toFixed(6)
                ),
                "纬度/°": Number(
                  Cesium.Math.toDegrees(
                    Cesium.Cartographic.fromCartesian(value).longitude
                  ).toFixed(6)
                ),
                "高度/km": Number(
                  Cesium.Math.toDegrees(
                    Cesium.Cartographic.fromCartesian(value).height
                  ).toFixed(6) / 1000
                ),
              };
              gui.add(prop, "经度/°");
              gui.add(prop, "纬度/°");
              gui.add(prop, "高度/km");
              let inputNode = document.getElementsByClassName("c");
              for (let i of inputNode) {
                i.firstChild.disabled = true;
              }
              document.querySelector(
                "body > div.dg.ac > div:nth-child(1) > div.close-button.close-bottom"
              ).style.display = "none";
            } else if (id.slice(0, 6) === "Region") {
              var gui = new dat.GUI();
              flexGUI = gui;
              preid = id;
              gui.domElement.style.position = "absolute";
              gui.domElement.style.left = "0px";
              gui.domElement.style.top = "100px";

              document.querySelector(
                "body > div.dg.ac > div:nth-child(1) > div.close-button.close-bottom"
              ).style.display = "none";

              let value =
                viewer.entities.getById(id).polygon.material._color._value;
              var prop = {
                alpha: value.alpha,
                red: value.red * 255,
                blue: value.blue * 255,
                green: value.green * 255,
              };
              let entity = viewer.entities.getById(id);
              let streamer = viewer.entities.getById(id + "streamer");
              gui
                .add(prop, "alpha", 0, 1)
                .step(0.05)
                .onChange(function (val) {
                  {
                    entity.polygon.material = Cesium.Color.fromAlpha(
                      entity.polygon.material._color._value,
                      val
                    );
                  }
                });
              gui
                .add(prop, "red", 0, 255)
                .step(1)
                .onChange(function (val) {
                  {
                    let color =
                      "rgb(" + val + "," + prop.green + "," + prop.blue + ")";
                    entity.polygon.material = Cesium.Color.fromCssColorString(
                      color
                    ).withAlpha(prop.alpha);
                    streamer.wall.material =
                      new PolylineTrailLinkMaterialProperty(
                        Cesium.Color.fromCssColorString(color),
                        1500
                      );
                  }
                });
              gui
                .add(prop, "green", 0, 255)
                .step(1)
                .onChange(function (val) {
                  {
                    let color =
                      "rgb(" + prop.red + "," + val + "," + prop.blue + ")";
                    entity.polygon.material = Cesium.Color.fromCssColorString(
                      color
                    ).withAlpha(prop.alpha);
                    streamer.wall.material =
                      new PolylineTrailLinkMaterialProperty(
                        Cesium.Color.fromCssColorString(color),
                        1500
                      );
                  }
                });
              gui
                .add(prop, "blue", 0, 255)
                .step(1)
                .onChange(function (val) {
                  {
                    let color =
                      "rgb(" + prop.red + "," + prop.green + "," + val + ")";
                    entity.polygon.material = Cesium.Color.fromCssColorString(
                      color
                    ).withAlpha(prop.alpha);
                    streamer.wall.material =
                      new PolylineTrailLinkMaterialProperty(
                        Cesium.Color.fromCssColorString(color),
                        1500
                      );
                  }
                });
            }

            let info = document.getElementsByClassName("cesium-infoBox")["0"];
            console.log(info.firstChild.parentElement);
            info.firstChild.parentElement.setAttribute(
              "style",
              "top: 110px;width:0"
            );
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    });

    //******************************************************

    setTimeout(() => {
      let imgUrl = "../src/assets/cloud.jpg";
      let imgMaterial = new Cesium.ImageMaterialProperty({
        image: imgUrl,
        color: Cesium.Color.WHITE.withAlpha(0.2),
      });

      let i = viewer.entities.add({
        id: "大气",
        position: new Cesium.Cartesian3(0, 0, 0),
        ellipsoid: {
          radii: new Cesium.Cartesian3(6400000.0, 6400000.0, 6400000.0),
          material: imgMaterial,
        },
      });
    }, 500);

    //**********************报文************************

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

    //********************************************************

    //******************************************************************
    //**************************************************************** */

    return {
      fmsg,
    };
  },
});
</script>

<style scoped>
</style>