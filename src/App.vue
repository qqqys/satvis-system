<template>
  <div class="container">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from '@vue/runtime-core';
import * as Cesium from 'cesium'
export default defineComponent({
  setup(){
    onMounted(() =>{
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTdmMTdmNS00NzZhLTQwOGMtODQwYy1kZjAyMzNiOTg0ZTYiLCJpZCI6MzMwMjQsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTc4OTE3ODl9.yqF540oYBpSme38SIPKUP4t14FA6hXCLFHnvOqPf_Fw';
    const viewer = new Cesium.Viewer('cesiumContainer', {
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
    viewer.scene.globe.enableLighting = true;//启用以太阳为光源的地球
    })
  }
})
</script>

<style scoped>
.container{
  width: 100%;
  height: 100%;
}
</style>
