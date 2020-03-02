<template>
  <div id="projCont" v-if="project">
    <!-- Projects -->

    <div id="projTitle">
      <div style="width: 100%; float:left;">
        <div v-if="titleRename">
          <form style="float:left;" @submit.prevent="changeTitle">
            <input id="titleInp" style="font-size: 1.5em; padding: 10px;" ref="titleInp" v-model="titleName" type="text">
            <div class="opt btn" @click="changeTitle">&#10004;</div>
          </form>
        </div>
        <h2 v-else @click="renameTitle">{{project.title || "Untitled"}} </h2>
      </div>
      <span style="display: inline-block; border-top: 2px solid; padding-top: 6px; margin-top:5px;">Total time: {{formatTimeSpent(timeTotal)}}</span>
      <div @click="showDone = !showDone" id="hideDone" class="btn">hide done</div>
      <div @click="$emit('removeProject')" id="removeList" class="btn">remove</div>
    </div>

    <div id="projBtnCont">
      <div v-if="project.title && !adding" @click="addListItem" id="add_list_itm" class="btn">+ Add List Item</div>
      <div class="projItem" id="projInp" v-if="adding">
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
          <div class="date_sep_border">
            <span><strong>{{formatDate(d[0].date)}}</strong> ({{d.length}} items)</span>
          </div>
        </div>
        <div :class="{started: i.started}" style="display: flex; flex-wrap: wrap;" v-for="(i, k) in d" :key="k">
          <div class="btn rmbtn" @click="$emit('removeItem',i.idx)">X</div>
          <div @click="setDone(i)" class="projItem btn" :class="{done: i.done}">
            <div class="circle">
              <div></div>
            </div>
            <span>{{i.txt}}</span>
          </div>
          <div class="btn projInner" @click="resetTime(i.idx)" v-if="i.timeSpent && !i.started">
            <span>Reset</span>
          </div>
          <div class="btn projStart" @click="start(i.idx)">
            <span>{{formatTimeSpent(i.timeSpent)}}</span>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import DDProject from '../util/DDProject';
import moment from 'moment';
import _ from 'lodash';

@Component({})
export default class DDListShow extends Vue{
  $refs!: {
    inpi: HTMLInputElement;
    titleInp: HTMLInputElement;
  }

  @Prop()
  project!: DDProject;

  @Prop()
  current!: number;

  @Watch('current')
  onCurrentChange(v: number){
    this.titleRename = false;
  }

  private item = "";
  private adding = false;
  private showDone = false;
  private titleRename = false;
  private titleName = "";

  private addListItem(){
    this.adding = true;
    this.$nextTick(() => {
      this.$refs.inpi.focus();
    });
  }

  mounted(){
    this.titleRename = false;
  }

  get items(){
    if(this.showDone){
      return this.project.items.filter(i => i.done != true);
    }else{
      return this.project.items;
    }
  }

  get dateGroups(){
    const arr = this.items.slice().reverse();
    arr.forEach((i, idx) => i.idx = idx);
    return _.groupBy(arr, (i: any) => moment(i.date).startOf('day').format())
  }

  get timeTotal(){
    let total = 0;
    this.project.items.forEach((i) => {
      total += i.timeSpent;
    })

    return total;
  }

  private renameTitle(){
    this.titleName = this.project.title;
    this.titleRename = true;
    this.$nextTick(()=>{
      this.$refs.titleInp.focus();
    });
  }

  private resetTime(k: number){
    const r = (this.items.length - 1) - k;
    this.items[r].timeSpent = 0;
  }

  private start(k: number){
    const r = (this.items.length - 1) - k;

    const startedEl = this.items.find(i => i.started);
    if(startedEl){
      startedEl.started = false;
    }

    if(startedEl != this.items[r] && this.items[r].done == false){
      this.items[r].started = true;
    }

  }

  private changeTitle(){
    this.titleRename = false;
    if(this.titleName){
      this.project.title = this.titleName;
    }
  }

  private formatTimeSpent(s: number){
    return moment().hour(0).minute(0).second(s).format('HH:mm:ss');
  }

  private formatDate(d: Date){
    return moment(d).format('MM/DD/YYYY');
  }

  private setDone(i: any){
    i.done = !i.done;
    if(i.done == true){
      i.started = false;
    }
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
h2{
  padding: 5px;
  float:left;
  user-select: none;
  min-width: 160px;
}
h2:hover{
  background-color:#FFF;
}
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
    position: sticky;
    top: 0px;
    background-color:#CCC;
    text-align: center;
    height: 20px;
    }
    .date_sep_border{
      height: 9px;
      width: 100%;
      border-bottom: 1px solid;
      margin: 10px 0px 20px 0px;
    }
  .date_sep span{
    display: inline-block;
    background-color:#CCC;
    padding: 0px 5px;
    color:#666;
    }

.started{
  background-color: #F00 !important;
  border-radius: 10px;
}
#hideDone{
  background-color:#666;
  color:#FFF;
  padding: 10px;
  position: absolute;
  top: -5px;
  right: 120px;
  border-radius: 10px;
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

#projInp{
  border-radius: 10px !important;
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
  border-bottom:  1px dashed;
}
  .projStart{
      margin: 2px;
      border-radius: 0px 10px 10px 0px;
      background-color:#FFF;
      display: flex;
      padding: 20px;
      min-height: 20px;
      flex: 1;
      flex-basis: 1%;
  }
  .projStart:hover{
    background-color:#EEE !important;

  }
    .projInner{
      flex: 1;
      margin: 2px 0px 2px 2px;
      background-color:#FFF;
      display: flex;
      padding: 20px;
      min-height: 20px;
      flex: 1;
    }

    .projItem{
      margin: 2px 0px;
      background-color:#FFF;
      display: flex;
      padding: 20px;
      min-height: 20px;
      flex: 1;
      flex-basis: 40%;
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
