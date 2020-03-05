<template>
  <div id="top">
    <h1 id="logo">DenDo</h1>

    <div :class="{cur: menu == i.id}" v-for="(i, k) in menuItems" :key="k" id="clear_btn" class="btn" @click="$emit('menuChange', i.id)">{{i.name}}</div>
    <div id="clear_btn" class="btn" @click="$emit('clear')">clear</div>
    <div id="show_btn" class="btn" @click="$emit('toggleMenu')">...</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class DDTop extends Vue {
  @Prop({default: 1})
  menu !: number;

  private menuItems = [
    {id: 1, name: 'list'},
    {id: 2, name: 'GH'}
  ]
}
</script>

<style scoped>
#top{
  display: flex;
  border-bottom: 1px solid;
  }
  #top .btn {
    border-right: 1px solid;
  }
  #top .btn :last-child{
    border: none !important;
  }
  #top .cur{
    background-color:#CCC;
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
