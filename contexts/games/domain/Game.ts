export enum Type {
  Free = 'Free',
  Rounds = 'Rounds',
  G301 = '301',
  G501 = '501',
  G701 = '701',
  Cricket = 'Cricket',
}

export enum FinishCondition {
  FirstToWin = 'FirstToWin',
  ClosePodium = 'ClosePodium',
  FixedRounds = 'FixedRounds',
  Free = 'Free',
}

export class Game {
  constructor(
    public readonly type: Type,
    public readonly finishCondition: FinishCondition,
    public readonly players: {name: string, finished: boolean}[],
    public readonly rounds: Map<string, number | null>[],
    public readonly nRounds: number | null = null,
    public concluded: boolean,
    public readonly leaderboard: Map<string, number>,
  ) {}


  public static create({
    type, finishCondition, players, nRounds = null,
  }: {
    type: Type;
    finishCondition: FinishCondition;
    players: string[];
    nRounds?: number | null;
  }) {

    const leaderboard = new Map<string, number>();
    players.forEach(player => leaderboard.set(player, 0));

    return new Game(
      type,
      finishCondition,
      players.map(p => ({name: p, finished: false})),
      new Array<Map<string, number>>(),
      nRounds,
      false,
      leaderboard,
    );
  }

  public currentTurn(): string {
    if (this.concluded) {
      return this.players[0].name;
    }

    if (this.rounds.length === 0) {
      this.addNewRound();
      return this.players[0].name;
    }

    const remainings = this.getRemainings();

    if(remainings.length === 0) {
      this.addNewRound();
      return this.players[0].name;
    }

    return remainings[0][0];
  }

  public currentRound(): number {
    return this.rounds.length;
  }

  public getCurrentScore(player: string) {
    return this.leaderboard.get(player) ?? 0;
  }

  public hasAimedScore(): boolean {
    const types = [Type.G301, Type.G501, Type.G701];
    return types.includes(this.type);
  }

  public get aimedScore(): number | undefined {
    switch(this.type) {
      case Type.G301:
        return 301;
      case Type.G501:
        return 501;
      case Type.G701:
        return 701;
      default:
        return undefined;
    }
  }

  private checkIfFinished() {
    switch(this.type) {
      case Type.Rounds:
        const isLastRound = this.rounds.length === this.nRounds;
        if(!isLastRound) return false;
  
        const remainings = this.getRemainings();
        const everyOneFinished = remainings.length === 0;
        return everyOneFinished;
      case Type.Free:
        return false;
      case Type.Cricket:
        return false;
      default:
        const countOfPlayersThatShouldHaveFinished = this.finishCondition === FinishCondition.ClosePodium ? 3 : 1;
        const countOfPlayersThatFinished = Array.from(this.leaderboard.values()).filter(score => score === this.aimedScore).length;
        return countOfPlayersThatFinished === countOfPlayersThatShouldHaveFinished;
    }
  }

  public makePlayerTurn(player: string, score: number) {
    this.rounds[this.rounds.length - 1].set(player, score);
    const currentPlayerScore = this.leaderboard.get(player)!;
    this.leaderboard.set(player, currentPlayerScore + score);

    if(this.checkIfFinished()) {
      this.concluded = true;
    }
  }

  private addNewRound() {
    const newRound = new Map<string, number|null>();
    this.players.filter(player => !player.finished).forEach(player => {
      newRound.set(player.name, null);
    });
    
    this.rounds.push(newRound);
  }

  private getRemainings() {
    const currentRound = this.rounds[this.rounds.length - 1];
    const remainings = Array.from(currentRound.entries()).filter(([_player, score]) => score === null);
    return remainings;
  }
  static fromJson(json: {
    id: string,
    type: string,
    finishCondition: string,
    players: {name: string, finished: boolean}[],
    rounds: {[user: string]: number}[],
    nRounds: number | null,
    concluded: boolean,
    leaderboard: {[user: string]: number}
  }) {
    const rounds = json.rounds.map(r => {
      const roundPoints = new Map<string, number>();
      Object.entries(r).forEach(([user, points]) => {
        roundPoints.set(user, points);
      });
      return roundPoints;
    });

    const leaderboard = new Map<string, number>();
    Object.entries(json.leaderboard).forEach(([user, points]) => {
      leaderboard.set(user, points);
    })
    
    return new Game(
      json.type as Type,
      json.finishCondition as FinishCondition,
      json.players,
      rounds,
      json.nRounds,
      json.concluded,
      leaderboard
    );
  }

  toJson() {

    const roundsJson = this.rounds.map(r => {
      return Object.fromEntries(r);
    })

    return {
      type: this.type,
      finishCondition: this.finishCondition,
      players: this.players,
      rounds: roundsJson,
      nRounds: this.nRounds,
      concluded: this.concluded,
      leaderboard: Object.fromEntries(this.leaderboard),
    }
  }
}