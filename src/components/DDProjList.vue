<template>
  <div style="flex:1;">
    <div v-if="intProjects">
      <DDSearch @searchEvt="search" />

      <div style="overflow-y: auto;">
        <DDProjItem
          @setTitle="setProjectTitle($event)"
          @selected="current = k"
          v-for="(project, k) in searchResult"
          :key="k"
          :project="project"
          :class="{ current: k == current }" />
      </div>

    </div>
    <div
      v-if="!adding"
      @click="addProject()"
      class="project">+ New list</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DDSearch from './DDSearch.vue';
import DDProjItem from './DDProjItem.vue';
// import EventBus from '../eventbus';

@Component({
  components: {
    DDSearch,
    DDProjItem
  }
})
export default class DDProjList extends Vue {
  private intProjects = [];
  private projSearch = "";
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

  public setProjectTitle(title: string){
    const _title = title ? title : 'untitled';

    this.adding = false;
    this.$emit('projectAdd', _title);
  }

  public addProject(){
    // this.projSearch = "";
    // this.intProjects.push({});
    // this.current = this.projects.length-1;
    this.adding = true;
    this.$emit('projectAdd');
  }

  private mounted(){
    this.intProjects = this.projects;
    // console.log(this.intProjects);
  }

  private selectProject(e: number){
    console.log('test');
    this.current = e;
    console.log(e);
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
