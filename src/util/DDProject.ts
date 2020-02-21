// import moment from 'moment';

export default class DDProject{
  public items: object[] = [];
  public id !: symbol;
  public title = "";
  public proj_search = "";
  public projects = [];
  public tempTitle = "new project"

  constructor(title = '', items = []){
    this.title = title;
    this.id = Symbol();

    if(items.length){
      this.items = items;
    }
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
