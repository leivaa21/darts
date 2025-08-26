import AsyncStorage from "@react-native-async-storage/async-storage";
import { Player } from "../domain/Player";

class PlayerStorage implements PlayerStorage {
  static instance: PlayerStorage;

  static getInstance() {
    if (!this.instance) {
      this.instance = new PlayerStorage();
    }
    return this.instance;
  }

  async getAll(): Promise<Player[]> {
    const rawPlayers = await AsyncStorage.getItem('players');
    return rawPlayers 
      ? JSON.parse(rawPlayers).map((json: any) => Player.fromJson(json))
      : [];
  }

  async save(player: Player): Promise<void> {
    const players = await this.getAll();
    players.push(player);
    
    return AsyncStorage.setItem(
      'players',
      JSON.stringify(players.map(p => p.toJson()))
    );
  }
}

export const playerStorage = PlayerStorage.getInstance();