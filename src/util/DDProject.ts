// import moment from 'moment';

export default class DDProject{
  public items: any[] = [];
  public id !: number;
  public title = "";
  public proj_search = "";
  public projects = [];
  public tempTitle = "Untitled"
  public static latestId: number;

  constructor(title = '', items = []){
    this.title = title;
    if(!this.id){
      this.id = DDProject.incrementId();
    }

    if(items.length){
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
      date: date
    }

    this.items.push(item);
  }
}
