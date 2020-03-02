// import moment from 'moment';

export default class DDProject{
  public items: any[] = [];
  public id !: number;
  public title = "";
  public proj_search = "";
  public projects = [];
  public tempTitle = "Untitled"
  public static latestId: number;
  private timer!: any;

  constructor(title = '', items = []){
    this.title = title;
    if(!this.id){
      this.id = DDProject.incrementId();
    }

    if(items.length){
      for(const i of items){
        i.started = false;
      }
      this.items = items;
    }
  }

  public static reset(){
    this.latestId = 0;
  }

  static incrementId() {
    if(!this.latestId){
      this.latestId = 1;
    }else{
      this.latestId++;
    }
    return this.latestId;
  }

  public setTitle(title: string){
    this.title = title;
  }

  public createItem(text: string, date: object = new Date()){
    const item = {
      txt: text,
      done: false,
      started: false,
      timeSpent: 0,
      date: date
    }

    this.items.push(item);
  }

  public startTick(i: any){
    // const startedEl = this.items.find(i => i.started);
    console.log(i.txt)
    /*
    if(!startedEl.timeSpent){
      startedEl.timeSpent = 0;
    }

    if(!this.timer){
      this.timer = setInterval(() => {
        startedEl.timeSpent++;
      }, 1000);
    }
    */
  }

  public stopItem(){
    clearInterval(this.timer);
    this.timer = null;
  }
}
