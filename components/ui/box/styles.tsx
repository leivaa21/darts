import { isWeb } from '@gluestack-ui/nativewind-utils/IsWeb';
import { tva } from '@gluestack-ui/nativewind-utils/tva';

const baseStyle = isWeb
  ? ''
  : '';

export const boxStyle = tva({
  base: baseStyle,
});
