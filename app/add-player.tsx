import { StyleSheet } from 'react-native';

import { AnimatedDarts } from '@/components/AnimatedDarts';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Player } from '@/contexts/players/domain/Player';
import { usePlayers } from '@/hooks/usePlayers';
import { Button } from '@react-navigation/elements';
import { Link } from 'expo-router';

export default function HomeScreen() {

  const {players, addPlayer} = usePlayers();

  return (
    <ThemedView style={styles.content}>
      <ThemedText type="title" style={styles.titleContainer}>
        Darts <AnimatedDarts />
      </ThemedText>

      <Button onPress={() => addPlayer(new Player(players.length.toString(), `Player ${players.length + 1}`))}>Add player</Button>
      <Link href="../">Go Back</Link>
      <ThemedView style={{ flex: 0, padding: 50, justifyContent: 'center', alignItems: 'center'}}>
        {players.map(player => (
          <ThemedText key={player.id}>{player.name}</ThemedText>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  titleContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  playersAdded: {
    display: ''
  }
});
