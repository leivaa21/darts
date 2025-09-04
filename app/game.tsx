import { CricketGame } from '@/components/games/in-game/CricketGame';
import { MatchTurn } from '@/components/games/in-game/MatchTurn';
import { PlayerLeaderboard } from '@/components/games/in-game/PlayerLeaderboard';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { Type } from '@/contexts/games/domain/Game';
import { useCurrentGame } from '@/hooks/useCurrentGame';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Game() {

  const {game, reloadGame, getCurrent, updateCurrentGame} = useCurrentGame();

  const GameTypeTranslations = {
    [Type.Free]: 'Partida libre',
    [Type.Rounds]: 'Partida por rondas',
    [Type.Cricket]: 'Partida de cricket',
    [Type.G301]: 'Partida a 301',
    [Type.G501]: 'Partida a 501',
    [Type.G701]: 'Partida a 701',
  }

  useEffect(() => {
    reloadGame();
  }, [])

  if(game === null || game.concluded) {
    getCurrent().then(g => {
      if(!g) router.navigate('/');
    })
  }

  if (!game) {
    return (
      <View>

      </View>
    )
  }

  if(game.type === Type.Cricket) {
    return (
      <View style={styles.page}>
        <VStack style={styles.header}>
          <Heading style={{marginTop: 20, color: Colors.text}}>{GameTypeTranslations[game.type]}</Heading>
        </VStack>
        <View style={styles.match}>
          <CricketGame game={game} updateCurrentGame={updateCurrentGame} />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.page}>
      <VStack style={styles.header}>
        <Heading style={{marginTop: 20, color: Colors.text}}>{GameTypeTranslations[game.type]}</Heading>
      </VStack>
      <View style={styles.match}>
        <PlayerLeaderboard leaderboard={game.orderedLeaderboard}/>
        <MatchTurn game={game} updateCurrentGame={updateCurrentGame} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: Colors.background,
    color: Colors.text,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flex: 0.15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackground,
  },
  match: {
    flex: 0.85,
    width: '100%',
    alignItems: 'center'
  }
});
