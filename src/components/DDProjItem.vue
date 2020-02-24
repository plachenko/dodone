<template>
  <div class="projectItem">

    <div v-if="!project.title" class="inner_inp">
      <form ref="newItem" @keyup.esc="$emit('cancelNew')" @submit.prevent="$emit('setNewTitle', titleInp)">
        <input
          ref="inp"
          type="text"
          autocomplete="off"
          v-model="titleInp"
          placeholder="Untitled" />
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
import { EventBus } from '../eventbus';

@Component({})
export default class DDProjItem extends Vue{
  @Prop({default: {}})
  project!: any;

  @Prop({default: false})
  current!: boolean;

  private titleInp = "";

  mounted(){
    EventBus.$on('submit', () => {
      if(this.current) {
        this.$emit('setNewTitle', this.titleInp);
      }
    });

    EventBus.$on('cancel', () => {
      if(this.current) {
        this.$emit('setNewTitle', this.titleInp);
      }
    });

    if(!this.project.title){
      this.$refs.inp.focus();
    }
  }
}
</script>
<style>
.projectItem{
  border-bottom: #CCC 1px solid;
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
