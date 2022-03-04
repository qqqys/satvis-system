<template>
  <div id="app" class="menu">
    <!--主界面 -->
    <div class="loginbody border">
      <!-- 显示框 -->
      <div class="border_corner border_corner_left_top"></div>
      <div class="border_corner border_corner_right_top"></div>
      <div class="border_corner border_corner_left_bottom"></div>
      <div class="border_corner border_corner_right_bottom"></div>
      <div class="part border" style="text-align: center;">选择需要展示的卫星</div>
      <div class="satellite">
        <template v-for="entity in Entities" :key="entity.id">
          <div class="part border" style="text-indent: 1em;" @click="entity.show = !entity.show">
            <i class="right" v-if="!entity.show"></i>
            <i class="down" v-if="entity.show"></i>
            <label>&nbsp;&nbsp;{{entity.id }}</label>
          </div>
          <template v-if="entity.show">
            <div
              v-for="Beam in entity.Beam"
              :key="Beam"
              class="part border"
              style="text-indent: 2em;"
            >
              <label style="color: red;">{{ Beam }}</label>
            </div>
          </template>
        </template>
        <!-- 卫星显示 -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["Entities"],
};
</script>

<style>
.menu {
  width: 208px;
  height: 502px;
  transform: translate(50px, 100px);
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  z-index: 20;
}

.loginbody {
  transform: translate(0, 4px);
  height: 490px;
  margin: auto;
}

.border {
  width: 200px;
  border: 2px solid rgb(67, 248, 241);
  position: relative;
}
/*四个角框*/

.border_corner {
  z-index: 2500;
  position: absolute;
  width: 18px;
  height: 18px;
  border: 3px solid rgb(67, 248, 241);
}

.border_corner_left_top {
  top: -4px;
  left: -3px;
  border-right: none;
  border-bottom: none;
}

.border_corner_right_top {
  top: -4px;
  right: -4px;
  border-left: none;
  border-bottom: none;
}

.border_corner_left_bottom {
  bottom: -4px;
  left: -3px;
  border-right: none;
  border-top: none;
}

.border_corner_right_bottom {
  bottom: -4px;
  right: -4px;
  border-left: none;
  border-top: none;
}

.part {
  line-height: 40px;
  top: -2px;
  left: -2px;
  height: 40px;
  font-style: italic;
  font-weight: bolder;
  color: rgb(67, 248, 241);
}

.satellite {
  height: 446px;
  position: absolute;
  right: -21px;
  overflow-x: hidden;
  overflow-y: scroll;
}

i {
  border: solid rgb(67, 248, 241);
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}
.right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
</style>