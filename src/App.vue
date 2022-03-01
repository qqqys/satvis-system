<template>
  <div class="container">
    
    <div id="cesiumContainer" >
      <test-header></test-header>
      <web-socket @cmsg="fmsg"></web-socket>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from '@vue/runtime-core';
import * as Cesium from 'cesium'

import {nextTick} from 'vue'
import { ElMessage } from 'element-plus';
import changePos from './function/changePos';
import createSat from './function/createSat';
import WebSocket from './components/WebSocket.vue';
import addTrack from './function/addTrack';
import createBeam from './function/createBeam';
import changeCamera from './function/changeCamera';
import TestHeader from './components/TestHeader.vue';
import changeBeamDir from './function/changeBeamDir'
import addFollow from './function/addFollow';
import addLine from './function/addLine';
export default defineComponent({
  components: {
    WebSocket,
    TestHeader
  },
  setup(){
    onMounted(() =>{
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTdmMTdmNS00NzZhLTQwOGMtODQwYy1kZjAyMzNiOTg0ZTYiLCJpZCI6MzMwMjQsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTc4OTE3ODl9.yqF540oYBpSme38SIPKUP4t14FA6hXCLFHnvOqPf_Fw';
      let viewer = new Cesium.Viewer('cesiumContainer', {
          geocoder:false, //一种地理位置搜索工具，用于显示相机访问的地理位置。默认使用微软的Bing地图。
          homeButton:true, //首页位置，点击之后将视图跳转到默认视角。
          sceneModePicker:true, //切换2D、3D 和 Columbus View (CV) 模式。
          baseLayerPicker:false, //选择三维数字地球的底图（imagery and terrain）。
          navigationHelpButton:true, //帮助提示，如何操作数字地球。
          animation:false,//控制视窗动画的播放速度。
          creditsDisplay:false, //展示商标版权和数据源。
          timeline:false, //展示当前时间和允许用户在进度条上拖动到任何一个指定的时间。
          fullscreenButton:true, //视察全屏按钮,
          //terrainProvider: Cesium.createWorldTerrain()//地形
      });
      viewer.scene.globe.enableLighting = false;//启用以太阳为光源的地球
      viewer._cesiumWidget._creditContainer.style.display="none" //取消版权信息显示
      window.viewer = viewer
      // createSat(window.viewer, {"MessageType":"Modify","UserName":"admin","TargetObject":"Sat11","TargetType":"3DModel","Rx":-8204011.227106312,"Ry":27988689.29170859,"Rz":22881.078117065277,"Q0":0.06960732292279612,"Q1":-0.13115933126259527,"Q2":0.6951183221640737,"Q3":-0.7033936085934204})
      // changePos(window.viewer,{"MessageType":"Modify","UserName":"admin","TargetObject":"Sat11","TargetType":"3DModel","Rx":-8204011.227106312,"Ry":27988689.29170859,"Rz":22881.078117065277,"Q0":0.06960732292279612,"Q1":-0.13115933126259527,"Q2":0.6951183221640737,"Q3":-0.7033936085934204})
      // createBeam(window.viewer,{"MessageType":"Modify","UserName":"admin","TargetObject":"Beam11","TargetType":"Beam","BeamOwner":"Sat11","BeamAngle":5.0,"Q0":0.07079291577751037,"Q1":-0.10252227335897969,"Q2":0.5878841539890991,"Q3":-0.7992932928716132,"BeamLength":36678833.231044546})
      // changeBeamDir(window.viewer, {"MessageType":"Modify","UserName":"admin","TargetObject":"Beam11","TargetType":"Beam","BeamOwner":"Sat11","BeamAngle":5.0,"Q0":0.07079291577751037,"Q1":-0.10252227335897969,"Q2":0.5878841539890991,"Q3":-0.7992932928716132,"BeamLength":36678833.231044546})
      // //console.log(viewer.entities.getById("Sat11").position);
      
    })
    const fmsg = (msg) =>{
      console.log(msg)
      let ret = JSON.parse(msg)
      if(ret.MessageType === 'Modify'){
        if(ret.TargetType === '3DModel'){
          changePos(window.viewer, ret)
        }
        else if(ret.TargetType === 'Track'){
          addTrack(window.viewer, ret)
        }
        else if(ret.TargetType === 'Beam'){
          changeBeamDir(window.viewer, ret)
          // if(ret.TargetObject === 'Beam12'){
          //   addFollow(window.viewer, 'Beam12', 'Sat11', 'Sat12')
          // }
        }
      }
      else if(ret.MessageType === 'Add'){
        if(ret.TargetType === '3DModel'){
          createSat(window.viewer, ret)
        }
        else if(ret.TargetType === 'Track'){
          addTrack(window.viewer, ret)
        }
        else if(ret.TargetType === 'Beam'){
          createBeam(window.viewer, ret)
        }
      }
    }

    return {
      fmsg
    }
  }
})
</script>

<style scoped>
</style>