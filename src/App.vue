<template>
  <div id="app">
    <div id="left" :class="{noFlex: !show}">
      <DDTop @toggleMenu="show = !show" />

      <DDSearch :class="{hide: !show}" :disabled="!projectsWithTitle" @searchEvt="search" />

      <DDProjList
        @addProject="addProject()"
        @removeProject="removeProject()"
        @setNewTitle="setTitle($event)"
        @selected="current = $event"
        :projects="searchResult"
        :class="{hide: !show}"
        :current="current" />

      <div
        v-if="!adding"
        @click="addProject()"
        :class="{hide: !show}"
        class="btn add_btn">+ New list</div>
      <div v-else class="submitCont" :class="{hide: !show}">
        <div class="btn" @click="submitAdd" style="background-color:#0F0; flex:1; text-align: center; padding: 15px;">Add</div>
        <div class="btn" @click="cancelAdd" style="background-color:#F00; flex:1; text-align: center; padding: 15px;">Cancel</div>
      </div>
    </div>
    <div id="right" :class="{hide: show}">
      <!-- Projects -->

      <div v-if="projects.length">
        <div style="flex: 1; padding: 40px; box-sizing: border-box; border-bottom: 1px dashed;">
          <h2>{{projects[current].title || "Untitled"}}</h2>
        </div>
        <div v-if="projects[current].items.length">
          <div class="projectInnerItem" v-for="(item, k) in projects[current].items" :key="k">{{item.txt}}</div>
        </div>
        <div v-else style="flex: 1; align-items: center; justify-items:center; display: flex;">
          <div style="align-self: center; justify-self: center; flex:1; color:#AAA;">no list items!</div>
        </div>
      </div>

    </div>

    <!--
    <div id="left">
      <div id="left_cont">
        <div id="left_top">
          <div style="display: flex">
            <h1 id="logo">DoDoneDidr</h1>
            <div class="show" @click="show = !show" style="cursor: pointer; border-left: 1px solid; padding: 20px 20px 10px 20px;">
              ...
            </div>
          </div>
          <div :class="{hide: !show}" id="proj_search" >
            <input type="search" v-model="projSearch" placeholder="Search" />
          </div>
        </div>
        <div :class="{hide: !show}" id="project_list">
          <div
            @click="current = k" v-for="(project, k) in searchResult"
            :class="{project: true, current: k == current, temp: !project.title}"
            :key="k">
              <span class="proj_title">{{project.title || project.tempTitle}}</span>
              <span class="item_count" v-if="project.items.length">{{project.items.length}}</span>
            </div>
        </div>
        <div :class="{hide: !show}">
          <div id="addbtn" class="project" @click="addProject()">+ New list</div>
          <div class="project" @click="loadGHIssues()">GH issues</div>
          <div class="project" @click="clear()">clear</div>
          <div class="project" @click="saveGist()">Save Gist</div>
          <div class="project" @click="loadGist()">Load Gist</div>
          <div v-for="(g, k) in gists" :key="k" class="project" @click="loadGistItem(k)">{{g.id}}</div>
          <div class="project" @click="save()">save</div>
        </div>
      </div>
    </div>

    <div id="right">
      <div v-if="projects.length" style="flex: 1;">
        <div class="top">

          <div id="list_title">
            <div class="inner" v-if="projects[current].title">
              <h2 style="float: left;">{{projects[current].title}}</h2>
              <div @click="removeList()" style="padding: 10px; float: right; background-color:#F00; border-radius: 15px;">remove</div>
            </div>
            <form v-else @submit.prevent="setProjectTitle()">
              <input type="text" autocomplete="off" v-model="titleInp" :placeholder="projects[current].tempTitle" />
              <input type="submit" />
            </form>
          </div>

        </div>
        <div id="list_container" style="height: 100%;">
          <form v-if="projects[current].title" @submit.prevent="addProjectItem()">
            <input type="text" autocomplete="off" v-model="itemInp" placeholder="add new item" />
            <input type="submit" />
          </form>
          <div v-if="projects[current].items.length">
            <ul>
              <li
                v-for="(i, k) in projects[current].items"
                :key="k"
                :class="{done: i.done}">
                  <span @click="removeItem(k)" style="border-right: 1px solid; padding-right: 10px; color:#F00; margin-right: 10px; display: inline-block; cusor: pointer;">x</span>
                  <span @click="i.done = !i.done">{{i.txt}}</span></li>
            </ul>
          </div>
          <div v-else style="display: flex; align-items: center; background-color:#0F0; height: 100%; justify-items: center;">
            <div style="width: 100px; background-color:#F00;">
              no items.
            </div>
          </div>
        </div>

      </div>
    </div>
    -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
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
  private projects: any[] = [];
  private current = 0;
  private projSearch = "";
  private adding = false;

  @Watch('projects')
  onProjectChange(val: object){
    // console.log(val);
  }

  private search(e: string){
    this.projSearch = e;
  }

  private mounted(){
    const items = [];
    for(let i = 0; i < 10; i++){
      items.push({txt: 'test'});
    }
    for(let i = 0; i < 100; i++){
      this.projects.push(new DDProject('test', items));
    }
    /*
    if(localStorage.getItem('projects')){
      this.load();
    }
    */
  }

  get projectsWithTitle(){
    return this.projects.some(i => i.title.length)
  }

  get searchResult(){
    return this.projects.filter((item: any) => {
      return this.projSearch.toLowerCase().split(' ').every((i: string) => item.title.toLowerCase().includes(i));
    })
  }

  public removeProject(){
    this.projects.pop();
    this.adding = false;
  }

  public submitAdd(){
    EventBus.$emit('submit');
  }

  public cancelAdd(){
    this.removeProject();
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
  }
  /*
  private inp = "";
  private current = 0;
  private projects: any[] = [];
  private projSearch = "";
  private titleInp = "";
  private itemInp = "";

  private show = false;

  public gists = [];


  get projectsWithTitle(){
    return this.projects.some(i => i.title.length)
  }

  private mounted(){
    if(localStorage.getItem('projects')){
      console.log(this.current);
      this.load();
    }
  }

  public addProject(){
    this.projects.push(new DDProject());
  }

  public addProjectItem(){
    if(this.itemInp){
      this.projects[this.current].createItem(this.itemInp);
      this.itemInp = '';
    }
  }

  public removeList(){
    // console.log(i);
    this.projects.splice(this.current, 1);
    if(this.current){
      this.current--;
    }
  }

  public removeItem(i: number){
    this.projects[this.current].items.splice(i, 1);
  }

  public loadGHIssues(){
    fetch('https://api.github.com/repos/plachenko/stirlingweather/issues')
      .then(response => response.json())
      .then(data => {
        const issues = [];
        for(const item of data){
          let done = false;
          if(item.closed_at){
            done = true;
          }
          issues.push({txt: item.title, done: done, date: item.created_at});
        }
        this.projects.push(new DDProject('GH issues', issues as any));
      })
      .catch(error => console.error(error));
  }

  public searcher(){
    console.log('searching');
  }

  public clear(){
    this.titleInp = "";
    this.itemInp = "";
    this.projects = [];
    localStorage.clear();
  }

  public loadGist(){
    fetch('https://api.github.com/users/plachenko/gists')
      .then(response => response.json())
      .then(data => {
        this.gists = data;
      });
  }

  public loadGistItem(i: number){
    fetch('https://api.github.com/gists/'+this.gists[i].id)
      .then(response => response.json())
      .then(data => {
        const cont = data.files[Object.keys(data.files)[0]].content

        const savedProjects = JSON.parse(cont);
        for(const proj of savedProjects){
          this.projects.push(new DDProject(proj.title, proj.items));
        }
        this.gists = [];
      })
  }

  public saveGist(){
    if(this.projects.length){
       const gist = {
        description: 'DoDone List Gist',
        public: true,
        files:{
          'list.js': {
            content: JSON.stringify(this.projects)
          }
        }
      };

      fetch('https://api.github.com/gists', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': '',
          'Authorization': 'token '+ process.env.VUE_APP_SECRET

        },
        body: JSON.stringify(gist)
      })
    }
  }

  public load(){
    this.current = JSON.parse(localStorage.getItem('current'));
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '{}');
    for(const proj of savedProjects){
      this.projects.push(new DDProject(proj.title, proj.items));
    }
  }

  public save(){
    if(this.projectsWithTitle){
      localStorage.setItem('current', this.current);
      localStorage.setItem('projects', JSON.stringify(this.projects));
    }
  }

  public setProjectTitle(){
    this.projects[this.current].setTitle(this.titleInp);
    this.titleInp = '';
  }
  */
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
      flex-basis: 5%;
      height: 100%;
      flex: 1;
      display: flex;
      flex-flow: column;
      }
      .noFlex{
        /* flex:0 !important; */
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
      height: 100%;
      flex-basis: 20%;
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
    flex: 1;
    height: 100%;
    min-width: 350px;
    overflow: auto;
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


</style>
