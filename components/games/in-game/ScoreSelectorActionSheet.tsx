import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper
} from '@/components/ui/actionsheet';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

interface ScoreSelectorActionSheetProps {
  playerName: string;
  currentScore: number;
  onPlayerTurnDone: (score: number) => void;
  aimedScore?: number;
}

export function ScoreSelectorActionSheet({playerName, currentScore, onPlayerTurnDone, aimedScore}: ScoreSelectorActionSheetProps) {
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [scores, setScores] = useState<number[]>([0]);
  
  useEffect(() => {
  }, [scores]);

  const DART_COLOR_ENTRIES = [
    ['0-shot', '#212121'],
    ['1-shot', '#3D3D3D'],
    ['2-shot', '#525252'],
    ['3-shot', '#666666'],
    ['4-shot', '#7A7A7A'],
    ['5-shot', '#8F8F8F'],
    ['6-shot', '#A3A3A3'],
    ['7-shot', '#B8B8B8'],
    ['8-shot', '#CCCCCC'],
    ['9-shot', '#E0E0E0'],
  ] as const;

  const DART_COLORS = new Map<string, string>(DART_COLOR_ENTRIES);
  
  const pointSelector = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19, 20],
  ]

  const handleClose = () => {
    setShowActionsheet(false);
  }



  const handleSubmit = () => {
    onPlayerTurnDone(totalScore);
    setScores([]);
    handleClose();
  }

  const hitCount = useMemo(() => {
    const m = new Map<number, number>();
    for (const s of scores) m.set(s, (m.get(s) ?? 0) + 1);
    return m;
  }, [scores]);

  const totalScore = useMemo(() => {
    if(scores.length === 0) return 0;
    if(scores.length === 1) return scores[0];

    return scores.reduce((prev, curr) => prev + curr);
  }, [scores]);

  const expectedScore = useMemo(() => {
    return currentScore + totalScore;
  }, [currentScore, totalScore]);


  const add = (value: number) => () => {
    if(aimedScore !== undefined && expectedScore + value > aimedScore) {
      onPlayerTurnDone(0);
      handleClose();
      return;
    }

    setScores(prev => [...prev, value]);
  }

  const isScoreWithDanger = useCallback((value: number) => {
    if(!aimedScore) return false;
    return (expectedScore + value) > aimedScore; 
  }, [expectedScore, aimedScore])

  const ScoreButton = ({value}: {value: number}) => {
    const timesHitted = hitCount.get(value) ?? 0;
    const backgroundColor = DART_COLORS.get(`${timesHitted}-shot`) ?? DART_COLORS.get('9-shot');
    const hasDanger = isScoreWithDanger(value)
    const color = hasDanger ? Colors.secondary : (hitCount.get(value) ?? 0) > 4 ? Colors.background : Colors.text;
    const fullWidth = value === 25;
    
    return (
      <Button
        onPress={add(value)}
        style={[buttonStyle.btn, fullWidth && buttonStyle.fullWidth, { backgroundColor }]}
      >
        {timesHitted > 0 && <Text style={buttonStyle.badge}>x{timesHitted}</Text>}
        
        <ButtonText style={[buttonStyle.label, { color }]}>{value}</ButtonText>
      </Button>
    )
  }



  return (
    <>
      <Box style={{justifyItems: 'center'}}>
        <Button style={{backgroundColor: '#1DB954', width: '100%'}} onPress={() => setShowActionsheet(true)}>
          <ButtonText>Anotar</ButtonText>
        </Button>
      </Box>
      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        snapPoints={[85]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack style={{flex: 1, width: '100%', maxWidth: 500, padding: 20, gap: 15}}>
            {pointSelector.map((array, index) => {
              return (
                <HStack style={{width: '100%', justifyContent: 'space-around'}} key={`PointSelector-${index}`}>
                  {array.map(value => <ScoreButton key={`scoreButton-${value}`} value={value}/>)}
                </HStack>
              )
            })}
            <ScoreButton value={25} />

            <HStack style={{width: '100%', height: 70, justifyContent: 'space-between', gap: 50}}>
              <Button onPress={() => setScores([])} style={{backgroundColor: Colors.secondary, height: '100%'}}>
                <ButtonText style={{color: Colors.text, fontWeight: 'bold', fontSize: 20}}>RESET</ButtonText>
              </Button>
              <Button onPress={handleSubmit} style={{backgroundColor: Colors.primary, flex: 1, height: '100%'}}>
                <ButtonText style={{color: Colors.background, fontWeight: 'bold', fontSize: 20}}>Apuntar {totalScore}</ButtonText>
              </Button>
            </HStack>
            <VStack>
              <Text style={{textAlign: 'center', fontSize: 20}}>{playerName} tendría {expectedScore}</Text>
              {aimedScore !== undefined && <Text style={{textAlign: 'center'}}>({aimedScore - expectedScore} para ganar)</Text>}
            </VStack>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}


const buttonStyle = StyleSheet.create({
  btn: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // ensure absolute children anchor to this
    overflow: "visible",  // just in case the badge touches edges
  },
  fullWidth: { width: "100%" },
  label: { fontSize: 20, fontWeight: "bold" },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    color: Colors.secondaryBackground,
    fontSize: 12,
    fontWeight: 'bold',
    zIndex: 1,
    overflow: "hidden",
  },
});