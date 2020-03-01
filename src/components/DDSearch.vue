<template>
  <div class="search">
    <input :disabled="disabled" type="search" v-model="projSearch" placeholder="Search" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { EventBus } from '../eventbus';

@Component
export default class DDSearch extends Vue {
  private projSearch = "";

  @Prop({default: true})
  disabled !: boolean;

  @Watch('projSearch')
  onChange(){
    this.$emit('searchEvt', this.projSearch)
  }

  private mounted(){
    EventBus.$on('clear', ()=>{
      this.projSearch ="";
    })
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
