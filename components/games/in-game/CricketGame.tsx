import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import { Game } from "@/contexts/games/domain/Game";
import { StyleSheet, View } from "react-native";

export function CricketGame({game, updateCurrentGame}: {game: Game, updateCurrentGame: (game: Game) => void}) {




  const players = game.players;

  const scorableValues = [15, 16, 17, 18, 19, 20, 25];

  return (
    <View style={[styles.background, {maxWidth: 70 + (players.length * 160)}]}>
      <HStack style={styles.table}>
        <VStack style={styles.firstColumn}>
          {['', 15, 16, 17, 18, 19, 20, 'Bull'].map(value => (
            <View key={`${value}-tag`} style={styles.cell}><Text>{value}</Text></View>
          ))}
        </VStack>
        {players.map(player => (
          <VStack style={styles.columns} key={player}>
            <View style={styles.cell}><Text>{player}</Text></View>
            {scorableValues.map(value => (
              <View key={`${player}-${value}-cell`} style={styles.cell}>
                -
              </View>
            ))}
          </VStack>
        ))}
      </HStack>

    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  table: {
    width: '100%',
    justifyContent: 'space-around',
  },
  firstColumn: {
    width: 60,
    alignItems: 'center',
  },
  columns: {
    width: 150,
    alignItems: 'center',
  },
  cell: {
    width: '100%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondaryBackground
  }
});
