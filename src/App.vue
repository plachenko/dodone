<template>
  <div id="app">
    <div id="left" :class="{noFlex: !show}">
      <DDTop
        @toggleMenu="show = !show"
        @save="save"
        @clear="clear" />

      <DDSearch
        :class="{hide: !show}"
        :disabled="!projectsWithTitle"
        @searchEvt="search" />

      <div id="projListContainer" :class="{hide: !show}">
        <DDProjItem
          @setTitle="setTitle($event)"
          @remove="removeProject()"
          @select="select(k)"
          v-for="(project, k) in searchResult"
          :current = "current == k"
          :class="{current: current == k}"
          :project="project"
          :key="k" />
      </div>

      <!--
      <DDProjList
        @addProject="addProject()"
        @removeProject="removeProject($event)"
        @setTitle="setTitle($event)"
        @selected="select($event - 1)"
        :projects="searchResult"
        :class="{hide: !show}"
        :current="current" />
      <div v-for="(p, i) in projects" :key="i">
        {{p.title}}
      </div>
      -->

      <div
        v-if="!adding"
        @click="addProject()"
        :class="{hide: !show}"
        class="btn add_btn">
        <span>+ New list</span>
      </div>

    </div>

    <div id="right" :class="{hide: show}">

      <!-- Projects -->
      <div v-if="projects[current]" id="projCont">
        <div id="projTitle">
          <h2>{{projects[current].title || "Untitled"}}</h2>
          <div @click="removeProject" class="btn" style="position: absolute; right: 30px; top: 20px; background-color:#F00; padding: 10px; color:#FFF; border-radius: 10px;">remove</div>
        </div>

        <div id="projItemsContainer" v-if="projects[current].items">
          <div @click="i.done = !i.done" :class="{done: i.done}" class="projItem btn" v-for="(i, k) in projects[current].items" :key="k">
            <div style="margin-right: 10px;" @click="removeItem(k)">X</div>
            <div class="circle">
              <div></div>
            </div>
            <span>{{i.txt}}</span>
          </div>
          <div v-if="itemArr.length">
              <div v-for="(i,k) in itemArr" :key="k" class="projItem">
                <form name="items" @submit.prevent="createItem(k)">
                  <input class="inp" v-model="itemArr[k].txt" />
                </form>
                <div id="optContainer" style="margin-left: 5px;">
                  <div class="opt btn" @click="createItem(k)">&#10004;</div>
                </div>
              </div>
            </div>
        </div>

        <div v-if="projects[current].title" @click="addListItem" id="add_list_itm" class="btn">+ Add List Item</div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import DDProject from './util/DDProject';
import DDTop from './components/DDTop.vue';
import DDProjList from './components/DDProjList.vue';
import DDSearch from './components/DDSearch.vue';
import DDProjItem from './components/DDProjItem.vue';
import DDItem from './components/DDProjItem.vue';

import { EventBus }  from './eventbus';

@Component({
  components:{
    DDTop,
    DDSearch,
    DDProjList,
    DDProjItem,
    DDItem
  }
})
export default class App extends Vue {
  private show = false;
  private projects: DDProject[] = [];
  private current = 0;
  private projSearch = "";
  private adding = false;
  private itemArr: any = [];
  private itemInp = [];
  private lastCur = 0;

  private search(e: string){
    this.projSearch = e;
  }

  @Watch('projects', {deep: true})
  private projChange(){
    this.save();
  }

  mounted(){
    if(localStorage.getItem('projects')){
      this.load();
    }

    if(!this.projects.length){
      this.show = true;
    }
  }

  get projectsWithTitle(){
    return this.projects.some(i => i.title.length)
  }

  get searchResult(){
    return this.projects.filter((item: DDProject) => {
      return this.projSearch.toLowerCase().split(' ').every((i: string) => item.title.toLowerCase().includes(i));
    })
  }

  /*
  get currentItm(){
    return this.projects.findIndex((i: any) => {
      // i.id == this.projects[this.current].id);
      console.log(i);
      return 0;
    }
  }
  */


  public addListItem(){
    this.itemArr.push({txt: ''});
    // this.projects[this.current].createItem('testing');
    // this.save();
  }

  public removeProject(){
    let id = 0;

    if(this.projects.length > 1){
      id = this.projects.findIndex((i) => i.id == this.projects[this.current].id);
    }

    this.projects.splice(id, 1);
    this.current = this.lastCur;
    this.adding = false;
  }

  public addProject(){
    this.adding = true;

    this.itemArr = [];

    this.projSearch = "";
    const proj = new DDProject();
    this.projects.push(proj);
    this.lastCur = this.current;
    this.current = this.projects.length - 1;

    // const f = this.projects.findIndex(p => p.id);
    // this.select(this.projects.length-1);
  }

  public setTitle(e: string){
    this.adding = false;
    if(this.show){
      this.show = false;
    }

    this.projects[this.projects.length-1].title = e;

    //TODO: impelemnt Autosave
    // this.save();
  }

  public load(){
    this.current = JSON.parse(localStorage.getItem('current') || "");
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '{}');
    for(const proj of savedProjects){
      this.projects.push(new DDProject(proj.title, proj.items));
    }
  }

  public save(){
    if(this.projectsWithTitle){
      localStorage.setItem('current', this.current+"");
      localStorage.setItem('projects', JSON.stringify(this.projects));
    }
  }

  public clear(){
    const clearConfirm = confirm('Are you sure you want to clear?');
    if(clearConfirm){
      DDProject.reset();
      EventBus.$emit('clear');
      this.adding = false;
      this.projects = [];
      localStorage.clear();
    }
  }

  public select(e: number){
    this.itemArr = [];
    this.current = e;
    localStorage.setItem('current', this.current+"");
  }

  public createItem(k: number){
    if(this.itemArr[k].txt){
      this.projects[this.current].createItem(this.itemArr[k].txt);
    }
    this.itemArr.splice(k, 1);
  }

  public removeItem(k: number){
    this.projects[this.current].items.splice(k, 1);
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

@media (max-width: 600px) {
  #app{
    flex-flow: column;
    }
    #left{
      height: 100%;
      display: flex;
      flex-flow: column;
      }
      .noFlex{
        /* height: 0px; */
        display: block !important;
        flex:0 !important;
      }
      .hide{
        display: none !important;
        }
        .hide #projListContainer{
          direction: ltr !important;
        }
}

@media (min-width: 600px){
  #app{
    flex-flow: row;
    }
    #left{
      flex-basis: 20%;
      height: 100%;
      flex: 1;
      display: flex;
      flex-flow: column;
      max-width: 300px;
      border-right: 1px solid;
      }
      #show_btn{
        display: none !important;
      }
}
#projItemsContainer{
  flex: 1;
  display: flex;
  flex-flow: column;
  overflow: auto;
  padding-right: 10px;
  }
#projListContainer{
  flex: 1;
  display: flex;
  flex-flow: column;
  overflow: auto;
  direction: rtl;
  }
.submitCont{
  border-top: 2px solid;
  box-sizing: border-box;
  display: flex;
  flex-flow: row;
}

.projectInnerItem{
  padding: 20px;
  border-bottom: 1px solid;
}

.btn{
  user-select: none;
  cursor: pointer;
  }
  .btn:hover{
    background-color:#CCC;
    }

.current{
  background-color:#EEE;
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
  #left{
    min-width: 170px;
    }

  #right{
    background-color:#CCC;
    flex: 1;
    height: 100%;
    min-width: 350px;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    }
    #list_title{
      border-bottom: #CCC 1px dashed;
      padding: 10px 10px 10px 10px;
      height: 90px;
      }
      #list_title input[type=text]{
        padding: 5px 5px 4px 5px;
        width: 80%;
        box-sizing: border-box;
        }
      #list_title input[type=submit]{
        width: 19%;
        margin-left: 1%;
        padding: 5px 5px 4px 5px;
        }
      #list-title .inner{
        display: inline-block;
        margin-left: 20px;
        }
    #list_container{
      padding: 0px 10px;
      }
      #list_container input[type=text]{
        width: 80%;
        box-sizing: border-box;
        padding: 10px;
        margin: 10px 0px;
        }
      #list_container input[type=submit]{
        width: 19%;
        margin-left: 1%;
        padding: 10px;
        }

    li{
      cursor: pointer;
      user-select: none;
      border-bottom: 1px solid;
      padding: 20px 0px;
      }
      .done span{
        text-decoration: line-through;
        }

.done{
  background-color:#DDD !important;
}

#addbtn{
  font-weight: bold;
  color:#444;
  border-right: #000 2px solid;
  box-sizing: border-box;
  flex:1;
  text-align: center;
  padding: 15px;
  }

#cancelbtn{
  font-weight: bold;
  color:#FFF;
  background-color:#444;
  flex:1;
  text-align: center;
  padding: 15px;
  }

#projCont{
  flex: 1;
  display: flex;
  flex-flow: column;
  padding: 20px;
  height:100%;
}

#projTitle{
  color:#666;
  box-sizing: border-box;
  margin: 30px 0px 13px 0px;
  font-size: 1.2em;
  padding-bottom: 25px;
  border-bottom:  2px dashed;
}

#projItemCont{
  flex: 1;
  height: 100%;
  background-color:#CCC;
  box-sizing: border-box;
}
#projItemInner{
  display: flex;
  flex-flow: column;
  height: 100%;
  flex:1;
  width: 100%;
}

#projList{
  flex: 1;
  overflow: auto;
  }
  #noProj{
    color:#AAA;
    }
    .projItem{
      margin: 5px 0px;
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
      background-color:#EEE;
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
  margin-bottom: 40px;
  text-align:center;
  border-radius: 10px;
  margin-top: 20px;
}
#add_list_itm:hover{
  background-color:#EEE;
}
</style>

