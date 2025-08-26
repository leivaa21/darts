import { Player } from "./Player";

export interface PlayerStorage {
  getAll(): Promise<Player[]>;
  save(player: Player): Promise<void>;
}