<template>
 <el-menu
    :default-active="active"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="1">Menu1</el-menu-item>
    <el-sub-menu index="2">
      <template #title>相机控制</template>
      <el-menu-item index="2-1">相机控制-1</el-menu-item>
      <el-menu-item index="2-2">相机控制-2</el-menu-item>
      <el-menu-item index="2-3">相机控制-3（Model不存在）</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="3">Orders</el-menu-item>
  </el-menu>
</template>

<script>
  import { ref } from "vue";
  export default {
    setup() {
      const activeKey = ref('1')
      return{
        activeKey
      }
    }
  }
</script>