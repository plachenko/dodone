<template>
  <div class="projectItem">

    <div v-if="!project.title" class="inner_inp">
      <form @submit.prevent="$emit('setTitle', titleInp)">
        <input
          type="text"
          autocomplete="off"
          v-model="titleInp"
          placeholder="Untitled" />
        <!-- <input type="submit" /> -->
      </form>
    </div>

    <div v-else @click="$emit('selected')" class="inner">
      <span class="proj_title">{{ project.title }}</span>
      <span class="item_count" v-if="project.items.length">{{project.items.length}}</span>
    </div>

  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class DDProjItem extends Vue{
  @Prop({default: {}})
  project!: any;

  private titleInp = "";
}
</script>
<style>
.projectItem{
  border-bottom: #CCC 1px solid;
  /* height: 55px; */
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  }
  .projectItem:hover{
    background-color:#EEE;
    }
  .inner, .inner_inp{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    }
    .inner{
      height: 55px;
      padding: 20px;
      }
    .inner_inp{
      padding: 10px;
      }
      .inner_inp input{
        padding: 10px;
        width: 100%;
        box-sizing: border-box;
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
</style>
