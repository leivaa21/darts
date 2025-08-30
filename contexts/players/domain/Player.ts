export class Player {
  constructor(
    public readonly name: string,
    public readonly wins: number,
  ) {}


  public static create({name}: {name: string}) {
    return new Player(name, 0);
  }

  static fromJson(json: {name: string, wins: number}) {
    return new Player(json.name, json.wins);
  }

  toJson() {
    return {
      name: this.name,
      wins: this.wins,
    }
  }
}