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
        @removeProject="removeProject()"
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

        <div id="projItemCont">
          <div id="projItemInner">
            <div v-if="projects[current].items.length" id="projList">
              <div class="projItem btn" v-for="(item, k) in projects[current].items" :key="k">
                  <div class="circle"></div>
                  <div>{{item.txt}}</div>
              </div>
            </div>

            <div v-else id="noProj">no list items!</div>

          </div>
        </div>

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
    const items = [];
    for(let i = 0; i < 20; i++){
      items.push({txt: 'test'});
    }
    for(let i = 0; i < 20; i++){
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
    return this.projects.filter((item: DDProject) => {
      return this.projSearch.toLowerCase().split(' ').every((i: string) => item.title.toLowerCase().includes(i));
    })
  }

  public removeProject(){
    this.projects.pop();
    this.current --;
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
      EventBus.$emit('clear');
      this.adding = false;
      this.projects = [];
      localStorage.clear();
    }
  }

  public select(e: number){
    console.log(e);
    this.current = e;
    localStorage.setItem('current', this.current+"");
  }

  public load(){
    this.current = JSON.parse(localStorage.getItem('current') || "");
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '{}');
    for(const proj of savedProjects){
      this.projects.push(new DDProject(proj.title, proj.items));
    }
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
  padding: 30px;
}

#projTitle{
  color:#666;
  box-sizing: border-box;
  margin-bottom: 30px;
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
    justify-self: center;
    align-self: center
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

