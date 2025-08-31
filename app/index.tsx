import { ScrollView, StyleSheet, View } from 'react-native';

import { CreateGameActionSheet } from '@/components/games/CreateGameActionSheet';
import { PlayerLeaderboard } from '@/components/games/in-game/PlayerLeaderboard';
import { AddPlayerActionSheet } from '@/components/players/AddPlayerActionSheet';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { useCurrentGame } from '@/hooks/useCurrentGame';
import { usePlayers } from '@/hooks/usePlayers';
import { router } from 'expo-router';
import { GamepadIcon, RefreshCwIcon, TrashIcon } from 'lucide-react-native';
import { useEffect } from 'react';
export default function HomeScreen() {

  const {
    players,
    reloadPlayers,
    addPlayer,
    removePlayer
  } = usePlayers();

  const { updateCurrentGame, game, reloadGame, removeGame } = useCurrentGame();

  useEffect(() => {
    reloadPlayers();
    reloadGame();
  }, [])

  if (game) {

    if (game.concluded) {
      return (
        <View style={styles.content}>
          <Text style={styles.title}>
            Partida terminada! 🎯
          </Text>
          <PlayerLeaderboard leaderboard={game.orderedLeaderboard}/>
          <Button onPress={() => {removeGame();reloadGame();}} style={{backgroundColor: Colors.primary, margin: 10, height: 50}}>
            <ButtonText><RefreshCwIcon /></ButtonText>
            <ButtonText style={{flexDirection: 'row'}}>Comenzar una nueva partida</ButtonText>
          </Button>
        </View>
      )

    }

    return (
      <View style={styles.content}>
        <View style={{margin: 'auto'}}>
          <Text style={styles.title}>
            Partida en curso! 🎯
          </Text>
          <VStack style={{color: Colors.background}}>
            <Button
              onPress={() => {
                router.navigate('/game');
              }}
              style={{backgroundColor: Colors.primary, margin: 10, height: 50}}
            >
              <ButtonText><GamepadIcon /></ButtonText>
              <ButtonText style={{flexDirection: 'row'}}>Continuar partida</ButtonText>
            </Button>
            <Button onPress={() => {removeGame();reloadGame();}} style={{backgroundColor: Colors.secondary, margin: 10, height: 50}}>
              <ButtonText><RefreshCwIcon /></ButtonText>
              <ButtonText style={{flexDirection: 'row'}}>Comenzar una nueva partida</ButtonText>
            </Button>
          </VStack>
        </View>
      </View>
    )
  }

  return (
      <View style={styles.content}>
        <View style={styles.header}>
          <Heading style={styles.title}>
            Darts 🎯
          </Heading>
          <HStack style={{ width: '100%', justifyContent: 'center', gap: 20 }}>
            <AddPlayerActionSheet players={players} addPlayer={addPlayer}/>
            <CreateGameActionSheet players={players.map(p => p.name)} addGame={updateCurrentGame}/>
          </HStack>
        </View>
        <ScrollView style={styles.playersList}>
          {players.map(player => (
            <Box 
              key={player.name}
              style={{ width: '100%', marginBottom: 5, padding: 10, textAlign: 'start'}}
            >
              <HStack>
                <Text style={{ color: 'white', fontSize: 20, flex: 1}}>
                  {player.name}
                </Text>
                <Button onPress={() => {removePlayer(player.name)}} style={{backgroundColor: Colors.secondary}}>
                  <TrashIcon/>
                </Button>
              </HStack>
            </Box>
          ))}
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 32,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    alignItems: 'center'
  },
  header: {
    width: '100%',
    flex: 0.35,
    justifyContent: 'center',
    gap: 20
  },
  title: {
    padding: 12,
    textAlign: 'center',
    gap: 8,
    fontSize: 32,
    fontWeight: 'bold',
  },
  playersList: { 
    flex: 0.65,
    width: '100%',
    maxWidth: 'auto',
    maxHeight: 'auto',
    // flexDirection: 'column',
    padding: 25,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#1e1e1e',
  }
});
