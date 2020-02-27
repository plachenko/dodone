<template>
  <div class="projectItem">

    <div v-if="!project.title" class="inner_inp">
      <form id="frm" ref="newItem" @keyup.esc="$emit('cancel')" @submit.prevent="$emit('setTitle', titleInp)">
        <input
          ref="inp"
          type="text"
          autocomplete="off"
          v-model="titleInp"
          placeholder="Untitled" />
      </form>
      <div id="optContainer">
        <div class="opt btn" @click="remove">X</div>
        <div class="opt btn" @click="add">&#10004;</div>
      </div>
    </div>

    <div v-else @click="$emit('selected')" class="inner">
      {{project.id}}
      <span class="proj_title">{{ project.title }}</span>
      <span class="item_count" v-if="project.items.length">{{project.items.length}}</span>
    </div>

  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { EventBus } from '../eventbus';
import DDProject from '../util/DDProject';

@Component({})
export default class DDProjItem extends Vue{
  $refs!: {
    newItem: HTMLFormElement;
    inp: HTMLInputElement;
  }
  @Prop({default: {}})
  project!: DDProject;

  @Prop({default: false})
  current!: boolean;

  private titleInp = "";

  private remove(){
    this.$emit('cancel');
  }

  private add(){
    this.$emit('setTitle', this.titleInp);
  }

  mounted(){
    if(!this.project.title){
      this.$refs.inp.focus();
    }
  }
}
</script>
<style>
#optContainer{
  display: flex;
  flex: 1;
  flex-basis: 30%
}
#frm{
  margin-right: 10px;
  flex-basis: 70%;
  }

.projectItem{
  border-bottom: #CCC 1px solid;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  direction: ltr;
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
      display: flex;
      }
      .inner_inp input{
        padding: 10px;
        width: 100%;
        box-sizing: border-box;
        }

      .opt{
        flex: 1;
        display: flex;
        place-items: center;
        justify-content: center;
        border: 1px solid;
        }
      .opt:first-child{
        margin-right: 3px;
        }

.proj_title{
  display: block;
  width: 60%;
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
