# HackTrip Frontend — CSS & Design System Audit

> **Operational source of truth for CSS, the MUI theme, UI tokens, style presets, and the visual migration.**
>
> This document continues the already-approved six-stage plan, **“HackTrip Frontend — Unified Design System and Styling Architecture.”** Do not restart the audit or create a replacement plan in future sessions. Read this document and continue from Section 11. Update the file manifest and append dated entries to the audit log as work progresses.

- Repository: `AngelGeorgievStoyanov/hacktrip-web`
- Branch: `feature/frontend-modernization`
- Audit baseline: `f77d0cff2f98298279273d0d15a27b7a236a2dd7`
- Audit date: 2026-11-18
- Scope: frontend presentation layer — `app/`, `src/components/`, `src/constants/ui/`, `src/constants/images/`, `src/theme/`, `src/styles/`.
- Do not change backend/API/business logic. Do not create branches. Do not run build, tests, lint, or CI without explicit user authorization.

---

## 1. Goal and mandatory rules

The goal is to give the entire recurring visual system a single, centralized owner. A future color redesign (for example, blue/white to charcoal/gold) should be achievable primarily by changing design tokens and the theme, not by editing dozens of feature components.

### 1.1 One visual contract for each semantic role

Components and actions with the same purpose must look and behave consistently everywhere, regardless of page or feature:

- **Back** — one shared style, size, padding, radius, hover/focus/active/disabled behavior, icon and positioning where those are part of the role.
- **Edit** — one shared visual contract for the Edit action.
- **Create / Add** — shared semantic roles; keep them separate only when their UX meaning is genuinely different.
- **Delete / Remove** — shared semantic roles; keep them separate only when their meaning is demonstrably different.
- **Save / Cancel / Confirm / Secondary / Navigation** — centrally defined roles.
- **Cards** — cards of the same role share surface color, border, radius, shadow, core content insets and interaction states. Different content or layout does not justify a different skin.
- **Panels, dialogs, tables, fields, image frames, social controls, map controls, alerts and pagination** — recurring roles must have shared contracts.

Do not make different actions identical merely because they use the same HTML or MUI element. Make actions with the same purpose consistent. An exception is allowed only when it is semantically justified and documented.

### 1.2 Forbidden end state

- Local colors, hex/rgb/rgba/gradient values, radius, shadows, typography, spacing, padding, margins, dimensions or interaction states when the value is shared or repeated.
- Feature/page/component-local visual constants when the rule belongs to a shared role.
- Different local implementations of the same Back/Edit/Delete/Add/Save action.
- Different local Card/Paper surface skins for cards of the same role.
- Inline `style={{...}}` or `sx={{...}}` for recurring visual treatment.
- Repeated CSS declarations in CSS Modules where a central token or preset should be used.
- Parallel styling systems for the same element without an explicitly documented reason.

### 1.3 What may remain local

Only genuinely unique structure or geometry that is not shared: a unique grid composition, a specific map position, a one-page layout, responsive rearrangement, or third-party integration geometry. Even then, all shared visual values must come from tokens, the theme, or presets.

CSS Modules are allowed for structural layout and page-specific responsive rules. They must not become a second repository for colors, radius, shadows, typography, or recurring component skins.

### 1.4 Do not change visual values blindly

Preserve the current blue/white design during the architecture migration. When values conflict, first identify all consumers and document current behavior. Do not choose arbitrary colors or dimensions, and do not perform a redesign without approval.

---

## 2. Approved target architecture

```text
app/
  globals.css                 # minimal reset, app shell, CSS-variable consumers

src/
  constants/
    ui/                       # colors, spacing, sizes, breakpoints, shape, shadows, typography, z-index
    images/presets.ts         # named image-rendering roles
  theme/
    index.ts                  # single MUI theme + CSS variables
    palette.ts
    shape.ts
    shadows.ts
    typography.ts
    components/
      button.ts
      card.ts
      dialog.ts
      surface.ts
      text-field.ts
  styles/presets/
    buttons.ts                # semantic action roles
    cards.ts                  # content/layout only; surface belongs to the theme
    forms.ts
    layouts.ts
    map-controls.ts
    panels.ts
    social.ts
    typography.ts
  components/                 # feature UI consumes semantic contracts
```

### One owner for every value

| Concern | Owner |
|---|---|
| Brand and semantic colors | `src/constants/ui/colors.ts` → MUI palette / CSS variables |
| Spacing and gutters | `src/constants/ui/spacing.ts` |
| Shared dimensions | `src/constants/ui/sizes.ts` |
| Breakpoints | `src/constants/ui/breakpoints.ts` |
| Radius | `src/constants/ui/shape.ts` |
| Elevation and shadows | `src/constants/ui/shadows.ts` + theme resolver |
| Typography | `src/constants/ui/typography.ts` → theme |
| Global MUI behavior | `src/theme/components/*` |
| Reusable semantic `sx` contracts | `src/styles/presets/*` |
| Named image behavior | `src/constants/images/presets.ts` + `AppImage` |
| CSS consumers | `app/globals.css` and CSS Modules using CSS variables |
| Unique layout composition | Feature component/CSS Module only when it is not reusable |

A value must not have two independent owners. If a token is needed by both CSS and MUI, define it once and expose it to CSS through a CSS variable generated by the theme.

---

## 3. Audit baseline and limitations

At baseline `f77d0cff2f98298279273d0d15a27b7a236a2dd7`, the recursive repository tree contained 274 tracked files and 246 TS/TSX/JS/JSX/CSS files under `app/` and `src/`. This audit covers the presentation layer. API clients, DTOs, validation schemas, SEO builders and server utilities are not styling migration targets unless consumer searches prove otherwise.

**Status definitions:**
- **PARTIAL** — the file was read/inspected, but its consumers, call sites, states or visual parity have not been exhaustively verified.
- **PENDING** — a dedicated inspection is still required.
- **CHANGE REQUIRED** — a concrete local or duplicated visual rule has been observed and must be migrated.
- **VERIFIED** — only after declarations, all consumers, semantic role, responsive behavior and states have been checked. No files were VERIFIED at this baseline.

This is a source-code audit, not browser screenshot or visual QA. No build, tests, lint, CI or visual regression checks have been run.

---

## 4. Confirmed architectural problems

### 4.1 Multiple parallel styling paths

Visual appearance currently comes from all of the following:

1. MUI theme and component overrides.
2. `src/styles/presets/*.ts` consumed through `sx`.
3. CSS custom properties generated by `src/theme/index.ts`.
4. `app/globals.css`, including the separate `.ht-button` skin.
5. CSS Modules.
6. Component-local `sx={{...}}`, `style={{...}}` and local style constants.
7. Direct MUI `color`/`variant`/`size` props and native HTML controls.

This allows controls with the same purpose to look different across features. The goal is not to remove MUI or CSS Modules. The goal is to establish a clear owner for every visual role and remove competing local definitions.

### 4.2 Buttons — semantic system is incomplete

Confirmed observations:

- `src/styles/presets/buttons.ts` contains primary/save alias, danger, dangerText, secondary/back alias, createTrip, tripAction, tripActionDanger and day-stepper styles.
- `BackButton.tsx` uses `BUTTON_STYLES.back`, but its public props allow callers to pass `sx`, so each call site can override the shared appearance.
- Back is currently an alias of Secondary. This describes the current implementation; it does not prove that every Back control uses it.
- Header has a local `NAV_BUTTON_SX` and direct MUI color props.
- AdminNavigation defines active/inactive colors and variants locally.
- Admin pagination uses uncustomized MUI Button defaults.
- Auth forms use primary/secondary presets inconsistently; some Back call sites override spacing.
- PointCard uses primary/danger presets, but many Edit/Delete/Save/Remove IconButtons in comments, images, profiles and admin are raw MUI IconButtons.
- ConfirmDialog uses direct MUI primary buttons.
- ReportButton has direct Cancel/Submit buttons.
- LiveTracker and TripMapSection have direct buttons.
- CSS `.ht-button` is a separate server-rendered button contract.

**Required:** define semantic roles (Back, Primary/Submit, Create, Add, Edit, Delete, Remove, Save, Cancel, Confirm, Secondary, Navigation, pagination/stepper). Create reusable components or an API that prevents arbitrary caller-level visual overrides. Inspect MUI and native/server-rendered buttons. Do not leave `.ht-button` as a parallel design system. Icon-only controls are a separate family with shared dimensions, hit area, radius, focus ring and disabled behavior.

### 4.3 Cards and surfaces — centralized ownership is partial

Confirmed observations:

- MUI Card uses `cardOverrides` and `getSurfaceStyles`: paper background, divider border, theme radius and surface shadow.
- Dialog Paper uses the same surface resolver.
- `PANEL_SX` also delegates to the same resolver.
- Other Paper elements, Box-as-card elements, native containers and CSS surfaces are not automatically covered.
- Card presets mix content spacing with trip-card geometry.
- Local Card `sx` remains in comments, trip details, trip form, point form, admin and other features.
- Sticky social and map/image overlays are separate surface roles.

**Required:** establish one base card contract (surface color, border, radius, shadow and states). Card-specific layout must be separate. TripCard and PointCard may have different content, but must not have different base skins if they are the same card role. Apply the contract to MUI Card, Paper panels and Box/native elements that function as cards. Remove local surface overrides unless there is a documented reason.

### 4.4 Fields and forms — theme contract is incomplete

- `src/theme/components/text-field.ts` sets only default variant/size; it does not define the complete application field contract.
- `forms.ts` mixes form layout presets with fixed field dimensions.
- TextFields in auth, profile, admin, points, trips, comments and maps rely on defaults or local props/`sx`.
- Map address autocomplete has separate visual treatment; it should remain a named map-specific variant, not an arbitrary local override.

**Required:** define a central field contract for default/hover/focus/error/disabled/read-only states, label, helper text, input padding/height, border, radius, typography and adornments. All standard fields must match. A map field must inherit the base contract and change only explicitly documented map-specific properties.

### 4.5 Colors and semantic tokens

Confirmed inconsistencies in `src/constants/ui/colors.ts`:

- `brand.primary` is blue (#1976d2), while `brand.primaryHover` is green (#4daf30).
- `action.danger` is literal red, `feedback.error` is #d32f2f, and `dangerHover` is #ef0a0a.
- Secondary/Create/Navigation use separate legacy colors.
- CSS variables expose only part of the semantic color map; CSS Modules still contain literals.
- MUI palette and plain CSS do not have complete parity.

**Required:** preserve current values until a coherent mapping is approved. Establish semantic tokens for brand, neutral surfaces, text, border, feedback, destructive actions, hover/focus/selected/disabled, overlays and decorative use. Expose every token needed by CSS Modules as a CSS variable generated by the theme. Do not leave repeated hex/rgb literals in feature CSS.

### 4.6 Spacing, shape, shadows, typography and breakpoints

- The spacing scale uses an 8px MUI unit, but presets/CSS also contain raw px/rem values and numeric MUI spacing.
- Shape currently has general radius 4, map input radius 5 and legal TOC radius 6. Cards with the same role must be unified.
- MUI surfaces use theme elevation; profile-image and social-overlay styles contain literal CSS shadows.
- Typography tokens reproduce MUI defaults, but About uses local Space Mono and local font sizes/weights.
- MUI breakpoints and legacy feature thresholds coexist.
- Z-index tokens exist, but raw z-index values remain in component styles.

**Required:** replace repeated raw spacing/sizes with named tokens; define semantic radius roles and one card radius; define semantic elevations; centralize typography and any editorial variant; centralize breakpoint constants and raw z-index values.

### 4.7 Images

- `IMAGE_PRESETS` centralizes named dimensions, object-fit and some preset styles.
- `AppImage` derives style only from the selected preset and does not expose an arbitrary style prop — this is the correct API direction.
- Some call sites bypass AppImage with Next Image or `component="img"` and local style objects (About, image upload previews and profile previews).
- Image frame/button/overlay behavior is split between the ImageGallery CSS Module and local `sx` in ImageGallery, ImageLightbox, ProfileImage, EditPointPage, TripForm and Admin.

**Required:** use AppImage/named image presets for shared image roles where compatible. Centralize fit, frame radius, thumbnail dimensions, preview size, lightbox controls and overlays. Inspect every AppImage and direct Image/img consumer before changing the API.

### 4.8 CSS Modules and global CSS

Confirmed local declarations:

- `app/globals.css`: app shell plus a separate `.ht-button` skin.
- `AboutPage.module.css`: Space Mono, font weights/sizes, text shadow and margins.
- `LegalPage.module.css`: page/content padding, font sizing/line-height and a Back-link skin.
- `NotFound.module.css`: Home button color/background/padding/margin.
- `Footer.module.css`: literal horizontal padding.
- `TripDetailsView.module.css`: unique grid/container geometry plus literal widths/margins that need classification.
- `TripList.module.css`: local empty-state typography/margins.
- `TripPagination.module.css`: local outer margin.
- `ImageGallery.module.css`: inspected declarations use shared spacing/shape variables; full selector/consumer verification is still required.

**Required:** preserve unique structural grid/flex/container rules; replace shared visual literals with CSS variables; migrate shared button/link/card skins to semantic components/theme; do not create new CSS Modules for shared visual values.

---

## 5. Files and required changes

### 5.1 Central tokens and theme — highest priority

| File | Confirmed state | Required action |
|---|---|---|
| `src/constants/ui/colors.ts` | Semantic colors; primary-hover/danger inconsistencies | Reconcile the semantic map after consumer inventory; do not change current values without approval |
| `src/constants/ui/spacing.ts` | 8px scale + page/route/About gutters | Tokenize repeated spacing values |
| `src/constants/ui/sizes.ts` | Small set of shared dimensions | Add only dimensions proven to recur |
| `src/constants/ui/breakpoints.ts` | MUI + legacy thresholds | Map every use; merge aliases with identical meaning |
| `src/constants/ui/shape.ts` | Radius 4/5/6 | Define semantic roles; cards of the same role must share one radius |
| `src/constants/ui/shadows.ts` | MUI elevations + literal shadows | Define semantic elevations for shared surfaces |
| `src/constants/ui/typography.ts` | MUI typography tokens | Add a named editorial role only if required |
| `src/constants/ui/z-index.ts` | App layering scale | Replace repeated raw z-index values |
| `src/constants/ui/index.ts` | Token barrel | Maintain consistent exports |
| `src/theme/index.ts` | MUI theme + CSS variables | Extend the CSS-variable bridge for all CSS Module consumers |
| `src/theme/palette.ts` | MUI palette from UI_COLORS | Keep this as the single palette mapping |
| `src/theme/shape.ts` | MUI radius | Derive from semantic shape tokens |
| `src/theme/shadows.ts` | Semantic elevation resolver | Keep one MUI elevation resolver |
| `src/theme/typography.ts` | MUI typography mapping | Keep one MUI typography mapping |
| `src/theme/components/surface.ts` | Shared Card/Panel/Dialog surface resolver | Keep one surface-skin contract |
| `src/theme/components/card.ts` | MUI Card override | Preserve; remove local surface overrides from consumers |
| `src/theme/components/dialog.ts` | Dialog Paper surface | Align dialog states |
| `src/theme/components/button.ts` | Typography/radius only | Add shared global interaction behavior |
| `src/theme/components/text-field.ts` | Defaults only | Define the complete field contract and states |
| `src/constants/images/presets.ts` | Named image roles; style/objectFit | Verify all consumers; cleanly separate frame/fit/size roles |

### 5.2 Style presets

| File | Issue | Required action |
|---|---|---|
| `src/styles/presets/buttons.ts` | Incomplete roles; Back=Secondary alias | Define semantic role API; add Edit/Add/Remove/Cancel/Confirm/Navigation/IconButton; remove misleading aliases |
| `src/styles/presets/cards.ts` | Content insets + trip-card geometry | Separate shared surface (theme-owned) from content/layout |
| `src/styles/presets/forms.ts` | Mixes layout, field dimensions and panel styles | Separate field appearance from form composition |
| `src/styles/presets/layouts.ts` | Page/list/admin layout | Preserve structural presets; tokenize spacing |
| `src/styles/presets/map-controls.ts` | Named map address-field variant | Inherit base field contract + map-specific delta |
| `src/styles/presets/panels.ts` | Delegates to shared surface | Keep only if it remains a meaningful semantic alias |
| `src/styles/presets/social.ts` | Social actions/badges/overlay/sticky surface | Separate social controls from image/map overlay surfaces; centralize metrics |
| `src/styles/presets/typography.ts` | Legacy headings/home intro | Define named text roles; remove local duplicates |

### 5.3 Global CSS and CSS Modules

| File | Local declarations | Required action |
|---|---|---|
| `app/globals.css` | App shell + independent `.ht-button` skin | Keep reset/shell; remove parallel button skin after all consumers migrate |
| `app/(public)/about/AboutPage.module.css` | Space Mono, weights/clamp sizes, margins, text shadow | Consume typography tokens/CSS variables; keep layout/responsive rules |
| `app/(public)/privacy-policy/LegalPage.module.css` | Page/content padding, typography, Back-link skin | Tokenize; Back link must use shared Back role |
| `src/components/common/NotFound.module.css` | Home button skin | Use shared CTA role; keep page layout/background |
| `src/components/images/ImageGallery.module.css` | Gallery structure; shared variables | Verify selectors/consumers; preserve structure |
| `src/components/layout/Footer.module.css` | Literal horizontal padding | Use shared page/container gutter |
| `src/components/trips/TripDetailsView.module.css` | Unique grid/container queries + literal widths/margins | Preserve geometry; tokenize repeated spacing |
| `src/components/trips/TripList.module.css` | Empty-state typography/margins | Use shared typography/spacing |
| `src/components/trips/TripPagination.module.css` | Outer margin | Use shared pagination spacing |

### 5.4 Shared/common, navigation and images

| File | Finding | Required action |
|---|---|---|
| `src/components/common/BackButton.tsx` | Back preset, but callers can override `sx` | Enforce Back role; allow layout/accessibility props only |
| `src/components/common/ConfirmDialog.tsx` | Direct MUI Confirm/Cancel buttons | Use shared Confirm/Cancel roles |
| `src/components/common/NotFound.tsx` | Native button + CSS skin | Use shared CTA role |
| `src/components/common/ExpandableText.tsx` | Direct Button + local `sx` | Use shared Expand/Collapse role |
| `src/components/common/PasswordField.tsx` | TextField + IconButton defaults | Use common field/icon-control contract |
| `src/components/common/PasswordRequirements.tsx` | Local row `sx` and conditional colors | Use feedback tokens + shared typography |
| `src/components/common/NotificationProvider.tsx` | Snackbar/Alert local width `sx` | Verify notification surface/spacing |
| `src/components/layout/Header.tsx` | Local NAV_BUTTON_SX, menu icon size, direct nav Button props | Use shared Navigation role; ensure desktop/drawer parity |
| `src/components/layout/Footer.tsx` | CSS Module consumer | Use shared footer/page gutter |
| `src/components/CustomFileUploadButton.tsx` | Raw IconButton and Button | Use shared Upload/Select and icon roles |
| `src/components/images/AppImage.tsx` | Central preset resolver; no arbitrary style prop | Preserve boundary; define a named preset for each shared image role |
| `src/components/images/ImageGallery.tsx` | CSS Module + local `sx` | Use shared image button/frame presets |
| `src/components/images/ImageLightbox.tsx` | Local overlay-control `sx` | Use shared lightbox frame/overlay/icon controls |
| `src/components/images/ImageUploadField.tsx` | Local preview geometry/radius/objectFit + raw buttons | Use image-preview preset + Remove/Upload roles |
| `src/components/auth/ProfileImage.tsx` | Local circle frame/shadow/lightbox + preview objectFit | Use shared profile frame, remove control, lightbox and preview |
| `src/components/admin/AdminUserProfileImage.tsx` | Local image button dimensions + raw Delete/Upload | Reuse profile-image/action roles |
| `src/components/admin/AdminImages.tsx` | Raw pagination/action buttons, local row/cell `sx`, dialog | Use shared pagination/table/image actions/dialog |
| `src/components/placeholders/SocialObjectPlaceholder.tsx` | Local overlay/text sizes/gradient | Use shared placeholder overlay tokens/typography |

### 5.5 Auth, profile and admin

| File | Finding | Required action |
|---|---|---|
| `src/components/auth/LoginForm.tsx` | Auth presets; raw IconButton | Normalize actions and fields |
| `src/components/auth/RegisterForm.tsx` | Auth presets; local pointerEvents `sx` | Normalize fields/actions; keep interaction-only behavior |
| `src/components/auth/ForgotPasswordForm.tsx` | Shared presets; Back caller margin override | Enforce Back role |
| `src/components/auth/ResendVerificationForm.tsx` | Same Back margin override | Enforce Back role |
| `src/components/auth/ResetPasswordForm.tsx` | Direct contained Button in success state + preset in form | Use the same semantic role in both states |
| `src/components/auth/VerifyEmailForm.tsx` | Local Card `sx`/heading weight | Use shared panel/card/typography |
| `src/components/auth/ChangePasswordForm.tsx` | Account field preset; local action spacing | Use shared field and Save/Submit |
| `src/components/auth/ProfileForm.tsx` | Local title/field `sx`; primary/secondary buttons | Use shared field/heading/action roles |
| `src/components/auth/ProfileImage.tsx` | See image findings | Use shared image/action roles |
| `src/components/auth/Captcha.tsx` | Local CAPTCHA container `sx` | Keep integration geometry; tokenize spacing |
| `src/components/admin/AdminUserForm.tsx` | Save/Danger presets but local panel/layout `sx` | Use shared form/panel/Delete |
| `src/components/admin/AdminUsers.tsx` | Local Card/CardContent layout + raw Edit/Delete/pagination | Use common card surface/action roles |
| `src/components/admin/AdminNavigation.tsx` | Local navigation layout and active/inactive styles | Use shared Navigation role |
| `src/components/admin/AdminDashboard.tsx` | Link-based admin navigation | Verify link/button role parity |
| `src/components/admin/AdminFailedLogs.tsx` | Local filter/action layout + raw pagination/delete | Use shared filter/action/pagination |
| `src/components/admin/AdminReports.tsx` | Raw destructive and pagination buttons | Use shared Delete/Resolve/Pagination |
| `src/components/admin/AdminRouteNotFoundLogs.tsx` | Local expanded-row `sx` + raw buttons | Use shared table/details/pagination |

### 5.6 Points, trips, maps and tracking

| File | Finding | Required action |
|---|---|---|
| `src/components/points/CreatePointPage.tsx` | Local page/container `sx` + central panel | Use shared page shell and form panel |
| `src/components/points/EditPointPage.tsx` | Many local `sx`, image controls/frame dimensions | Use shared point form, image frame and icon controls |
| `src/components/points/PointActions.tsx` | Local action-row layout `sx` | Use shared action row and Edit/Delete |
| `src/components/points/PointCard.tsx` | Presets + local Card `sx`/icon controls/layout | Use common Card surface; Edit/Delete/icon roles |
| `src/components/points/PointForm.tsx` | Local field/layout `sx` and stacked buttons | Use common fields and Create/Save/Cancel |
| `src/components/points/PointList.tsx` | Local list/container composition | Use shared list/empty state if repeated |
| `src/components/trips/TripActions.tsx` | Existing tripAction/tripActionDanger | Compare the same roles across all features |
| `src/components/trips/TripCard.tsx` | Presets + local responsive geometry + raw stepper buttons | Use common card surface and stepper role |
| `src/components/trips/TripDetails.tsx` | Local Card `sx`, inline NAME/LINE styles, raw icons | Use common card/content typography/actions |
| `src/components/trips/TripDetailsView.tsx` | CSS Module layout + local overlay `sx` | Preserve layout; centralize overlay |
| `src/components/trips/TripFilters.tsx` | Local select/filter style objects | Use common field/select contract |
| `src/components/trips/TripForm.tsx` | Some stepper presets, local Card/field/layout | Use common card/field/action contracts |
| `src/components/trips/EditTripLayout.tsx` | Many local `sx`, stepper and image actions | Migrate panel, fields, stepper, image actions, Save/Add/Cancel |
| `src/components/trips/TripDaysNav.tsx` | Local page-item colors/spacing | Use shared day-navigation role/states |
| `src/components/trips/TripMapSection.tsx` | Local Card + raw buttons | Use common card/map surface/actions |
| `src/components/trips/PointSection.tsx` | Local style constants, Card layout, inline style, image geometry | Use common card/content/image presets |
| `src/components/trips/PointsSection.tsx` | No style matches in initial scan | Inspect full file/imports before marking VERIFIED |
| `src/components/trips/DayImagesGallery.tsx` | Local image-wrapper geometry | Use named image-frame preset |
| `src/components/trips/TripList.tsx` | CSS Module + local heading/list style constants | Use shared empty-state typography/list |
| `src/components/trips/TripPagination.tsx` | CSS Module pagination structure | Use shared pagination role/spacing |
| `src/components/trips/TripSelectField.tsx` | TextField usage | Use common field contract |
| `src/components/maps/AddressAutocomplete.tsx` | Caller textFieldProps/`sx`/buttonSx + map preset | Enforce map variant; constrain overrides |
| `src/components/maps/GoogleMapView.tsx` | Local loading/map-container geometry | Use shared spacing; map canvas remains integration-specific |
| `src/components/maps/PointLocationPicker.tsx` | Primary/secondary presets + local container/button `sx` | Use shared map field/action/panel |
| `src/components/maps/TripLocationPicker.tsx` | Local primary color values + presets | Remove duplicate primary colors |
| `src/components/tracking/LiveTracker.tsx` | Local surface `sx` + raw Start/Stop/Reset/Follow buttons | Use shared panel and tracking action roles |

### 5.7 Comments and social

| File | Finding | Required action |
|---|---|---|
| `src/components/comments/CommentsSection.tsx` | Local COMMENTS_PANEL_SX / COMMENT_CARD_SX, local `sx`, raw Edit/Delete/Save/Cancel IconButtons | Centralize panel/comment-card surface and semantic icon/action roles |
| `src/components/comments/CommentsToggle.tsx` | Native inline layout style + local typography margin | Use shared comments-toggle role/layout |
| `src/components/comments/RepliesSection.tsx` | Local reply border/spacing, raw action IconButtons | Use shared nested-comment layout and action roles |
| `src/components/social/LikeButton.tsx` | Shared badge preset + local conditional `sx` wrapper | Centralize Like icon states |
| `src/components/social/FavoriteButton.tsx` | Shared badge preset + local conditional `sx` wrapper | Centralize Favorite icon states |
| `src/components/social/EngagementBar.tsx` | Local conditional `sx` + raw social controls | Use shared engagement layout/icon roles |
| `src/components/social/ReportButton.tsx` | Inline span styles, raw Cancel/Submit, local error `sx` | Use shared Report/Cancel/Submit/feedback roles |
| `src/components/social/TripGroupSocialActions.tsx` | Repeated raw icon controls and local error spans | Use shared Like/Favorite/Report roles |
| `src/components/social/SocialConfigStatus.tsx` | Local compact `sx` | Use shared status-indicator role |
| `src/components/social/LikeAnimation.tsx` | No style match in initial scan | Verify motion behavior separately from visual skin |

---

## 6. Approved six-stage plan — do not replace it

### Stage 1 — Full inventory and audit
- [x] Recursive repository tree inventory at baseline.
- [x] Read all nine CSS files.
- [x] Read core UI tokens, theme and presets.
- [x] Inspect primary UI component families and record observed local styles.
- [ ] Exhaustively map every CSS selector, CSS variable, token and preset to all consumers.
- [ ] Search every `sx`, `style`, inline CSS object, local style constant, direct MUI visual prop and native button/link.
- [ ] Verify imports and call sites for every shared component.
- [ ] Classify local declarations as shared visual token, semantic component skin, reusable layout preset or genuinely one-off geometry.
- [ ] Complete the manifest for all UI-bearing files. No file is VERIFIED yet.

### Stage 2 — Design Tokens + MUI Theme
- [ ] Resolve semantic color roles while preserving the current design.
- [ ] Establish spacing, sizes, breakpoints, shape, shadows, typography and z-index.
- [ ] Expose tokens as CSS variables.
- [ ] Define common card/panel/button/field states.
- [ ] Keep genuine special variants as documented deltas.

### Stage 3 — MUI Component Overrides + reusable presets
- [ ] Complete Button and IconButton contracts.
- [ ] Complete Card/Paper/Panel/Dialog surface contract.
- [ ] Complete TextField/Select/FormControl state contract.
- [ ] Add semantic action roles/components: Back/Edit/Create/Add/Delete/Remove/Save/Cancel/Confirm/Secondary/Navigation.
- [ ] Separate visual skins from layout/geometry presets.
- [ ] Ensure consistent exports/types and no duplicate owners.

### Stage 4 — CSS Modules + Global CSS
- [ ] Reduce globals to reset, shell and CSS-variable consumers.
- [ ] Remove `.ht-button` as an independent style path after all consumers have migrated.
- [ ] Replace shared literals in CSS Modules with CSS variables.
- [ ] Keep only unique structural/responsive rules in Modules.
- [ ] Check responsive breakpoints and visual states.

### Stage 5 — Systematic component migration

Migrate in this order:

1. Common primitives/app shell: Header, Footer, BackButton, ConfirmDialog, NotFound, common fields.
2. Cards, surfaces and shared images.
3. Trips: TripCard, TripDetails, TripDetailsView, TripForm, EditTripLayout, TripActions, TripFilters, TripDaysNav, TripMapSection, pagination/list.
4. Points: PointCard, PointActions, PointForm, Create/Edit pages, PointSection/list.
5. Auth/profile: all auth forms, ProfileForm, ProfileImage, upload controls.
6. Admin: navigation, users/forms, images, logs, reports, tables.
7. Social/comments: Like/Favorite/Report/Comments/Replies.
8. Maps/tracking: autocomplete, pickers, map view, LiveTracker.
9. Public pages: About, Legal, home, public trip pages, NotFound.
10. Route layouts and remaining UI consumers.

Stage 5 remains **OPEN** until every consumer has been migrated and re-verified. A file is not complete merely because it imports a preset; old local visual declarations must be removed or explicitly justified.

### Stage 6 — Final audit and validation
- [ ] Exhaustive search for raw color/spacing/radius/shadow/typography values in UI source.
- [ ] Exhaustive search for local visual constants and inline style/`sx`.
- [ ] Verify semantic button/card/field parity.
- [ ] Verify CSS Module/global variable ownership.
- [ ] Verify hover/focus/active/disabled/error/loading states and responsive breakpoints.
- [ ] Build/tests/lint/CI only after explicit user authorization.
- [ ] Browser visual regression only after explicit authorization and when the environment is available.
- [ ] Mark files VERIFIED only with evidence.

---

## 7. Mandatory search matrix

For every search, record the exact command/scope, result count and consumer paths in the audit log.

- CSS Module imports: `*.module.css`, `*.module.scss`.
- CSS selectors: every exported class name and every `styles.*` / `className` consumer.
- CSS variables: all `--ht-*` declarations and `var(--ht-*)` consumers.
- Token imports: `@/constants/ui` and every exported token usage.
- Preset imports: `@/styles/presets/*` and all property-level consumers.
- Inline styling: `sx=`, `sx={{`, `sx={(`, `style=`, `style={{`, `style={`.
- Local style constants: names containing STYLE, _SX, _STYLE, *_STYLES, plus object literals passed to `sx`/`style`.
- Visual values: hex/rgb/hsl/rgba/gradient, borderRadius, boxShadow, fontSize, fontWeight, padding, margin, gap, border, background and color.
- Buttons: Button, IconButton, ButtonGroup, native button, links styled as buttons, BackButton; semantic labels Back/Edit/Create/Add/Delete/Remove/Save/Cancel/Confirm.
- Surfaces: Card, Paper, Dialog, Accordion, Alert, and Box/native elements styled as cards/panels.
- Fields: TextField, Select, Autocomplete, InputBase, FormControl, Checkbox, Radio, Switch.
- Images: AppImage, Next Image, `component="img"`, native img, objectFit, image frame/overlay/lightbox.
- States: hover, focus-visible, focus, active, selected, disabled, error, loading, expanded, pressed.
- Responsive behavior: MUI breakpoints, media queries, container queries and responsive `sx`.

Finding imports is not enough to complete a search. Follow every result to the component and all of its call sites.

---

## 8. Explicit contracts to implement

### Buttons

Create one semantic role map and reusable API. Minimum roles:

Back, Primary/Submit, Create, Add, Edit, Save, Delete, Remove, Cancel, Confirm, Secondary, Navigation, Icon action, Pagination/stepper.

A role must not accept arbitrary caller-level colors/variants/`sx`. Allow layout-only props such as `fullWidth` or `size` only as explicit supported options.

### Cards/surfaces

Base card contract: surface color, border, radius, shadow, text contrast, padding/content spacing and interaction states. Card-specific layout is separate. TripCard and PointCard may have different compositions, but share the same base surface skin when they represent the same card role.

### Fields

Base field contract: typography, label, input height/padding, border, radius, hover/focus/error/disabled/read-only states, helper text and adornments. Map address input is a named variant that inherits the base contract.

### Images

Named roles: avatar/profile, card thumbnail, point thumbnail, gallery grid, gallery stack, upload preview, editor thumbnail, lightbox, hero/OG, About illustration. Fit, frame, radius, dimensions and overlay controls are defined once for each role.

---

## 9. Safe migration rules

1. Do not change API calls, DTOs, validation, authentication, business logic or backend behavior.
2. Do not create a branch. Work only on `feature/frontend-modernization`.
3. Do not delete an old token/preset/class before an exhaustive consumer search.
4. Do not delete a CSS Module just because it contains local styles; separate structure from skin.
5. Do not replace semantic roles with one generic button style.
6. Do not merge map/image/social overlays into the general card surface without justification.
7. Do not change current colors/dimensions without a before/after comparison and a reason.
8. Do not run build/tests/lint/CI without explicit authorization.
9. After every source change, run targeted searches for old declarations and all affected consumers.
10. After every batch, update this document and append an audit-log entry. Do not restart the audit.

---

## 10. File status manifest

Statuses are intentionally conservative. PARTIAL means inspected, not migrated/verified. PENDING means a separate inspection is still required.

### Styling foundation

| File | Status |
|---|---|
| `src/constants/ui/breakpoints.ts` | PARTIAL |
| `src/constants/ui/colors.ts` | PARTIAL |
| `src/constants/ui/index.ts` | PARTIAL |
| `src/constants/ui/shadows.ts` | PARTIAL |
| `src/constants/ui/shape.ts` | PARTIAL |
| `src/constants/ui/sizes.ts` | PARTIAL |
| `src/constants/ui/spacing.ts` | PARTIAL |
| `src/constants/ui/typography.ts` | PARTIAL |
| `src/constants/ui/z-index.ts` | PARTIAL |
| `src/constants/images/presets.ts` | PARTIAL |
| `src/theme/index.ts` | PARTIAL |
| `src/theme/palette.ts` | PARTIAL |
| `src/theme/shadows.ts` | PARTIAL |
| `src/theme/shape.ts` | PARTIAL |
| `src/theme/typography.ts` | PARTIAL |
| `src/theme/components/button.ts` | PARTIAL |
| `src/theme/components/card.ts` | PARTIAL |
| `src/theme/components/dialog.ts` | PARTIAL |
| `src/theme/components/surface.ts` | PARTIAL |
| `src/theme/components/text-field.ts` | PARTIAL |
| `src/styles/presets/buttons.ts` | PARTIAL |
| `src/styles/presets/cards.ts` | PARTIAL |
| `src/styles/presets/forms.ts` | PARTIAL |
| `src/styles/presets/layouts.ts` | PARTIAL |
| `src/styles/presets/map-controls.ts` | PARTIAL |
| `src/styles/presets/panels.ts` | PARTIAL |
| `src/styles/presets/social.ts` | PARTIAL |
| `src/styles/presets/typography.ts` | PARTIAL |

### Stylesheets

| File | Status |
|---|---|
| `app/globals.css` | CHANGE REQUIRED |
| `app/(public)/about/AboutPage.module.css` | CHANGE REQUIRED |
| `app/(public)/privacy-policy/LegalPage.module.css` | CHANGE REQUIRED |
| `src/components/common/NotFound.module.css` | CHANGE REQUIRED |
| `src/components/images/ImageGallery.module.css` | PARTIAL |
| `src/components/layout/Footer.module.css` | CHANGE REQUIRED |
| `src/components/trips/TripDetailsView.module.css` | PARTIAL |
| `src/components/trips/TripList.module.css` | CHANGE REQUIRED |
| `src/components/trips/TripPagination.module.css` | CHANGE REQUIRED |

### Shared/common, images, layout, maps and placeholders

| File | Status |
|---|---|
| `src/components/CustomFileUploadButton.tsx` | CHANGE REQUIRED |
| `src/components/common/BackButton.tsx` | CHANGE REQUIRED |
| `src/components/common/ConfirmDialog.tsx` | CHANGE REQUIRED |
| `src/components/common/ExpandableText.tsx` | PARTIAL |
| `src/components/common/NotFound.tsx` | CHANGE REQUIRED |
| `src/components/common/NotificationProvider.tsx` | PARTIAL |
| `src/components/common/PasswordField.tsx` | PARTIAL |
| `src/components/common/PasswordRequirements.tsx` | PARTIAL |
| `src/components/common/ScrambleHeading.tsx` | PARTIAL |
| `src/components/common/WelcomeHeading.tsx` | CHANGE REQUIRED |
| `src/components/home/HomeHero.tsx` | CHANGE REQUIRED |
| `src/components/home/HomeTrips.tsx` | CHANGE REQUIRED |
| `src/components/images/AppImage.tsx` | PARTIAL |
| `src/components/images/ImageGallery.tsx` | PARTIAL |
| `src/components/images/ImageLightbox.tsx` | CHANGE REQUIRED |
| `src/components/images/ImageUploadField.tsx` | CHANGE REQUIRED |
| `src/components/layout/Footer.tsx` | PARTIAL |
| `src/components/layout/Header.tsx` | CHANGE REQUIRED |
| `src/components/maps/AddressAutocomplete.tsx` | PARTIAL |
| `src/components/maps/GoogleMapView.tsx` | PARTIAL |
| `src/components/maps/PointLocationPicker.tsx` | PARTIAL |
| `src/components/maps/TripLocationPicker.tsx` | CHANGE REQUIRED |
| `src/components/placeholders/SocialObjectPlaceholder.tsx` | CHANGE REQUIRED |

### Auth and admin

| File | Status |
|---|---|
| `src/components/auth/Captcha.tsx` | PARTIAL |
| `src/components/auth/ChangePasswordForm.tsx` | PARTIAL |
| `src/components/auth/ForgotPasswordForm.tsx` | CHANGE REQUIRED |
| `src/components/auth/LoginForm.tsx` | PARTIAL |
| `src/components/auth/ProfileForm.tsx` | CHANGE REQUIRED |
| `src/components/auth/ProfileImage.tsx` | CHANGE REQUIRED |
| `src/components/auth/RegisterForm.tsx` | PARTIAL |
| `src/components/auth/ResendVerificationForm.tsx` | CHANGE REQUIRED |
| `src/components/auth/ResetPasswordForm.tsx` | CHANGE REQUIRED |
| `src/components/auth/VerifyEmailForm.tsx` | CHANGE REQUIRED |
| `src/components/admin/AdminDashboard.tsx` | PARTIAL |
| `src/components/admin/AdminFailedLogs.tsx` | CHANGE REQUIRED |
| `src/components/admin/AdminImages.tsx` | CHANGE REQUIRED |
| `src/components/admin/AdminNavigation.tsx` | CHANGE REQUIRED |
| `src/components/admin/AdminReports.tsx` | CHANGE REQUIRED |
| `src/components/admin/AdminRouteNotFoundLogs.tsx` | CHANGE REQUIRED |
| `src/components/admin/AdminUserForm.tsx` | PARTIAL |
| `src/components/admin/AdminUserProfileImage.tsx` | CHANGE REQUIRED |
| `src/components/admin/AdminUsers.tsx` | CHANGE REQUIRED |

### Comments, social, points, trips and tracking

| File | Status |
|---|---|
| `src/components/comments/CommentsSection.tsx` | CHANGE REQUIRED |
| `src/components/comments/CommentsToggle.tsx` | CHANGE REQUIRED |
| `src/components/comments/RepliesSection.tsx` | CHANGE REQUIRED |
| `src/components/points/CreatePointPage.tsx` | PARTIAL |
| `src/components/points/EditPointPage.tsx` | CHANGE REQUIRED |
| `src/components/points/PointActions.tsx` | CHANGE REQUIRED |
| `src/components/points/PointCard.tsx` | CHANGE REQUIRED |
| `src/components/points/PointForm.tsx` | CHANGE REQUIRED |
| `src/components/points/PointList.tsx` | PARTIAL |
| `src/components/social/EngagementBar.tsx` | CHANGE REQUIRED |
| `src/components/social/FavoriteButton.tsx` | PARTIAL |
| `src/components/social/LikeAnimation.tsx` | PENDING |
| `src/components/social/LikeButton.tsx` | PARTIAL |
| `src/components/social/ReportButton.tsx` | CHANGE REQUIRED |
| `src/components/social/SocialConfigStatus.tsx` | PARTIAL |
| `src/components/social/TripGroupSocialActions.tsx` | CHANGE REQUIRED |
| `src/components/tracking/LiveTracker.tsx` | CHANGE REQUIRED |
| `src/components/trips/DayImagesGallery.tsx` | PARTIAL |
| `src/components/trips/EditTripLayout.tsx` | CHANGE REQUIRED |
| `src/components/trips/PointSection.tsx` | CHANGE REQUIRED |
| `src/components/trips/PointsSection.tsx` | PENDING |
| `src/components/trips/TripActions.tsx` | PARTIAL |
| `src/components/trips/TripCard.tsx` | CHANGE REQUIRED |
| `src/components/trips/TripDaysNav.tsx` | CHANGE REQUIRED |
| `src/components/trips/TripDetails.tsx` | CHANGE REQUIRED |
| `src/components/trips/TripDetailsView.tsx` | PARTIAL |
| `src/components/trips/TripFilters.tsx` | CHANGE REQUIRED |
| `src/components/trips/TripForm.tsx` | CHANGE REQUIRED |
| `src/components/trips/TripList.tsx` | CHANGE REQUIRED |
| `src/components/trips/TripMapSection.tsx` | CHANGE REQUIRED |
| `src/components/trips/TripPagination.tsx` | PARTIAL |
| `src/components/trips/TripSelectField.tsx` | PARTIAL |

### Route/page and layout consumers

| File | Status |
|---|---|
| `app/layout.tsx` | PARTIAL |
| `app/providers.tsx` | PARTIAL |
| `app/(account)/layout.tsx` | CHANGE REQUIRED |
| `app/(admin)/layout.tsx` | CHANGE REQUIRED |
| `app/(auth)/layout.tsx` | CHANGE REQUIRED |
| `app/(public)/layout.tsx` | PARTIAL |
| `app/(account)/favorites/page.tsx` | PARTIAL |
| `app/(account)/my-trips/page.tsx` | PARTIAL |
| `app/(account)/profile/page.tsx` | PARTIAL |
| `app/(public)/about/page.tsx` | CHANGE REQUIRED |
| `app/(public)/live-tracking/page.tsx` | CHANGE REQUIRED |
| `app/(public)/page.tsx` | PARTIAL |
| `app/(public)/trips/[id]/page.tsx` | PARTIAL |
| `app/(public)/trips/page.tsx` | PARTIAL |

Page wrappers without visual declarations are not automatically migration targets. Their imported components are the actual styling consumers. Remaining route files need a confirmation pass for imported UI and overlooked local styles before being marked VERIFIED.

---

## 11. Current status and exact next task

### Current stage

**Stage 1 — Full inventory and audit: IN PROGRESS.**

### Confirmed work completed

- All nine CSS files have been read.
- UI token files, image presets, the MUI theme and all eight shared style-preset files have been read.
- The main component families have been inspected: common controls, images, auth/profile, admin, comments/social, points, trips, maps and tracking.
- Concrete migration targets are recorded in Section 5 and file statuses in Section 10.
- The primary issue has been identified: MUI Theme + presets + global CSS + CSS Modules + local `sx`/`style` coexist without a complete semantic ownership contract.

### Not completed — do not claim otherwise

- Exhaustive tracing of every CSS variable/token/preset export to all consumers.
- Full reading of all remaining UI files among the 246 files under app/src.
- Full call-site verification for every shared component.
- Browser/visual verification of all roles and states.
- No application source migration was performed in this audit batch.
- No build/tests/lint/CI were run.

### Instructions for the next AI/developer — execute this, do not create a new plan

1. Read this document first.
2. Confirm the branch and HEAD; do not create a branch.
3. Compare current HEAD with the audit baseline; inspect only files changed since the baseline and explicitly PENDING files.
4. Complete Stage 1 consumer mapping using the search matrix in Section 7. Start with semantic button consumers, then card/surface, fields, image roles, CSS variables and preset exports.
5. Update the manifest and append a dated log entry with exact paths, search results and discoveries.
6. Once Stage 1 is complete, proceed to Stage 2 and Stage 3; do not wait for another prompt to invent a plan.
7. Migrate in the order specified in Stage 5. Update exact file statuses and the next task after every batch.
8. Do not re-audit unchanged files merely for context. Use this document and Git diff.

**NEXT TASK — continue the semantic action consumer inventory (Stage 1):**

- Continue scanning every UI-bearing TSX/TS/JS/JSX file not yet inspected on the current branch, including all direct MUI Button/IconButton, native button, action-like links, and CSS-backed action controls.
- Complete the BackButton and `BUTTON_STYLES.*` import/call-site list, then verify each shared component's full caller set.
- Extend the role matrix below with exact file paths and call-site line numbers; distinguish semantic role from component implementation.
- Do not migrate source code until the action inventory is exhaustive and recorded.


### 2026-11-18 — Stage 1 action/button inventory, first inspection batch

- Re-read this audit document before continuing. Confirmed branch: `feature/frontend-modernization`.
- Confirmed branch HEAD: `8ca0a5c9aa010d792056a64903ffdf05900e690b`. Compared against audit baseline `f77d0cff2f98298279273d0d15a27b7a236a2dd7`: branch is ahead by 3 commits, with no divergence reported. The three commits are documentation-only (audit creation, architecture link, English translation); no application-source changes exist after the recorded baseline.
- Confirmed `docs/ARCHITECTURE.md` links to `docs/CSS_DESIGN_SYSTEM_AUDIT.md`.
- Re-read the actual current-branch source for the shared BackButton, button presets, Header, AdminNavigation, TripActions, PointActions, ConfirmDialog, TripCard, TripDetails, TripMapSection, PointCard, EditPointPage, EditTripLayout, LoginForm, ProfileForm, RegisterForm, ForgotPasswordForm, ChangePasswordForm, ResendVerificationForm, ResetPasswordForm, VerifyEmailForm, AdminUserForm, AdminUsers, AdminReports, AdminImages, AdminFailedLogs, AdminRouteNotFoundLogs, AdminUserProfileImage, CommentsSection, RepliesSection, CommentsToggle, ReportButton, TripGroupSocialActions, EngagementBar, LikeButton, FavoriteButton, TripForm, TripFilters, TripDaysNav, TripPagination, LiveTracker, TripLocationPicker, PointLocationPicker, ImageUploadField, ImageGallery, ImageLightbox, ProfileImage, DayImagesGallery, PointsSection, CustomFileUploadButton, NotFound and the Legal page stylesheet.
- This is a first consumer-mapping batch, **not an exhaustive Stage 1 completion**. Several remaining UI files and all CSS action-link consumers still need inspection. No source code was changed. No build, tests, lint, CI or browser checks were run.

#### Action-role evidence matrix (observed call sites only; not yet exhaustive)

| Semantic role / family | Observed file and call site | Current implementation / issue |
|---|---|---|
| Back | `app/(public)/privacy-policy/page.tsx:326` (native anchor with `.legalPageBack` skin); `src/components/trips/TripDetails.tsx:223`; `src/components/trips/EditTripLayout.tsx:492`; `src/components/auth/ProfileForm.tsx:126`; `src/components/auth/ForgotPasswordForm.tsx:91`; `src/components/auth/ResendVerificationForm.tsx:91`; `src/components/auth/ResetPasswordForm.tsx:133`; `src/components/trips/TripForm.tsx:605`; `src/components/admin/AdminUserForm.tsx:327` | Uses shared `BackButton`. Component still accepts caller `sx`; current implementation places caller `sx` before `BUTTON_STYLES.back`, so shared preset wins for overlapping style keys, but arbitrary `style`, `className` and other props have not been contractually restricted. Back is an alias of Secondary. |
| Primary / Submit / Save | `src/components/points/PointCard.tsx:89-101`; `src/components/auth/LoginForm.tsx:132-153`; `src/components/auth/RegisterForm.tsx:215-234`; `src/components/auth/ChangePasswordForm.tsx:129-134`; `src/components/auth/ForgotPasswordForm.tsx:81-86`; `src/components/auth/ResendVerificationForm.tsx:81-86`; `src/components/auth/ResetPasswordForm.tsx:123-128`; `src/components/auth/VerifyEmailForm.tsx:85-88`; `src/components/auth/ProfileForm.tsx:117-122`; `src/components/trips/TripForm.tsx:574-590`; `src/components/admin/AdminUserForm.tsx:306` | Uses a mixture of `BUTTON_STYLES.primary`, `save` alias, direct contained Button defaults and inline composition. Submit/Save are not yet verified as a consistent semantic role. |
| Edit | `src/components/points/PointCard.tsx:89-93`; `src/components/trips/TripActions.tsx: EDIT DAY action`; `src/components/admin/AdminUsers.tsx:169` | PointCard uses generic primary preset; trip/admin edit navigation uses direct Button defaults. No dedicated Edit role exists in the preset API. |
| Delete / destructive | `src/components/points/PointCard.tsx:97-101`; `src/components/trips/TripActions.tsx: DELETE DAY / DELETE TRIP`; `src/components/admin/AdminUserForm.tsx:312-313` | Uses generic `danger`, `tripActionDanger`, `dangerText` or direct controls. No unified Delete semantic component/API. |
| Add / Create | `src/components/trips/TripActions.tsx: ADD NEXT DAY TRIP / ADD OR EDIT POINTS`; `src/components/comments/CommentsSection.tsx:493`; `src/components/home/*` (no Button found in HomeHero/HomeTrips) | Mix of trip-specific action preset, icon-only Add comment and other controls. No general Add role. |
| Cancel | `src/components/comments/CommentsSection.tsx:286-288`; `src/components/comments/RepliesSection.tsx:179-181`; `src/components/social/ReportButton.tsx:117`; `src/components/common/ConfirmDialog.tsx: No action` | Direct IconButton/Button or default MUI treatment; not consistently assigned a shared Cancel role. |
| Confirm | `src/components/common/ConfirmDialog.tsx: Button actions` | Both No and Yes currently use identical direct `contained primary` props; semantic Cancel/Confirm distinction is missing. |
| Secondary | `src/components/auth/LoginForm.tsx:142`; `src/components/auth/RegisterForm.tsx` (secondary preset alias); `src/components/auth/ProfileForm.tsx:131`; `src/components/trips/TripForm.tsx:601`; map pickers | Preset exists, but it is also reused as Back; some map/admin/navigation controls use direct MUI variants. |
| Navigation | `src/components/layout/Header.tsx` (`NAV_BUTTON_SX`, direct Button props, Welcome/profile link); `src/components/admin/AdminNavigation.tsx` (active/inactive direct variant/color); `src/components/trips/TripActions.tsx` | Header and AdminNavigation implement separate local navigation treatments; trip actions have a separate trip-specific treatment. |
| Pagination | `src/components/admin/AdminUsers.tsx:205-211`; `src/components/admin/AdminReports.tsx:113-119`; `src/components/admin/AdminImages.tsx:72-76,103,142-146`; `src/components/admin/AdminFailedLogs.tsx:143-149`; `src/components/admin/AdminRouteNotFoundLogs.tsx:158-164` | Direct MUI Button defaults are repeated. TripPagination/TripFilters/TripDaysNav did not expose direct Button matches in the inspected source. |
| Day stepper | `src/components/trips/TripForm.tsx:405-418` | Uses shared `dayDecrement`/`dayIncrement` preset names, currently aliases to one `dayNumberButton` style. |
| Icon-only actions | `src/components/common/PasswordField.tsx:43` (show/hide password); `src/components/comments/CommentsSection.tsx:276-288,365-382,410,475-493`; `src/components/comments/RepliesSection.tsx:169-181,225-242,289-302`; `src/components/social/LikeButton.tsx:81`; `FavoriteButton.tsx:63`; `EngagementBar.tsx:169`; `TripGroupSocialActions.tsx:111,140,164,191`; `ImageUploadField.tsx:277-296`; `ProfileImage.tsx:150,256-257`; `ImageLightbox.tsx:76,98,112`; `EditPointPage.tsx:222-223`; `AdminImages.tsx:372`; `CustomFileUploadButton.tsx:35` | Raw IconButtons represent several distinct roles (edit/delete/save/cancel/like/favorite/report/remove/close/zoom/navigation). Need a separate shared icon-action family with semantic variants and consistent hit area/focus/disabled states. |
| Native action button | `src/components/common/NotFound.tsx:50-53` | Native `button` styled by `NotFound.module.css`; separate from MUI Button presets. |
| File upload action | `src/components/CustomFileUploadButton.tsx:58`; `src/components/images/ImageUploadField.tsx:307` | Button-as-label / upload controls require a named Upload role, not arbitrary primary styling. |
| Stepper internals | `src/components/trips/TripCard.tsx:259-265`; `src/components/trips/TripMapSection.tsx` Stepper `backButton` slot | MUI Stepper navigation buttons are separate controls and need explicit contract/ownership review. |

#### Additional consumer inspection — second batch

The following additional current-branch files were read specifically for action consumers:

- `src/components/trips/TripList.tsx`, `src/components/points/PointList.tsx`, `src/components/trips/TripSelectField.tsx`, `src/components/maps/GoogleMapView.tsx`, `src/components/common/PasswordRequirements.tsx`, `src/components/common/ScrambleHeading.tsx`, `src/components/auth/Captcha.tsx`, `src/components/auth/GuestOnly.tsx`, `src/components/auth/RequireAuth.tsx`, `src/components/auth/RequireRole.tsx`, `src/components/trips/TripDetailsView.tsx`, `src/components/layout/Footer.tsx`, `src/components/placeholders/SocialObjectPlaceholder.tsx`, `app/(account)/layout.tsx`, `app/(admin)/layout.tsx`, `app/(auth)/layout.tsx`, `app/(public)/layout.tsx`, `app/(public)/about/page.tsx`, `app/(public)/privacy-policy/page.tsx`, `src/components/maps/AddressAutocomplete.tsx`, `src/components/common/ExpandableText.tsx`, `src/components/common/PasswordField.tsx` and `src/components/common/NotificationProvider.tsx`.
- `AddressAutocomplete.tsx:153` contains a direct MUI search Button. This is a map-search action and must be classified as a named map/search variant inheriting the shared base button contract.
- `ExpandableText.tsx:54` contains a direct MUI disclosure Button (Show more/Show less). Treat this as a disclosure/text-toggle role, not automatically as Primary or Secondary.
- `PasswordField.tsx:43` contains a raw IconButton for reveal/hide password; classify as a field-adornment icon action.
- `privacy-policy/page.tsx:326` contains a native Back anchor with `.legalPageBack` CSS skin. This is a separate implementation of the Back role and must eventually consume the shared Back contract.
- The account/admin/auth/public route layouts, Footer, TripList, PointList, TripSelectField, GoogleMapView, PasswordRequirements, ScrambleHeading, Captcha, auth guards, TripDetailsView and SocialObjectPlaceholder had no direct Button/IconButton/native button match in the scanned source. This does not rule out nested imported action consumers.
- `about/page.tsx` and `privacy-policy/page.tsx` contain ordinary mailto, table-of-contents and in-page navigation anchors; these are not action buttons. The privacy Back anchor is the exception above.

#### Confirmed design-system gaps from this batch

1. `BUTTON_STYLES.back` is currently the same object as `secondary`; the code does not yet express Back as an independent semantic role.
2. `BackButtonProps` omits only `variant` and `color`; callers can supply `sx` and the component spreads the rest of ButtonProps. The role contract is therefore not enforced at the type/API boundary.
3. `BUTTON_STYLES` has no dedicated `edit`, `add`, `remove`, `cancel`, `confirm`, `navigation`, `pagination` or general `iconAction` roles.
4. `ConfirmDialog` styles No and Yes identically as contained primary actions.
5. Header navigation uses local `NAV_BUTTON_SX`; AdminNavigation has direct active/inactive variant and color decisions.
6. Admin pagination repeats direct MUI Buttons with defaults in five separate components.
7. Comment/reply actions and image/profile actions use raw IconButtons for multiple semantic roles; social action buttons are not the same family as edit/delete controls.
8. NotFound still uses a native button with a CSS Module skin.
9. Upload buttons are another semantic family not yet represented in the central role API.
10. The current action inventory is incomplete; do not begin migration or mark any affected file VERIFIED based on this batch.

#### CSS-backed action and clickable-element scan — first pass

The following current-branch stylesheets were read again for action-like selectors and independent button skins:

- `app/globals.css`: `.ht-button` defines a second contained-button visual contract (display, padding, border/radius, background, text, typography, cursor and hover); `.ht-button--danger:hover` adds a destructive hover treatment. The complete consumer set is **not yet traced**. Do not remove these selectors until every `ht-button` / `ht-button--danger` use is located and migrated.
- `src/components/common/NotFound.module.css`: `.homeButton` is a native Home CTA skin; `NotFound.tsx:50-53` consumes it. It must ultimately use the shared semantic action API.
- `app/(public)/privacy-policy/LegalPage.module.css`: `.legalPageBack` is a CSS-styled Back link; `app/(public)/privacy-policy/page.tsx:326` consumes it. This duplicates the BackButton role and must be migrated to the shared Back contract.
- `src/components/images/ImageGallery.module.css`: `.imageButton` / `.gridImageButton` reset and style a clickable image surface, consumed by `ImageGallery.tsx:80`. This is a gallery-image interaction, not a generic CTA; it should use the shared icon/control reset, focus-visible and hit-target contract while retaining gallery-specific geometry.
- `app/(public)/about/AboutPage.module.css`: anchors are ordinary content links, not button-like controls.
- `src/components/layout/Footer.module.css`, `src/components/trips/TripList.module.css`, `src/components/trips/TripPagination.module.css` and `src/components/trips/TripDetailsView.module.css`: no dedicated action-button selector was found in the inspected stylesheet source.
- The `.ht-button` consumer search is still pending. The five server/public trip-related files inspected in this pass (`app/(public)/trips/[id]/page.tsx`, `src/lib/images/renderTripOgImage.tsx`, `src/seo/modules/trip/buildContent.ts`, `src/lib/share.ts`, `src/components/trips/TripDetailsView.module.css`) did not expose a direct `ht-button` match; that is not proof that no other consumer exists.

#### NEXT TASK

Continue Stage 1: finish the repository-wide consumer search for BackButton, BUTTON_STYLES, Button, IconButton, native button, action-like anchors and especially `.ht-button` / `.ht-button--danger`. Trace every CSS selector to all consumers, inspect the remaining UI-bearing files, verify every shared component caller, and record exact paths/call sites before proposing the semantic component API.


---

## 12. Audit log (append-only)

### 2026-11-18 — Dedicated CSS & Design System audit document created

- Branch: `feature/frontend-modernization`
- Baseline HEAD: `f77d0cff2f98298279273d0d15a27b7a236a2dd7`
- Stage: 1 — Full inventory and audit.
- This dedicated operational document was created to preserve audit findings, file targets, statuses and handoff instructions between sessions.
- Confirmed recursive tree: 274 tracked files total; 246 TS/TSX/JS/JSX/CSS files under `app/` and `src/`.
- All nine CSS files, the UI token/theme/image-preset foundation and all eight shared style-preset files were read.
- The main UI component families were inspected; local styles and migration targets are recorded in Section 5. The manifest is in Section 10.
- Source-level audit only. No application source files were changed. No build, tests, lint, CI or browser visual verification was run.
- No files are VERIFIED. Stage 1 remains OPEN until the consumer search matrix and remaining UI-file review are complete.
- Next task: complete the semantic action/button consumer matrix in Section 11, then card/surface and field/image consumer mapping.

### 2026-11-18 — Action/button consumer mapping batch recorded

- Reconfirmed branch HEAD `8ca0a5c9aa010d792056a64903ffdf05900e690b` and the three-commit documentation-only delta from the audit baseline.
- Inspected the first batch of current-branch action consumers and recorded the observed semantic-role matrix, exact call sites, design-system gaps and remaining NEXT TASK in Section 11.
- Stage 1 remains IN PROGRESS. The action consumer inventory is not exhaustive; no application source changes were made and no tests/build/lint/CI were run.

### 2026-11-18 — Action/button consumer mapping, second inspection batch

- Read the additional common, auth, maps, trips, points, layout, route-layout and public-page files listed in Section 11.
- Added the legal-page native Back anchor, map-search Button, ExpandableText disclosure Button and PasswordField reveal/hide IconButton to the role analysis.
- No source files changed. Stage 1 remains IN PROGRESS; the complete repository-wide action inventory and CSS action-link scan are still pending.

### 2026-11-18 — CSS-backed action scan, first pass

- Re-read the current global stylesheet and all CSS Modules listed in the baseline stylesheet inventory, including TripDetailsView.module.css.
- Recorded the independent `.ht-button` contract, NotFound Home CTA, legal Back link and clickable ImageGallery surface, including their known consumers and outstanding consumer-tracing requirements.
- Stage 1 remains IN PROGRESS. No source changes and no validation commands were run.
