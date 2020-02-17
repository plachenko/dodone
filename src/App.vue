<template>
  <div id="app">
    <!--
    <h1>DoDone</h1>
    <div>
      <span @click="save">Save</span>
    </div>
    <div>
      <form @submit="add" action="">
        <input v-model="inp" type="text">
        <input type="submit" value="add" />
      </form>
    </div>
    <div>
      <ul>
        <li
          v-for="(i, k) in items"
          :key="k"
          :class="{done: i.done}"
          @click="i.done = !i.done">{{i.txt}} - {{i.time}}</li>
      </ul>
    </div>
    -->
    <div id="left">
      <div class="top">
        <h1 style='text-align: center; border-bottom: 1px solid; width: 100%; padding: 5px 10px;box-sizing: border-box;'>DoDone</h1>
      </div>
    </div>
    <div id="right">
      <div class="top">

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import HelloWorld from './components/HelloWorld.vue';
// import moment from 'moment';

@Component({
  components: {
    // HelloWorld,
  },
})
export default class App extends Vue {
  private items: object[] = [];
  private inp = "";

  /*
  private save(){

  }
  */

  private add(e: any){
    e.preventDefault();

    this.items.push({
      txt: this.inp,
      done: false,
      time: new Date()
    });
    this.inp = "";
  }
}
</script>

<style>
*, html{
  margin: 0px;
  padding: 0px;
}
html{
  height: 100%;
}
body{
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
li{
  cursor: pointer;
  user-select: none;
}
.done{
  text-decoration: line-through;
}
#left{
  flex: 1;
  height: 100%;
  flex-basis: 20%;
}
#right{
  background-color:#F0F;
  flex: 1;
  height: 100%;
  flex-basis: 90%;
}
</style>
