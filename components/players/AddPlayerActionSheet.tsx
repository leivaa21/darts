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
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { Player } from '@/contexts/players/domain/Player';
import { PersonStandingIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Box } from '../ui/box';
import { Text } from '../ui/text';

export function AddPlayerActionSheet({addPlayer, players}: {players: Player[], addPlayer: (player: Player) => void}) {
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const formatedName = name.trim();
    if (formatedName.length === 0) return;
    if (players.find(p => p.name.toLowerCase() === formatedName.toLowerCase())) {
      setError('Ya existe un jugador con ese nombre');
      return;
    }; 

    const player = Player.create({ name });
    setName('');
    setError('');
    addPlayer(player);
    handleClose();
  };

  const handleClose = () => {
    setShowActionsheet(false);
  }


  return (
    <>
      <Box style={{justifyItems: 'center'}}>
        <Button style={{backgroundColor: '#ECECEC'}} onPress={() => setShowActionsheet(true)}>
          <ButtonText>Añadir jugador</ButtonText>
        </Button>
      </Box>
      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        snapPoints={[60]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full pt-5">
            <FormControl className="mt-9">
              <FormControlLabel>
                <FormControlLabelText>
                  Nombre del jugador
                </FormControlLabelText>
              </FormControlLabel>
              <Input className="w-full">
                <InputSlot>
                  <InputIcon as={PersonStandingIcon} className="ml-2" />
                </InputSlot>
                <InputField placeholder="Fulanito" value={name} onChangeText={(text: string) => {
                  setName(text);
                  if (error) setError('');
                }}/>
              </Input>
              <Button onPress={handleSubmit} className="mt-3" disabled={error !== ''}>
                <ButtonText className="flex-1">Añadir</ButtonText>
              </Button>
              {error !== '' && (
                <Box style={{marginTop: 10}}>
                  <Text style={{color: '#D11919'}}>{error}</Text>
                </Box>
              )}
            </FormControl>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}
