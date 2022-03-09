<template>
 <el-menu
    :default-active="active"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-sub-menu index="1">
      <template #title>卫星控制</template>
      <el-menu-item index="1-1" @click="sat_30">30颗卫星动态轨道及姿态</el-menu-item>
      <el-menu-item index="1-2">调整卫星模型大小</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>相机控制</template>
      <el-menu-item index="2-1">相机控制-1</el-menu-item>
      <el-menu-item index="2-2">相机控制-2</el-menu-item>
      <el-menu-item index="2-3">相机控制-3（Model不存在）</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>czml</template>
      <el-menu-item index="3-1" @click="loadCzml">加载czml</el-menu-item>
      <el-menu-item index="3-2" @click="removeCzml">移除czml</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script>
import * as Cesium from "cesium";
import { ref } from "vue";
export default {
  setup() {
    const activeKey = ref('1')
    const loadCzml = () =>{
      let czmlDataSourcePromise = Cesium.CzmlDataSource.load('/czml/Scenario1.czml');
      czmlDataSourcePromise.then(function (czml) {
          window.viewer.dataSources.add(czml);
      })
    }
    const removeCzml = () =>{
      window.viewer.dataSources.removeAll()
    }
    return{
      activeKey,
      loadCzml,
      removeCzml
    }
  }
}
</script>