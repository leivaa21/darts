import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper
} from '@/components/ui/actionsheet';
import { Button, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { FinishCondition, Game, Type } from '@/contexts/games/domain/Game';
import { router } from 'expo-router';
import { useState } from 'react';
import { FormSelectInput } from '../form/FormSelectInput';
import { Box } from '../ui/box';
import { Switch } from '../ui/switch';

export function CreateGameActionSheet({players, addGame}: {players: string[], addGame: (game: Game) => void}) {
  const [showActionsheet, setShowActionsheet] = useState(false);


  const PossibleFinishConditions = [
    { label: 'Primero en ganar', value: FinishCondition.FirstToWin },
    { label: 'Podio cerrado', value: FinishCondition.ClosePodium },
  ]

  const FreeFinishCondition = {
    value: FinishCondition.Free,
    label: ''
  }
  const RoundsFinishCondition = {
    value: FinishCondition.FixedRounds,
    label: ''
  }

  const PossibleTypes = [
    { label: 'Libre', value: Type.Free, possibleFinishConditions: [FreeFinishCondition] },
    { label: 'Por rondas', value: Type.Rounds, possibleFinishConditions: [RoundsFinishCondition] },
    { label: '301', value: Type.G301, possibleFinishConditions: PossibleFinishConditions },
    { label: '501', value: Type.G501, possibleFinishConditions: PossibleFinishConditions },
    { label: '701', value: Type.G701, possibleFinishConditions: PossibleFinishConditions },
    { label: 'Cricket', value: Type.Cricket, possibleFinishConditions: PossibleFinishConditions },
  ];

  const PossibleRounds = [
    {label: '5', value: 5},
    {label: '10', value: 10},
    {label: '15', value: 15},
    {label: '20', value: 20},
  ]

  const [type, setType] = useState(PossibleTypes[0]);
  const [finishCondition, setFinishCondition] = useState(FreeFinishCondition);
  const [rounds, setRounds] = useState<number | null>(null);

  const changeGameType = async (value: string) => {
    const newType = PossibleTypes.find(t => t.value === value)!;
    
    setType(newType);

    if (value === Type.Rounds) {
      setRounds(5);
    }

    if (value !== Type.Rounds) {
      setRounds(null);
    }

    if (finishCondition && !newType.possibleFinishConditions.includes(finishCondition)) {
      changeFinishCondition(newType.possibleFinishConditions[0].value);
      return;
    }
  }

  const changeFinishCondition = (value: string) => {
    const condition = [...PossibleFinishConditions, FreeFinishCondition, RoundsFinishCondition].find(c => c.value === value)!;
    setFinishCondition(condition);
  }

  const changeRounds = (value: number) => {
    setRounds(value);
  }


  const handleSubmit = () => {
    const game = Game.create({
      type: type.value,
      finishCondition: finishCondition.value,
      players,
      nRounds: rounds,
    });

    addGame(game);

    setType(PossibleTypes[0]);
    setFinishCondition(FreeFinishCondition);
    setRounds(null);

    handleClose();
    router.navigate('/game');
  };

  const handleClose = () => {
    setShowActionsheet(false);
  }


  return (
    <>
      <Box style={{justifyItems: 'center'}}>
        <Button style={{backgroundColor: '#1DB954'}} onPress={() => setShowActionsheet(true)}>
          <ButtonText>Comenzar Partida</ButtonText>
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
          <VStack className="w-full pt-5 flex-1">
            <FormControl className="mt-9 gap-5">
              <FormControlLabel>
                <FormControlLabelText>
                  Utilizar turnos basados en clasificacion
                </FormControlLabelText>
              </FormControlLabel>
              <Switch
                size="md"
                isDisabled={false}
                thumbColor={"#ECECEC"}
                activeThumbColor={"#ECECEC"}
                trackColor={{ false: "#ACACAC", true: "#1DB954" }}
                style={{width: 50}}
              />
            </FormControl>
            <FormSelectInput
              label="Tipo de partida"
              value={type.label}
              possibilities={PossibleTypes as any}
              onValueChange={changeGameType}
            />
            {type.possibleFinishConditions.length !== 1 && <FormSelectInput
              label="La partida termina"
              value={finishCondition.label}
              possibilities={type.possibleFinishConditions}
              onValueChange={changeFinishCondition}
            />}
            {type.value === Type.Rounds && <FormSelectInput
              label="Numero de rondas"
              value={(rounds!).toString()}
              possibilities={PossibleRounds}
              onValueChange={changeRounds}
            />}
          </VStack>
          <Button onPress={handleSubmit} className="mb-16">
              <ButtonText className="flex-1">Empezar Partida!</ButtonText>
            </Button>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}
