<template>
  <div id="projCont" v-if="project">
    <!-- Projects -->

    <div id="projTitle">
      <h2>{{project.title || "Untitled"}}</h2>
      <div @click="$emit('removeProject')" class="btn" style="position: absolute; right: 30px; top: -5px; background-color:#F00; padding: 10px; color:#FFF; border-radius: 10px;">remove</div>
    </div>

    <div id="projItemsContainer" v-if="project.items">

      <div @click="i.done = !i.done" :class="{done: i.done}" class="projItem btn" v-for="(i, k) in project.items" :key="k">
        <div style="margin-right: 10px;" @click="$emit('removeItem',k)">X</div>
        <div class="circle">
          <div></div>
        </div>
        <span>{{i.txt}}</span>
      </div>

      <div class="projItem" v-if="adding">
        <form name="items" @submit.prevent="createItem()">
          <input ref="inpi" class="inp" v-model="item" />
        </form>
        <div id="optContainer" style="margin-left: 5px;">
          <div class="opt btn" @click="createItem()">&#10004;</div>
        </div>
      </div>

    </div>

    <div id="projBtnCont">
      <div v-if="project.title && !adding" @click="addListItem" id="add_list_itm" class="btn">+ Add List Item</div>
    </div>
  </div>
</template>
<style>
#projItemsContainer{
  flex: 1;
  display: flex;
  flex-flow: column;
  overflow: auto;
  padding: 20px;
  }
  #projBtnCont{
    padding: 20px;
  }

#projCont{
  flex: 1;
  display: flex;
  flex-flow: column;
  height:100%;
}

#projTitle{
  position: relative;
  color:#666;
  box-sizing: border-box;
  font-size: 1.2em;
  padding: 20px;
  border-bottom:  2px dashed;
}
    .projItem{
      margin: 2px 0px;
      border-radius: 10px;
      background-color:#FFF;
      display: flex;
      padding: 20px;
      min-height: 20px;
    }
    .projItem form{
      width: 100%;
    }
    .projItem .inp{
      box-sizing: border-box;
      width: 100%;
      flex: 1;
      padding: 4px;
    }
    .projItem:hover{
      background-color:#EEE !important;
    }
    .circle{
      align-self: center;
      border: 2px solid;
      padding: 3px;
      box-sizing: border-box;
      float: left;
      margin-right: 10px;
      border-radius: 10px;
    }
    .done .circle div{
      background-color:#020;
      }
    .circle div{
      width: 10px;
      height: 10px;
      border-radius: 5px;
      }
#add_list_itm{
  background-color:#BBB;
  border: #AAA 2px dashed;
  padding: 15px;
  font-weight: bold;
  text-align:center;
  border-radius: 10px;
  margin-top: 20px;
}
#add_list_itm:hover{
  background-color:#EEE;
}

</style>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import DDProject from '../util/DDProject';

@Component({})
export default class DDListShow extends Vue{
  $refs!: {
    inpi: HTMLInputElement;
  }

  @Prop()
  project!: DDProject;

  private item = "";
  private adding = false;

  private addListItem(){
    this.adding = true;
    this.$nextTick(() => {
      this.$refs.inpi.focus();
    });
  }

  private createItem(){
    if(this.item){
      this.$emit('createItem', this.item);
    }

    this.reset()
  }

  public reset(){
    this.adding = false;
    this.item = "";
  }
}
</script>
