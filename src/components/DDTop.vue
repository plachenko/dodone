<template>
  <div id="top">
    <h1 id="logo">Lists</h1>
    <div id="clear_btn" class="btn" @click="$emit('clear')">clear</div>
    <div id="show_btn" class="btn" @click="$emit('toggleMenu')">...</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

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
    background-color:#666;
    color:#FFF;
    width: 100%;
    font-size: 1.4em;
    padding: 11px;
    box-sizing: border-box;
    }

#clear_btn{
  padding: 15px 10px 10px 10px;
}

#show_btn{
  user-select: none;
  border-left: 1px solid;
  padding: 20px 20px 10px 20px;
  font-weight: bold;
  }
</style>
