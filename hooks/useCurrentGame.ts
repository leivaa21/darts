import { Game } from "@/contexts/games/domain/Game";
import { useEffect, useState } from "react";
import { gameStorage } from "../contexts/games/infrastructure/GameStorage";

export function useCurrentGame() {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    reload()
  }, []);

  const reload = () => {
    gameStorage.getCurrent().then(setGame);
  }

  const updateCurrentGame = (Game: Game) => {
    gameStorage.saveCurrent(Game).then(reload);
  }

  const removeGame = () => {
    gameStorage.removeCurrent().then(reload);
  }

  const getCurrent = async () => {
    return gameStorage.getCurrent();
  }

  return { game, updateCurrentGame, removeGame, reloadGame: reload, getCurrent}
}
