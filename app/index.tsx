import { StyleSheet } from 'react-native';

import { AnimatedDarts } from '@/components/AnimatedDarts';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { usePlayers } from '@/hooks/usePlayers';
import { Link } from 'expo-router';
import { useEffect } from 'react';

export default function HomeScreen() {

  const {players, reloadPlayers} = usePlayers();

  useEffect(() => {
    reloadPlayers()
  }, [])

  return (
    <ThemedView style={styles.content}>
      <ThemedText type="title" style={styles.titleContainer}>
        Darts <AnimatedDarts />
      </ThemedText>

      <ThemedText>Added players: {players.length}</ThemedText>
      <Link href="/add-player">Add player</Link>

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
});
