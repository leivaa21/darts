import { Player } from "@/contexts/players/domain/Player";
import { useEffect, useState } from "react";
import { playerStorage } from "../contexts/players/infrastructure/PlayerStorage";

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    reload()
  }, []);

  const reload = () => {
    playerStorage.getAll().then(setPlayers);
  }

  const addPlayer = (player: Player) => {
    playerStorage.save(player).then(reload);
  }

  const removePlayer = (id: string) => {
    playerStorage.remove(id).then(reload);
  }

  return { players, addPlayer, removePlayer, reloadPlayers: reload}
}
