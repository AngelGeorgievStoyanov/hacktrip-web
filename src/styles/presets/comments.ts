import { ICON_ACTION_STYLES } from '@/styles/presets/buttons';
import { SOCIAL_ACTIONS_SX } from '@/styles/presets/social';
import { UI_SHAPE } from '@/constants/ui/shape';

/** Comments section and responsive list/card composition. */
export const COMMENTS_PANEL_SX = {
  borderRadius: UI_SHAPE.socialCardRadiusPx,
  display: 'flex',
  flexDirection: 'column',
  margin: '20px 0',
  padding: '25px',
} as const;
export const COMMENTS_TITLE_SX = { marginBottom: '10px' } as const;
export const COMMENT_LIST_SX = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
  gap: '20px',
  alignItems: 'start',
  listStyle: 'none',
  padding: 0,
  margin: 0,
} as const;
export const COMMENT_CARD_SX = {
  borderRadius: UI_SHAPE.socialCardRadiusPx,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  height: 'fit-content',
  padding: '30px',
} as const;
export const COMMENT_EDIT_FORM_SX = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  width: '100%',
} as const;
export const COMMENT_EDIT_ACTIONS_SX = {
  display: 'flex',
  gap: 1,
  flexWrap: 'wrap',
} as const;
export const COMMENT_AUTHOR_ROW_SX = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  marginBottom: '8px',
} as const;
export const COMMENT_AUTHOR_AVATAR_SX = {
  backgroundColor: 'primary.main',
  width: 40,
  height: 40,
} as const;
export const COMMENT_AUTHOR_NAME_SX = { fontWeight: 500 } as const;
export const COMMENT_BODY_SX = {
  margin: 0,
  padding: '5px',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
} as const;
export const COMMENT_TIMESTAMP_SX = { marginTop: '8px' } as const;
export const COMMENT_SOCIAL_ACTIONS_SX = { ...SOCIAL_ACTIONS_SX, marginTop: '10px' } as const;
export const COMMENT_CREATE_FORM_SX = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  marginTop: '10px',
} as const;
export const COMMENT_CREATE_ACTION_ROW_SX = {
  display: 'flex',
  justifyContent: 'flex-start',
  marginTop: '10px',
} as const;
export const COMMENT_ANONYMOUS_HINT_SX = { marginTop: '10px' } as const;

/** Reply item, edit form, action row and input contracts. */
export const REPLY_ITEM_SX = {
  borderLeft: '2px solid',
  borderColor: 'divider',
  pl: 2,
  py: 1,
  mt: 1,
} as const;
export const REPLY_EDIT_FORM_SX = {
  display: 'flex',
  gap: 1,
  flexWrap: 'wrap',
  mt: 1,
} as const;
export const REPLY_BODY_SX = {
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
} as const;
export const REPLY_SOCIAL_ACTIONS_SX = { ...SOCIAL_ACTIONS_SX, mt: 1 } as const;
export const REPLIES_SECTION_SX = { mt: 1, pl: 2 } as const;
export const REPLY_CREATE_FORM_SX = {
  display: 'flex',
  gap: 1,
  alignItems: 'flex-start',
  mt: 1,
} as const;
export const REPLY_CANCEL_ACTION_SX = ICON_ACTION_STYLES.base;

/** Comment toggle alignment and empty-state label spacing. */
export const COMMENTS_TOGGLE_ROW_SX = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
} as const;
export const COMMENTS_TOGGLE_EMPTY_LABEL_SX = { margin: '5px' } as const;
