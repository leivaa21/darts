import { Game } from "./Game";

export interface GameStorage {
  getCurrent(): Promise<Game | null>;
  saveCurrent(game: Game): Promise<void>;
  removeCurrent(): Promise<void>;
}