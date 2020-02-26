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

      <DDProjList
        @addProject="addProject()"
        @removeProject="removeProject($event)"
        @setNewTitle="setTitle($event)"
        @selected="select($event - 1)"
        :projects="searchResult"
        :class="{hide: !show}"
        :current="current" />

      <div
        v-if="!adding"
        @click="addProject()"
        :class="{hide: !show}"
        class="btn add_btn">
        <span>+ New list</span>
      </div>

      <div v-else class="submitCont" :class="{hide: !show}">
        <div class="btn" @click="submitAdd" id="addbtn">Add</div>
        <div class="btn" @click="cancelAdd" id="cancelbtn">Cancel</div>
      </div>

    </div>

    <div id="right" :class="{hide: show}">

      <!-- Projects -->
      <div v-if="projects[current]" id="projCont">
        <div id="projTitle">
          <h2>{{projects[current].title || "Untitled"}}</h2>
        </div>

        <!--
        <div v-if="projects[current].items">
          <div v-for="(item, k) in projects[current].items" :key="k" class="btn" style="background-color:#FFF; padding: 10px; border-radius: 10px; margin: 3px 0px;">
            <div>{{item.txt}}</div>
          </div>
        </div>

        <div v-else-if="itemArr.length">
          <div v-for="(item, k) in itemArr" :key="k" class="btn" style="background-color:#FFF; padding: 10px; border-radius: 10px; margin: 3px 0px;">
            <form @submit.prevent="createItem(k)">
              <input v-model="itemInp[k]" placeholder="item" style="padding: 10px; width: 100%; box-sizing: border-box;" />
            </form>
          </div>
        </div>
        -->

        <!-- <div @click="addListItem" style="border: #AAA 2px dashed; padding: 15px; font-weight: bold; text-align:center; border-radius: 10px; margin-top: 20px;" class="btn">+ Add List Item</div> -->

        <!--
        <div id="projItemCont" v-if="projects[current].items.length">
          <div id="projItemInner">
            <div id="projList">
              <div class="projItem btn" v-for="(item, k) in projects[current].items" :key="k">
                  <div class="circle"></div>
                  <div>{{item.txt}}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-else style="flex: 1; border: #AAA 2px dashed; align-items:center; justify-content: center; display: flex; border-radius: 20px;">
          <div id="noProj">no list items!</div>
        </div>
        <div style="padding: 20px; border-top: 1px dashed; font-weight: bold; text-align: center;" class="btn" @click="addProjectItem">+ New item</div>
        -->
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DDProject from './util/DDProject';
import DDTop from './components/DDTop.vue';
import DDProjList from './components/DDProjList.vue';
import DDSearch from './components/DDSearch.vue';

import { EventBus }  from './eventbus';

@Component({
  components:{
    DDTop,
    DDSearch,
    DDProjList
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

  private search(e: string){
    this.projSearch = e;
  }

  private mounted(){

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

  public removeProject(k: number){
    console.log(this.projects, k);
    let cur;
    if(k > 0){
      cur = k;
    }else{
      cur = 0
    }
    this.projects.splice(cur, 1);
    if(this.projects.length){
      this.select(cur);
    }

    this.adding = false;
  }

  public submitAdd(){
    EventBus.$emit('submit');
  }

  public cancelAdd(){
    console.log(this.current+1);
    this.removeProject(this.current);
  }

  public addProject(){
    this.adding = true;

    this.projSearch = "";
    this.projects.push(new DDProject());
    this.current = this.projects.length-1;
  }

  public setTitle(e: string){
    this.adding = false;
    if(this.show){
      this.show = false;
    }
    this.projects[this.projects.length-1].title = e;
    this.save();
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
    this.current = e;
    this.itemArr = this.projects[this.current].items;
    localStorage.setItem('current', this.current+"");
  }

  public load(){
    this.current = JSON.parse(localStorage.getItem('current') || "");
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '{}');
    for(const proj of savedProjects){
      this.projects.push(new DDProject(proj.title, proj.items));
    }
  }

  public createItem(k: number){
    if(this.itemInp[k]){
      this.projects[this.current].createItem(this.itemInp[k]);
      this.itemInp.splice(k, 0);
    }
  }

  public addProjectItem(){
    if(this.itemInp){
      this.projects[this.current].createItem(this.itemInp);
      this.itemInp = '';
    }
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
      .show_btn{
        display: none;
      }
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
    background-color:#EEE;
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
      .done{
        text-decoration: line-through;
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
}

#projTitle{
  color:#666;
  box-sizing: border-box;
  margin: 45px 0px 13px 0px;
  font-size: 1.2em;
  /* border-bottom: 1px dashed; */
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
      margin: 2px 0px;
      border-radius: 10px;
      background-color:#FFF;
      /* border-bottom: 1px solid; */
      padding: 10px;
      flex: 1;
    }
    .circle{
      width: 10px;
      height: 10px;
      border-radius: 10px;
      background-color:#0C0;
    }

</style>

