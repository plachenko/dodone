<template>
  <div id="app">
    <div id="left">
      <div class="top">
        <h1 id="logo">DoDone</h1>
        <div v-if="projects.length">
          <div :class="{project: true, current: k == current}" @click="current = k" v-for="(project, k) in projects" :key="k">{{project.title || project.tempTitle}}</div>
        </div>
        <div class="project" @click="addProject()">+ add</div>
      </div>
    </div>
    <div id="right">
      <div v-if="projects.length">
        <div class="top">
          <div id="list_title">
            <h2 v-if="projects[current].title">{{projects[current].title}}</h2>
            <form v-else @submit.prevent="setProjectTitle()">
              <input id="project_title_inp" autocomplete="off" v-model="titleInp" :placeholder="projects[current].tempTitle" />
            </form>
          </div>
          <div id="list_container">
            <form v-if="projects[current].title" @submit.prevent="addProjectItem()">
              <input id="item_inp" autocomplete="off" v-model="itemInp" placeholder="add new item" />
            </form>
            <ul>
              <li
                v-for="(i, k) in projects[current].items"
                :key="k"
                :class="{done: i.done}"
                @click="i.done = !i.done">{{i.txt}} - {{new moment(i.date).format('MM/DD/YYYY')}}</li>
            </ul>
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
  public items = [];
  public id !: symbol;
  public title = "";
  public projects = [];
  public tempTitle = "new project"

  constructor(title = '', items = []){
    this.title = title;
    this.id = Symbol();

    if(items.length){
      const date = new Date();
      for(const item of items){
        this.createItem(item, date);
      }
    }
  }

  public setTitle(title: string){
    this.title = title;
  }

  public createItem(text: string, date: object){
    this.items.push({
      txt: text,
      done: false,
      date: date || new Date()
    })
  }
}

@Component({
})
export default class App extends Vue {
  private inp = "";
  private current = 0;
  private projects: object[] = [];
  private titleInp = "";
  private itemInp = "";

  /*
  private mounted(){
    const items = [];
    let p;
    for(let i = 0; i < 100; i++){
      items.push('test');
      if(i == 99){
        p = new Project('test', items);
        this.projects.push(p)
      }
    }
  }
  */

  public addProjectItem(){
    this.projects[this.current].createItem(this.itemInp);
    this.itemInp = '';
  }

  public setProjectTitle(){
    this.projects[this.current].setTitle(this.titleInp);
    this.titleInp = '';
  }

  public addProject(){
    const project = new Project();

    this.projects.push(project);
    this.current++;
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
#logo{
  text-align: center;
  border-bottom: 1px solid;
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
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
    flex: 1;
    height: 100%;
    overflow-y: auto;
    flex-basis: 20%;
    }
  #right{
    background-color:#F0F;
    overflow-y: auto;
    flex: 1;
    height: 100%;
    flex-basis: 90%;
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
.current{
  background-color:#CCC !important;
  }
.project{
  /* text-align: center; */
  border-bottom: #CCC 1px solid;
  padding: 20px;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  }
  .project:hover{
    background-color:#EEE;
    }
  .project > .current{
    background-color:#CCC;
    }
#list_title{
  border-bottom: 1px dashed;
  padding: 10px;
}
#list_container{
  padding: 0px 30px;
}

#project_title_inp{

  padding:5px;
  width: 100%;
  box-sizing: border-box;
}

#item_inp{
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  margin: 10px 0px;
}
</style>
