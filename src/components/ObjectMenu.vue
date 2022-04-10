<template>
  <div class="menu">
    <div class="sort">
    </div>
    <div class="detail">
      <div class="detailelement">
        <input
          type="checkbox"
          v-model="menu.enableLighting"
        >启用以太阳为光源的地球
        <p>{{menu.enableLighting}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive,ref,watch } from 'vue-demi';
export default {
  setup() {
    let menu = reactive({
      enableLighting:false,
    });
    setTimeout(() => {
      menu.enableLighting = ref(window.viewer.scene._globe.enableLighting)
    }, 2000);

    watch(menu.enableLighting, (newValue, oldValue) => {
      window.viewer.scene._globe.enableLighting = newValue
    })
    
    return {
      menu,
    };
  },
};
</script>

<style>
.menu {
  right: 25%;
  width: 50%;
  top: 10%;
  height: 80%;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  z-index: 9999;
  background-color: white;
}

.sort {
  top:0;
  left:0;
  width: 25%;
  position: absolute;
}
.detail {
  top:0;
  left:25%;
  width:75%;
  position: absolute;
}

.sortelement {
  height: 10%;
}

.detailelement {
  height: 10%;
}
</style>