export class Player {
  constructor(
    public readonly id: string,
    public name: string,
  ) {}


  static fromJson(json: {id: string, name: string}) {
    return new Player(json.id, json.name);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
    }
  }
}