<template>
  <div id="projListContainer">
    <DDProjItem
      @setNewTitle="setTitle($event)"
      @selected="selectItem(project.id)"
      @cancelNew="$emit('removeProject', current)"
      v-for="(project, k) in projects"
      ref="projItem"
      :current="current == k"
      :key="k"
      :project="project"
      :class="{ current: project.id - 1 == current }" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DDProjItem from './DDProjItem.vue';
import DDProject from '../util/DDProject';

@Component({
  components: {
    DDProjItem
  }
})
export default class DDProjList extends Vue {

  @Prop({default: 0})
  current!: number;

  @Prop({default: []})
  projects!: DDProject[];

  @Watch('projSearch')
  onChange(){
    this.$emit('searchEvt');
  }


  public selectItem(e: number){
    /*
    const listEl = this.$refs['projList'].$el;
    const projEl = this.$refs['projItem'][e].$el;

    listEl.scrollIntoView(projEl);
    */

    this.$emit('selected', e);
  }

  public setTitle(title: string){
    const _title = title ? title : 'untitled';
    this.$emit('setNewTitle', _title);
  }

}
</script>

<style>
#projListContainer{
  flex: 1;
  display: flex;
  flex-flow: column;
  overflow: auto;
  direction: rtl;
  }
  #projList{
    display: flex;
    flex-flow: column;
    }
.search{
  padding: 10px;
  border-bottom: 1px solid;
  }
  .search input{
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    }

.add_btn{
  padding: 20px;
  font-weight: bold;
  box-sizing: border-box;
  border-top: #CCC 1px dashed;
  }
</style>
