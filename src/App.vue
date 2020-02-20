<template>
  <div id="app">
    <div id="left">
      <div id="left_cont">
        <div id="left_top">
          <div>
            <h1 id="logo">DoDoneDidr</h1>
            <!-- <div>...</div> -->
          </div>
          <div id="proj_search" v-if="projectsWithTitle">
            <input type="search" v-model="projSearch" placeholder="Search" />
          </div>
        </div>
        <div id="project_list">
          <div
            @click="current = k" v-for="(project, k) in searchResult"
            :class="{project: true, current: k == current, temp: !project.title}"
            :key="k">
              <span class="proj_title">{{project.title || project.tempTitle}}</span>
              <span class="item_count" v-if="project.items.length">{{project.items.length}}</span>
            </div>
        </div>
        <div>
          <div id="addbtn" class="project" @click="addProject()">+ New list</div>
          <div class="project" @click="loadGHIssues()">GH issues</div>
          <div class="project" @click="clear()">clear</div>
          <div class="project" @click="save()">save</div>
        </div>
      </div>
    </div>

    <div id="right">
      <div v-if="projects.length" style="flex: 1;">
        <div class="top">

          <div id="list_title">
            <h2 v-if="projects[current].title">{{projects[current].title}}</h2>
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
                :class="{done: i.done}"
                @click="i.done = !i.done">{{i.txt}}</li>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import moment from 'moment';

class Project{
  public items: object[] = [];
  public id !: symbol;
  public title = "";
  public proj_search = "";
  public projects = [];
  public tempTitle = "new project"

  constructor(title = '', items = []){
    this.title = title;
    this.id = Symbol();

    if(items.length){
      this.items = items;
    }
  }

  public setTitle(title: string){
    this.title = title;
  }

  public createItem(text: string, date: object){
    const item = {
      txt: text,
      done: false,
      date: date || new Date()
    }

    this.items.push(item);
  }
}

@Component({
})
export default class App extends Vue {
  private inp = "";
  private current = 0;
  private projects: any[] = [];
  private projSearch = "";
  private titleInp = "";
  private itemInp = "";

  get searchResult(){
    return this.projects.filter((item) => {
      return this.projSearch.toLowerCase().split(' ').every(i => item.title.toLowerCase().includes(i));
    })
  }

  get projectsWithTitle(){
    return this.projects.some(i => i.title.length)
  }

  private mounted(){
    if(localStorage.getItem('projects')){
      this.load();
    }
  }

  public addProjectItem(){
    if(this.itemInp){
      this.projects[this.current].createItem(this.itemInp);
      this.itemInp = '';
    }
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
        this.projects.push(new Project('GH issues', issues))
      })
      .catch(error => console.error(error));
  }

  public clear(){
    this.titleInp = "";
    this.itemInp = "";
    this.projects = [];
    localStorage.clear();
  }

  public load(){
    this.current = 0;
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '{}');
    for(const proj of savedProjects){
      this.projects.push(new Project(proj.title, proj.items));
    }
  }

  public save(){
    if(this.projectsWithTitle){
      localStorage.setItem('projects', JSON.stringify(this.projects));
    }
  }

  public setProjectTitle(){
    this.projects[this.current].setTitle(this.titleInp);
    this.titleInp = '';
  }

  public addProject(){
    this.projSearch = "";
    const project = new Project();

    this.projects.push(project);
    this.current = this.projects.length-1;
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

  #left{
    height: 100%;
    flex-basis: 20%;
    min-width: 170px;
    border-right: 1px solid;
    }
    #left_top{
      width: 100%;
      }
      #logo{
        border-bottom: 1px solid;
        width: 100%;
        font-size: 1.4em;
        padding: 11px;
        box-sizing: border-box;
        }
      #addbtn{
        text-align: center;
        border-top: #EEE 2px solid;
        font-weight: bold;
        }
    #proj_search{
      padding: 10px;
      border-bottom: 1px solid;
      }
      #proj_search input{
        width: 100%;
        padding: 10px;
        box-sizing:border-box;
        }

    #project_list{
      flex: 1;
      width: 100%;
      overflow-y: auto;
      }
      .proj_title{
        display: block;
        width: 80%;
        text-overflow: ellipsis;
        overflow: hidden;
        float: left;
        white-space: nowrap;
        }
      .item_count {
        background-color: #CCC;
        float: right;
        display: block;
        padding: 5px;
        margin-top: -5px;
        border-radius: 10px;
        }
    #left_cont{
      display: flex;
      flex-direction: column;
      height: 100%;
      }

      .temp{
        color:#AAA;
        }

    .project{
      border-bottom: #CCC 1px solid;
      height: 55px;
      padding: 20px;
      cursor: pointer;
      user-select: none;
      box-sizing: border-box;
      }
      .project:hover{
        background-color:#EEE;
        }
      .current{
        background-color:#EEE;
        }

  #right{
    flex: 1;
    height: 100%;
    flex-basis: 90%;
    min-width: 350px;
    overflow: auto;
    }
    #list_title{
      border-bottom: #CCC 1px dashed;
      padding: 10px 10px 10px 10px;
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
      #list-title h2{
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
