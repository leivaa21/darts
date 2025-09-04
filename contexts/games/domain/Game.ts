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
  Cricket = 'Cricket',
}

export interface ScoringGamePlayerData {
  score: number,
  finished: boolean,
  fixedPosition?: number
}

export type CricketScorePositions = 15 | 16 | 17 | 18 | 20 | 25;

export interface CricketGamePlayerData {
  score: number;
  touches: Record<CricketScorePositions, number>;
}

export class Game {
  constructor(
    public readonly type: Type,
    public readonly finishCondition: FinishCondition,
    public readonly players: string[],
    public readonly rounds: Map<string, number | null>[],
    public readonly nRounds: number | null = null,
    public concluded: boolean,
    private readonly _leaderboard: Map<string, ScoringGamePlayerData | CricketGamePlayerData>,
  ) {}


  public static create({
    type, finishCondition, players, nRounds = null,
  }: {
    type: Type;
    finishCondition: FinishCondition;
    players: string[];
    nRounds?: number | null;
  }) {

    const leaderboard = new Map<string, {score: number, finished: boolean}>();
    players.forEach(player => leaderboard.set(player, {score: 0, finished: false}));

    return new Game(
      type,
      finishCondition,
      players,
      new Array<Map<string, number>>(),
      nRounds,
      false,
      leaderboard,
    );
  }

  public get leaderboard() {
    if(this.type === Type.Cricket) throw new Error("Invalid leaderboard for cricket game");
    return this._leaderboard as Map<string, ScoringGamePlayerData>;
  }

  public get cricketLeaderboard() {
    if(this.type !== Type.Cricket) throw new Error("Invalid leaderboard for this game");
    return this._leaderboard as Map<string, CricketGamePlayerData>;
  }

  public currentTurn(): string {
    if (this.concluded) {
      return this.players[0];
    }

    if (this.rounds.length === 0) {
      this.addNewRound();
      return this.players[0];
    }

    const remainings = this.getRemainings();

    if(remainings.length === 0) {
      this.addNewRound();
      return this.currentTurn();
    }

    return remainings[0][0];
  }

  public currentRound(): number {
    return this.rounds.length;
  }

  public getCurrentScore(player: string): number {
    return this.leaderboard.get(player)?.score ?? 0;
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
        const countOfPlayersNotFinished = Array.from(this.leaderboard.values()).filter(({finished}) => !finished).length;
        const everyOneFinished = countOfPlayersNotFinished === 0;
        return everyOneFinished;
      case Type.Free:
        return false;
      case Type.Cricket:
        return false;
      default:
        const countOfPlayersThatShouldHaveFinished = this.finishCondition === FinishCondition.ClosePodium ? 3 : 1;
        const countOfPlayersThatFinished = Array.from(this.leaderboard.values()).filter(({finished}) => finished).length;
        return countOfPlayersThatFinished === countOfPlayersThatShouldHaveFinished;
    }
  }

  public makePlayerTurn(player: string, score: number) {
    this.rounds[this.rounds.length - 1].set(player, score);
    const {score: currentPlayerScore} = this.leaderboard.get(player)!;
    this.leaderboard.set(player, {score: currentPlayerScore + score, finished: false});

    this.checkIfPlayerFinished(player);
    if(this.checkIfFinished()) {
      this.concluded = true;
    }
  }

  public makePlayerCricketTurn(player: string, shots: number[]) {
    const relevantShots = shots.filter(n => n >= 15) as CricketScorePositions[];

    const playerData = this.cricketLeaderboard.get(player)!;

    relevantShots.forEach((value) => {
      if(playerData.touches[value] >= 3 && !this.numberIsClosed(value)) {
        playerData.score += value;
      }
      playerData.touches[value]++;
    });

    if(this.checkIfFinished()) {
      this.concluded = true;
    }
  }

  private numberIsClosed(value: CricketScorePositions) {
    const playersData = Array.from(this.cricketLeaderboard.values());
    const numberTouches = playersData.map(data => data.touches[value]).filter(count => count < 3);

    return numberTouches.length === 0;
  }

  private checkIfPlayerFinished(player: string): void {
    const {score} = this.leaderboard.get(player)!;
    let fixedPosition: number | undefined = undefined
    switch(this.type) {
      case Type.Rounds:
        const isLastRound = this.rounds.length === this.nRounds;
        if(!isLastRound) return;
        break;
      case Type.Free:
        return;
      case Type.Cricket:
        return;
      default:
        if(score !== this.aimedScore) return;
        break;
    }

    if(this.finishCondition === FinishCondition.ClosePodium) {
      fixedPosition = Array.from(this.leaderboard.values()).filter(({finished}) => finished).length + 1;
    }
    this.leaderboard.set(player, {score, finished: true, fixedPosition});
  }


  public get orderedLeaderboard() {
    const leaderboardEntries = Array.from(this.leaderboard.entries());
    if(this.finishCondition !== FinishCondition.ClosePodium) {
      return new Map(leaderboardEntries.sort(
        (a, b) => b[1].score - a[1].score
      ));
    }

    const nonFixedPositions = leaderboardEntries.filter(([_player, {fixedPosition}]) => fixedPosition === undefined); 
    const fixedPositions = leaderboardEntries
      .filter(([_player, {fixedPosition}]) => fixedPosition !== undefined)
      .sort((a, b) => a[1].fixedPosition! - b[1].fixedPosition!); 

    
    return new Map([...fixedPositions, ...nonFixedPositions]);
  }

  private addNewRound() {
    const newRound = new Map<string, number|null>();
    const playersThatAlreadyFinished = Array
      .from(this.leaderboard.entries())
      .filter(([_player, {finished}]) => finished)
      .map(([player]) => player);


    this.players.forEach(player => {
      if(!playersThatAlreadyFinished.includes(player)) {
        newRound.set(player, null);
      }
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
    players: string[],
    rounds: {[user: string]: number}[],
    nRounds: number | null,
    concluded: boolean,
    leaderboard: {[user: string]: {score: number, finished: boolean}}
  }) {
    const rounds = json.rounds.map(r => {
      const roundPoints = new Map<string, number>();
      Object.entries(r).forEach(([user, points]) => {
        roundPoints.set(user, points);
      });
      return roundPoints;
    });

    const leaderboard = new Map<string, {score: number, finished: boolean}>();
    Object.entries(json.leaderboard).forEach(([user, data]) => {
      leaderboard.set(user, data);
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