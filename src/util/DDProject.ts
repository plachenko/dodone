// import moment from 'moment';

export default class DDProject{
  public items: object[] = [];
  public id !: number;
  public title = "";
  public proj_search = "";
  public projects = [];
  public tempTitle = "new project"
  public latestId!: number;

  constructor(title = '', items = []){
    this.title = title;
    this.id = DDProject.incrementId();

    if(items.length){
      this.items = items;
    }
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

  public createItem(text: string, date: object){
    const item = {
      txt: text,
      done: false,
      date: date || new Date()
    }

    this.items.push(item);
  }
}
