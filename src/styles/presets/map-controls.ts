import { COLORS } from '@/constants/ui/colors';
import { UI_SHAPE } from '@/constants/ui/shape';

/** Shared visual treatment for address autocomplete fields in map pickers. */
export const MAP_ADDRESS_INPUT_SX = {
  backgroundColor: COLORS.mapAddressInputBackground,
  borderRadius: UI_SHAPE.mapAddressInputRadius,
  '& .MuiInputBase-root': { color: COLORS.mapAddressInputText },
  '& .MuiInputLabel-root': { color: COLORS.mapAddressInputLabel },
  '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: COLORS.mapAddressInputBorder,
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: COLORS.mapAddressInputBorderHover,
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'primary.main',
  },
} as const;
