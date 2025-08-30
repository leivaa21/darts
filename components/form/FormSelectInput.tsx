import { ChevronDownIcon } from "lucide-react-native";
import { FormControl, FormControlLabel, FormControlLabelText } from "../ui/form-control";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "../ui/select";

export function FormSelectInput<T>({label, value, possibilities, onValueChange}: {
  label: string,
  value: string,
  possibilities: {
    label: string,
    value: T,
    [prop: string]: any,
  }[],
  onValueChange: (value: T) => void}
) {
  return (
    <FormControl className="mt-9 gap-2">
    <FormControlLabel>
      <FormControlLabelText>
        {label}
      </FormControlLabelText>
    </FormControlLabel>
    <Select
      selectedValue={value}
      onValueChange={(value) => onValueChange(value as T)}
    >
      <SelectTrigger>
        <SelectInput style={{flex: 1, height: 40,textAlignVertical: 'bottom'}} />
        <SelectIcon className="mr-3" as={ChevronDownIcon} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent style={{backgroundColor: '#212121', paddingBottom: 60}}>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {possibilities.map((type) => (
            <SelectItem key={type.value as string} label={type.label} value={type.value as string} disabled={type.disabled} isDisabled={type.disabled} />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  </FormControl>
  );
}