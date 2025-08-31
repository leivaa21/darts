import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useMemo } from "react";
import { ScrollView } from "react-native";

export function PlayerLeaderboard({leaderboard}:{leaderboard: Map<string, {score: number, finished: boolean}>}) {

  const sorted = useMemo(
    () => Array.from(leaderboard.entries()), [leaderboard]
  );

  return (
    <ScrollView style={{flex: 0.3, width: '100%', maxWidth: 500, padding: 20}}>
      {sorted.map(([player, {score}], index) => (
        <HStack key={player} style={{justifyContent: 'space-between', height: 35, marginTop: 5, marginBottom: 5 }}>
          <Text style={{fontSize: 25}}>{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `🎯`} {player}</Text>
          <Text style={{fontSize: 25, fontWeight: 'bold'}}>{score}</Text>
        </HStack>
      ))}
    </ScrollView>
  )

}