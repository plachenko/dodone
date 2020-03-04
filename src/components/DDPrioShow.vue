<template>
  <div id="projCont">
    <!-- Projects -->
    <div id="projTitle">
      <h2>Priorities</h2>
    </div>

    <div id="projItemsContainer" style="margin-top: 25px;">
      <div v-for="(i, key) in items" :key="key" >
        <div :class="{started: i.started}" style="display: flex; flex-wrap: wrap;">
          <div @click="setDone(i)" class="projItem btn" style="border-radius:10px;" :class="{done: i.done}">
            <div class="circle">
              <div></div>
            </div>
            <span>{{i.txt}}</span>
          </div>
          <!--
          <div class="btn projInner" @click="resetTime(i.idx)" v-if="!i.done && i.timeSpent && !i.started">
            <span>Reset</span>
          </div>
          <div :class="{doneT: i.done}" class="btn projStart" @click="start(i.idx)">
            <span>{{formatTimeSpent(i.timeSpent)}}</span>
          </div>
          -->
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
export default class DDPriohow extends Vue{
  $refs!: {
    inpi: HTMLInputElement;
    titleInp: HTMLInputElement;
  }

  @Prop()
  items!: DDProject[];

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

  /*
  get dateGroups(){
    const arr = this.items.slice().reverse();
    arr.forEach((i, idx) => i.idx = idx);
    return _.groupBy(arr, (i: any) => moment(i.date).startOf('day').format())
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
  */

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

#titleInp{
  float:left;
  font-size: 1.5em;
  padding: 10px;
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
#textInpSubmit{
  float: left;
  margin-left: 5px;
  padding: 14px;
  box-sizing: border-box;
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
    .doneT{
      color:#666;
      background-color:#DDD;
      cursor: default !important;
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
