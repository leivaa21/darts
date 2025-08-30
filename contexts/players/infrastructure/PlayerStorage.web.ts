import { Player } from "../domain/Player";
import { PlayerStorage as IPlayerStorage } from "../domain/PlayerStorage";

class PlayerStorage implements IPlayerStorage {
  static instance: PlayerStorage;

  static getInstance() {
    if (!this.instance) {
      this.instance = new PlayerStorage();
    }
    return this.instance;
  }

  async getAll(): Promise<Player[]> {
    const rawPlayers = window.localStorage.getItem('players');
    return rawPlayers 
      ? JSON.parse(rawPlayers).map((json: any) => Player.fromJson(json))
      : [];
  }

  async save(player: Player): Promise<void> {
    const players = await this.getAll();
    players.push(player);
    
    return window.localStorage.setItem(
      'players',
      JSON.stringify(players.map(p => p.toJson()))
    );
  }

  async remove(name: string): Promise<void> {
    const players = await this.getAll();
    const filteredPlayers = players.filter(player => player.name !== name);
    return window.localStorage.setItem(
      'players',
      JSON.stringify(filteredPlayers.map(p => p.toJson()))
    );
  }
}

export const playerStorage = PlayerStorage.getInstance();