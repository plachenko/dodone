<template>
  <div id="projListContainer">
    <DDProjItem
      @setNewTitle="setTitle($event)"
      @selected="selectItem(k)"
      v-for="(project, k) in projects"
      ref="projItem"
      :key="k"
      :project="project"
      :class="{ current: k == current }" />
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
  projects!: any[];


  @Watch('projSearch')
  onChange(val: string){
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
    this.adding = false;
    // this.$emit('removeProject');
    const _title = title ? title : 'untitled';
    this.$emit('setNewTitle', _title);
  }

}
</script>

<style>
#projListContainer{
  flex: 1;
  /* display: flex; */
  /* flex-flow: column; */
  overflow: auto;
  }
  #projList{
    /* display: flex; */
    /* flex-flow: column; */
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
  text-align: center;
  padding: 20px 0px;
  font-weight: bold;
  border-top: 2px solid;
  height: 10px;
  }
</style>
