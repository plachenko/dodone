<template>
  <div id="top">
    <h1 id="logo">DenDo</h1>
    <div class="btn show_btn" @click="$emit('toggleMenu')"> ... </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DDTop extends Vue {
}
</script>

<style scoped>
#top{
  display: flex;
  border-bottom: 1px solid;
  }
  #logo{
    width: 100%;
    font-size: 1.4em;
    padding: 11px;
    box-sizing: border-box;
    }

.show_btn{
  user-select: none;
  border-left: 1px solid;
  padding: 20px 20px 10px 20px;
  font-weight: bold;
  }
</style>
