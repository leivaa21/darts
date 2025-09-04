import { Heading } from "@/components/ui/heading";
import { Game } from "@/contexts/games/domain/Game";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { ScoreSelectorActionSheet } from "./ScoreSelectorActionSheet";

export function MatchTurn({game, updateCurrentGame}:{game: Game, updateCurrentGame: (game: Game) => void}) {

  const [player, setPlayer] = useState<string>('');
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [aimedScore, setAimedScore] = useState<number | undefined>(undefined);

  useEffect(() => {
    const currentPlayer = game.currentTurn();
    setPlayer(currentPlayer);
    setCurrentScore(game.getCurrentScore(currentPlayer));
    if(game.hasAimedScore()) {
      setAimedScore(game.aimedScore);
    }
  }, [game])


  const onPlayerTurnDone = useCallback((score: number) => {
    game.makePlayerTurn(player, score);
    updateCurrentGame(game);
    if (game.concluded) {
      router.navigate('/');
    }
  }, [game, player, updateCurrentGame]);

  return (
    <View style={{justifyContent: 'center', flex: .7, width: '100%', maxWidth: 500, padding: 20}}>
      <Heading style={{width: '100%', textAlign: 'center', marginBottom: 30}}>Turno de {player}</Heading>
      <ScoreSelectorActionSheet
        playerName={player}
        currentScore={currentScore}
        onPlayerTurnDone={onPlayerTurnDone}
        aimedScore={aimedScore}
      />
    </View>
  )

}