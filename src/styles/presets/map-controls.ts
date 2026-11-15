import { UI_COLORS } from '@/constants/ui/colors';
import { UI_SHAPE } from '@/constants/ui/shape';

/** Shared visual treatment for address autocomplete fields in map pickers. */
export const MAP_ADDRESS_INPUT_SX = {
  backgroundColor: UI_COLORS.map.addressBackground,
  borderRadius: UI_SHAPE.mapAddressInputRadius,
  '& .MuiInputBase-root': { color: UI_COLORS.map.addressText },
  '& .MuiInputLabel-root': { color: UI_COLORS.map.addressLabel },
  '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: UI_COLORS.map.addressBorder,
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: UI_COLORS.map.addressBorderHover,
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'primary.main',
  },
} as const;
