import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import { CricketScorePositions, Game } from "@/contexts/games/domain/Game";
import { CrossIcon, DotIcon, SlashIcon, TargetIcon } from "lucide-react-native";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export function CricketGame({game, updateCurrentGame}: {game: Game, updateCurrentGame: (game: Game) => void}) {

  const scorableValues = [15, 16, 17, 18, 19, 20, 25];
  const {cricketLeaderboard: leaderboard} = game;

  const players = useMemo(() => Array.from(leaderboard.keys()), [leaderboard]);

  const CricketScoredSlotIcon = ({count}: {count: number}) => {
    if (count === 0) {
      return <DotIcon color={Colors.secondaryBackground}/>
    }

    if (count === 1) {
      return <SlashIcon color={Colors.text}/>
    }

    if (count === 2) {
      return <CrossIcon color={Colors.primary}/>
    }

    return <TargetIcon color={Colors.secondary}/>
  }

  const registerRelevantShot = (player: string, value: number) => {
    game.makePlayerCricketShot(player, value as CricketScorePositions);

    updateCurrentGame(game);
  }

  return (
    <ScrollView horizontal style={[styles.background, {maxWidth: 60 + (players.length * 70)}]}>
      <HStack style={styles.table}>
        <VStack style={styles.firstColumn}>
          {['', 'Puntos', 15, 16, 17, 18, 19, 20, 'Bull'].map(value => (
            <View key={`${value}-tag`} style={styles.cell}><Text>{value}</Text></View>
          ))}
        </VStack>
        {players.map(player => (
          <VStack style={styles.columns} key={player}>
            <View style={styles.cell}><Text>{player}</Text></View>
            <View style={styles.cell}><Text>{leaderboard.get(player)!.score}</Text></View>
            {scorableValues.map(value => (
              <Pressable
                key={`${player}-${value}-cell`}
                style={styles.cell}
                onPress={() => registerRelevantShot(player, value)}
              >
                <CricketScoredSlotIcon 
                  count={leaderboard.get(player)!.touches[value as CricketScorePositions] as number}
                />
              </Pressable>
            ))}
          </VStack>
        ))}
      </HStack>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    padding: 20,
    color: Colors.text
  },
  table: {
    width: '100%',
    justifyContent: 'space-around',
  },
  firstColumn: {
    width: 50,
    alignItems: 'center',
  },
  columns: {
    width: 60,
    alignItems: 'center',
  },
  cell: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary
  }
});
