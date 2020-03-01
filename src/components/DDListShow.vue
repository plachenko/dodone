<template>
  <div id="projCont" v-if="project">
    <!-- Projects -->

    <div id="projTitle">
      <h2>{{project.title || "Untitled"}}</h2>
      <div @click="$emit('removeProject')" id="removeList" class="btn">remove</div>
    </div>

    <div id="projBtnCont">
      <div v-if="project.title && !adding" @click="addListItem" id="add_list_itm" class="btn">+ Add List Item</div>
      <div class="projItem" v-if="adding">
        <form name="items" @submit.prevent="createItem()">
          <input ref="inpi" class="inp" v-model="item" />
        </form>
        <div id="optContainer">
          <div class="opt btn" @click="createItem()">&#10004;</div>
        </div>
      </div>
    </div>

    <div id="projItemsContainer" v-if="project.items">
      <div v-for="(d, key) in dateGroups" :key="key">
        <div class="date_sep">
          <span>{{formatDate(d[0].date)}}</span>
        </div>
        <div style="display: flex; flex-wrap: wrap;" v-for="(i, k) in d" :key="k">
          <div class="btn rmbtn" @click="$emit('removeItem',k)">X</div>
          <div @click="i.done = !i.done" class="projItem btn" :class="{done: i.done}">
            <div class="circle">
              <div></div>
            </div>
            <span>{{i.txt}}</span>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import DDProject from '../util/DDProject';
import moment from 'moment';
import _ from 'lodash';

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

  get dateGroups(){
    return _.groupBy(this.project.items.slice().reverse(), (i: any) => moment(i.date).startOf('day').format())
  }

  private formatDate(d: Date){
    return moment(d).format('MM/DD/YYYY');
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
<style>
#projItemsContainer{
  flex: 1;
  display: flex;
  flex-flow: column;
  overflow: auto;
  padding: 0px 20px;
  }
  #projBtnCont{
    padding: 20px 20px 10px 20px;
  }
  .date_sep{
    flex-basis: 100%;
    text-align: center;
    border-bottom: 1px solid;
    margin: 10px 0px 20px 0px;
    height: 9px;
    }
  .date_sep span{
    display: inline-block;
    background-color:#CCC;
    padding: 0px 5px;
    color:#666;
    }

#removeList{
  position: absolute;
  right: 30px;
  top: -5px;
  background-color:#F00;
  padding: 10px;
  color:#FFF;
  border-radius: 10px;
}
#projCont{
  flex: 1;
  display: flex;
  flex-flow: column;
  height:100%;
}

#optContainer{
  margin-left: 5px;
}

.rmbtn{
  margin: 2px;
  background-color: #FFF;
  display: flex;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px 0px 0px 10px
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
      border-radius: 0px 10px 10px 0px;
      background-color:#FFF;
      display: flex;
      padding: 20px;
      min-height: 20px;
      flex: 1;
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
  margin-bottom: 20px;
}
#add_list_itm:hover{
  background-color:#EEE;
}

</style>
