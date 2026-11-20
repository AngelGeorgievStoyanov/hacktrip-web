'use client';

import { Box, Typography } from '@mui/material';
import { PasswordRequirementMetIcon, PasswordRequirementUnmetIcon } from '@/constants/icons';
import { getPasswordRequirements } from '@/validations/shared';
import {
  PASSWORD_REQUIREMENTS_LIST_SX,
  PASSWORD_REQUIREMENT_ITEM_SX,
  PASSWORD_REQUIREMENT_INVALID_ICON_SX,
} from '@/styles/presets/forms';

interface PasswordRequirementsProps {
  password: string;
  minLength?: number;
  maxLength?: number;
}

export function PasswordRequirements({
  password,
  minLength = 8,
  maxLength = 72,
}: PasswordRequirementsProps) {
  const requirements = getPasswordRequirements(password, minLength, maxLength);

  return (
    <Box
      component="ul"
      aria-label="Password requirements"
      sx={PASSWORD_REQUIREMENTS_LIST_SX}
    >
      {requirements.map((requirement) => (
        <Box
          component="li"
          key={requirement.key}
          sx={PASSWORD_REQUIREMENT_ITEM_SX}
        >
          {requirement.valid ? (
            <PasswordRequirementMetIcon fontSize="small" color="success" />
          ) : (
            <PasswordRequirementUnmetIcon fontSize="small" sx={PASSWORD_REQUIREMENT_INVALID_ICON_SX} />
          )}
          <Typography
            variant="caption"
            color={requirement.valid ? 'success.main' : 'text.secondary'}
          >
            {requirement.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
