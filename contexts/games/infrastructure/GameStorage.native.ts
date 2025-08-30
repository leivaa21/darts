import AsyncStorage from "@react-native-async-storage/async-storage";
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
    const rawGame = await AsyncStorage.getItem('CurrentGame');
    return rawGame ? Game.fromJson(JSON.parse(rawGame)) : null;
  }
  async saveCurrent(game: Game): Promise<void> {
    return AsyncStorage.setItem(
      'CurrentGame',
      JSON.stringify(game.toJson())
    );
  }
  async removeCurrent(): Promise<void> {
    return AsyncStorage.removeItem('CurrentGame');
  }
}

export const gameStorage = GameStorage.getInstance();