// import moment from 'moment';

export default class DDProject{
  public items: any[] = [];
  public id !: number;
  public title = "";
  public proj_search = "";
  public projects = [];
  public tempTitle = "Untitled"
  public static latestId: number;
  private timer !: any;

  constructor(title = '', items: any = []){
    this.title = title;
    if(!this.id){
      this.id = DDProject.incrementId();
    }

    if(items.length){
      for(const i of items){
        i.started = false;

        // Hacks to conform old data
        if(typeof i.star == 'undefined'){
          i.star = false;
        }
        if(typeof i.timeSpent == 'undefined'){
          i.timeSpent = 0;
        }

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
      star: false,
      started: false,
      timeSpent: 0,
      date: date
    }

    this.items.push(item);
  }

  public stopItem(){
    clearInterval(this.timer);
    this.timer = null;
  }
}
