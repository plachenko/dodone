<template>
  <div class="search">
    <input type="search" v-model="projSearch" placeholder="Search" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class DDSearch extends Vue {
  private projSearch = "";

  @Watch('projSearch')
  onChange(val: string){
    this.$emit('searchEvt', this.projSearch)
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
