<template>
  <div>
    <div v-if="intProjects.length">
      <DDSearch @searchEvt="search" />
      <div
        v-for="(project, k) in searchResult"
        @click="selectProject(k)"
        :key="k"
        :class="{ project: true, current: k == current, temp: !project.title }">

        <div v-if="adding">
          <form @submit.prevent="setProjectTitle()">
            <input type="text" autocomplete="off" v-model="titleInp" :placeholder="intProjects[current].tempTitle" />
            <input type="submit" />
          </form>
          <input type="text">
        </div>
        <div v-else>
          <span class="proj_title">{{project.title || project.tempTitle}}</span>
          <span class="item_count" v-if="project.items.length">{{project.items.length}}</span>
        </div>

      </div>
    </div>
    <div class="project" @click="addProject()" v-if="!adding">+ New list</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DDSearch from './DDSearch.vue';
// import EventBus from '../eventbus';

@Component({
  components: {
    DDSearch
  }
})
export default class DDProjList extends Vue {
  private intProjects = [];
  private projSearch = "";
  private titleInp = "";
  private current = 0;
  private adding = false;

  @Prop({default: []})
  projects!: any[];

  @Watch('projSearch')
  onChange(val: string){
    this.$emit('searchEvt');
  }

  get searchResult(){
    return this.intProjects.filter((item: any) => {
      return this.projSearch.toLowerCase().split(' ').every(i => item.title.toLowerCase().includes(i));
    })
  }

  public setProjectTitle(){
    this.$emit('projectAdd');
  }

  public addProject(){
    this.projSearch = "";
    this.intProjects.push({});
    this.current = this.projects.length-1;
    this.adding = true;
  }

  private mounted(){
    this.intProjects = this.projects;
    // console.log(this.intProjects);
  }

  private selectProject(e: number){
    this.current = e;
  }

  private search(e: string){
    this.projSearch = e;
  }
}
</script>

<style>
.search{
  padding: 10px;
  border-bottom: 1px solid;
  }
  .search input{
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    }
</style>
