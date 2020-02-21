import Vue from 'vue-property-decorator'

declare module 'vue/types/vue' {
  interface VueConstructor {
    $test: string
  }
}
