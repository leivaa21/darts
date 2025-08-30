import { Game } from "../domain/Game";
import { GameStorage as IGameStorage } from "../domain/GameStorage";

class GameStorage implements IGameStorage {
  static instance: GameStorage;

  static getInstance() {
    if (!this.instance) {
      this.instance = new GameStorage();
    }
    return this.instance;
  }

  async getCurrent(): Promise<Game | null> {
    const rawGame = window.localStorage.getItem('CurrentGame');
    return rawGame ? Game.fromJson(JSON.parse(rawGame)) : null;
  }
  async saveCurrent(game: Game): Promise<void> {
    return window.localStorage.setItem(
      'CurrentGame',
      JSON.stringify(game.toJson())
    );
  }
  async removeCurrent(): Promise<void> {
    return window.localStorage.removeItem('CurrentGame');
  }
}

export const gameStorage = GameStorage.getInstance();