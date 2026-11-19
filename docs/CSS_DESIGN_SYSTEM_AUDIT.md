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

### 1.4 Styling API policy — mandatory project standard

Use a deliberately restricted styling API so the repository has one visual source of truth. The objective is not to ban CSS or MUI styling tools; it is to prevent feature components from inventing or duplicating visual rules.

| Mechanism | Allowed responsibility | Mandatory constraints |
|---|---|---|
| Design tokens / CSS custom properties | Shared colors, spacing, dimensions, radius, shadows, typography, breakpoints and layering | Define each shared value once. Expose values needed by CSS through theme-generated CSS variables. |
| MUI Theme and component overrides | Global defaults and shared states for MUI components | Own the baseline appearance and interaction states for each standard MUI component family. |
| Shared components and named presets | Semantic roles such as Back, Edit, Save, Delete, Card, Field and IconAction | Feature components select a role; they do not redefine its visual contract. |
| MUI sx | Styling MUI components when a shared component is not appropriate | Consume named presets, theme values or tokens only. Do not author local visual literals or repeat shared declarations in inline sx objects. Prefer a shared component/preset when the same treatment recurs. |
| CSS Modules / className | Unique structure and composition: grid/flex geometry, page-specific positioning, responsive rearrangement and component-specific layout | Shared visual values must come from tokens/CSS variables. Do not create local skins for recurring buttons, cards, fields or other shared roles. |
| React style prop | NOT part of the approved styling API | Do not use the React style prop for visual styling, including one-off colors, spacing, dimensions, typography, borders, shadows or states. Use tokens/theme/presets, sx under the constraints above, or CSS Modules for structure. |
| Dynamic visual values | Values that genuinely depend on runtime data | Prefer semantic state classes, data attributes, CSS variables set through an approved shared abstraction, or component variants. A direct React style prop is not an acceptable shortcut. Any exceptional need must be documented and approved before use. |

#### Non-negotiable implementation rules

1. **Do not use React style props for presentation.** Remove existing uses during the relevant migration batch after checking their behavior and consumers. Do not introduce new ones.
2. **Do not write ad hoc visual objects in sx.** This includes inline sx objects containing local colors, spacing, dimensions, radius, shadows, typography or interaction-state declarations.
3. **Use sx as a consumer, not an owner.** Allowed examples include a named button preset, a card-content preset, or a theme/token reference where appropriate. The referenced preset/token must itself have a central owner.
4. **Use className with CSS Modules for structure, not duplicated design.** A CSS Module may define a unique grid or responsive layout; its shared visual values must reference central CSS variables.
5. **Prefer semantic shared components for recurring patterns.** If the same role appears more than once, give it one shared component or named preset rather than repeating equivalent sx or CSS declarations.
6. **Do not ban CSS Modules, className, or sx globally.** They remain valid tools within their responsibilities above.
7. **Exceptions are exceptional.** If a third-party API or a genuinely runtime-only rendering constraint appears to require an inline style, document the exact file, reason, alternative analysis and approval. Do not silently weaken the rule.

When auditing, search for React style props and inline sx objects separately. Classify each occurrence as a migration target, structural/runtime case, or documented exception. Do not mark the styling API migration complete until all occurrences and their consumers have been checked.

### 1.5 Do not change visual values blindly

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
| `src/theme/index.ts` | Central MUI theme composes palette, typography, shape, spacing, z-index, CSS variables and component overrides. | MuiCard, MuiDialog and MuiPaper outlined variants now share surface owners; Drawer elevation remains unaffected. | MIGRATED — surface theme registration complete for current consumers. |
| `src/theme/palette.ts` | MUI palette from UI_COLORS | Keep this as the single palette mapping |
| `src/theme/shape.ts` | MUI radius | Derive from semantic shape tokens |
| `src/theme/shadows.ts` | Semantic elevation resolver | Keep one MUI elevation resolver |
| `src/theme/typography.ts` | MUI typography mapping | Keep one MUI typography mapping |
| `src/theme/components/surface.ts` | Shared elevated surface resolver for Card/Dialog/Panel. | Also exports the outlined, non-elevated Paper surface contract; both variants derive background, divider, radius and shadow behavior from the active MUI theme. | MIGRATED — one shared owner for elevated and outlined application surfaces. |
| `src/theme/components/card.ts` | All MUI Cards receive getSurfaceStyles from the theme: paper background, divider border, theme radius and semantic surface shadow. | Card consumers use theme surface; component sx is reserved for geometry/content layout. | MIGRATED — global Card skin is centralized. |
| `src/theme/components/dialog.ts` | MUI Dialog Paper receives getSurfaceStyles from the shared surface owner. | ImageLightbox and ConfirmDialog use the same Dialog surface; ImageLightbox's imageLightbox background remains an explicit semantic variant. | MIGRATED — shared Dialog surface with documented image-lightbox variant. |
| `src/theme/components/paper.ts` | MUI Paper outlined variant override | Apply shared outlined surface skin to bordered Paper containers; preserve elevated Drawer Paper behavior. |
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
| `app/globals.css` | Reset and `.app-shell` use structural global CSS; `.ht-button` and danger hover remain a parallel native/server-rendered button skin consuming selected `--ht-*` variables. | Keep reset/shell only; retain `.ht-button` until every server-rendered consumer and template is exhaustively traced, then migrate to the shared semantic action contract. | PARTIAL — legacy global skin still exists. |
| `app/(public)/about/AboutPage.module.css` | Space Mono, weights/clamp sizes, margins, text shadow | Consume typography tokens/CSS variables; keep layout/responsive rules |
| `app/(public)/privacy-policy/LegalPage.module.css` | Page/content padding, typography, Back-link skin | Tokenize; Back link must use shared Back role |
| `src/components/common/NotFound.module.css` | Unique full-viewport 404 hero/background and centered content composition. | Background/text/action colors consume CSS variables; the native Home CTA keeps its contrast-on-hero role and unique padding/margin, not a generic primary button skin. | MIGRATED — structural/page-specific styling is scoped and token-backed. |
| `src/components/images/ImageGallery.module.css` | Gallery structure; shared variables | Verify selectors/consumers; preserve structure |
| `src/components/layout/Footer.module.css` | Footer structure and typography are CSS Module-owned. | Horizontal padding now consumes `--ht-spacing-footer-horizontal` emitted from UI_SIZES; primary/inverse colors remain CSS-variable-owned. | MIGRATED — recurring spacing/color values centralized. |
| `src/components/trips/TripDetailsView.module.css` | Unique responsive grid/flex, container-query rearrangement and component-specific positioning. | Retained as the structural owner for 1200px shell, 320–450px / 600px / 500px grid tracks, 1120px container-query stacking/order and 600px responsive gaps. The 20px TripDetails card margins are page-specific parent placement, not a reusable visual skin; shared spacing/gutters continue to use `--ht-spacing-*` and page tokens where applicable. | STRUCTURAL — intentional CSS Module ownership; no duplicate shared card/button skin remains. |
| `src/components/trips/TripList.module.css` | Empty-state typography/margins | Use shared typography/spacing |
| `src/components/trips/TripPagination.module.css` | Unique list/nav structure and scoped pagination selectors | All recurring visual values now consume theme-generated pagination, spacing, color, shape and typography variables; no local color, radius, size, padding, focus or font-weight literals remain. | MIGRATED — structural CSS Module with token-backed visual values |

### 5.4 Shared/common, navigation and images

| File | Finding | Required action |
|---|---|---|
| `src/components/common/BackButton.tsx` | MIGRATED — shared Back role; caller-owned layout/navigation preserved. |
| `src/components/common/ConfirmDialog.tsx` | MIGRATED — shared primary/secondary action roles; Dialog surface theme-owned. |
| `src/components/common/NotFound.tsx` | MIGRATED — 404 hero remains CSS Module; Home CTA uses NOT_FOUND_HOME_BUTTON_SX. |
| `src/components/common/ExpandableText.tsx` | MIGRATED — collapsed text clamp preset; MUI owns disclosure button defaults. |
| `src/components/common/PasswordField.tsx` | TextField defaults inherit MUI theme; visibility IconButton uses ICON_ACTION_STYLES.base. | Password visibility interaction and maxLength remain behavior-only; no local presentation object remains. | MIGRATED — shared theme/icon-action contract consumed. |
| `src/components/common/PasswordRequirements.tsx` | Password validation state is computed by shared getPasswordRequirements. | List and item layout now consume PASSWORD_REQUIREMENTS_LIST_SX and PASSWORD_REQUIREMENT_ITEM_SX; success/neutral colors use MUI palette roles. | MIGRATED — layout and feedback colors use shared contracts. |
| `src/components/common/NotificationProvider.tsx` | MIGRATED — Alert width preset; MUI owns severity and Snackbar states. |
| `src/components/layout/Header.tsx` | MIGRATED — header shell and navigation consume HEADER_* and BUTTON_STYLES presets. |
| `src/components/layout/Footer.tsx` | MIGRATED — CSS Module uses centralized footer spacing/color variables. |
| `src/components/CustomFileUploadButton.tsx` | Camera IconButton and contained Button-as-label now consume named upload-trigger presets; wrapper width is centralized. | Verify shared Upload semantic action role and disabled/focus state parity with theme. | PARTIAL — trigger geometry/skin centralized. |
| `src/components/images/AppImage.tsx` | Central preset resolver; no arbitrary style prop | Preserve boundary; define a named preset for each shared image role |
| `src/components/images/ImageGallery.tsx` | CSS Module + local `sx` | Use shared image button/frame presets |
| `src/components/images/ImageLightbox.tsx` | MUI Dialog Paper inherits shared Dialog surface then intentionally overrides background with `UI_COLORS.surface.imageLightbox`; close/previous/next share local `controlSx`. | Overlay icon control appearance and three repeated position/z-index rules are local; caption and image-stage composition need named lightbox/overlay contracts. | PARTIAL — dedicated Dialog surface variant, overlay controls local. |
| `src/components/images/ImageUploadField.tsx` | Named image-upload presets own root/header/status/count/limit, scrollable preview list/rows/thumbnails/filename, processing indicator sizing and remove controls; CustomFileUploadButton owns both upload trigger modes. | Warning Alert remains MUI-theme-owned; verify warning/focus/disabled parity in the shared feedback/action audit. | PARTIAL — upload-specific local sx migrated. |
| `src/components/auth/ProfileImage.tsx` | Existing profile image display still uses AppImage presets, Dialog and image tokens; separate ProfileImageUpload now uses shared upload trigger, preview-row, thumbnail, filename and remove presets. | Existing circular frame, existing-image delete control, fullscreen stage and close control remain local. | PARTIAL — selected-file upload flow centralized; existing-image presentation remains open. |
| `src/components/admin/AdminUserProfileImage.tsx` | Local image button dimensions + raw Delete/Upload | Reuse profile-image/action roles |
| `src/components/admin/AdminImages.tsx` | TableContainer component=Paper uses MuiPaper outlined surface; preview Dialog inherits MuiDialog surface. | ADMIN_TABLE_CONTAINER_SX owns width only; outlined Paper and Dialog surfaces are theme-owned; preview image background remains a documented semantic imageLightbox variant. | MIGRATED — table and preview surfaces are theme-owned. |
| `src/components/placeholders/SocialObjectPlaceholder.tsx` | Local overlay/text sizes/gradient | Use shared placeholder overlay tokens/typography |

### 5.5 Auth, profile and admin

| File | Finding | Required action |
|---|---|---|
| `src/components/auth/LoginForm.tsx` | Form wrapper/title/action row use AUTH_FORM_*; primary and secondary actions use BUTTON_STYLES. | Password visibility IconButton now consumes ICON_ACTION_STYLES.base; MUI TextField/theme owns field states. | PARTIAL — common panel/action/icon contracts consumed; verify password-field parity with shared PasswordField. |
| `src/components/auth/RegisterForm.tsx` | Form wrapper/title/action row use AUTH_FORM_*; PasswordField and PasswordRequirements are shared; primary/secondary actions use BUTTON_STYLES. | Terms label locked interaction now uses a CSS Module state class rather than a component-local sx object; field, helper and disabled states remain MUI/shared-component owned. | MIGRATED — no local presentation object or React style transport remains. |
| `src/components/auth/ForgotPasswordForm.tsx` | Form/title/back action use AUTH_FORM_*; submit uses BUTTON_STYLES.primary. | BackButton margin now consumes AUTH_FORM_BACK_BUTTON_SX instead of a caller-local sx object; TextField states inherit MUI theme. | MIGRATED — no remaining local presentation declaration. |
| `src/components/auth/ResendVerificationForm.tsx` | Form/title/back action use AUTH_FORM_*; submit uses BUTTON_STYLES.primary. | BackButton margin now consumes AUTH_FORM_BACK_BUTTON_SX instead of a caller-local sx object; TextField states inherit MUI theme. | MIGRATED — no remaining local presentation declaration. |
| `src/components/auth/ResetPasswordForm.tsx` | Form wrapper/title/back action use AUTH_FORM_*; PasswordField/PasswordRequirements and primary action are shared. | Success and form branches retain the same shared panel/action contracts; field and redirect states remain behavior-driven. | MIGRATED — no remaining local presentation declaration. |
| `src/components/auth/VerifyEmailForm.tsx` | Card surface inherits MuiCard theme; action uses BUTTON_STYLES.primary. | Card sizing/stack/alignment and title weight now consume EMAIL_VERIFICATION_CARD_SX and EMAIL_VERIFICATION_TITLE_SX. | MIGRATED — page-specific card composition is owned by named forms presets. |
| `src/components/auth/ChangePasswordForm.tsx` | Account field stack uses ACCOUNT_FORM_FIELDS_SX; password fields and requirements are shared components. | Save action now composes BUTTON_STYLES.primary with ACCOUNT_PASSWORD_SAVE_BUTTON_SX. | PARTIAL — shared fields/action spacing consumed; remaining review is state/helper-text parity with other password flows. |
| `src/components/auth/ProfileForm.tsx` | Account field stack and primary/secondary actions already use shared contracts. | Heading, disabled-email readability, action-row layout and button spacing now consume ACCOUNT_FORM_* presets. | PARTIAL — profile form presentation centralized; verify profile-image/password-expansion composition and shared field error/helper states. |
| `src/components/auth/ProfileImage.tsx` | See image findings | Use shared image/action roles |
| `src/components/auth/Captcha.tsx` | Local CAPTCHA container `sx` | Keep integration geometry; tokenize spacing |
| `src/components/admin/AdminUserForm.tsx` | Admin edit panel composes PANEL_SX and COLUMN_STACK_SX; Save/Delete use shared button roles. | Panel dimensions/padding, password field stack and back-button placement now consume ADMIN_USER_FORM_* presets; field controls inherit MUI theme. | MIGRATED — admin user edit composition and actions use shared contracts. |
| `src/components/admin/AdminUsers.tsx` | User entries render MUI Card with theme-owned surface; profile preview delegates to ImageLightbox; avatar states and pagination actions use existing presets. | User grid/card/content/identity/action/pagination spacing now consume ADMIN_* presets; Edit/Delete use primary/danger text roles. | MIGRATED — user directory composition and actions use shared admin/profile/button contracts. |
| `src/components/admin/AdminNavigation.tsx` | MIGRATED — nav layout preset; MUI variant/color own active states. |
| `src/components/admin/AdminDashboard.tsx` | Link-based admin navigation | Verify link/button role parity |
| `src/components/admin/AdminFailedLogs.tsx` | TableContainer component=Paper uses the global MuiPaper outlined surface override. | ADMIN_TABLE_CONTAINER_SX owns width only; outlined Paper background/border/radius are theme-owned; bulk toolbar/action/pagination use shared presets. | MIGRATED — table surface and actions are theme/preset-owned. |
| `src/components/admin/AdminReports.tsx` | TableContainer component=Paper uses the global MuiPaper outlined surface override; Card/Dialog surfaces remain theme-owned. | ADMIN_TABLE_CONTAINER_SX now owns width only; outlined Paper background/border/radius are theme-owned. | MIGRATED — table surface and pagination/action contracts are shared. |
| `src/components/admin/AdminRouteNotFoundLogs.tsx` | TableContainer component=Paper uses the global MuiPaper outlined surface override. | ADMIN_TABLE_CONTAINER_SX owns width only; outlined Paper surface and diagnostic/table layouts are theme/preset-owned. | MIGRATED — table surface and diagnostic composition centralized. |

### 5.6 Points, trips, maps and tracking

| File | Finding | Required action |
|---|---|---|
| `src/components/points/CreatePointPage.tsx` | MUI Card surface inherits theme; page/loading/error/grid/list/editor geometry use CREATE_POINT_* layout presets and POINT_FORM_PANEL_WITH_TOP_MARGIN_SX. | Map, list and editor parent frames are centralized; PointForm owns its own form contracts. | MIGRATED — page composition and panel geometry are preset-owned. |
| `src/components/points/EditPointPage.tsx` | MUI Card surface inherits theme; PointForm, map picker, AppImage and placeholder are shared components. | Page/loading/error/map/content/form/image section/grid/tile/delete overlay/placeholder geometry now consume EDIT_POINT_* presets in forms.ts. | MIGRATED — route-specific parent geometry centralized without moving frame ownership into the placeholder. |
| `src/components/points/PointActions.tsx` | Social operations are delegated to shared Like/Favorite/Report controls and SocialConfigStatus. | Point action-row alignment consumes POINT_SOCIAL_ACTIONS_SX, composed from the shared social action contract while preserving the point-specific compact gap and zero vertical margin. | MIGRATED — local wrapper styling removed; nested social controls remain owned by their shared components. |
| `src/components/points/PointCard.tsx` | Edit/Delete use primary/danger roles; card surface, card geometry, text inset/wrapping, action-row layout and map height use named theme/preset contracts. Move controls consume the shared icon-action focus contract. | Caller verified through PointList; up/down controls preserve permission, disabled and first/last-item visibility states. Edit/Delete preserve permission and disabled states. | MIGRATED — card and action presentation is owned by existing presets/theme; no further style duplication required. |
| `src/components/points/PointForm.tsx` | Shared AddressAutocomplete, ImageUploadField, BackButton, and primary action tokens are consumed. | Form stack, heading, map-search row, responsive action row and action dimensions now consume POINT_FORM_* presets in forms.ts. | PARTIAL — local form presentation centralized; remaining review is field/error state consistency across PointForm callers. |
| `src/components/points/PointList.tsx` | List layout uses POINT_LIST_SX; empty-state typography uses POINT_LIST_EMPTY_SX; each item delegates to PointCard. | Caller and empty state verified; no component-local visual object remains in this file. | MIGRATED — layout and typography are preset-owned. |
| `src/components/trips/TripActions.tsx` | Add/Edit actions use BUTTON_STYLES.tripAction; destructive actions use tripActionDanger. | display: contents wrapper consumes TRIP_ACTIONS_CONTENT_SX. Ownership gating, navigation/management sections, pending/disabled states, confirmation and mutation outcomes verified. | MIGRATED — action roles/layout are shared-preset owned. |
| `src/components/trips/TripCard.tsx` | Card/content/image/pagination geometry is owned by named presets; the MUI Card surface inherits the shared theme. | Fixed frame uses TRIP_CARD_CONTAINER_SX; Details uses BUTTON_STYLES.primaryWide; Next/Back use MUI's shared Button defaults and preserve disabled boundary states. Shared TripList is the only direct caller. | MIGRATED — card geometry, actions and states are covered by presets/theme; no duplicate action preset needed. |
| `src/components/trips/TripDetails.tsx` | MUI Card inherits shared surface; social and trip actions delegate to shared components. | Card/header/metadata/description/actions/social-row geometry now use `trip-details.ts`; React style props removed; currency/expand IconButtons use shared focus contract. | MIGRATED — trip information panel presentation centralized. |
| `src/components/trips/TripDetailsView.tsx` | CSS Module owns the unique responsive page grid/row composition; child features own their content. | Sticky day-navigation shell uses `getTripDetailsStickyHeaderSx`; `TripDetailsView.module.css` remains responsible for unique page grid and container-query layout. | MIGRATED — shell geometry centralized without moving unique page layout out of its CSS Module. |
| `src/components/trips/TripFilters.tsx` | Local select/filter style objects | Use common field/select contract |
| `src/components/trips/TripForm.tsx` | Uses semantic `create`, `add` and `addPoints` action roles; day stepper uses named increment/decrement contracts; Back uses shared `BackButton`; form, upload and action geometry consume named presets. | Field-state/theme contract, upload/remove actions, loading/disabled/focus parity and full caller verification remain open. | PARTIAL — action roles centralized; form/field and state audit remains. |
| `src/components/trips/EditTripLayout.tsx` | Day decrement/increment use shared stepper roles; Set/Change Day and Edit Your Trip use semantic `BUTTON_STYLES.edit`; image delete uses `ICON_ACTION_STYLES.danger` plus named overlay geometry; Back uses shared `BackButton`. | Parent grid, map frame, form panel, heading, day/price rows, action row, image section/grid/tile/delete control and placeholder frame consume EDIT_TRIP_* presets. Field/error state consistency and shared field adoption remain open. | PARTIAL — action roles and route-specific geometry are centralized; field/state audit remains. |
| `src/components/trips/TripDaysNav.tsx` | Page and non-page PaginationItems consume `TRIP_DAY_PAGE_ITEM_SX`; AppBar, centered content and Pagination spacing consume named `TRIP_DAYS_NAV_*` presets. | No component-local sx objects remain; URL navigation and optional caller-owned `onSelect` remain behavior-only. | MIGRATED — day-navigation presentation is preset-owned. |
| `src/components/trips/TripMapSection.tsx` | Renders MUI Card with theme-owned surface; map and SDK InfoWindow are delegated to GoogleMapView. | Card frame and MobileStepper container use TRIP_MAP_SECTION_CARD_SX and TRIP_MAP_SECTION_STEPPER_SX. Back/Next controls inherit MUI Button defaults; point selection/focus and keyboard navigation remain feature-owned. | MIGRATED — feature composition uses named map-control presets and shared MUI defaults. |
| `src/components/trips/PointSection.tsx` | MUI Card inherits shared surface; ImageGallery, placeholder, PointActions, CommentsToggle and ExpandableText are shared components. | Card/content/empty-image/description/title/note/action-row geometry now use named `trip-details.ts` and `image-gallery.ts` presets; description wrapper no longer uses React style. | MIGRATED — point detail presentation centralized while preserving its image-frame parent geometry. |
| `src/components/trips/PointsSection.tsx` | No style matches in initial scan | Inspect full file/imports before marking VERIFIED |
| `src/components/trips/DayImagesGallery.tsx` | Delegates populated days to ImageGallery; empty days render SocialObjectPlaceholder. | Empty-day parent frame uses DAY_IMAGE_PLACEHOLDER_FRAME_SX; gallery frame/controls are owned by ImageGallery and its presets. | MIGRATED — no component-local presentation remains; parent placeholder geometry is preserved. |
| `src/components/trips/TripList.tsx` | Renders `TripCard`; list references `cardListStyle`, empty-state heading uses `headingTextStyle`. | Both presentation presets are applied through prohibited React `style`; empty-state typography and list composition need migration to approved sx/className/token consumers. | CHANGE REQUIRED — React style violations. |
| `src/components/trips/TripPagination.tsx` | Crawlable `<nav>` with real Next links and `aria-current`; native anchor/span semantics are preserved. | Link, active and focus states are implemented in the scoped CSS Module and consume theme-generated CSS variables for color, radius, dimensions, spacing and focus treatment. | MIGRATED — native pagination role styling is token-backed; route/query behavior remains component-owned. |
| `src/components/trips/TripSelectField.tsx` | TextField/Autocomplete/MenuItem inherit MUI theme defaults; component owns no local visual object. | Searchable and fallback fields retain MUI shared component contracts. | MIGRATED — no local visual migration required. |
| `src/components/maps/AddressAutocomplete.tsx` | Shared Autocomplete/TextField composition with semantic `form`, `pointPicker` and `tripPicker` variants; retains behavior props, direction and `textFieldProps`. | Caller-level `inputSx`, `buttonSx` and `containerSx` have been removed; named owner presets now control input, search-button and container presentation. | SOURCE MIGRATED — visual variants owned centrally. |
| `src/components/maps/GoogleMapView.tsx` | Shared Google Maps renderer; Box owns canvas/loading geometry; InfoWindowF is the SDK InfoWindow and receives caller-provided ReactNode. | Renderer frame/loading geometry now consume getGoogleMapFrameSx/getGoogleMapLoadingSx; map SDK owns map controls and InfoWindow chrome. | MIGRATED — renderer-owned layout centralized; SDK internals remain intentionally external. |
| `src/components/maps/PointLocationPicker.tsx` | Uses pointPicker AddressAutocomplete variant and shared point-picker action-row presets; secondary marker removal remains a semantic secondary action. | GPS, marker removal, map selection and find-in-map behavior remain feature-owned; all local presentation references use shared map/button presets. | MIGRATED — feature controls and map layout use shared contracts. |
| `src/components/maps/TripLocationPicker.tsx` | Uses tripPicker AddressAutocomplete variant, shared map frame/hint presets and named marker-removal button preset. | Address input/search/container styling and marker-clear button geometry are centrally owned; map hint and feature-specific map state remain unchanged. | MIGRATED — feature controls and map layout use shared contracts. |
| `src/components/tracking/LiveTracker.tsx` | GoogleMap/Polyline SDK owns map rendering; component owns GPS follow state, controls and telemetry composition. | Map frame/loading, action row/status, responsive stats grid/stat frame/value and Polyline/map-container SDK configuration now consume `tracking.ts`; Start/Stop use semantic primary/danger roles. Reset/Follow retain MUI defaults. | MIGRATED — all app-owned tracking presentation centralized; SDK configuration remains intentionally explicit in the shared preset owner. |

### 5.7 Comments and social

| File | Finding | Required action |
|---|---|---|
| `src/components/comments/CommentsSection.tsx` | MUI Cards inherit shared `MuiCard` surface; social controls delegate to shared Like/Favorite/Report and Replies components. | Panel/title/list/card/edit/create/author/body/timestamp/social-action layouts use `comments.ts`; icon controls use ICON_ACTION_STYLES. | MIGRATED — comment composition and action states use shared presets/theme. |
| `src/components/comments/CommentsToggle.tsx` | Comment toggle is a MUI IconButton with Badge; action icon inherits shared icon-action role. | Toggle row and empty-label spacing use named comments presets; no native inline layout remains. | MIGRATED — comment toggle layout centralized. |
| `src/components/comments/RepliesSection.tsx` | Reply action icons use shared base/danger icon roles; Like/Favorite/Report delegate to shared social components. | Reply item, edit form, body wrapping, social-action row, nested section and create form use comments presets. | MIGRATED — nested comment presentation centralized. |
| `src/components/social/LikeButton.tsx` | Icon control uses shared ICON_ACTION_STYLES and compact badge contract; animation is a semantic dynamic helper. | Shared like icon states, focus/hover/disabled and count badge are preset-owned. | MIGRATED — semantic Like role centralized. |
| `src/components/social/FavoriteButton.tsx` | Icon control uses shared ICON_ACTION_STYLES and compact badge contract. | Favorite active/inactive, focus/hover/disabled and count badge use shared semantic roles. | MIGRATED — semantic Favorite role centralized. |
| `src/components/social/EngagementBar.tsx` | Social controls delegate to shared Like/Favorite/Report; comment action uses shared icon role. | Inline action row and overlay size/badge variants use named social preset helpers; event propagation and comments layout behavior remain component-owned. | MIGRATED — no caller-local presentation object remains. |
| `src/components/social/ReportButton.tsx` | Report trigger uses ICON_ACTION_STYLES.report; Cancel/Submit remain MUI text-button defaults. | Tooltip wrapper, reason field spacing, social error text and visually-hidden status use named sx contracts/MUI visuallyHidden; no React style prop remains. | MIGRATED — report presentation centralized without changing report state/permissions. |
| `src/components/social/TripGroupSocialActions.tsx` | Like/Favorite/Report/Share/comment controls use shared icon-action role; social errors use shared feedback style. | Action row, animated like state and error feedback use named social presets/helpers. | MIGRATED — social action presentation centralized. |
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
| `src/styles/presets/social.ts` | MIGRATED — social action rows, overlays, sticky surface, error feedback, dynamic size/animation and ReportButton dialog/wrapper contracts are centralized. |
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
| `src/components/CustomFileUploadButton.tsx` | PARTIAL — Upload trigger visuals now use named presets; semantic action/theme state audit remains open. |
| `src/components/common/BackButton.tsx` | CHANGE REQUIRED |
| `src/components/common/ConfirmDialog.tsx` | CHANGE REQUIRED |
| `src/components/common/ExpandableText.tsx` | PARTIAL |
| `src/components/common/NotFound.tsx` | CHANGE REQUIRED |
| `src/components/common/NotificationProvider.tsx` | PARTIAL |
| `src/components/common/PasswordField.tsx` | PARTIAL |
| `src/components/common/PasswordRequirements.tsx` | PARTIAL |
| `src/components/common/ScrambleHeading.tsx` | PARTIAL |
| `src/components/common/WelcomeHeading.tsx` | CHANGE REQUIRED |
| `src/components/home/HomeHero.tsx` | WelcomeHeading owns shared home heading composition. | Intro typography and 850px content width use HOME_HERO_INTRO_SX, composed from HOME_INTRO_SX. | MIGRATED — no React style prop or local visual object remains. |
| `src/components/home/HomeTrips.tsx` | Heading consumes HOME_HEADING_SX; trip listing delegates to shared TripList. | Heading remains a semantic h3 and uses the shared heading preset; no local visual declaration remains. | MIGRATED — heading/list composition uses shared owners. |
| `src/components/images/AppImage.tsx` | PARTIAL |
| `src/components/images/ImageGallery.tsx` | PARTIAL |
| `src/components/images/ImageLightbox.tsx` | CHANGE REQUIRED |
| `src/components/images/ImageUploadField.tsx` | PARTIAL — upload layout, preview, count, limit, processing and remove visuals use named presets; Alert/theme state parity remains open. |
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
| `src/components/auth/ProfileImage.tsx` | PARTIAL — ProfileImageUpload selection/preview/remove composition now uses shared upload presets; existing image display/delete/lightbox controls remain open. |
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
| `src/components/social/ReportButton.tsx` | MIGRATED — tooltip wrapper, dialog field spacing, error feedback and visually-hidden status use named sx contracts; no React style prop remains. |
| `src/hooks/useBackground.tsx` | MIGRATED — dynamic background uses Next Image fill/unoptimized inside a fixed CSS Module layer; preload/decode lifecycle preserved; no React style prop remains. |
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
| `app/layout.tsx` | Root metadata, viewport theme color, `globals.css`, root `<html>/<body>` and `.app-shell` wrapper. | No independent surface skin; shell geometry is delegated to `.app-shell`. Keep metadata/layout concerns separate from design tokens. | STRUCTURAL — no local component skin. |
| `app/providers.tsx` | Central `ThemeProvider` and `CssBaseline` wrap app providers; installs Query/Auth/Background/Notification/Confirm providers. | No surface declarations; provider order is composition, not visual styling. Verify theme/CSS-variable ownership in Stage 2. | STRUCTURAL — theme is mounted centrally. |
| `app/(account)/layout.tsx` | RequireAuth owns access gating; Header/Footer are shared shell components. | Main content frame uses ACCOUNT_LAYOUT_MAIN_SX; no route-local visual declarations remain. | MIGRATED — account shell uses shared layout preset. |
| `app/(admin)/layout.tsx` | MIGRATED — Box main uses ROUTE_LAYOUT_MAIN_SX; RequireRole/Header/AdminNavigation/Footer order preserved. |
| `app/(auth)/layout.tsx` | MIGRATED — Box main/content use AUTH_LAYOUT_MAIN_SX and AUTH_LAYOUT_CONTENT_SX; Header/GuestOnly/Footer order preserved. |
| `app/(public)/layout.tsx` | Shared Header/Footer composition; public routes own their `<main>` elements. | Flex-fill wrapper now uses `PublicLayout.module.css` instead of React `style={{ flex: 1 }}`; shell order and footer positioning are preserved. | MIGRATED — no React style transport remains. |
| `app/(account)/favorites/page.tsx` | Uses shared TripList; route fetches the viewer's favorites. | Page/content/heading/loading/error/empty-state presentation uses ACCOUNT_TRIPS_* and shared heading presets. | MIGRATED — no route-local presentation remains. |
| `app/(account)/my-trips/page.tsx` | Uses shared TripList; Create Trip CTA uses BUTTON_STYLES.createTrip. | Page/content/heading/loading/error/empty-state presentation uses ACCOUNT_TRIPS_* and shared heading presets. | MIGRATED — no route-local presentation remains. |
| `app/(account)/profile/page.tsx` | ProfileForm owns profile fields/actions/image behavior; shared PANEL surface owns panel skin. | Centered page frame and responsive profile panel now use ACCOUNT_PROFILE_PAGE_SX and ACCOUNT_PROFILE_PANEL_SX; no route-local sx remains. | MIGRATED — account profile route shell centralized. |
| `app/(public)/about/page.tsx` | Editorial content structure is owned by AboutPage.module.css; images use Next Image and IMAGE_PRESETS for dimensions. | Replaced the page-local imageStyle object and all Image `style` props with `.aboutPageImage` plus wide/marker variants in the existing CSS Module. | MIGRATED — page-specific editorial image geometry remains CSS Module-owned. |
| `app/(public)/live-tracking/page.tsx` | Moderator redirect gates access; LiveTracker owns tracking feature UI. | Main content gutter now uses LIVE_TRACKING_PAGE_MAIN_SX; React style prop removed. | MIGRATED — public route shell uses named tracking preset. |
| `app/(public)/page.tsx` | HomeHero and HomeTrips own their feature composition. | Main uses CENTERED_PAGE_MAIN_SX; heading/intro styles are owned by shared home typography presets. | MIGRATED — no route-local presentation remains. |
| `app/(public)/trips/[id]/page.tsx` | Async public route resolves trip/day, builds metadata/JSON-LD and delegates presentation to TripDetailsView. | Route main uses CENTERED_PAGE_MAIN_SX; no React style prop remains. | MIGRATED — public trip route shell uses shared page contract; SEO/JSON-LD/notFound logic is unchanged. |
| `app/(public)/trips/page.tsx` | TripFilters, TripList, TripPagination and WelcomeHeading own their feature presentation. | Main uses CENTERED_PAGE_MAIN_SX; intro uses TRIPS_PAGE_INTRO_SX composed from HOME_INTRO_SX, including the 900px editorial width. | MIGRATED — no route-local ad hoc sx or React style remains. |

Page wrappers without visual declarations are not automatically migration targets. Their imported components are the actual styling consumers. Remaining route files need a confirmation pass for imported UI and overlooked local styles before being marked VERIFIED.

---

## 10.1 File-level implementation ledger — explicit completed vs remaining work

This ledger is the operational source for answering "what is actually fixed in each file?". A file marked PARTIAL or inspected is **not** considered fixed. "Centralized" below means the source currently consumes an existing shared contract; it does not mean the entire file has been migrated or visually verified.

| File | Already centralized / confirmed | Still remaining | Current result |
|---|---|---|---|
| `src/components/points/PointCard.tsx` | Edit Point uses `BUTTON_STYLES.edit`; Delete Point uses `BUTTON_STYLES.danger`; move-up/down IconButtons consume `ICON_ACTION_STYLES.base`; Card surface is inherited from `MuiCard`; text inset/button margin use named card presets. | Point-specific move visibility/padding, card geometry/padding and action-row layout remain in the card preset owner; description wrapping and caller/state verification remain open. | PARTIAL — action roles and icon base are centralized; card layout and full state/caller verification remain. |
| `src/components/points/PointForm.tsx` | Uses semantic `BUTTON_STYLES.create`, `add` and `edit` roles; Find in Map consumes `POINT_FORM_FIND_MAP_BUTTON_SX`; shared `BackButton` owns Back appearance. | Point-specific action width/responsive sizing remains in `POINT_FORM_ACTION_BUTTON_SX`; Back navigation and form state remain component-owned. Remaining field, upload, icon and disabled/loading contracts still require review. | PARTIAL — action roles and map-search presentation centralized; form/field and state verification remain open. |
| `src/components/points/PointActions.tsx` | Wrapper consumes `POINT_SOCIAL_ACTIONS_SX`; LikeButton, FavoriteButton and ReportButton own their interactions and consume shared `ICON_ACTION_STYLES`; SocialConfigStatus owns its feedback presentation. | Verify all rendered call sites and responsive parity with other social-action groups; no PointActions-local visual declaration remains. | PARTIAL — source presentation is centralized; exhaustive caller/route verification remains open. |
| `src/components/points/PointList.tsx` | Delegates each item to `PointCard`; list container consumes `POINT_LIST_SX`; empty state consumes `POINT_LIST_EMPTY_SX`. | Verify all callers and responsive behavior of the composed PointCard list; no local visual declaration remains in this component. | PARTIAL — list and empty-state presentation are preset-owned; caller/responsive verification remains open. |
| `src/components/trips/TripCard.tsx` | Details link consumes semantic `BUTTON_STYLES.navigationAction`; card surface uses `MuiCard`; content and image frames consume shared card/image presets. | Stepper Back/Next intentionally retain MUI MobileStepper's native text-button defaults; substantial card geometry/content presets and responsive/caller verification remain open. | PARTIAL — navigation role centralized; card composition and responsive/caller verification remain. |
| `src/components/trips/TripActions.tsx` | Add Next Day Trip uses `tripAdd`; Add/Edit Points uses `tripManage`; Edit Day uses `tripEdit`; Delete Day/Trip use `tripDelete`. All are semantic aliases of the existing trip action/danger treatments. | Shared trip action geometry remains centralized in the existing role owner; verify every caller and pending/disabled/focus state. | PARTIAL — semantic roles applied; caller/state parity remains open. |
| `src/components/common/BackButton.tsx` | Shared Back action fixes MUI `variant="contained"` and applies `BUTTON_STYLES.back`; caller owns navigation behavior. | Caller `sx` is merged before the shared semantic role, so only non-overlapping placement/dimension values survive; nine callers are mapped in Section 11.7. | MIGRATED — shared Back role and caller-owned layout/navigation are explicit. |
| `src/theme/components/card.ts` | All MUI Cards receive `getSurfaceStyles` from the theme: paper background, divider border, theme radius and semantic surface shadow. | Consumer sx remains responsible only for card geometry/content; custom social/image surfaces keep their own semantic contracts. | MIGRATED — global Card skin is centralized. |
| `src/theme/components/dialog.ts` | MUI Dialog Paper receives `getSurfaceStyles`; ImageLightbox applies its documented semantic image-stage override. | ConfirmDialog, AdminImages, ImageLightbox, ProfileImage and ReportButton inherit the shared Dialog Paper contract. | MIGRATED — Dialog surface and image-stage exception are explicit. |
| `src/theme/components/surface.ts` | Defines elevated getSurfaceStyles and outlined getOutlinedSurfaceStyles from active theme values. | Adopted by MuiCard, MuiDialog.paper, MuiPaper.outlined and PANEL_SX; no blanket default Paper override is applied. | MIGRATED — shared surface roles and variant boundary confirmed. |
| `src/components/trips/PointSection.tsx` | Card surface inherits `MuiCard`; title, content, image frame, empty image frame, note, description and action row consume named `trip-details.ts` / `image-gallery.ts` presets. ImageGallery, PointActions, CommentsToggle and ExpandableText are shared child components. | No React `style` prop or component-local sx object remains; verify responsive composition through all parent routes and child states. | MIGRATED — PointSection presentation and child composition use shared contracts. |
| `src/components/points/EditPointPage.tsx` | Parent/loading/error/map/content/form/image grid/tile/placeholder use named `EDIT_POINT_*` presets; point map/form/image rendering delegate to shared components; image Delete uses `ICON_ACTION_STYLES.delete` through its overlay preset. | Verify permission/load/delete pending/error and responsive map/form/image states; no component-local sx object remains. | PARTIAL — page geometry and Delete role centralized; caller/state parity remains open. |
| `src/components/points/CreatePointPage.tsx` | Uses MUI Card theme surface for its Card and central size token for content width. | Local layout `sx` and page composition remain; verify all nested form and action consumers. | PARTIAL — not fully fixed. |


| `src/components/admin/AdminFailedLogs.tsx` | Outlined Paper table inherits shared surface; selected-row Delete uses `BUTTON_STYLES.deleteText`; Checkbox selection remains MUI-owned; Previous/Next use `ADMIN_PAGINATION_BUTTON_SX` and `ADMIN_PAGINATION_SX`. | Verify checkbox indeterminate/selected states, delete confirmation/pending/error states and responsive table behavior; no local table or pagination skin remains. | PARTIAL — action and pagination contracts centralized; selection/state parity remains open. |
| `src/components/admin/AdminImages.tsx` | Outlined Paper table inherits the shared surface; all Previous/Next controls consume `ADMIN_PAGINATION_BUTTON_SX`; preview trigger, thumbnail, URL cell, close control, dialog content and image stage consume named `ADMIN_IMAGE_*` presets. | Verify toolbar Generate/Select action roles, Checkbox states, responsive table behavior and all preview/selection/pending states; no local preview IconButton position or image spacing object remains in the component. | PARTIAL — table, pagination and preview presentation centralized; action/state parity remains open. |
| `src/components/admin/AdminReports.tsx` | Outlined Paper table inherits shared surface; Delete uses semantic `BUTTON_STYLES.deleteText`; Previous/Next consume `ADMIN_PAGINATION_BUTTON_SX`. | Verify delete confirmation/pending/error states, row content and responsive table behavior; no local table surface or pagination styling remains. | PARTIAL — action and pagination roles centralized; row/state verification remains open. |
| `src/components/admin/AdminRouteNotFoundLogs.tsx` | Outlined Paper table inherits shared surface; Previous/Next use `ADMIN_PAGINATION_BUTTON_SX`; diagnostic fields/details/expanded cell use named `ADMIN_DIAGNOSTIC_*` and `ADMIN_ROUTE_*` presets. View/Hide disclosure uses MUI Button defaults with `aria-expanded` / `aria-controls`. | Verify expanded-row content, focus/keyboard and responsive table states; no local typography, spacing or button skin remains in the component. | PARTIAL — table, disclosure and pagination presentation use shared/theme contracts; responsive/state parity remains open. |
| `src/components/admin/AdminUserProfileImage.tsx` | Avatar/zoom trigger uses shared admin profile-image preset; Delete uses semantic `BUTTON_STYLES.deleteText`; Upload/Replace uses semantic `BUTTON_STYLES.upload` through `ADMIN_PROFILE_IMAGE_UPLOAD_BUTTON_SX`; table/layout and image preview delegate to shared owners. | Verify mutation pending/disabled states and responsive alignment across the AdminUserForm caller; no component-local sx object remains. | PARTIAL — action and avatar presentation centralized; caller/state verification remains open. |
| `src/components/auth/ChangePasswordForm.tsx` | Save password uses semantic `BUTTON_STYLES.save` plus `ACCOUNT_PASSWORD_SAVE_BUTTON_SX`; form stack uses `CHANGE_PASSWORD_FORM_SX`; fields and requirements delegate to shared PasswordField/PasswordRequirements. | Verify TextField error/helper/disabled/focus states and pending/reset behavior against the global field contract; no component-local action geometry remains. | PARTIAL — Save and form layout contracts centralized; field/state parity remains open. |
| `src/components/auth/VerifyEmailForm.tsx` | Card surface inherits `MuiCard`; card layout/title use `EMAIL_VERIFICATION_CARD_SX` and `EMAIL_VERIFICATION_TITLE_SX`; Go to login consumes semantic `BUTTON_STYLES.navigationLink`. | Verify success/error/loading states and responsive card content; no component-local action or card style remains. | PARTIAL — navigation and card presentation centralized; status/state parity remains open. |
| `src/components/auth/RegisterForm.tsx` | Register uses `create`; Login/Resend links use `navigationSecondary`; form/title/action row use auth presets; PasswordField, PasswordRequirements and Captcha are shared; accepted-terms Checkbox inherits MUI defaults. | Verify Checkbox locked/checked/focus states, field errors/helpers, CAPTCHA lifecycle and submit/disabled parity across consumers. | PARTIAL — action roles and MUI defaults verified; field/checkbox/CAPTCHA state parity remains open. |
| `src/components/auth/ProfileForm.tsx` | Edit Profile uses `BUTTON_STYLES.edit`; Change Password section toggle uses `BUTTON_STYLES.disclosure`; Back uses shared `BackButton`; form, action row, title and read-only field consume named account form presets. | Verify editable/read-only field states, image upload/delete/fullscreen states, password disclosure/reset behavior and submit/disabled state parity; no local action skin remains. | PARTIAL — action roles and form layout centralized; field/image/state parity remains open. |
| `src/components/auth/ProfileImage.tsx` | Existing-image display, circular frame, delete trigger, fullscreen stage/close control and loading state consume named `profile-image.ts` presets; image rendering uses AppImage presets. ProfileImageUpload uses shared upload/preview/remove presets and the semantic Upload role. | No component-local sx object remains; verify image aspect-ratio/caller behavior and all loading/deleting/fullscreen states. | MIGRATED — profile image presentation and upload composition are preset-owned. |
| `src/components/maps/AddressAutocomplete.tsx` | Uses MUI TextField and Google Places Autocomplete with named form/point/trip variants. | Shared presets own the field, search-button, wrapper and extra-action geometry; the public API no longer accepts arbitrary sx overrides. | SOURCE MIGRATED — variant contract applied. |
| `src/components/maps/GoogleMapView.tsx` | Shared renderer owns SDK loading, map frame/loading geometry, Google Maps `mapContainerStyle` config and loading indicator size through named map-controls contracts; markers, paths, InfoWindow, fit-bounds/focus behavior and map events remain feature API. | Verify all direct consumers, loading/error states, frame dimensions and responsive map interactions; Google Maps SDK options are configuration objects, not React inline style props. | PARTIAL — renderer geometry/config centralized; caller/state parity remains open. |
| `src/components/maps/PointLocationPicker.tsx` | Uses shared GoogleMapView and named point-picker/autocomplete/action/Snackbar presets; Remove Marker uses semantic `BUTTON_STYLES.removeMarker`; GPS loading indicator size is named in map-controls. | Verify browser geolocation permission/error, find-in-map trigger, marker drag/click, snackbar and responsive action states; point-specific behavior remains separate from TripLocationPicker. | PARTIAL — map/action presentation centralized; geolocation and caller state parity remain open. |
| `src/components/maps/TripLocationPicker.tsx` | Uses shared GoogleMapView and named trip map frame/hint/autocomplete contracts; Remove Marker uses semantic `BUTTON_STYLES.removeMarker` through its named preset. | Verify map-click/drag, search, marker-clear and responsive hint/frame states; remains intentionally separate from PointLocationPicker (no GPS/find-in-map action). | PARTIAL — map/action presentation centralized; caller state parity remains open. |
| `src/components/trips/TripSelectField.tsx` | TextField and Autocomplete renderInput inherit the shared `MuiTextField` defaults (`outlined` / `medium`); no feature-local field skin or sx object. | MUI owns outlined input, label, helper, focus, error and disabled defaults; verify the config-loading/free-text/searchable branches and their caller states. | PARTIAL — shared MUI field baseline verified; caller/state parity remains open. |
| `src/components/CustomFileUploadButton.tsx` | Shared upload trigger with text Button and camera IconButton modes; both consume the semantic `upload` role through `image-upload.ts`. | Container width and text/icon mode geometry remain in named presets; verify direct consumers, disabled/max-count states and accessible file-input behavior. | PARTIAL — Upload role centralized; consumer/state parity remains open. |
| `src/components/images/AppImage.tsx` | Shared image renderer resolves named preset dimensions/fill/sizes/priority, thumbnail URL and one full-image retry before missing-image fallback; object-fit and profile-lightbox behavior use CSS Module classes. Direct consumers remain mapped in this row. | No React `style` prop or style transport remains; preset-to-caller frame ratios, dimensions and responsive `sizes` parity still require review. | PARTIAL — style transport migrated; image preset/frame parity remains open. |
| `src/components/images/ImageGallery.tsx` | Direct consumers are PointSection and DayImagesGallery; gallery state and empty path are component-owned; images use AppImage and engagement overlays use EngagementBar. | CSS Module owns row/stack/grid structure and dynamic column classes; focus-visible outline consumes shared focus CSS variables; ImageLightbox is shared. Image frame ratios, overlay stacking and responsive caller parity remain open. | PARTIAL — structure and focus token ownership centralized; frame/overlay/caller verification remains. |
| `src/components/images/ImageLightbox.tsx` | Direct consumers: ImageGallery, AdminUserProfileImage and AdminUsers. Fullscreen Dialog Paper uses the shared Dialog surface plus the documented image-stage background variant; Close/Previous/Next controls compose `ICON_ACTION_STYLES.imageControl` with named position presets; counter, root, stage and image frame use named presets. | Verify caller-specific image ratios/sizes and keyboard/touch state parity; no local control skin or geometry object remains in the component. | MIGRATED — lightbox surface, controls and stage presentation are preset-owned. |
| `src/components/images/ImageUploadField.tsx` | Uses named image-upload presets for field layout, preview list/rows/thumbnails, remove actions and count/limit feedback; upload trigger delegates to `CustomFileUploadButton`. | Upload and draft Remove All now use semantic `upload` / `removeSelection` roles; individual preview removal uses the shared danger icon role. Caller-specific preview/frame sizing and responsive/disabled state parity remain open. | PARTIAL — action roles and field presentation are preset-owned; caller/state parity remains. |
| `src/components/common/ExpandableText.tsx` | Shared disclosure component; Show more/less uses MUI text-button defaults. | Collapsed three-line clamp uses EXPANDABLE_TEXT_COLLAPSED_SX; expanded state removes the clamp without local visual objects. | MIGRATED — disclosure presentation centralized; MUI owns the text-button default role. |
| `src/components/common/NotFound.tsx` | 404 hero structure remains in NotFound.module.css; Home CTA remains a native button rendered through MUI Box. | CTA presentation uses NOT_FOUND_HOME_BUTTON_SX and semantic colors; countdown/router behavior remains component-owned. | MIGRATED — 404 hero structure and Home action have separate owners. |
| `src/components/common/NotificationProvider.tsx` | Snackbar/Alert inherit MUI severity and variant states; Alert width uses NOTIFICATION_ALERT_SX. | No custom surface skin; placement/duration/close behavior remains notification-constant/provider owned. | MIGRATED — notification presentation contract centralized. |
| `src/components/common/PasswordField.tsx` | Shared TextField owner inherits `MuiTextField` outlined/medium defaults; reveal/hide IconButton consumes `ICON_ACTION_STYLES.passwordVisibility`; forwards registration, error/helperText, disabled, maxLength and autocomplete. | MUI owns the base input/label/helper/focus/error/disabled visuals; verify mapped consumers and reveal/hide keyboard/focus behavior. | PARTIAL — icon-action role and MUI baseline verified; consumer/state parity remains open. |
| `src/components/common/WelcomeHeading.tsx` | Uses shared HOME_HEADING_SX typography preset and MUI typography; unique wrapper/heading-group geometry is owned by `WelcomeHeading.module.css`. | Inline layout sx was moved to the CSS Module while preserving flex alignment, 25px horizontal padding and 16px bottom margin. Touch handling, responsive heading split and scramble behavior remain unchanged. | MIGRATED — unique layout is CSS Module-owned; typography remains preset-owned. |
| `src/components/comments/CommentsSection.tsx` | Comment panel/list/card/author/body/timestamp/edit/create/action-row/hint presentation uses named `COMMENT_*` presets; social actions delegate to shared Like/Favorite/Report/Replies components; edit/save/cancel/submit/disclosure/delete IconButtons use semantic `ICON_ACTION_STYLES` roles. | Verify all permission/config combinations, field error/focus/disabled states, mutation pending/confirmation behavior and responsive comment/reply composition; no React `style` prop or component-local visual object remains. | PARTIAL — action and layout contracts centralized; state/caller parity remains open. |
| `src/components/comments/CommentsToggle.tsx` | Wrapper and empty-label presentation use `COMMENTS_TOGGLE_ROW_SX` / `COMMENTS_TOGGLE_EMPTY_LABEL_SX`; show/hide/add action consumes `ICON_ACTION_STYLES.disclosure`. | No React `style` prop or local heading margin remains; verify count/open/empty states and keyboard/focus behavior through parent callers. | PARTIAL — disclosure role and layout presets centralized; caller/state parity remains open. |
| `src/components/comments/RepliesSection.tsx` | Reply item/edit/body/social/create layouts use named `REPLY_*` presets; Save/Cancel/Edit/Submit/Delete IconButtons use semantic `ICON_ACTION_STYLES` roles; Like/Favorite/Report delegate to shared social controls. | Verify permission/config combinations, reply field error/focus/disabled states, mutation pending/confirmation and responsive nesting; no local border/spacing or React style prop remains. | PARTIAL — layout and action roles centralized; state/caller parity remains open. |
| `src/components/social/EngagementBar.tsx` | Inline/overlay shell and action-row geometry consume `SOCIAL_ENGAGEMENT_INLINE_SX`, `getSocialOverlaySx` and `getSocialEngagementActionsSx`; Like/Favorite/Report delegate to shared controls; Comments toggle uses `ICON_ACTION_STYLES.disclosure`. | Verify overlay size variants, external/internal comment ownership, responsive placement and permission/config states; no component-local sx object or unstyled raw IconButton remains. | PARTIAL — visual/action contracts centralized; caller/responsive state parity remains open. |
| `src/components/social/TripGroupSocialActions.tsx` | Like/Favorite/Report/Share use semantic `ICON_ACTION_STYLES` roles; Comments delegates to `CommentsToggle`; action row, error feedback and like animation consume named social presets/helpers. | Verify permission/config combinations, animation failure/reduced-motion states, share copied feedback and responsive caller parity; no raw unstyled icon or React style error span remains. | PARTIAL — action/presentation contracts centralized; interaction-state parity remains open. |
| `src/components/tracking/LiveTracker.tsx` | Map frame/loading, Google Maps container/polyline options, action row, status, telemetry grid and stat frames consume named `tracking.ts` presets/constants. Start/Stop use `LIVE_TRACKING_BUTTON_STYLES`; Reset/Follow intentionally retain MUI text-button defaults. | Verify geolocation permission/error, tracking start/stop/reset, follow/pan behavior and responsive telemetry states; `mapContainerStyle` is a Google Maps SDK option, not a React `style` prop. | PARTIAL — presentation owners verified; interaction/responsive state parity remains open. |
| `src/components/trips/TripDaysNav.tsx` | Page and non-page PaginationItems consume `TRIP_DAY_PAGE_ITEM_SX`; AppBar, centered content and Pagination spacing consume named `TRIP_DAYS_NAV_*` presets. | No component-local sx objects remain; URL navigation and optional caller-owned `onSelect` remain behavior-only. | MIGRATED — day-navigation presentation is preset-owned. |
| `src/components/trips/TripFilters.tsx` | Trip group, transport and sort Selects plus search input/button consume the named contracts in `src/styles/presets/trip-filters.ts`. | Toolbar, select group/box/label/select, search surface/button/icon/input geometry are preset-owned; URL navigation and filter state remain feature behavior. | MIGRATED — filter presentation is named-preset-owned. |
| `src/components/trips/TripMapSection.tsx` | Card frame consumes `TRIP_MAP_SECTION_CARD_SX`; MobileStepper container consumes `TRIP_MAP_SECTION_STEPPER_SX`; Card surface inherits the shared theme. | Back/Next slot controls intentionally retain MUI MobileStepper text-button defaults; Google Maps renderer, marker/path state and responsive scroll behavior remain feature-owned. | MIGRATED — map frame and stepper container use shared contracts; native MUI controls retained. |
| `src/components/trips/DayImagesGallery.tsx` | Delegates populated day images to shared `ImageGallery` with the named `gallery` preset and grid variant; empty state uses `DAY_IMAGE_PLACEHOLDER_FRAME_SX` and `SocialObjectPlaceholder`. | No component-local width/maxWidth/aspect-ratio or style object remains; gallery frame/overlay responsive parity is tracked in ImageGallery. | MIGRATED — day image composition and placeholder frame use shared contracts. |


| `app/(account)/favorites/page.tsx` | Uses shared account page/content/heading/empty-state presets and delegates populated results to TripList. | Loading margin, error width and empty-state typography now consume ACCOUNT_TRIPS_LOADING_SX, ACCOUNT_TRIPS_ERROR_SX and HEADING_TEXT_SX; no route-local visual declaration remains. | MIGRATED — account list states use shared contracts. |
| `app/(account)/profile/page.tsx` | Uses shared account profile page and panel contracts. | Root page and inner panel now consume ACCOUNT_PROFILE_PAGE_SX and ACCOUNT_PROFILE_PANEL_SX; no route-local sx callback or duplicated panel composition remains. | MIGRATED — route shell and panel are preset-owned. |
| `app/(account)/trips/create/page.tsx` | Route delegates to TripForm within Suspense; no direct visual styling found. | TripForm owns the complete form presentation contract; Suspense fallback remains null by existing route design. | NON-VISUAL ROUTE — child owns UI; no route-level migration required. |
| `app/(account)/trips/create/points/page.tsx` | Route delegates to CreatePointPage within Suspense; no direct visual styling found. | Verify CreatePointPage consumer ledger; no separate route-level visual migration indicated. | PARTIAL — composition wrapper only. |
| `app/(public)/live-tracking/page.tsx` | Moderator-gated route renders the LiveTracker feature. | Main uses Box component=main with LIVE_TRACKING_PAGE_MAIN_SX; page gutter is centralized in tracking.ts. | MIGRATED — route shell and tracker surface use named contracts. |
| `app/(public)/page.tsx` | Home data request and semantic content delegate to HomeHero/HomeTrips. | Main uses Box component=main with CENTERED_PAGE_MAIN_SX; HomeHero consumes HOME_HERO_INTRO_SX and HomeTrips consumes HOME_HEADING_SX. | MIGRATED — home route and intro presentation use shared contracts. |
| `app/(public)/trips/page.tsx` | Uses shared TripFilters, TripList, TripPagination and WelcomeHeading. | Both success/error branches use CENTERED_PAGE_MAIN_SX; intro uses TRIPS_PAGE_INTRO_SX composed from HOME_INTRO_SX. No inline sx object or React style prop remains. | MIGRATED — route composition uses named layout/typography contracts. |
| `app/(public)/trips/[id]/page.tsx` | Delegates trip presentation to TripDetailsView and uses CENTERED_PAGE_MAIN_STYLE. | React style prop on main; move route composition to approved styling API. Nested TripDetailsView is separately audited. | CHANGE REQUIRED. |
| `src/components/admin/AdminDashboard.tsx` | Semantic nav/list/link structure; no local visual declarations found. | Verify rendered navigation/link styling against shared navigation contract and parent Admin layout; no direct style migration confirmed in this file. | PARTIAL — structural only. |
| `src/components/auth/RequireModeratorRedirect.tsx` | Auth guard returns children or null; no visual declarations. | No visual migration in this file; verify only through child component ownership. | NON-VISUAL — no styling target. |
| `src/components/common/JsonLd.tsx` | Emits JSON-LD script only; no rendered visual UI. | No visual migration target. | NON-VISUAL — no styling target. |
| `src/components/common/ScrambleHeading.tsx` | Uses `HOME_HEADING_SX` for typography and exposes only text/ref/scramble behavior; no React `style` prop or caller-provided presentation object remains. | Verify reduced-motion, touch/hover and responsive heading split behavior through WelcomeHeading; no local visual style transport remains. | MIGRATED — typography preset-owned; interaction remains component-owned. |

| `app/(account)/layout.tsx` | Authenticated route shell with Header/main/Footer order and noindex metadata. | Main uses Box component=main with ACCOUNT_LAYOUT_MAIN_SX; no React style prop remains. | MIGRATED — authenticated shell uses shared layout contract. |
| `app/(account)/my-trips/page.tsx` | Uses shared page/content/heading/empty-state presets; empty-state CTA consumes `BUTTON_STYLES.createTrip` and links to trip creation. | Loading margin, error width and empty-state typography consume named account presets; Create Trip retains its semantic action role. | MIGRATED — account list states and CTA use shared contracts. |
| `app/(account)/points/edit/[pointId]/page.tsx` | Route delegates to EditPointPage; no direct visual declarations. | EditPointPage owns page/form/map/image composition through named presets. | NON-VISUAL ROUTE — child owns UI; no route-level migration required. |
| `app/(account)/trips/[id]/edit/page.tsx` | Server route validates IDs/ownership and delegates presentation to EditTripLayout. | No route-level visual declarations; EditTripLayout owns the complete editor composition. | NON-VISUAL ROUTE — child owns UI; no route-level migration required. |
| `app/(admin)/admin/failed-login-logs/page.tsx` | Route wrapper delegates to AdminFailedLogs; no direct visual declarations. | AdminFailedLogs owns table, selection, pagination and action UI and must be tracked independently. | NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/images/page.tsx` | Route wrapper delegates to AdminImages; no direct visual declarations. | AdminImages owns image table, preview dialog, upload and pagination controls and must be tracked independently. | NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/page.tsx` | Minimal semantic section wrapper. | Raw h1 has no explicit shared heading contract; determine whether parent Admin layout owns heading defaults or use a shared semantic heading role. | CHANGE REQUIRED. |
| `app/(admin)/admin/reports/page.tsx` | Route delegates to AdminReports inside a semantic section. | AdminReports owns report action/table/pagination styles; raw h1 on route needs shared heading contract. | CHANGE REQUIRED. |
| `app/(admin)/admin/route-not-found-logs/page.tsx` | Route wrapper delegates to AdminRouteNotFoundLogs; no direct visual declarations. | AdminRouteNotFoundLogs owns table/disclosure/pagination controls and must be tracked independently. | NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/users/[userId]/page.tsx` | Route delegates to AdminUserForm in a semantic section; no local style declaration. | AdminUserForm owns form fields/actions and must be tracked independently. | NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/users/page.tsx` | Route wrapper delegates to AdminUsers; no direct visual declarations. | AdminUsers owns user table, filters and actions and must be tracked independently. | NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/layout.tsx` | Moderator-only route shell with Header/AdminNavigation/main/Footer. | Main uses Box component=main with ROUTE_LAYOUT_MAIN_SX; no React style prop remains. | MIGRATED — shared route shell contract consumed. |

### Surface / Paper clarification

- MUI `Card` is already globally wired to `getSurfaceStyles` through `MuiCard`.
- MUI `Dialog`'s `paper` slot also uses the same `getSurfaceStyles`.
- This does **not** prove that every standalone `Paper`, custom panel, CSS surface or image/map overlay is centralized. A repository-wide Paper/surface consumer audit is still required.
- Therefore: Card background/border/radius/shadow are centralized at the MUI Card level; general Paper parity is **not yet complete or verified**.

| `app/(auth)/forgot-password/page.tsx` | Route metadata (`title`, `NOINDEX`) and delegation to `ForgotPasswordForm`; no route-owned visual declarations. | Audit the child form's field, button, loading/error and Back roles in its own ledger entry; route itself has no styling migration. | NON-VISUAL ROUTE — form owns UI. |
| `app/(auth)/layout.tsx` | Composes shared Header, Footer and GuestOnly auth gate. | Main and 480px content width use AUTH_LAYOUT_MAIN_SX and AUTH_LAYOUT_CONTENT_SX; no React style prop remains. | MIGRATED — auth shell geometry centralized. |
| `app/(auth)/login/page.tsx` | Route metadata (`Login`, `NOINDEX`) and Suspense boundary around `LoginForm`. | No route-level visual rules; `LoginForm` owns fields, password reveal, submit, errors and loading states and must be audited separately. | NON-VISUAL ROUTE — form owns UI. |
| `app/(auth)/register/page.tsx` | Route metadata and composition of `GuestOnly` with `RegisterForm`. | No route-level visual declarations; inspect the child form's shared field/checkbox/action contracts. The route-level GuestOnly boundary is behavioral, not a styling contract. | NON-VISUAL ROUTE — form owns UI. |
| `app/(auth)/resend-verification/page.tsx` | Route metadata (`NOINDEX`) and delegation to `ResendVerificationForm`. | No route-owned visual declarations; the child form owns fields, Back action, submit and feedback states. | NON-VISUAL ROUTE — form owns UI. |
| `app/(auth)/reset-password/page.tsx` | Route metadata and async `searchParams` handling; passes only a string token to `ResetPasswordForm`. | No route-level visual declarations; child form owns password fields, requirements, submit/Back actions and feedback states. | NON-VISUAL ROUTE — form owns UI. |
| `app/(auth)/verify-email/page.tsx` | Route metadata and async `searchParams` handling; passes only a string token to `VerifyEmailForm`. | No route-level visual declarations; child form owns Card surface, status/feedback and action styling. | NON-VISUAL ROUTE — form owns UI. |
| `app/(public)/about/AboutPage.module.css` | Page/container and image-row structure; page padding, colors, image-row gaps, decorative heading shadow and editorial typography consume theme-generated `--ht-*` variables; responsive stacking is unique layout. | Remaining page-specific image frame padding/margins and composition geometry are intentionally local; shared editorial typography values are owned by `ABOUT_EDITORIAL_TYPOGRAPHY` in `src/constants/ui/typography.ts`. | PARTIAL — editorial typography centralized; unique page/image geometry retained for separate review. | |
| `app/(public)/about/page.tsx` | SEO metadata and semantic content hierarchy remain; image dimensions/sizes use the named `aboutIllustration` preset. | Next Image instances consume `.aboutPageImage`, `.aboutPageImageWide`, `.aboutPageImageMarkers` and `.aboutPageImageRow` classes; responsive max widths and image frame geometry remain owned by AboutPage.module.css. | MIGRATED — no React style prop remains; unique editorial image composition retained. |
| `app/(public)/layout.tsx` | Shared Header/Footer composition; pages own their `<main>`. | Flex-fill wrapper uses `.publicLayoutContent` in PublicLayout.module.css; preserves footer-at-bottom behavior without React style transport. | MIGRATED — structural shell rule is CSS Module-owned. |
| `app/(public)/privacy-policy/LegalPage.module.css` | Page/content surface, text, border, link and TOC radius use selected `--ht-*` variables; CSS Module appropriately owns legal-document layout and anchor scroll offsets. | Local padding/margins/gaps, fixed font-size/line-height, and Back-link padding/skin remain; classify reusable spacing/typography and migrate to tokens. The `.legalPageBack` anchor is a separate native Back visual contract that must align with shared Back semantics without losing link navigation. | CHANGE REQUIRED. |
| `app/(public)/privacy-policy/page.tsx` | SEO metadata and long-form terms/privacy content remain data-driven; document structure is owned by LegalPage.module.css. | Return anchor keeps native href navigation and now consumes LEGAL_BACK_LINK_SX from the shared button preset owner; legal document typography/layout remains page-specific. | MIGRATED — legal return action centralized; no React style transport. |

| `src/components/admin/AdminUserForm.tsx` | Save uses `BUTTON_STYLES.save`; Delete uses semantic `BUTTON_STYLES.deleteText`; Back uses shared `BackButton` with named `ADMIN_USER_FORM_BACK_SX`; panel and password field stack use named admin/layout presets. | Verify admin/manager field visibility, PasswordField/PasswordRequirements states, Switch/Select states, save/delete pending and confirmation behavior; no component-local button skin remains. | PARTIAL — action and panel roles centralized; field/state parity remains open. |
| `src/components/auth/ForgotPasswordForm.tsx` | Send reset link uses semantic `BUTTON_STYLES.submit`; Back to login uses shared `BackButton` with `AUTH_FORM_BACK_BUTTON_SX`; form/title/back-row use named auth presets; CAPTCHA and TextField remain shared/theme components. | Verify CAPTCHA reset/disabled behavior, field error/helper/focus states and submit pending state; no local action or back-navigation geometry remains. | PARTIAL — Submit/Back/form layout centralized; field/CAPTCHA state parity remains open. |
| `src/components/auth/LoginForm.tsx` | Login uses semantic `BUTTON_STYLES.submit`; Register/Forgot Password/Resend Verification links use `navigationSecondary`; password reveal uses `ICON_ACTION_STYLES.passwordVisibility`; form/title/action row use named auth presets. | Verify TextField error/helper/focus states, CAPTCHA lifecycle, password visibility and submit/disabled parity; no component-local secondary action alias remains. | PARTIAL — action/icon roles centralized; field/CAPTCHA/state parity remains open. |
| `src/components/auth/ResendVerificationForm.tsx` | Resend verification uses semantic `BUTTON_STYLES.submit`; Back to login uses shared `BackButton` with named auth back-action geometry; form/title/CAPTCHA use shared auth components/presets. | Verify email field error/helper/focus states, CAPTCHA reset/disabled behavior and submit pending state; no local action or Back geometry remains. | PARTIAL — Submit/Back roles centralized; field/CAPTCHA state parity remains open. |
| `src/components/auth/ResetPasswordForm.tsx` | Reset password uses semantic `BUTTON_STYLES.submit`; success-state Go to login uses `BUTTON_STYLES.navigationLink`; Back to login uses shared `BackButton`; form/title and back row use named auth presets; PasswordField/PasswordRequirements are shared. | Verify password field error/helper/focus states, token error/success state, redirect and submit pending/disabled parity; no local action geometry remains. | PARTIAL — Submit/navigation/Back roles centralized; field/requirements/state parity remains open. |
| `src/components/trips/EditTripLayout.tsx` | Set/Change Day and Edit Your Trip use semantic `BUTTON_STYLES.edit`; day decrement/increment use shared stepper roles; image delete uses `ICON_ACTION_STYLES.danger` plus named overlay geometry; Back uses shared `BackButton`. | Parent grid, map frame, form panel, heading, day/price rows, action row, image section/grid/tile and placeholder frame use named EDIT_TRIP_* presets. Field/error state consistency and shared field adoption remain open. | PARTIAL — action roles and route-specific geometry centralized; field/state audit remains. |
| `src/components/trips/TripDetails.tsx` | MUI Card inherits the shared surface; header, title, price, metadata, description, action and social-row presentation use `trip-details.ts`; currency/description IconButtons use `ICON_ACTION_STYLES.base`; Back uses shared `BackButton`. | No component-local visual owner remains; verify full responsive/caller parity and shared field/feedback states where applicable. | MIGRATED — trip details presentation and action composition centralized. |
| `src/components/trips/TripForm.tsx` | Uses semantic `create`, `add` and `addPoints` action roles; day stepper uses named increment/decrement contracts; Back uses shared `BackButton`; form, upload and action geometry consume named presets. | Field-state/theme contract, upload/remove actions, loading/disabled/focus parity and full caller verification remain open. | PARTIAL — action roles centralized; form/field and state audit remains. |

| `src/components/admin/AdminNavigation.tsx` | Admin nav links are Next links rendered as MUI Buttons. | Container uses ADMIN_NAVIGATION_SX; active/inactive appearance remains explicit MUI contained/text and primary/inherit states. | MIGRATED — navigation layout and states have explicit owners. |
| `src/components/admin/AdminUsers.tsx` | Card/CardContent surface inherits `MuiCard`; card content, identity and action row use named `ADMIN_USER_CARD_*` presets; Avatar uses shared profile-image presets; Edit uses `BUTTON_STYLES.edit`, Delete uses semantic `BUTTON_STYLES.deleteText`, and Previous/Next use `ADMIN_PAGINATION_BUTTON_SX`; preview delegates to ImageLightbox. | Verify all role-visibility, delete-confirmation, mutation and responsive states; no local card/avatar/pagination style object remains. | PARTIAL — presentation roles centralized; caller/state parity remains open. |
| `src/components/auth/Captcha.tsx` | Third-party widget owns its internal appearance; wrapper disabled/loading state consumes `getCaptchaContainerSx(disabled)` from the shared form preset owner. | Verify provider load/unavailable/error states and responsive widget sizing; no component-local sx object remains. | PARTIAL — wrapper state preset-owned; third-party/provider state parity remains open. |
| `src/components/common/PasswordRequirements.tsx` | Requirement list and item layout use `PASSWORD_REQUIREMENTS_LIST_SX` / `PASSWORD_REQUIREMENT_ITEM_SX`; invalid icon uses `PASSWORD_REQUIREMENT_INVALID_ICON_SX`; success/secondary colors use MUI palette semantics. | Verify responsive two-column layout and all direct consumers; no local visual sx object remains. | PARTIAL — layout and feedback tokens centralized; consumer/state parity remains open. |
| `src/components/common/NotFound.module.css` | Text colors and spacing partially consume --ht-* CSS variables. | Home CTA still defines local background, padding, margin and border; page background image/position/cover and layout are unique composition but need documented ownership. | CHANGE REQUIRED — shared action visual values are partly local. |
| `src/components/home/HomeHero.tsx` | WelcomeHeading owns shared home heading composition. | Intro typography and 850px content width use HOME_HERO_INTRO_SX, composed from HOME_INTRO_SX. | MIGRATED — no React style prop or local visual object remains. |
| `src/components/home/HomeTrips.tsx` | Heading consumes HOME_HEADING_SX; trip listing delegates to shared TripList. | Heading remains a semantic h3 and uses the shared heading preset; no local visual declaration remains. | MIGRATED — heading/list composition uses shared owners. |
| `src/components/images/ImageGallery.module.css` | Gallery row/stack/grid layout and image-button structure are CSS Module-owned; spacing and radius consume `--ht-spacing-*` / `--ht-shape-border-radius`; focus-visible outline consumes shared `--ht-focus-outline-*` variables. | Native button reset, transparent background, clipping/overflow and aspect-ratio frame remain unique structural composition; image frame and overlay parity are tracked in ImageGallery/AppImage entries. | PARTIAL — structure and shared visual tokens centralized; unique frame/caller parity remains. |
| `src/components/layout/Footer.module.css` | Text color uses inherit; footer primary/inverse colors consume --ht-* variables. | Horizontal padding and footer spacing remain hardcoded; verify footer/header surface and shell visual role consistency. | PARTIAL — colors centralized through CSS variables, spacing incomplete. |
| `src/components/layout/Footer.tsx` | Footer behavior is isolated to iOS landscape scroll compatibility; visual skin is Footer.module.css. | Horizontal padding now consumes `--ht-spacing-footer-horizontal` emitted from UI_SIZES.footerHorizontalPadding; colors use shared CSS variables. | MIGRATED — footer visuals consume centralized tokens; iOS scroll behavior unchanged. |
| `src/components/layout/Header.tsx` | Header root/welcome/menu/toolbar/drawer Paper/nav layout use HEADER_* presets; navigation actions use BUTTON_STYLES.navigation. | Responsive state, route visibility and handlers remain component-owned; no local presentation object remains. | MIGRATED — application shell presentation centralized. |
| `src/components/placeholders/SocialObjectPlaceholder.tsx` | Placeholder colors consume UI_COLORS semantic tokens; image asset selection is data/state driven. | Overlay gradient, typography sizes, image object-fit style and geometry are local; React style on Next Image is a presentation exception candidate requiring approved abstraction. | PARTIAL — color tokens used, overlay contract remains local. |
| `src/components/trips/PointsSection.tsx` | Pure composition wrapper delegates selected point rendering to PointSection. | No visual skin of its own; selected-point section wrapper is semantic structure only. Child surface is owned by PointSection. | PARTIAL — composition only; consumer trace required. |
| `src/components/trips/TripDetailsView.tsx` | Uses CSS Module for unique trip-detail layout; sticky social controls consume STICKY_SOCIAL_SX and spacing token PAGE_CONTENT_PADDING. | Sticky shell geometry/background and component composition remain local; actual surfaces are delegated to TripDetails, gallery, comments and map children; no Card/Paper here. | PARTIAL — composition/layout owner; child surface contracts remain to audit. |
| `src/components/common/ConfirmDialog.tsx` | Uses MUI Dialog; its Paper inherits `MuiDialog.paper` → `getSurfaceStyles`. | Cancel and Confirm are direct MUI Buttons with the same primary/contained props; semantic roles, button states and dialog content spacing remain uncentralized. | PARTIAL — Dialog surface is centralized, action roles and layout remain. |
| `app/api/og/trips/[id]/route.ts` | Server route parses trip/day parameters, loads OG data and delegates image generation to `renderTripOgImage`; sets immutable cache headers. | No UI or CSS declarations in the route. Visual implementation is in the supporting renderer `src/lib/images/renderTripOgImage.tsx`; route cache/data behavior is not a styling concern. | STRUCTURAL — server image endpoint only. |
| `app/error.tsx` | Global route error uses MUI Alert and Typography; retry action is a MUI Button. | Page layout uses GLOBAL_ERROR_PAGE_SX and retry uses BUTTON_STYLES.primary; Alert severity inherits MUI defaults. | MIGRATED — global error composition/action centralized. |
| `app/not-found.tsx` | Delegates the entire not-found experience to the existing `src/components/common/NotFound`. | No local styles or controls; visual work belongs to `NotFound.tsx` and `NotFound.module.css`, already inventoried. | STRUCTURAL — route wrapper only. |
| `app/opengraph-image.tsx` | Uses centralized SEO image dimensions and delegates rendering to `renderTripOgImage`; exports Next metadata-image properties. | No local visual declarations. The shared renderer owns the OG composition and its Satori/ImageResponse styles; review that dependency separately. | STRUCTURAL — metadata image entry point. |
| `app/robots.ts` | Uses centralized site URL and emits crawler rules plus sitemap/host references. | No UI, CSS, tokens or visual state. | STRUCTURAL — SEO metadata route, not a styling consumer. |
| `app/sitemap.ts` | Uses SEO constants, API data, trip indexability builder and absolute URL helper; includes public static routes and indexable trip URLs. | No UI or CSS declarations; sitemap data generation is outside the visual system. | STRUCTURAL — SEO metadata route, not a styling consumer. |
| `app/twitter-image.tsx` | Uses centralized SEO image dimensions and delegates rendering to the same `renderTripOgImage` implementation as Open Graph. | No local visual declarations; shared renderer owns the visual output. | STRUCTURAL — metadata image entry point. |
| `src/components/admin/index.ts` | Barrel exports seven admin feature components (dashboard, users, user form, failed logs, route-not-found logs, images and reports). | No component implementation, style declaration or runtime wrapper. Styling consumers remain the exported component files, already individually inventoried. | STRUCTURAL — export surface only. |
| `src/components/auth/GuestOnly.tsx` | Auth guard checks auth status, redirects authenticated users and renders children only for guests. Used by the auth route layout. | Returns null during loading/authenticated redirect; no visual wrapper or local styling. | STRUCTURAL — access guard only. |
| `src/components/auth/RequireAuth.tsx` | Auth guard redirects anonymous/account-error visitors to login with a return path and renders children only when authenticated; used by account layout. | Returns null while unauthenticated/loading; no visual wrapper or local styling. | STRUCTURAL — access guard only. |
| `src/components/auth/RequireRole.tsx` | Role guard checks authenticated permissions and delegates unauthorized rendering to shared `NotFound`; used by admin layout. | No local styles; unauthorized surface is owned by the already-inventoried NotFound component/module. | STRUCTURAL — access guard with delegated NotFound UI. |
| `src/components/auth/RequireTripOwner.tsx` | Uses auth state, query of the current user's trips, moderator role and redirect to trip details when ownership is not allowed; wraps children only after access is resolved. | No loading panel, card or local visual styles; returns null until allowed. | STRUCTURAL — authorization/UI-visibility guard only. |
| `src/components/auth/index.ts` | Barrel exports auth guards, forms, profile image and CAPTCHA components. Account/admin layouts import guards through this module. | No rendered component or visual declaration; note `GuestOnly` is imported directly by the auth layout and is not re-exported here. | STRUCTURAL — export surface only. |
| `src/components/common/TabSyncListener.tsx` | Subscribes to cross-tab events and redirects to login after email verification; mounted behavior only. | Returns null and declares no UI, CSS or visual state. | STRUCTURAL — side-effect listener only. |
| `src/components/home/index.ts` | Barrel exports `HomeHero`; consumers receive the existing feature component. | No rendered UI or styling declarations; visual implementation is in the already-inventoried `HomeHero.tsx`. | STRUCTURAL — export surface only. |
| `src/components/images/index.ts` | Barrel exports `AppImage`, `ImageLightbox` and `ImageGallery`. | No rendered UI or style declarations; image presets and the three exported implementations are inventoried separately. | STRUCTURAL — export surface only. |
| `src/components/placeholders/index.ts` | Barrel exports `SocialObjectPlaceholder`. | No rendered UI or styling declarations; visual implementation is in the already-inventoried placeholder component. | STRUCTURAL — export surface only. |
| `src/components/placeholders/socialObjectPlaceholderAssets.ts` | Central list of five public SVG placeholder asset paths (mountain, beach, city, garden and fields); component selects from this data. | Contains asset references only, not SVG markup, colors, sizing or component styling. Visual treatment remains in `SocialObjectPlaceholder.tsx` and the SVG files themselves are outside this TS/CSS candidate filter. | DATA — asset registry, not a style owner. |
| `src/components/tracking/index.ts` | Barrel exports `LiveTracker`. | No rendered UI or style declarations; visual implementation and action controls are in the already-inventoried `LiveTracker.tsx`. | STRUCTURAL — export surface only. |
| `src/lib/images/renderTripOgImage.tsx` | Supporting dependency outside the DOM candidate set; centralizes Open Graph/Twitter image output through Next ImageResponse (Satori). | Its JSX `style` objects are renderer input required by ImageResponse; CSS Modules, browser stylesheets and MUI sx do not participate in this server-side rasterization. SEO_BRAND and OG dimensions are already centralized. The user-approved exception is limited to renderer-only style objects in this exact file. | APPROVED EXCEPTION — Satori/ImageResponse renderer only; approval recorded in Section 11.58. |

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

**NEXT TASK — continue the full Stage 1 repository-wide consumer inventory (not a button-only task):**

- Follow Section 7's complete search matrix across the remaining current-branch UI files: semantic actions and icon actions; Card/Paper/Dialog/Box/custom surfaces; all field families; image roles and overlays; CSS variables/tokens/preset exports; React style and inline sx; raw visual literals; interaction states and responsive rules.
- Finish the exact BackButton / BUTTON_STYLES property and caller map as one workstream, alongside—not instead of—the surface, field, image, token, CSS and styling-API workstreams.
- Inspect every result through its component and all call sites; record exact paths/line references, semantic role, current owner, remaining duplication and status. Do not infer completion from imports alone.
- Reconcile all inspected files in Sections 10 and 10.1. Keep Stage 1 open until every UI-bearing file and the required consumer maps are accounted for.
- Do not migrate application source until Stage 1's inventory is exhaustive. Do not run build, tests, lint, CI or browser validation without explicit user authorization.


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

#### Repository-wide action inventory — additional current-branch inspection batch

This batch used the current branch's recursive Git tree and exact blob SHAs, then inspected the source files directly. The branch HEAD at inspection time was `567d82963d5c8c6bf116c23a161e31a389c14eda`. These are observed matches, not a claim that Stage 1 is complete.

**Additional direct MUI Button / IconButton / native control call sites**

- Admin:
  - `src/components/admin/AdminFailedLogs.tsx:88,143,149` — direct action and previous/next pagination Buttons.
  - `src/components/admin/AdminImages.tsx:72,76,103,109,142,146,249,256,352,359` — pagination plus image/admin actions; `:372` raw IconButton close action. Also local layout and Dialog sx remain.
  - `src/components/admin/AdminNavigation.tsx:36` — direct navigation Button; active/inactive appearance remains locally decided, with wrapper sx at `:22`.
  - `src/components/admin/AdminReports.tsx:88,113,119` — direct action and repeated pagination Buttons.
  - `src/components/admin/AdminRouteNotFoundLogs.tsx:127,158,164` — direct row action and pagination Buttons.
  - `src/components/admin/AdminUserForm.tsx:248,306,312-313,327` — direct action, shared save/danger presets and BackButton; local wrapper sx remains.
  - `src/components/admin/AdminUsers.tsx:169,174,205,211` — direct user edit/action and repeated pagination Buttons.
  - The admin route page files inspected (`app/(admin)/admin/{failed-login-logs,images,reports,route-not-found-logs,users,users/[userId]}/page.tsx`) did not contain direct action controls; actual controls are in the imported admin components above.
- Comments and replies:
  - `src/components/comments/CommentsSection.tsx:276,286,365,379,410,475,491` — multiple raw IconButtons for distinct comment/reply actions. Also React `style` on the list at `:223`; local visual sx is present throughout the component.
  - `src/components/comments/CommentsToggle.tsx:36` — raw IconButton; React `style` wrapper at `:26`.
  - `src/components/comments/RepliesSection.tsx:169,179,225,239,289,300` — raw IconButtons for reply actions.
- Common/layout:
  - `src/components/common/ConfirmDialog.tsx:54,57` — No/Yes are both direct contained-primary Buttons; semantic Cancel vs Confirm remains unresolved.
  - `src/components/common/ExpandableText.tsx:54` — disclosure Button.
  - `src/components/common/NotFound.tsx:50` — native Home CTA button, with CSS Module skin.
  - `src/components/common/PasswordField.tsx:43` — reveal/hide password adornment IconButton.
  - `src/components/layout/Header.tsx:87,99,109,142,148,181` — direct navigation/account Buttons; `:119` raw IconButton; local `NAV_BUTTON_SX` and layout sx remain.
- Social and image controls:
  - `src/components/social/LikeButton.tsx:81`, `FavoriteButton.tsx:63`, `EngagementBar.tsx:169` — raw social IconButtons; preserve social-specific interaction states while sharing the base icon-control contract.
  - `src/components/social/TripGroupSocialActions.tsx:111,140,164,191` — several raw IconButtons for separate group social roles.
  - `src/components/social/ReportButton.tsx:89,117-118` — report IconButton and Cancel/Submit dialog Buttons; React `style` spans at `:88,126,133`.
  - `src/components/images/ImageLightbox.tsx:76,98,112` — close/previous/next or zoom-style overlay IconButtons; overlay geometry is specialized, but base hit target/focus/disabled semantics should be shared.
  - `src/components/images/ImageUploadField.tsx:277,295,307` — image remove/reorder and upload actions.
  - `src/components/CustomFileUploadButton.tsx:35,58` — upload adornment IconButton and Button-as-label upload action.
- Trips and maps:
  - `src/components/maps/AddressAutocomplete.tsx:153` — direct map-search Button.
  - `src/components/maps/PointLocationPicker.tsx:171,179` and `TripLocationPicker.tsx:134` — map picker actions use shared primary/secondary presets, with additional local sx composition.
  - `src/components/trips/TripCard.tsx:259,265` — direct MUI Stepper previous/next Buttons; `:300` shared primary action.
  - `src/components/trips/TripActions.tsx:76,84,101,111,129` — trip action Buttons use trip-specific and danger presets.
  - `src/components/trips/TripForm.tsx:405,414,574,583,594,605` — day increment/decrement, primary/secondary and BackButton roles.
  - `src/components/trips/EditTripLayout.tsx:342,351,361,481,492,543` — direct and shared action controls plus a raw IconButton.
  - `src/components/trips/TripDetails.tsx:130,177,223` — currency-info and another icon action, plus shared BackButton. React `style` props occur at `:106,121,124,139,143,147,152,200`; these are policy-audit targets and must be classified/migrated safely, not mechanically rewritten.
  - `src/components/points/EditPointPage.tsx:222` — raw IconButton; page-level local sx remains.
- Auth:
  - `src/components/auth/ChangePasswordForm.tsx:129` — primary submit action.
  - `ForgotPasswordForm.tsx:81,91`, `ResendVerificationForm.tsx:81,91`, `ResetPasswordForm.tsx:90,123,133` — submit/navigation actions and BackButton; ResetPassword's success Button at `:90` is direct contained.
  - `LoginForm.tsx:110,132,142,145,153` — reveal IconButton, primary and secondary/navigation Buttons.
  - `ProfileForm.tsx:117,126,127` — primary, Back and secondary actions.
  - `RegisterForm.tsx:215,225,234` — primary and secondary/navigation actions.
  - `VerifyEmailForm.tsx:85` — primary action.
- No direct Button/IconButton/native button match was found in the four map picker/view files other than AddressAutocomplete and the two picker action files above, or in GoogleMapView.

**Additional React `style` policy violations / migration targets**

- `src/components/comments/CommentsSection.tsx:223` — inline list style object.
- `src/components/comments/CommentsToggle.tsx:26` — inline wrapper layout style.
- `src/components/social/ReportButton.tsx:88,126,133` — inline span/error/visually-hidden styles; classify semantic/accessibility styling before migration.
- `src/components/trips/TripDetails.tsx:106,121,124,139,143,147,152,200` — shared-looking typography/line styles expressed via React `style`; move to approved typography/layout tokens or presets after confirming exact consumers.
- Previously recorded: `src/components/trips/PointSection.tsx` has a React `style` prop around line 78.
- These are newly confirmed occurrences, not an exhaustive repository-wide `style=` audit. Do not bulk-replace runtime or accessibility-sensitive styling without understanding its behavior.

**Inventory status and decisions**

- This batch expands the action inventory across admin, comments/replies, auth, header, image overlays/uploads, maps, trips and points.
- It confirms the same semantic action families are implemented by direct MUI Buttons, raw IconButtons, native buttons, shared presets and CSS Modules. The design-system API must distinguish semantic role (e.g. Cancel vs Confirm, Edit vs Delete, Back vs Secondary, Upload vs Primary, Disclosure vs Navigation) from the underlying MUI control.
- Repeated admin pagination Buttons are a clear candidate for one named pagination action contract; do not change them until all admin pagination consumers and disabled/loading/focus states are mapped.
- The full `.ht-button` / `.ht-button--danger` consumer set is still not established. Keep the selectors and do not claim CSS-backed action inventory complete.
- Card/Paper/surface and form-field consumer maps remain open. Stage 1 remains IN PROGRESS; no application source was changed and no validation commands were run.

#### Mandatory start-of-batch instruction for every future NEXT TASK

**Before touching source code, the next AI/developer MUST:**

1. Re-read `docs/CSS_DESIGN_SYSTEM_AUDIT.md` in full or at minimum the target architecture, styling API policy, relevant file ledger entries, current stage, latest audit log and exact `NEXT TASK`.
2. Explicitly inspect the target architecture in Sections 1-3 and the relevant contracts in Sections 7-9. Do not begin edits based only on the task title or a remembered summary.
3. Confirm current branch and HEAD; compare with the last recorded HEAD and re-fetch every target file from the current branch.
4. Decide whether the optimal scope is a whole-app component/call-site search, one end-to-end flow, or file-by-file migration. Record the chosen scope and why in the audit log.
5. Only then make changes that conform to the documented token/theme/preset/CSS Module ownership rules and styling API policy. Never introduce ad hoc `sx`, React `style`, duplicate CSS values or a second visual contract.
6. After the batch, update this same document's file-level ledger, findings, verification status and `NEXT TASK`. The next task must repeat this mandatory preflight instruction before any subsequent work.
7. Do not create another audit document, branch, or parallel plan. Do not run build/tests/lint/CI unless the user explicitly authorizes them.

#### NEXT TASK

Continue Stage 1 and finish the action consumer map. Prioritize the remaining repository-wide `.ht-button` / `.ht-button--danger` consumer trace, exact BackButton and `BUTTON_STYLES.*` caller map, remaining UI-bearing files and nested shared-component callers. Then complete Card/surface/Paper and form-field consumer maps. Do not start application-source migration until the action inventory is exhaustive and recorded.



---

## 11.1 — CSS organization and current-branch consumer scan (2026-11-18)

### Mandatory preflight performed
- Re-read this document before work, including the target CSS architecture, styling API policy (Section 1.4), search matrix (Section 7), safe migration rules (Section 9), file ledger (Section 10.1) and exact NEXT TASK.
- Verified branch: `feature/frontend-modernization`.
- Verified current HEAD: `6384a2a923a925a7b40e254682d2538d03b8810c`.
- Compared current HEAD with audit baseline `f77d0cff2f98298279273d0d15a27b7a236a2dd7`: 11 commits ahead, 0 behind; the only changed paths are `docs/ARCHITECTURE.md` and `docs/CSS_DESIGN_SYSTEM_AUDIT.md`. No application source changes have landed since the baseline.
- Confirmed the current recursive tree contains 246 TS/TSX/JS/JSX/CSS paths under `app/` and `src/`; the nine CSS files in the stylesheet inventory were fetched and read from this branch.

### CSS ownership architecture — verified against actual source
The intended dependency direction remains correct and must be preserved:

```text
src/constants/ui/*                 # canonical semantic values
        ↓
src/theme/*                         # MUI defaults/overrides + selected --ht-* variables
        ↓
src/styles/presets/*                # reusable semantic sx/layout/typography contracts
        ↓
src/components/*                    # feature composition and unique layout only

app/globals.css + *.module.css      # minimal shell / unique structure;
                                    # shared visual values consume --ht-* variables
```

Confirmed implementation:
- `src/theme/index.ts` builds one MUI theme from UI token modules and emits a manually selected set of `--ht-*` variables through `MuiCssBaseline`.
- `src/theme/components/button.ts` owns shared MUI Button typography and radius; it does not yet define semantic button role variants/states.
- `src/theme/components/card.ts` and `dialog.ts` use `getSurfaceStyles`; this proves MUI Card and Dialog Paper adoption only, not all Paper/custom surfaces.
- `src/theme/components/text-field.ts` only sets TextField variant/size defaults. Field visuals and states are not yet a complete centralized contract.
- `src/styles/presets/buttons.ts` currently defines `primary`, `save` (alias of primary), `primaryWide`, `danger`, `dangerText`, `secondary`, `back` (alias of secondary), `secondaryLightText`, `createTrip`, `tripAction`, `tripActionDanger`, `dayIncrement` and `dayDecrement`. The approved semantic roles Edit, Add, Remove, Cancel, Confirm, Navigation, generic Icon action and Pagination/stepper are not yet consistently represented. Do not flatten all roles into one visual preset.
- `src/styles/presets/cards.ts` mixes reusable card content/layout geometry with some semantic text/action spacing; MUI surface skin remains in the theme. Separate layout from visual skin during later migration rather than blindly moving every property.
- `src/styles/presets/layouts.ts` contains shared page/list/comment layouts and admin/account page composition. It also types some reusable style objects as React `CSSProperties`; consumers still need migration away from the React `style` prop under the approved policy.
- `src/styles/presets/typography.ts` provides shared home/heading style objects, but these are still applied through React `style` in several consumers.
- `src/constants/ui/spacing.ts`, `sizes.ts`, `shape.ts`, `shadows.ts`, `colors.ts` and `typography.ts` are canonical token modules, but CSS-variable exposure is partial. Some CSS Modules still contain independent visual literals.
- MUI theme `cssVariables: true` is not enabled; current CSS interoperability uses a manually maintained `--ht-*` subset. Treat this as an architecture decision to evaluate in Stage 2, not as permission to introduce a second token source.

### Stylesheet-by-stylesheet findings
| Stylesheet | Confirmed ownership / remaining issue |
|---|---|
| `app/globals.css` | Owns app-shell geometry and a separate `.ht-button` / `.ht-button--danger:hover` skin. Button values consume selected `--ht-*` variables, but this remains a parallel native/server-rendered button path beside MUI Button presets. |
| `app/(public)/about/AboutPage.module.css` | Layout and image-row composition are valid module responsibilities; heading font family, weights, responsive font sizes, margins and text shadow are still local visual values. Some colors/spacing already consume CSS variables. |
| `app/(public)/privacy-policy/LegalPage.module.css` | Unique document layout is appropriate; page/content padding, heading/section margins, paragraph typography, TOC spacing and the `.legalPageBack` action skin remain local. The back skin consumes shared radius/color variables only partially. |
| `src/components/common/NotFound.module.css` | `.homeButton` owns a separate CTA skin with literal padding/margin and no shared control/focus contract. |
| `src/components/images/ImageGallery.module.css` | Gaps and radius consume shared variables; grid max-width, aspect ratio and structural positioning are role-specific geometry. Clickable image surfaces need common focus-visible/reset/hit-target treatment, not generic CTA styling. |
| `src/components/layout/Footer.module.css` | Footer padding remains literal; background/text colors consume shared variables. |
| `src/components/trips/TripDetailsView.module.css` | Primarily unique responsive/container/grid composition and should remain a CSS Module. Widths, grid tracks and ordering are structural; repeated margins/gaps should be classified against layout tokens before migration. |
| `src/components/trips/TripList.module.css` | Empty-state typography and margins remain local visual values. |
| `src/components/trips/TripPagination.module.css` | Pagination layout is structural; outer margin remains a literal spacing value. |

### Additional current-branch findings
- Direct route-shell React `style` props remain in `app/(account)/layout.tsx:16`, `app/(admin)/layout.tsx:18`, `app/(auth)/layout.tsx:16-17`, `app/(public)/layout.tsx:10` and `app/(public)/live-tracking/page.tsx:15`. These are layout composition and should move to shared layout contracts or CSS classes, not be converted into arbitrary local CSS.
- Public route style props remain in `app/(public)/page.tsx:27`, `app/(public)/trips/[id]/page.tsx:85`, and `app/(public)/trips/page.tsx:99,113,131,133`. The About page has image style props at lines 47, 73, 92, 100, 119, 127 and 146; classify responsive image geometry separately from reusable image-role styling.
- Further React `style` usage surfaced in `src/components/comments/CommentsSection.tsx:223`, `CommentsToggle.tsx:26`, `ScrambleHeading.tsx:84`, `WelcomeHeading.tsx:46`, `HomeHero.tsx:16`, `HomeTrips.tsx:10`, `AppImage.tsx:61,76`, `SocialObjectPlaceholder.tsx:42`, `TripList.tsx:16-23`, `TripDetails.tsx:106,121,124,139,143,147,152,200`, `PointSection.tsx:78`, `ReportButton.tsx:88,126,133`, `TripGroupSocialActions.tsx:199,204,209`, `useBackground.tsx:287`, and `src/lib/images/renderTripOgImage.tsx` (multiple Satori/OG markup styles). Do not bulk-replace these: dynamic image values, accessibility-hidden/error text, layout composition and Satori-generated image styles require separate classification. The Satori OG renderer is a candidate for a documented renderer-specific exception if its API requires inline style objects; verify before deciding.
- `src/components/trips/PointSection.tsx:78` remains a direct policy violation candidate because it combines a shared text inset preset with an extra local margin through React `style`.
- The current scan found direct MUI Buttons in `app/error.tsx`, `CustomFileUploadButton.tsx`, admin pagination/list actions, auth flows, map pickers, `LiveTracker.tsx`, `TripMapSection.tsx`, `TripForm.tsx`, `TripCard.tsx`, `ConfirmDialog.tsx` and other recorded components. Keep the exact semantic role map in Section 11; this batch does not close the action inventory.
- Shared `BackButton` call sites confirmed in `AdminUserForm.tsx:327`, `ForgotPasswordForm.tsx:91`, `ResendVerificationForm.tsx:91`, `ResetPasswordForm.tsx:133`, `ProfileForm.tsx:126`, `EditTripLayout.tsx:492`, `TripForm.tsx:605`, `TripDetails.tsx:223` and `PointForm.tsx:353`. The shared component still exposes broad MUI props including caller `sx`; the public contract remains open.
- `app/globals.css` contains the `.ht-button` selector, but no consumer was identified in the inspected public trip route/component files (`app/(public)/trips/page.tsx`, `app/(public)/trips/[id]/page.tsx`, `TripDetailsView.tsx`, `TripDetails.tsx`, `TripCard.tsx`). Do not mark the selector dead yet; complete a literal `ht-button` string search over every current-branch source file and document the result before removing or consolidating it.

### Scope decision
The efficient next unit is a **repository-wide component/role trace**, not arbitrary file-by-file migration: finish literal `ht-button` usage and shared action caller sets, then map Card/Paper/custom surfaces and TextField/Select/Autocomplete/Checkbox/Radio/Switch consumers. After those maps are complete, close Stage 1 and begin the approved Stage 2/3 foundation work. No source migration is authorized by this audit batch.

### Status
- Stage 1 remains **IN PROGRESS**.
- No application source files changed.
- No build, tests, lint, CI or browser checks were run.
- No file is marked VERIFIED.
- CSS architecture was reviewed before this batch and must be re-read before every future batch.


## 11.2 — CSS architecture preflight and current-branch action role follow-up (2026-11-18)

### Mandatory preflight and repository state
- Re-read Sections 1-3 (target architecture and ownership), Section 1.4 (styling API policy), Section 6 (approved stages), Section 7 (search matrix), Section 9 (safe migration rules), Section 10.1 (file-level ledger), the current Stage 1 status and exact NEXT TASK before inspecting source.
- Verified branch: feature/frontend-modernization.
- Verified current HEAD: 5ec9164a6071f37feff3141cd1f3a38f1f5e90a1.
- Confirmed the user instruction: do not run build, tests, lint, CI or browser validation unless the user explicitly authorizes it. This restriction remains active.
- Reconfirmed the intended code organization from the current source and audit: src/constants/ui/* owns canonical values → src/theme/* owns MUI defaults/overrides and CSS-variable exposure → src/styles/presets/* owns reusable semantic/layout contracts → feature components consume those contracts. app/globals.css should remain limited to reset/shell and CSS-variable consumers; CSS Modules should own unique structure/responsive composition, not parallel visual skins.
- This batch deliberately chose a cross-component semantic role review rather than a file-by-file migration because the next Stage 1 task is to establish shared action contracts and their consumers. No application source was edited.

### Current-branch files re-fetched and reviewed
- src/components/common/BackButton.tsx
- src/styles/presets/buttons.ts
- src/components/common/ConfirmDialog.tsx
- src/components/admin/AdminNavigation.tsx
- src/components/admin/AdminUsers.tsx
- src/components/trips/TripActions.tsx
- src/components/auth/LoginForm.tsx
- src/components/social/ReportButton.tsx
- app/(account)/my-trips/page.tsx
- app/error.tsx

### Additional exact findings
| File / call site | Observed role | Current implementation / remaining work |
|---|---|---|
| app/(account)/my-trips/page.tsx:29-35 | Create trip CTA | Uses BUTTON_STYLES.createTrip; confirms this preset has at least one route-level consumer. The page also imports shared layout presets, but its local alias declarations/call sites still need complete source verification before marking it centralized. |
| app/error.tsx:14-16 | Retry / recovery action | Direct contained MUI Button with no named semantic recovery role. Add to the action role map; do not automatically equate Retry with Primary/Submit. |
| src/components/common/BackButton.tsx:7-17 | Shared Back role | BackButtonProps is Omit<ButtonProps, 'variant' | 'color'>, so caller sx and broad MUI Button props remain exposed. The component fixes variant="contained" and appends BUTTON_STYLES.back after caller sx, so the preset wins overlapping sx keys. Back is still an alias of Secondary in the preset module. The role API is not yet semantically isolated. |
| src/styles/presets/buttons.ts:6-64 | Central button preset API | Confirmed exported BUTTON_STYLES: primary, save alias, primaryWide, danger, dangerText, secondary, back alias, secondaryLightText, createTrip, tripAction, tripActionDanger, dayIncrement and dayDecrement. There are no dedicated Edit, Add, Remove, Cancel, Confirm, Navigation, Retry, Upload, Disclosure, Pagination or generic IconAction roles. Day increment/decrement currently share the same dayNumberButton object. |
| src/components/common/ConfirmDialog.tsx:54-59 | Cancel / Confirm pair | “No” and “Yes” both use direct contained primary buttons. This remains a semantic mismatch; cancel and confirm must receive distinct shared roles while preserving dialog behavior. |
| src/components/admin/AdminNavigation.tsx:22-48 | Active/inactive navigation | Direct MUI Button variants and colors are selected per item; active/inactive state should be a shared navigation variant/state, not a local duplicate. |
| src/components/admin/AdminUsers.tsx | Admin row actions / pagination / surface | The file imports Card and direct Button; prior matrix has the exact observed lines. The Card surface is theme-backed, but its local geometry and nested actions still need consumer-level verification. |
| src/components/trips/TripActions.tsx:67-137 | Add trip day / edit day / delete day / delete trip | Uses trip-specific presets for add/edit navigation and destructive trip actions. Edit still shares tripAction with Add; semantic intent is not expressed as distinct preset roles. |
| src/components/auth/LoginForm.tsx:110-154 | Password reveal, submit, secondary navigation | Primary submit uses BUTTON_STYLES.primary; Register/Forgot/Resend use secondary. Password reveal uses raw IconButton. This confirms the base icon-action contract and secondary navigation roles are separate gaps. |
| src/components/social/ReportButton.tsx:88-134 | Report / withdraw report / Cancel / Submit | Raw IconButton handles report state; Cancel and Submit use direct Buttons; wrapper and status text use React style. Preserve report-state semantics while later centralizing icon control, dialog actions and the style-prop replacements. |

### Updated action-role conclusions
- The button preset module is a single shared file, but it is not yet a complete semantic role API. Existing aliases (save → primary, back → secondary) hide semantic differences and should be revisited in Stage 3 rather than blindly duplicated during Stage 1.
- BackButton is shared but not a closed semantic API because callers can pass arbitrary MUI props and sx. Keep its navigation destination caller-owned; centralize only the visual role contract.
- ConfirmDialog is a high-value shared flow: fix its Cancel/Confirm visual distinction centrally, without changing its Promise<boolean> behavior.
- Admin navigation, global error recovery, trip management, authentication secondary actions and report controls represent different semantic roles. They should share base control states and tokens, not be flattened into one generic style.
- The current exact BackButton call-site set and all BUTTON_STYLES property consumers remain subject to a final exhaustive cross-repository check. The earlier call-site list is still useful evidence but must not be treated as complete.
- ht-button / ht-button--danger consumer tracing is still not proven exhaustive. The selector is known in app/globals.css; retain it until a current-branch literal consumer search has conclusively established whether it has consumers outside that stylesheet.

### File ledger updates
- src/components/common/BackButton.tsx — PARTIAL; API and preset precedence re-confirmed; semantic alias and unrestricted caller sx remain.
- src/styles/presets/buttons.ts — PARTIAL; current exports re-confirmed; semantic role coverage remains incomplete.
- src/components/common/ConfirmDialog.tsx — PARTIAL; Cancel/Confirm mismatch re-confirmed.
- src/components/admin/AdminNavigation.tsx — PARTIAL; active/inactive styles remain direct MUI props.
- src/components/trips/TripActions.tsx — PARTIAL; Edit/Add semantic distinction remains incomplete.
- src/components/auth/LoginForm.tsx — PARTIAL; submit/secondary presets used, password IconButton remains raw.
- src/components/social/ReportButton.tsx — PARTIAL; report icon and dialog action roles remain raw; React style props remain.
- app/(account)/my-trips/page.tsx — PARTIAL; Create trip preset consumer confirmed; full layout and call-site verification remains.
- app/error.tsx — CHANGE REQUIRED; direct Retry Button needs a named shared recovery role during migration.
- No file is marked VERIFIED.

### Status and next task
- Stage 1 remains IN PROGRESS. No application source files changed.
- No build, tests, lint, CI or browser validation was run, in accordance with the user's explicit instruction.
- The next work batch must continue the full Section 7 matrix across action controls, surfaces, fields, images, tokens/CSS variables, presets, React style/sx, raw visual literals, states and responsive behavior. The action-role trace is only one parallel workstream.
- Continue literal ht-button consumer tracing and the BackButton / BUTTON_STYLES.* map, but also map all Paper/Box/custom surfaces, every form field family and image preset/caller. Do not begin source migration until the complete Stage 1 inventory is exhaustive.

## 11.3 — Full UI consumer inventory expansion (2026-11-18)

### Mandatory preflight and scope
- Re-read Sections 1–3 (ownership architecture and styling API), Section 6 (approved stages), Section 7 (full search matrix), Section 9 (safe migration), Sections 10–11.2 (manifest, ledger and NEXT TASK) before inspecting source.
- Verified branch: feature/frontend-modernization. Current HEAD before this documentation update: 70e0825287e030b097ffb08d3f73a582195ea281.
- Compared audit baseline f77d0cff2f98298279273d0d15a27b7a236a2dd7 with current HEAD: 13 commits ahead, 0 behind. The only changed paths are docs/ARCHITECTURE.md and docs/CSS_DESIGN_SYSTEM_AUDIT.md; application source is unchanged from the audit baseline.
- Reconfirmed the mandatory ownership chain: UI tokens → MUI theme/CSS variables → semantic/layout presets → feature components; globals/CSS Modules own only shell and unique structure. No source migration was started.

### Current-branch source inspection — additional domains
The following exact current-branch files were fetched and scanned for action controls, surfaces, fields, images, sx/style, raw visual values and interaction/layout declarations. Line references below are source line numbers at this HEAD.

| File | New evidence from this batch |
|---|---|
| app/(account)/points/edit/[pointId]/page.tsx; app/(account)/trips/[id]/edit/page.tsx; app/(account)/trips/create/page.tsx; app/(account)/trips/create/points/page.tsx; app/(admin)/admin/failed-login-logs/page.tsx | Route/page wrappers inspected; no direct styling/control matches in these wrappers. Continue tracing imported feature components rather than treating wrappers as completed styling files. |
| src/components/social/LikeAnimation.tsx; src/components/trips/PointsSection.tsx; src/components/auth/GuestOnly.tsx; src/components/auth/RequireAuth.tsx; src/components/auth/RequireRole.tsx | No direct styling/control matches in these files during this pass. These are not evidence that their rendered child components are centralized. |
| src/components/admin/AdminFailedLogs.tsx | Lines 86–149: local Box layout, direct action and pagination Buttons, Checkbox selection, TableContainer Paper using ADMIN_TABLE_CONTAINER_SX and ADMIN_PAGINATION_SX. Map checkbox and pagination states separately from row actions. |
| src/components/admin/AdminImages.tsx | Lines 71–146 and 351–359: repeated direct pagination Buttons; lines 369–386: preview Dialog and locally positioned IconButton; lines 218–326: local status/spacing and image/table sx; lines 277/296: Checkbox. Admin table/pagination presets exist but do not centralize all controls or preview geometry. |
| src/components/admin/AdminReports.tsx | Lines 67–119: Paper table uses ADMIN_TABLE_CONTAINER_SX; direct row action and pagination Buttons remain. |
| src/components/admin/AdminRouteNotFoundLogs.tsx | Lines 44–71: local typography, radius and panel spacing; line 102 Paper table preset; lines 127–164 direct action/pagination Buttons and local disclosure sx at line 140. |
| src/components/admin/AdminUserProfileImage.tsx | Lines 54–107: shared column layout and AppImage, but local zoom-trigger dimensions and direct upload/remove actions remain. |
| src/components/auth/ChangePasswordForm.tsx | Line 98 shared account field preset; lines 129–134 primary button preset with additional local margin/alignment. Shared preset use is partial, not full file centralization. |
| src/components/auth/VerifyEmailForm.tsx | Lines 65–88: MUI Card, local heading typography and primary Button preset. Surface skin is theme-owned; content geometry/heading and field contract remain to verify. |
| src/components/auth/RegisterForm.tsx | Lines 121–154 and 193–239: shared auth form/title/action presets and primary/secondary button presets; TextFields and Checkbox still require base field/checkbox state mapping; locked-state pointer-events sx is local behavior styling. |
| src/components/auth/ProfileForm.tsx | Lines 71–131: shared account field preset, BackButton and primary/secondary presets; multiple local field/heading sx and caller-level action layout remain. |
| src/components/auth/ProfileImage.tsx | Lines 67–164 and 212–256: AppImage/Dialog and some shared color/shadow tokens; local image frame sizes/radii, overlay/IconButton positions, thumbnail sx and control states remain. |
| src/components/maps/AddressAutocomplete.tsx | Lines 97–172: TextField + Autocomplete, local inputSx/containerSx and direct Button; map address field must be a named variant inheriting the base field contract. |
| src/components/maps/GoogleMapView.tsx | Lines 97–107: wrapper grid/flex geometry only; no direct action/field/surface skin found in this pass. |
| src/components/maps/PointLocationPicker.tsx | Lines 110–194: primary/secondary button presets coexist with local map layout/position sx; preserve map-specific geometry while centralizing action skin. |
| src/components/maps/TripLocationPicker.tsx | Lines 61–139: primary/secondary preset use plus local layout/position sx; verify map field/action state parity. |
| src/components/trips/TripSelectField.tsx | Lines 49–101: TextField and Autocomplete consumers rely on MUI defaults at call sites; they must inherit the central base field contract without feature-local skins. |
| src/components/CustomFileUploadButton.tsx | Lines 35–58: raw IconButton and contained Button component=label; upload and generic icon-action roles remain separate centralization targets. |
| src/components/images/AppImage.tsx | Lines 61–76: AppImage computes and applies resolved style internally from a named preset. Treat this as the implementation boundary of the image abstraction; audit every preset and caller, and do not misclassify consumer-level React style prohibition as permission to add style props to AppImage. |
| src/components/images/ImageGallery.tsx | Lines 56–85: AppImage usage with local sx; compare all frame/thumbnail roles with named image presets and CSS Module structure. |
| src/components/images/ImageLightbox.tsx | Lines 50–138: Dialog/AppImage plus several IconButtons with local positioning, z-index and control sx; centralize lightbox control skin while retaining unique overlay geometry. |
| src/components/images/ImageUploadField.tsx | Lines 198–311: local layout sx, thumbnail dimensions/objectFit/radii, raw remove/delete-all IconButtons and upload Button; image/upload roles and icon actions remain incomplete. |
| src/components/common/ExpandableText.tsx | Lines 40–54: local sx and direct disclosure Button; define shared expanded/collapsed control state and semantic role. |
| src/components/common/NotFound.tsx | Line 50: native Home button; map with NotFound.module.css to shared navigation/action role. |
| src/components/common/NotificationProvider.tsx | Line 113: width-only sx surfaced; Snackbar/Alert global state and theme parity still need inspection. |
| src/components/common/PasswordField.tsx | Lines 30–43: TextField plus raw password-reveal IconButton; field contract and icon-action contract are distinct gaps. |
| src/components/common/WelcomeHeading.tsx | Lines 31–46: local layout/heading sx and React style prop on h1 despite shared HOME_HEADING_STYLE; migrate the presentation style after full inventory. |
| src/components/comments/CommentsSection.tsx | Lines 43–53 local style constants; line 204 comments Card preset; lines 223, 313 React style props; lines 254–503 repeated Card/TextField/IconButton and local spacing. Preserve distinct comment edit/delete/reply/report roles. |
| src/components/comments/CommentsToggle.tsx | Lines 26–36: React style prop on wrapper, local heading margin and IconButton disclosure control. |
| src/components/comments/RepliesSection.tsx | Lines 147–300: TextFields and repeated raw IconButtons for reply/edit/delete/cancel/submit, plus local border/spacing sx. |
| src/components/social/EngagementBar.tsx | Lines 100–169: responsive/local sx and raw IconButton; verify all engagement action states and callers. |
| src/components/social/TripGroupSocialActions.tsx | Lines 106–209: multiple raw IconButtons, local gaps and React style error spans; preserve like/favorite/report distinctions while sharing icon-action and feedback contracts. |
| src/components/tracking/LiveTracker.tsx | Lines 15–135: local TRACKING_SURFACE_SX, direct Start/Stop/Reset/Follow Buttons, status/details sx; distinguish tracking state actions and tracking-specific surface from generic card skin. |
| src/components/trips/TripDaysNav.tsx | Lines 23–84: PAGE_ITEM_SX used by PaginationItem, but local item/outer margins remain; selected/disabled/focus states need verification. |
| src/components/trips/TripFilters.tsx | Lines 35–85 and 135–222: feature-owned SELECT_BOX_SX/FILTER_LABEL_SX/FILTER_SELECT_SX consumed by three Select fields; centralize the base field contract and keep only a named trip-filter variant where necessary. |
| src/components/trips/TripMapSection.tsx | Lines 111–163: Card local sx and direct previous/next Buttons; map navigation is a distinct semantic role over the shared control base. |
| src/components/trips/DayImagesGallery.tsx | Line 37: local width/maxWidth/aspect-ratio image container; compare with gallery image role and keep only unique geometry. |

### Cross-domain conclusions
- This batch confirms the audit cannot be executed as a button-only workstream. The same UI files contain coupled surface, field, image, responsive and styling-API concerns that must be inventoried together.
- Shared preset imports are partial adoption evidence only. For example, Admin tables still have direct pagination/actions; auth forms use shared button presets but local field/layout sx; map pickers use shared primary/secondary roles but retain map geometry; image upload/lightbox controls still define local icon geometry.
- React style findings from this batch include WelcomeHeading, CommentsSection, CommentsToggle and TripGroupSocialActions. AppImage's resolved style is internal to the named image abstraction and must be evaluated as an abstraction boundary, not treated as a blanket exception for feature consumers.
- No source files were changed. No build, tests, lint, CI or browser validation was run. No file is marked VERIFIED.

### Manifest / ledger handling
- Added the newly inspected files to Section 10.1 with concrete centralized evidence, remaining work and conservative statuses.
- Route wrappers and auth guards with no direct style matches remain only inspected; their imported UI consumers still need to be traced.
- Existing CHANGE REQUIRED/PARTIAL statuses are not promoted to VERIFIED by this scan.

### Updated NEXT TASK
Continue Stage 1 as a full repository-wide pass through Section 7, not as a button-only pass. Next inspect the remaining UI-bearing components and CSS/token/theme/preset consumers across all domains; reconcile exact call sites for actions, all Card/Paper/custom surfaces, field families, image presets/overlays, CSS variables and styling API violations. Complete the ht-button/BackButton/BUTTON_STYLES trace as one part of this broader matrix. Keep Stage 1 open until the full inventory is exhaustive. No application migration or validation commands yet.

### 2026-11-18 — Full UI consumer inventory expansion
- Mandatory preflight: re-read the CSS ownership architecture, styling API policy, six-stage plan, complete Section 7 search matrix, safe migration rules, file manifest/ledger and NEXT TASK.
- Verified branch feature/frontend-modernization and HEAD 70e0825287e030b097ffb08d3f73a582195ea281 before this documentation update.
- Compared baseline f77d0cff2f98298279273d0d15a27b7a236a2dd7 with HEAD: 13 commits ahead, 0 behind; only docs/ARCHITECTURE.md and docs/CSS_DESIGN_SYSTEM_AUDIT.md changed. No application source changes since baseline.
- Expanded current-branch source inspection beyond actions to Admin tables/pagination, auth forms/profile images, map fields/pickers, image upload/gallery/lightbox, common controls, comments/replies/social controls, tracking, trip filters/navigation/map section and route wrappers. Exact file paths, line references and findings are recorded in Section 11.3 and the Section 10.1 ledger.
- Newly confirmed cross-domain gaps include direct admin pagination/actions and checkboxes; field defaults/local variants; map-specific input styling; raw upload/password/lightbox/comment/social IconButtons; custom image frame/thumbnail values; multiple React style props; tracking action states; feature-owned trip filter Select presets; and local trip-map navigation controls.
- AppImage applies resolved style internally from named presets; retain this as the image abstraction boundary and audit its presets/callers rather than allowing feature-level style props.
- Reframed NEXT TASK as the complete Section 7 repository-wide matrix. Action/button mapping remains one workstream alongside surfaces, fields, images, tokens/CSS variables, presets, inline styling, states and responsive rules.
- No application source files changed. No build, tests, lint, CI or browser validation was run. Stage 1 remains IN PROGRESS; no files were promoted to VERIFIED.

## 11.4 — Counted repository inventory and next unreviewed files (2026-11-18)

### Exact scope and count at branch HEAD
- Branch: feature/frontend-modernization.
- HEAD before this documentation update: 1ecc33bd89a06ce93bb2624c65245f44177ab560.
- The recursive repository tree is not truncated.
- Counted the UI/design-system candidate set using exact paths under app/ and src/: TSX/JSX/CSS/SCSS files plus the canonical UI token modules, image preset module, all theme files and all style-preset files.
- Total candidate files: **157**. Breakdown: app 39; components 87; tokens 13; presets 8; theme 10.
- Existing detailed Section 10.1 ledger before this batch: **48** unique file paths.
- Newly inspected and added to the ledger in this batch: **12** paths.
- Detailed ledger after this batch: **60** unique paths.
- Candidate files without an individual Section 10.1 ledger entry after this batch: **97**. These are the exact outstanding paths listed below.
- Important distinction: "without an individual ledger entry" is the count of work not yet reconciled into the per-file ledger; some paths have older status-only manifest entries or historical mention in earlier audit notes. They are not counted as fully verified. Section 10.1 is the operational per-file record.
- This is an inventory/reconciliation count, not a claim that all 60 ledger files are fully centralized. Existing PARTIAL and CHANGE REQUIRED statuses remain open.

### Newly inspected batch — 12 files
| File | Findings |
|---|---|
| app/(account)/favorites/page.tsx | Shared page/content/heading/empty-state presets; local progress margin and Alert width; child TripList separately audited. |
| app/(account)/profile/page.tsx | Shared PANEL_SX but additional local outer/inner layout sx remains. |
| app/(account)/trips/create/page.tsx | Pure route composition to TripForm; no direct visual styles. |
| app/(account)/trips/create/points/page.tsx | Pure route composition to CreatePointPage; no direct visual styles. |
| app/(public)/live-tracking/page.tsx | Token ROUTE_CONTENT_PADDING still applied through React style prop. |
| app/(public)/page.tsx | Shared layout preset still applied through React style prop. |
| app/(public)/trips/page.tsx | Shared TripFilters/List/Pagination/WelcomeHeading and typography/layout presets; local intro variant and multiple React style props remain. |
| app/(public)/trips/[id]/page.tsx | Shared TripDetailsView and layout preset; React style prop remains on main. |
| src/components/admin/AdminDashboard.tsx | Semantic nav/list/link structure; no local visual declaration in component; parent layout/link contract remains to verify. |
| src/components/auth/RequireModeratorRedirect.tsx | Auth guard only; no visual output of its own. |
| src/components/common/JsonLd.tsx | JSON-LD script only; no visual output. |
| src/components/common/ScrambleHeading.tsx | Uses HOME_HEADING_STYLE but exposes and spreads caller-provided React style prop; styling API migration target. |

### Exact outstanding file list — 97 paths without individual ledger rows
**app (31)**
- `app/(account)/layout.tsx`
- `app/(account)/my-trips/page.tsx`
- `app/(account)/points/edit/[pointId]/page.tsx`
- `app/(account)/trips/[id]/edit/page.tsx`
- `app/(admin)/admin/failed-login-logs/page.tsx`
- `app/(admin)/admin/images/page.tsx`
- `app/(admin)/admin/page.tsx`
- `app/(admin)/admin/reports/page.tsx`
- `app/(admin)/admin/route-not-found-logs/page.tsx`
- `app/(admin)/admin/users/[userId]/page.tsx`
- `app/(admin)/admin/users/page.tsx`
- `app/(admin)/layout.tsx`
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/layout.tsx`
- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`
- `app/(auth)/resend-verification/page.tsx`
- `app/(auth)/reset-password/page.tsx`
- `app/(auth)/verify-email/page.tsx`
- `app/(public)/about/AboutPage.module.css`
- `app/(public)/about/page.tsx`
- `app/(public)/layout.tsx`
- `app/(public)/privacy-policy/LegalPage.module.css`
- `app/(public)/privacy-policy/page.tsx`
- `app/error.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/not-found.tsx`
- `app/opengraph-image.tsx`
- `app/providers.tsx`
- `app/twitter-image.tsx`

**components (38)**
- `src/components/admin/AdminNavigation.tsx`
- `src/components/admin/AdminUserForm.tsx`
- `src/components/admin/AdminUsers.tsx`
- `src/components/auth/Captcha.tsx`
- `src/components/auth/ForgotPasswordForm.tsx`
- `src/components/auth/GuestOnly.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RequireAuth.tsx`
- `src/components/auth/RequireRole.tsx`
- `src/components/auth/RequireTripOwner.tsx`
- `src/components/auth/ResendVerificationForm.tsx`
- `src/components/auth/ResetPasswordForm.tsx`
- `src/components/common/ConfirmDialog.tsx`
- `src/components/common/NotFound.module.css`
- `src/components/common/PasswordRequirements.tsx`
- `src/components/common/TabSyncListener.tsx`
- `src/components/home/HomeHero.tsx`
- `src/components/home/HomeTrips.tsx`
- `src/components/images/ImageGallery.module.css`
- `src/components/layout/Footer.module.css`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/placeholders/SocialObjectPlaceholder.tsx`
- `src/components/social/FavoriteButton.tsx`
- `src/components/social/LikeAnimation.tsx`
- `src/components/social/LikeButton.tsx`
- `src/components/social/ReportButton.tsx`
- `src/components/social/SocialConfigStatus.tsx`
- `src/components/trips/EditTripLayout.tsx`
- `src/components/trips/PointsSection.tsx`
- `src/components/trips/TripDetails.tsx`
- `src/components/trips/TripDetailsView.module.css`
- `src/components/trips/TripDetailsView.tsx`
- `src/components/trips/TripForm.tsx`
- `src/components/trips/TripList.module.css`
- `src/components/trips/TripList.tsx`
- `src/components/trips/TripPagination.module.css`
- `src/components/trips/TripPagination.tsx`

**tokens (13)**
- `src/constants/ui/breakpoints.ts`
- `src/constants/ui/colors.ts`
- `src/constants/ui/index.ts`
- `src/constants/ui/shadows.ts`
- `src/constants/ui/shape.ts`
- `src/constants/ui/sizes.ts`
- `src/constants/ui/spacing.ts`
- `src/constants/ui/typography.ts`
- `src/constants/ui/z-index.ts`
- `src/hooks/useAuth.tsx`
- `src/hooks/useBackground.tsx`
- `src/lib/images/renderTripOgImage.tsx`
- `src/seo/SiteStructuredData.tsx`

**presets (8)**
- `src/styles/presets/buttons.ts`
- `src/styles/presets/cards.ts`
- `src/styles/presets/forms.ts`
- `src/styles/presets/layouts.ts`
- `src/styles/presets/map-controls.ts`
- `src/styles/presets/panels.ts`
- `src/styles/presets/social.ts`
- `src/styles/presets/typography.ts`

**theme (7)**
- `src/theme/components/button.ts`
- `src/theme/components/text-field.ts`
- `src/theme/index.ts`
- `src/theme/palette.ts`
- `src/theme/shadows.ts`
- `src/theme/shape.ts`
- `src/theme/typography.ts`

### Batch constraints and status
- Re-read the CSS organization and latest NEXT TASK before source inspection; confirmed current branch and HEAD above.
- Only the 12 files listed in this batch were fetched for this inspection. Previously recorded files were not reopened merely to inflate this batch.
- Added all 12 to Section 10.1. Two files are explicitly classified NON-VISUAL rather than being treated as style migration targets.
- No application source files changed. No build, tests, lint, CI or browser validation was run.
- Stage 1 remains IN PROGRESS. No file was marked fully migrated or visually verified.

### Updated NEXT TASK
Continue only with the exact outstanding paths listed in this section; do not restart files already represented in Section 10.1 or the newly inspected batch. Work across all domains, not one component family: next inspect the remaining UI components that have no individual ledger entry, then route/page and shell styles, and finally any token/theme/preset paths not yet individually reconciled. For every batch, subtract completed paths from this outstanding register, update Section 10.1 and this count, and keep Stage 1 open until the outstanding list is empty and every required consumer map is complete. Do not run build, tests, lint, CI or browser validation without explicit user authorization.

### 2026-11-18 — Counted inventory and 12-file route/common batch
- Read the audit document first, including ownership architecture, Section 7 matrix, Stage 1 status, manifest, detailed ledger and current NEXT TASK. Confirmed feature/frontend-modernization HEAD 1ecc33bd89a06ce93bb2624c65245f44177ab560.
- Built a fresh, non-truncated recursive tree inventory. Counted 157 UI/design-system candidate files: app 39, components 87, theme 10, presets 8, tokens/image presets 13.
- Reconciled Section 10.1: 48 unique detailed file rows existed before this batch. Inspected 12 additional paths and added them, bringing the detailed ledger to 60 unique paths. There are now 97 candidate paths without individual ledger rows; every one is listed by exact path in Section 11.4. Status-only manifest entries and historical mentions are not treated as full verification.
- New inspection: favorites/profile account pages; create-trip and create-point route wrappers; public live tracking/home/trips/trip-detail pages; AdminDashboard; RequireModeratorRedirect; JsonLd; ScrambleHeading.
- Findings include multiple route-level React style props, profile page local sx despite PANEL_SX, favorites progress/Alert sx, and ScrambleHeading exposing caller-supplied React style. Create routes are composition-only; RequireModeratorRedirect and JsonLd are non-visual.
- No source code changed. No build, tests, lint, CI or browser validation was run. Stage 1 remains IN PROGRESS.

## 11.5 — Account/Admin route wrappers and shell inventory batch (2026-11-18)

### Pre-work check
- Re-read Sections 1, 1.4, 6, 7, 10.1, 11.4 and the exact NEXT TASK.
- Branch: feature/frontend-modernization. HEAD before this documentation update: 2c070a8802be4b9fbd5277d08182cbfc0a591c4f.
- Used the current recursive tree inventory; tree.truncated=false.
- Files already recorded in Section 10.1 were not re-inspected. This batch contains 12 new paths from the previous outstanding list.

### Files inspected in this batch — 12
| File | Result |
|---|---|
| `app/(account)/layout.tsx` | Route shell main now consumes ACCOUNT_LAYOUT_MAIN_SX through MUI Box; Header/main/Footer order retained. Status: MIGRATED. |
| `app/(account)/my-trips/page.tsx` | Loading/error/empty/list states and Create Trip action consume named account/button presets; no route-local style declaration remains. Status: MIGRATED. |
| `app/(account)/points/edit/[pointId]/page.tsx` | Route delegates to EditPointPage; no direct visual declarations in route. Remaining: Ensure EditPointPage is independently represented in ledger and all its consumers are audited; route itself has no separate skin. Status: NON-VISUAL ROUTE — child owns UI. |
| `app/(account)/trips/[id]/edit/page.tsx` | Server route validates IDs/ownership and delegates presentation to EditTripLayout; no direct visual declarations. Remaining: Ensure EditTripLayout is independently audited; route itself has no separate skin. Status: NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/failed-login-logs/page.tsx` | Route wrapper delegates to AdminFailedLogs; no direct visual declarations. Remaining: AdminFailedLogs owns table, selection, pagination and action UI and must be tracked independently. Status: NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/images/page.tsx` | Route wrapper delegates to AdminImages; no direct visual declarations. Remaining: AdminImages owns image table, preview dialog, upload and pagination controls and must be tracked independently. Status: NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/page.tsx` | Minimal semantic section wrapper. Remaining: Raw h1 has no explicit shared heading contract; determine whether parent Admin layout owns heading defaults or use a shared semantic heading role. Status: CHANGE REQUIRED. |
| `app/(admin)/admin/reports/page.tsx` | Route delegates to AdminReports inside a semantic section. Remaining: AdminReports owns report action/table/pagination styles; raw h1 on route needs shared heading contract. Status: CHANGE REQUIRED. |
| `app/(admin)/admin/route-not-found-logs/page.tsx` | Route wrapper delegates to AdminRouteNotFoundLogs; no direct visual declarations. Remaining: AdminRouteNotFoundLogs owns table/disclosure/pagination controls and must be tracked independently. Status: NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/users/[userId]/page.tsx` | Route delegates to AdminUserForm in a semantic section; no local style declaration. Remaining: AdminUserForm owns form fields/actions and must be tracked independently. Status: NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/users/page.tsx` | Route wrapper delegates to AdminUsers; no direct visual declarations. Remaining: AdminUsers owns user table, filters and actions and must be tracked independently. Status: NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/layout.tsx` | Main uses ROUTE_LAYOUT_MAIN_SX; no React style prop remains. Status: MIGRATED. |

### Findings
- Both route shells (account/admin) pass the shared ROUTE_CONTENT_PADDING through a React style prop. This violates the approved styling API policy even though the spacing token itself is centralized.
- My Trips already uses semantic layout presets and BUTTON_STYLES.createTrip, but its loading/error/empty states contain additional local sx declarations that must be checked against shared roles.
- Most Admin route pages are composition-only wrappers. Actual visual ownership resides in AdminFailedLogs, AdminImages, AdminReports, AdminRouteNotFoundLogs, AdminUserForm and AdminUsers; these components are separate ledger consumers and are not considered complete merely because their route wrappers were inspected.
- The Admin home and reports routes contain native h1 elements without an explicit semantic heading contract; determine whether parent-layout/global defaults cover them.
- The Edit Point and Edit Trip routes are presentation-free wrappers; EditPointPage and EditTripLayout are the separate visual components.

### Exact inventory after this batch
- UI/design-system candidate scope: **157 files**.
- Individual records in Section 10.1 before this batch: **60**.
- Newly inspected and added individual files: **12**.
- Individual records after this batch: **72**.
- Files without an individual Section 10.1 record: **85**.
- This is the exact number of files remaining for their initial individual inventory. It does not mean that the 72 recorded files have been migrated or fully centralized; PARTIAL and CHANGE REQUIRED findings remain open.
- NON-VISUAL route wrappers have been individually inspected and recorded, but their child components remain independent targets.

### Exact remaining file list — 85
**app — 19 files**
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/layout.tsx`
- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`
- `app/(auth)/resend-verification/page.tsx`
- `app/(auth)/reset-password/page.tsx`
- `app/(auth)/verify-email/page.tsx`
- `app/(public)/about/AboutPage.module.css`
- `app/(public)/about/page.tsx`
- `app/(public)/layout.tsx`
- `app/(public)/privacy-policy/LegalPage.module.css`
- `app/(public)/privacy-policy/page.tsx`
- `app/error.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/not-found.tsx`
- `app/opengraph-image.tsx`
- `app/providers.tsx`
- `app/twitter-image.tsx`

**components — 38 files**
- `src/components/admin/AdminNavigation.tsx`
- `src/components/admin/AdminUserForm.tsx`
- `src/components/admin/AdminUsers.tsx`
- `src/components/auth/Captcha.tsx`
- `src/components/auth/ForgotPasswordForm.tsx`
- `src/components/auth/GuestOnly.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RequireAuth.tsx`
- `src/components/auth/RequireRole.tsx`
- `src/components/auth/RequireTripOwner.tsx`
- `src/components/auth/ResendVerificationForm.tsx`
- `src/components/auth/ResetPasswordForm.tsx`
- `src/components/common/ConfirmDialog.tsx`
- `src/components/common/NotFound.module.css`
- `src/components/common/PasswordRequirements.tsx`
- `src/components/common/TabSyncListener.tsx`
- `src/components/home/HomeHero.tsx`
- `src/components/home/HomeTrips.tsx`
- `src/components/images/ImageGallery.module.css`
- `src/components/layout/Footer.module.css`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/placeholders/SocialObjectPlaceholder.tsx`
- `src/components/social/FavoriteButton.tsx`
- `src/components/social/LikeAnimation.tsx`
- `src/components/social/LikeButton.tsx`
- `src/components/social/ReportButton.tsx`
- `src/components/social/SocialConfigStatus.tsx`
- `src/components/trips/EditTripLayout.tsx`
- `src/components/trips/PointsSection.tsx`
- `src/components/trips/TripDetails.tsx`
- `src/components/trips/TripDetailsView.module.css`
- `src/components/trips/TripDetailsView.tsx`
- `src/components/trips/TripForm.tsx`
- `src/components/trips/TripList.module.css`
- `src/components/trips/TripList.tsx`
- `src/components/trips/TripPagination.module.css`
- `src/components/trips/TripPagination.tsx`

**tokens — 13 files**
- `src/constants/ui/breakpoints.ts`
- `src/constants/ui/colors.ts`
- `src/constants/ui/index.ts`
- `src/constants/ui/shadows.ts`
- `src/constants/ui/shape.ts`
- `src/constants/ui/sizes.ts`
- `src/constants/ui/spacing.ts`
- `src/constants/ui/typography.ts`
- `src/constants/ui/z-index.ts`
- `src/hooks/useAuth.tsx`
- `src/hooks/useBackground.tsx`
- `src/lib/images/renderTripOgImage.tsx`
- `src/seo/SiteStructuredData.tsx`

**presets — 8 files**
- `src/styles/presets/buttons.ts`
- `src/styles/presets/cards.ts`
- `src/styles/presets/forms.ts`
- `src/styles/presets/layouts.ts`
- `src/styles/presets/map-controls.ts`
- `src/styles/presets/panels.ts`
- `src/styles/presets/social.ts`
- `src/styles/presets/typography.ts`

**theme — 7 files**
- `src/theme/components/button.ts`
- `src/theme/components/text-field.ts`
- `src/theme/index.ts`
- `src/theme/palette.ts`
- `src/theme/shadows.ts`
- `src/theme/shape.ts`
- `src/theme/typography.ts`

### NEXT TASK
Continue from the outstanding list above without reopening files that already have an individual ledger row, unless a later consumer-specific check requires re-inspection. The next batch starts with the remaining app/auth/public shell and CSS paths, then continues through components; inspect every file against all areas in Section 7, not only buttons. In the next update: add the exact files to Section 10.1, remove them from the outstanding list, recalculate the remaining count from the current recursive tree, and record the new exact NEXT TASK. Stage 1 remains IN PROGRESS. Do not run build, tests, lint, CI or browser validation without explicit authorization.
### 2026-11-18 — Account/Admin route and shell inventory batch
- Re-read architecture, styling API, approved six stages, complete Section 7 search matrix, detailed ledger and exact NEXT TASK before inspection.
- Verified feature/frontend-modernization at HEAD 2c070a8802be4b9fbd5277d08182cbfc0a591c4f; recursive tree was not truncated.
- Inspected 12 previously unledgered paths: account layout, My Trips, Edit Point/Edit Trip route wrappers, six Admin route wrappers/pages and Admin layout.
- Added all 12 to Section 10.1 with individual findings and conservative statuses. The two route shells contain React style presentation props for shared route padding. My Trips combines shared presets with local loading/error/heading styles. Admin and edit routes are mostly composition-only and delegate actual visual ownership to separately audited child components.
- Reconciled the exact outstanding register from the recursive tree: 157 candidate UI/design-system files; 72 unique files now have individual ledger entries; 85 remain without an individual entry. The exact remaining paths are enumerated in Section 11.5.
- No application source changed. No build, tests, lint, CI or browser validation was run. Stage 1 remains IN PROGRESS.

## 11.6 — Auth routes and public-page shell/CSS inventory (2026-11-18)

- Mandatory preflight: re-read Sections 1.2–1.4 and 2 (CSS ownership and styling API), the approved six-stage plan, Section 7 search matrix, Section 10.1 ledger and the previous NEXT TASK before source inspection.
- Verified branch `feature/frontend-modernization`, HEAD `c8cc6c9d3a3c3f9e3194f622ea607f7578473195`; recursive tree was not truncated.
- Inspected the next 12 previously unledgered files: all seven auth route files/layout, About CSS Module and page, public layout, and Privacy Policy CSS Module and page.
- Auth route pages are primarily metadata/behavioral wrappers; their actual visual owners are the separately tracked auth form components. The Auth layout has two React style presentation objects, including route padding and a local 480px content width.
- About page uses a local image style object spread into several Next Image React style props; its CSS Module mixes structural responsive layout with local typography and text-shadow values. These are concrete styling API / centralization migration targets.
- Public layout uses React style for the flex-fill shell wrapper; preserve its footer positioning behavior while moving the rule to the approved class/preset API.
- Privacy Policy page is content/data composition with no React style or sx; its CSS Module already consumes several `--ht-*` variables, but still owns local spacing/typography and a native Back-link skin that must align with the shared Back semantic role.
- No application source files changed. No build, tests, lint, CI or browser validation was run. Stage 1 remains IN PROGRESS.

### Corrected inventory after reconciling the current recursive tree

The earlier Section 11.5 count (157/72/85) was stale and its outstanding list included files now present in the Section 10.1 ledger. Recomputed from the current, non-truncated recursive tree and **Section 10.1 only**:

- UI/design-system candidate scope: **163 files**.
- Files with individual Section 10.1 ledger rows before this batch: **72**.
- Files inspected and added in this batch: **12**.
- Files with individual ledger rows now: **84**.
- Files still without an individual ledger row: **79**.
- The 84 ledger rows are inventory records, **not 84 migrated files**. PARTIAL and CHANGE REQUIRED remain open until implementation and consumer verification.
- Remaining breakdown: **app 10, components 45, UI tokens/hooks/SEO 9, presets 8, theme 7**.

### Exact remaining paths — 79

**app — 10**
- `app/api/og/trips/[id]/route.ts`
- `app/error.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/not-found.tsx`
- `app/opengraph-image.tsx`
- `app/providers.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `app/twitter-image.tsx`

**components — 45**
- `src/components/admin/AdminNavigation.tsx`
- `src/components/admin/AdminUserForm.tsx`
- `src/components/admin/AdminUsers.tsx`
- `src/components/admin/index.ts`
- `src/components/auth/Captcha.tsx`
- `src/components/auth/ForgotPasswordForm.tsx`
- `src/components/auth/GuestOnly.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RequireAuth.tsx`
- `src/components/auth/RequireRole.tsx`
- `src/components/auth/RequireTripOwner.tsx`
- `src/components/auth/ResendVerificationForm.tsx`
- `src/components/auth/ResetPasswordForm.tsx`
- `src/components/auth/index.ts`
- `src/components/common/ConfirmDialog.tsx`
- `src/components/common/NotFound.module.css`
- `src/components/common/PasswordRequirements.tsx`
- `src/components/common/TabSyncListener.tsx`
- `src/components/home/HomeHero.tsx`
- `src/components/home/HomeTrips.tsx`
- `src/components/home/index.ts`
- `src/components/images/ImageGallery.module.css`
- `src/components/images/index.ts`
- `src/components/layout/Footer.module.css`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/placeholders/SocialObjectPlaceholder.tsx`
- `src/components/placeholders/index.ts`
- `src/components/placeholders/socialObjectPlaceholderAssets.ts`
- `src/components/social/FavoriteButton.tsx`
- `src/components/social/LikeAnimation.tsx`
- `src/components/social/LikeButton.tsx`
- `src/components/social/ReportButton.tsx`
- `src/components/social/SocialConfigStatus.tsx`
- `src/components/tracking/index.ts`
- `src/components/trips/EditTripLayout.tsx`
- `src/components/trips/PointsSection.tsx`
- `src/components/trips/TripDetails.tsx`
- `src/components/trips/TripDetailsView.module.css`
- `src/components/trips/TripDetailsView.tsx`
- `src/components/trips/TripForm.tsx`
- `src/components/trips/TripList.module.css`
- `src/components/trips/TripList.tsx`
- `src/components/trips/TripPagination.module.css`
- `src/components/trips/TripPagination.tsx`

**UI tokens / hooks / SEO — 9**
- `src/constants/ui/breakpoints.ts`
- `src/constants/ui/colors.ts`
- `src/constants/ui/index.ts`
- `src/constants/ui/shadows.ts`
- `src/constants/ui/shape.ts`
- `src/constants/ui/sizes.ts`
- `src/constants/ui/spacing.ts`
- `src/constants/ui/typography.ts`
- `src/constants/ui/z-index.ts`

**presets — 8**
- `src/styles/presets/buttons.ts`
- `src/styles/presets/cards.ts`
- `src/styles/presets/forms.ts`
- `src/styles/presets/layouts.ts`
- `src/styles/presets/map-controls.ts`
- `src/styles/presets/panels.ts`
- `src/styles/presets/social.ts`
- `src/styles/presets/typography.ts`

**theme — 7**
- `src/theme/components/button.ts`
- `src/theme/components/text-field.ts`
- `src/theme/index.ts`
- `src/theme/palette.ts`
- `src/theme/shadows.ts`
- `src/theme/shape.ts`
- `src/theme/typography.ts`

### NEXT TASK

Continue from the exact 79-path outstanding list above, without re-opening already-ledgered files unless a later consumer trace requires it. Next inspect the remaining app shell/error/metadata files and the auth/common/admin components, selecting a coherent batch based on shared ownership and call-site dependencies. For every file, record what it contains, which layer currently owns each visual concern, what is already centralized, and exactly what remains. Keep Stage 1 IN PROGRESS until the repository-wide `.ht-button`, BackButton/ `BUTTON_STYLES.*`, Card/Paper/custom surface and field consumer maps are exhaustive. Do not migrate application source before inventory closure. Never run build, tests, lint, CI or browser validation without explicit user authorization.

## 11.7 — Repository-wide action selector and BackButton consumer map (2026-11-18)

### Mandatory preflight and scope
- Re-read the approved CSS ownership chain, Styling API policy (Section 1.4), six-stage plan, Section 7 search matrix, Section 10.1 ledger and latest NEXT TASK before continuing.
- Verified branch `feature/frontend-modernization` at HEAD `c9b94baa76dd5b4e8a0b6f1c2169a5e9b0a5a2bf`.
- Re-fetched the current recursive tree and inspected all **246** TS/TSX/JS/JSX/CSS source files under `app/` and `src/` for literal `.ht-button` / `.ht-button--danger`, `BackButton` and `BUTTON_STYLES.*` references. The tree was not truncated.
- Fetched and read the full definitions of `app/globals.css`, `src/components/common/BackButton.tsx`, `src/styles/presets/buttons.ts` and the relevant consumer call-site contexts.

### Legacy native `.ht-button` trace
- `app/globals.css` defines `.ht-button`, `.ht-button:hover` and `.ht-button--danger:hover`; the declarations consume the manually exposed `--ht-button-*` and semantic color/radius variables.
- No literal `ht-button` class consumer was found in the 246 scanned application source/style files. The only literal class selectors are the definitions in `app/globals.css`.
- This is a **zero-consumer result within the scanned scope**, not authorization to delete the rules. Before removal, check the full repository (including non-source templates/content and generated/server markup paths) and confirm no external integration or string composition supplies the class.

### Exact BackButton definition and callers
- Definition: `src/components/common/BackButton.tsx`. It fixes MUI `variant="contained"`, removes caller control of `variant` and `color`, defaults children to BACK, and applies `BUTTON_STYLES.back`.
- Merge order: caller `sx` is placed first and `BUTTON_STYLES.back` last, so the shared preset wins overlapping keys; caller can still supply non-overlapping layout declarations and the remaining broad MUI Button props.
- `BUTTON_STYLES.back` is currently a direct alias of `secondary`, so Back has no independently owned semantic appearance yet.
- Exactly **9 call sites** found:
  1. `src/components/admin/AdminUserForm.tsx:327` — navigates to `/admin/users`; caller sx adds align-self and top margin; includes ArrowBack icon.
  2. `src/components/auth/ForgotPasswordForm.tsx:91` — Next Link to `/login`; caller sx adds margin.
  3. `src/components/auth/ResendVerificationForm.tsx:91` — Next Link to `/login`; caller sx adds margin.
  4. `src/components/auth/ResetPasswordForm.tsx:133` — Next Link to `/login`; shared auth back-action wrapper; no local sx override.
  5. `src/components/auth/ProfileForm.tsx:126` — invokes `router.back()`; no local sx override.
  6. `src/components/points/PointForm.tsx:353` — conditional form navigation; caller retains behavior and layout.
  7. `src/components/trips/EditTripLayout.tsx:492` — invokes `router.back()`.
  8. `src/components/trips/TripDetails.tsx:223` — Next Link to `/trips`; combines Back appearance with `TRIP_ACTION_BUTTON_LAYOUT_SX` full-width geometry.
  9. `src/components/trips/TripForm.tsx:605` — invokes `router.back()`.
- All nine callers share the component, but the navigation mechanisms differ (router back, fixed route and Link). Keep behavior caller-owned; the visual role should be centralized independently.

### Exact BUTTON_STYLES property consumer map
The exported properties and every direct property reference found in the 246-file scan:

| Property | Direct consumer(s) | Current semantics / finding |
|---|---|---|
| `primary` | `ChangePasswordForm`, `ForgotPasswordForm`, `LoginForm`, `ProfileForm`, `RegisterForm`, `ResendVerificationForm`, `ResetPasswordForm`, `VerifyEmailForm`, `PointLocationPicker`, `TripLocationPicker`, `PointCard`, `PointForm` (2), `EditTripLayout`, `TripForm` (2) | Generic primary used for Save, submit, login, navigation-like success, map lookup, Edit Point, form lookup and Add Trip actions; semantics are not represented independently. |
| `save` | `AdminUserForm` | Alias of `primary`; Save has no distinct role. |
| `primaryWide` | `TripCard` | Details navigation uses primary-wide appearance. |
| `danger` | `PointCard` | Delete Point uses filled danger hover variant. |
| `dangerText` | `AdminUserForm` | Delete user is text-only danger treatment, different from PointCard Delete. |
| `secondary` | `LoginForm` (local alias used by 3 controls), `ProfileForm`, `RegisterForm` (local alias used by 2 controls), `PointLocationPicker`, `TripLocationPicker` | One generic secondary skin spans alternate auth/navigation, change-password and map clear actions. |
| `back` | `BackButton` | Alias of `secondary`; nine BackButton callers inherit it. |
| `secondaryLightText` | `TripForm` | Add Points action. |
| `createTrip` | `app/(account)/my-trips/page.tsx` | Dedicated Create Trip color/spacing treatment. |
| `tripAction` | `TripActions` (3 controls) | Add Next Day Trip, Add/Edit Points and Edit Day share the same trip action style. |
| `tripActionDanger` | `TripActions` (2 controls) | Delete Day and Delete Trip. |
| `dayIncrement` | `TripForm` | Day-number increment IconButton. |
| `dayDecrement` | `TripForm` | Day-number decrement IconButton. |

- All 13 exported properties have at least one direct reference in the scanned source. There are **34 direct property references** including the internal `BackButton → back` reference; this count includes local aliases but does not multiply the three/two rendered controls behind the Login/Register aliases.
- All consumer files above now have individual Section 10.1 ledger rows; newly added rows describe form composition, action roles, local overrides and outstanding field/state work.
- Semantic gaps confirmed: `save === primary`, `back === secondary`; Edit shares primary/tripAction; Add shares primary/tripAction; Delete is split between filled danger and text danger; map clear actions use secondary; Details navigation uses primaryWide. Do not change visuals blindly; Stage 2/3 must define a deliberate role matrix.

### Corrected live inventory after action consumer ledger updates
- Candidate scope remains **163** files.
- Individual Section 10.1 ledger rows before this action-map batch: **84**.
- Newly added individual rows: **8**.
- Individual ledger rows now: **92**.
- Files still without an individual ledger row: **71**.
- Remaining category breakdown: **app 10, components 37, UI tokens/hooks/SEO 9, presets 8, theme 7**.
- Ledger rows are inventory only; no source migration is implied.

### Exact remaining paths — 71

**app — 10**
- `app/api/og/trips/[id]/route.ts`
- `app/error.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/not-found.tsx`
- `app/opengraph-image.tsx`
- `app/providers.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `app/twitter-image.tsx`

**components — 37**
- `src/components/admin/AdminNavigation.tsx`
- `src/components/admin/AdminUsers.tsx`
- `src/components/admin/index.ts`
- `src/components/auth/Captcha.tsx`
- `src/components/auth/GuestOnly.tsx`
- `src/components/auth/RequireAuth.tsx`
- `src/components/auth/RequireRole.tsx`
- `src/components/auth/RequireTripOwner.tsx`
- `src/components/auth/index.ts`
- `src/components/common/ConfirmDialog.tsx`
- `src/components/common/NotFound.module.css`
- `src/components/common/PasswordRequirements.tsx`
- `src/components/common/TabSyncListener.tsx`
- `src/components/home/HomeHero.tsx`
- `src/components/home/HomeTrips.tsx`
- `src/components/home/index.ts`
- `src/components/images/ImageGallery.module.css`
- `src/components/images/index.ts`
- `src/components/layout/Footer.module.css`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/placeholders/SocialObjectPlaceholder.tsx`
- `src/components/placeholders/index.ts`
- `src/components/placeholders/socialObjectPlaceholderAssets.ts`
- `src/components/social/FavoriteButton.tsx`
- `src/components/social/LikeAnimation.tsx`
- `src/components/social/LikeButton.tsx`
- `src/components/social/ReportButton.tsx`
- `src/components/social/SocialConfigStatus.tsx`
- `src/components/tracking/index.ts`
- `src/components/trips/PointsSection.tsx`
- `src/components/trips/TripDetailsView.module.css`
- `src/components/trips/TripDetailsView.tsx`
- `src/components/trips/TripList.module.css`
- `src/components/trips/TripList.tsx`
- `src/components/trips/TripPagination.module.css`
- `src/components/trips/TripPagination.tsx`

**UI tokens / hooks / SEO — 9**
- `src/constants/ui/breakpoints.ts`
- `src/constants/ui/colors.ts`
- `src/constants/ui/index.ts`
- `src/constants/ui/shadows.ts`
- `src/constants/ui/shape.ts`
- `src/constants/ui/sizes.ts`
- `src/constants/ui/spacing.ts`
- `src/constants/ui/typography.ts`
- `src/constants/ui/z-index.ts`

**presets — 8**
- `src/styles/presets/buttons.ts`
- `src/styles/presets/cards.ts`
- `src/styles/presets/forms.ts`
- `src/styles/presets/layouts.ts`
- `src/styles/presets/map-controls.ts`
- `src/styles/presets/panels.ts`
- `src/styles/presets/social.ts`
- `src/styles/presets/typography.ts`

**theme — 7**
- `src/theme/components/button.ts`
- `src/theme/components/text-field.ts`
- `src/theme/index.ts`
- `src/theme/palette.ts`
- `src/theme/shadows.ts`
- `src/theme/shape.ts`
- `src/theme/typography.ts`

### NEXT TASK
Continue Stage 1 by completing the **Card / Paper / custom surface** consumer map, including standalone MUI Paper, Card, Dialog Paper, CSS surfaces, map/image overlays and all custom panel implementations. Then map all form controls (TextField, Select, Autocomplete, Checkbox, Radio, Switch, etc.) and their shared presets/theme overrides. Preserve the exact 71-path outstanding list above and add every inspected file to Section 10.1. Keep direct MUI Button/IconButton semantic role and state mapping open where it is not already captured by the BUTTON_STYLES/BackButton inventory. Do not begin application source migration until all mandatory Section 7 consumer maps are exhaustive. Stage 1 remains IN PROGRESS. Do not run build, tests, lint, CI or browser validation without explicit user authorization.


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

### 2026-11-18 — Styling API policy approved

- Added the mandatory styling API standard to Section 1.4 following the user's approval.
- React style props are prohibited for presentation and must not be introduced. Existing occurrences must be inventoried and migrated safely; any technically unavoidable exception requires explicit documentation and approval.
- MUI sx remains allowed only as a consumer of centralized presets, theme values or tokens; ad hoc inline visual objects are prohibited.
- CSS Modules / className remain allowed for unique structure and responsive composition, while shared visual values must come from central CSS variables/tokens.
- Clarified the distinct responsibilities of tokens, MUI Theme overrides, shared components/presets, sx, CSS Modules and runtime-dependent visual values.
- This is an architecture-policy update only. No application source files were changed. Stage 1 remains IN PROGRESS; the current NEXT TASK remains the repository-wide action consumer inventory, including .ht-button tracing.

### 2026-11-18 — CSS-backed action scan, first pass

- Re-read the current global stylesheet and all CSS Modules listed in the baseline stylesheet inventory, including TripDetailsView.module.css.
- Recorded the independent `.ht-button` contract, NotFound Home CTA, legal Back link and clickable ImageGallery surface, including their known consumers and outstanding consumer-tracing requirements.
- Stage 1 remains IN PROGRESS. No source changes and no validation commands were run.

### 2026-11-18 — Branch-current file-level status and action inventory follow-up

- Re-read this audit document and verified current branch `feature/frontend-modernization`, HEAD `1ae13c711721ff4d4ed0b9b4025ffba093a619d5`. The audit's previous file manifest was too coarse to answer per-file "what is fixed vs what remains"; added Section 10.1 as an explicit implementation ledger. This does not create a second audit document.
- Re-fetched current-branch source (not default-branch search excerpts) for PointCard, PointForm, PointActions, PointList, TripCard, TripActions, BackButton, Card/Dialog/surface theme overrides, PointSection, CreatePointPage and EditPointPage.
- Confirmed PointCard's Edit/Delete actions already consume shared button presets and its Card receives the centralized MUI Card surface contract. This is partial centralization only: move IconButtons and layout remain local, Edit has no dedicated semantic preset, and one description style duplicates an existing wrap preset.
- Confirmed `MuiCard` and `MuiDialog.paper` both use `getSurfaceStyles`. Do not claim all Paper surfaces are centralized: standalone Paper and custom surface consumers remain to be inventoried.
- Found a policy violation in `src/components/trips/PointSection.tsx`: React `style` prop is used on a div (around line 78 in the inspected current file); record for safe migration after inventory.
- Inspected `app/error.tsx`: direct MUI contained Button remains. Inspected auth guard wrappers and AdminDashboard: no button/action styling surfaced in those files.
- `src/constants/ui/styles.ts` does not exist on the current branch; current button presets are in `src/styles/presets/buttons.ts`. Treat old/default-branch search excerpts as non-authoritative; all branch decisions must use explicit branch refs.
- No application source changes, build, tests, lint, CI or browser verification were performed. Stage 1 remains IN PROGRESS; action inventory is still not exhaustive.
- NEXT TASK remains: continue the exact Stage 1 repository-wide semantic action inventory, tracing every current-branch BackButton/BUTTON_STYLES/Button/IconButton/native button/action-like anchor and every `.ht-button` consumer. Then complete card/surface/Paper and form-field consumer maps before closing Stage 1.


### 2026-11-18 — Repository-wide semantic action inventory, additional inspection batch

- Mandatory preflight: re-read this audit document and verified current branch `feature/frontend-modernization`, HEAD `567d82963d5c8c6bf116c23a161e31a389c14eda`; inspected the current-branch recursive Git tree and fetched exact blob contents for the additional files recorded in Section 11.
- Expanded action consumer mapping across Admin, Comments/Replies, Common, Header/Footer, Social, Images/Uploads, Maps, Trips/Points and Auth. Exact paths and line numbers, semantic classifications and remaining gaps are recorded in the new Section 11 batch.
- Confirmed repeated direct admin pagination Buttons, direct header/admin navigation, map search, disclosure, upload actions, distinct social/comment/reply/image icon actions and multiple BackButton callers. These must be modeled as distinct semantic roles over shared base control contracts, not flattened into one generic Button style.
- Identified further React `style` prop occurrences in `CommentsSection.tsx`, `CommentsToggle.tsx`, `ReportButton.tsx` and `TripDetails.tsx`, in addition to the previously recorded `PointSection.tsx` occurrence. All require behavior-aware classification before migration.
- Added mandatory preflight wording to the NEXT TASK handoff: every future batch must re-read this document's target architecture and styling API policy, verify branch/HEAD and current file contents, choose and record the optimal scope, then make compliant changes and update the same document's ledger and NEXT TASK.
- No application source files were changed. Stage 1 remains IN PROGRESS because the `.ht-button` consumer set, complete shared-component caller maps, remaining UI files, and Card/Paper/surface and form-field consumer maps are not yet exhaustive. No build, tests, lint, CI or browser verification was run.
- NEXT TASK: complete the `.ht-button` / `.ht-button--danger` consumer trace using exact current-branch source (the global selector exists, but no consumer was identified in the public trip route/components inspected in the latest batch); verify the full BackButton and `BUTTON_STYLES.*` caller map; then finish the Card/surface/Paper and form-field consumer maps. Keep Stage 1 open until those maps and the remaining UI-file review are complete. Do not start source migration before the inventory is exhaustive.


### 2026-11-18 — CSS organization and current-branch consumer scan
- Mandatory preflight completed: read the target CSS architecture and styling API policy in this document before inspecting code; verified branch `feature/frontend-modernization` and HEAD `6384a2a923a925a7b40e254682d2538d03b8810c`.
- Compared HEAD with baseline: 11 commits ahead, 0 behind; only `docs/ARCHITECTURE.md` and this audit document differ. No application-source changes since baseline.
- Re-read all nine CSS files from the current branch and inspected the current token modules, MUI theme, button/card/layout/typography presets. Recorded the intended ownership chain and concrete stylesheet gaps in Section 11.1.
- Expanded current-branch action and React `style` scan across route layouts/pages, common, auth, admin, comments, social, images, maps, points, trips, tracking, token/preset/theme files. Exact findings and file/line references are in Section 11.1.
- Confirmed the current button preset API still aliases `back` to `secondary` and `save` to `primary`; semantic Edit/Add/Remove/Cancel/Confirm/Navigation/IconAction/Pagination roles remain incomplete.
- Confirmed `.ht-button` and `.ht-button--danger` still exist in `app/globals.css`; no consumer was found in the specifically inspected public trip route/component files. A literal repository-wide consumer search is still required before removal.
- Identified additional inline React `style` props and dynamic/Satori rendering cases; recorded exact locations and instructed behavior-aware classification rather than bulk replacement.
- No application source files changed; no build/tests/lint/CI/browser verification run. Stage 1 remains IN PROGRESS.
- NEXT TASK: finish literal `ht-button` consumer tracing and complete the BackButton/`BUTTON_STYLES.*` role/caller matrix, then map Card/Paper/custom surfaces and all form-field consumers. Re-read this document's CSS organization before the next batch.


### 2026-11-18 — CSS architecture preflight and action role follow-up
- Read the audit's architecture, styling API policy, approved stage plan, mandatory search matrix, safe migration rules, file ledger and exact NEXT TASK before source review.
- Verified current branch feature/frontend-modernization and HEAD 5ec9164a6071f37feff3141cd1f3a38f1f5e90a1.
- Reconfirmed code ownership: UI tokens → MUI theme/CSS variables → shared semantic/layout presets → feature components; globals and CSS Modules must consume shared visual values and retain only shell/unique structural responsibilities.
- Chose a cross-component role review because the outstanding task concerns shared semantic action contracts and all their consumers.
- Re-fetched and reviewed BackButton.tsx, buttons.ts, ConfirmDialog.tsx, AdminNavigation.tsx, AdminUsers.tsx, TripActions.tsx, LoginForm.tsx, ReportButton.tsx, app/(account)/my-trips/page.tsx and app/error.tsx from the current branch.
- Added exact new role evidence: route-level Create Trip preset consumer; direct Retry action; BackButton sx API/precedence; actual button preset exports and semantic aliases; ConfirmDialog Cancel/Confirm mismatch; AdminNavigation direct active/inactive props; TripActions Add/Edit semantic overlap; Login password reveal IconButton; ReportButton report/cancel/submit and React style usage.
- Updated the file-level ledger for the inspected files and preserved conservative PARTIAL / CHANGE REQUIRED statuses.
- No application source files changed. No build, tests, lint, CI or browser validation was run, as explicitly instructed by the user.
- NEXT TASK: finish the current-branch literal ht-button search and exact BackButton / BUTTON_STYLES.* import/property/call-site matrix; then continue Card/Paper/custom surface and form-field consumer mapping. Re-read the CSS organization and this document before the next batch.


### 2026-11-18 — Auth routes and public shell/CSS inventory
- Re-read the CSS ownership chain, styling API policy, approved stage plan, mandatory search matrix, Section 10.1 ledger and previous NEXT TASK before the batch.
- Verified current branch `feature/frontend-modernization` at HEAD `c8cc6c9d3a3c3f9e3194f622ea607f7578473195`; recursive tree was not truncated.
- Inspected 12 previously unledgered auth/public route and stylesheet files and added an individual Section 10.1 row for each.
- Recorded auth route wrappers as non-visual where appropriate, while identifying React style presentation in Auth layout, About image styles and Public layout; About and Legal CSS Modules retain local typography/spacing/back-link rules despite partial CSS-variable use.
- Corrected the candidate inventory from 157 to 163 based on the current tree and the Section 10.1-only ledger count: 72 previously logged + 12 new = 84 logged; 79 remain without an individual row. Added the exact remaining path list and category breakdown in Section 11.6.
- No application source files changed. No build, tests, lint, CI or browser validation was run. Stage 1 remains IN PROGRESS.


### 2026-11-18 — Repository-wide action selector / BackButton map
- Re-read the architecture, styling API policy, approved stage plan, Section 7 matrix, ledger and latest NEXT TASK before the source scan.
- Verified branch `feature/frontend-modernization` at HEAD `c9b94baa76dd5b4e8a0b6f1c2169a5e9b0a5a2bf`; scanned all 246 TS/TSX/JS/JSX/CSS files under app/src for literal ht-button selectors/classes, BackButton and BUTTON_STYLES property references.
- Confirmed no literal ht-button consumer in the scanned scope; retained the CSS definitions pending broader repository/markup confirmation.
- Recorded the complete nine-caller BackButton map, its prop/sx merge contract, all 13 BUTTON_STYLES exports and 34 direct property references. Added eight missing consumer files to Section 10.1 and updated existing rows with exact semantic roles and local overrides.
- Reconciled the live 163-file candidate scope: 92 unique ledgered files, 71 without individual ledger rows. Added the exact 71-path list and category counts in Section 11.7.
- No application source files changed. No build, tests, lint, CI or browser validation was run. Stage 1 remains IN PROGRESS.


## 11.8 — Card / Paper / custom surface audit and additional component inventory (2026-11-18)

### Mandatory preflight
- Re-read the CSS ownership chain, Styling API policy, six-stage plan, Section 7 consumer matrix, Section 10.1 ledger and current NEXT TASK before inspecting source.
- Verified branch `feature/frontend-modernization` at HEAD `c8724a5cfb187d4376359a75facedd294dc0d79b`; recursive tree was not truncated.
- Reconciled the live scope from the branch tree: **163 candidate files**, **92 individually ledgered**, **71 outstanding** before this batch. The previous historical 79-path snapshot is superseded by Section 11.7's corrected 71-path list.

### Surface contract findings (current source)
- `src/theme/components/surface.ts` defines `getSurfaceStyles(theme)`: theme paper background, divider border, theme radius and semantic surface shadow.
- `src/theme/components/card.ts` applies that contract to **all MUI Card roots** through `MuiCard.styleOverrides.root`; default elevation is 1. This proves the base MUI Card skin only, not uniform card geometry/content layout.
- `src/theme/components/dialog.ts` applies the same contract only to `MuiDialog.paper`. Its comment explicitly preserves other Paper usages; there is no general `MuiPaper` override in this module.
- `src/styles/presets/panels.ts` exports `PANEL_SX` as a wrapper around `getSurfaceStyles`; `src/styles/presets/forms.ts` composes it into `AUTH_FORM_SX`. This is an explicit custom panel adoption path, but every consumer still needs tracing.
- `src/styles/presets/cards.ts` is mixed: it contains trip-card layout dimensions, card text insets, action spacing and text treatments. The file comment assigns background/border/radius/shadow to MUI theme, but its exported `cardStyle` is typed as React `CSSProperties`; policy 1.4 prohibits using React style for presentation. It is not a pure semantic surface preset.
- `PointCard` and `TripCard` consume MUI Card and therefore inherit the global Card surface contract; both still define substantial local geometry/content sx. `AdminUsers` is another Card consumer found in this batch, with local content geometry.
- `ConfirmDialog` uses MUI Dialog and therefore inherits the Dialog Paper contract; its Cancel/Confirm buttons are direct MUI Buttons with identical `color=primary` and `variant=contained`, not distinct semantic action roles.
- `NotFound.module.css`, `ImageGallery.module.css`, `Footer.module.css` and the social placeholder define/compose non-MUI surfaces or image surfaces. Some values consume `--ht-*` / `UI_COLORS`, but local backgrounds, padding, gradients, clipping and geometry remain.
- This batch does **not** close the Card/Paper/custom-surface map. All MUI `Paper` imports/usages, Dialog variants, Popover/Drawer surfaces, CSS module surface selectors, map overlays, image overlays and all `PANEL_SX` consumers still need a repository-wide current-branch trace.

### Additional files inspected and ledgered
- Admin navigation: direct MUI Button active/inactive props; no semantic navigation preset.
- Admin users: MUI Card surface is inherited; card geometry and Edit/Delete/Pagination controls remain local/direct.
- CAPTCHA: external widget wrapper has local min-height and disabled visual state; third-party internals are outside app theme control.
- Password requirements: semantic palette colors are theme-backed; responsive list/grid and icon state styling remain local.
- Home hero and Home trips: both use shared typography presets but apply them through prohibited React `style` props; HomeHero also adds local max-width.
- Header: consumes breakpoint/size tokens but navigation buttons, drawer Paper and toolbar spacing remain direct MUI props/local sx.
- Social object placeholder: uses semantic color tokens but retains local gradient, typography, image fit and geometry; Next Image `style` needs policy-compliant treatment.
- PointsSection is composition-only and delegates its visual surface to PointSection.
- TripDetailsView owns composition/sticky shell layout; child surfaces are delegated to trip, image, comments and map components.
- Individual per-file findings are in Section 10.1 rows added by this batch.

### Live inventory after this batch
- Candidate scope: **163**.
- Individual Section 10.1 ledger rows: **107** unique.
- Files still without an individual ledger row: **56**.
- This is file-level inventory progress only; it is not migration progress and does not prove all consumer maps exhaustive.
- Remaining category counts and exact paths are listed below.

**app — 10**
- `app/api/og/trips/[id]/route.ts`
- `app/error.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/not-found.tsx`
- `app/opengraph-image.tsx`
- `app/providers.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `app/twitter-image.tsx`

**src/components — 22**
- `src/components/admin/index.ts`
- `src/components/auth/GuestOnly.tsx`
- `src/components/auth/RequireAuth.tsx`
- `src/components/auth/RequireRole.tsx`
- `src/components/auth/RequireTripOwner.tsx`
- `src/components/auth/index.ts`
- `src/components/common/TabSyncListener.tsx`
- `src/components/home/index.ts`
- `src/components/images/index.ts`
- `src/components/placeholders/index.ts`
- `src/components/placeholders/socialObjectPlaceholderAssets.ts`
- `src/components/social/FavoriteButton.tsx`
- `src/components/social/LikeAnimation.tsx`
- `src/components/social/LikeButton.tsx`
- `src/components/social/ReportButton.tsx`
- `src/components/social/SocialConfigStatus.tsx`
- `src/components/tracking/index.ts`
- `src/components/trips/TripDetailsView.module.css`
- `src/components/trips/TripList.module.css`
- `src/components/trips/TripList.tsx`
- `src/components/trips/TripPagination.module.css`
- `src/components/trips/TripPagination.tsx`

**src/constants/ui — 9**
- `src/constants/ui/breakpoints.ts`
- `src/constants/ui/colors.ts`
- `src/constants/ui/index.ts`
- `src/constants/ui/shadows.ts`
- `src/constants/ui/shape.ts`
- `src/constants/ui/sizes.ts`
- `src/constants/ui/spacing.ts`
- `src/constants/ui/typography.ts`
- `src/constants/ui/z-index.ts`

**src/styles/presets — 8**
- `src/styles/presets/buttons.ts`
- `src/styles/presets/cards.ts`
- `src/styles/presets/forms.ts`
- `src/styles/presets/layouts.ts`
- `src/styles/presets/map-controls.ts`
- `src/styles/presets/panels.ts`
- `src/styles/presets/social.ts`
- `src/styles/presets/typography.ts`

**src/theme — 7**
- `src/theme/components/button.ts`
- `src/theme/components/text-field.ts`
- `src/theme/index.ts`
- `src/theme/palette.ts`
- `src/theme/shadows.ts`
- `src/theme/shape.ts`
- `src/theme/typography.ts`

### NEXT TASK
1. Continue the Card / Paper / custom surface consumer map before moving to field controls: trace every current-branch import and JSX usage of `Card`, `Paper`, `Dialog`, `Drawer`, `Popover`, `getSurfaceStyles`, `PANEL_SX`, and CSS custom panel/surface selectors. Include map controls, map overlays, image/lightbox surfaces and all CSS Modules.
2. Inspect every `PANEL_SX` consumer and determine whether it actually renders a panel or merely composes layout.
3. Then map all form controls (TextField, Select, Autocomplete, Checkbox, Radio, Switch, native inputs) against theme overrides and form presets.
4. Keep direct MUI Button/IconButton semantic role/state mapping open where not already captured.
5. Preserve the exact remaining-path complement above; add each inspected file to Section 10.1 and reconcile counts against the fresh branch tree after every batch.
6. Stage 1 remains IN PROGRESS. Do not start application source migration until the mandatory consumer maps are exhaustive. Do not run build, tests, lint, CI or browser validation without explicit user authorization.



## 11.9 — Map and image surface consumer follow-up (2026-11-18)

### Mandatory preflight and scope
- Re-read Sections 1.4, 7, 10.1 and the previous Section 11.8 NEXT TASK before continuing.
- Verified branch `feature/frontend-modernization` at HEAD `befaa99e43a684713aca8e6f951671afb00d48cf`; recursive tree contains 163 candidate UI/design-system files and is not truncated.
- Reconciled current Section 10.1 before this batch: 107 unique ledger rows, 56 files without an individual row.
- Inspected the current source for TripMapSection, GoogleMapView, PointLocationPicker, TripLocationPicker, ImageGallery.module.css, ImageGallery, ImageLightbox and AppImage. Updated existing per-file rows in Section 10.1; no application source changed.

### Confirmed surface and overlay map
- **TripMapSection** renders an MUI Card, so only its base surface is inherited from `MuiCard` → `getSurfaceStyles`. Card sizing/box-sizing and small-screen composition remain local sx. Its previous/next controls are direct Buttons inside MobileStepper, not a semantic Navigation/Pagination role. It does not consume `PANEL_SX`.
- **TripDetails** also renders MUI Card and inherits the same base surface; its content/action layout remains its own component composition. This is separate from the TripMapSection card and both need the same card content/spacing contract in later migration.
- **GoogleMapView** is a map-canvas wrapper (Box grid/flex) and does not itself render an app Card/Paper/Dialog surface. Google Maps owns its canvas and built-in map controls; app-owned overlays/InfoWindows must be audited separately.
- **PointLocationPicker** and **TripLocationPicker** do not wrap the map in a Card/Paper. They compose the shared map wrapper, address autocomplete and action controls. The trip picker has a local map hint overlay background token; GPS/clear/search actions are not all represented by dedicated semantic roles.
- **ImageLightbox** uses MUI Dialog, so its Paper starts with the shared Dialog surface. It then deliberately overrides Paper background with `UI_COLORS.surface.imageLightbox`. Its close/previous/next IconButtons share a local `controlSx` color/background treatment, but positioning and z-index are duplicated at each call site. The lightbox is therefore a Dialog surface variant, not evidence of a general custom panel.
- **ProfileImage** and **AdminImages** also use Dialog for image preview/fullscreen; these are separate Dialog consumers. ProfileImage composes a custom image stage Box with image-lightbox background and local close-control styling. AdminImages composes DialogTitle/DialogContent and a local preview image geometry. Their per-file rows remain open for later image/control migration.
- **ImageGallery.module.css** is primarily structural (flex/grid/stack, image frame aspect ratio, button reset and clipping). It consumes spacing/radius CSS variables but still has local reset/overflow behavior. **ImageGallery.tsx** adds runtime grid columns and a local focus-visible outline; engagement overlay controls delegate to shared EngagementBar.
- **AppImage** owns the rendering fallback and consumes named image presets. Its internal computed React `style` is an implementation detail of this shared image abstraction already documented in its ledger row; this does not authorize consumer components to pass presentation style props.

### PANEL_SX trace status
- The confirmed chain is `PANEL_SX` → `getSurfaceStyles(theme)`; `AUTH_FORM_SX` composes the panel preset.
- In this batch, TripMapSection and TripDetails use MUI Card rather than PANEL_SX; map pickers and image gallery/lightbox use map/Box/Dialog composition rather than PANEL_SX.
- This is **not yet a repository-wide exhaustive property-level consumer trace** of PANEL_SX/AUTH_FORM_SX. Keep that task open; do not infer zero additional consumers from the files inspected in this batch.

### Live inventory after this batch
- Candidate scope remains **163**.
- Individual Section 10.1 ledger rows remain **107 unique**; this batch updated existing rows rather than adding new candidate paths.
- Files without an individual Section 10.1 ledger row remain **56**.
- Remaining exact paths are unchanged from the prior reconciled list in Section 11.8; recalculate from the current tree at the next batch rather than copying a historical snapshot.
- File inventory progress is not migration progress and does not prove that the surface consumer map is exhaustive.

### NEXT TASK
1. Finish the repository-wide Card/Paper/Dialog/Drawer/Popover and custom surface consumer map. In particular inspect all remaining CSS Modules and app-owned map InfoWindow/overlay, image preview, admin table, and drawer/popup surfaces; record exact import + JSX consumer paths and caller contexts.
2. Exhaustively trace `PANEL_SX`, `AUTH_FORM_SX`, and `getSurfaceStyles` property-level consumers on the current branch; distinguish rendered surfaces from layout-only composition.
3. Once the surface map is complete, map all form controls (TextField, Select, Autocomplete, Checkbox, Radio, Switch and native inputs) against theme overrides and form presets.
4. Keep direct MUI Button/IconButton semantic role/state mapping open where not already captured.
5. Preserve the 163-file scope and reconcile the exact outstanding complement from the fresh branch tree after each batch.
6. Stage 1 remains IN PROGRESS. Do not start application source migration until mandatory consumer maps are exhaustive. Do not run build, tests, lint, CI or browser validation without explicit user authorization.



## 11.10 — Repository surface consumer trace and panel preset follow-up (2026-11-18)

### Preflight and scope
- Re-read the approved ownership chain, Styling API policy (Section 1.4), six-stage plan (Section 6), full Section 7 search matrix, Section 10.1 ledger and previous NEXT TASK before inspecting source.
- Verified branch `feature/frontend-modernization` at HEAD `e12da3a4f976e8ebe63fd0f58d387d56dfffe0ce`; recursive Git tree is complete (not truncated).
- Current audit scope remains **163 candidate UI/design-system files**. Section 10.1 contains **158 unique ledger paths overall**, of which **144 belong to the 163-file candidate scope**. The exact complement is **19 outstanding candidate paths**; see current NEXT TASK below. The other 14 ledger paths are supporting/out-of-scope entries and do not reduce the candidate complement.
- This batch updates existing ledger rows only; it adds no new candidate path. No application source file was changed.

### Repository-wide surface findings
- **MUI Card:** the base contract remains `MuiCard` → `getSurfaceStyles(theme)` (paper background, divider border, theme radius, semantic surface shadow). Confirmed rendered Card consumers include `AdminUsers`, `VerifyEmailForm`, `CommentsSection` (outer panel and each comment), `CreatePointPage`, `EditPointPage`, `PointCard`, `PointSection`, `TripCard` (both branches), `TripDetails`, `TripForm` and `TripMapSection`. This proves only the base Card skin; local geometry/content layouts remain per ledger.
- **MUI Dialog:** current rendered consumers are `ConfirmDialog`, `AdminImages` image preview, `ImageLightbox`, `ProfileImage` fullscreen preview and `ReportButton`. Dialog Paper inherits `MuiDialog.paper` → `getSurfaceStyles`; ImageLightbox and ProfileImage intentionally override the inner image-stage background with semantic image-lightbox tokens. Dialog consumers still own their action roles and internal layout.
- **Standalone Paper / admin tables:** no standalone `<Paper>` JSX surface was confirmed in the current branch scan. Four admin tables render `TableContainer component={Paper}`: `AdminFailedLogs`, `AdminImages`, `AdminReports`, `AdminRouteNotFoundLogs`. `ADMIN_TABLE_CONTAINER_SX` provides table container layout, but there is no general `MuiPaper` override; do not claim these Paper surfaces share the Card/Dialog surface contract.
- **Drawer / Popover:** `Header` is the only confirmed Drawer consumer. Its Drawer Paper uses local elevation 12 and height auto; navigation actions and toolbar spacing are local. No MUI Popover JSX consumer was found in the inspected TSX scope. This is a current-source search result, not proof about third-party SDK-owned popups.
- **Google Maps overlay:** `GoogleMapView` is the only app wrapper rendering `InfoWindowF`; it delegates InfoWindow chrome to Google Maps and accepts caller ReactNode content. Current trip map caller supplies only `marker.title`. No app-owned custom InfoWindow panel/surface was found in this call path.
- **Custom panel preset trace:** `getSurfaceStyles(theme)` is defined in `src/theme/components/surface.ts` and is consumed by MUI Card/Dialog theme overrides and indirectly by `PANEL_SX`. Direct rendered `PANEL_SX(theme)` consumers confirmed: `AdminUserForm` and `EditTripLayout`. `AUTH_FORM_SX` composes `PANEL_SX` and is applied by `ForgotPasswordForm`, `LoginForm`, `RegisterForm`, `ResendVerificationForm` and `ResetPasswordForm` (the reset form applies it in both form and success branches). Thus these auth wrappers are rendered panel consumers, not layout-only aliases.
- `POINT_FORM_PANEL_SX` is a separate layout/field-inset preset applied to MUI Cards in `CreatePointPage` and `EditPointPage`; it is not a direct `PANEL_SX` consumer. `CommentsSection` defines local `COMMENTS_PANEL_SX` and `COMMENT_CARD_SX` and applies them to MUI Cards, so it duplicates layout and potentially visual responsibilities that must be separated. `PANEL_SX` itself only supplies surface properties: background, border, radius and shadow; `AUTH_FORM_SX` adds column-stack layout, padding, max width, width, box sizing and centering.

### CSS Modules and adjacent surface consumers
- The current branch contains exactly eight CSS Modules: About, Privacy/Legal, NotFound, ImageGallery, Footer, TripDetailsView, TripList and TripPagination. Previous ledger batches inspected About/Legal, NotFound, ImageGallery and Footer; this batch re-inspected TripDetailsView and inspected TripList/TripPagination. No additional CSS Module was missed in the tree.
- `TripList.module.css` owns empty-state title/text typography locally; `TripList.tsx` applies shared typography and list presets via React `style`, which violates the approved Styling API.
- `TripPagination.module.css` owns nav/list geometry and consumes spacing variables, but the page links/current page have no semantic pagination appearance/state contract.
- `TripDetailsView.module.css` is primarily unique grid/flex/container-query composition; remaining literal widths and margins need classification, not wholesale removal.
- `Header`, `AddressAutocomplete`, map pickers, image lightbox/profile preview, admin tables and comment cards all retain local control/surface layout or role definitions as detailed in the updated Section 10.1 rows.

### Updated NEXT TASK
1. Complete the remaining Section 7 inventory against the exact **19 outstanding paths** from the latest recursive tree. The outstanding list is recalculated below; do not reopen already-ledgered files unless a newly discovered consumer requires it.
2. Continue the form-control map across TextField, Select, Autocomplete, Checkbox, Radio, Switch, native inputs and all field states, correlating each consumer with `src/theme/components/text-field.ts`, other theme overrides and form presets. Include `AddressAutocomplete`'s broad style injection contract.
3. Finish direct MUI Button/IconButton semantic role/state mapping beyond the existing `BUTTON_STYLES`/`BackButton` trace, including Drawer navigation, Confirm/Cancel, table actions, map controls, image overlay controls and pagination.
4. Continue CSS variable/token and raw visual literal mapping across the outstanding paths; keep the CSS Modules inventory at eight and preserve structural composition.
5. Stage 1 remains **IN PROGRESS**. Do not begin application source migration until all mandatory Section 7 consumer maps are exhaustive. Do not run build, tests, lint, CI or browser validation without explicit user authorization.

### Exact outstanding candidate paths (19)
```text
app/api/og/trips/[id]/route.ts
app/error.tsx
app/not-found.tsx
app/opengraph-image.tsx
app/robots.ts
app/sitemap.ts
app/twitter-image.tsx
src/components/admin/index.ts
src/components/auth/GuestOnly.tsx
src/components/auth/RequireAuth.tsx
src/components/auth/RequireRole.tsx
src/components/auth/RequireTripOwner.tsx
src/components/auth/index.ts
src/components/common/TabSyncListener.tsx
src/components/home/index.ts
src/components/images/index.ts
src/components/placeholders/index.ts
src/components/placeholders/socialObjectPlaceholderAssets.ts
src/components/tracking/index.ts
```

## 11.11 — Completion of the 19 outstanding file records (2026-11-18)

### Preflight and reconciliation
- Re-read the architecture ownership chain, Styling API policy (Section 1.4), six-stage plan, Section 7 search matrix, Section 10.1 and the prior NEXT TASK before inspecting source.
- Verified branch `feature/frontend-modernization` at HEAD `cfeae849079a489fe32d511c415c8afcf8341cf2`; recursive tree is complete (not truncated).
- Recomputed the exact candidate filter: **163 files**. Before this batch, 144 candidate paths had individual Section 10.1 rows and 19 did not. This batch inspected and added records for all exact 19 paths; candidate inventory coverage is now **163/163 (100%)**, with **0 candidate paths lacking an individual ledger row**.
- The Section 10.1 ledger now contains **177 unique in-scope + supporting/out-of-scope paths before adding the OG renderer**, and one additional supporting dependency row for `src/lib/images/renderTripOgImage.tsx`; this supporting renderer is not part of the 163-file candidate count. (The existing 14 non-candidate ledger paths remain outside the candidate scope.)
- Inventory coverage means every candidate path has a description; it does **not** mean all Section 7 consumer searches, semantic-role maps, CSS literal tracing, migrations or visual QA are complete. Stage 1 remains **IN PROGRESS**.

### Files inspected — all 19 formerly outstanding paths
- `app/api/og/trips/[id]/route.ts` — dynamic Node route obtains trip/day data, delegates to the OG renderer and sets immutable caching; no local UI.
- `app/error.tsx` — actual new visual consumer: local Box layout/padding/gap in `sx`, Alert and a direct contained Retry Button. It needs a shared error-screen composition and semantic Retry role.
- `app/not-found.tsx` — wrapper only; delegates to the already-inventoried NotFound component.
- `app/opengraph-image.tsx`, `app/twitter-image.tsx` — metadata image entry points; both delegate to the shared OG renderer and central SEO dimensions.
- `app/robots.ts`, `app/sitemap.ts` — crawler directives and sitemap data generation; no visual styling.
- `src/components/admin/index.ts`, `src/components/auth/index.ts`, `src/components/home/index.ts`, `src/components/images/index.ts`, `src/components/placeholders/index.ts`, `src/components/tracking/index.ts` — barrel exports only; visual consumers remain in the exported implementation files already present in Section 10.1.
- `src/components/auth/GuestOnly.tsx`, `RequireAuth.tsx`, `RequireRole.tsx`, `RequireTripOwner.tsx` — access/visibility guards; render children or null, with RequireRole delegating unauthorized output to shared NotFound. No independent local visual skin.
- `src/components/common/TabSyncListener.tsx` — cross-tab event listener and redirect; returns null.
- `src/components/placeholders/socialObjectPlaceholderAssets.ts` — five SVG path constants only; no visual declarations. The consuming placeholder component was already inventoried.

### Supporting renderer dependency discovered
- Followed the Open Graph/Twitter route imports into `src/lib/images/renderTripOgImage.tsx` and `src/lib/images/tripOgData.ts`. The data loader is presentation-free. The renderer centralizes the social-preview composition and uses `SEO_BRAND` for brand colors, but it also contains inline Satori/ImageResponse style objects and literal dimensions, spacing and typography.
- These styles are generated through Next's `ImageResponse` rendering API rather than ordinary DOM component styling. They are recorded as a renderer-specific exception candidate, not silently approved and not migrated in this batch. A later pass must confirm the Satori API constraints and centralize reusable visual values where feasible.

### Findings and impact
- Of the 19 files, **1 is a direct styling migration target** (`app/error.tsx`); the other 18 are metadata/data/route wrappers, barrel exports, auth guards, a listener or asset registry and do not own a visual skin.
- The not-found screen and placeholder UI are delegated to existing audited components; these wrappers must not duplicate their styling.
- No application source code was changed. Only the single audit document was updated.
- No build, tests, lint, CI or browser validation was run, in accordance with the standing restriction.

### Updated NEXT TASK
1. Candidate file inventory has no remaining unrecorded paths. Do not reopen these 19 files unless a new consumer or dependency is discovered.
2. Continue the mandatory Section 7 consumer map for form controls: TextField, Select, Autocomplete, InputBase, FormControl, Checkbox, Radio, Switch, native inputs and every hover/focus/error/disabled/read-only/loading state. Correlate all consumers with the text-field theme override and form presets; include `AddressAutocomplete`'s broad style-injection API.
3. Complete the direct MUI Button/IconButton and native-button role/state map beyond `BUTTON_STYLES`/BackButton, including Drawer navigation, Confirm/Cancel, table actions, map controls, image overlay controls, pagination and the new Retry action in `app/error.tsx`.
4. Continue repository-wide CSS-variable/token and raw visual-literal trace. Review the OG renderer exception candidate and its `SEO_BRAND` ownership; preserve the eight CSS Modules as structural composition where appropriate.
5. Stage 1 remains **IN PROGRESS** until these consumer maps and all Section 7 searches are exhaustive. Do not begin application source migration before that gate. Do not run build, tests, lint, CI or browser validation without explicit user authorization.

### Outstanding candidate paths
**0 — all 163 candidate paths now have an individual Section 10.1 record.** This is inventory completion only, not migration completion.


## 11.12 — Design-system dependency and ownership map (2026-11-18)

### Purpose and authority

This section converts the file inventory into an implementation dependency map. It answers four separate questions for every styling concern:

1. **Who owns the source value or rule?**
2. **Which shared layer translates or packages that rule?**
3. **Which components consume it?**
4. **Which routes/pages expose those components to users?**

This is an architecture/ownership map, not a claim that migration is complete. Section 10.1 remains the per-file ledger and source of truth for exact file-level findings. This section is the navigation index for deciding change order and impact. Where a consumer edge has not yet been exhaustively searched, it is explicitly marked OPEN rather than assumed.

### A. Canonical dependency graph

The intended dependency direction is from central owners toward leaf consumers:

```text
                    DESIGN-SYSTEM SOURCE OF TRUTH
        src/constants/ui/*   +   src/constants/images/presets.ts
                              |
                              v
                   CENTRAL TRANSLATION / EXPORT
             src/theme/index.ts  +  src/constants/ui/index.ts
                              |
              +---------------+----------------+
              |                                |
              v                                v
       MUI THEME CONTRACTS               CSS CUSTOM PROPERTIES
       src/theme/components/*            emitted by MuiCssBaseline
       src/theme/palette.ts              in src/theme/index.ts
       src/theme/shape.ts                         |
       src/theme/typography.ts                    v
       src/theme/shadows.ts              app/globals.css
              |                         *.module.css consumers
              |
              v
       SEMANTIC / COMPOSITION PRESETS
       src/styles/presets/*
              |
              v
       SHARED UI PRIMITIVES / CONTROLS
       src/components/common/*
       src/components/layout/*
       src/components/images/*
       src/components/social/*
       src/components/maps/*
              |
              v
       FEATURE COMPONENTS
       auth / admin / comments / points / trips / tracking / home
              |
              v
       ROUTE LAYOUTS AND PAGES
       app/(auth)/*  app/(account)/*  app/(admin)/*
       app/(public)/*  app/error.tsx  app/not-found.tsx
```

**Important:** this is a logical ownership graph, not a rule that every component must import every layer. A component should consume the highest-level shared contract appropriate to its role. For example, a feature button should normally consume a semantic button component/preset; it should not independently reconstruct the theme and token chain.

There are two intentional side paths:
- **Third-party rendering boundary:** Google Maps owns its canvas and built-in controls; Next ImageResponse/Satori owns the OG renderer's serialization contract. App-owned overlays and brand values remain in scope, but vendor-owned internals must not be restyled as if they were app components.
- **Structural composition:** a feature component or CSS Module may own unique grid/flex/positioning/responsive composition. It must consume central variables for shared visual values and must not become a second owner of color, typography, radius, shadow or recurring control skins.

### B. Actual current ownership chain (verified source relationships)

| Layer | Current owner files | Responsibility / current limitation |
|---|---|---|
| UI token source | `src/constants/ui/colors.ts`, `spacing.ts`, `sizes.ts`, `breakpoints.ts`, `shape.ts`, `shadows.ts`, `typography.ts`, `z-index.ts` | Canonical values. `src/constants/ui/index.ts` re-exports these modules. Individual token exports still need exhaustive consumer tracing. |
| Image role source | `src/constants/images/presets.ts` | Named image-rendering presets consumed by the shared image abstraction. Consumer parity remains part of the image audit. |
| Theme composition | `src/theme/index.ts` | Imports UI tokens, palette/shape/typography and component overrides; installs MUI defaults and emits a manually selected subset of `--ht-*` CSS variables through `MuiCssBaseline`. The exposed CSS-variable subset is not yet proven exhaustive. |
| Theme sub-owners | `src/theme/palette.ts`, `shape.ts`, `typography.ts`, `shadows.ts` | Translate canonical token values into MUI theme contracts. No parallel token source should be introduced. |
| MUI component contracts | `src/theme/components/button.ts`, `card.ts`, `dialog.ts`, `surface.ts`, `text-field.ts` | Button currently centralizes typography/radius only; Card and Dialog Paper use `getSurfaceStyles`; TextField currently sets only outlined/medium defaults. Full semantic states and field contract are incomplete. |
| Semantic presets | `src/styles/presets/buttons.ts`, `cards.ts`, `forms.ts`, `layouts.ts`, `map-controls.ts`, `panels.ts`, `social.ts`, `typography.ts` | Reusable role/layout contracts. Several presets currently mix visual skin and geometry or use React `CSSProperties`, so ownership must be separated before migration. |
| CSS bridge | `app/globals.css` and the eight CSS Modules listed in Section 10 | CSS consumes selected `--ht-*` variables. Remaining literals and native control skins need classification. |
| Shared component layer | Common, layout, image, map and social components | Should enforce shared role APIs and prevent arbitrary caller styling from bypassing them. |
| Feature/page layer | Auth, admin, comments, points, trips, tracking, home and route layouts | Should compose shared contracts and own only feature behavior and unique structure. |

### C. Semantic workstreams: owner → shared contract → consumer groups → terminal screens

The following groups define the change units. A file may appear in more than one workstream because it consumes multiple independent contracts. Do not migrate it twice or assume that changing one role fixes its other responsibilities. Exact per-file details remain in Section 10.1.

#### C1. Actions, buttons and icon actions

**Current owners**
- Source values: `src/constants/ui/colors.ts`, `spacing.ts`, `sizes.ts`, `shape.ts`, `typography.ts`.
- MUI baseline: `src/theme/components/button.ts` and `src/theme/index.ts`.
- Current role presets: `src/styles/presets/buttons.ts`.
- Shared navigation wrapper: `src/components/common/BackButton.tsx`.

**Known consumers / terminal UI**
- Common/global feedback: `src/components/common/ConfirmDialog.tsx`, `app/error.tsx`, `src/components/common/NotFound.tsx`.
- Shell/navigation: `src/components/layout/Header.tsx`, `src/components/admin/AdminNavigation.tsx`.
- Auth/profile: `ForgotPasswordForm.tsx`, `LoginForm.tsx`, `ProfileForm.tsx`, `RegisterForm.tsx`, `ResendVerificationForm.tsx`, `ResetPasswordForm.tsx`, `VerifyEmailForm.tsx`, `ChangePasswordForm.tsx`.
- Admin: `AdminUserForm.tsx`, `AdminUsers.tsx`, `AdminImages.tsx`, `AdminFailedLogs.tsx`, `AdminReports.tsx`, `AdminRouteNotFoundLogs.tsx`.
- Points/maps: `PointCard.tsx`, `PointForm.tsx`, `PointLocationPicker.tsx`, `TripLocationPicker.tsx`, `AddressAutocomplete.tsx`, `PointActions.tsx`.
- Trips: `TripCard.tsx`, `TripActions.tsx`, `TripDetails.tsx`, `TripForm.tsx`, `EditTripLayout.tsx`, `TripMapSection.tsx`, `TripPagination.tsx`, `TripDaysNav.tsx`, `TripFilters.tsx`.
- Images/social: `ImageGallery.tsx`, `ImageLightbox.tsx`, `ImageUploadField.tsx`, `ProfileImage.tsx`, `EngagementBar.tsx`, `LikeButton.tsx`, `FavoriteButton.tsx`, `ReportButton.tsx`, `TripGroupSocialActions.tsx`, `CommentsToggle.tsx`, `RepliesSection.tsx`.

**Required target:** one shared semantic action API for Back, Primary/Submit, Create, Add, Edit, Save, Delete, Remove, Cancel, Confirm, Secondary, Navigation, Retry, Upload, Pagination/Stepper, Disclosure and IconAction. A semantic role owns color/variant, dimensions, typography and interaction states. Callers may provide only explicitly supported behavior/layout options. Direct MUI/native button call sites must be classified by meaning, not merely by element type.

**Open edges:** exhaustive direct Button/IconButton/native-button and styled-link call-site map; all hover/focus/active/selected/disabled/loading states; all caller-level `sx` escape hatches. Do not declare this workstream complete yet.

#### C2. Cards, panels, dialogs, tables and other surfaces

**Current owners**
- Base surface primitive: `src/theme/components/surface.ts` → `getSurfaceStyles(theme)`.
- MUI Card: `src/theme/components/card.ts`.
- MUI Dialog Paper: `src/theme/components/dialog.ts`.
- Reusable panel: `src/styles/presets/panels.ts` → `PANEL_SX`.
- Form composition: `src/styles/presets/forms.ts` → `AUTH_FORM_SX` and `POINT_FORM_PANEL_SX`.
- Card content/layout: `src/styles/presets/cards.ts` (not the surface skin).

**Known consumer groups**
- Card surfaces: `AdminUsers.tsx`, `VerifyEmailForm.tsx`, `CommentsSection.tsx`, `CreatePointPage.tsx`, `EditPointPage.tsx`, `PointCard.tsx`, `PointSection.tsx`, `TripCard.tsx`, `TripDetails.tsx`, `TripForm.tsx`, `TripMapSection.tsx`.
- Dialog surfaces: `ConfirmDialog.tsx`, `AdminImages.tsx`, `ImageLightbox.tsx`, `ProfileImage.tsx`, `ReportButton.tsx`.
- Direct panel preset: `AdminUserForm.tsx`, `EditTripLayout.tsx`.
- Auth panel composition: `ForgotPasswordForm.tsx`, `LoginForm.tsx`, `RegisterForm.tsx`, `ResendVerificationForm.tsx`, `ResetPasswordForm.tsx`.
- Separate point form panel: `CreatePointPage.tsx`, `EditPointPage.tsx`.
- Admin table Paper wrappers: `AdminFailedLogs.tsx`, `AdminImages.tsx`, `AdminReports.tsx`, `AdminRouteNotFoundLogs.tsx`, using `TableContainer component={Paper}` and `ADMIN_TABLE_CONTAINER_SX`.
- Custom surface/layout candidates: `CommentsSection.tsx`, image lightbox/profile preview, social overlays, sticky social surface, Header Drawer and CSS Module page surfaces.

**Required target:** separate the reusable surface skin (background, border, radius, shadow, text contrast and state) from content geometry (padding, grid, flex, max-width, insets). Define named surface roles only where semantics differ: Card, FormPanel, ContentPanel, Dialog, TableSurface, Nested/Inset, ImageStage, Overlay and Drawer. Do not force all Paper/Box elements into one Card skin.

**Open edges:** property-level consumer trace for `getSurfaceStyles`, `PANEL_SX`, `AUTH_FORM_SX`, `POINT_FORM_PANEL_SX`, Card/Paper/Dialog/Drawer and custom Box/native surfaces; confirm every call site and whether the role is a true surface or layout-only wrapper.

#### C3. Fields, form controls and validation states

**Current owners**
- Token source: UI colors, spacing, sizes, shape and typography modules.
- MUI defaults: `src/theme/components/text-field.ts` (currently only variant/size).
- Form composition: `src/styles/presets/forms.ts`.
- Map address variant: `src/styles/presets/map-controls.ts` → `MAP_ADDRESS_INPUT_SX`.
- Reusable map wrapper: `src/components/maps/AddressAutocomplete.tsx`.

**Known consumer groups**
- Auth/profile forms: ChangePassword, ForgotPassword, Login, Profile, Register, ResendVerification, ResetPassword and VerifyEmail forms; shared PasswordField, PasswordRequirements and Captcha.
- Point/trip forms: PointForm, CreatePointPage, EditPointPage, TripForm, TripFilters and TripSelectField.
- Map fields: AddressAutocomplete, PointLocationPicker and TripLocationPicker.
- Admin fields: AdminUserForm and any filters/search controls in AdminUsers/Admin tables.

**Required target:** a shared field contract for label/helper/error text, typography, input height/padding, border/radius, adornments and hover/focus/error/disabled/read-only/loading states. Select, Autocomplete, InputBase, Checkbox, Radio, Switch and native inputs must be included; do not assume TextField override covers them. AddressAutocomplete must stop exposing unrestricted visual injection where a named variant or controlled layout API is sufficient.

**Open edges:** exhaustive JSX and import map for TextField, Select, Autocomplete, InputBase, FormControl, Checkbox, Radio, Switch and native inputs; property-level caller map for `inputSx`, `buttonSx`, `containerSx` and `textFieldProps`; all state selectors and adornments.

#### C4. Layout, spacing, typography and CSS Modules

**Current owners**
- Values: `src/constants/ui/spacing.ts`, `sizes.ts`, `breakpoints.ts`, `typography.ts`, `z-index.ts`.
- Theme translation: `src/theme/index.ts`, `src/theme/typography.ts`, `src/theme/shape.ts`.
- Reusable composition: `src/styles/presets/layouts.ts`, `cards.ts`, `forms.ts`, `typography.ts`.
- CSS bridge: selected `--ht-*` variables emitted by `src/theme/index.ts`.

**Eight CSS Modules**
1. `app/(public)/about/AboutPage.module.css`
2. `app/(public)/privacy-policy/LegalPage.module.css`
3. `src/components/common/NotFound.module.css`
4. `src/components/images/ImageGallery.module.css`
5. `src/components/layout/Footer.module.css`
6. `src/components/trips/TripDetailsView.module.css`
7. `src/components/trips/TripList.module.css`
8. `src/components/trips/TripPagination.module.css`

**Required target:** preserve unique structural composition and responsive rules; migrate shared visual values to tokens/CSS variables; replace prohibited React `style` usage; classify every hardcoded gap, margin, padding, font size/weight/line height, width/height, radius, shadow, color and focus outline. Keep `app/globals.css` limited to reset, shell and CSS-variable consumers. Remove the legacy `.ht-button` skin only after proving all consumers are gone.

**Open edges:** complete selector-to-className map; all `--ht-*` declarations and consumers; all token export consumers; remaining raw literal scan and responsive/state classification.

#### C5. Images, upload previews and image overlays

**Current owners**
- Named image presets: `src/constants/images/presets.ts`.
- Shared renderer: `src/components/images/AppImage.tsx`.
- Image composition: `ImageGallery.tsx`, `ImageLightbox.tsx`, `ImageUploadField.tsx`, `ProfileImage.tsx`, `AdminUserProfileImage.tsx`, `AdminImages.tsx`, `DayImagesGallery.tsx`, `SocialObjectPlaceholder.tsx`.
- CSS structure: `ImageGallery.module.css`; image stage/overlay styles are also present in component compositions.

**Required target:** one named contract for avatar/profile, card thumbnail, point thumbnail, gallery grid, gallery stack, upload preview, editor thumbnail, lightbox/image stage, hero and OG. Fit, frame, dimensions, radius, crop and overlay controls must be owned by the role. Keep image loading/data behavior separate from presentation.

**Open edges:** exhaustive Next Image/AppImage/native img/component="img" map; every preset property and consumer; overlay/close/previous/next/upload/remove controls; third-party/Satori constraints in `src/lib/images/renderTripOgImage.tsx`.

#### C6. Social, comments and feedback

**Current owners**
- Shared visual presets: `src/styles/presets/social.ts`.
- Shared controls: `EngagementBar.tsx`, `LikeButton.tsx`, `FavoriteButton.tsx`, `ReportButton.tsx`, `TripGroupSocialActions.tsx`, `SocialConfigStatus.tsx`.
- Composition consumers: CommentsSection, CommentsToggle, RepliesSection, PointActions, TripDetailsView, PointSection and trip/card/image overlays.
- General feedback boundary: NotificationProvider, ConfirmDialog and MUI Alert/Snackbar theme behavior.

**Required target:** shared control size, icon/badge geometry, overlay/sticky surface, spacing, count and error/loading/disabled states. Keep social-specific overlay surfaces distinct from ordinary Cards and map overlays. Comments/replies must use the same content surface roles where their semantics match.

**Open edges:** exhaustive consumer and state trace for each social preset export and each shared social component; audit Alert/Snackbar local widths and all feedback variants.

#### C7. Navigation, page shell and route composition

**Current owners**
- Root theme/provider: `app/providers.tsx`, `app/layout.tsx`.
- Global shell CSS: `app/globals.css`.
- Shared shell: `Header.tsx`, `Footer.tsx` + `Footer.module.css`.
- Navigation/action roles: shared action contract (to be completed).
- Route wrappers: account/admin/auth/public layouts and page files in Section 10.

**Known terminal screens:** home, public trip list/details/live-tracking/about/legal, account favorites/my-trips/profile, auth pages, admin dashboard/users/images/logs/reports, error and not-found screens.

**Required target:** root theme and shell own global defaults; Header/Footer own composition but consume shared surface/action contracts; route layouts own only route-specific composition; page components consume feature-level semantic contracts. A route wrapper with no visual declarations is not a migration target merely because it imports a styled child.

**Open edges:** complete route-to-component composition map for all layouts/pages and verify every page's visual responsibility against Section 10.1.

#### C8. Maps and tracking

**Current owners**
- Map-specific preset: `src/styles/presets/map-controls.ts`.
- Address field wrapper: `AddressAutocomplete.tsx`.
- Map primitives: `GoogleMapView.tsx`, `PointLocationPicker.tsx`, `TripLocationPicker.tsx`.
- Feature consumers: PointForm/CreatePointPage/EditPointPage, TripForm and trip map sections, LiveTracker.

**Required target:** separate app-owned address field, map action controls, app-owned overlays and tracking controls from Google Maps canvas/native controls. Shared map actions should use the same semantic button/icon roles as the rest of the app, with map-specific geometry only where justified.

**Open edges:** exact caller and state map for every map control, overlay and tracking action; identify Google-owned vs app-owned controls.

### D. Change order and dependency gates

This map does not replace the approved six-stage plan in Section 6. It makes the order of work explicit within that plan:

| Order | Work package | Central owner(s) to establish first | Then migrate consumers | Gate before proceeding |
|---:|---|---|---|---|
| 1 | Tokens and CSS-variable bridge | `src/constants/ui/*`, `src/theme/index.ts` | CSS Modules and all preset/theme consumers | Every token has one owner; CSS exposure and consumer map are exhaustive. |
| 2 | MUI theme contracts | `src/theme/components/*`, palette/shape/typography/shadows | All MUI Button/Card/Dialog/field consumers | Defaults and states are defined; no unsupported assumption that one override covers other component families. |
| 3 | Semantic actions | `src/styles/presets/buttons.ts` and shared action components | Common, auth, admin, points, trips, maps, images, social, pagination, error screen | Every action call site has a semantic role and caller API cannot override the visual contract. |
| 4 | Surfaces | `surface.ts`, Card/Dialog overrides, `panels.ts`, `cards.ts` | All Card/Paper/Dialog/Drawer/custom surface consumers | Surface skin and layout are separated; every surface consumer is mapped. |
| 5 | Fields and forms | `text-field.ts`, `forms.ts`, `map-controls.ts` | Auth/profile, admin, points/trips, autocomplete and native controls | All field families and states/callers are mapped; no uncontrolled style-injection path remains. |
| 6 | Layout/typography/CSS | tokens, `layouts.ts`, `typography.ts`, globals and eight CSS Modules | Shell, pages, lists, pagination, legal/about/not-found/trip details | Unique structure retained; all shared visual literals are token-backed. |
| 7 | Images/social/maps specialized roles | image presets/AppImage; social presets; map presets and wrappers | Image, social, map and tracking consumers | App-owned vs vendor-owned presentation is separated; all overlay/control states mapped. |
| 8 | Feature migration and final audit | All central contracts above | Stage 5 order in Section 6 | No consumer is left on a legacy local skin; targeted source searches completed. |

**Do not implement in this table's order as blind file batches.** For each package: map declarations → map all imports/call sites → define owner/API → migrate a coherent consumer group → search for remaining old declarations → update Section 10.1 and this log. A component that consumes several packages is marked complete only after all its responsibilities are migrated.

### E. How to use the map during every future batch

1. Read Sections 1.4, 2, 6, 7, 10.1 and this Section 11.12 before work.
2. Start from the current NEXT TASK and select one dependency workstream, not an arbitrary list of files.
3. Verify current branch and HEAD; compare against the last recorded state. Do not create branches.
4. Trace upstream owners and downstream consumers before changing a declaration.
5. Record every edge as `owner → imported preset/override → component → caller/page`. Include property-level preset references and all call sites, not just import presence.
6. Assign each finding one status: `MAPPED`, `OPEN`, `MIGRATION TARGET`, `MIGRATED`, or `VERIFIED`. `VERIFIED` requires consumer/state/responsive evidence; reading a file is not sufficient.
7. Change only the approved central owner and its coherent consumer batch. Do not mix unrelated business logic or API changes.
8. Re-search the exact old token/preset/class/prop and record the remaining consumer count.
9. Update Section 10.1 for each affected file and append a dated Section 12 log entry. Update the NEXT TASK here.
10. Never run build, tests, lint, CI or browser validation without explicit user authorization.

### F. Current dependency-map status and exact next task

- **Per-file candidate inventory:** 163/163 paths have individual records in Section 10.1 (inventory coverage only).
- **Central ownership chain:** mapped at architecture level above.
- **Confirmed direct ownership edges:** UI token modules → `src/theme/index.ts`; theme composition → MUI component overrides; `card.ts` and `dialog.ts` → `getSurfaceStyles`; `PANEL_SX` → `getSurfaceStyles`; `AUTH_FORM_SX` → `PANEL_SX`; `MAP_ADDRESS_INPUT_SX` → map field consumers; named image presets → AppImage.
- **Consumer graph:** PARTIAL. The groups above consolidate known consumers from Sections 10/10.1 and prior batches. Property-level exhaustive maps remain open where stated. No migration completion is implied.
- **Stage:** Stage 1 remains IN PROGRESS. Do not begin application source migration until the mandatory consumer maps in Section 7 are exhaustive.

**NEXT TASK — continue dependency-edge completion, not a fresh file inventory:**
1. Complete the form-control dependency map (TextField, Select, Autocomplete, InputBase, FormControl, Checkbox, Radio, Switch and native inputs), including every caller and every hover/focus/error/disabled/read-only/loading state. Record the complete `AddressAutocomplete` style-injection/caller contract.
2. Complete direct MUI Button/IconButton/native-button/styled-link role mapping, including all callers and states; include the new Retry role in `app/error.tsx`.
3. Reconcile every preset export and CSS variable to all property-level consumers; record exact remaining raw visual literal/style-prop/sx occurrences.
4. Close the surface map for `getSurfaceStyles`, `PANEL_SX`, `AUTH_FORM_SX`, `POINT_FORM_PANEL_SX`, Card/Paper/Dialog/Drawer and custom surfaces.
5. Revisit the OG renderer exception candidate only after the ordinary DOM dependency map is stable; establish Satori constraints and `SEO_BRAND` ownership.
6. Update this map and Section 10.1 after each batch. Keep Stage 1 open until all mandatory searches are exhaustive.

No application source code was changed in this map-creation batch. No build, tests, lint, CI or browser validation was run.


### 2026-11-18 — Design-system dependency and ownership map created

- Re-read the approved architecture, Styling API policy, six-stage plan, mandatory search matrix, file manifest, Section 10.1 ledger and latest audit entry before writing.
- Re-fetched the live token export, theme composition, MUI overrides, shared presets, BackButton, ConfirmDialog, AddressAutocomplete and app error-screen source from `feature/frontend-modernization`.
- Added Section 11.12 to this same audit document. It establishes the central source-to-screen dependency graph, records verified ownership edges, groups known consumer families, defines migration gates and records the exact next dependency-mapping tasks.
- The map distinguishes confirmed edges from open consumer searches; it does not claim that the 163-file inventory is a completed migration or that all consumer edges are exhaustive.
- No application source code changed. No branch was created. No build, tests, lint, CI or browser validation was run.



## 11.13 — Route-to-component dependency graph and cross-page reuse map (2026-11-18)

### Preflight and scope

- Re-read Sections 1, 1.4, 2, 6, 7, 10.1, 11.11 and 11.12, plus repository AGENTS.md.
- Repository: AngelGeorgievStoyanov/hacktrip-web; branch: feature/frontend-modernization; HEAD: 76016b33feece8109881ddee14bc574c20835fca.
- Recursive tree is complete (tree.truncated=false): 275 tracked files, 31 app route/layout TS/TSX files, 88 src/components TS/TSX files.
- The 88 component files include visible UI, route guards, providers/listeners, barrels and asset-only support files; they are not 88 independent visible widgets.
- This is a route composition/import graph. It is not yet a property-level audit of every style declaration, state selector or responsive rule.

### A. Global root and shared provider chain

```text
app/layout.tsx
  ├─ app/globals.css
  ├─ SiteStructuredData
  └─ Providers (app/providers.tsx)
       ├─ AppRouterCacheProvider
       ├─ ThemeProvider(src/theme) + CssBaseline
       ├─ QueryClientProvider
       ├─ AuthProvider
       ├─ BackgroundProvider
       ├─ NotificationProvider
       ├─ ConfirmDialogProvider
       └─ TabSyncListener
            └─ route tree
```

- app/layout.tsx owns document root, global stylesheet import, metadata/viewport and app-shell wrapper.
- app/globals.css owns global reset, document/font rules, app shell and CSS-variable bridge.
- app/providers.tsx composes providers; src/theme/index.ts owns the theme passed to ThemeProvider.
- NotificationProvider owns notification context and Snackbar/Alert rendering. ConfirmDialog owns confirmation context and Dialog rendering.
- TabSyncListener is behavior-only. SiteStructuredData is structured-data output, not a page skin.

### B. Route groups and composition roots

#### B1. Public — app/(public)/layout.tsx renders Header → route content → Footer

| Route | Entry file | Direct UI root | Nested graph |
|---|---|---|---|
| Home / | app/(public)/page.tsx | HomeHero | HomeHero → WelcomeHeading → ScrambleHeading; HomeHero children → HomeTrips → TripList → TripCard. |
| Trips /trips | app/(public)/trips/page.tsx | TripFilters, WelcomeHeading, TripList, TripPagination | TripList → TripCard; WelcomeHeading → ScrambleHeading; TripFilters uses AppBar/Toolbar/FormControl/Select and styled InputBase/search composition. |
| Trip details /trips/[id] | app/(public)/trips/[id]/page.tsx | JsonLd, TripDetailsView | TripDetailsView → TripDaysNav, TripGroupSocialActions, TripDetails, DayImagesGallery, CommentsSection, TripMapSection, PointsSection. |
| Live tracking /live-tracking | app/(public)/live-tracking/page.tsx | RequireModeratorRedirect, LiveTracker | LiveTracker owns tracking UI and app-side route controls; it uses Google Maps primitives directly, not GoogleMapView. |
| About /about | app/(public)/about/page.tsx | WelcomeHeading, Next Image | WelcomeHeading → ScrambleHeading; AboutPage.module.css and a local image style object also belong to this route. |
| Privacy Policy /privacy-policy | app/(public)/privacy-policy/page.tsx | Native legal-content markup | LegalPage.module.css; no shared feature component in the route body. |

#### B2. Account — app/(account)/layout.tsx renders RequireAuth → Header → route content → Footer

| Route | Entry file | Direct UI root | Nested graph |
|---|---|---|---|
| Favorites /favorites | app/(account)/favorites/page.tsx | TripList and loading/error/empty MUI composition | TripList → TripCard. |
| My Trips /my-trips | app/(account)/my-trips/page.tsx | Create Trip action and TripList | TripList → TripCard; Create Trip consumes BUTTON_STYLES. |
| Profile /profile | app/(account)/profile/page.tsx | ProfileForm inside PANEL_SX | ProfileForm → ProfileImage, ProfileImageUpload, ChangePasswordForm, BackButton; ProfileImage → AppImage/Dialog/confirmation/notification; ProfileImageUpload → CustomFileUploadButton. |
| Edit Point /points/edit/[pointId] | app/(account)/points/edit/[pointId]/page.tsx | EditPointPage | EditPointPage → PointForm, PointLocationPicker, AppImage, SocialObjectPlaceholder, ConfirmDialog; PointForm → AddressAutocomplete, ImageUploadField, BackButton; PointLocationPicker → AddressAutocomplete, GoogleMapView. |
| Edit Trip /trips/[id]/edit | app/(account)/trips/[id]/edit/page.tsx | RequireTripOwner → EditTripLayout | EditTripLayout → TripLocationPicker, TripSelectField, ImageUploadField, AppImage, SocialObjectPlaceholder, ConfirmDialog, BackButton; TripLocationPicker → AddressAutocomplete, GoogleMapView. |
| Create Trip /trips/create | app/(account)/trips/create/page.tsx | TripForm | TripForm → TripLocationPicker, TripSelectField, ImageUploadField, BackButton; TripLocationPicker → AddressAutocomplete, GoogleMapView. |
| Create Trip Point /trips/create/points | app/(account)/trips/create/points/page.tsx | CreatePointPage | CreatePointPage → PointList, PointLocationPicker, PointForm, ConfirmDialog; PointList → PointCard → GoogleMapView; PointForm → AddressAutocomplete, ImageUploadField, BackButton. |

#### B3. Auth — app/(auth)/layout.tsx renders Header → GuestOnly → route content → Footer

| Route | Entry file | Direct UI root | Nested graph |
|---|---|---|---|
| Login /login | app/(auth)/login/page.tsx | LoginForm | WelcomeHeading → ScrambleHeading; PasswordField/icon controls, Captcha, notifications and button presets. |
| Register /register | app/(auth)/register/page.tsx | GuestOnly → RegisterForm | WelcomeHeading → ScrambleHeading; PasswordField, PasswordRequirements, Captcha, notifications and button presets. |
| Forgot Password /forgot-password | app/(auth)/forgot-password/page.tsx | ForgotPasswordForm | WelcomeHeading → ScrambleHeading; Captcha, BackButton, notifications and button presets. |
| Resend Verification /resend-verification | app/(auth)/resend-verification/page.tsx | ResendVerificationForm | WelcomeHeading → ScrambleHeading; Captcha, BackButton, notifications and button presets. |
| Reset Password /reset-password | app/(auth)/reset-password/page.tsx | ResetPasswordForm | WelcomeHeading → ScrambleHeading; PasswordField, PasswordRequirements, BackButton and notifications. |
| Verify Email /verify-email | app/(auth)/verify-email/page.tsx | VerifyEmailForm | MUI Card/feedback/button composition; shared NotificationProvider. |

#### B4. Admin — app/(admin)/layout.tsx renders RequireRole → Header → AdminNavigation → route content → Footer

| Route | Entry file | Direct UI root | Nested graph |
|---|---|---|---|
| Admin landing /admin | app/(admin)/admin/page.tsx | Native section and h1 | Does not currently render AdminDashboard; do not assume that file owns the route. |
| Users /admin/users | app/(admin)/admin/users/page.tsx | AdminUsers | User cards, Avatar/AppImage, ImageLightbox and action controls. |
| Edit User /admin/users/[userId] | app/(admin)/admin/users/[userId]/page.tsx | AdminUserForm | AdminUserProfileImage, PasswordField, PasswordRequirements, ConfirmDialog, BackButton and fields; AdminUserProfileImage → AppImage, ImageUploadField, ImageLightbox. |
| Images /admin/images | app/(admin)/admin/images/page.tsx | AdminImages | CloudImages, DatabaseImages, OrphanImages, MissingThumbnails local views; Dialog, image controls and pagination. |
| Failed Login Logs /admin/failed-login-logs | app/(admin)/admin/failed-login-logs/page.tsx | AdminFailedLogs | Table, selection, pagination and ConfirmDialog/action controls. |
| Reports /admin/reports | app/(admin)/admin/reports/page.tsx | AdminReports | Table, pagination and ConfirmDialog/action controls; route also has native h1. |
| Route Not Found Logs /admin/route-not-found-logs | app/(admin)/admin/route-not-found-logs/page.tsx | AdminRouteNotFoundLogs | Table, disclosure/collapse and pagination controls. |

### C. Nested feature dependency graph

#### C1. Trip Details

```text
TripDetailsView
  ├─ TripDaysNav
  ├─ TripGroupSocialActions → SocialConfigStatus, CommentsToggle, LikeAnimation behavior
  ├─ TripDetails → TripActions, FavoriteButton, BackButton, EngagementBar
  │    └─ EngagementBar → LikeButton, FavoriteButton, ReportButton, SocialConfigStatus, CommentsSection
  ├─ DayImagesGallery → ImageGallery → AppImage, EngagementBar overlay, SocialConfigStatus, ImageLightbox → AppImage
  │    └─ SocialObjectPlaceholder
  ├─ CommentsSection → LikeButton, FavoriteButton, ReportButton, SocialConfigStatus, RepliesSection
  │    └─ RepliesSection → LikeButton, FavoriteButton, ReportButton
  ├─ TripMapSection → GoogleMapView
  └─ PointsSection → PointSection
       ├─ ImageGallery, SocialObjectPlaceholder, ExpandableText
       ├─ PointActions → LikeButton, FavoriteButton, ReportButton, SocialConfigStatus
       └─ CommentsToggle
```

Social controls and image components are reused in trip, day, point, image and comment contexts. Their visual contract belongs to the shared component/preset, not to each page; only semantic variants such as inline versus image-overlay may differ.

#### C2. Forms, maps and uploads

```text
PointForm → AddressAutocomplete, ImageUploadField → CustomFileUploadButton, BackButton
PointLocationPicker → AddressAutocomplete, GoogleMapView
TripLocationPicker → AddressAutocomplete, GoogleMapView
TripForm / EditTripLayout → TripLocationPicker, TripSelectField, ImageUploadField → CustomFileUploadButton, BackButton
EditTripLayout additionally → AppImage, SocialObjectPlaceholder
ProfileForm → ProfileImage → AppImage, CustomFileUploadButton; ChangePasswordForm → PasswordField, PasswordRequirements; BackButton
AdminUserForm → AdminUserProfileImage → AppImage, ImageUploadField → CustomFileUploadButton, ImageLightbox; PasswordField, PasswordRequirements, ConfirmDialog, BackButton
```

#### C3. Shared/common dependencies

- WelcomeHeading → ScrambleHeading; WelcomeHeading is reused by Home, Trips and five auth forms, not only Home.
- BackButton → MUI Button + BUTTON_STYLES.back; nine direct callers remain recorded in Section 11.7.
- ConfirmDialog is globally mounted by Providers and consumed through its confirmation context by admin, profile, points and social flows.
- NotificationProvider is globally mounted by Providers and consumed by auth/profile, image and social flows.
- PasswordField and PasswordRequirements are shared auth/profile form primitives.
- NotFound is used by the not-found route and authorization fallback; JsonLd is used by Trip Details; ExpandableText is used by point content.
- CustomFileUploadButton is shared by profile-image and general image-upload flows.

### D. Cross-page reuse index — one record per shared component

| Shared component | Consumers | Routes affected |
|---|---|---|
| Header, Footer | Public, account, auth and admin layouts | All four route groups |
| TripList | HomeTrips, Trips page, Favorites, My Trips | /, /trips, /favorites, /my-trips |
| TripCard | TripList | Same four routes as TripList |
| WelcomeHeading | HomeHero, Trips page, ForgotPasswordForm, LoginForm, RegisterForm, ResendVerificationForm, ResetPasswordForm | Home, Trips and five auth forms |
| ScrambleHeading | WelcomeHeading | Every route using WelcomeHeading |
| BackButton | Nine direct callers in Section 11.7 | Admin user edit, auth, profile, point/trip forms and Trip Details |
| AddressAutocomplete | PointForm, PointLocationPicker, TripLocationPicker | Create/Edit Point, Create/Edit Trip and map picker flows |
| GoogleMapView | PointCard, PointLocationPicker, TripLocationPicker, TripMapSection | Point cards, point/trip forms and Trip Details |
| AppImage | TripCard, ImageGallery, ImageLightbox, ProfileImage, AdminUserProfileImage, AdminUsers, EditPointPage, EditTripLayout and related image compositions | Home, Trips, Trip Details, Account, Admin and editing flows |
| ImageGallery | DayImagesGallery, PointSection | Trip Details |
| ImageLightbox | ImageGallery, AdminUserProfileImage, AdminUsers | Trip Details and Admin |
| ImageUploadField | PointForm, EditTripLayout, AdminUserProfileImage | Point, trip and Admin editing |
| CustomFileUploadButton | ImageUploadField, ProfileImageUpload | Point/trip/Admin upload and Profile |
| SocialObjectPlaceholder | TripCard, DayImagesGallery, PointSection, EditPointPage, EditTripLayout | Home, Trips, Trip Details and editing flows |
| ConfirmDialog | AdminUserForm, AdminFailedLogs, AdminReports, CreatePointPage, EditPointPage, ProfileImage and social/report flows | Admin, Profile, points and social |
| NotificationProvider | Global provider; auth/profile, image and social consumers | App-wide |
| LikeButton, FavoriteButton, ReportButton, SocialConfigStatus | EngagementBar, CommentsSection, RepliesSection, PointActions, TripGroupSocialActions | Trip, day, point, image and comment contexts |
| EngagementBar | TripDetails, ImageGallery | Trip Details and image overlays |
| CommentsSection | EngagementBar and TripDetailsView | Trip Details and nested social overlays |
| RepliesSection | CommentsSection | Trip Details comments |
| CommentsToggle | PointSection, TripGroupSocialActions | Point and trip-group details |
| PointForm | CreatePointPage, EditPointPage | Create/Edit Point |
| PointList, PointCard | CreatePointPage → PointList → PointCard | Create Trip Points |
| TripSelectField, TripLocationPicker | TripForm, EditTripLayout | Create/Edit Trip |
| PointLocationPicker | PointForm and Create/Edit Point composition | Create/Edit Point |
| ProfileImage, ChangePasswordForm | ProfileForm | Profile |
| AdminUserProfileImage | AdminUserForm | Admin user edit |

Reuse rule: do not create one visual implementation per route for any row above. Migrate the shared component/preset once, then verify every listed route consumer and caller-specific semantic variant.

### E. Complete component-file enumeration — all 88 current files

- Root/shared upload (1): CustomFileUploadButton.tsx.
- Admin (10): AdminDashboard.tsx, AdminFailedLogs.tsx, AdminImages.tsx, AdminNavigation.tsx, AdminReports.tsx, AdminRouteNotFoundLogs.tsx, AdminUserForm.tsx, AdminUserProfileImage.tsx, AdminUsers.tsx, index.ts.
- Auth (16): Captcha.tsx, ChangePasswordForm.tsx, ForgotPasswordForm.tsx, GuestOnly.tsx, LoginForm.tsx, ProfileForm.tsx, ProfileImage.tsx, RegisterForm.tsx, RequireAuth.tsx, RequireModeratorRedirect.tsx, RequireRole.tsx, RequireTripOwner.tsx, ResendVerificationForm.tsx, ResetPasswordForm.tsx, VerifyEmailForm.tsx, index.ts.
- Comments (3): CommentsSection.tsx, CommentsToggle.tsx, RepliesSection.tsx.
- Common (11): BackButton.tsx, ConfirmDialog.tsx, ExpandableText.tsx, JsonLd.tsx, NotFound.tsx, NotificationProvider.tsx, PasswordField.tsx, PasswordRequirements.tsx, ScrambleHeading.tsx, TabSyncListener.tsx, WelcomeHeading.tsx.
- Home (3): HomeHero.tsx, HomeTrips.tsx, index.ts.
- Images (5): AppImage.tsx, ImageGallery.tsx, ImageLightbox.tsx, ImageUploadField.tsx, index.ts.
- Layout (2): Footer.tsx, Header.tsx.
- Maps (4): AddressAutocomplete.tsx, GoogleMapView.tsx, PointLocationPicker.tsx, TripLocationPicker.tsx.
- Placeholders (3): SocialObjectPlaceholder.tsx, index.ts, socialObjectPlaceholderAssets.ts.
- Points (6): CreatePointPage.tsx, EditPointPage.tsx, PointActions.tsx, PointCard.tsx, PointForm.tsx, PointList.tsx.
- Social (7): EngagementBar.tsx, FavoriteButton.tsx, LikeAnimation.tsx, LikeButton.tsx, ReportButton.tsx, SocialConfigStatus.tsx, TripGroupSocialActions.tsx.
- Tracking (2): LiveTracker.tsx, index.ts.
- Trips (15): DayImagesGallery.tsx, EditTripLayout.tsx, PointSection.tsx, PointsSection.tsx, TripActions.tsx, TripCard.tsx, TripDaysNav.tsx, TripDetails.tsx, TripDetailsView.tsx, TripFilters.tsx, TripForm.tsx, TripList.tsx, TripMapSection.tsx, TripPagination.tsx, TripSelectField.tsx.

### F. CSS Modules and global stylesheet ownership

| Stylesheet | Owner | Route/component scope |
|---|---|---|
| app/(public)/about/AboutPage.module.css | About page | About route |
| app/(public)/privacy-policy/LegalPage.module.css | Legal page | Privacy Policy route |
| src/components/common/NotFound.module.css | NotFound | Not-found/error fallback |
| src/components/images/ImageGallery.module.css | ImageGallery | Trip/day/point galleries |
| src/components/layout/Footer.module.css | Footer | Public, account, auth and admin layouts |
| src/components/trips/TripDetailsView.module.css | TripDetailsView | Public Trip Details |
| src/components/trips/TripList.module.css | TripList | Home, Trips, Favorites and My Trips |
| src/components/trips/TripPagination.module.css | TripPagination | Public Trips list |

app/globals.css is above all route groups and must remain the global reset/shell/CSS-variable bridge, not a second feature-component styling system.

### G. Confirmed local styling targets exposed by this map

These are observed examples, not the complete raw-style inventory:

- Home route uses style={CENTERED_PAGE_MAIN_STYLE}; the value is shared, but React style is prohibited by the approved Styling API policy.
- Public layout uses an inline flex wrapper style.
- HomeHero applies HOME_INTRO_STYLE through React style and adds a local maxWidth delta.
- HomeTrips applies HOME_HEADING_STYLE through React style.
- WelcomeHeading and ScrambleHeading expose/use React style props while also defining local MUI sx layout.
- Account, auth and admin layouts apply route-shell presentation through React style.
- About page defines a local image style object while also using its CSS Module.
- TripList uses React style for heading/list presentation and also consumes TripList.module.css.
- TripDetailsView consumes its CSS Module plus MUI sx; shared visual values still require property-level review.
- ImageGallery combines its CSS Module, MUI sx and shared AppImage/image presets.
- Social/comment components contain local sx and, in some cases, local style constants alongside shared social presets.
- AddressAutocomplete exposes inputSx, buttonSx, containerSx and textFieldProps; all callers and forwarded TextField styling must be traced before narrowing this API.
- Components use MUI primitives directly (Button, IconButton, Card, Dialog, TextField, Select, Alert, Table, Drawer, etc.). The route graph does not imply these are already covered by a shared semantic role.

### H. Completeness assessment and next task

**Covered:** all 31 route/layout files have direct composition roots; all 88 component files have been enumerated and their imports, JSX references and styling API markers inspected; route groups are connected to terminal screens; major cross-page reuse is consolidated; all eight CSS Modules are assigned to owners and route consumers.

**Still open:** this is a composition/import map, not proof that all styling is centralized. Exact direct/transitive call-site closure remains open for ConfirmDialog, AppImage, ImageUploadField, SocialObjectPlaceholder and icon/action wrappers. Component-local sx, React style props, CSS Module declarations, token property references, MUI overrides and interaction/responsive states have not been reconciled property by property. Google Maps/vendor-owned canvas and controls must remain separate from HackTrip-owned overlays. The unused status of any component, including AdminDashboard, requires repository-wide search before dead-code classification.

**NEXT TASK — complete the style-owner graph:**
1. For every route root, record exact component file, nested children, CSS Module, local sx/React style declarations, imported presets/tokens and direct MUI/native controls.
2. Build exact call-site indexes for every shared component and preset; distinguish direct consumers from transitive route consumers.
3. Complete each owner chain: route → feature component → shared component → preset/override → theme/CSS variable → canonical token. Record exceptions and migration targets.
4. Complete field, button, surface, image, social and map state/responsive matrices against Section 7.
5. Update Section 10.1 for each inspected file. Keep Stage 1 IN PROGRESS until all required searches are exhaustive.
6. Do not start application source migration before the Stage 1 consumer-map gate is closed.
7. Do not run build, tests, lint, CI or browser validation without explicit user authorization.

No application source code was changed. No branch was created. No build, tests, lint, CI or browser validation was run.


### 2026-11-18 — Route-to-component dependency graph recorded

- Re-read the audit architecture, Styling API policy, six-stage plan, mandatory search matrix, file ledger and current dependency/ownership map.
- Re-read repository AGENTS.md and inspected current route/layout and component source files.
- Recorded route-group composition, nested feature dependencies, cross-page reuse, all 88 component paths and all eight CSS Module ownership links in Section 11.13.
- Section 11.5 was translated into English; a full-document scan confirms zero Cyrillic characters.
- This graph is a composition/import map. Property-level style ownership, interaction states and exact call-site closure remain open; Stage 1 remains IN PROGRESS.
- No application source code changed. No branch was created. No build, tests, lint, CI or browser validation was run.



## 11.14 — Home route end-to-end style ownership audit (2026-11-18)

### Scope and method

- Re-read the approved styling architecture, Styling API policy, six-stage plan, Section 7 audit matrix, Section 10.1 ledger and Sections 11.12–11.13 before this batch.
- Repository: `AngelGeorgievStoyanov/hacktrip-web`; branch: `feature/frontend-modernization`; starting HEAD: `7c2ca47ce696cfb16327f71771782ed31d253f17`.
- Inspected the Home route entry, public route layout, every component in the Home composition chain, the shared TripList/TripCard subtree, image/placeholder dependencies, public Header/Footer, and the exact presets/tokens/theme files imported by those components.
- No application source files were modified. This is a source-level ownership audit, not browser verification.

### A. Exact Home render and ownership chain

```text
app/layout.tsx
  └─ app/(public)/layout.tsx
       ├─ Header
       ├─ route content wrapper: <div style={{ flex: 1 }}>
       ├─ app/(public)/page.tsx
       │    └─ <main style={CENTERED_PAGE_MAIN_STYLE}>
       │         └─ HomeHero
       │              └─ WelcomeHeading
       │                   ├─ MUI Box (touch handler + column layout)
       │                   ├─ MUI Box (heading wrapper)
       │                   ├─ ScrambleHeading (single-line OR split heading)
       │                   └─ HomeHero paragraph
       │                        └─ HOME_INTRO_STYLE + local maxWidth: 850
       │              └─ HomeTrips
       │                   ├─ h3 + HOME_HEADING_STYLE
       │                   └─ TripList
       │                        └─ ul + cardListStyle
       │                             └─ li*
       │                                  └─ TripCard
       │                                       ├─ MUI Card + cardStyle + local sx geometry
       │                                       ├─ AppImage (tripCard image preset)
       │                                       │    └─ IMAGE_PRESETS.tripCard
       │                                       ├─ SocialObjectPlaceholder (when no image)
       │                                       ├─ MobileStepper + direct MUI Buttons
       │                                       ├─ MUI Pagination/PaginationItem
       │                                       ├─ FavoriteIcon + social counts
       │                                       └─ Details MUI Button + BUTTON_STYLES.primaryWide
       └─ Footer
            └─ Footer.module.css
```

The Home route is a composition root, not the owner of all visual rules. The chain terminates in shared components, presets, theme overrides and tokens. Those shared owners affect other routes listed below.

### B. File-by-file visual ownership

| File | What it owns | Upstream owner / dependency | Audit finding |
|---|---|---|---|
| `app/(public)/page.tsx` | Home data request, semantic page content, centered main composition | `CENTERED_PAGE_MAIN_STYLE` → `styles/presets/layouts.ts` → `PAGE_CONTENT_PADDING` in `constants/ui/spacing.ts` | The page applies a shared CSSProperties preset through React `style`; prohibited by the approved Styling API. The page should consume a class or approved layout abstraction, not own the shared values. |
| `app/(public)/layout.tsx` | Public shell order: Header, flexible route-content wrapper, Footer | Header and Footer shared components; global `.app-shell` in `app/globals.css` | The wrapper uses inline `style={{ flex: 1 }}`. Structural shell responsibility is valid, but the React style API is not approved. |
| `src/components/home/HomeHero.tsx` | Home introduction copy and composition | `WelcomeHeading`; `HOME_INTRO_STYLE` → typography preset → UI color/typography tokens | Uses React `style` with a shared preset plus a local max-width override (850px). Content width is currently Home-specific; the presentation transport violates policy. |
| `src/components/home/HomeTrips.tsx` | Home-specific TOP 5 heading and trip-list composition | `HOME_HEADING_STYLE`; `TripList` | Uses React `style` for heading presentation. This is a page-specific consumer of shared heading treatment. |
| `src/components/common/WelcomeHeading.tsx` | Shared welcome-heading layout, touch-to-retrigger behavior and responsive one-line/two-line decision | `ScrambleHeading`; `BREAKPOINTS.homeHeading`; `HOME_HEADING_STYLE`; MUI Box | Shared component used by Home, Trips, About and auth forms. Local Box `sx` contains structural alignment plus hardcoded 25px horizontal padding and 16px bottom margin. The native h1 branch uses React `style`. The heading breakpoint is centralized at 550px. |
| `src/components/common/ScrambleHeading.tsx` | Shared animated heading behavior and native h1 output | `HOME_HEADING_STYLE` → typography preset → UI tokens | Uses React `style` on h1 and exposes a caller `style` prop, which permits downstream visual overrides and conflicts with the approved API. Animation logic is behavior, not styling ownership. |
| `src/styles/presets/typography.ts` | `headingTextStyle`, `HOME_HEADING_STYLE`, `HOME_INTRO_STYLE` | `UI_COLORS.text.inverse`, `UI_COLORS.decorative.headingShadow`, `TYPOGRAPHY.fontFamily` | Shared typography values are centralized here, but presets are typed as React CSSProperties and applied through `style`. They must be represented through an approved theme/preset/class contract in a later migration. |
| `src/styles/presets/layouts.ts` | `CENTERED_PAGE_MAIN_STYLE`, `cardListStyle` and other layout presets | `PAGE_CONTENT_PADDING`, `UI_SPACING`, typography preset | Shared layout values are centralized, but the Home page and TripList pass CSSProperties via React `style`. |
| `src/components/trips/TripList.tsx` | Shared list/empty-state composition and mapping to TripCard | `cardListStyle`, `headingTextStyle`, `TripList.module.css`, `TripCard` | Reused by Home, Trips, Favorites and My Trips. Uses React `style` for list and empty-state typography. |
| `src/components/trips/TripList.module.css` | Empty-state title/text margins and font sizes | CSS Module consumed only by TripList | Contains literal 2px margins, 1.5rem/1rem font sizes and title weight. These values have no shared token/preset contract yet; decide whether they are a shared empty-state role or unique content typography. |
| `src/components/trips/TripCard.tsx` | Shared trip-card content, image/day navigation, likes, details action | `cardStyle`, `CARD_TEXT_INSET_SX`, `BUTTON_STYLES.primaryWide`, MUI Card override, AppImage and SocialObjectPlaceholder | Reused by every TripList consumer. The surface is theme-owned; card geometry and many internal dimensions remain local sx constants/values. MobileStepper Buttons have no named semantic action preset; Pagination has local margin-only sx. |
| `src/styles/presets/cards.ts` | Shared card layout preset and text insets | `UI_SIZES.cardTextInset`, `UI_SIZES.pointCardTextInset`; MUI Card surface override owns skin | `cardStyle` is React CSSProperties and mixes layout geometry (max width, margin, height, width, top padding). `CARD_TEXT_INSET_SX` is consumed by TripCard and must be checked against PointCard before changing the shared inset. |
| `src/theme/components/card.ts` | Global MUI Card root surface contract | `getSurfaceStyles` → theme palette/divider/shape/shadow | Every MUI Card receives background, border, radius and shadow centrally. This is the owner of TripCard's surface skin, not TripCard itself. |
| `src/theme/components/surface.ts` | Shared elevated surface contract | MUI theme background.paper, divider, shape.borderRadius and semantic surface shadow | Owns shared Card/Dialog surface values. It does not own TripCard's content geometry. |
| `src/styles/presets/buttons.ts` | Semantic primary-wide action treatment | `UI_COLORS`, `UI_SPACING`, `UI_SIZES` | TripCard Details consumes `BUTTON_STYLES.primaryWide`. The MUI Button theme override separately owns global typography/radius. |
| `src/theme/components/button.ts` | Global MUI Button typography and radius | `theme.typography.button`, `theme.shape.borderRadius` | Does not define complete semantic roles or all hover/focus/disabled/loading states. MobileStepper buttons use MUI defaults directly. |
| `src/components/images/AppImage.tsx` | Shared image resolution, thumbnail fallback, loading/error behavior and Next Image rendering | `IMAGE_PRESETS` → `src/constants/images/presets.ts` | Used by TripCard and many unrelated page/component flows. It applies resolved preset style through React `style`; image rendering contract and layout ownership need to be separated. |
| `src/constants/images/presets.ts` | Named image dimensions, sizes, fit and loading defaults | `AppImage` | `tripCard` owns 400×240 dimensions, responsive sizes and cover fit. This is a shared image-role owner, not a TripCard-local image constant. |
| `src/components/placeholders/SocialObjectPlaceholder.tsx` | Shared no-image artwork, overlay and copy | `UI_COLORS.surface.socialPlaceholder`, `UI_COLORS.decorative.socialPlaceholderOverlay`; MUI Box/Typography | Used by TripCard and point/day/editing contexts. It still owns local geometry, typography and Next Image inline object-fit style. |
| `src/components/layout/Header.tsx` | Shared public navigation, auth-aware links, mobile Drawer | `BREAKPOINTS.desktopNav/headerCompact`, `UI_SIZES.iconLarge`, MUI AppBar/Toolbar/Button/IconButton/Drawer | Shared across public, account, auth and admin layouts. Nav button spacing, Toolbar padding, Drawer paper height/elevation and nav semantic roles remain local. |
| `src/components/layout/Footer.tsx` | Shared footer content and iOS landscape scroll behavior | `Footer.module.css` | Behavior is local; visual skin is in the CSS Module. |
| `src/components/layout/Footer.module.css` | Footer layout/padding and semantic colors | `--ht-color-primary`, `--ht-color-text-inverse` from theme CSS-variable bridge → `UI_COLORS` | Colors are token-backed; 20px horizontal padding and flex composition remain local structural values. |

### C. Cross-page reuse proven by this chain

| Shared owner | Direct/known consumers | Routes affected |
|---|---|---|
| `Header` and `Footer` | Public, Account, Auth and Admin layouts | All route groups |
| `WelcomeHeading` | `HomeHero`, Trips page, About page, LoginForm, RegisterForm, ForgotPasswordForm, ResendVerificationForm, ResetPasswordForm, VerifyEmailForm | Home, Trips, About and Auth |
| `ScrambleHeading` | `WelcomeHeading` | Home, Trips, About and every auth route that renders WelcomeHeading |
| `TripList` | `HomeTrips`, Trips page, Favorites page, My Trips page | `/`, `/trips`, `/favorites`, `/my-trips` |
| `TripCard` | `TripList` | Same four routes |
| `AppImage` | TripCard and shared image/gallery/profile/admin/editing components | Home, Trips, Trip Details, Profile, Admin and editing flows |
| `SocialObjectPlaceholder` | TripCard, DayImagesGallery, PointSection, EditPointPage, EditTripLayout | Home, Trip Details, Create/Edit Point and Create/Edit Trip |
| `cardStyle` | TripCard; related card layout family also includes PointCard consumers of card presets | Trip lists and point-card flows |
| `HOME_HEADING_STYLE` / `headingTextStyle` | HomeTrips, WelcomeHeading/ScrambleHeading, TripList empty state and other heading/list consumers | Home, Trips, About, Auth and account trip lists |
| `CENTERED_PAGE_MAIN_STYLE` | Home and public Trips route | Home and Trips |
| `Footer.module.css` | Shared Footer | All route groups |

### D. Concrete issues found in the Home dependency chain

1. **React style policy violations:** Home page main, public layout wrapper, HomeHero paragraph, HomeTrips heading, WelcomeHeading h1, ScrambleHeading h1, TripList list/empty state, AppImage image/fallback and SocialObjectPlaceholder image all use React `style` for presentation.
2. **Shared preset transport is not compliant:** typography/layout/card presets centralize values but are typed as `CSSProperties` and consumed via React `style`; centralization alone does not satisfy the approved styling API.
3. **Shared component override leakage:** ScrambleHeading accepts arbitrary caller `style`; WelcomeHeading owns layout values locally; AppImage internally emits inline style from image presets.
4. **TripCard is only partially centralized:** MUI Card surface is centralized; dimensions, image frame, header, social-count row, stepper spacing, content geometry and pagination spacing remain local.
5. **Action-role gap:** TripCard Details has a named primary-wide preset, but MobileStepper Next/Back are direct MUI Buttons with default semantic/visual treatment.
6. **Image and placeholder ownership:** named image dimensions are centralized, but image fit/layout and placeholder overlay typography/geometry still have local style declarations.
7. **Header is a shared dependency, not Home-owned:** its navigation action roles and Drawer/Toolbar layout affect every route group and must be audited once as shared shell work.
8. **Footer is already token-connected for its colors:** its CSS Module consumes theme-emitted semantic variables; its local layout/padding still needs classification under the CSS Module policy.

### E. Source evidence and per-file ledger

The following exact branch files were fetched and inspected in this batch:

- `app/(public)/page.tsx` — `163b4ec101b6da856b613ef9a0297741b244b932`
- `app/(public)/layout.tsx` — `de747f2fb78157660255e23047ea0347b3d80975`
- `src/components/home/HomeHero.tsx` — `b136e51b70232dc4770754eb0292850132087d60`
- `src/components/home/HomeTrips.tsx` — `9e9e0676417757de324f1b3575347d6364dfe8d7`
- `src/components/common/WelcomeHeading.tsx` — `179e7f685e3ca595fbed60c3447702c036b56ec1`
- `src/components/common/ScrambleHeading.tsx` — `6fbea0138e6eff5d6fd822171a93a94dfe0f3a69`
- `src/components/trips/TripList.tsx` — `017930d3ccf03e7790c4361945ed86ec0041fece`
- `src/components/trips/TripList.module.css` — `66233dc514151bddb8255a334f8c2d8ed828b21b`
- `src/components/trips/TripCard.tsx` — `6ca299211ee78c0373d0cf6a28eafcf40f6ccc0d`
- `src/components/images/AppImage.tsx` — `52d094dd76316c9404eba4efa66e43a1351d1520`
- `src/components/placeholders/SocialObjectPlaceholder.tsx` — `0cacf84b5b51e1e93206fb85a184a49ddb1ff15c`
- `src/components/layout/Header.tsx` — `1e36e6434c250f1b4f0b825d7d16304dd0583947`
- `src/components/layout/Footer.tsx` — `88c0b2c7ee9f38c33b8d37a0f1ebe3b27231b6f2`
- `src/components/layout/Footer.module.css` — `a2409cadb62f9576085b99a404717d3ee2ce38bc`
- `src/styles/presets/cards.ts` — `1b3f437195cf8a97e96e607e6c6509d179c2f3ac`
- `src/styles/presets/typography.ts` — `59803882f1c4357e8815f3afdc7c53939d14bacb`
- `src/styles/presets/layouts.ts` — `4a0aec24e5feecf1ffaeadaf75ade4291658f820`
- `src/styles/presets/buttons.ts` — `2110bcf2a41d8ca81375682ebb9bb8ed88f48a2e`
- `src/constants/images/presets.ts` — `4d3ea1fe0a0eb9f137983542c99a43200e55cf2f`
- `src/constants/ui/breakpoints.ts` — `9fb27ac76908e485970975bf4a714c581d822315`
- `src/constants/ui/colors.ts` — `dce2b3d898c07cb7ba1b61a8ecf9608121ea8763`
- `src/constants/ui/sizes.ts` — `69e9fdeefc9ce4968e2a6c98a72b80a6f060d444`
- `src/constants/ui/spacing.ts` — `9e62ad85eeec73359723643861eb8d2eba8057d1`
- `src/constants/ui/typography.ts` — `25a3b7ce5fc4dd9a3d664ed2874a01b50baa91f1`
- `src/theme/index.ts` — `2bbf22fb89a8a99269d19348c59270ac97cd5178`
- `src/theme/typography.ts` — `091f8933cf503a2db9a684c3d0eed314b8005db7`
- `src/theme/palette.ts` — `8c0f64470afa9d7b6bef7ea59a3090e8115cfdc1`
- `src/theme/components/button.ts` — `344522fde4f2c45fc223d876d9c568faabd41579`
- `src/theme/components/card.ts` — `2c933219062e2e626304bc153234a4dbe5c3205b`
- `src/theme/components/surface.ts` — `12caae3364e498c3032b42be696a7dea6ccc7722`

Section 10.1 already contains individual inventory rows for the route, Home components, shared components and listed preset/theme/token files. This batch adds the missing relationship/property ownership detail rather than duplicating those rows. The existing statuses remain open; no file is marked migrated or complete.

### F. Batch result and next task

- Completed one end-to-end route trace: Home → shared public shell → shared heading components → shared trip list/card → image and placeholder primitives → preset/theme/token owners.
- Confirmed multiple cross-page consumers. In particular, TripList/TripCard are not Home-only; WelcomeHeading/ScrambleHeading are not Home-only; AppImage and SocialObjectPlaceholder are used across several feature areas.
- The Home composition graph is now linked to concrete style owners and specific local migration targets.
- This does not close the entire Stage 1 dependency map. Other route roots and shared component call sites still require the same treatment.
- Stage 1 remains IN PROGRESS. No source migration has started.

**NEXT TASK — audit the Trips route and close the shared TripList/TripCard consumer edges:**

1. Trace `app/(public)/trips/page.tsx` through TripFilters, WelcomeHeading, TripList, TripCard and TripPagination, including their nested controls and CSS.
2. Compare the Trips consumers of WelcomeHeading, TripList and TripCard against the Home findings; record which style contracts are genuinely shared and which are route-specific.
3. Follow the exact direct consumers of TripList and TripCard in Favorites and My Trips, and verify their loading/error/empty-state composition.
4. Record exact Button, Pagination, Select/InputBase and form-control ownership in the Trips flow.
5. Continue using this same audit document. Keep every Git change English-only.
6. Do not modify application source code until the Stage 1 consumer-map gate is complete.
7. Do not run build, tests, lint, CI or browser validation without explicit user authorization.

No application source code was changed. No branch was created. No build, tests, lint, CI or browser validation was run.


## 11.15 — Trips route and shared TripList / TripCard consumer audit (2026-11-18)

### A. Scope and preflight

- Re-read the target ownership architecture, Styling API policy (Section 1.4), approved six-stage plan, Section 7 mandatory search matrix, Section 10.1 file ledger, Sections 11.12–11.14 and the exact previous NEXT TASK.
- Verified the target branch: `feature/frontend-modernization`. The current branch head observed during this batch was `05910ee557ea7768675218c4704afdbea8d6b0b5`.
- Re-fetched the audit document before editing. Its source blob SHA before this update was `f33ff61c7d5789aa6bb7534c876672196a25a7d5`.
- Reviewed the Trips route, filters, pagination, shared list/card, heading, Favorites and My Trips callers, account shell, CSS Modules, presets, theme and relevant UI tokens.
- Section 10.1 already contains individual ledger rows for every path inspected below. This batch adds the route-level ownership and consumer relationships; it does not duplicate those rows.
- No application source files were changed. No build, tests, lint, CI or browser validation was run.

### B. Exact route and component graph

```text
Public layout (Header + route content + Footer)
  └─ app/(public)/trips/page.tsx
       ├─ TripFilters
       │    ├─ AppBar / Toolbar
       │    ├─ FormControl + InputLabel + Select (group)
       │    ├─ FormControl + InputLabel + Select (transport)
       │    ├─ FormControl + InputLabel + Select (sort)
       │    └─ Search / SearchIconWrapper / native SearchButton / StyledInputBase
       └─ main (CENTERED_PAGE_MAIN_STYLE)
            ├─ WelcomeHeading
            │    ├─ responsive one-line / two-line heading
            │    ├─ ScrambleHeading
            │    └─ route-specific intro paragraph (INTRO_STYLE)
            ├─ TripList
            │    ├─ empty state (headingTextStyle + TripList.module.css)
            │    └─ ul (cardListStyle)
            │         └─ TripCard[]
            │              ├─ MUI Card surface (theme override)
            │              ├─ local card/header/image/social/content sx
            │              ├─ AppImage or SocialObjectPlaceholder
            │              ├─ MobileStepper + direct MUI Buttons
            │              ├─ MUI Pagination / PaginationItem
            │              └─ Details Button (BUTTON_STYLES.primaryWide)
            └─ TripPagination
                 └─ nav / ul / Previous, page and Next anchors
                      └─ TripPagination.module.css

AccountLayout (RequireAuth + Header + main + Footer)
  ├─ FavoritesPage
  │    ├─ loading / error / dedicated empty state
  │    └─ TripList only when non-empty
  └─ MyTripsPage
       ├─ loading / error / dedicated empty state + Create Trip action
       └─ TripList only when non-empty

Home route
  └─ HomeTrips
       └─ TripList
            └─ same TripCard
```

### C. Route-specific ownership: Trips page and filters

| File / owner | Exact responsibility and observed styling | Audit conclusion |
|---|---|---|
| `app/(public)/trips/page.tsx` | Server route parses query parameters, renders filters, heading, list and crawlable pagination. Uses `CENTERED_PAGE_MAIN_STYLE` through React `style`. Defines `INTRO_STYLE` by spreading `HOME_INTRO_STYLE` and adding `maxWidth: 900`; the intro is passed to `WelcomeHeading` through a React `style` prop. The catch branch also uses React `style`. | Route composition is local; shared page padding and intro typography are already represented by presets but are transported through the prohibited React style API. The 900px intro width is route-specific geometry and should be represented by an approved structural/layout contract, not another typography skin. |
| `src/components/trips/TripFilters.tsx` | Owns the Trips-only filter toolbar. Uses MUI AppBar/Toolbar, three Select controls, FormControl/InputLabel/MenuItem, InputBase and a native button. Defines three styled components (`Search`, `SearchIconWrapper`, `StyledInputBase`), a native `SearchButton`, `SELECT_BOX_SX`, `FILTER_LABEL_SX` and `FILTER_SELECT_SX`. Search background uses alpha(white, 0.15/0.25); Select labels and values use `UI_COLORS.text.inverse`; the responsive stack uses `BREAKPOINTS.tripsFilters` (670px). | This is a distinct filter-toolbar role, but it currently owns a local visual system. The search surface, native icon button, input focus/width transition, select sizing/margins and inverse-text treatment need explicit named contracts. Do not mistake its route-specific arrangement for a reusable global AppBar skin. |
| `src/constants/ui/breakpoints.ts` | Owns `BREAKPOINTS.tripsFilters = 670`. | The breakpoint value is centralized; the responsive consumer is TripFilters. Keep the value until responsive behavior is deliberately re-audited. |
| `src/constants/ui/colors.ts` | Owns semantic `text.inverse`; TripFilters consumes it for Select labels and values. | Color value is token-backed, but only part of the filter appearance is centralized. |
| `src/theme/index.ts` | Registers MuiButton, MuiCard, MuiDialog and MuiTextField overrides. It does not register application overrides for MuiSelect, MuiInputBase, MuiFormControl, MuiInputLabel, MuiMenuItem, MuiAppBar, MuiToolbar, MuiPagination or MuiMobileStepper. | Trips filter controls rely substantially on MUI defaults plus local component styles. A central field/control contract is not yet complete. |
| `src/theme/components/button.ts` | MuiButton root owns typography and border radius only. | It does not provide a semantic native SearchButton contract, nor the complete Button interaction states. |
| `src/components/trips/TripPagination.tsx` | Server-rendered navigation with real Next links; Previous/Next and numbered links, current page via `aria-current`. | Correct semantic/crawlable structure; its link visual role is not connected to a shared pagination/action component. |
| `src/components/trips/TripPagination.module.css` | Owns flex alignment and centered navigation; outer margin is literal 20px; list gap consumes `--ht-spacing-sm`. | Structural layout is appropriate for a CSS Module; the 20px margin needs classification/tokenization. The file does not define a complete shared pagination link/current/hover/focus contract. No other consumer was found in this route trace. |
| `src/components/trips/TripList.module.css` | Owns empty title/text margins, font sizes and title weight. | It is consumed only by TripList. The typography and spacing need a shared empty-state contract if they recur elsewhere; do not automatically globalize a genuinely unique message layout. |

No `TripFilters.module.css` file exists at the inspected path; TripFilters styles are defined in its TypeScript component through styled components and sx constants.

### D. Shared heading, list and card contracts

| Shared owner | Consumers and current contract | Required follow-up |
|---|---|---|
| `WelcomeHeading.tsx` | Trips, Home, About and Auth forms. It owns the heading composition, touch-to-retrigger behavior and 550px one/two-line breakpoint. | Its layout sx still contains local padding (25px) and bottom margin (16px); the heading is coupled to `HOME_HEADING_STYLE`. Keep route-specific child content outside the shared heading skin. |
| `ScrambleHeading.tsx` | Rendered through WelcomeHeading across those routes. It emits the heading using React `style={{ ...HOME_HEADING_STYLE, ...style }}` and exposes arbitrary caller style injection. | The React style violation and unrestricted style prop are shared-component API issues, not Trips-only issues. |
| `typography.ts` preset | `HOME_HEADING_STYLE`, `HOME_INTRO_STYLE` and `headingTextStyle` centralize typography values. | The values have a central owner, but CSSProperties + React style consumption violates Section 1.4. Migrate the contract to theme/semantic class or approved sx/CSS-variable consumers. |
| `layouts.ts` preset | `CENTERED_PAGE_MAIN_STYLE` and `cardListStyle` centralize page/list composition; account trip page presets also live here. | `CENTERED_PAGE_MAIN_STYLE` and `cardListStyle` are CSSProperties consumed via React style. Separate structural layout contracts from the React style transport. |
| `TripList.tsx` | Shared by HomeTrips, Trips, Favorites and My Trips. It renders its own welcome/no-results state when `trips.length === 0`; otherwise it renders the shared ul and TripCard items. | One shared list/card implementation serves all four routes. Its empty state is not the same as the dedicated account empty states. Its React style props on the empty headings and ul remain migration targets. |
| `TripCard.tsx` | Reached through TripList on Home, Trips, Favorites and My Trips. | It is not a Trips-only card. Do not fork it or tune its base skin only for the Trips route. |
| `cards.ts` preset | `cardStyle` owns trip-card layout geometry; `CARD_TEXT_INSET_SX` is shared with the trip/point card family. | The preset mixes card geometry and CSSProperties. Preserve the MUI Card surface as theme-owned and audit the PointCard consumer before changing the shared text inset. |
| `theme/components/card.ts` and `surface.ts` | MUI Card surface is centrally resolved through the shared surface contract. | This is the correct owner for TripCard's base surface (background, border, radius and shadow); it does not own TripCard's internal layout. |
| `buttons.ts` and `theme/components/button.ts` | TripCard Details uses `BUTTON_STYLES.primaryWide`; global MUI Button override owns typography/radius. | Details is partly centralized. MobileStepper Next/Back remain direct MUI Buttons without named semantic action roles. |
| MUI Pagination | TripCard uses outlined/rounded Pagination and PaginationItem for day selection; `PAGINATION_SX` adds local margin-top. | The route-level TripPagination is a separate native-link implementation. These two pagination patterns need one documented semantic family with appropriate variants, not identical markup. No MUI Pagination theme override is registered. |

### E. Favorites and My Trips state composition

| Route | Loading | Error | Empty | Non-empty |
|---|---|---|---|---|
| Favorites | CircularProgress, size 32, local `my: 4` sx | MUI Alert, local width 100% / max-width 560 | Account-specific Box preset and heading text | Shared TripList → TripCard |
| My Trips | CircularProgress, size 32, local `my: 4` sx | MUI Alert, local width 100% / max-width 560 | Account-specific Box preset, heading and Create Trip button using `BUTTON_STYLES.createTrip` | Shared TripList → TripCard |
| Trips | No dedicated loading UI in the server route; data is awaited | Catch branch renders route-specific unavailable message | TripList's shared “No trips found” state | Shared TripList → TripCard |

- `app/(account)/layout.tsx` owns the authenticated shell and applies `ROUTE_CONTENT_PADDING` through React `style`; Header and Footer remain shared shell dependencies.
- Account page layout/empty-state presets are centralized in `src/styles/presets/layouts.ts`, but the loading and error sx fragments remain local to both pages.
- Favorites and My Trips intentionally bypass TripList for their empty states; do not force the public “No trips found” copy into the account experience.
- **Separate source-correctness observation:** the inspected Favorites and My Trips files import `ACCOUNT_TRIPS_PAGE_SX`, `ACCOUNT_TRIPS_CONTENT_SX`, `ACCOUNT_TRIPS_HEADING_SX` and `ACCOUNT_TRIPS_EMPTY_STATE_SX`, but their JSX references `PAGE_SX`, `CONTENT_SX`, `HEADING_SX` and `EMPTY_STATE_SX`. They also reference `headingTextStyle` without an import in the fetched file contents. This is not a CSS ownership conclusion and was not changed; it should be checked as a separate source-correctness item before those files are migrated. No build/typecheck was run.

### F. Exact source evidence

Files fetched from `feature/frontend-modernization` during this batch:

- `app/(public)/trips/page.tsx` — `0103e8887ab598479418891fee32710d284b81c9`
- `src/components/trips/TripFilters.tsx` — `9de6c9dc203ef187d4d47f8cd6fd9229925e79f9`
- `src/components/trips/TripPagination.tsx` — `43f7feabe01411f6c2a8daa5e77076a7834aac88`
- `src/components/trips/TripPagination.module.css` — `fc1a52d1bc9f42fd8781bd4f53836be4a79ced34`
- `src/components/trips/TripList.tsx` — `017930d3ccf03e7790c4361945ed86ec0041fece`
- `src/components/trips/TripList.module.css` — `66233dc514151bddb8255a334f8c2d8ed828b21b`
- `src/components/trips/TripCard.tsx` — `6ca299211ee78c0373d0cf6a28eafcf40f6ccc0d`
- `src/components/common/WelcomeHeading.tsx` — `179e7f685e3ca595fbed60c3447702c036b56ec1`
- `src/components/common/ScrambleHeading.tsx` — `6fbea0138e6eff5d6fd822171a93a94dfe0f3a69`
- `app/(account)/favorites/page.tsx` — `22399b5e98c3f8c006ff1bd95e29911cac4b810a`
- `app/(account)/my-trips/page.tsx` — `477050cfe2d688de9f3a1d2cee17222532ac1a54`
- `app/(account)/layout.tsx` — `3ab4f092e7dc6053be4f0ca6f3f68cff31971b90`
- `src/styles/presets/layouts.ts` — `4a0aec24e5feecf1ffaeadaf75ade4291658f820`
- `src/styles/presets/typography.ts` — `59803882f1c4357e8815f3afdc7c53939d14bacb`
- `src/styles/presets/buttons.ts` — `2110bcf2a41d8ca81375682ebb9bb8ed88f48a2e`
- `src/styles/presets/cards.ts` — `1b3f437195cf8a97e96e607e6c6509d179c2f3ac`
- `src/theme/index.ts` — `2bbf22fb89a8a99269d19348c59270ac97cd5178`
- `src/theme/components/button.ts` — `344522fde4f2c45fc223d876d9c568faabd41579`
- `src/constants/ui/breakpoints.ts` — `9fb27ac76908e485970975bf4a714c581d822315`
- `src/constants/ui/spacing.ts` — `9e62ad85eeec73359723643861eb8d2eba8057d1`
- `src/constants/ui/colors.ts` — `dce2b3d898c07cb7ba1b61a8ecf9608121ea8763`

The Section 7 search matrix was applied to this dependency chain. Exact GitHub code-search results for the relevant symbol searches were cross-checked against the route imports and fetched branch files:
- TripList direct route/component consumers: HomeTrips, Trips page, Favorites page and My Trips page.
- TripCard direct component consumer: TripList; it therefore inherits the same four route consumers.
- WelcomeHeading consumers include HomeHero, Trips, About and Auth forms.
- TripPagination is consumed by the Trips page only in the inspected search results.

### G. Batch result and next task

- Completed the Trips route style-ownership trace and closed the direct TripList/TripCard route edges for Home, Trips, Favorites and My Trips.
- Identified the Trips-only filter toolbar as a local style owner; the route pagination has structural CSS but no complete semantic link/state contract.
- Confirmed that shared TripList/TripCard/WelcomeHeading styling issues must be migrated once at their shared owners, not patched independently per route.
- Identified a separate source-correctness concern in Favorites and My Trips for follow-up; no source changes were made.
- The Stage 1 candidate inventory count is unchanged: 163/163 candidate files have individual ledger rows. This does not mean all Section 7 consumer maps are exhaustive or that Stage 1 is complete.
- Stage 1 remains IN PROGRESS. No application source migration has started.

**NEXT TASK — audit the account trip-list consumers and their shared shell/preset dependencies before moving to the next route family:**

1. Resolve the Favorites/My Trips source-correctness observation from exact current-branch files and record whether it is an existing defect or a branch update; do not silently fix it during a style-only audit.
2. Trace the account trip-list composition through account layout, shared Header/Footer, account trip presets, loading/error/empty states and TripList/TripCard; compare all style owners with the Trips/Home findings.
3. Continue the Section 7 consumer map for remaining account route roots and shared action/field/surface dependencies. Do not repeat already-closed TripList/TripCard edges unless a new consumer is found.
4. Keep all audit changes in this document and English-only.
5. Do not modify application source until the Stage 1 dependency/consumer-map gate is exhaustive.
6. Do not run build, tests, lint, CI or browser validation without explicit user authorization.

No application source code was changed. No branch was created. No build, tests, lint, CI or browser validation was run.


## 11.16 — Account route roots and shared account-shell ownership audit (2026-11-18)

### A. Preflight and branch evidence

- Re-read the approved architecture, Styling API policy (Section 1.4), six-stage plan, Section 7 search matrix, Section 10.1 ledger, Sections 11.11–11.15 and the exact previous NEXT TASK.
- Confirmed that `feature/frontend-modernization` exists and fetched every source file below using that branch ref.
- The audit document blob SHA before this update was `6ad412819dd8a9b341c435508960faa7b42b95ad`.
- The latest branch HEAD SHA is not exposed by the available branch-search response. The last HEAD recorded in Section 11.15 remains `05910ee557ea7768675218c4704afdbea8d6b0b5`; it is retained as the last recorded value, not represented as a newly verified HEAD.
- The GitHub code-search endpoint returned snippets tied to a different commit context and is not branch-scoped. It was not used to override the exact branch-ref file contents.
- No application source files were changed. No build, tests, lint, CI or browser validation was run.

### B. Favorites / My Trips source-correctness follow-up

The exact files fetched from `feature/frontend-modernization` still show the following mismatch:

- Both files import `ACCOUNT_TRIPS_PAGE_SX`, `ACCOUNT_TRIPS_CONTENT_SX`, `ACCOUNT_TRIPS_HEADING_SX` and `ACCOUNT_TRIPS_EMPTY_STATE_SX`.
- Their JSX references `PAGE_SX`, `CONTENT_SX`, `HEADING_SX` and `EMPTY_STATE_SX`, none of which is declared in either fetched file.
- Both files reference `headingTextStyle` in the empty-state Typography but do not import it.
- `src/styles/presets/layouts.ts` defines the imported `ACCOUNT_TRIPS_*` names, but does not define the shorter aliases used in JSX. The same preset file imports `headingTextStyle` internally; that does not make it available in the page module.

**Conclusion:** this is a concrete source-level name-resolution inconsistency in the exact branch-ref contents, not a styling-only observation. It remains unresolved and must not be silently repaired as part of this audit. No compiler/typecheck was run, so no claim is made about the exact diagnostic set. A separate explicit source-correction task is required before migration of these two files.

### C. Account shell and shared dependencies

```text
app/(account)/layout.tsx
  └─ RequireAuth
       ├─ status !== authenticated → render null
       └─ authenticated
            ├─ Header
            ├─ main [React style: padding = ROUTE_CONTENT_PADDING, flex = 1]
            │    └─ one account route root
            └─ Footer
```

| Owner | Responsibility | Current style/ownership finding |
|---|---|---|
| `app/(account)/layout.tsx` | Authenticated route shell, Header/main/Footer order and noindex metadata | Main uses the prohibited React `style` prop for shared route padding and flex. The padding value comes from `ROUTE_CONTENT_PADDING`, but its transport is not compliant with Section 1.4. |
| `src/components/auth/RequireAuth.tsx` | Client auth gate and redirect; renders no route UI until authenticated | Behavior-only wrapper; no visual skin. Do not treat it as the owner of account page layout. |
| `src/components/layout/Header.tsx` | Shared navigation across public/account/auth/admin | Shared owner, already identified in 11.14/11.15. Local `NAV_BUTTON_SX`, Toolbar padding/responsive layout, welcome Button, Drawer paper elevation/height and Drawer nav geometry remain shared-shell targets. |
| `src/components/layout/Footer.tsx` | Shared footer content and iOS landscape scroll behavior | Behavior/content owner; visual skin is in Footer.module.css. |
| `src/components/layout/Footer.module.css` | Footer layout and colors | Colors consume `--ht-color-primary` and `--ht-color-text-inverse`; horizontal 20px padding and flex structure remain local layout values. |
| `src/styles/presets/layouts.ts` | Shared layout presets including account trip list and centered page layouts | Account trip presets are centralized, but current Favorites/My Trips JSX does not reference their exported names correctly in the fetched branch contents. The file also retains CSSProperties presets consumed through React style elsewhere. |
| `src/styles/presets/panels.ts` | Shared surface resolver | `PANEL_SX(theme)` delegates to `getSurfaceStyles(theme)`; this is the central surface owner used by Profile and form flows. |
| `src/styles/presets/forms.ts` | Shared form field/layout presets | Owns `ACCOUNT_FORM_FIELDS_SX`, `FORM_CONTROL_INSET_SX`, `POINT_FORM_PANEL_SX`, `DAY_NUMBER_FIELD_SX`, and related form contracts. Some presets still contain local fixed dimensions and nested selectors; consumers must be checked before changing them. |
| `src/styles/presets/buttons.ts` | Semantic button presets | Account consumers use primary, secondary, createTrip and day-stepper roles. BackButton still accepts caller `sx`, allowing callers to alter its shared role. |

Header/Footer are not account-specific components. Their visual contracts affect every route group and must be migrated once at the shared owners, then checked against all four layout groups.

### D. Remaining account route composition and ownership

| Route root | Composition and shared dependencies | Observed styling ownership / migration targets |
|---|---|---|
| `/profile` — `app/(account)/profile/page.tsx` | Route Box → `PANEL_SX` surface → ProfileForm → ProfileImage/ProfileImageUpload, ChangePasswordForm, BackButton | Route owns centered full-height layout, responsive vertical padding, 600px panel width and panel inset. ProfileForm consumes shared button/form presets but adds local heading spacing, disabled Email TextField overrides, action-row geometry and child Button margin selector. Profile image/upload and password subflows are shared component owners and need their own consumer/state trace. |
| `/points/edit/[pointId]` — route page | Route root → EditPointPage → PointLocationPicker, PointForm, AppImage, SocialObjectPlaceholder, ConfirmDialog | Route wrapper itself is composition-only. EditPointPage owns loading/error states, responsive map/form/image ordering, local 1200/600/520px geometry, image grid, square thumbnails and delete-image IconButton surface. Point form surface delegates to `POINT_FORM_PANEL_SX`; image frame and map overlay dependencies remain to be traced. |
| `/trips/[id]/edit` — route page | Server route validates params and ownership → RequireTripOwner → EditTripLayout → TripLocationPicker, TripSelectField, ImageUploadField, AppImage, SocialObjectPlaceholder, ConfirmDialog, BackButton | Route page is primarily data/guard composition, not a visual owner. EditTripLayout owns a responsive map/form/image grid, content max width, day-number controls, image deletion, local alerts and numerous TextField/Button sx rules. It consumes PANEL_SX, FORM_CONTROL_INSET_SX, BUTTON_STYLES, UI_COLORS and UI_SIZES. |
| `/trips/create` — route page | Suspense → TripForm | Route wrapper has no visual skin. TripForm owns Card/form composition, day-number field and stepper, several standard TextFields/Selects, upload field, local responsive action row and multiple semantic button presets. It consumes BUTTON_STYLES, DAY_NUMBER_BUTTON_GROUP_SX, DAY_NUMBER_FIELD_SX and BackButton. |
| `/trips/create/points` — route page | Suspense → CreatePointPage → PointList → PointCard; PointLocationPicker; PointForm; ConfirmDialog | CreatePointPage owns loading/error states, map/list/form two-column layout, responsive 1021px breakpoint, PointForm Card surface and local spacing. PointList/PointCard are nested shared owners; PointCard consumes card/action/text presets but retains local icon-button spacing/visibility and card geometry. |

### E. Account-specific shared component contracts

| Shared component / preset | Account consumers | Ownership conclusion |
|---|---|---|
| `TripList` → `TripCard` | Favorites and My Trips when non-empty | Already closed in 11.15 with Home and Trips as the other two route consumers. Do not repeat or fork this graph. |
| `BackButton` | ProfileForm, PointForm, TripForm, EditTripLayout and other previously recorded auth/admin/trip consumers | One shared semantic owner; caller-provided `sx` remains an override escape hatch. Account forms use it with route-specific navigation callbacks, not route-specific skins. |
| `PANEL_SX` / `getSurfaceStyles` | Profile route, Create/Edit Point Card, trip/edit form panels and other shared panels | Central surface chain is already present; panel geometry/content spacing remains owned by each composition. |
| `POINT_FORM_PANEL_SX` | CreatePointPage and EditPointPage | Shared point-form surface/layout preset. Both route roots use the same owner; route-specific outer map/form geometry must not fork the panel skin. |
| `ACCOUNT_FORM_FIELDS_SX` | ProfileForm | Shared account form field layout preset; ProfileForm adds local action-row and disabled-field rules. |
| `BUTTON_STYLES` | ProfileForm, TripForm, PointForm, EditTripLayout, My Trips empty-state action and PointCard | Shared preset owner, but semantic role coverage is incomplete and caller-local sx composition remains in PointForm and other consumers. |
| `PointList` / `PointCard` | CreatePointPage | PointCard is not route-owned; it is a reusable point-card owner with central text/action presets and local card/icon-button geometry. |
| `AppImage` / `SocialObjectPlaceholder` | EditPointPage, EditTripLayout, Profile image subflow and other previously mapped routes | Shared image/placeholder owners. Their preset-to-render transport and local overlay/frame details remain open from 11.14/11.13. |
| `AddressAutocomplete`, `PointLocationPicker`, `TripLocationPicker` | PointForm, EditPointPage, CreatePointPage, TripForm and EditTripLayout | Shared map/form dependency chain; must be audited at the component owners and all callers, not restyled separately per route. |
| `ImageUploadField` | PointForm, TripForm, EditTripLayout and profile/admin image flows | Shared upload field; exact internal visual ownership and direct caller props remain open. |
| `ConfirmDialog` | CreatePointPage, EditPointPage, EditTripLayout and other flows | Globally mounted shared dialog owner; route components only invoke confirmation. Its dialog/button states require a single shared contract. |

### F. Concrete account migration targets confirmed in this batch

1. **React style API:** account layout uses React `style` for main padding/flex. This is a direct Styling API policy violation.
2. **Local page geometry:** Profile, EditPointPage, CreatePointPage and EditTripLayout define repeated max widths, horizontal padding, vertical spacing, centered flex/grid composition and responsive rearrangement. Determine which values are reusable layout tokens/presets versus genuinely route-specific geometry before migration.
3. **Field contract:** ProfileForm, PointForm, TripForm and EditTripLayout use standard MUI TextFields with a mixture of defaults, centralized field presets and local sx. Disabled Email field and AddressAutocomplete are explicit variants requiring shared-state comparison.
4. **Action contract:** Profile/Point/Trip forms combine named BUTTON_STYLES with raw Button/IconButton controls, local nested Button selectors and BackButton. Build an exact semantic action index before changing any presets.
5. **Surface contract:** Profile and point/trip forms already consume PANEL_SX/POINT_FORM_PANEL_SX; keep surface ownership in the shared theme resolver and separate form-panel layout from the base surface.
6. **Loading/error states:** Favorites/My Trips use CircularProgress and Alert; EditPointPage/CreatePointPage have local loading/error branches; TripForm has notification-based async errors; EditTripLayout owns inline server errors. These are different state compositions but recurring visual roles should be compared before defining a shared state contract.
7. **Map/image composition:** EditPointPage and EditTripLayout combine map, form, image thumbnails, delete controls and placeholders. These are route compositions over shared map/image components, not reasons to create independent map or image skins.

### G. Source evidence and ledger

Exact branch-ref files fetched and inspected in this batch:

- `app/(account)/favorites/page.tsx` — `22399b5e98c3f8c006ff1bd95e29911cac4b810a`
- `app/(account)/my-trips/page.tsx` — `477050cfe2d688de9f3a1d2cee17222532ac1a54`
- `app/(account)/layout.tsx` — `3ab4f092e7dc6053be4f0ca6f3f68cff31971b90`
- `app/(account)/profile/page.tsx` — `ffb748a51d7b19353a395f59b036d03d6f000d22`
- `app/(account)/points/edit/[pointId]/page.tsx` — `bbb9e10fc3cf9f8e567055b18bdc28584b62b4d3`
- `app/(account)/trips/[id]/edit/page.tsx` — `cb0a66d1fa19710362603b12cb4120485130c9fc`
- `app/(account)/trips/create/page.tsx` — `588d743a5b51e950959c2332550ecc39d6cce5ef`
- `app/(account)/trips/create/points/page.tsx` — `3fa94b21b9a5a77480a1386a2ca95d1108f459f6`
- `src/components/auth/RequireAuth.tsx` — `63958b4aa02186d3824f350829e967f8ce7ea4e1`
- `src/components/auth/ProfileForm.tsx` — `53753f979947457c028f7541450f207e90ca9b03`
- `src/components/trips/EditTripLayout.tsx` — `c86c23108089bec5169ffe2d8361b44db715bbe0`
- `src/components/trips/TripForm.tsx` — `5a1d13e045eb0060e77e6eccaf2bff5bb3f9a272`
- `src/components/points/CreatePointPage.tsx` — `34704fd35ef58c086f8401d961e33e47c8e8e2b2`
- `src/components/points/EditPointPage.tsx` — `2ee94d01320853d8408b54b6c697308c839e5207`
- `src/components/points/PointForm.tsx` — `e0580d770ce3a0d113086c752dc99313d87e90d4`
- `src/components/points/PointList.tsx` — `f8e5e87b55b4b82139b87985ff8eaa133050ae4b`
- `src/components/points/PointCard.tsx` — `86ecd774f4ff3aa0e7a3b8f68b8fea2c4eb8dab2`
- `src/components/common/BackButton.tsx` — `1f78b4e652c6a3c0dd648e9166fdd9d9cf1bea95`
- `src/styles/presets/forms.ts` — `b1de15957049dc1e583bbe3201135bb2b66b490b`
- `src/styles/presets/panels.ts` — `c9474242c747e8248e930f56a8c5c0f26089bb2c`
- Shared Header/Footer and Footer.module.css SHAs are recorded in Sections 11.14–11.15 and were re-fetched for this batch.

Section 10.1 already has individual inventory entries for the route roots and component files listed above; this batch adds route-to-owner relationships and concrete property findings, not duplicate ledger rows.

### H. Batch result and next task

- Closed the account route composition roots for Favorites, My Trips, Profile, Edit Point, Edit Trip, Create Trip and Create Trip Point at the feature-owner level.
- Reconfirmed that Favorites/My Trips share TripList/TripCard only in the non-empty state; their dedicated empty states remain account-specific.
- Traced account shell ownership to RequireAuth, shared Header/Footer and route main wrapper. Header/Footer remain cross-route shared owners, not account-only work.
- Confirmed a source-level name-resolution inconsistency in Favorites/My Trips branch-ref contents; left source untouched and recorded it as a separate correction task.
- Added exact account form, point-card, panel, button, image and map dependency relationships. The property-level audit of shared map/image/upload/dialog owners and exact direct call sites remains open.
- Stage 1 remains IN PROGRESS. Candidate inventory coverage remains 163/163; this is not proof that the mandatory consumer maps are exhaustive.
- No application source was changed. No branch was created. No build, tests, lint, CI or browser validation was run.

**NEXT TASK — close shared account-form and map/image dependency owners before moving to the next route family:**

1. Resolve the Favorites/My Trips source-correctness inconsistency as a separately authorized source correction; until then, do not claim these two page modules are type-safe.
2. Trace exact direct consumers and all forwarded styling props for AddressAutocomplete, PointLocationPicker, TripLocationPicker, ImageUploadField, AppImage and SocialObjectPlaceholder.
3. Trace ProfileImage/ProfileImageUpload/ChangePasswordForm and ConfirmDialog/NotificationProvider state compositions; identify shared action, field, image-frame, dialog and alert owners.
4. Complete the account form field/action state matrix across ProfileForm, PointForm, TripForm and EditTripLayout, including disabled, error, loading, hover/focus and responsive action layouts.
5. Continue the Section 7 exact call-site searches and update Section 10.1 only where a genuinely missing ledger entry is found; do not duplicate existing rows.
6. Keep Stage 1 IN PROGRESS until all required owner-to-consumer edges and state/responsive matrices are exhaustive. Do not begin app-source migration before that gate.
7. Do not run build, tests, lint, CI or browser validation without explicit user authorization.

No application source code was changed. No branch was created. No build, tests, lint, CI or browser validation was run.


## 11.17 — Shared map, image, upload, profile and feedback owners (2026-11-18)

### A. Preflight

- Re-read the audit architecture, Styling API policy, six-stage plan, Section 7 matrix, Section 10.1 ledger and the latest NEXT TASK in 11.16.
- Fetched all implementation files below by the exact `feature/frontend-modernization` branch ref. GitHub code search is used only as a discovery aid; its result URLs point to the last recorded commit and are not treated as branch-scoped proof. Every listed implementation and caller file was then fetched from the named branch before its local content was used.
- Audit document SHA before this append: `6364d8080dd8818bfe1c4abebe5322503f12707c`.
- No application source changes. No branch creation. No build, tests, lint, CI or browser validation.

### B. Address and map component ownership

#### `AddressAutocomplete` — reusable field owner

Public props include:
- Behavior: `value`, `isLoaded`, `onChange`, `onLocationSelect`, `showSearchButton`, `extraAction`.
- Semantic field configuration: `label`, `size`, `buttonVariant`, `direction`, `textFieldProps`.
- Styling escape hatches: `inputSx`, `buttonSx`, `containerSx`.

It owns the TextField, optional Google Places Autocomplete wrapper, search Button, extra-action wrapper and informational Alert. It currently has local Stack spacing, field wrapper geometry, search-button responsive width/white-space rules, and Alert composition. `textFieldProps` can forward most TextField props except controlled value/onChange/type, while the three sx props allow caller-level visual overrides.

Direct consumer graph confirmed from the fetched branch files:

```text
PointForm
  └─ AddressAutocomplete
       ├─ inputSx: MAP_ADDRESS_INPUT_SX + local width/minWidth
       ├─ textFieldProps: error/helperText
       └─ default search button disabled (showSearchButton=false)

PointLocationPicker
  └─ AddressAutocomplete
       ├─ inputSx: MAP_ADDRESS_INPUT_SX + local width/minWidth
       ├─ buttonSx: local responsive sizing
       ├─ containerSx: local width
       └─ search button / extra action behavior

TripLocationPicker
  └─ AddressAutocomplete
       ├─ inputSx: MAP_ADDRESS_INPUT_SX + local margin
       ├─ buttonSx: local sizing
       └─ containerSx: width 100%
```

**Ownership conclusion:** the shared field visual contract belongs in the AddressAutocomplete owner plus shared MUI field/button contracts. Callers should pass semantic configuration and only unique composition/layout. Current caller sx props mean that contract is not yet enforced.

#### `PointLocationPicker` and `TripLocationPicker` — map composition owners

- `PointLocationPicker` accepts latitude, longitude, onChange, optional onAddressSelect and findInMapTrigger. It has no public sx/style/className prop. It owns a 600px centered Stack, map frame/controls, AddressAutocomplete arrangement, current-location/find-in-map actions and an inline Snackbar/Alert error state.
- `TripLocationPicker` accepts only latitude, longitude and onChange. It has no public sx/style/className prop. It owns map frame/controls, a separate address state and info Alert, plus its own AddressAutocomplete configuration.
- Both use `useGoogleMapsLoader`, `GoogleMapView` and shared map constants. They have similar responsibilities but are separate implementations with duplicated visual and interaction composition; do not assume one is a wrapper around the other.
- Direct route/component consumers:
  - PointLocationPicker: `CreatePointPage`, `EditPointPage`.
  - TripLocationPicker: `TripForm`, `EditTripLayout`.
  - AddressAutocomplete: `PointForm`, `PointLocationPicker`, `TripLocationPicker`.

**Migration ownership:** map canvas dimensions/controls and map-related feedback need shared map contracts; route-specific map/form grid remains with CreatePointPage/EditPointPage/TripForm/EditTripLayout. The duplicated picker implementations need a separate behavior/feature comparison before any consolidation proposal. No consolidation is authorized or implied by this audit.

### C. Image rendering and placeholder ownership

#### `AppImage`

Public props: `image`, `src`, `alt`, `preset`, `useThumbnail`, `fill`, `width`, `height`, `sizes`, `priority`, `loading`, `fetchPriority`, `className`. There is no public sx/style prop.

- It resolves image rendering behavior from `IMAGE_PRESETS`, image DTO/URL selection and thumbnail fallback state.
- It builds a style object from preset style/objectFit and passes it to Next Image; the missing-image fallback div receives the same React `style`.
- This is a shared owner but still transports presentation through the prohibited React style API. Preset values are centralized in `src/constants/images/presets.ts`, yet the transport mechanism remains non-compliant with Section 1.4.
- Direct consumer files found and then fetched from the branch: `ProfileImage.tsx`, `ImageGallery.tsx`, `ImageLightbox.tsx`, `AdminUserProfileImage.tsx`, `AdminUsers.tsx`, `EditPointPage.tsx`, `TripCard.tsx`, `EditTripLayout.tsx`. The `src/components/images/index.ts` barrel re-exports it and is not a rendered consumer.

#### `SocialObjectPlaceholder`

- Has no props and no public styling API. It chooses a decorative SVG asset client-side and renders a full-size image with an overlay and two Typography lines.
- Its outer Box, overlay Box and Typography use local sx; the Next Image uses inline React style for width/height/objectFit. Background and overlay colors come from UI_COLORS.
- The placeholder is a visual component owner. Its parent controls the aspect ratio/frame; the placeholder fills that frame. Do not move parent aspect-ratio geometry into the shared placeholder.
- Direct consumer files confirmed: `PointSection.tsx`, `DayImagesGallery.tsx`, `TripCard.tsx`, `EditPointPage.tsx`, `EditTripLayout.tsx`. Barrel `src/components/placeholders/index.ts` is an export, not a rendered consumer.

#### Image ownership graph

```text
IMAGE_PRESETS
  └─ AppImage
       ├─ ProfileImage
       ├─ ImageGallery → ImageLightbox (also renders AppImage)
       ├─ AdminUserProfileImage
       ├─ AdminUsers
       ├─ EditPointPage
       ├─ TripCard
       └─ EditTripLayout

SocialObjectPlaceholder
  ├─ PointSection
  ├─ DayImagesGallery
  ├─ TripCard
  ├─ EditPointPage
  └─ EditTripLayout
```

The same TripCard/EditPointPage/EditTripLayout compositions may select AppImage or SocialObjectPlaceholder based on image availability. Keep the shared frame owner and fallback owner distinct.

### D. Image upload field ownership and consumer graph

`ImageUploadField` public props are only `files`, `setFiles`, optional `existingCount` and optional `maxImages`. It has no public sx/style/className or render-slot prop.

- It owns the upload row, CustomFileUploadButton integration, processing indicator, uploaded count, max-image warning, compression/error warning, preview list, remove-one and remove-all controls.
- Upload-specific composition now consumes `src/styles/presets/image-upload.ts`: root/header/status/count/limit, scrollable preview list/row, 55×45 thumbnail, filename wrapping and remove/remove-all action geometry. No caller styling props were introduced.
- Its error state remains a local warning Alert; processing still disables file selection/removal and displays CircularProgress; max-count still displays inline error Typography. These states now retain their existing behavior while their surrounding presentation is named and centralized.
- It delegates actual file input/button behavior to `CustomFileUploadButton`. That child is a separate shared visual owner and must be included in the later action/upload field matrix.
- Direct consumers confirmed from exact branch-ref fetches: `PointForm.tsx`, `TripForm.tsx`, `EditTripLayout.tsx`, `AdminUserProfileImage.tsx`. Profile image upload does not use ImageUploadField; it has a separate single-file `ProfileImageUpload` implementation in `ProfileImage.tsx`.

**Ownership conclusion:** do not pass route-specific styling into ImageUploadField. The shared upload field and CustomFileUploadButton visuals now live in `src/styles/presets/image-upload.ts`; caller-specific form spacing remains at the route owner. ProfileImageUpload retains its separate single-file validation/object-URL lifecycle but reuses the same preview and trigger contracts.

### E. Profile image and password subflows

#### Profile image

`ProfileForm` composes `ProfileImage` (existing image display/delete/fullscreen view) and `ProfileImageUpload` (selected new file preview/selection), then the profile data fields and `ChangePasswordForm`.

- `ProfileImage` owns loading/no-image/image-present/deleting/fullscreen states. It uses AppImage presets `profile` and `profileLightbox`, local circular image/button geometry, local dialog content surface and icon controls.
- Delete action uses shared `useConfirm`; success/error uses shared `useNotification`.
- `ProfileImageUpload` remains distinct from generic ImageUploadField. It validates one selected file and owns its object URL lifecycle; selection uses CustomFileUploadButton, while field/preview/thumbnail/filename/remove visuals now consume shared image-upload presets.
- The existing image and pending upload are distinct states and should not be collapsed into one component without preserving the current behavior.

#### Change password

- `ChangePasswordForm` is conditionally rendered only when expanded. It owns submitting state, three PasswordField instances, PasswordRequirements and a Save password Button.
- It consumes `ACCOUNT_FORM_FIELDS_SX` and `BUTTON_STYLES.primary`, but still adds local top margin, button alignment and margin.
- Field error/helper text is provided by PasswordField props. Shared password field visual ownership is separate from ChangePasswordForm layout.

### F. Global confirmation and notification owners

Provider nesting in `app/providers.tsx`:

```text
ThemeProvider / CssBaseline
  └─ QueryClientProvider
      └─ AuthProvider
          └─ BackgroundProvider
              └─ NotificationProvider
                  └─ ConfirmDialogProvider
                      └─ application
```

#### ConfirmDialogProvider

- One global provider mounted in app/providers; consumers use `useConfirm()` and receive a Promise<boolean>.
- The provider owns open/message/title state and a single Dialog with DialogTitle, DialogContent, DialogActions and two Buttons ("No"/"Yes").
- It currently relies on MUI defaults and raw Button props (`color="primary"`, `variant="contained"`) without named semantic cancel/confirm presets. The two actions currently share the same primary role visually, despite opposite semantic outcomes.
- Direct consumers found: ProfileImage, AdminReports, TripActions, AdminFailedLogs, AdminUsers, AdminUserProfileImage, EditPointPage, AdminUserForm, CreatePointPage, RepliesSection, EditTripLayout and CommentsSection. All must share one dialog contract.

#### NotificationProvider

- One global provider mounted above the application. Consumers use `useNotification()` for success/error/warning/info.
- It owns one Snackbar and one Alert, maps severity to default duration, position and variant from `NOTIFICATION_DEFAULTS`, ignores clickaway close and supports onClose callbacks.
- Only explicit local sx in its rendered feedback is Alert width 100%; visual Alert/Snackbar defaults otherwise depend on MUI theme defaults and component styles.
- It is used by ProfileForm, ChangePasswordForm, ProfileImage/ProfileImageUpload, PointForm, TripForm, auth forms, social actions, report actions and other API workflows. The provider is the visual owner; consumers should not create independent backend-operation Snackbars/Alerts.
- Inline Alerts in map pickers and ImageUploadField are local component feedback, not NotificationProvider notifications. They must be compared by semantic role before consolidation; they are not automatically duplicates.

### G. Shared state and responsive ownership matrix

| Owner | State(s) observed | Visual owner / current treatment | Open contract work |
|---|---|---|---|
| AddressAutocomplete | loading/searching, info notice, disabled search | TextField/Button/Alert in shared component; caller sx overrides | Field focus/error/disabled, button variants, info feedback and caller override removal |
| PointLocationPicker | maps loading, locating, map/address selection, error notice | Map frame, Buttons, Snackbar/Alert local sx | Shared map controls, loading/disabled/error states and responsive arrangement |
| TripLocationPicker | maps loading, address search, map selection, info notice | Separate map/address implementation | Compare with point picker; unify visual contracts without assuming behavior equivalence |
| ImageUploadField | processing, error, image limit, previews, remove-one/remove-all | Named image-upload presets for layout, previews and actions; warning Alert remains local/theme-owned | Verify warning Alert theme parity and disabled/focus states; upload-specific local sx removed |
| AppImage | loading delegated to Next Image, thumbnail fallback, error/placeholder | IMAGE_PRESETS + inline style transport | Preset rendering contract and fallback frame contract without React style |
| SocialObjectPlaceholder | asset pending/selected | Local Box/Image/overlay/Typography | Shared placeholder surface/overlay/typography; parent owns aspect ratio |
| ProfileImage | loading, empty, image, deleting, fullscreen | Local circular image controls and Dialog | Shared avatar/image frame, icon action, dialog surface, disabled/loading |
| ProfileImageUpload | selected file, validation error, preview, remove | Shared CustomFileUploadButton and image-upload preview presets; validation/object URL lifecycle remains local | Keep separate single-file validation and lifecycle; verify shared action disabled/focus state parity |
| ChangePasswordForm | collapsed/expanded, validation, submitting | Shared fields/button presets plus local margins | Password field and form-action contracts |
| ConfirmDialogProvider | closed/open, confirm/cancel | Global MUI Dialog and two raw Buttons | Semantic Confirm vs Cancel action presets and shared dialog surface |
| NotificationProvider | hidden/visible, four severities, duration/position | Global Snackbar + Alert; defaults from notification constants | Shared severity/variant/placement/close contracts and theme ownership |

Hover/focus states are not exhaustively recorded by this batch. Do not infer that a component has no hover/focus state merely because its local file does not declare one; MUI theme defaults and native controls may supply them. The final state matrix must inspect both component-local rules and theme overrides.

### H. Exact source evidence

All files below were fetched by `feature/frontend-modernization` ref during this batch:

- `src/components/maps/AddressAutocomplete.tsx` — `f53c09e6196a8f980b2e2700884a9aeb62b2b116`
- `src/components/maps/PointLocationPicker.tsx` — `64f24d4bff2c414e9bf0f2c57d63f59b4390da97`
- `src/components/maps/TripLocationPicker.tsx` — `ebfb1a7cf123485aaed0dd2b4157412642ad5673`
- `src/components/images/ImageUploadField.tsx` — `78923c1529132c880e9465e33b774ca6f2b0525b`
- `src/components/images/AppImage.tsx` — `52d094dd76316c9404eba4efa66e43a1351d1520`
- `src/components/placeholders/SocialObjectPlaceholder.tsx` — `0cacf84b5b51e1e93206fb85a184a49ddb1ff15c`
- `src/components/auth/ProfileImage.tsx` — `f544741c9a71e6ae5142c5cae763eb12947bbf24`
- `src/components/auth/ChangePasswordForm.tsx` — `6fe468e3574686a2ce77f281e9451e8714aed128`
- `src/components/common/ConfirmDialog.tsx` — `8f228d8b846b9ee532650fa82c94797da54f0bb6`
- `src/components/common/NotificationProvider.tsx` — `3a81f51a9e43fb78c498e75c4c0055ad04572dc5`
- `src/constants/images/presets.ts` — `4d3ea1fe0a0eb9f137983542c99a43200e55cf2f`
- `src/constants/notifications.ts` — `571f1ffc95ed8cd25ebe3fca4cb08d4cf6482c21`
- `src/components/trips/PointSection.tsx` — `3ffe0753576bda870302dd8c6680e6882bc34314`
- `src/components/trips/DayImagesGallery.tsx` — `f2165d093671e0b14f6651cd323cde451899cecf`
- `src/components/trips/TripCard.tsx` — `6ca299211ee78c0373d0cf6a28eafcf40f6ccc0d`
- `src/components/admin/AdminUserProfileImage.tsx` — `738389ef0f0ac674db07e10f64694ce571cb9804`
- `src/components/admin/AdminUsers.tsx` — `61c674d78c6890b157cede9c166a5ffcc961b658`
- `src/components/points/EditPointPage.tsx` — `2ee94d01320853d8408b54b6c697308c839e5207`
- `src/components/trips/EditTripLayout.tsx` — `c86c23108089bec5169ffe2d8361b44db715bbe0`
- `src/components/points/CreatePointPage.tsx` — `34704fd35ef58c086f8401d961e33e47c8e8e2b2`
- `src/components/trips/TripForm.tsx` — `5a1d13e045eb0060e77e6eccaf2bff5bb3f9a272`
- `src/components/points/PointForm.tsx` — `e0580d770ce3a0d113086c752dc99313d87e90d4`
- `src/components/images/ImageGallery.tsx` — `ae0cde0384ce5ae02d0a2de35e91059bc45cc800`
- `src/components/images/ImageLightbox.tsx` — `4ca3dd6bce407f6c74d489d9a637735c85fbe571`
- `src/components/auth/ProfileForm.tsx` — `53753f979947457c028f7541450f207e90ca9b03`
- `app/providers.tsx` — `77534e6899f68aa1e215cc3eedee9a27bfeace27`

### I. Batch result and next task

- Closed the property-level styling API and primary state ownership for AddressAutocomplete, PointLocationPicker, TripLocationPicker, ImageUploadField, AppImage, SocialObjectPlaceholder, ProfileImage/ProfileImageUpload, ChangePasswordForm, ConfirmDialogProvider and NotificationProvider.
- Recorded direct consumer graphs for map, image, placeholder and upload components. Cross-route owners (AppImage, ImageUploadField, ConfirmDialogProvider and NotificationProvider) must be migrated once and verified against every route group, not patched independently at account call sites.
- Confirmed several explicit Styling API migration targets: AppImage React style transport, SocialObjectPlaceholder Next Image React style, ImageUploadField local sx, map component local sx and AddressAutocomplete caller-provided sx API.
- The account upload/profile flows are not the same component: generic multi-image upload and single profile-image upload have different behavior and constraints.
- No app source changed. No branch created. No build/tests/lint/CI/browser run.
- Stage 1 remains IN PROGRESS; candidate inventory 163/163 is not exhaustive consumer-map completion.

**NEXT TASK — complete shared field/action contracts and exact cross-route consumers:**

1. Trace `CustomFileUploadButton`, PasswordField, PasswordRequirements, GoogleMapView and shared map-control components as owners, including all exact direct consumers and prop forwarding.
2. Trace all AppImage/ImageGallery/ImageLightbox consumers and state/responsive contracts, including lightbox open/close/navigation and missing-image paths; compare image presets against actual dimensions and caller frame geometry.
3. Complete the semantic action matrix for ConfirmDialog, BackButton, upload/remove controls, map search/current-location/find-in-map controls, ProfileForm/ChangePasswordForm, TripForm and PointForm. Distinguish Confirm, Cancel, Delete, Remove, Upload, Search, Locate, Navigation and Save roles.
4. Trace MUI theme overrides for TextField, Button, Alert, Snackbar, Dialog, IconButton, CircularProgress and map-related controls; do not assume theme defaults are centralized merely because a component omits sx.
5. Resolve Favorites/My Trips source-correctness inconsistency only in a separately authorized source-correction task; no source edits during this audit.
6. Continue Section 7 consumer searches, reconcile against exact branch-ref files and update Section 10.1 only for genuinely missing entries. Do not treat default-branch code search alone as branch proof.
7. Keep Stage 1 IN PROGRESS until all mandatory owner-to-consumer edges and state/responsive matrices are exhaustive. No app-source migration before that gate.
8. Do not run build, tests, lint, CI or browser validation without explicit user authorization.

No application source code was changed. No branch was created. No build, tests, lint, CI or browser validation was run.


## 11.18 — Shared upload/password/map/image contracts and MUI theme coverage (2026-11-18)

### A. Mandatory preflight and scope

- Re-read Sections 1.4, 2, 6, 7, 9 and 10.1, plus Sections 11.12–11.17 and the exact previous NEXT TASK.
- Verified feature/frontend-modernization exists and compared it with the last recorded branch commit: current branch HEAD remains 8a2facbbcf8543d372d7788371abb4cf8e75ccc3 (identical).
- Audit document blob SHA before this batch: db1fa6b2ee41d041823c68bf0133dbea239da684.
- All implementation files listed in this batch were fetched by the exact branch ref. GitHub code search was used only to discover candidate callers; caller relationships below were checked against branch-ref source.
- Scope is dependency/consumer mapping only. No application source changes, no new branch, no build/tests/lint/CI/browser validation.

### B. Shared upload trigger: CustomFileUploadButton

Public API: handleFilesChange, images, fileSelected, iconFotoCamera, disabled, maxImages, accept and multiple.

- The component computes disabled state from images.length + fileSelected.length >= maxImages or the caller's disabled flag.
- It has two distinct visual modes: camera mode uses Tooltip + IconButton + hidden file input; standard mode uses a 30ch Box + contained Button + hidden file input.
- Both modes forward the same accept/multiple/file-change behavior. Neither mode exposes a semantic Upload role or shared icon-action contract.
- Exact direct consumers:
  - ImageUploadField — generic multi-image selection; forwards current image URLs, selected files, upload handler, processing/limit disabled state, max count, accepted MIME types and multiple selection.
  - ProfileImage.tsx / ProfileImageUpload — separate single-file profile selection; uses camera mode and single-file constraints.
- Ownership: this component owns the upload trigger and file-input interaction; ImageUploadField/ProfileImageUpload own previews, validation, processing and remove actions. Do not move preview/remove behavior into this trigger.

### C. Password field and requirement owners

#### PasswordField

- Public API: label, autocomplete, disabled, maxLength, error, helperText and react-hook-form registration.
- Owns TextField type switching and local visible state; reveal/hide is an IconButton with dynamic accessible label and Show/Hide icons.
- Exact direct consumers confirmed from branch files: RegisterForm, ResetPasswordForm, ChangePasswordForm and AdminUserForm.
- Form registration is spread onto TextField; maxLength is applied to htmlInput; helper/error/disabled/autocomplete are explicit. The reveal action is not exposed to callers.
- Open visual contract: shared TextField states plus semantic password-visibility IconAction; no ad hoc per-caller styling API is exposed.

#### PasswordRequirements

- Public API: password, optional minLength/maxLength. Requirement logic is delegated to getPasswordRequirements in validations/shared.
- Exact direct consumers: the same four form owners above.
- Owns a UL/list grid with local list reset, negative top margin, left margin, responsive one/two-column grid and gap. Requirement rows use local flex/gap. Success and secondary/disabled colors are palette-backed, but icon/feedback treatment is not a named preset.
- This is shared validation feedback, not a form-field owner. Its responsive grid must be migrated as a named feedback/layout contract without moving form spacing into each caller.

### D. Google Maps renderer and map-control ownership

#### GoogleMapView

- Exact direct consumers: PointLocationPicker, TripLocationPicker, TripMapSection and PointCard.
- Owns Maps SDK loading through useGoogleMapsLoader, map wrapper/canvas dimensions, marker/path rendering, marker selection/drag, map click coordinate conversion, InfoWindow rendering, fitBounds and focus-marker behavior.
- It deliberately does not own feature controls or selection state. Those remain with the four consumers.
- Loading state is a local Box + CircularProgress (size 28); map wrapper uses local flex/minWidth/width/height sx. The underlying Google Maps canvas and built-in map controls are SDK-owned, not MUI Button/IconButton instances.
- Consumer-specific frame geometry:
  - PointLocationPicker supplies point-picker constants and map height.
  - TripLocationPicker wraps the map in a positioned fixed-height frame and passes height 100%.
  - TripMapSection supplies trip map dimensions and a theme-backed Card; its MobileStepper owns Back/Next navigation.
  - PointCard embeds a compact 150px map in a point card and has an explicit no-marker text fallback.
- Do not centralize these different frame dimensions as one fixed map size. Centralize shared renderer/loading behavior and keep feature frame geometry with each consumer or a named geometry preset.

#### Map action matrix

| Owner | Action / role | State and current implementation | Direct consumer / open contract |
|---|---|---|---|
| AddressAutocomplete | Search | Search Button; disabled until Maps loaded, not searching and query length meets minimum; CircularProgress while searching; info Alert for invalid/no-result/failure | PointForm, PointLocationPicker, TripLocationPicker; caller sx escape hatches remain |
| PointLocationPicker | Locate | GPS Button; locating state disables action and shows CircularProgress; geolocation permission/unsupported errors use local Snackbar+Alert | CreatePointPage, EditPointPage; currently generic outlined Button, no Locate role |
| PointLocationPicker | Remove marker | Clears coordinates/address and resets center; generic secondary Button | CreatePointPage, EditPointPage; semantic Remove role needed |
| PointLocationPicker | Find in map | findInMapTrigger responds to external coordinate changes and pans/zooms map | Edit/Create point page flow; this is a navigation/focus action, not a map search button |
| TripLocationPicker | Search | AddressAutocomplete search/Places selection; info Alert | TripForm, EditTripLayout |
| TripLocationPicker | Remove marker | Clears coordinates/address and recenters map; generic secondary Button passed as extraAction | TripForm, EditTripLayout |
| TripMapSection | Navigation | MobileStepper Back/Next Buttons navigate only across points with coordinates; overview is step 0 | TripDetails map; needs semantic Navigation/Pagination action contract |
| GoogleMapView | Map interaction | map click, marker click/drag, InfoWindow close; no app-owned button surface | Four direct consumers; SDK map controls remain separate |

Important behavior distinction: PointLocationPicker has GPS locate and external find-in-map trigger; TripLocationPicker does not. Their similar address/map UI does not make their feature behavior interchangeable.

### E. ImageGallery, ImageLightbox and preset/frame audit

#### Consumer graph

ImageGallery
- PointSection
- DayImagesGallery

ImageLightbox
- ImageGallery
- AdminUserProfileImage
- AdminUsers

AppImage
- ProfileImage
- ImageGallery
- ImageLightbox
- AdminUserProfileImage
- AdminUsers
- EditPointPage
- TripCard
- EditTripLayout

The consumer paths above are implementation consumers; barrel exports are not counted as rendered call sites.

#### Gallery and lightbox state contract

- ImageGallery returns null for an empty image array. Otherwise it owns index: number | null; clicking an image sets its array position, and closing sets null.
- ImageGallery supports row/stack/grid CSS Module variants. Grid columns are computed from the number of images (capped at three). The first image may receive priority/eager/high fetch priority through explicit props.
- ImageLightbox opens only when the current indexed image exists. It owns the full-screen Dialog shell, close action, image counter, previous/next controls, keyboard ArrowLeft/ArrowRight and touch-swipe navigation. Previous/next wrap around the array.
- The lightbox stage uses AppImage preset lightbox, fill and contain fit through the preset. The stage is full-size with responsive padding; image controls are absolutely positioned.
- AdminUserProfileImage opens a one-image lightbox at index 0 and closes via its own boolean state; AdminUsers opens a selected image/alt pair and passes a selected index. These are separate state owners sharing the same lightbox visual component.
- Missing-image paths:
  - ImageGallery: empty list renders nothing (no empty gallery placeholder).
  - AppImage: a thumbnail failure retries the full image URL once when available; final error or missing URL renders an empty div with role=img and aria-label, retaining preset style/className.
  - SocialObjectPlaceholder is a separate parent-selected fallback, not automatically rendered by AppImage.
  - Admin profile-image flows distinguish loading, query error, no image and existing image.
- Open issue: keyboard listener, touch handling, image index and responsive control hit areas require final state/focus verification; this audit did not run browser interaction checks.

#### Preset-to-frame comparison

| Preset | Declared intrinsic contract | Observed consumer/frame implication | Audit result |
|---|---|---|---|
| hero | 1200×630, priority, 100vw | Public/OG and hero use needs separate call-site confirmation | Keep open; do not assume every hero is an in-page frame |
| tripCard | 400×240, cover, card sizes | TripCard card image frame; caller CSS/layout controls visible frame | Aspect ratio is 5:3; verify caller frame exactly |
| gallery | 240×180, thumbnail | ImageGallery row/stack image; CSS Module owns frame geometry | 4:3 intrinsic; verify module ratio and responsive widths |
| galleryGrid | 240×180, thumbnail, cover | ImageGallery grid uses fill and CSS Module grid frame | Intrinsic props are overridden by fill; verify frame ratio and crop |
| lightbox | fill, contain | Fullscreen stage is parent-sized and padded | Correctly frame-driven; stage dimensions own visible size |
| profile | 160×160, cover | Avatar frames observed at 88×88 in admin; profile frame is circular | Intrinsic 160px is a source-size hint; fill consumers override dimensions |
| profileLightbox | 1600×1200, contain, max-height 85vh style | Profile fullscreen preview has its own Dialog implementation | React style transport remains prohibited; inspect frame parity in migration |
| tripPointThumb / editorDayThumb / editorPointThumb | 200×150 / 120×90 / 80×60 | Trip/editing consumers use small fixed thumbnail frames | All 4:3; caller dimensions and objectFit must be checked per usage |
| aboutIllustration | 640×480, responsive sizes | About page illustration frame | 4:3; confirm caller sizing in public-page pass |

Finding: preset dimensions are not a complete visual frame contract. Some callers override dimensions with fill; CSS Modules/Avatar/parent containers determine actual visible geometry. Keep intrinsic optimization hints, crop behavior and frame geometry as separate concepts. profileLightbox.style and AppImage's computed style transport remain explicit Section 1.4 migration targets.

### F. MUI theme override coverage — exact current branch

The current src/theme/index.ts registers exactly these MUI component overrides:

| MUI component | Current override | What is actually centralized | Still not centrally owned here |
|---|---|---|---|
| MuiButton | buttonOverrides | Typography and border radius | Semantic variants, color/hover/focus/active/disabled states and icon-action size/hit area |
| MuiCard | cardOverrides | Default elevation and shared surface via getSurfaceStyles | Feature content geometry |
| MuiDialog | dialogOverrides | Dialog Paper surface via getSurfaceStyles | Dialog action roles, full-screen image variant and inner layout |
| MuiTextField | textFieldOverrides | Default variant=outlined and size=medium | InputBase/InputLabel/helper/error/focus/disabled details beyond MUI defaults |

No explicit component override is registered for MuiAlert, MuiSnackbar, MuiIconButton, MuiCircularProgress, MuiInputBase, MuiInputLabel, MuiFormControl, MuiSelect, MuiMenuItem, MuiCheckbox, MuiSwitch, MuiAutocomplete, MuiMobileStepper or MuiPagination in this theme entry.

- This is a verified absence from the current theme registration, not a claim that MUI has no built-in default styles.
- Button typography/shape is centralized, but color/state behavior is left to palette + MUI variant defaults and per-consumer presets/sx.
- Dialog Paper surface is centralized; ConfirmDialog button roles and image-lightbox control/inner-stage contracts are not.
- TextField defaults are centralized, but PasswordField's reveal IconButton, field error/focus states and raw Select/InputBase families still need a cross-consumer state matrix.
- Alert/Snackbar behavior has notification constants and local/provider props, but no MUI theme override; map/upload inline Alerts are separate local feedback owners.
- Google Maps built-in controls are external SDK UI; app-owned map search/locate/remove/navigation controls must use the app semantic action system.

### G. Exact branch-ref source evidence

- src/components/CustomFileUploadButton.tsx — a82da64c73fd449677dedbc301e857fc4b7fe0a8
- src/components/common/PasswordField.tsx — b6488512ec4e31d555512724f61c55e73f28e61f
- src/components/common/PasswordRequirements.tsx — ab814670e8ceba3c3257ed21bdf3425ca6e12cdf
- src/components/maps/GoogleMapView.tsx — ca8a1a707b7c6be5fb67c2690c9b2e5195ea3d67
- src/components/maps/PointLocationPicker.tsx — 64f24d4bff2c414e9bf0f2c57d63f59b4390da97
- src/components/maps/TripLocationPicker.tsx — ebfb1a7cf123485aaed0dd2b4157412642ad5673
- src/components/trips/TripMapSection.tsx — f7d06017eff44dc3f421c43d8eb144e53c241c40
- src/components/points/PointCard.tsx — 86ecd774f4ff3aa0e7a3b8f68b8fea2c4eb8dab2
- src/components/images/ImageGallery.tsx — ae0cde0384ce5ae02d0a2de35e91059bc45cc800
- src/components/images/ImageLightbox.tsx — 4ca3dd6bce407f6c74d489d9a637735c85fbe571
- src/components/images/AppImage.tsx — 52d094dd76316c9404eba4efa66e43a1351d1520
- src/components/auth/RegisterForm.tsx — ffbe8b0310a0af09243e6efb32087e2ac9c7d1a1
- src/components/auth/ResetPasswordForm.tsx — e324344b05a9cc6de17afaebece7cf7a91c3ee25
- src/components/auth/ChangePasswordForm.tsx — 6fe468e3574686a2ce77f281e9451e8714aed128
- src/components/admin/AdminUserForm.tsx — 66ffd3cb2dfeb267aa4dc03bdeb9f43aba0e5e42
- src/components/auth/ProfileForm.tsx — 53753f979947457c028f7541450f207e90ca9b03
- src/theme/index.ts — 2bbf22fb89a8a99269d19348c59270ac97cd5178
- src/theme/components/button.ts — 344522fde4f2c45fc223d876d9c568faabd41579
- src/theme/components/card.ts — 2c933219062e2e626304bc153234a4dbe5c3205b
- src/theme/components/dialog.ts — d65a4a628f1b3e5021635d3a5d8558588734804e
- src/theme/components/text-field.ts — 4e3ed7529c7f5c219dbe0d05f4f74da0cd84fa
- src/constants/images/presets.ts — 4d3ea1fe0a0eb9f137983542c99a43200e55cf2f

### H. Batch result and next task

- Completed direct-consumer mapping for CustomFileUploadButton, PasswordField, PasswordRequirements, GoogleMapView, ImageGallery and ImageLightbox.
- Recorded app-owned map action distinctions: Search, Locate, Remove Marker, Find in Map and point navigation are different semantic roles; PointLocationPicker and TripLocationPicker do not have identical behavior.
- Completed exact MUI theme registration audit: only Button, Card, Dialog and TextField have explicit overrides in the current theme.
- Updated existing Section 10.1 rows for shared upload/password/map/image owners; no new candidate ledger path was required.
- Stage 1 remains IN PROGRESS. Candidate inventory remains 163/163, but full mandatory Section 7 consumer searches, semantic action matrix, token/preset consumer closure and state/responsive matrix are not yet exhaustive.
- No application source code changed. No branch created. No build, tests, lint, CI or browser validation run.

**NEXT TASK — complete the remaining Not Found / 404 route audit:**

1. Trace `app/not-found.tsx` through the shared `NotFound` component, its CSS Module, tokens/presets, navigation actions and every relevant caller (including RequireRole unauthorized flow and other route/error fallbacks).
2. Reuse existing shared-owner audits; do not duplicate the NotFound component audit where already complete. Verify exact current-branch consumers and responsive/error states.
3. Update Section 11.19.F and reconcile Section 10.1 only where new evidence or a genuinely missing path is found.
4. Keep Stage 1 IN PROGRESS until every mandatory Section 7 consumer map and state/responsive matrix is exhaustive. Do not begin app-source migration before that gate.
5. Do not change application source without explicit authorization.
6. Do not run build, tests, lint, CI or browser validation without explicit user authorization.

No application source code was changed. No branch was created. No build, tests, lint, CI or browser validation was run.


## 11.19 — Route-page audit coverage and detailed Trip Details / Login / Register audits (2026-11-18)

### A. Preflight and scope

- Re-read the audit architecture, Styling API policy (Section 1.4), six-stage plan (Section 6), required inventory/search scope (Section 7), file ledger (Section 10.1), and Sections 11.12–11.18 before starting.
- Repository: AngelGeorgievStoyanov/hacktrip-web.
- Branch: feature/frontend-modernization.
- Audit document blob SHA before this update: eb296e0c049f4855a00731aa25eb264dd25d3fd4.
- Latest recorded audit commit before this batch: c200401a2b18467b658d3325201a6c15da69d945.
- All implementation files listed in Sections B–D were fetched using the exact feature/frontend-modernization branch ref. Source blob SHAs are recorded below.
- This batch completes detailed route-page audits for Trip Details, Login and Register. It does not migrate application source or claim Stage 1 complete.

### B. Trip Details — /trips/[id]

**Route and server composition**

- Route root: app/(public)/trips/[id]/page.tsx.
- Public shell: app/(public)/layout.tsx → shared Header → route → shared Footer.
- Server route parses a positive trip ID, loads the trip group once, resolves the requested day from real day numbers, builds metadata/SEO content and JSON-LD, and passes the trip plus initial day number to TripDetailsView.
- Invalid IDs and not-found API responses use notFound(); the selected day falls back to the first real day. The route renders JsonLd after the interactive view.
- The route root applies CENTERED_PAGE_MAIN_STYLE through React style. This is a Styling API migration target, not an exception.

**Client composition and state ownership**

```text
TripDetailsView
├─ sticky TripDaysNav
├─ TripGroupSocialActions
├─ primary row
│  ├─ TripDetails
│  │  ├─ TripActions (navigation + management)
│  │  ├─ FavoriteButton
│  │  ├─ EngagementBar
│  │  └─ BackButton
│  └─ DayImagesGallery
│     ├─ ImageGallery → AppImage + EngagementBar + ImageLightbox
│     └─ SocialObjectPlaceholder (empty-day-image fallback)
├─ conditional trip-group/day CommentsSection
├─ map row
│  ├─ TripMapSection → GoogleMapView + MobileStepper
│  └─ PointsSection → PointSection
│     ├─ ImageGallery / SocialObjectPlaceholder
│     ├─ PointActions
│     ├─ CommentsToggle
│     └─ ExpandableText
└─ conditional point CommentsSection
   └─ RepliesSection
```

- TripDetailsView owns active day, selected point index, open trip-group/day/point comment targets, and trip-group comment visibility. It resets selected point/comments when the server-selected day changes.
- Day changes within the loaded group use client state and replace the URL; they do not refetch the group. Trip group social state remains attached to the group; day/point/image comments remain scoped to their respective targets.
- CommentsSection owns comment list/form/edit/reply state and requests; RepliesSection owns reply state. Social permissions and counts are driven by shared social configuration and DTO state.
- TripMapSection owns navigable point indexes, selected marker, overview state and mobile stepper scrolling. GoogleMapView owns map rendering/events; it does not own page-level navigation controls.
- ImageGallery owns selected image index and delegates fullscreen viewing to ImageLightbox. AppImage owns image preset rendering/fallback.

**Style and layout ownership**

- TripDetailsView.module.css is the route-level structural owner: 1200px max-width shell; primary two-column row (320–450px + flexible image column); map/point row (up to 600px + 500px); container-query stack at 1120px; images move before trip info when stacked; 600px media rule reduces gaps. These are page composition rules, not shared card/button skins.
- TripDetailsView also uses local sx for sticky shell bleed/width and shared STICKY_SOCIAL_SX for the social surface. The shell bleed derives from PAGE_CONTENT_PADDING.
- TripDaysNav owns local Pagination item sx, selected/hover colors from UI_COLORS, AppBar/Box composition and local 10px top margin. MuiPagination/AppBar do not have explicit theme overrides in the recorded theme audit.
- TripDetails owns a MUI Card with local padding/margins/min/max widths and local flex/spacing sx. Text styling partly consumes CARD_HEADING_TEXT_STYLE, CARD_TEXT_BLOCK_STYLE and CARD_TEXT_INSET_SX, but those card text presets include CSSProperties values and are passed through React style in places. The local card geometry remains a migration target.
- TripActions owns owner-only Add Day, Add/Edit Points, Edit Day, Delete Day and Delete Trip actions. It consumes BUTTON_STYLES.tripAction / tripActionDanger; deletion uses ConfirmDialog and mutation-pending disabled state. BackButton consumes BUTTON_STYLES.back through the shared owner and receives TRIP_ACTION_BUTTON_LAYOUT_SX.
- TripGroupSocialActions owns trip-group Like/Favorite/Report/Comments/Share controls and local mutation/error states. It uses direct IconButtons, Badge and Tooltip; social errors use socialErrorTextStyle through React style. These are shared semantic icon-action and feedback owners, not Trip Details-only styles.
- DayImagesGallery delegates populated days to ImageGallery (grid/galleryGrid) and empty days to a square SocialObjectPlaceholder frame (50% width, max 280px).
- TripMapSection owns a Card frame (max 600px; small-phone 94vw), MobileStepper Back/Next Buttons, responsive stepper behavior and map dimensions from map constants. GoogleMapView owns the shared renderer. Do not force the trip map frame to match point-picker or point-card frames.
- PointSection owns a local card layout and content inset; uses shared card text presets, ImageGallery or SocialObjectPlaceholder, PointActions, CommentsToggle and ExpandableText. The description wrapper uses React style with CARD_TEXT_INSET_SX plus a local margin.
- CommentsSection and RepliesSection are reused feature owners, not page-owned widgets. Their MUI Card/TextField/Alert/CircularProgress/IconButton controls, edit/save/cancel/delete/reply states and local panel/list spacing must be reconciled against the global semantic action, field and feedback contracts.
- ImageGallery.module.css owns gallery row/stack/grid structure and square grid image-button geometry; shared image preset/crop behavior remains with AppImage and the caller frame. ImageLightbox owns its fullscreen Dialog and image-control layout.

**Trip Details shared dependencies already mapped elsewhere**

- AppImage, ImageGallery, ImageLightbox, SocialObjectPlaceholder, GoogleMapView, ConfirmDialog, NotificationProvider, LikeButton, FavoriteButton, ReportButton, SocialConfigStatus, CommentsToggle and shared image/map behavior are cross-page owners documented in Sections 11.12, 11.13, 11.17 and 11.18.
- This page audit adds their exact Trip Details composition and call-site context; it does not create duplicate shared implementations.
- Semantic action roles to preserve distinctly: day navigation; map point Back/Next; Add Day; Add/Edit Points; Edit Day; Delete Day; Delete Trip; Back to Trips; Like; Favorite; Report; Share; Comments disclosure; image open/close/previous/next; comment/reply create/edit/save/cancel/delete.
- Do not collapse these into generic primary/secondary buttons. The same-looking icon action may have different meaning and state.

**Trip Details outstanding migration targets**

1. Replace route-root React style usage with the approved layout preset/CSS-variable path.
2. Move shared card padding/radius/shadow/typography roles out of local TripDetails/PointSection geometry while preserving distinct content widths and layout.
3. Define shared Pagination/day-navigation and MobileStepper semantic states; avoid per-route duplicate selected/hover styling.
4. Map every IconButton action and accessible state to named semantic icon-action roles; retain action-specific labels and disabled/loading behavior.
5. Centralize comment/reply fields, panels, feedback and edit/save/cancel/delete action states without moving comment business logic.
6. Verify Trip Details CSS Module values and image/map frames against token/preset ownership; keep unique container-query geometry where genuinely page-specific.
7. Complete browser-level responsive/focus/touch verification only when separately authorized; none was run in this audit.

### C. Login — /login

**Route and shell**

- Route root: app/(auth)/login/page.tsx; it renders LoginForm inside Suspense with fallback null.
- Auth shell: app/(auth)/layout.tsx → Header → centered main → content wrapper (max-width 480px) → GuestOnly → route → Footer. Login page metadata is NOINDEX.
- Auth layout applies a React inline style object to main and a local max-width wrapper. The main style is prohibited by Section 1.4. The route-level Suspense fallback is behavior, not a visual owner.
- GuestOnly is applied by the auth layout. Login page itself does not add a second GuestOnly wrapper.

**Form composition and states**

- LoginForm composes WelcomeHeading → AUTH_FORM_SX form → AUTH_FORM_TITLE_SX title → email TextField → password TextField with local show/hide IconButton → hidden captchaToken input → Captcha → primary Login submit → secondary Register / Forgot Password / Resend Verification navigation actions.
- Uses react-hook-form with loginSchema; validation is on submit and revalidates on change. Email/password helper/error rendering is tied to isSubmitted.
- Local state: captcha token/reset key, submitting, showPassword. Submit is disabled while submitting or without a CAPTCHA token; spinner appears while submitting.
- Submit calls auth login and redirects to /. Errors use NotificationProvider; after completion CAPTCHA token is cleared and widget reset.
- BroadcastChannel listens for email-verified events and shows the shared success notification. This is feedback behavior, not a form skin.
- The password reveal action is a raw IconButton owned by LoginForm, unlike the reusable PasswordField used by RegisterForm. It should converge on the same semantic Password Visibility IconAction contract without forcing the two field owners into one component if their form behavior differs.

**Style ownership and targets**

- AUTH_FORM_SX composes PANEL_SX + COLUMN_STACK_SX and adds padding 30px, max-width 700px, width 100%, box sizing and centered margin. The auth layout wrapper limits effective width to 480px; the two max-width owners are redundant and should be reconciled.
- AUTH_FORM_TITLE_SX owns centered title spacing; AUTH_FORM_ACTIONS_SX owns the wrapping centered secondary-action row and uses UI_SPACING.md/xs.
- Login email/password TextFields rely on shared MuiTextField defaults but do not consume a named field preset. Error/helper state is locally selected from form submission state.
- Primary submit consumes BUTTON_STYLES.primary; all three navigation actions consume BUTTON_STYLES.secondary. Their semantics are Login/Submit versus route navigation, not interchangeable button roles.
- Password reveal IconButton uses ShowPasswordIcon/HidePasswordIcon, local visibility state and aria-label; it has no named icon-action preset.
- Captcha owns its third-party widget wrapper. The wrapper uses local min-height, center alignment, disabled pointer-events and opacity; CAPTCHA internal appearance is vendor-owned. Missing site key renders an alert message.
- WelcomeHeading/ScrambleHeading are shared with Home, Trips and other auth pages. Their style ownership and React style usage are already recorded in Sections 11.14–11.15; Login is another consumer, not a new heading implementation.

**Login outstanding migration targets**

1. Remove auth layout React style presentation and centralize the route-shell layout while preserving the 480px content width.
2. Reconcile the 480px shell width with AUTH_FORM_SX max-width 700px; one owner should define the effective page width.
3. Define shared email/password field states and password visibility icon-action contract.
4. Define semantic Login/Submit and secondary route-navigation roles with focus/disabled/loading states.
5. Move Captcha wrapper spacing/disabled feedback to an approved external-widget wrapper contract; do not style the third-party widget internals.
6. Preserve notification, BroadcastChannel and redirect behavior unchanged during future visual migration.

### D. Register — /register

**Route and shell**

- Route root: app/(auth)/register/page.tsx; it wraps RegisterForm in GuestOnly. The auth layout also wraps all children in GuestOnly, so Register currently has nested GuestOnly wrappers. Record this composition for awareness; do not change route/auth behavior as part of CSS migration.
- Auth shell: same Header/main max-width 480px/Footer as Login. Register metadata is NOINDEX.
- Auth layout main uses the same prohibited React inline style and width wrapper described in Section C.

**Form composition and states**

- RegisterForm composes WelcomeHeading → AUTH_FORM_SX form → AUTH_FORM_TITLE_SX → Email / First Name / Last Name TextFields → PasswordField → PasswordRequirements → Confirm Password PasswordField → terms Checkbox/Link → conditional terms error → hidden captchaToken input → Captcha → primary Register submit → secondary Login / Resend Verification navigation actions.
- Registration schema extends registerSchema with required confirmPassword and acceptedTerms, then checks password equality. Form mode is onChange and revalidates onChange; touched/submitted fields determine error/helper rendering.
- Local state: submitting, registrationComplete, CAPTCHA token/reset key. The form locks fields and CAPTCHA while submitting or after successful registration. Submit requires valid form and CAPTCHA token.
- Successful registration shows a shared success notification and schedules redirect to /login; timer is cleaned up on unmount. Errors use shared generic error text through NotificationProvider. CAPTCHA is reset after submit attempt.
- PasswordField owns each field's visibility state and reveal/hide IconButton; PasswordRequirements derives checklist rows from shared getPasswordRequirements validation logic. These are reusable shared owners also used by Reset Password, Change Password and Admin User forms.
- Terms acceptance is a Checkbox + FormControlLabel with local pointer-events behavior while locked; the error is a direct Typography role=alert.

**Style ownership and targets**

- AUTH_FORM_SX, AUTH_FORM_TITLE_SX and AUTH_FORM_ACTIONS_SX are shared presets; Register should not define duplicate page-level card/heading/action skins.
- Email/first/last-name TextFields are direct MUI controls; password fields go through PasswordField. All need the same centralized base field contract and state matrix.
- PasswordRequirements owns a local UL grid (one column at xs, two at sm), list reset/margins/gaps, row flex alignment and success/disabled icon/text colors from the palette. The layout and feedback icon treatment are not yet named presets.
- Checkbox/FormControlLabel, terms link, conditional error Typography and CAPTCHA wrapper have local state/spacing behavior; no complete global MUI Checkbox/FormControlLabel/Alert theme contract was found in Section 11.18.
- Primary Register action consumes BUTTON_STYLES.primary. Login and Resend Verification actions consume BUTTON_STYLES.secondary. Their route semantics and disabled states differ.
- The same auth layout width redundancy (480px wrapper vs 700px form max-width) applies here.

**Register outstanding migration targets**

1. Reconcile auth shell/form max-width ownership.
2. Apply one shared field contract to the three standard TextFields and both PasswordFields, including error/helper/disabled/focus states.
3. Define password visibility icon-action and PasswordRequirements feedback/list layout contracts.
4. Define checkbox/terms-link/error states and consistent disabled behavior during submission/registration completion.
5. Define semantic Register/Submit versus Login/Resend route-navigation roles.
6. Centralize CAPTCHA wrapper disabled/availability presentation while keeping vendor internals external.
7. Preserve password matching, accepted-terms, captcha gating, success notification and redirect behavior unchanged.

### E. Cross-page reuse and owner reconciliation

- Trip Details reuses image, social, comments, map, placeholder, confirmation and notification owners already mapped in Sections 11.12–11.18. No new shared component owner was introduced in this batch.
- Login and Register share auth shell, Header/Footer, WelcomeHeading/ScrambleHeading, AUTH_FORM_SX, AUTH_FORM_TITLE_SX, AUTH_FORM_ACTIONS_SX, BUTTON_STYLES, Captcha, NotificationProvider and field/theme defaults.
- Login has a page-local password TextField/reveal control; Register uses shared PasswordField twice and shared PasswordRequirements. Preserve the behavior difference but unify the visual semantic contract.
- Register adds PasswordRequirements and terms Checkbox; Login does not. Do not add these to Login as a generic auth template.
- Existing Section 10.1 candidate rows cover the implementation paths inspected here; no duplicate ledger paths were added. Page-level route coverage is recorded below.

### F. Route-page coverage matrix (27 route roots)

Status definitions:
- **DETAILED** — route composition and the page's main styling owners have been inspected end-to-end; shared owner dependencies are cross-referenced. This does not mean every shared owner's global state matrix or browser behavior is complete.
- **PARTIAL** — route root/composition or account shell is recorded, but the page's complete styling/state/responsive ownership pass is not done.
- **NOT AUDITED** — appears in the route inventory only; no page-level ownership audit has been completed.

| Route group | Page | Route entry | Status | Evidence / remaining scope |
|---|---|---|---|---|
| Public | Home | app/(public)/page.tsx | DETAILED | Section 11.14; nested Home/TripList/TripCard ownership |
| Public | Trips | app/(public)/trips/page.tsx | DETAILED | Section 11.15; TripFilters/TripList/TripCard/Pagination |
| Public | Trip Details | app/(public)/trips/[id]/page.tsx | DETAILED | Section 11.19.B; nested map/images/social/comments/points |
| Public | Live Tracking | app/(public)/live-tracking/page.tsx | DETAILED | Section 11.20.B; moderator gate, live map, tracking controls, stats and browser-session state |
| Public | About | app/(public)/about/page.tsx | DETAILED | Section 11.20.C; WelcomeHeading, seven images, CSS Module, responsive image rows and SEO |
| Public | Privacy Policy | app/(public)/privacy-policy/page.tsx | DETAILED | Section 11.20.D; long-form terms/privacy sections, generated TOC, legal CSS and SEO |
| Account | Favorites | app/(account)/favorites/page.tsx | DETAILED | Section 11.22.B; query states, empty/error/loading branches, shared TripList and unresolved style identifiers |
| Account | My Trips | app/(account)/my-trips/page.tsx | DETAILED | Section 11.22.C; query states, empty/create action, shared TripList and unresolved style identifiers |
| Account | Profile | app/(account)/profile/page.tsx | DETAILED | Section 11.23.B; profile details/image upload, password expansion, validation and feedback states |
| Account | Edit Point | app/(account)/points/edit/[pointId]/page.tsx | DETAILED | Section 11.23.C; point load/permission, map/location, image deletion and shared PointForm states |
| Account | Edit Trip | app/(account)/trips/[id]/edit/page.tsx | DETAILED | Section 11.23.D; server trip/day resolution, owner gate, edit form, reorder, image upload/deletion and responsive grid |
| Account | Create Trip | app/(account)/trips/create/page.tsx | DETAILED | Section 11.23.E; create/append-day/add-point intents, retryable image uploads, map and form states |
| Account | Create Trip Point | app/(account)/trips/create/points/page.tsx | DETAILED | Section 11.23.F; query validation, point list/reorder/delete, map picker and PointForm workflow |
| Auth | Login | app/(auth)/login/page.tsx | DETAILED | Section 11.19.C; form, field, CAPTCHA and navigation states |
| Auth | Register | app/(auth)/register/page.tsx | DETAILED | Section 11.19.D; fields, password feedback, terms, CAPTCHA and redirect |
| Auth | Forgot Password | app/(auth)/forgot-password/page.tsx | DETAILED | Section 11.21.B; email/CAPTCHA form, generic success response, submit/reset/error states |
| Auth | Resend Verification | app/(auth)/resend-verification/page.tsx | DETAILED | Section 11.21.C; email/CAPTCHA form, generic success response, submit/reset/error states |
| Auth | Reset Password | app/(auth)/reset-password/page.tsx | DETAILED | Section 11.21.D; query token, password requirements, validation, success and redirect states |
| Auth | Verify Email | app/(auth)/verify-email/page.tsx | DETAILED | Section 11.21.E; query token, automatic verification, loading/success/error and redirect states |
| Admin | Admin landing | app/(admin)/admin/page.tsx | DETAILED | Section 11.24.B; bare heading route, AdminNavigation supplied by role-gated layout; Dashboard component is not composed here |
| Admin | Users | app/(admin)/admin/users/page.tsx | DETAILED | Section 11.24.C; role-filtered cards, profile-image preview, deletion, pagination and query states |
| Admin | Edit User | app/(admin)/admin/users/[userId]/page.tsx | DETAILED | Section 11.24.D; target lookup, role-scoped fields, optional password change, image CRUD, update/delete confirmation and feedback |
| Admin | Images | app/(admin)/admin/images/page.tsx | DETAILED | Section 11.24.E; cloud/database/orphan/missing-thumbnail tabs, bounded selection, thumbnail generation and preview dialog |
| Admin | Failed Login Logs | app/(admin)/admin/failed-login-logs/page.tsx | DETAILED | Section 11.24.F; multi-select bulk deletion, confirmation, table/query states and pagination |
| Admin | Reports | app/(admin)/admin/reports/page.tsx | DETAILED | Section 11.24.G; per-report deletion confirmation, mutation/query feedback and pagination |
| Admin | Route Not Found Logs | app/(admin)/admin/route-not-found-logs/page.tsx | DETAILED | Section 11.24.H; expandable request diagnostics, query states and pagination |
| System | Not Found / 404 | app/not-found.tsx | DETAILED | Section 11.25; global 404 composition, countdown/redirect, CSS Module, direct consumers, RequireRole privacy fallback and route-level notFound() call sites |

**Verified coverage count:**
- 27 route roots total.
- 27 DETAILED: all 6 Public pages, all 6 Auth pages, all 7 Account pages, all 7 Admin pages and the System Not Found / 404 route.
- 0 PARTIAL.
- 0 NOT AUDITED.
- These counts describe route-page audit coverage only. They do not change the 163/163 candidate file inventory count and do not mean Stage 1 is complete.

### G. Next page-audit sequence

1. Remaining Account pages — deepen all seven PARTIAL routes from root-level coverage into page-level style/state/responsive audits.
2. Admin pages — Admin landing, Users, Edit User, Images, Failed Login Logs, Reports and Route Not Found Logs; trace AdminNavigation and shared table/action/dialog/image owners.
3. Not Found — route shell plus NotFound.module.css and authorization fallback contexts.

### H. Batch result

- Added detailed page-level audits for Trip Details, Login and Register.
- Added a route-page coverage matrix for all 27 route roots from the route graph.
- Coverage is now 5 DETAILED, 7 PARTIAL and 15 NOT AUDITED.
- The previously mapped shared owners are cross-referenced rather than duplicated. Section 10.1 remains the file-level ledger; this section is the route-page coverage ledger.
- Stage 1 remains IN PROGRESS. No app source changes were made, no branch was created, and no build/tests/lint/CI/browser validation was run.

No application source code was changed. No branch was created. No build, tests, lint, CI or browser validation was run.


## 11.20 — Live Tracking, About and Privacy Policy page audits (2026-11-18)

### A. Preflight and scope

- Re-read Sections 1.4, 2, 6, 7, 9 and 10.1, the design-system dependency map, route graph, previous page audits and the exact NEXT TASK before this batch.
- Verified branch feature/frontend-modernization exists and fetched all implementation files below using that exact branch ref.
- Audit document blob SHA before this batch: 05aef18b7714a5879e46b181431ed96f9e391b4a.
- Previous audit commit: ebcf74e0120e27c4df4b9f5c2504188067543263.
- Scope: three route-page ownership audits — Live Tracking, About and Privacy Policy. No application source migration, no new branch and no build/tests/lint/CI/browser validation.

### B. Live Tracking — /live-tracking

**Route and access composition**

- Route root: app/(public)/live-tracking/page.tsx.
- Shell: public layout → shared Header → flex-fill content wrapper → route → shared Footer.
- Route metadata sets title "Live trip tracking" and robots NOINDEX; no public SEO indexing is intended.
- The route is wrapped in RequireModeratorRedirect. The guard reads auth status/user, allows only authenticated moderators, renders null while auth is loading or access is denied, and redirects unauthorized users to / in an effect. The public Header/Footer remain outside the guard.
- The route root owns a main with style={{ padding: ROUTE_CONTENT_PADDING }}, then a plain section, h1, intro paragraph and LiveTracker. This React style is a direct Section 1.4 migration target; the section currently has no dedicated CSS Module or named page-shell preset.

**Composition and runtime state**

PublicLayout → Header → flex-fill wrapper → LiveTrackingPage → RequireModeratorRedirect → main/section/heading/intro → LiveTracker → Google Map + route Polyline + current Marker; Start/Stop/Reset/Center actions; tracking status; eight GPS/session statistics → Footer.

- LiveTracker uses the shared useGoogleMapsLoader entry point, but renders GoogleMap, MarkerF and PolylineF directly rather than using the app's GoogleMapView wrapper. This is a distinct implementation path: the live page needs current-location follow behavior and route stroke options. Do not replace it with GoogleMapView without comparing required behavior and map options.
- The map frame is 100% width × MAP_CONTAINER_HEIGHT (400px). It has overflow hidden and a local TRACKING_SURFACE_SX (divider border, radius 1). Loading uses a centered grid Box and CircularProgress size 28.
- The route polyline uses UI_COLORS.brand.primary, opacity 0.9 and weight 4; the current location uses a Google Maps marker. Google Maps owns the map canvas and built-in map controls; app-owned actions/stats remain in React/MUI.
- Follow starts true. Dragging the map sets follow false; Center on my location sets it true and is disabled when no current point exists or follow is already active. The effect pans to current coordinates whenever follow/current changes.
- The stats grid has eight entries: elapsed duration, distance, recorded point count, GPS timestamp, latitude, longitude, speed and altitude. Layout is two columns at xs and four at sm. Each stat cell repeats the same local surface contract and padding.
- Start/Stop is a conditional contained MUI Button; Reset and Center are default text Buttons. Reset is disabled when there are no points and tracking is inactive. The live status uses Typography role=status. Tracking errors render a warning Alert.
- The footer note states tracking data stays in the browser session and is never uploaded.

**Hook behavior to preserve**

- useLiveTracking owns points/current/tracking/error/start time/elapsed clock. It requests browser geolocation with high accuracy, 10-second timeout and no cached position.
- Current position updates on each GPS event; a route point is appended only when movement from the last recorded point is at least 5 metres. Distance is calculated from recorded points.
- Start begins watchPosition, starts elapsed timing once and attempts a screen Wake Lock when supported. Stop clears the geolocation watch and releases Wake Lock. Reset stops tracking and clears points/current/start time/error.
- While tracking, a one-second interval updates elapsed time. Unmount clears the geolocation watch and releases Wake Lock. Wake Lock failure is silently tolerated.
- Geolocation permission denied, unavailable, timeout and unsupported-browser paths are represented as warning messages. Preserve these state distinctions in any later visual migration.

**Style ownership and outstanding targets**

- Local TRACKING_SURFACE_SX is reused for both the map frame and each statistic cell, but the shared design system should own the semantic surface role. The map frame and statistic cells may retain different geometry/padding.
- The stats grid's responsive two/four-column structure is unique composition; its gap, cell padding, border/radius and text hierarchy should consume shared tokens/presets.
- Start, Stop, Reset and Center on my location are four distinct semantic actions. Start/Stop are state-switched controls; Reset is destructive session reset; Center is a map navigation/focus action. Do not map all four to generic primary/secondary.
- Loading, warning/error, active/stopped status, disabled state and live statistic updates need explicit shared feedback/action state contracts.
- The route has no page-specific CSS Module. The main padding is an inline React style. LiveTracker uses local sx objects for map/stat layout and repeated surface styling.
- The route's use of GoogleMap directly is not a second SDK loader: useGoogleMapsLoader remains the single shared SDK loading boundary.

### C. About — /about

**Route and SEO**

- Route root: app/(public)/about/page.tsx; public layout supplies shared Header/Footer and the flex-fill wrapper.
- Metadata is built with buildSeoMetadata, canonical path /about, a page-specific title/description and no explicit NOINDEX override. This is an indexable public page.
- The page renders main.aboutPage, then shared WelcomeHeading, then article.aboutPageContent. The article contains six semantic content sections, a final heading/contact paragraph and seven images in total.
- The page has no page-local client state. The only interactive behavior comes from shared WelcomeHeading/ScrambleHeading: touch anywhere in the WelcomeHeading content can re-trigger the heading scramble; reduced-motion preference suppresses the animation.

**Composition and image ownership**

PublicLayout → Header → flex-fill wrapper → AboutPage → main.aboutPage → WelcomeHeading → responsive/scramble h1 → article.aboutPageContent → six content sections, seven Next/Image instances and two aboutPageImageRow compositions → Footer.

- The first image is the local OG illustration /og/hacktrip-travel-planner.svg, rendered at 1200×630, priority/high fetch priority, with a page-local max-width override of 760px.
- The other six images are remote GCS assets. Their width/height/sizes are taken from IMAGE_PRESETS.aboutIllustration (640×480; sizes switch at 820px). They share the page-local imageStyle object and are laid out either singly or in two-image rows.
- The local imageStyle object sets block display, 100% width, auto height, max-width 640px by default, 20px vertical margin, 12px padding, border-box and object-fit contain. Call sites override max-width to 760px or 520px where needed. All seven images use the prohibited React style presentation API; the object is a page-local image preset and should be migrated to the approved image/frame contract.
- The About illustration preset currently supplies intrinsic width/height/sizes only; it does not own the page's visible max-width, margin, padding or responsive row frame. Keep optimization hints separate from the visual frame contract.

**CSS Module and typography ownership**

- AboutPage.module.css owns centered flex page structure, 100% width, min-height 100vh and public page gutters. It consumes --ht-page-content-padding, --ht-page-mobile-content-padding, --ht-spacing-lg and --ht-spacing-xs for selected spacing.
- aboutPageContent owns the 1100px max-width, centered text, inverse text color and decorative text shadow. The headings inside the article use local Space Mono font, weight 600 and clamp-based h2/h3 sizing; h3 line-height is 1.6. Links inherit text color and are underlined.
- The image row is a unique two-column flex composition with a shared gap; at max-width 820px it stacks vertically, centers children and constrains images to 640px. This is valid page-specific responsive structure.
- The CSS Module's aboutPageContent h1 rule does not style the WelcomeHeading h1 because that heading is rendered by WelcomeHeading before the article, as a sibling rather than a descendant. The actual h1 remains owned by HOME_HEADING_STYLE/ScrambleHeading. Keep this selector mismatch visible for migration; do not assume the page module controls the top heading.
- The 820px breakpoint is repeated in the CSS Module and the about image sizes string; no named 820px breakpoint token currently exists in the inspected breakpoint constants.
- WelcomeHeading and ScrambleHeading are shared with Home, Trips and Auth pages and are already audited in Sections 11.14–11.15 and 11.19. Their React style usage and animation behavior belong to the shared heading owner, not a new About-only component.

**About outstanding migration targets**

1. Replace all seven React style image presentations with an approved shared image/frame contract; preserve source dimensions, object-fit, priority, sizes and page-specific frame widths.
2. Tokenize Space Mono/heading typography, clamp scale, line-height, margins and text shadow; preserve page copy hierarchy.
3. Reconcile the unused aboutPageContent h1 selector with the actual WelcomeHeading ownership.
4. Add/reuse a named 820px responsive threshold only if the full responsive audit confirms this value is a shared role; otherwise document it as page/image composition geometry.
5. Keep the image row stacking and 1100px content width as unique structure unless another page uses the same composition.
6. Preserve the SEO canonical/indexability and all image alt text/priority behavior during migration.

### D. Privacy Policy — /privacy-policy

**Route and SEO**

- Route root: app/(public)/privacy-policy/page.tsx; public layout supplies Header/Footer and the flex-fill wrapper.
- Metadata is built with buildSeoMetadata, canonical path /privacy-policy, page-specific title/description and no NOINDEX override. This is an indexable public page.
- The route is a server-rendered static document with no client component, no local React state, no MUI controls, no React style prop and no inline sx.
- Content is data-driven through terms and privacySections arrays. The Terms of Use section has a generated table of contents with native fragment anchors; the top navigation links to the Terms and Privacy Policy sections. Privacy sections render h3 headings, paragraphs and optional bullet lists.
- The page includes an external hack-trip.com link, a contact mailto link and a native anchor back to /. The legal content includes a hard-coded last-updated date of 24.03.2023; content/legal review is outside this CSS audit and must not be changed as a styling cleanup.

**CSS Module ownership**

- LegalPage.module.css owns a centered long-form document: full-width/min-height shell, 1000px content max-width, responsive content padding via clamp, long-word wrapping, centered h1/h2, scroll-margin-top for h2/h3, paragraph/list typography, intro navigation, terms TOC, contact spacing and Back-link skin.
- Page/content background and text colors, legal link color, TOC border and radius, and Back-link background/text colors consume --ht-* CSS variables.
- Remaining local visual values include shell padding (24px 16px 48px), content max-width 1000px, clamp content padding (18px–42px), heading margins, 90px anchor scroll offsets, paragraph/list 1rem and 1.75 line-height, intro nav 1.2rem/600 weight, 10px gap, local margins/padding, and Back-link padding 10px 24px.
- There is no page-specific media query; the content padding is fluid via clamp and the document naturally wraps. Do not mistake absence of a media query for a missing responsive layout.
- The native legalPageBack anchor is the page's Back action. It preserves link navigation and should align with the shared Back semantic role, but it is not the BackButton React component. Its hover only changes text color to inverse; background hover behavior is not separately defined.
- The legal page's content surface is intentionally a document surface, not a standard Card/Paper. Do not replace it with a generic card skin.

**Privacy Policy outstanding migration targets**

1. Tokenize recurring document typography, spacing and link/button values while retaining unique long-form document geometry.
2. Align the native Back link with the shared Back visual contract while preserving its anchor semantics and destination.
3. Review the 90px fragment scroll offset against the shared sticky Header dimensions; preserve anchor visibility.
4. Preserve generated TOC IDs, native fragment navigation, external/contact links, content ordering and server rendering.
5. Keep legal content/date changes outside the design-system migration scope.

### E. Shared ownership and cross-page reconciliation

- Shared public shell owners: Header, Footer and app/(public)/layout.tsx. Header navigation/auth states and responsive drawer are already described in Section 11.17; Footer's CSS Module and iOS landscape scroll behavior are cross-page shell behavior. The public layout's React style={{ flex: 1 }} is a shared shell migration target for every public page.
- Shared heading owners: WelcomeHeading and ScrambleHeading. About is an additional consumer of the same heading contract; do not create an About-only heading skin.
- Shared map SDK owner: useGoogleMapsLoader. LiveTracker uses the same loader but not GoogleMapView. The tracking map renderer is therefore a separate consumer of the SDK, not a separate loader.
- Shared token owners: UI_COLORS.brand.primary, ROUTE_CONTENT_PADDING, MAP_CONTAINER_HEIGHT, MAP_TRACKING_ZOOM, MAP_DEFAULT_CENTER, GEOLOCATION_OPTIONS, IMAGE_PRESETS.aboutIllustration and CSS variables emitted by the MUI theme.
- No new shared component owner was introduced. The page audits add route-specific context to already inventoried files and existing shared dependencies.

### F. Refreshed route-page coverage matrix

The 27 route roots remain the same. Status counts now reflect Sections 11.14–11.16 and 11.19–11.20:

- **8 DETAILED:** Home, Trips, Trip Details, Live Tracking, About, Privacy Policy, Login, Register.
- **7 PARTIAL:** Favorites, My Trips, Profile, Edit Point, Edit Trip, Create Trip, Create Trip Point.
- **12 NOT AUDITED:** Forgot Password, Resend Verification, Reset Password, Verify Email, Admin landing, Users, Edit User, Images, Failed Login Logs, Reports, Route Not Found Logs and Not Found/404.

The route matrix in Section 11.19.F is the page-level status source of truth. File-level candidate inventory coverage (163/163) remains a separate metric. Stage 1 is still IN PROGRESS.

### G. Exact branch-ref source evidence

- app/(public)/live-tracking/page.tsx — 7eaf11ecfa6e8b8baf6585720214fa42bbfb8d26
- src/components/tracking/LiveTracker.tsx — eb353d870c36f51ff9e1daf2373ac4ec289ec3d7
- src/hooks/useLiveTracking.ts — e446cd1099ef06f77e05b162e4f0fb6cee77aae9
- src/hooks/useGoogleMapsLoader.ts — c104f40436828e2fdb1fd37962427f44e29d1858
- src/constants/maps/index.ts — 077e28c9452823e36b9cf5f81ecf81971758386f
- src/components/auth/RequireModeratorRedirect.tsx — 2cc26aa0ff3379adb39204439b86825dd0d11407
- app/(public)/about/page.tsx — 5bd6e5f5fa54d180ffd373177b8718482dccaab2
- app/(public)/about/AboutPage.module.css — 609bc668af08d4d029844cbcf0debdfbbd3513fe
- app/(public)/privacy-policy/page.tsx — 8ff442e740a531f8ff86fe609a7261fcbfdd5a90
- app/(public)/privacy-policy/LegalPage.module.css — 066738729d55c0e8e4898188e36a6f301186dde8
- app/(public)/layout.tsx — de747f2fb78157660255e23047ea0347b3d80975
- src/components/layout/Header.tsx — 1e36e6434c250f1b4f0b825d7d16304dd0583947
- src/components/layout/Footer.tsx — 88c0b2c7ee9f38c33b8d37a0f1ebe3b27231b6f2
- src/components/layout/Footer.module.css — a2409cadb62f9576085b99a404717d3ee2ce38bc
- src/components/common/WelcomeHeading.tsx — 179e7f685e3ca595fbed60c3447702c036b56ec1
- src/components/common/ScrambleHeading.tsx — 6fbea0138e6eff5d6fd822171a93a94dfe0f3a69
- src/constants/ui/spacing.ts — 9e62ad85eeec73359723643861eb8d2eba8057d1
- src/constants/ui/breakpoints.ts — 9fb27ac76908e485970975bf4a714c581d822315
- src/constants/ui/colors.ts — dce2b3d898c07cb7ba1b61a8ecf9608121ea8763
- src/constants/images/presets.ts — 4d3ea1fe0a0eb9f137983542c99a43200e55cf2f
- src/styles/presets/layouts.ts — 4a0aec24e5feecf1ffaeadaf75ade4291658f820
- src/styles/presets/typography.ts — 59803882f1c4357e8815f3afdc7c53939d14bacb
- app/globals.css — 6c89565f0c9ca041f74f9e4b8b9b54c273977289
- src/theme/index.ts — 2bbf22fb89a8a99269d19348c59270ac97cd5178

### H. Batch result and next task

- Added detailed page-level audits for Live Tracking, About and Privacy Policy.
- Updated the Section 11.19.F route matrix from 5 to 8 DETAILED pages and from 15 to 12 NOT AUDITED pages; the seven Account pages remain PARTIAL.
- No new candidate ledger paths were added. The existing 163/163 file inventory remains unchanged; supporting map constants and hooks are cited as dependencies.
- No application source code changed. No branch was created. No build, tests, lint, CI or browser validation was run.
- Stage 1 remains IN PROGRESS.

No application source code was changed. No branch was created. No build, tests, lint, CI or browser validation was run.


## 11.21 — Remaining Auth route family audit (2026-11-18)

### A. Scope and preflight

- Re-read the audit architecture, Styling API policy (Section 1.4), six-stage plan, Section 7 inventory, Section 10.1 file ledger, route matrix (Section 11.19.F), shared-owner audits (Sections 11.14–11.20) and current NEXT TASK.
- Verified the current branch ref: feature/frontend-modernization. Audit document SHA before this batch: 23564a1f5f09fd3c63cb16efbda49e2186aca20b.
- Audited all four remaining Auth routes and their page/form/shared dependencies against the exact branch ref. Existing Login/Register audits were used as shared-owner references, not repeated.
- The four routes are intentionally small wrappers; the substantive work is in their form components and shared Auth shell, so the audit follows those dependencies end-to-end.
- No application source changes, no branch creation, and no build/tests/lint/CI/browser validation.

### B. Forgot Password — /forgot-password

**Composition**
- Route root app/(auth)/forgot-password/page.tsx sets title "Forgot password", NOINDEX and renders ForgotPasswordForm.
- Auth layout wraps every Auth route with shared Header/Footer, a centered main element, a 480px maximum-width inner wrapper and GuestOnly. GuestOnly renders null while auth is loading or when already authenticated, then redirects authenticated users to /. It does not add a loading indicator.
- ForgotPasswordForm → WelcomeHeading → AUTH_FORM_SX form panel → title → email TextField → hidden CAPTCHA form value → Captcha → primary submit Button → BackButton to /login.

**Behavior and state**
- React Hook Form uses forgotPasswordSchema and defaults email/captchaToken to empty strings. Email errors appear only after submit; helper text reserves a blank line before submission and when no error exists.
- CAPTCHA token is held both in local component state and form state. Submit is disabled while submitting or while no CAPTCHA token exists. Captcha itself is disabled while submitting.
- Submission calls authApi.forgotPassword with email and CAPTCHA token. Both success and failure use the global NotificationProvider; success uses the deliberately generic FORGOT_PASSWORD_SUCCESS_MESSAGE ("If an account exists for this email...") to avoid revealing account existence.
- Finally always clears submitting, clears the CAPTCHA token in local/form state and increments resetKey so the CAPTCHA widget resets. The email TextField itself is not disabled while submitting.
- BackButton is disabled while submitting and navigates to /login.

**Styling**
- No route-specific CSS Module or route-local style/sx. Shared AUTH_FORM_SX owns panel/surface and stack layout; AUTH_FORM_TITLE_SX owns title; AUTH_FORM_BACK_ACTION_SX owns the Back row; BUTTON_STYLES.primary and BackButton/BUTTON_STYLES.back own actions.
- Email TextField uses MUI defaults and the global MuiTextField outlined/medium defaults; field visual defaults are centralized in theme/components/text-field.ts, but no additional Auth-only field variant is applied.
- The shared auth layout's React style object (centered main with ROUTE_CONTENT_PADDING and flex:1) and 480px wrapper width are shared migration targets, not Forgot Password-specific styles.
- AUTH_FORM_SX declares maxWidth 700px, but the Auth layout's 480px wrapper is the effective outer cap on this route and all other Auth pages.

### C. Resend Verification — /resend-verification

**Composition and behavior**
- Route root app/(auth)/resend-verification/page.tsx sets title "Resend verification", NOINDEX and renders ResendVerificationForm inside the same Auth layout/GuestOnly boundary.
- Composition matches Forgot Password: WelcomeHeading → AUTH_FORM_SX → title → email TextField → hidden CAPTCHA value → Captcha → primary submit → BackButton to /login.
- Uses resendVerificationSchema, email/captcha defaults, submit-only email error display and reserved helper-text line.
- Submission calls authApi.resendVerification. Success message is deliberately generic ("If an account exists and needs verification...") to avoid account enumeration; errors use getGenericErrorMessage and NotificationProvider.
- The submit button is disabled while submitting or without a CAPTCHA token. Captcha is disabled while submitting; the email TextField remains enabled. Finally clears token/form state and resets the CAPTCHA widget, whether the request succeeds or fails.
- BackButton is disabled while submitting.

**Styling and reuse**
- No route-specific CSS Module, React style or local sx object. It uses exactly the same AUTH_FORM_SX, AUTH_FORM_TITLE_SX, AUTH_FORM_BACK_ACTION_SX, BUTTON_STYLES.primary, BackButton and shared Auth layout as Forgot Password.
- These are two page consumers of one shared auth-form contract, not two independent form styles. Future redesign should update the semantic auth form and field/action contracts once.

### D. Reset Password — /reset-password

**Route and token handling**
- Route root app/(auth)/reset-password/page.tsx is an async server page. It awaits searchParams, accepts token only when query parameter token is a string, otherwise passes undefined; page metadata is NOINDEX.
- The form receives optional token. A missing token is not rejected at the route root; on submit it emits "Missing reset token." and returns without calling the API.
- Auth layout/GuestOnly behavior is shared with the other Auth routes.

**Form behavior**
- ResetPasswordForm uses resetPasswordSchema.pick({ password: true }) with React Hook Form mode/reValidateMode onChange. The API layer separately validates the full token+password request through resetPasswordSchema.
- PasswordField is the shared common component, with visibility toggle, new-password autocomplete, disabled state while submitting, max length 72, and caller-owned error/helper text.
- PasswordRequirements updates live from watched password; it uses shared password requirement logic and a local responsive one/two-column list layout.
- Submit is disabled while submitting or until the password form is valid. The missing-token guard is in the submit handler. A valid request calls authApi.resetPassword({token,password}).
- API errors are mapped with getTokenErrorMessage to the global error notification. Success shows a success notification and switches to a success panel with a Go to login action; an effect redirects to /login after AUTH_SUCCESS_REDIRECT_DELAY_MS. The redirect timer is cleaned up on unmount.
- The BackButton to /login is disabled while submitting. The success panel uses a contained Button without an explicit BUTTON_STYLES preset; this is a semantic action styling gap to reconcile with the shared navigation/action role.

**Styling**
- Form and success panel use AUTH_FORM_SX; title uses AUTH_FORM_TITLE_SX; back row uses AUTH_FORM_BACK_ACTION_SX; submit uses BUTTON_STYLES.primary.
- PasswordField and PasswordRequirements are shared with Register and Change Password / Admin user form consumers as mapped in Sections 11.17–11.18. Their internals are not re-audited here.
- No page-specific CSS Module or React style. Layout uses shared sx presets, but the success panel's Go to login Button has only variant=contained and no named semantic preset.

### E. Verify Email — /verify-email

**Route and token handling**
- Route root app/(auth)/verify-email/page.tsx awaits searchParams and passes token only if query parameter token is a string. Metadata is NOINDEX.
- VerifyEmailForm starts in idle state. Its effect sets error and notifies when token is missing; otherwise it changes to loading and calls authApi.verifyEmail automatically without requiring a button click.
- On success it sets success, shows LOGIN_EMAIL_VERIFIED_MESSAGE for AUTH_SUCCESS_REDIRECT_DELAY_MS, publishes the email-verified tab event (consumed by LoginForm's BroadcastChannel listener) and schedules router.replace('/login').
- On failure it sets error and shows getTokenErrorMessage. Cleanup marks the request cancelled and clears any scheduled redirect timer.
- The visible card shows a CircularProgress while loading. For both success and error it renders a Go to login button. The success/error message itself is delivered through the global notification; the card does not render distinct visible success/error text. Idle state renders neither spinner nor action.
- The status state is a four-way union idle/loading/success/error. Preserve all four states and the automatic request/redirect behavior during any visual migration.

**Styling**
- The page has no route-specific CSS Module or React style. VerifyEmailForm owns a Card with a local sx object: COLUMN_STACK_SX plus centered alignment, width 100%, maxWidth 560, box sizing, auto horizontal margins, responsive padding xs=3/sm=4 and centered text.
- Card heading uses a local inline sx fontWeight 700. Go to login uses BUTTON_STYLES.primary. Loading CircularProgress uses default MUI size.
- Card surface itself is theme-owned through MuiCard, but local width, spacing, alignment and typography remain in the component. The Auth layout's 480px wrapper constrains the 560px Card max width in the actual route composition.

### F. Shared Auth ownership and cross-page findings

- Auth shell: app/(auth)/layout.tsx → Header → main → 480px wrapper → GuestOnly → route form → Footer. The main uses a React style object and wrapper uses a literal maxWidth 480; this is a shared shell migration target for all six Auth routes.
- GuestOnly owns the auth access/redirect gate and loading suppression. It renders no spinner/skeleton while auth status is loading.
- WelcomeHeading/ScrambleHeading are shared across Home, Trips, About and Auth. Their React style presentation, touch-triggered scramble and reduced-motion behavior are documented in Sections 11.14, 11.15 and 11.20; do not create Auth-specific heading styles.
- Shared form contracts: AUTH_FORM_SX, AUTH_FORM_TITLE_SX, AUTH_FORM_BACK_ACTION_SX, AUTH_FORM_ACTIONS_SX and PANEL_SX. AUTH_FORM_SX maxWidth 700 does not exceed the 480px Auth layout wrapper in practice.
- Shared field owners: MuiTextField theme defaults, PasswordField, PasswordRequirements and Captcha. Captcha uses a fixed 78px minimum-height row, centered content and disabled opacity/pointer-events in local sx; missing site key renders a role=alert message.
- Shared action owners: BUTTON_STYLES.primary, BackButton/BUTTON_STYLES.back, and unstyled contained navigation buttons in Reset Password and Verify Email success states. Those success navigation actions should be mapped to the shared semantic navigation action contract in a later migration.
- Feedback: NotificationProvider owns global Snackbar/Alert severity, position, duration and close behavior. Auth form success/error content is toast-driven; avoid adding duplicate page-local feedback without a design decision.
- Validation: src/validations/auth/index.ts owns email, opaque token, password and CAPTCHA constraints. src/api/auth/index.ts reparses request payloads before posting. Route pages only extract query tokens; no API or business logic was changed.
- All four pages are NOINDEX. They should remain excluded from public SEO indexing.

### G. Cross-route coverage and shared semantic roles

| Shared owner / contract | Consumers in this batch | Existing audited consumers |
|---|---|---|
| Auth layout + GuestOnly | All four routes | Login, Register |
| WelcomeHeading + ScrambleHeading | All four routes | Home, Trips, About, Login, Register |
| AUTH_FORM_SX + AUTH_FORM_TITLE_SX | Forgot, Resend, Reset | Login, Register |
| AUTH_FORM_BACK_ACTION_SX + BackButton | Forgot, Resend, Reset | Existing Account forms and other Auth routes |
| Captcha | Forgot, Resend | Login, Register |
| PasswordField + PasswordRequirements | Reset | Register, ChangePasswordForm, AdminUserForm |
| NotificationProvider | All four routes | Global app shell and other feature flows |
| MuiCard / MuiTextField defaults | Verify card / email fields | Other app routes |
| BUTTON_STYLES.primary | All four routes | Login, Register and feature actions |

- No new shared component owner is introduced by these pages. The important new dependency is the common Auth layout wrapper, which constrains all six Auth pages and should be treated as one shell owner.
- Two generic contained "Go to login" success buttons do not use a named navigation preset (Reset Password and Verify Email). Record this as an action-role migration target; do not change behavior or semantics during audit.

### H. Updated page coverage

- Route roots: 27 total.
- **14 DETAILED:** Home, Trips, Trip Details, Live Tracking, About, Privacy Policy, Login, Register, Forgot Password, Resend Verification, Reset Password, Verify Email, Favorites and My Trips.
- **5 PARTIAL:** Profile, Edit Point, Edit Trip, Create Trip and Create Trip Point.
- **8 NOT AUDITED:** seven Admin routes and Not Found/404.
- The four Auth route roots and their form owners are now detailed. The seven Account routes remain PARTIAL because their full page-specific style/state/responsive ownership is not yet exhaustive.
- The 163/163 candidate file inventory count remains a separate metric; route-page coverage does not complete Stage 1.

### I. Exact branch-ref source evidence

- app/(auth)/forgot-password/page.tsx — 0b486fecfcd00bbdc585defbacb7e6a0475dd812
- app/(auth)/resend-verification/page.tsx — 39dc17bf3d137886e68548cf17370d539bfa8e21
- app/(auth)/reset-password/page.tsx — c791efe2589b1d7d6967634e2cf1b19830a8d92e
- app/(auth)/verify-email/page.tsx — 0ae305c18851da9c567e769c53ec478713925e28
- app/(auth)/layout.tsx — d82e17e9c7594f8a868d6a25362aaa77ff6fef6f
- src/components/auth/GuestOnly.tsx — 90d052eb5fd3f1af2dfa4e513dac2905e5cbe0f9
- src/components/auth/ForgotPasswordForm.tsx — 8b28ade0165a4f9dcf513b95cea6ed112f232ace
- src/components/auth/ResendVerificationForm.tsx — 4991d43c588ecf13b1555845e1b946c61973df25
- src/components/auth/ResetPasswordForm.tsx — e324344b05a9cc6de17afaebece7cf7a91c3ee25
- src/components/auth/VerifyEmailForm.tsx — c1a2767840094c760e05971956d330a699b1a4c8
- src/components/auth/Captcha.tsx — 6b174cb68ae038d540214da1c8383d4773660d48
- src/components/common/PasswordField.tsx — b6488512ec4e31d555512724f61c55e73f28e61f
- src/components/common/PasswordRequirements.tsx — ab814670e8ceba3c3257ed21bdf3425ca6e12cdf
- src/components/common/WelcomeHeading.tsx — 179e7f685e3ca595fbed60c3447702c036b56ec1
- src/components/common/BackButton.tsx — 1f78b4e652c6a3c0dd648e9166fdd9d9cf1bea95
- src/components/common/NotificationProvider.tsx — 3a81f51a9e43fb78c498e75c4c0055ad04572dc5
- src/styles/presets/forms.ts — b1de15957049dc1e583bbe3201135bb2b66b490b
- src/styles/presets/buttons.ts — 2110bcf2a41d8ca81375682ebb9bb8ed88f48a2e
- src/styles/presets/panels.ts — c9474242c747e8248e930f56a8c5c0f26089bb2c
- src/constants/notifications.ts — 571f1ffc95ed8cd25ebe3fca4cb08d4cf6482c21
- src/constants/ui/sizes.ts — 69e9fdeefc9ce4968e2a6c98a72b80a6f060d444
- src/constants/ui/spacing.ts — 9e62ad85eeec73359723643861eb8d2eba8057d1
- src/validations/auth/index.ts — 241a60fa42a4fc43c7b28f8f94d91d3601691812
- src/api/auth/index.ts — 65de00aeddcf8184fc0606741a3139356faf6547
- src/theme/index.ts — 2bbf22fb89a8a99269d19348c59270ac97cd5178
- src/theme/components/text-field.ts — 4e3ed7529c7f5c219dbe0d05f4f74da0cdca84fa

### J. Batch result and next task

- Added detailed audits for all four remaining Auth routes, including the shared Auth shell and form dependencies.
- Updated Section 11.19.F from 8 to 12 DETAILED and from 12 to 8 NOT AUDITED; the seven Account routes remain PARTIAL.
- No application source code changed. No branch was created. No build, tests, lint, CI or browser validation was run.
- Stage 1 remains IN PROGRESS.


## 11.22 — Favorites and My Trips account page audits (2026-11-18)

### A. Preflight and scope

- Re-read the architecture, Styling API policy (Section 1.4), six-stage plan, Section 7 inventory, Section 10.1 file ledger, route coverage matrix (Section 11.19.F), and latest page audits including Sections 11.20–11.21.
- Verified repository branch ref: feature/frontend-modernization. Audit document SHA before this batch: 8a617db09e4c6cfbcf5b18efd374341c9b2aba5e.
- Scope: Favorites and My Trips route roots, Account shell, query-driven page states, shared TripList/TripCard contracts, and their shared layout/style presets.
- The two route roots are short, but both consume the same list and visual contracts. Shared owners already deeply audited in Sections 11.14–11.19 are cross-referenced rather than duplicated.
- No application source changes, no branch creation, and no build/tests/lint/CI/browser validation.

### B. Favorites — /favorites

**Composition and data states**
- Route root: app/(account)/favorites/page.tsx, client component.
- Account shell: RequireAuth → Header → main with shared ROUTE_CONTENT_PADDING and flex fill → route → Footer. Account layout metadata is NOINDEX.
- React Query uses query key ['me','favorites'] and tripApi.listMyFavorites(). The result is normalized with data ?? [].
- Render precedence: loading → error → empty favorites → TripList. Loading uses CircularProgress size 32 with an accessible label; error uses MUI Alert severity=error and getGenericErrorMessage; empty state uses a heading; populated state delegates to shared TripList.
- There is no explicit retry action, refetch control, pagination or route-local mutation. Query behavior/retry defaults are React Query-owned and not customized in this route.
- The page has no local state, effects or responsive breakpoint logic.

**Styling ownership**
- Root Box section, Container, heading, empty-state Box and error Alert use MUI sx; there is no route CSS Module or React style prop.
- Intended shared layout owners are ACCOUNT_TRIPS_PAGE_SX, ACCOUNT_TRIPS_CONTENT_SX, ACCOUNT_TRIPS_HEADING_SX and ACCOUNT_TRIPS_EMPTY_STATE_SX from src/styles/presets/layouts.ts. Those presets centralize full-width page shell, centered vertical content, responsive vertical padding, heading alignment/spacing/typography and centered empty-state layout.
- The loading spinner has route-local my=4; the error Alert has route-local width 100% and maxWidth 560. These are local visual values to reconcile with shared loading/feedback and content-width contracts in a later migration.
- Empty-state Typography intends to use shared headingTextStyle from src/styles/presets/typography.ts, but the symbol is not imported in this route.
- Critical source consistency finding: the route imports the four ACCOUNT_TRIPS_* identifiers but JSX references PAGE_SX, CONTENT_SX, HEADING_SX and EMPTY_STATE_SX. No declarations for those names exist in the fetched file. This is an unresolved identifier/import mismatch and likely causes TypeScript compilation failure. The route also references headingTextStyle without importing it. Documented only; no source correction performed.

### C. My Trips — /my-trips

**Composition and data states**
- Route root: app/(account)/my-trips/page.tsx, client component.
- Uses the same Account shell and NOINDEX metadata as Favorites.
- React Query key is ['me','trips']; query function is tripApi.listMyTrips(); result is normalized with data ?? [].
- Render precedence matches Favorites: loading CircularProgress → error Alert with getGenericErrorMessage → empty state → shared TripList.
- Empty state includes a Create Trip action linking to /trips/create. It uses MUI Button, Next Link, variant=contained and BUTTON_STYLES.createTrip.
- There is no explicit retry, refetch, pagination or local state. No responsive breakpoint logic is defined in the route.
- Unlike Favorites, My Trips has a distinct empty-state call to action; preserve this behavior when consolidating the two page layouts.

**Styling ownership**
- Uses the same intended ACCOUNT_TRIPS_PAGE_SX, ACCOUNT_TRIPS_CONTENT_SX, ACCOUNT_TRIPS_HEADING_SX and ACCOUNT_TRIPS_EMPTY_STATE_SX presets as Favorites.
- The Create Trip action is already connected to the named BUTTON_STYLES.createTrip contract. Its color/hover treatment is token-backed through UI_COLORS and spacing through UI_SPACING.
- Loading margin my=4, Alert width/maxWidth, and empty-state heading usage are still route-local or unresolved, as on Favorites.
- Critical source consistency finding: imports ACCOUNT_TRIPS_* identifiers but references PAGE_SX, CONTENT_SX, HEADING_SX and EMPTY_STATE_SX in JSX. These names are not declared in the fetched source. headingTextStyle is also referenced without an import. Likely TypeScript compilation failure; documented only.

### D. Shared list ownership and cross-page reuse

- TripList is a shared owner consumed by Home, public Trips, Favorites and My Trips. It returns an empty welcome/no-results presentation for an empty array; Favorites and My Trips do not reach that branch because their route roots render their own empty state before mounting TripList.
- For non-empty data, TripList renders a semantic ul with cardListStyle and one li/TripCard per trip group. The list layout is a React CSSProperties preset, not a CSS Module.
- TripList.module.css owns only the two empty-state text classes (margins and font sizes). The heading text treatment is supplied by the shared headingTextStyle React style preset. This module's empty branch is currently not used by these two account routes.
- TripCard is the actual populated-list visual/interaction owner and is already traced in Sections 11.15 and 11.19. It owns the shared MUI Card surface, fixed card dimensions, header/image/social/stepper/content geometry, image placeholder behavior, image carousel swipe state, day pagination, like counts and Details navigation. Favorites and My Trips do not provide distinct TripCard variants.
- TripCard's internal sx objects include repeated fixed dimensions and layout values; MobileStepper's Next/Back Buttons do not consume named action presets, and Pagination owns a local margin preset. These are shared TripCard migration targets, not duplicated route-level findings.
- The four route consumers must continue to share one TripList/TripCard visual contract; do not fork a separate account-only card appearance unless a documented product requirement emerges.

### E. Cross-route ownership summary

| Owner / contract | Favorites | My Trips | Shared consumers / notes |
|---|---|---|---|
| Account layout + RequireAuth | Yes | Yes | All Account routes |
| ACCOUNT_TRIPS_PAGE/CONTENT/HEADING/EMPTY_STATE presets | Intended | Intended | Shared in src/styles/presets/layouts.ts |
| React Query + tripApi | listMyFavorites | listMyTrips | Separate query keys and API calls |
| Loading CircularProgress / error Alert | Local route usage | Local route usage | Candidate shared feedback presentation |
| Empty-state headingTextStyle | Referenced, missing import | Referenced, missing import | Shared typography preset |
| TripList + cardListStyle | Populated state | Populated state | Home and public Trips too |
| TripCard | Shared | Shared | Home, Trips, Favorites, My Trips |
| BUTTON_STYLES.createTrip | — | Empty-state CTA | Named semantic action preset |

### F. Coverage and migration implications

- Both route roots have now been traced through their Account shell, query states, empty/error/loading branches, layout presets and shared list/card owners.
- Favorites and My Trips are DETAILED at the route-page audit level; this does not mean their shared TripCard internals or all React Query/browser behaviors are newly revalidated.
- The source identifier mismatch is a code correctness issue, not a design-system migration. Keep it separate from styling remediation and do not silently rename imports or JSX during the audit.
- Shared Account trip-list layout should be migrated once through the existing ACCOUNT_TRIPS_* presets. Do not duplicate styles or create page-specific variants for Favorites and My Trips.
- Stage 1 remains IN PROGRESS. No application source code was changed.

### G. Exact branch-ref source evidence

- app/(account)/favorites/page.tsx — 22399b5e98c3f8c006ff1bd95e29911cac4b810a
- app/(account)/my-trips/page.tsx — 477050cfe2d688de9f3a1d2cee17222532ac1a54
- app/(account)/layout.tsx — 3ab4f092e7dc6053be4f0ca6f3f68cff31971b90
- src/components/trips/TripList.tsx — 017930d3ccf03e7790c4361945ed86ec0041fece
- src/components/trips/TripCard.tsx — 6ca299211ee78c0373d0cf6a28eafcf40f6ccc0d
- src/components/trips/TripList.module.css — 66233dc514151bddb8255a334f8c2d8ed828b21b
- src/styles/presets/layouts.ts — 4a0aec24e5feecf1ffaeadaf75ade4291658f820
- src/styles/presets/typography.ts — 59803882f1c4357e8815f3afdc7c53939d14bacb
- src/styles/presets/buttons.ts — 2110bcf2a41d8ca81375682ebb9bb8ed88f48a2e
- src/constants/ui/spacing.ts — 9e62ad85eeec73359723643861eb8d2eba8057d1
- src/constants/ui/breakpoints.ts — 9fb27ac76908e485970975bf4a714c581d822315
- src/theme/components/card.ts — 2c933219062e2e626304bc153234a4dbe5c3205b
- src/theme/components/button.ts — 344522fde4f2c45fc223d876d9c568faabd41579

### H. Batch result and next task

- Added detailed page-level audits for Favorites and My Trips, including shared Account shell, query states, empty states and TripList/TripCard ownership cross-references.
- Updated Section 11.19.F from 12 to 14 DETAILED and from 7 to 5 PARTIAL; eight routes remain NOT AUDITED (seven Admin routes and Not Found).
- No application source code changed. No branch was created. No build, tests, lint, CI or browser validation was run.
- Stage 1 remains IN PROGRESS.

## 11.23 — Remaining Account page audits (2026-11-18)

### A. Preflight and scope

- Re-read the approved architecture, Styling API policy (Section 1.4), six-stage plan (Section 6), mandatory search matrix (Section 7), file-level ledger (Section 10.1), route coverage matrix (Section 11.19.F), and relevant ownership audits in Sections 11.14–11.18 and 11.21–11.22.
- Verified the audit document at branch feature/frontend-modernization before this batch. Pre-update document SHA: 38bb3f7d3c478e78f8ea942f3effa33e57380d53.
- Audited all five remaining Account page roots and traced each through its nested page/form owners. Shared owners already covered in earlier sections are cross-referenced rather than repeated.
- No application source changes, no branch creation, and no build/tests/lint/CI/browser validation.

### B. Profile — /profile

- Server route has NOINDEX metadata and composes a centered full-height wrapper, PANEL_SX surface (600px max width), and ProfileForm. Account layout adds RequireAuth, Header, main with React style padding/flex, and Footer.
- ProfileForm initializes React Hook Form from authenticated user first/last name; email is disabled/read-only. Submit updates profile and auth context, optionally uploading the selected profile image first. Submit is disabled unless valid dirty fields or an image are selected; submit/Back/Change Password controls disable while saving. NotificationProvider owns success/error feedback.
- ProfileImage fetches on mount/refresh token, shows loading, hides when no image, and supports confirmed deletion and fullscreen Dialog. ProfileImageUpload validates a single file, creates/revokes a preview URL and allows clearing the pending file.
- ChangePasswordForm is expandable and resets when collapsed. It validates current/new/confirm passwords live, reuses PasswordField and PasswordRequirements, and has its own save/loading/error state.
- Styling: route uses local sx for min-height, centering, responsive padding and 600px width; PANEL_SX owns shared panel skin. ProfileForm consumes ACCOUNT_FORM_FIELDS_SX and named primary/secondary/Back roles, but title, disabled email field, responsive action row and child margins remain local. Profile image circle, overlay controls, dialog, preview and delete actions contain local geometry/sx; colors/shadow partly use UI_COLORS/UI_SHADOWS and AppImage presets. No CSS Module or React style prop.

### C. Edit Point — /points/edit/[pointId]

- Server route is a NOINDEX wrapper for EditPointPage. The client page validates pointId, fetches the point, checks canEdit, and presents loading/error/denied states before the editor.
- Coordinates and address selection synchronize PointLocationPicker and PointForm. Find in Map triggers map recentering. Existing image deletion is confirmed, tracks the deleting image, updates local images, and reports errors inline. Existing thumbnails use AppImage editorPointThumb; an empty image area uses SocialObjectPlaceholder.
- PointForm is shared with Create Trip Point. Edit mode submits point changes, supports map/address geocoding, validation, inline server/location errors and Back/Done navigation. Image uploads are only offered in create mode.
- Styling: local sx controls 1200px page width, map/form/image ordering, 1020px responsive reordering, 600/520px column caps and dynamic 1–3 column image grid. POINT_FORM_PANEL_SX and FORM_CONTROL_INSET_SX centralize the form panel and field inset; MuiCard owns the surface. Image frame/delete overlay geometry remains local; overlay colors are token-backed. PointForm still owns legacy 32ch action button widths/margins and responsive sizing. No CSS Module or React style prop.

### D. Edit Trip — /trips/[id]/edit

- Async server route validates trip id and optional dayId with positiveIdParam, fetches the trip, calls notFound for invalid/missing trip/day, and wraps EditTripLayout in RequireTripOwner. The owner gate checks authenticated user's trips (moderators bypass the lookup), renders null until allowed, and redirects unauthorized users to trip details.
- EditTripLayout initializes tripEditSchema from the selected day. It supports day-number conflict confirmation/locking, reorder and update, query-cache replacement, image deletion, multi-image upload, retaining failed files for retry, and navigation to the updated day. Submit requires a selected day, valid form, no active submission, and dirty fields or new images. Errors are inline; delete uses ConfirmDialog.
- TripLocationPicker, TripSelectField and ImageUploadField provide map, configured selects and upload behavior. Existing images use AppImage; missing images use SocialObjectPlaceholder.
- Styling: responsive grid places map across the top on desktop and form/images in two columns; mobile order is images → map → form. PANEL_SX and MuiCard own the surface, FORM_CONTROL_INSET_SX owns field inset, and primary/Back actions are named. Many local sx values remain for grid, panel dimensions, title, day controls, button group, field rows, upload disabled overlay, image grid and delete overlay. Set/Change Day and day-stepper buttons have no dedicated semantic role. No CSS Module or React style prop.

### E. Create Trip — /trips/create

- NOINDEX route wraps TripForm in Suspense with null fallback because it reads useSearchParams. TripForm handles both new trip-group creation and appending days when tripGroupId is present; it loads existing trip data, derives next day number and carries forward select defaults.
- Three distinct submit intents: Add trip, Add next day trip, and Add point's for the trip. Validation is live. Select choices come from backend config via useSelectChoices/TripSelectField, with a free-text fallback when choices are unavailable.
- TripForm uploads selected images with bounded concurrency. Failed files are retained for retry; the created trip/day IDs are retained so retries do not create duplicate entities. Map coordinates are included in create requests. API errors use NotificationProvider; upload failures render inline. Existing-trip loading disables actions but does not replace the form with a loading skeleton.
- Styling: MuiCard provides the shared surface, but unlike EditTripLayout the form does not consume PANEL_SX; padding, width, spacing and child control/button margins are local. Day field/stepper use DAY_NUMBER_FIELD_SX, DAY_NUMBER_BUTTON_GROUP_SX and named day increment/decrement presets. Add trip/Add next day use primary, Add point uses secondaryLightText, Back uses BackButton. The broad local descendant Button rule sets widths, heights, typography and margins on top of semantic presets. Price/currency and action layouts use local responsive sx. No CSS Module or React style prop.

### F. Create Trip Point — /trips/create/points

- NOINDEX route wraps CreatePointPage in Suspense with null fallback because it reads query parameters. The client page validates tripGroupId/tripId, fetches the trip, resolves the day and handles loading/invalid/missing/error states.
- Composition: PointList + PointLocationPicker + POINT_FORM_PANEL_SX Card + shared PointForm. PointList sorts points; PointCard provides permission-aware Edit/Delete/Move actions and a map or no-marker state. Delete uses ConfirmDialog; reorder/delete/save errors are inline; saving disables list actions. Successful point save refreshes the trip and resets map selection/coordinates.
- PointForm supports create mode, map geocoding/name synchronization, location validation and image upload. If image uploads fail after point creation, createdPointId is retained so retry updates the same point instead of creating a duplicate. Add Next Day navigates back to TripForm with the group id.
- Styling: route owns local responsive two-column layout (single column below 1021px; desktop 0.75fr/1.6fr), map/form width and spacing. POINT_FORM_PANEL_SX and MuiCard centralize panel sizing/surface. PointList/PointCard and map picker internals are shared owners from prior audits. PointForm retains legacy button width/margin presets; Find in Map uses outlined variant with primary hover treatment, a semantic variant mismatch. No route CSS Module or React style prop.

### G. Cross-page ownership and migration implications

| Shared owner / contract | Consumers in this batch | Ownership note |
|---|---|---|
| Account layout + RequireAuth | All five | Common authenticated shell |
| PANEL_SX / MuiCard | Profile, Edit Trip, point forms | Surface contract; Create Trip relies on MuiCard only |
| ACCOUNT_FORM_FIELDS_SX | Profile, Change Password | Shared account field stack |
| PointForm | Edit Point, Create Trip Point | One shared form with edit/create mode differences |
| TripForm / TripSelectField | Create Trip | One form owner; configured-choice fallback |
| EditTripLayout | Edit Trip | Owns day editor and image workflow |
| PointLocationPicker | Edit Point, Create Trip Point | Shared point-location owner |
| TripLocationPicker | Edit Trip, Create Trip | Separate trip-location owner |
| ImageUploadField | Edit Trip, Create Trip, Create Trip Point | Shared upload/preview/processing owner |
| ProfileImage / ChangePasswordForm | Profile | Profile-specific image/password workflows |
| PointList / PointCard | Create Trip Point | Shared point list/card roles |
| ConfirmDialog / NotificationProvider | Profile, Edit Point, Edit Trip, Create Trip, Create Trip Point | Shared confirmation and feedback owners |

### H. Coverage and batch result

- All seven Account route roots now have DETAILED page-level audits. Overall route coverage: 27 total, 19 DETAILED, 0 PARTIAL, 8 NOT AUDITED (seven Admin pages and Not Found).
- Shared components remain separate owners; this page audit does not mean their complete state/responsive consumer matrices are finished.
- Favorites/My Trips unresolved identifiers documented in Section 11.22 remain a separate source-correctness issue. No fixes were made.
- Stage 1 remains IN PROGRESS; do not begin source migration until mandatory consumer maps and state/responsive matrices are exhaustive.

### I. Exact branch-ref source evidence

- app/(account)/profile/page.tsx — ffb748a51d7b19353a395f59b036d03d6f000d22
- app/(account)/points/edit/[pointId]/page.tsx — bbb9e10fc3cf9f8e567055b18bdc28584b62b4d3
- app/(account)/trips/[id]/edit/page.tsx — cb0a66d1fa19710362603b12cb4120485130c9fc
- app/(account)/trips/create/page.tsx — 588d743a5b51e950959c2332550ecc39d6cce5ef
- app/(account)/trips/create/points/page.tsx — 3fa94b21b9a5a77480a1386a2ca95d1108f459f6
- app/(account)/layout.tsx — 3ab4f092e7dc6053be4f0ca6f3f68cff31971b90
- src/components/auth/ProfileForm.tsx — 53753f979947457c028f7541450f207e90ca9b03
- src/components/auth/ProfileImage.tsx — f544741c9a71e6ae5142c5cae763eb12947bbf24
- src/components/auth/ChangePasswordForm.tsx — 6fe468e3574686a2ce77f281e9451e8714aed128
- src/components/points/EditPointPage.tsx — 2ee94d01320853d8408b54b6c697308c839e5207
- src/components/points/CreatePointPage.tsx — 34704fd35ef58c086f8401d961e33e47c8e8e2b2
- src/components/points/PointForm.tsx — e0580d770ce3a0d113086c752dc99313d87e90d4
- src/components/points/PointList.tsx — f8e5e87b55b4b82139b87985ff8eaa133050ae4b
- src/components/points/PointCard.tsx — 86ecd774f4ff3aa0e7a3b8f68b8fea2c4eb8dab2
- src/components/trips/TripForm.tsx — 5a1d13e045eb0060e77e6eccaf2bff5bb3f9a272
- src/components/trips/EditTripLayout.tsx — c86c23108089bec5169ffe2d8361b44db715bbe0
- src/components/trips/TripSelectField.tsx — 6897cbc28a59554c3eb62cf2714ec2a689dd6599
- src/components/maps/PointLocationPicker.tsx — 64f24d4bff2c414e9bf0f2c57d63f59b4390da97
- src/components/maps/TripLocationPicker.tsx — ebfb1a7cf123485aaed0dd2b4157412642ad5673
- src/components/maps/AddressAutocomplete.tsx — f53c09e6196a8f980b2e2700884a9aeb62b2b116
- src/components/images/ImageUploadField.tsx — 78923c1529132c880e9465e33b774ca6f2b0525b
- src/styles/presets/forms.ts — b1de15957049dc1e583bbe3201135bb2b66b490b
- src/styles/presets/buttons.ts — 2110bcf2a41d8ca81375682ebb9bb8ed88f48a2e
- src/constants/ui/sizes.ts — 69e9fdeefc9ce4968e2a6c98a72b80a6f060d444
- src/constants/ui/colors.ts — dce2b3d898c07cb7ba1b61a8ecf9608121ea8763
- src/theme/components/card.ts — 2c933219062e2e626304bc153234a4dbe5c3205b
- src/theme/components/text-field.ts — 4e3ed7529c7f5c219dbe0d05f4f74da0cdca84fa

### J. Batch result and next task

- Added detailed page-level audits for all five remaining Account routes and their nested page owners.
- Updated Section 11.19.F from 14 to 19 DETAILED and from five to zero PARTIAL; eight routes remain NOT AUDITED (seven Admin pages and Not Found).
- No application source code changed. No branch was created. No build, tests, lint, CI or browser validation was run.
- Stage 1 remains IN PROGRESS.
## 11.24 — Admin route page audits (2026-11-18)

### A. Preflight and scope

- Re-read Sections 1.4 (Styling API), 6 (approved six-stage plan), 7 (mandatory search matrix), 10.1 (file ledger), 11.19.F (route coverage), and the relevant shared-owner sections before the batch.
- Confirmed repository `AngelGeorgievStoyanov/hacktrip-web`, branch `feature/frontend-modernization`, pre-update audit document SHA `c727cc9aee0bf98b844e57675374332f88755f74`, and current branch commit `60df8ff6b2222c44c76dfb2ad41cca1941fd9f19`.
- Audited all seven Admin route roots, Admin layout/role gate, navigation, nested page components and the Admin API surface. Reused existing image, dialog, table/pagination, button, theme and shared-layout ownership findings rather than repeating their global audits.
- No application source was modified. No branch was created. No build, tests, lint, CI or browser validation was run.

### B. Admin landing — /admin

- Route root `app/(admin)/admin/page.tsx` is a server component with NOINDEX metadata and renders only a native `<section>` containing `<h1>Admin</h1>`. It does not compose `AdminDashboard`.
- `app/(admin)/layout.tsx` wraps all Admin routes in `RequireRole` for `MODERATOR_ROLES`, then renders Header, `<main>`, AdminNavigation, route content and Footer. `RequireRole` renders null while auth loads and returns the shared NotFound for unauthenticated or unauthorized users; backend authorization remains authoritative.
- AdminNavigation is therefore the actual shared navigation owner in the Admin shell. AdminDashboard is separately exported and contains a second static list of the same five route links; it is not used by the audited Admin landing root. Avoid treating it as the landing page's current visual owner.
- Styling: the Admin layout uses a React `style` prop for main padding/flex, which violates the approved Styling API and is a migration target. AdminNavigation uses local Box `sx` for flex/wrap/gap/margin/padding/border and direct Button variant/color for active/inactive route state. No Admin CSS Module was found in the Admin route/component subtree.

### C. Users — /admin/users

- Server route is a NOINDEX wrapper for `AdminUsers`. The component queries `adminApi.listUsers` with React Query key `['admin','users',page,ADMIN_PAGE_SIZE_DEFAULT]`, page size 50. It derives manager/admin capabilities from `useAuth` and `hasRole`; managers see only role `user`, admins see all returned users.
- Query loading shows CircularProgress; query failure renders an Alert. User deletion has a separate mutation error Alert and ConfirmDialog; success invalidates the users query. Pagination appears only when totalPages > 1 and has disabled Previous/Next boundaries.
- Users render as responsive auto-fill Cards (minimum 320px) with profile Avatar, identity/status, email verification, dates, log count and last login. Clicking an existing profile image opens ImageLightbox. Edit/Delete actions are role-filtered. If the visible list is empty, the component renders the generic text `WELCOME!` rather than a purpose-built empty state. There is no explicit no-data table/card skeleton or empty message for a zero-result dataset.
- Styling: MuiCard supplies the shared surface skin, but card padding/flex/content geometry, 88px Avatar, overflow wrapping and centered action row remain local sx. Edit, Delete, Previous and Next are direct MUI Buttons with no consistent named semantic role. Pagination consumes ADMIN_PAGINATION_SX. Image rendering/lightbox reuse AppImage/ImageLightbox.

### D. Edit User — /admin/users/[userId]

- Server route awaits `params`, passes userId to AdminUserForm and has NOINDEX metadata. AdminUserForm queries `['admin','user',userId]`; `findUserById` scans the users endpoint page-by-page using ADMIN_PAGE_SIZE_MAX=100 until the id is found or totalPages are exhausted. Loading shows CircularProgress; query error or missing target renders `User not found`; manager role mismatch renders an access-denied Alert.
- Admins can edit first/last name, email, email verification, role, status and optionally set a password. Managers can edit only first/last name, email verification and status for target users with role `user`. The form uses adminUserUpdateSchema plus confirmPassword refinement. Password controls are expandable and clear values when collapsed.
- AdminUserProfileImage is embedded: fetches image, shows loading/error/no-image states, supports preview, upload/replace and confirmed delete; upload/delete mutations update the user image cache and invalidate users list. The parent form has separate server error state.
- Save is disabled unless dirty or while update pending; update success invalidates users list, navigates to `/admin/users` and refreshes. Delete user is confirmed and disabled while delete pending; success also invalidates/navigates. BackButton navigates to users. No explicit success toast is shown in this component.
- Styling: parent wrapper uses PANEL_SX + COLUMN_STACK_SX, local max width 760px and responsive padding. Form consumes COLUMN_STACK_SX, BUTTON_STYLES.save, BUTTON_STYLES.dangerText, UI_SIZES and BackButton, plus PasswordField/PasswordRequirements. Field spacing comes from stack layout, but role/status select, switch, password toggle, delete and back action geometry remain mixed local/default contracts. Back caller adds local alignSelf/margin. AdminUserProfileImage uses AppImage, ImageLightbox, ImageUploadField and COLUMN_STACK_SX but retains local Avatar geometry and direct Upload/Delete actions. No CSS Module or React style prop in these feature components.

### E. Images — /admin/images

- Server route is a NOINDEX wrapper for AdminImages. The component owns four local tabs: Cloud, Database, Orphans and Missing thumbnails. Each tab conditionally mounts its own query component and independent page state.
- Cloud and Database tabs query paginated cloud/database image inventories and render dense Lists with explicit empty messages. Orphans queries the cloud/database comparison, displays Cloud only and Database only groups and their counts, and paginates while either source has another page. Query errors render Alerts and loading renders CircularProgress.
- Missing thumbnails queries only records with missing thumbnails. It supports per-row and per-page selection, a hard client-side maximum of 100 selected IDs, selection-limit warning, result summary, query/mutation error Alerts, isFetching feedback, and a Generate selected mutation. Successful generation reports generated/already-existed/missing-original/not-found/failed counts, clears selection and invalidates the missing-thumbnail query.
- Missing-thumbnail results render a Paper-backed table with selectable rows, raw image preview thumbnails, IDs and original URLs; empty results have an explicit table row. Clicking a preview opens a Dialog with a full-size image and locally positioned close IconButton. Pagination is disabled during fetching where appropriate.
- Styling: `ADMIN_TABLE_CONTAINER_SX` and `ADMIN_PAGINATION_SX` are reused in the table and pagination areas, but a local IMAGE_PAGINATION_ROW_SX duplicates layout for Cloud/Database/Orphans. Tabs, List, Table, Checkbox, Dialog and IconButton mostly use MUI defaults with extensive local sx for status spacing, thumbnail size/border/radius, URL wrapping, preview image max dimensions, dialog content padding and close positioning. Raw `component="img"` is used instead of AppImage for original inventory URLs. No CSS Module or React style prop.

### F. Failed Login Logs — /admin/failed-login-logs

- Server route is a NOINDEX wrapper for AdminFailedLogs. Query key includes page and page size; query errors and mutation errors are shown as Alerts, loading uses CircularProgress.
- Users can select individual log IDs or all IDs on the current page. Selected count and bulk Delete action appear only when selection is nonempty. Delete is confirmed, disabled while mutation is pending, clears selection on success and invalidates the failed-log query. Pagination uses server totalPages.
- Table columns: date, email, IP, country, city and user agent. Date formatter returns an em dash for null/invalid dates. Empty `data.items` renders an empty table body with no explicit empty-state row. Selected IDs may remain selected when changing pages; selection is not scoped/reset on page change.
- Styling: table Paper wrapper consumes ADMIN_TABLE_CONTAINER_SX; pagination consumes ADMIN_PAGINATION_SX. Table, Checkbox, selection toolbar, Alert and Buttons otherwise use direct MUI defaults/local Box sx. Delete and pagination actions have no named semantic presets. No CSS Module or React style prop.

### G. Reports — /admin/reports

- Server route is a NOINDEX wrapper and adds a native `h1` Reports before AdminReports, which itself renders another MUI `Typography` h4 Reports. This creates duplicate page headings with different semantic/styling systems.
- AdminReports queries paginated reports; query and mutation errors render Alerts; loading renders CircularProgress. Each row shows ID, target type/id, reason, created date and Delete. Delete opens ConfirmDialog, is disabled while any delete mutation is pending, invalidates the reports query on success and shows a generic error on failure. Pagination uses totalPages.
- Empty `data.items` renders no explicit empty-state row/message. The route's native h1 and component h4 are a duplicate heading/ownership issue.
- Styling: Paper table wrapper uses ADMIN_TABLE_CONTAINER_SX; pagination uses ADMIN_PAGINATION_SX. Direct Delete/Previous/Next Buttons have no semantic action preset; Table cells/rows and heading rely on MUI defaults. No CSS Module or React style prop.

### H. Route Not Found Logs — /admin/route-not-found-logs

- Server route is a NOINDEX wrapper for AdminRouteNotFoundLogs. It queries paginated diagnostics; query errors render Alert, loading renders CircularProgress and pagination uses totalPages.
- Rows display date, method, IP, user ID and email. Each row toggles an expandable Collapse containing request URL, headers, query, body and params. Diagnostic values are pretty-printed JSON when parseable, otherwise shown as raw text; null values render an em dash.
- Empty `data.items` has no explicit empty-state row/message. Expanded state is stored by numeric row id and is not reset when page changes.
- Styling: table wrapper and pagination use admin presets. Diagnostic field labels, preformatted block padding/background/radius/font, detail grid spacing, collapse row border and direct View/Hide/Pagination Buttons remain local/default styling. No CSS Module or React style prop.

### I. Shared ownership and cross-route findings

| Owner / contract | Admin consumers | Finding |
|---|---|---|
| RequireRole + MODERATOR_ROLES | All Admin routes | One shared route-level role gate in Admin layout; loading/unauthorized behavior belongs to RequireRole/NotFound |
| AdminNavigation | All Admin routes | Shared nav, but active/inactive skin and geometry remain local; AdminDashboard duplicates route-link data |
| MuiCard / ADMIN_PAGINATION_SX | Users | Card skin theme-backed; card content/action geometry local; pagination layout shared |
| AdminUserForm + AdminUserProfileImage | Edit User | One form owner plus separate profile-image lifecycle; both share ConfirmDialog and query cache patterns |
| AppImage / ImageLightbox / ImageUploadField | Users, Edit User, Images | Profile photos use AppImage/lightbox; edit image upload uses ImageUploadField; inventory preview uses raw img/Dialog |
| ADMIN_TABLE_CONTAINER_SX / ADMIN_PAGINATION_SX | Images, Failed Logs, Reports, Route Not Found Logs | Shared wrapper/pagination layout only; not a complete table, empty-state or action contract |
| ConfirmDialog | Users, Edit User, Failed Logs, Reports | Destructive operations share confirmation service, but their Button skins/actions differ |
| adminApi + ADMIN_PAGE_SIZE_DEFAULT/MAX | All data pages | One API module and central pagination constants; UI components still duplicate query/loading/error/pagination presentation |

**High-value migration targets (do not implement in this audit):**
- Replace Admin layout React style with an approved layout preset/theme or CSS-variable-backed structural class.
- Define semantic Admin navigation active/inactive contract; align it with global navigation role rather than per-route Button variant/color props.
- Create shared admin data-table shell with consistent responsive overflow, header/row behavior, loading/error/empty states and pagination action roles.
- Split semantic button skin from pagination/action-row geometry; remove repeated Previous/Next/Delete/Edit/Upload/Remove direct MUI defaults.
- Centralize image preview/thumbnail frame and dialog close action; decide whether raw original `img` is intentional for full-resolution inventory.
- Resolve Reports duplicate h1/h4 ownership and replace generic `WELCOME!` Users empty state with a meaningful empty state.
- Keep role and authorization logic unchanged during styling migration; server/backend authorization remains authoritative.

### J. Exact branch-ref source evidence

- app/(admin)/layout.tsx — 5e4f19fce9cd9770695535c8a90840667c2b893e
- app/(admin)/admin/page.tsx — 30f711a91fb24a2bc9e88a8bbbdf2bc4b2582c69
- app/(admin)/admin/users/page.tsx — 8887efb269b911c76c9826018f93140cb1d3e75e
- app/(admin)/admin/users/[userId]/page.tsx — cdb5d63c65d51b798f3bca4fc69de34903113b3d
- app/(admin)/admin/images/page.tsx — 4d2242ce4b2751836262edd6501572cca299e021
- app/(admin)/admin/failed-login-logs/page.tsx — c3c7c75b0bb149a34f21c599a6ef60831896d49a
- app/(admin)/admin/reports/page.tsx — 3cfa04eeb161168ee29d901a86a17381f74e28d1
- app/(admin)/admin/route-not-found-logs/page.tsx — 85bfcb5c9638f43edb4b33ddf6f610309719dc81
- src/components/admin/AdminDashboard.tsx — 866d7ea17af8bdfec5fda22bd1868ddb1e2424ad
- src/components/admin/AdminNavigation.tsx — 75ccf5cd47f702955193fb2d0512205aba2afaac
- src/components/admin/AdminUsers.tsx — 61c674d78c6890b157cede9c166a5ffcc961b658
- src/components/admin/AdminUserForm.tsx — 66ffd3cb2dfeb267aa4dc03bdeb9f43aba0e5e42
- src/components/admin/AdminUserProfileImage.tsx — 738389ef0f0ac674db07e10f64694ce571cb9804
- src/components/admin/AdminImages.tsx — 48dc92d8cc01881992dc388b4dd165c6b53a218f
- src/components/admin/AdminFailedLogs.tsx — fc7ef5517fbdc17a139387887cdfd85ca8f251be
- src/components/admin/AdminReports.tsx — c7312e4a6fcd2543a97205f60e7c7e3f4093ef72
- src/components/admin/AdminRouteNotFoundLogs.tsx — 50e6d63c2de38e5da9a1a548396eb7ec9782366a
- src/components/admin/index.ts — 3e485bbb37a7d1dc026b0f99e998dd3f771cf837
- src/api/admin/index.ts — c8be20f7b48e9dfc51b9c1575b86e67d2e423ef3
- src/constants/admin/index.ts — f06a0504c7808633c9bfed1b5d2cc1f011c21e8e
- src/styles/presets/layouts.ts — 4a0aec24e5feecf1ffaeadaf75ade4291658f820
- src/components/auth/RequireRole.tsx — c35e443eae3fa950711c70062577bd5948a3fb35
- app/not-found.tsx was not modified or audited in this Admin batch.

### K. Batch result and next task

- Updated Section 11.19.F from 19 to 26 DETAILED and from eight to one NOT AUDITED; the sole remaining route is Not Found / 404.
- The Admin file-level migration statuses in Section 10.1 remain unchanged: detailed audit coverage is not the same as centralization or migration completion.
- Stage 1 remains IN PROGRESS. No application source code changed. No branch was created. No build, tests, lint, CI or browser validation was run.

**NEXT TASK — complete the remaining Not Found / 404 route audit:**

1. Trace `app/not-found.tsx` through the shared `NotFound` component, its CSS Module, tokens/presets, navigation actions and every relevant caller (including RequireRole unauthorized flow and other route/error fallbacks).
2. Reuse existing shared-owner audits; do not duplicate the NotFound component audit where already complete. Verify exact current-branch consumers and responsive/error states.
3. Update Section 11.19.F and reconcile Section 10.1 only where new evidence or a genuinely missing path is found.
4. Keep Stage 1 IN PROGRESS until every mandatory Section 7 consumer map and state/responsive matrix is exhaustive. Do not begin app-source migration before that gate.
5. Do not change application source without explicit authorization.
6. Do not run build, tests, lint, CI or browser validation without explicit user authorization.

## 11.25 — Not Found / 404 route audit (2026-11-18)

### A. Preflight and scope

- Re-read the approved architecture, Styling API policy (Section 1.4), six-stage plan (Section 6), mandatory search matrix (Section 7), file-level ledger (Section 10.1), route-page matrix (Section 11.19.F), dependency/route maps (Sections 11.12–11.13) and the latest NEXT TASK in Section 11.24.
- Verified branch `feature/frontend-modernization`; branch HEAD before this documentation update: `82d52b3d1d788db8452bf1e44276774b4863e892`.
- Audit document blob SHA before this batch: `166f9a972099bd52b737f750c41e99c740c7e6dd`.
- Audited the global `app/not-found.tsx` route, shared `NotFound` component and CSS Module, direct consumers, Admin role-denial behavior, route-level Next.js `notFound()` call sites and the separate global error boundary.
- Reused the existing Section 10.1 entries for NotFound, its CSS Module, app/not-found and RequireRole. No new candidate inventory path was discovered; the file-level ledger remains the source of truth and its existing entries were not duplicated.
- No application source changes, no branch creation, and no build, tests, lint, CI or browser validation.

### B. Global Not Found route — `/not-found`

**Composition and ownership**

- Route entry: `app/not-found.tsx`. It is a minimal server component that renders the shared `src/components/common/NotFound.tsx`; it has no local styling, controls or route-specific metadata.
- The shared NotFound component is a client component because it owns countdown state, interval/timeout lifecycle and client-side navigation.
- The 404 screen renders its own full-viewport `main`; it does not compose the standard Header/Footer itself. The root app shell remains the outer application boundary. Exact browser rendering of nested layouts for thrown `notFound()` calls was not validated.
- The page uses a full-screen photographic background and centered vertical content: “PAGE NOT FOUND 404”, “WRONG WAY!”, a live seconds message and a HOME action.
- Heading hierarchy currently uses h3, h4, then h3; there is no h1 in this page. This is a semantic/typography consistency target, not a reason to change copy during the audit.

**Runtime behavior and states**

- Countdown starts at `COUNTDOWN_START = 10`. An interval decrements displayed state once per second, clamped at zero.
- A separate timeout calls `router.replace('/')` after ten seconds. The HOME button immediately calls the same route replacement.
- Both timers are cleared on unmount. Clicking HOME clears both timers before navigation, preventing the scheduled timeout from firing afterward.
- There is no loading, query, mutation, retry, or error-feedback state in this component. The relevant states are initial 10-second display, each countdown value, zero/redirect boundary, immediate HOME action and unmount cleanup.
- The changing countdown is not explicitly marked as a live region. Review its announcement behavior during a later accessibility pass; do not add announcements as part of this CSS audit.
- No reduced-motion behavior is present or required by the current CSS animation model; the page uses no CSS animation or transition.

### C. CSS Module and styling ownership

- `NotFound.module.css` owns the unique full-screen composition: min-height 100vh, remote background image, centered cover positioning, no-repeat, flex column alignment/centering and centered text.
- Text color and the page gap already consume `--ht-color-text-inverse` and `--ht-spacing-xs`.
- The HOME button is a native `button` with local CSS skin: inverse text, `--ht-color-action-contrast-background`, literal `10px 30px` padding, literal `25px` margin, pointer cursor and no border.
- The HOME control is a navigation action but does not consume a named semantic navigation/action preset or shared button component. Preserve its imperative `router.replace('/')` behavior when migrating.
- The background image URL is a page-specific external Unsplash asset. Background positioning/cover and full-screen centering are unique page composition; do not move them into a generic Card/surface contract. Asset ownership/performance is separate from the CSS contract.
- No React `style` prop or inline `sx` occurs in the NotFound component or route wrapper. The CSS Module contains no media query; the composition naturally centers and wraps content at available viewport widths. No responsive browser verification was run.
- Existing Section 10.1 statuses remain CHANGE REQUIRED for `NotFound.tsx` and `NotFound.module.css`, STRUCTURAL for `app/not-found.tsx` and `RequireRole.tsx`. Detailed route audit coverage does not mean these files are migrated or VERIFIED.

### D. Direct consumers and authorization fallback

| Consumer | Relationship | Behavior / ownership |
|---|---|---|
| `app/not-found.tsx` | Direct consumer of `NotFound` | Global Next.js 404 route entry; delegates all visible UI to the shared component |
| `src/components/auth/RequireRole.tsx` | Direct consumer of `NotFound` | Returns the same 404 UI when a visitor is not authenticated/authorized for the requested role |
| `app/(admin)/layout.tsx` | Consumer of `RequireRole` | Applies `MODERATOR_ROLES`; because RequireRole wraps Header/main/AdminNavigation/Footer, its unauthorized NotFound branch replaces that wrapped shell rather than rendering the admin navigation |
| Public Trip Details route | Calls Next.js `notFound()` | Invalid trip ID, API not-found result or missing resolved day enters the framework not-found path |
| Account Edit Trip route | Calls Next.js `notFound()` | Invalid trip ID/day ID, missing trip or day not belonging to the trip enters the framework not-found path |

- Exact direct import search found two consumers of `@/components/common/NotFound`: `app/not-found.tsx` and `src/components/auth/RequireRole.tsx`. Both were fetched and verified from the target branch, rather than relying on default-branch code-search snippets.
- Exact `notFound()` route call sites were found in `app/(public)/trips/[id]/page.tsx` and `app/(account)/trips/[id]/edit/page.tsx`. The public Trip Details route has three guards: invalid route ID, backend trip-not-found and missing resolved day. Edit Trip has guards for invalid trip ID, backend trip-not-found, invalid dayId and dayId not belonging to the trip.
- `RequireRole` returns null while auth status is loading. Once resolved, unauthorized/unauthenticated users receive the shared NotFound component, deliberately hiding the existence and role requirement of Admin routes. Backend authorization remains authoritative.
- `app/error.tsx` is a separate route error boundary, not a 404 consumer: it renders “Something went wrong”, an error Alert and a Try again action using MUI Box/Button/Typography. Do not merge this error state into NotFound or treat it as another NotFound caller.
- Admin Route Not Found Logs is an administrative diagnostic page for recorded unmatched API routes; it is not the user-facing 404 screen and is not a NotFound component consumer.

### E. Migration targets and constraints

1. Migrate the HOME action to the shared semantic Navigation action contract (or an approved shared component) without changing the immediate `router.replace('/')` behavior or timer cancellation.
2. Move the HOME button's shared visual skin values to the shared action contract; keep only page-specific placement/geometry local if the full consumer map confirms it is unique.
3. Keep the photographic background and full-viewport centered composition as a distinct 404 page layout, while ensuring any shared colors/spacing continue to come from tokens/CSS variables.
4. Review heading semantic hierarchy and countdown announcement behavior in the appropriate accessibility/typography pass.
5. Preserve the ten-second countdown, immediate HOME navigation, route replacement semantics, timer cleanup and the authorization privacy behavior.
6. Keep `app/error.tsx` as a distinct error-boundary design and keep Admin diagnostic logs distinct from the user-facing 404.
7. Do not mark the NotFound component or CSS Module migrated/VERIFIED merely because this route audit is now DETAILED.

### F. Exact branch-ref source evidence

- `app/not-found.tsx` — a26b90087136d75721f8ddb3e36b2fa413ebff73
- `src/components/common/NotFound.tsx` — fdb748f384e6895a6b5b143969d8c185c827bd60
- `src/components/common/NotFound.module.css` — 44b9725085174e8e0321b3fdc9de37fa54d9f2dc
- `src/components/auth/RequireRole.tsx` — c35e443eae3fa950711c70062577bd5948a3fb35
- `app/(admin)/layout.tsx` — 5e4f19fce9cd9770695535c8a90840667c2b893e
- `app/(public)/trips/[id]/page.tsx` — 807f760ff224d686942f779c5e604d4b86f4959c
- `app/(account)/trips/[id]/edit/page.tsx` — cb0a66d1fa19710362603b12cb4120485130c9fc
- `app/error.tsx` — 5504213aa5e25e64d49bc7aa879673a9b93c8aae
- `app/(public)/layout.tsx` — de747f2fb78157660255e23047ea0347b3d80975

### G. Batch result and next task

- Completed detailed page-level audit coverage for the final Not Found / 404 route and its direct consumers/fallback call sites.
- Updated Section 11.19.F from 26 to 27 DETAILED, from one to zero NOT AUDITED; PARTIAL remains zero. All 27 route roots now have DETAILED page-level coverage.
- The 163/163 candidate inventory count and 178 unique Section 10.1 ledger paths are separate file-level measures. No new candidate path was needed for this batch.
- Stage 1 remains IN PROGRESS. The mandatory Section 7 token/preset/CSS/inline-style/semantic-action/surface/field/image/state/responsive consumer maps are not yet exhaustive. Completing all route roots does not close Stage 1.
- No application source code changed. No branch was created. No build, tests, lint, CI or browser validation was run.

**NEXT TASK — close Stage 1 mandatory dependency and consumer maps (not another route inventory):**

1. Re-read Sections 1.4, 2, 6, 7, 9, 10.1, Sections 11.12–11.13 and the latest audit log before each batch.
2. Continue from the Section 11.12 dependency graph and Section 7 matrix. Select one remaining owner family at a time (semantic actions/buttons, surfaces/cards, fields, tokens/CSS variables, presets, images, social, maps or state/responsive behavior).
3. For every search, record exact query/scope, result count and exact branch-ref consumer paths; follow each declaration/import to all call sites. Do not rely on default-branch code search as branch proof.
4. Update Section 10.1 only when new evidence changes an existing row or a genuinely missing path is discovered. Keep the 163/163 candidate inventory metric separate from consumer-map completeness.
5. Keep Stage 1 IN PROGRESS until all mandatory Section 7 consumer maps and state/responsive matrices are exhaustive. Do not begin application source migration before that gate.
6. No app source changes, no branch creation, and no build/tests/lint/CI/browser validation without explicit user authorization.


## 11.26 — Design-system owner-layer audit: tokens, theme and presets (2026-11-18)

### Scope and method
- Re-read Sections 1.4, 6 and 7, plus the ownership map in Section 11.12, before inspecting source.
- Confirmed branch: `feature/frontend-modernization`.
- Confirmed HEAD before this documentation update: `07a30a9b1be2cc7503a9151cb5369052a147d0aa`.
- Inspected the current-branch source of 27 owner-layer files: 9 UI token files, 10 theme files and 8 preset files. This is a focused owner-layer audit, not the exhaustive Stage 1 consumer map.
- No source files were changed. No build, tests, lint, CI or browser validation was run.

### Files inspected

**UI tokens (9)**
- `src/constants/ui/index.ts`
- `src/constants/ui/colors.ts`
- `src/constants/ui/spacing.ts`
- `src/constants/ui/sizes.ts`
- `src/constants/ui/breakpoints.ts`
- `src/constants/ui/shape.ts`
- `src/constants/ui/shadows.ts`
- `src/constants/ui/typography.ts`
- `src/constants/ui/z-index.ts`

**Theme (10)**
- `src/theme/index.ts`
- `src/theme/palette.ts`
- `src/theme/shape.ts`
- `src/theme/typography.ts`
- `src/theme/shadows.ts`
- `src/theme/components/button.ts`
- `src/theme/components/card.ts`
- `src/theme/components/dialog.ts`
- `src/theme/components/surface.ts`
- `src/theme/components/text-field.ts`

**Presets (8)**
- `src/styles/presets/buttons.ts`
- `src/styles/presets/cards.ts`
- `src/styles/presets/forms.ts`
- `src/styles/presets/layouts.ts`
- `src/styles/presets/map-controls.ts`
- `src/styles/presets/panels.ts`
- `src/styles/presets/social.ts`
- `src/styles/presets/typography.ts`

### Findings from the inspected source

1. **The owner chain already exists, but is incomplete as a contract.** UI tokens feed the MUI palette, shape, typography, spacing and z-index. Theme overrides consume shared surface/button/field owners. Presets consume tokens and theme. This is a usable foundation; replacing it wholesale would create unnecessary churn.

2. **Token file contains both true design tokens and feature-specific values.** Examples include `UI_COLORS.map.*`, `UI_COLORS.legal.*`, `UI_COLORS.action.createTrip*`, `UI_SHAPE.legalTocRadius`, `UI_SHAPE.mapAddressInputRadius`, and page-specific spacing constants. These may be valid semantic exceptions, but must be traced to all consumers before moving or renaming them.

3. **Spacing and breakpoint contracts are mixed.** `UI_SPACING` is an 8px MUI multiplier scale, while `PAGE_CONTENT_PADDING`, `ROUTE_CONTENT_PADDING` and `ABOUT_PAGE_MOBILE_PADDING` are separate literal layout contracts. `MUI_BREAKPOINTS` and the legacy feature thresholds coexist intentionally. Do not collapse these scales without checking every consumer and responsive behavior.

4. **React CSSProperties remain in reusable presets.** `cards.ts`, `layouts.ts` and `typography.ts` export presentation/layout objects typed as `CSSProperties`; `social.ts` also exports `socialErrorTextStyle` as `CSSProperties`. Under Section 1.4 these are migration targets, not a reason to introduce more React `style` usage. Their consumers must be migrated as a coherent group.

5. **Preset responsibilities are mixed.** `cards.ts` combines card layout geometry, spacing and text treatment; `layouts.ts` combines CSSProperties layout presets with MUI `sx` presets; `forms.ts` combines field geometry, panel composition and auth layout. Separate visual skin from geometry only after property-level consumer tracing.

6. **Theme surface ownership is already centralized for MUI Card and Dialog.** Both call `getSurfaceStyles`; `PANEL_SX` delegates to the same owner. Do not create a second card/panel visual owner. Paper and custom Box/native surfaces remain to be traced.

7. **Button and field contracts are only partial.** Button theme override centralizes typography and radius, while color/state/semantic roles remain in palette and presets. TextField defaults set only outlined/medium; this does not establish a complete contract for Select, Autocomplete, InputBase, FormControl, Checkbox, Radio, Switch or native inputs.

8. **CSS-variable bridge is selective, not a complete token export.** `src/theme/index.ts` emits a chosen subset of `--ht-*` variables. The complete declaration-to-consumer map is still required before adding, renaming or removing variables.

9. **No preset barrel was found at `src/styles/presets/index.ts` (GitHub returned 404).** Imports must therefore be traced to determine whether the project intentionally uses direct-file imports or whether a barrel is missing. Do not create one without checking import conventions and duplicate exports.

### Status and next action
- Owner-layer inspection: **27/27 listed files read**.
- Exhaustive token/preset/CSS-variable consumer mapping: **OPEN**.
- Exhaustive `sx` / `style` / raw visual-literal mapping: **OPEN**.
- Shared component call-site verification: **OPEN**.
- Stage 1: **IN PROGRESS**; no file is marked VERIFIED by this batch.
- Next bounded workstream: continue source migration from the audited owner map. Keep Stage 1 open for the remaining exhaustive maps, but do not treat it as a project-wide migration blocker; verify the affected consumer set for each bounded change.


## 11.27 — First source migration: Home intro preset (2026-11-18)

### Scope and preflight
- Re-read the approved styling API policy (Section 1.4), target architecture (Section 2), migration rules (Section 9), owner map (Section 11.12) and owner-layer findings (Section 11.26).
- Confirmed branch: `feature/frontend-modernization`.
- Starting HEAD for this source batch: `48d48b6e190f3e520e0ebe4c0d171ddf8034d401`.
- The migration is deliberately limited to the home intro paragraph; it does not attempt to convert the other CSSProperties exports in the same file.

### Source changes
1. `src/styles/presets/typography.ts`
   - Replaced the `HOME_INTRO_STYLE: CSSProperties` export with the semantic `HOME_INTRO_SX: SxProps<Theme>` preset.
   - Preserved its existing margin, alignment, inherited shared heading treatment and line-height values.
   - Removed the React CSSProperties dependency from this preset file; the remaining `headingTextStyle` and `HOME_HEADING_STYLE` exports are still legacy style objects and remain migration targets.
2. `src/components/home/HomeHero.tsx`
   - Replaced the paragraph's React `style` prop with MUI `Typography component="p" variant="inherit"` and the named `HOME_INTRO_SX` preset.
   - Kept the existing page-specific `maxWidth: 850` as a local composition delta in the consumer's `sx` array.
   - Preserved the paragraph copy and its existing layout values.

### Scope and verification limits
- The direct consumer identified and migrated in the current-branch route/component map is `src/components/home/HomeHero.tsx`.
- Both modified files were fetched again from the branch after the writes; the new preset export and the consumer import/use are present.
- This is a bounded migration, not an assertion that every typography preset consumer or every React `style` occurrence has been mapped.
- No API, data, route behavior, backend logic, colors or design dimensions were intentionally changed.
- No build, tests, lint, CI or browser validation was run, as required.

### Batch result and next task
- Source migration completed for the Home intro paragraph: **2 source files changed**.
- Remaining legacy typography exports `headingTextStyle` and `HOME_HEADING_STYLE` remain unchanged pending their consumer migrations.
- Stage 1 remains **IN PROGRESS** for the global inventory/consumer maps; it no longer blocks a bounded migration when the affected consumer is verified.
- Next: migrate the Home heading and shared heading treatment only after checking its complete current-branch consumer set; then continue to the next owner family in the existing workstream map.


## 11.28 — Shared heading migration: Home, welcome and trip-list headings (2026-11-18)

### Scope and preflight
- Re-read Sections 1.4, 2, 6 and 9, plus Sections 11.26–11.27.
- Confirmed branch: `feature/frontend-modernization`; the preceding source batch is present at HEAD `8fd4ead8a0965fb8013880c2b88c5c4be4e480fa`.
- Used the existing current-branch component graph to scope the shared heading owner and its direct consumers. This is a bounded migration, not completion of the global Stage 1 inventory.

### Source changes
1. `src/styles/presets/typography.ts`
   - Replaced legacy `headingTextStyle` with the reusable `HEADING_TEXT_SX` semantic text treatment.
   - Replaced `HOME_HEADING_STYLE` with `HOME_HEADING_SX`.
   - Kept `HOME_INTRO_SX` on the same shared heading treatment.
2. `src/components/home/HomeTrips.tsx`
   - Replaced the native heading's React `style` prop with MUI `Typography` and `HOME_HEADING_SX`.
3. `src/components/common/WelcomeHeading.tsx`
   - Replaced the responsive native `h1` style usage with MUI `Typography` and `HOME_HEADING_SX`.
   - Preserved the breakpoint split, touch trigger and heading content.
4. `src/components/common/ScrambleHeading.tsx`
   - Replaced the native `h1` and React `style` prop with MUI `Typography` and `HOME_HEADING_SX`.
   - Removed the obsolete component-level `style` prop; the current-branch call site supplies no style override.
   - Preserved the scramble timer, hover behavior, reduced-motion guard and accessible label.
5. `src/components/trips/TripList.tsx`
   - Replaced native empty-state heading/paragraph style props with MUI `Typography` and `HEADING_TEXT_SX`.
   - Left the trip-list layout preset and list markup unchanged.

### Result and limits
- Five source files updated in this batch; the previous Home intro migration remains intact.
- Shared heading text appearance now has one semantic preset owner; centered Home heading composition has a separate named preset.
- No API, data, route behavior, backend logic, colors or intended design dimensions were changed.
- The legacy `style` props addressed in this batch were removed from these heading consumers. Other `style` props and CSSProperties presets elsewhere remain migration targets.
- No build, tests, lint, CI or browser validation was run.

### Status and next task
- Bounded shared-heading migration: **SOURCE CHANGES APPLIED**.
- Stage 1 global inventory and consumer maps: **IN PROGRESS**; this batch does not mark the global audit complete.
- Next: continue with the next already-audited owner family in the existing migration order. Do not reopen the completed heading batch unless validation or a newly discovered consumer requires it.


## 11.29 — Trip listing and page-shell preset migration (2026-11-18)

### Scope
- Continued directly from the existing ownership and route maps in Sections 11.12–11.15 and the preset findings in Section 11.26.
- Migrated the shared trip-list/card/page-shell path from its preset owner through the audited Home and Trips route consumers.
- No new route inventory or broad audit was performed.

### Source changes
1. `src/styles/presets/layouts.ts`
   - Replaced the legacy `cardListStyle` CSSProperties object with `CARD_LIST_SX`.
   - Replaced `CENTERED_PAGE_MAIN_STYLE` with `CENTERED_PAGE_MAIN_SX`, composed from `PAGE_BACKGROUND_SX`.
   - Updated the account heading preset to consume the renamed `HEADING_TEXT_SX` owner.
2. `src/styles/presets/cards.ts`
   - Replaced the `cardStyle` CSSProperties preset with `TRIP_CARD_SX`.
   - Preserved the card layout geometry and spacing values; surface skin remains owned by the MUI Card theme.
3. `src/components/trips/TripList.tsx`
   - Replaced the styled native list with MUI `Box component="ul"` and `CARD_LIST_SX`.
4. `src/components/trips/TripCard.tsx`
   - Migrated both normal and empty-day Card variants to `TRIP_CARD_SX`.
   - Removed the now-unused React CSSProperties type import.
5. `app/(public)/page.tsx`
   - Migrated the Home page main wrapper to MUI Box and `CENTERED_PAGE_MAIN_SX`.
6. `app/(public)/trips/page.tsx`
   - Migrated both success and error main wrappers to the same page-shell preset.
   - Migrated the intro and temporary-unavailable message to MUI Typography and `HOME_INTRO_SX`; removed the obsolete `HOME_INTRO_STYLE` dependency.

### Result
- **6 source files changed** across the preset owner, shared list/card components and both public route consumers.
- The same named layout contracts now flow from the preset owner through TripList/TripCard to Home and Trips.
- Preserved the existing card dimensions, list flex wrapping/alignment, page padding, content alignment, intro width and copy.
- No API, data, backend or business logic changes.
- The old `commentListStyle` and other unrelated legacy layout presets were deliberately left untouched; their consumers belong to separate workstreams.
- No build, tests, lint, CI or browser validation was run.

### Status
- Trip listing / Home / Trips bounded migration: **SOURCE CHANGES APPLIED**.
- Stage 1 global consumer maps remain **IN PROGRESS**, but did not block this bounded migration.
- Next: continue through the existing audit's shared card/surface and account trip page ownership map. Do not repeat the completed Home/Trips route audit.


## 11.30 — Account trip pages and shared TripCard end-to-end migration (2026-11-18)

### Scope and source of truth
- Continued from the existing ownership maps in Sections 11.16, 11.22 and 11.23 and the shared trip-list/card findings in Sections 11.14–11.15.
- Used the existing audit findings; no new broad audit was started.
- Followed the ownership chain from shared constants/preset owners through the account shell, route roots, TripList and the shared TripCard consumers.
- Preserved the existing query keys, API calls, loading/error/empty-state precedence, Favorites/My Trips copy, Create Trip action, card geometry, image behavior, swipe handling, pagination, likes and Details navigation.

### Source changes
1. `src/styles/presets/layouts.ts`
   - Added `ACCOUNT_LAYOUT_MAIN_SX` for the authenticated route shell.
   - Added `ACCOUNT_TRIPS_LOADING_SX` and `ACCOUNT_TRIPS_ERROR_SX`.
   - Reused the existing account page/content/heading/empty-state contracts.
2. `app/(account)/layout.tsx`
   - Replaced the React `style` prop on the shared account main element with MUI Box and `ACCOUNT_LAYOUT_MAIN_SX`.
   - Kept RequireAuth, Header/Footer order and the original 2rem padding/flex behavior.
3. `app/(account)/favorites/page.tsx` and `app/(account)/my-trips/page.tsx`
   - Corrected the concrete unresolved JSX identifiers to the already-imported `ACCOUNT_TRIPS_*` preset exports.
   - Added the missing `HEADING_TEXT_SX` import.
   - Centralized loading and error presentation in the new shared presets.
   - Preserved the distinct empty-state content and My Trips Create Trip CTA.
4. `src/styles/presets/cards.ts`
   - Moved TripCard's shared header, image frame, social counts/rows, stepper, content, pagination and description geometry into named presets.
   - Centralized the 540px card height and the responsive empty-day header contract.
5. `src/components/trips/TripCard.tsx`
   - Replaced component-local visual preset declarations with the shared card contracts.
   - Kept only runtime interaction/state logic in the component.
6. `src/styles/presets/typography.ts`
   - Added shared empty TripList title/body typography presets while preserving the previous module values.
7. `src/components/trips/TripList.tsx`
   - Replaced CSS Module typography classes with the named typography presets.
8. `src/components/trips/TripList.module.css`
   - Removed the now-unreferenced module after migrating its only consumer.

### Result
- **9 files changed** across the shared preset owners, account route shell, Favorites/My Trips route roots, TripList and TripCard; this includes removal of the obsolete TripList CSS Module.
- Ownership now flows from centralized layout/card/typography presets to all relevant account and shared-list consumers.
- Corrected the previously documented Favorites/My Trips identifier and missing-import inconsistencies in the actual source.
- No API, backend, data, query behavior or business logic changes.
- No build, tests, lint, CI or browser validation was run.

### Status and next
- Account Trips + Favorites route/style migration: **SOURCE CHANGES APPLIED**.
- Shared TripCard geometry is now centralized for Home, public Trips, My Trips and Favorites.
- Next: continue with the next already-audited shared card/surface owner family; trace its preset/theme owner through every audited consumer before changing or removing any legacy export.
- Stage 1 global inventory remains IN PROGRESS; it does not block these bounded migrations.


## 11.31 — Google Maps renderer, point editor and all direct map consumers (2026-11-18)

### Scope and preflight
- Continued from the exact direct-consumer graph and behavior constraints in Sections 11.17 and 11.18; re-read the styling API policy in Section 1.4 and the owner-layer findings in Section 11.26.
- Confirmed branch: `feature/frontend-modernization`; used the latest branch-ref source files before each update.
- Reused the existing audit map. No new broad audit was started.
- Verified the GoogleMapView direct-consumer set against the existing audit and repository search: PointLocationPicker, TripLocationPicker, TripMapSection and PointCard. Each consumer was fetched from the target branch.

### Ownership rules preserved
- GoogleMapView owns SDK loading placeholder geometry, renderer wrapper geometry, markers, paths, InfoWindows and map events.
- PointLocationPicker retains its GPS locate, remove-marker, address search and external find-in-map behavior.
- TripLocationPicker retains its separate address state, remove-marker behavior and map hint.
- TripMapSection retains its route overview, marker selection, point navigation, sticky-header scroll correction and responsive map frame.
- PointCard retains its compact 150px map, point actions and reorder controls.
- The two location pickers are not consolidated; their behavior remains distinct. Different map dimensions remain feature-owned.

### Source changes
1. `src/styles/presets/map-controls.ts`
   - Added parameterized renderer and loading-frame presets so loading and loaded states share the same dimensions.
   - Added named point-picker action-row, wrapper and Snackbar layout presets.
   - Added TripLocationPicker map-frame and hint presets.
   - Added TripMapSection shell and stepper presets, preserving its small-phone breakpoint.
2. `src/components/maps/GoogleMapView.tsx`
   - Replaced both local renderer/loading sx objects with the shared parameterized presets.
   - Kept map SDK lifecycle, event handling, marker/path rendering and fit/focus behavior unchanged.
3. `src/components/maps/PointLocationPicker.tsx`
   - Replaced local outer Stack, responsive action-row and Snackbar layout objects with named presets.
   - Kept address autocomplete overrides, GPS state, coordinate synchronization and actions unchanged.
4. `src/components/maps/TripLocationPicker.tsx`
   - Replaced local map frame and map hint sx objects with named presets.
   - Kept its distinct address field/button overrides, marker state and remove-marker behavior unchanged.
5. `src/components/trips/TripMapSection.tsx`
   - Replaced local map Card and MobileStepper geometry with named map presets.
   - Kept route fitting, marker selection, navigation and sticky-header scrolling unchanged.
6. `src/styles/presets/cards.ts`
   - Added the full PointCard wrapper/card/action-row/reorder-button contracts and named compact map height.
7. `src/components/points/PointCard.tsx`
   - Replaced component-local wrapper, card, reorder-button, action-row and description-wrap sx with shared presets.
   - Reused the existing point text-wrap preset for both name and description.
8. `src/styles/presets/layouts.ts`
   - Added the Create Point page shell, responsive grid, list/editor columns and loading/error spacing contracts.
   - Added the PointList vertical collection layout.
9. `src/styles/presets/typography.ts`
   - Added the PointList empty-state typography contract.
10. `src/components/points/PointList.tsx`
    - Replaced local list layout and empty-state presentation with named presets.
11. `src/styles/presets/forms.ts`
    - Added a named Point form panel variant with the existing top margin.
12. `src/components/points/CreatePointPage.tsx`
    - Replaced page shell, loading, grid, list/editor columns, error spacing and form-panel composition sx objects with named presets.
    - Preserved route state, API calls, reorder/delete/save flows, map-coordinate synchronization and navigation.

### Result
- **12 source files changed** across the map renderer, all four direct map consumers, PointCard/PointList, the Create Point route composition and their preset owners.
- The GoogleMapView loading and loaded frames now share one dimension contract.
- Point creation now follows the complete owner chain: UI constants/theme-backed map colors → map/layout/card/form/typography presets → GoogleMapView and map pickers → PointCard/PointList → CreatePointPage.
- No API, backend, data, query, permission, map interaction or business logic changes.
- No build, tests, lint, CI or browser validation was run.

### Status and next
- Google Maps renderer + direct consumer migration: **SOURCE CHANGES APPLIED**.
- PointCard/PointList/CreatePointPage style migration: **SOURCE CHANGES APPLIED**.
- Next: continue through the next already-audited owner family and trace the shared owner to every direct consumer before changing legacy styles.
- Stage 1 global inventory remains IN PROGRESS; it does not block these bounded migrations.


## 11.32 — AddressAutocomplete and all direct consumers (2026-11-19)

### Scope and preflight
- Re-read the approved ownership architecture, Styling API policy (Section 1.4), map owner/caller graph (Sections 11.17–11.18), token/theme/preset owner findings (Section 11.26) and the completed map renderer migration (Section 11.31).
- Confirmed branch: `feature/frontend-modernization`; starting HEAD: `a1144c1c239129f1733c266b75fe446da799fb95`.
- Reused the existing direct-consumer graph. Exact branch-ref fetches and repository search confirmed the three consumers: `PointForm`, `PointLocationPicker` and `TripLocationPicker`.
- Chose an end-to-end shared-owner migration because the three caller overrides were the same unresolved styling API issue recorded in Section 11.17. The point and trip picker variants remain distinct; no behavior consolidation was attempted.

### Source changes
1. `src/styles/presets/map-controls.ts`
   - Added named AddressAutocomplete root, row, field-wrapper, search-button and extra-action layout contracts.
   - Added semantic `form`, `pointPicker` and `tripPicker` variants. Existing map field colors, responsive sizing, primary button treatment and disabled state were moved without changing their values.
   - Added the named TripLocationPicker marker-removal button contract.
2. `src/components/maps/AddressAutocomplete.tsx`
   - Removed the public `inputSx`, `buttonSx` and `containerSx` escape hatches and their MUI style types.
   - Added a constrained semantic `variant` prop, defaulting to `form`.
   - Replaced component-local wrapper/search/extra-action sx objects with named presets.
   - Preserved Google Places selection, geocoder fallback, keyboard Enter search, loading/disabled state, notices, callbacks and TextField error/helper props.
3. `src/components/maps/PointLocationPicker.tsx`
   - Switched to `variant="pointPicker"`; removed caller-owned autocomplete field, button and container sx.
   - Preserved its responsive direction, GPS locate, marker clearing, map click/drag, coordinate synchronization, external find-in-map trigger and Snackbar feedback.
4. `src/components/maps/TripLocationPicker.tsx`
   - Switched to `variant="tripPicker"`; removed caller-owned autocomplete field, button and container sx.
   - Moved marker-clear button geometry into a named preset.
   - Preserved its separate address state, map click/drag, map hint, marker clearing and info feedback. It remains behaviorally distinct from PointLocationPicker.
5. `src/components/points/PointForm.tsx`
   - Explicitly selects the `form` variant; existing label, validation/error/helper text and no-search-button behavior remain unchanged.

### Result
- **5 source files changed** across the shared map-control preset owner, AddressAutocomplete and all three direct consumers.
- The unrestricted caller-level styling API is removed. No direct consumer passes arbitrary sx into AddressAutocomplete.
- Shared field/search/container presentation now flows from `src/styles/presets/map-controls.ts` to the shared component and its consumers.
- No API, backend, data, validation, geocoding, map interaction, form submission or business logic changes.
- No build, tests, lint, CI or browser validation was run.

### Status and next
- AddressAutocomplete owner and all direct consumers: **SOURCE CHANGES APPLIED**.
- Stage 1 global inventory remains IN PROGRESS; it does not block these bounded migrations.
- Next: migrate the already-audited `ImageUploadField` and `CustomFileUploadButton` owner chain, including all direct consumers, processing/error/limit states and preview/remove controls. Re-read this document and the relevant owner/caller sections before editing.


## 11.33 — ImageUploadField, CustomFileUploadButton and profile upload consumers (2026-11-19)

### Scope and preflight
- Re-read Styling API policy (Section 1.4), the shared image/upload ownership graph and route composition (Sections 11.13, 11.17–11.18), the owner-layer token/preset audit (Section 11.26), and the immediately preceding NEXT in Section 11.32.
- Confirmed branch: `feature/frontend-modernization`. No branch was created.
- Exact direct-consumer searches and branch-ref source reads confirmed:
  - `ImageUploadField`: `PointForm`, `TripForm`, `EditTripLayout`, `AdminUserProfileImage`.
  - `CustomFileUploadButton`: `ImageUploadField` and `ProfileImageUpload` in `ProfileImage.tsx`.
- The two upload flows remain distinct: generic multi-image validation/compression/limit handling versus single profile-image validation/object-URL handling.

### Source changes
1. `src/styles/presets/image-upload.ts` — new shared owner for upload field root/header/status/count/limit, processing indicator size, preview list/row/thumbnail/filename, remove/remove-all actions, profile selected-file preview, upload trigger modes and caller wrapper geometry.
2. `src/components/images/ImageUploadField.tsx` — replaced local upload layout, count/limit/processing sizing, preview list/row/thumbnail/filename and remove control sx with named presets. Warning Alert and all upload state logic remain local.
3. `src/components/CustomFileUploadButton.tsx` — both camera IconButton and standard contained Button modes now consume named upload-trigger presets; the 30ch wrapper is centralized. Disabled calculation, max-count gate, accept/multiple and file input forwarding are unchanged.
4. `src/components/auth/ProfileImage.tsx` — ProfileImageUpload now consumes shared profile field/preview/thumbnail/filename/remove presets while retaining its independent one-file validation and object-URL lifecycle. Existing ProfileImage display/delete/fullscreen Dialog behavior was not migrated in this package.
5. `src/components/points/PointForm.tsx` — removed the redundant width-only wrapper around ImageUploadField; the shared field already owns width 100%.
6. `src/components/trips/TripForm.tsx` — moved the existing upload wrapper inset into `TRIP_FORM_IMAGE_UPLOAD_WRAPPER_SX`.
7. `src/components/trips/EditTripLayout.tsx` — moved the submitting pointer-events/opacity wrapper into `getImageUploadSubmittingWrapperSx`; the submitting state and upload retry behavior are unchanged.
8. `src/components/admin/AdminUserProfileImage.tsx` — no caller-specific override was needed; it receives the shared owner migration directly.

### Preserved behavior
- Generic upload: maximum image count, existing-count accounting, 25 MB input limit, JPEG compression/quality fallback, 2 MB compressed cap, sequential processing, object URL cleanup, retryable selected files, processing lock, warning/error messages and remove-one/remove-all.
- Shared trigger: camera/text modes, disabled state, maximum count, accepted MIME types, multiple selection and native input reset/forwarding.
- Profile upload: one-file MIME/size validation, input reset, object URL cleanup, preview and selected-file removal.
- No API, backend, business logic, upload concurrency, data, validation rule or route behavior changes.

### Result
- **7 source files changed** (one new preset file and six existing component/consumer files).
- Upload-specific visual values now flow through one named preset owner; the two upload flows retain separate state/validation behavior.
- Existing image display/lightbox styling in ProfileImage and broader AdminUserProfileImage avatar/action styling remain outside this bounded migration.
- No build, tests, lint, CI or browser validation was run.

### Status and next
- ImageUploadField + CustomFileUploadButton owner chain and all confirmed direct consumers: **SOURCE CHANGES APPLIED**.
- Stage 1 global inventory remains IN PROGRESS; it does not block these bounded migrations.
- Next: migrate the already-audited `ImageGallery` owner and both direct consumers (`PointSection`, `DayImagesGallery`) end-to-end, including its CSS Module, responsive grid/focus states, AppImage frames and ImageLightbox composition. Re-read this document and Sections 11.17–11.18 before editing.


## 11.34 — ImageGallery, ImageLightbox, AppImage and both gallery consumers (2026-11-19)

### Scope and preflight
- Re-read Styling API policy (Section 1.4), image rendering/placeholder ownership and exact consumer graph (Sections 11.17–11.18), preset/theme owner findings (Section 11.26), and the immediately preceding NEXT in Section 11.33.
- Confirmed branch: `feature/frontend-modernization`; starting HEAD was `0ab9aa3f22eeace28e81b47728c7b76c537ed8d1`. No branch was created.
- Reused the existing ownership map and confirmed exact current-branch consumers:
  - `ImageGallery`: `PointSection`, `DayImagesGallery`.
  - `ImageLightbox`: `ImageGallery`, `AdminUserProfileImage`, `AdminUsers`.
  - `AppImage`: `ProfileImage`, `ImageGallery`, `ImageLightbox`, `AdminUserProfileImage`, `AdminUsers`, `EditPointPage`, `TripCard`, `EditTripLayout`.
- Barrel exports were excluded from rendered-consumer counts. Existing admin and profile consumers were retained; no unrelated gallery caller was folded into the two trip-gallery compositions.

### Source changes
1. `src/styles/presets/image-gallery.ts` — new semantic owner for PointSection image-frame composition, DayImagesGallery placeholder frame and ImageLightbox dialog/root/control/counter/stage contracts. Existing semantic image-control colors remain sourced from `UI_COLORS`.
2. `src/components/images/ImageGallery.tsx` — removed the dynamic inline grid sx and caller-independent focus sx. Grid column count now selects one of three explicit CSS Module structural classes. Image ordering, selected index, open/close callbacks, social overlay and comment target behavior are unchanged.
3. `src/components/images/ImageGallery.module.css` — retained unique flex/grid/stack geometry and existing CSS-variable spacing/radius usage; added 1/2/3-column structural classes and a token-backed keyboard `:focus-visible` outline.
4. `src/components/images/ImageLightbox.tsx` — replaced local visual sx objects with named presets. Keyboard ArrowLeft/ArrowRight wrapping, touch-swipe threshold, previous/next wrapping, close behavior, counter and full-screen Dialog composition remain unchanged.
5. `src/components/images/AppImage.module.css` — new CSS owner for preset-driven `object-fit` and the profile-lightbox responsive frame.
6. `src/components/images/AppImage.tsx` — removed React `style` prop transport from both Next Image and missing-image fallback. Preset presentation is now expressed through internal CSS Module classes while caller className is preserved. Thumbnail-to-full-image retry, loading/priority/fetchPriority, fill/dimensions/sizes, alt text and fallback accessibility remain unchanged.
7. `src/constants/images/presets.ts` — removed the React CSSProperties `style` field from the preset contract and represented the former profileLightbox sizing through its named CSS class; image source dimensions, fit, thumbnail, priority and sizes hints remain intact.
8. `src/components/trips/PointSection.tsx` — replaced duplicated image/placeholder frame width and inset declarations with the shared PointSection frame preset.
9. `src/components/trips/DayImagesGallery.tsx` — replaced the local no-image placeholder frame sx with its named preset. Day placeholder remains distinct from the PointSection bleed frame.

### Preserved behavior and boundaries
- ImageGallery empty-array behavior, row/stack/grid variants, grid column cap, image ordering, first-image priority/eager/high fetch priority, alt text, engagement overlay, comment state and selected-image index remain unchanged.
- ImageLightbox remains shared by the gallery and both admin profile-image flows. The admin callers retain their independent selection state and one-image/multi-image behavior.
- AppImage remains the single shared renderer for all eight confirmed direct consumer files. The image preset API no longer carries React style objects.
- PointSection and DayImagesGallery retain separate parent composition and their existing SocialObjectPlaceholder fallback; the fallback itself and unrelated trip/profile/admin layout were not consolidated.
- No API, backend, data, image URL selection, upload, social, comment or business logic changes.

### Result
- **9 source files changed** (2 new shared style files and 7 existing files).
- Gallery and lightbox visuals now flow through named presets/CSS Modules; all AppImage preset presentation is transported by CSS classes rather than React `style` props.
- Both direct ImageGallery consumers were migrated without merging their distinct frame geometry.
- No build, tests, lint, CI or browser/keyboard/touch validation was run.

### Status and next
- ImageGallery + ImageLightbox + AppImage owner chain and both direct gallery consumers: **SOURCE CHANGES APPLIED**.
- Existing admin/profile ImageLightbox consumers were verified and preserved; their separate avatar/action compositions remain future migration targets.
- Stage 1 global inventory remains IN PROGRESS; it does not block these bounded migrations.
- Next: continue with the already-audited ProfileImage display/delete/fullscreen composition and its admin profile-image counterpart. Re-read Sections 11.17–11.18 and this entry before editing; keep profile avatar, pending upload preview and fullscreen image as distinct states.
- No build, tests, lint, CI or browser validation was run.


## 11.35 — Profile image display, delete and fullscreen compositions (2026-11-19)

### Scope and ownership
- Re-read Sections 11.17–11.18 and 11.34 before editing; retained the established distinction between the persisted profile image and the separately selected upload preview.
- Confirmed current branch `feature/frontend-modernization`; no branch was created.
- Exact rendered consumers covered:
  - `ProfileImage` → `ProfileForm`.
  - `AdminUserProfileImage` → `AdminUserForm`.
  - `AdminUsers` → profile avatars in the user list and the shared `ImageLightbox`.
  - Both admin flows continue to use `ImageLightbox` as their fullscreen image viewer; the personal profile flow retains its existing profile-specific Dialog composition.
- The `ProfileImageUpload` selected-file preview remains a distinct state and continues to consume the existing image-upload presets. It was not merged with the persisted profile-image display.

### Source changes
1. `src/styles/presets/profile-image.ts` — new shared owner for profile-image loading, personal profile container, delete trigger/icon, circular view trigger, fullscreen stage/close control and compact admin avatar variants.
2. `src/components/auth/ProfileImage.tsx` — replaced local display/loading/delete/fullscreen sx objects with named profile-image presets. Existing profile upload selection/preview continues to use the image-upload presets and its own object-URL lifecycle.
3. `src/components/admin/AdminUserProfileImage.tsx` — replaced the admin profile avatar's local sx with the shared admin avatar preset. Upload, replace, delete confirmation, query/mutation states and shared ImageLightbox behavior remain in this owner.
4. `src/components/admin/AdminUsers.tsx` — replaced duplicated profile avatar sizing/interaction sx with shared admin avatar variants. Existing no-image icon, selected-image state and shared ImageLightbox remain unchanged.

### Preserved behavior and boundaries
- Personal profile image loading, absent-image rendering, delete confirmation, deleting lock, success/error notifications, fullscreen open/close and refresh-token reload remain unchanged.
- Profile image and pending upload preview remain independent. Single-file validation, file-input reset, object URL creation/revocation, preview removal and upload selection were not altered.
- Admin detail flow retains query loading/error/empty states, one-image upload limit, upload/replace/delete mutations, query-cache updates and fullscreen viewer state.
- Admin users list retains its per-user image selection and alt text, no-image icon and shared lightbox selection/close behavior.
- The personal profile fullscreen Dialog remains distinct from the shared gallery ImageLightbox; no attempt was made to merge them.
- No API, backend, upload validation, cache, notification, confirmation or business logic changes.

### Result
- **4 source files changed** (1 new shared preset and 3 existing components).
- Profile display/delete/fullscreen presentation now has a named shared owner; both admin avatar consumers use the same compact avatar contract.
- The pending profile upload preview remains on its existing upload-specific contract.
- No build, tests, lint, CI or browser validation was run.

### Status and next
- ProfileImage display/delete/fullscreen and admin profile-image compositions: **SOURCE CHANGES APPLIED**.
- Section 11.17 consumer graph remains valid; the exact current-branch component owners and parent consumers were preserved.
- Stage 1 global inventory remains IN PROGRESS and does not block these bounded migrations.
- Next: continue with the separately audited SocialObjectPlaceholder owner and its five direct consumers (`PointSection`, `DayImagesGallery`, `TripCard`, `EditPointPage`, `EditTripLayout`). Keep parent-owned frame/aspect-ratio geometry separate from the placeholder's fill/overlay/typography.
- No build, tests, lint, CI or browser validation was run.


## 11.36 — SocialObjectPlaceholder owner and all direct consumers (2026-11-19)

### Scope and preflight
- Re-read Styling API policy (Section 1.4), the image/placeholder ownership graph and exact consumer list (Section 11.17), the gallery frame contracts (Section 11.34), the profile-image migration (Section 11.35) and the immediately preceding NEXT.
- Confirmed branch: `feature/frontend-modernization`; starting HEAD: `b817ee94473aa0a9bf3e58d5c4cb95e4503c07fc`. No branch was created.
- Re-fetched the shared placeholder and all five direct consumers from the exact branch ref:
  - `PointSection`
  - `DayImagesGallery`
  - `TripCard`
  - `EditPointPage`
  - `EditTripLayout`
- Confirmed the five consumers do not pass styling overrides to the placeholder. Their parent-owned frame dimensions and aspect ratios are intentionally distinct, so no caller geometry was moved into the shared placeholder or changed.

### Source changes
1. `src/styles/presets/social-object-placeholder.ts` — new semantic owner for the placeholder root/fill surface, decorative overlay, title typography and supporting text typography. Existing UI color tokens and all current visual values are preserved.
2. `src/components/placeholders/SocialObjectPlaceholder.module.css` — new CSS Module owns only the decorative image's structural fill behavior (`display`, width/height and `object-fit: cover`), replacing the prohibited Next Image React `style` prop.
3. `src/components/placeholders/SocialObjectPlaceholder.tsx` — replaced local root/overlay/typography sx objects with the named presets and switched the decorative Next Image to the CSS Module class. No public styling props were added.

### Preserved behavior and boundaries
- Random client-side SVG selection, lazy selection after mount, one selected asset request, decorative image alt/aria-hidden behavior and parent-level accessible image label remain unchanged.
- The placeholder still fills its parent's available frame; it does not set an aspect ratio or impose a fixed size.
- All five consumer compositions remain distinct and unchanged: PointSection's bleed frame and square fallback, DayImagesGallery's centered square frame, TripCard's existing card image frame, and the separate centered square frames in EditPointPage and EditTripLayout.
- AppImage and SocialObjectPlaceholder remain separate fallback/rendering owners. No image URL, upload, API, backend, data or business logic changes.

### Result
- **3 source files changed** (2 new style-owner files and 1 existing component).
- The shared placeholder now has one named presentation owner; its image fill behavior uses CSS Modules rather than React `style`.
- All five direct consumers were verified; their distinct parent-owned geometry was deliberately retained without unnecessary source edits.
- No build, tests, lint, CI or browser validation was run.

### Status and next
- SocialObjectPlaceholder owner and all five direct consumers: **SOURCE CHANGES APPLIED**.
- Stage 1 global inventory remains IN PROGRESS and does not block these bounded migrations.
- Next: continue with the next pending owner family already listed in this audit; re-read the relevant ownership/consumer sections and latest NEXT before editing.
- No build, tests, lint, CI or browser validation was run.


## 11.37 — ConfirmDialog semantic action roles (2026-11-19)

### Scope
- Continued the approved common-primitives and semantic-actions workstream using the existing ownership map in Sections 11.12, 11.17 and 11.18. No new inventory or audit document was created.
- ConfirmDialogProvider is the single global owner; its direct consumers remain unchanged.
- Reused the existing `BUTTON_STYLES.primary` and `BUTTON_STYLES.secondary` contracts. No new preset or token was introduced.

### Source change
1. `src/components/common/ConfirmDialog.tsx`
   - The negative/cancel action now consumes `BUTTON_STYLES.secondary`.
   - The affirmative/confirm action now consumes `BUTTON_STYLES.primary`.
   - Removed duplicated raw `color="primary"` button styling props; retained contained variants, labels, autofocus, click handlers and dialog-close resolution behavior.

### Result
- **1 source file changed.** The shared confirmation dialog now communicates opposite action semantics through the existing centralized button contracts.
- Promise<boolean> behavior, provider API, all consumers and confirmation flow are unchanged.
- No new preset, token, component or branch was created.
- No build, tests, lint, CI or browser validation was run.

### Status and next
- ConfirmDialog cancel/confirm action-role migration: **SOURCE CHANGE APPLIED**.
- Next: continue the **application-wide design-system migration**, not a BackButton/ConfirmDialog-only task. Use the existing Section 11.12 dependency map and audited route/component records to migrate the remaining shared contracts and all affected consumers across the full app: global actions and navigation; cards, panels, dialogs and tables; fields/forms; page/layout/typography/CSS; images/social/maps/tracking. Work owner-first and then migrate each complete consumer group end-to-end. Reuse existing tokens, theme overrides and presets wherever they fit; add a new shared contract only for a proven missing semantic role. Do not restart route audits or create another inventory.
- Stage 1 remains IN PROGRESS for its exhaustive maps, but it does not block this bounded migration.

## 11.38 — Shared top-level navigation button contract (2026-11-19)

### Scope and preflight
- Continued the application-wide migration from the existing action/navigation ownership map (Sections 11.12, 11.17–11.18 and 11.26); no new inventory or audit document was created.
- Confirmed the target branch is `feature/frontend-modernization`. No branch was created.
- Inspected the current-branch shared button preset owner, public Header navigation and AdminNavigation implementation.
- Kept navigation semantics separate from feature actions: top-level Header links share one spacing contract, while admin active/inactive state remains expressed through the existing MUI `variant` and `color` theme API.

### Source changes
1. `src/styles/presets/buttons.ts`
   - Added `BUTTON_STYLES.navigation` as the shared owner of the existing Header navigation item spacing and box-sizing values.
   - Reused existing button preset exports; no new token or visual value was introduced.
2. `src/components/layout/Header.tsx`
   - Removed the local `NAV_BUTTON_SX` visual constant.
   - Applied `BUTTON_STYLES.navigation` consistently to desktop navigation links, authenticated logout, and the authenticated welcome/profile link.
   - Mobile Drawer links retain their existing full-width stacked composition and are not forced into the desktop spacing contract.

### Verified and intentionally preserved
- `src/components/admin/AdminNavigation.tsx) was inspected as the parallel navigation consumer. Its active/inactive `contained`/`text` variants and `primary`/`inherit` colors already express semantic states through the MUI theme; no redundant sx preset was added.
- Header route definitions, authentication-dependent links, moderator visibility, logout flow, responsive drawer breakpoint, drawer open/close and keyboard behavior remain unchanged.
- Header-specific Toolbar and drawer geometry remain local structural composition, not part of the shared button skin.
- No routing, authorization, session, API, backend or business logic changes.

### Result
- **2 source files changed**: one shared preset owner and the Header consumer.
- The repeated Header navigation item spacing now has one owner; the AdminNavigation state styling remains on the existing theme contract.
- No arbitrary new visual values, component API, or navigation behavior was introduced.
- No build, tests, lint, CI or browser validation was run.

### Status and next
- Header top-level navigation spacing: **SOURCE CHANGES APPLIED**.
- AdminNavigation active/inactive state contract: **VERIFIED; existing MUI theme variants retained**.
- This is one bounded package in the wider app migration, not completion of the global action/navigation family.
- Next: continue with the audited shared icon-action family (edit/delete/remove/close/reorder controls) and trace its owner through image, profile, comments/social, points and admin consumers before changing individual controls.
- No build, tests, lint, CI or browser validation was run.


## 11.39 — Shared icon-action contracts across images, profile, social, comments, points and admin (2026-11-19)

### Scope and preflight
- Continued from the exact NEXT in Section 11.38 and the existing owner/consumer map in Sections 11.12, 11.17–11.19 and 11.26. No new audit document, branch or broad inventory was created.
- Confirmed target branch: `feature/frontend-modernization`; starting source HEAD was `e4c38e9c0f199bf70d9cfff5588d7c52994c37df`.
- Followed the existing `src/styles/presets/buttons.ts` owner through the audited image-upload, image-gallery/lightbox, profile-image, comment/reply, social, point-reorder, password-visibility and admin-image-preview controls.
- Kept distinct native-button compositions (profile image delete/view triggers and admin avatar preview triggers) distinct from MUI IconButton controls; only their shared keyboard-focus treatment was reused where appropriate.

### Source changes
1. `src/styles/presets/buttons.ts`
   - Added `ICON_ACTION_STYLES` as the shared owner for the circular icon-action shape, keyboard `:focus-visible` treatment and semantic primary, danger, report and inverse image-control variants.
   - Reused existing palette/UI color tokens and the already-established 2px focus outline with 3px offset. Existing MUI `small`/`medium`/`large` sizing remains the dimension contract; no new size or color token was introduced.
2. `src/styles/presets/image-upload.ts`
   - Routed per-image remove, mobile remove-all and camera-upload icon controls through the shared danger/base/primary contracts.
   - Kept the desktop Remove All text button and all upload field/preview geometry unchanged.
3. `src/styles/presets/image-gallery.ts`
   - Composed close/previous/next lightbox controls from the shared inverse image-control contract.
   - Kept absolute positioning, z-index, edge offsets and vertical centering in the image-gallery owner.
4. `src/styles/presets/profile-image.ts`
   - Reused the shared inverse image-control contract for fullscreen close.
   - Reused the shared focus contract for personal profile delete/view triggers and the interactive admin profile-image avatar.
5. `src/styles/presets/cards.ts`
   - Composed PointCard reorder-button presentation with the shared icon-action focus contract; visibility and padding remain point-card-specific.
6. Updated direct MUI IconButton consumers:
   - `src/components/comments/CommentsSection.tsx`
   - `src/components/comments/RepliesSection.tsx`
   - `src/components/comments/CommentsToggle.tsx`
   - `src/components/social/EngagementBar.tsx`
   - `src/components/social/FavoriteButton.tsx`
   - `src/components/social/LikeButton.tsx`
   - `src/components/social/ReportButton.tsx`
   - `src/components/social/TripGroupSocialActions.tsx`
   - `src/components/common/PasswordField.tsx`
   - `src/components/admin/AdminImages.tsx`

### Existing consumers verified and intentionally retained
- `ImageLightbox.tsx` consumes the updated close/previous/next presets.
- `ImageUploadField.tsx` and `ProfileImage.tsx` consume the shared remove presets; `CustomFileUploadButton.tsx` consumes the shared camera-upload preset.
- `PointCard.tsx` consumes the updated reorder preset.
- `AdminUserProfileImage.tsx` consumes the updated interactive avatar preset.
- `AdminUsers.tsx` uses text Edit/Delete actions and a clickable Avatar rather than MUI IconButton; it was not converted into an icon-action control.
- `ProfileImage` retains its custom circular image delete/view trigger geometry; it was not replaced with a generic IconButton.
- `ImageGallery` itself has no icon-action controls; its fullscreen controls remain owned by the shared `ImageLightbox`.

### Preserved behavior and boundaries
- Preserved handlers, mutations, pending/disabled states, accessible labels, tooltips, `aria-pressed`, `aria-expanded`, badge counts, like animation, social permissions and comment/reply state.
- Preserved MUI `size` values and their existing hit-area variants, existing dynamic `color` props, overlay-specific padding, image-control backgrounds, lightbox positioning, profile-image geometry and PointCard reorder visibility.
- Destructive comment/reply and image-remove actions now select the shared danger role where that was already their existing semantic color. ReportButton retains its existing dynamic color and hover behavior through the named report role.
- No component public API, route, API call, DTO, upload behavior, validation, authentication, backend or business logic changed.
- This closes the audited icon-action group for the listed owners and consumers; it does not claim that every icon-only/native action in the repository has been exhaustively mapped. The broader action matrix and Stage 1 consumer maps remain open.

### Result
- **15 source files changed**: 5 shared preset owners and 10 direct component consumers.
- The shared icon-action focus and tone contracts now flow through image upload/lightbox, profile, comments/replies, social actions, password visibility, point reordering and admin image preview.
- Existing consumer components that already used these presets required no unnecessary source edits.
- No build, tests, lint, CI or browser validation was run.

### Status and next
- Audited icon-action group (images/profile/comments/social/points/admin/password reveal): **SOURCE CHANGES APPLIED** for the scoped consumer set.
- Global button/action work remains open for text actions, map controls, trip/point management, admin forms/tables, pagination/stepper and remaining native controls.
- Next: **11.40 — complete the next shared semantic action group across map, point/trip management and admin consumers**, reusing the Section 11.12 dependency map and existing presets. Do not reopen the completed icon-action group or restart inventory.
- Stage 1 remains IN PROGRESS; no build, tests, lint, CI or browser validation was run.


## 11.40 — Trip edit controls and Admin Users action roles (2026-11-19)

### Scope and preflight
- Continued from Section 11.39 NEXT using the existing Section 11.12 C1 action ownership map; no new audit or inventory was created.
- Confirmed target branch: `feature/frontend-modernization`.
- Inspected current branch source for `PointLocationPicker`, `TripLocationPicker`, `AddressAutocomplete`, `TripMapSection`, `TripActions`, `PointActions`, `PointForm`, `TripForm`, `EditTripLayout` and `AdminUsers`, plus the shared button and map-control preset owners.
- The map picker/search/clear-marker actions, PointForm and TripForm primary/add actions, TripActions navigation/management actions, TripMapSection MobileStepper slots and PointForm search action were already using the existing semantic preset or MUI theme-owned default. They were intentionally not given duplicate local styling.

### Source changes
1. `src/components/trips/EditTripLayout.tsx`
   - Replaced the local day-number ButtonGroup geometry with the existing `DAY_NUMBER_BUTTON_GROUP_SX` owner.
   - Applied the existing `BUTTON_STYLES.dayDecrement` and `dayIncrement` contracts to the decrease/increase controls.
   - Applied `BUTTON_STYLES.primary` to the explicit Set/Change Day action.
   - Composed the existing image-delete overlay geometry and background colors with `ICON_ACTION_STYLES.danger`; the feature-specific overlay position and trip-image control colors remain local to the image owner.
2. `src/components/admin/AdminUsers.tsx`
   - Applied `BUTTON_STYLES.primary` to Edit User.
   - Applied `BUTTON_STYLES.dangerText` to Delete, retaining its existing `color="error"` behavior and confirmation flow.

### Verified and intentionally preserved
- Map picker controls retain their existing semantic ownership in `map-controls.ts` and `buttons.ts`; no new map button preset was needed.
- Trip creation and trip management actions in `TripForm` and `TripActions` already consume shared primary/trip-action contracts.
- TripMapSection's Next/Back controls are supplied to MUI `MobileStepper` as its native slots and retain the theme-owned default rather than receiving a conflicting filled-button skin.
- Admin user pagination remains on the existing MUI default button contract; this batch does not invent a new pagination appearance.
- Preserved button handlers, day-number locking and bounds, disabled/submitting states, selected-day behavior, image deletion lifecycle, confirmation, routing, pagination state and authorization visibility.
- No API, DTO, route, backend, data, validation or business logic changed.

### Result
- **2 source files changed**; 9 related map/point/trip/admin files were inspected and existing contracts retained where already correct.
- Trip edit day-number controls and image deletion now reuse the existing shared semantic owners; Admin Users edit/delete actions now explicitly consume the existing primary/danger roles.
- No new token, preset, component or public API was introduced.
- No build, tests, lint, CI or browser validation was run.

### Status and next
- Trip edit day controls and Admin Users action roles: **SOURCE CHANGES APPLIED**.
- Map picker, trip action and stepper paths inspected in this bounded group: **EXISTING SHARED/THEME CONTRACTS RETAINED**.
- The global C1 action workstream remains open: remaining auth/admin pages, admin logs/reports, TripPagination/TripDaysNav/TripFilters, remaining point actions, common feedback/error/retry actions and exhaustive native button/link call-site mapping still need verification and migration where required.
- Next: **11.41 — continue the remaining admin/auth form action consumers and pagination/day-navigation contracts** from Section 11.12. Do not repeat the already-migrated trip edit and icon-action controls.
- Stage 1 remains IN PROGRESS; no build, tests, lint, CI or browser validation was run.


## 11.41 — Shared admin pagination and trip day-navigation contracts (2026-11-19)

### Scope and preflight
- Continued from Section 11.40 NEXT using the existing Section 11.12 action-role matrix; no new inventory was created.
- Re-read the current auth form consumers, AdminUserForm, AdminUsers, AdminReports, AdminFailedLogs, AdminRouteNotFoundLogs, AdminImages, TripDaysNav and TripPagination.
- Auth form primary/secondary/back actions and AdminUserForm Save/Delete/Back already consume existing semantic presets; they were retained without redundant overrides.
- The trip day navigation had a component-local selected/hover/spacing style. Admin user, report, failed-login, route-not-found and image-inventory tables repeated default Previous/Next button sizing.
- TripPagination remains a crawlable native-link component; its CSS module currently owns list structure only. It was not converted to MUI buttons or altered in a way that could compromise real hrefs and aria-current semantics.

### Source changes
1. Added `src/styles/presets/pagination.ts`:
   - `ADMIN_PAGINATION_BUTTON_SX` centralizes the shared Previous/Next minimum width for admin data tables.
   - `TRIP_DAY_PAGE_ITEM_SX` centralizes the existing day-number margin, selected colors and hover colors using semantic UI tokens.
2. Updated `src/components/admin/AdminReports.tsx`, `AdminFailedLogs.tsx`, `AdminRouteNotFoundLogs.tsx`, `AdminUsers.tsx` and `AdminImages.tsx`:
   - All audited Previous/Next controls now consume `ADMIN_PAGINATION_BUTTON_SX`.
   - Existing layout presets, page state, disabled conditions, fetching behavior, API calls and labels are unchanged.
3. Updated `src/components/trips/TripDaysNav.tsx`:
   - Removed the local `PAGE_ITEM_SX` declaration and consumes `TRIP_DAY_PAGE_ITEM_SX`.
   - Preserved AppBar shell geometry, pagination count/selection, day-number labels, URL updates, client-side `onSelect` behavior and scroll behavior.

### Preserved and intentionally outstanding
- Auth form actions and AdminUserForm actions were already correctly using the existing shared roles; no unnecessary changes were made.
- Admin pagination row geometry remains owned by `ADMIN_PAGINATION_SX` / `IMAGE_PAGINATION_ROW_SX`; this package centralizes only the repeated button contract.
- TripPagination remains native anchors with real destinations and `aria-current`; its link/active/focus visual contract remains open for a separate CSS-variable/preset migration.
- TripFilters and its styled search/select composition remain open; they were not mixed into this pagination package.
- No API, route, DTO, data, validation, authentication, backend or business logic changed.

### Result
- **7 source files changed**: 1 new shared preset owner and 6 consumers.
- All repeated admin Previous/Next controls in the five audited admin tables now share one semantic sizing contract; trip day-page item states now have one shared preset owner.
- No build, tests, lint, CI or browser validation was run.

### Status and next
- Admin table pagination button sizing: **SOURCE CHANGES APPLIED** across AdminUsers, AdminReports, AdminFailedLogs, AdminRouteNotFoundLogs and AdminImages.
- Trip day-navigation item states: **SOURCE CHANGES APPLIED**.
- Auth/AdminUserForm actions: **EXISTING SHARED CONTRACTS VERIFIED**; no duplicate styling added.
- Remaining C1 work includes TripPagination native-link visual states, TripFilters field/search contracts, admin log/report detail actions, remaining point/trip actions, common feedback/error/retry actions and exhaustive native button/link call-site mapping.
- Next: continue with **TripPagination + TripFilters**, then reconcile the original Section 10.1 ledger against current branch source before reporting the real remaining migration count.
- Stage 1 remains IN PROGRESS; no build, tests, lint, CI or browser validation was run.


## 11.42 — TripPagination native-link states and TripFilters shared presentation (2026-11-19)

### Scope and preflight
- Continued from Section 11.41 NEXT using the existing trip-list styling ownership and CSS/token architecture; no new audit document or inventory was created.
- Confirmed TripPagination is a crawlable native-link component with real href destinations and an aria-current page marker. Kept it as native Next.js links/spans; no MUI Button conversion.
- Confirmed TripFilters owned legacy styled-components and several local sx objects for the toolbar, three selectors and search field. Moved the complete presentation contract into one shared preset owner.

### Source changes
1. Added `src/styles/presets/trip-filters.ts`:
   - Centralized responsive toolbar/select-group layout, selector sizing, inverse label/select colors, search surface, icon placement, native search-button styling and InputBase sizing.
   - Preserved the existing 670px stacking breakpoint, 600px search-width breakpoint, 200/180px selector minimum widths, margins, search minimum width, 12ch-to-20ch focus expansion and original MUI transition timing.
2. Updated `src/components/trips/TripFilters.tsx`:
   - Removed component-local styled components and local sx constants.
   - All selector/search visual values now come from the named trip-filter preset owner.
   - Preserved query state, choice loading, filter-on-select behavior, Enter/click search submission, URL construction and page reset.
3. Updated `src/components/trips/TripPagination.module.css` and `TripPagination.tsx`:
   - Kept CSS Modules responsible for this component's unique pagination structure and native-link states.
   - Shared visual values use existing CSS variables already emitted by the MUI theme; no unregistered CSS variable was introduced.
   - Added explicit link/current-page classes and keyboard-visible focus styling while retaining actual hrefs, aria-current, accessible labels and page list generation.

### Preserved and verified
- TripPagination still renders native Next.js links with real destinations for Previous, adjacent pages and Next. The current page remains a non-link span with aria-current="page".
- TripFilters still resets to page 1 on each changed filter and preserves search/group/transport/sort query parameters.
- Preserved all existing labels, option values, controlled input state, keyboard Enter handling and responsive breakpoints.
- No API, route, DTO, data, validation, authentication, backend or business logic changed.

### Result
- **4 existing source files updated and 1 shared preset file added**.
- TripPagination link/current-page visual states and TripFilters visual contracts now have explicit ownership; no style prop or ad hoc local style objects remain in TripFilters.
- No build, tests, lint, CI or browser validation was run.

### Status and next
- TripPagination native-link visual states: **SOURCE CHANGES APPLIED**.
- TripFilters search/select/toolbar presentation: **SOURCE CHANGES APPLIED**.
- Next: reconcile every candidate in Section 10.1 against current `feature/frontend-modernization` source, including all completed Sections 11.28–11.42, and report the verified remaining migration count by category. Do not use the old PARTIAL/CHANGE REQUIRED labels as a remaining count without source-level verification.
- Stage 1 remains IN PROGRESS; no build, tests, lint, CI or browser validation was run.

## 11.43 — Reconciliation of the Section 10.1 ledger against migrations 11.28–11.42 (2026-11-19)

### Reconciliation method and limits
- Matched all **127 unique file paths** in Section 10.1 against the current branch and the source-change records in Sections 11.28–11.42.
- The old ledger contains 53 CHANGE REQUIRED, 39 PARTIAL, 1 SOURCE MIGRATED, and 34 structural/non-visual/data/supporting-dependency rows. The historical **92** is only the count of old CHANGE REQUIRED + PARTIAL labels; it is **not** the remaining migration count.
- A migration section can close one responsibility while other responsibilities in the same file remain. Therefore, files touched by 11.28–11.42 are not automatically counted as fully migrated.
- The 34 structural/non-visual/data rows are not 34 source migration tasks. Route wrappers and barrel exports are tracked through their owning visual components. The OG renderer remains a separate supporting-dependency review, not an ordinary DOM migration.
- This reconciliation is a dependency/workstream plan, not a claim that every remaining line in all 127 files has been exhaustively re-reviewed. The ledger's old per-file residual descriptions must be refreshed as each workstream is completed.

### Remaining coordinated migration workstreams
The remaining work is organized into **12 owner-first workstreams**. A workstream may touch multiple files; shared owners are migrated before their consumers, and completed scopes from 11.28–11.42 are not repeated.

1. **Point and trip card/list actions** — PointCard, PointActions, PointList, TripCard, TripActions; finish remaining card/list geometry, semantic action roles and state parity.
2. **Point and trip forms / shared fields** — PointForm, TripForm, TripSelectField, EditPointPage, EditTripLayout, PasswordField, PasswordRequirements and form consumers; finish field, submit/navigation, validation and pending-state contracts.
3. **Map renderer and map feature composition** — GoogleMapView, PointLocationPicker, TripLocationPicker, TripMapSection, CreatePointPage and EditPointPage; finish canvas/loading geometry, feature-specific controls and feedback states without merging distinct map flows.
4. **Admin tables and actions** — AdminUsers, AdminFailedLogs, AdminImages, AdminReports, AdminRouteNotFoundLogs and AdminUserForm; finish table surfaces, selection/disclosure, pagination and action states. Reuse the pagination/icon-action scopes already migrated.
5. **Comments and social interactions** — CommentsSection, CommentsToggle, RepliesSection, EngagementBar and TripGroupSocialActions; finish disclosure, edit/delete/reply/report/submit states and residual local layout.
6. **Live tracking controls and surface** — LiveTracker; centralize Start/Stop/Reset/Follow roles and the tracking status/detail surface.
7. **Trip details and gallery composition** — PointSection, DayImagesGallery, TripDetails and TripDetailsView; finish parent-owned frames, text/layout composition and child-consumer parity without moving parent geometry into placeholders.
8. **Account route shells** — account layout, profile, favorites and my-trips pages; remove remaining React presentation styles and finish page/empty/loading/error composition.
9. **Public route shells and editorial pages** — public Home/Trips/Trip Details/live-tracking routes, HomeHero/HomeTrips, About and Privacy Policy; remove remaining React style transport and align editorial typography/spacing while retaining unique page structure.
10. **Shared surface/theme adoption** — surface/card/dialog theme owners and remaining Paper/custom surfaces; verify adoption by intended consumers instead of adding duplicate surface presets.
11. **Shared common controls and application shell** — BackButton, ExpandableText, NotificationProvider, NotFound, Header drawer, AdminNavigation/layout and Footer; finish semantic navigation/disclosure/feedback roles and shell spacing/surfaces. Header top-level navigation and ConfirmDialog action roles already migrated are not repeated.
12. **OG image renderer exception review** — renderTripOgImage; determine and document whether Satori's required style-object API is a justified renderer-specific exception. Do not mechanically convert it to DOM styling abstractions.

### Counting rule going forward
- **12 remaining coordinated workstreams** is the actionable planning count as of this reconciliation, not a count of individual files or atomic style declarations.
- Do not report 92 as remaining, and do not decrement a workstream merely because one of its files was touched. Close a workstream only after its shared owner, mapped consumers, residual responsibilities and preserved behavior have been reconciled in source.
- Next execution: workstream 12 — OG image renderer exception review. Workstreams 1–11 have been closed in Sections 11.45–11.57. No build, tests, lint, CI or browser validation was run.
## 11.44 — Point/trip card and action layout reconciliation (2026-11-19)

### Source changes
1. Added `POINT_SOCIAL_ACTIONS_SX` to `src/styles/presets/social.ts`, composing the existing social-action row contract while preserving the PointActions-specific 0.25 gap and zero vertical margin.
2. Updated `src/components/points/PointActions.tsx` to consume that preset instead of a local inline sx object. Social eligibility, loading/error status, target IDs and initial counts/states are unchanged.
3. Updated `src/components/trips/TripCard.tsx` to consume the existing `TRIP_CARD_CONTAINER_SX` instead of duplicating the same fixed width/height/box-sizing/overflow values inline. This also removes the stale undefined `TRIP_CARD_HEIGHT` reference and uses the already-imported preset.
4. Added `TRIP_ACTIONS_CONTENT_SX` to `src/styles/presets/layouts.ts` and updated `src/components/trips/TripActions.tsx` to consume it instead of owning a local `display: contents` object.

### Preserved
- Point social operation permissions, authentication gating, SocialConfigStatus, button targets and counts.
- TripCard fixed 352px frame, 540px height, viewport max-width, box sizing and overflow; image/day selection, swipe behavior, pagination, likes and Details href remain unchanged.
- TripActions ownership check, route destinations, confirmation text/flow, pending/disabled states, mutation handlers and query-cache updates remain unchanged.
- PointCard and PointList were rechecked: their card/list geometry, text, action row and icon focus contracts are already owned by existing presets; no redundant styles were added.

### Result
- **5 source/preset files updated**: two preset owners and three consumers.
- Ledger rows for PointCard, PointActions, PointList, TripCard and TripActions refreshed to reflect current ownership and residual work.
- Workstream 1 is **partially complete**. Remaining: cross-caller/state verification and semantic review of TripCard stepper/Details and TripActions action roles. Do not repeat the centralized geometry/layout work.
- No API, data, validation, authentication, routing, mutation or business logic changed.
- No build, tests, lint, CI or browser validation was run.
## 11.45 — Point/trip card and action workstream closed (2026-11-19)

- Reconciled PointCard → PointList, TripCard → TripList, PointActions and both TripActions sections against their actual callers and state boundaries.
- PointCard move actions preserve permission checks, disabled state, and first/last-item visibility. Edit/Delete retain their primary/danger roles.
- TripCard has one direct shared-list consumer. Its fixed frame, Details action, image stepper, day pagination and swipe behavior use existing preset/theme contracts. Next/Back use MUI Button defaults; disabled boundary behavior is explicit. No additional semantic preset is warranted.
- TripActions retains owner gating, navigation vs management rendering, confirmation, mutation pending states, route destinations and query updates. Its wrapper layout now uses TRIP_ACTIONS_CONTENT_SX.
- PointActions wrapper now uses POINT_SOCIAL_ACTIONS_SX.
- **Workstream 1 — Point and trip card/list actions: COMPLETE.** Five source/preset files were changed in 11.44; no API or business behavior changed.

## 11.46 — Point/trip form contracts (2026-11-19)

### Source changes
- Added named point-form layout contracts and password-requirement list/item contracts to src/styles/presets/forms.ts.
- Migrated PointForm.tsx form stack, title, map-search row, responsive action row and button dimensions. Existing primary button roles remain composed with the shared preset.
- Migrated PasswordRequirements.tsx list and item layout; success/neutral feedback continues to use MUI palette roles.
- Added named TripForm contracts for location frame, Card form layout, title, error inset, day row, price/currency row, currency frame, price field and responsive action row. Migrated TripForm.tsx to consume them.
- Added EditTripLayout contracts for the responsive parent grid, map frame, form panel, heading, day field/row, price/currency row, action row, image section/grid/tile/delete overlay and empty-image frame. Migrated EditTripLayout.tsx to consume them.
- Removed the React style prop from the EditTripLayout day input; text alignment is now owned by EDIT_TRIP_DAY_FIELD_SX.
- PasswordField already consumes ICON_ACTION_STYLES.base; TripSelectField uses MUI TextField/Autocomplete/MenuItem defaults and has no local presentation object. No duplicate presets were added.

### Preserved
- React Hook Form registration, validation/resolver wiring, field names, values, select option behavior, searchable currency behavior and backend-config fallback.
- Trip create/edit API calls, image retry/upload flow, coordinate updates, day-number conflict checks/reordering, confirmation, cache updates and routing.
- Responsive breakpoints and geometry from the existing PointForm, TripForm and EditTripLayout; map/image region ordering and each parent-owned image frame remain separate.
- Password visibility, maxLength, disabled/error/helper text behavior and password requirement validity states.
- No API, DTO, validation, authentication, route, data or business logic changed.

### Result and next step
- Six files changed in this form batch: forms.ts, PointForm.tsx, PasswordRequirements.tsx, TripForm.tsx, EditTripLayout.tsx and PasswordField.tsx (format-only). TripSelectField.tsx was reviewed and left unchanged.
- Workstream 2 remains **IN PROGRESS**. Remaining: audit ProfileForm and auth form consumers against ACCOUNT_FORM_FIELDS_SX / AUTH_FORM_*; then reconcile field/error/helper-text contracts across all form consumers.
- No build, tests, lint, CI or browser validation was run.
## 11.47 — Account and authentication form adoption (2026-11-19)

### Source changes
- Added ACCOUNT_FORM_TITLE_SX, ACCOUNT_FORM_ACTIONS_SX and ACCOUNT_FORM_READONLY_FIELD_SX; ProfileForm now consumes them instead of local title, disabled-email and action-row sx objects.
- Added ACCOUNT_PASSWORD_SAVE_BUTTON_SX; ChangePasswordForm now composes it with the existing primary button role.
- LoginForm password visibility IconButton now consumes ICON_ACTION_STYLES.base.
- Added AUTH_FORM_BACK_BUTTON_SX; ForgotPasswordForm and ResendVerificationForm no longer carry their own BackButton margin objects.
- Added EMAIL_VERIFICATION_CARD_SX and EMAIL_VERIFICATION_TITLE_SX; VerifyEmailForm no longer owns its card layout/size or title-weight objects.
- ResetPasswordForm already uses AUTH_FORM_* and shared PasswordField/PasswordRequirements contracts; no source change required.
- RegisterForm already uses AUTH_FORM_* and shared password components/action presets. Its dynamic pointer-events state on the terms label remains for a later interaction-state-specific migration; it was not replaced with a visually different disabled control.

### Preserved
- Profile update/upload/password expansion flow, disabled email semantics, submit/back/password actions and validation.
- Password change/reset/login/register/verification API flows, field registration, CAPTCHA lifecycle, redirect timing, visibility toggles, helper/error messages and pending/disabled states.
- Verification success/error/loading card geometry and navigation.
- No auth/API/validation/routing/business logic changed.

### Result
- Seven source/preset files changed in this batch: forms.ts, ProfileForm.tsx, ChangePasswordForm.tsx, LoginForm.tsx, ForgotPasswordForm.tsx, ResendVerificationForm.tsx and VerifyEmailForm.tsx. ResetPasswordForm and RegisterForm were reviewed; no unnecessary changes were made.
- Workstream 2 remains **IN PROGRESS**. Remaining: resolve RegisterForm's dynamic terms-label interaction state using an approved state class/abstraction; review ProfileForm/ChangePasswordForm field error/helper parity; inspect remaining auth/account forms not yet included in this pass.
- No build, tests, lint, CI or browser validation was run.
## 11.48 — Form workstream closure (2026-11-19)

- Added PROFILE_FORM_SX and CHANGE_PASSWORD_FORM_SX so profile/password variants no longer compose shared account fields with local inline sx objects.
- Replaced RegisterForm's dynamic pointer-events sx with a scoped CSS Module state class. The checkbox remains disabled while locked; the class preserves the prior pointer-events behavior for the label/link without changing disabled visuals.
- Reconciled PointForm, TripForm, EditTripLayout, TripSelectField, PasswordField, PasswordRequirements, ProfileForm, ChangePasswordForm and the auth form set: Login, Register, Forgot Password, Reset Password, Verify Email and Resend Verification.
- Shared form wrappers, titles, action rows, field stacks, read-only email state, password visibility, requirement list, verification status card and back-button spacing are now preset/theme/CSS-module owned. Native MUI TextField/Autocomplete states continue to inherit the centralized MUI theme; no duplicated field styles were introduced.
- Confirmed no remaining component-local style object in the migrated PointForm, TripForm or EditTripLayout presentation paths; their remaining sx props reference named presets or runtime image-upload state abstractions.
- **Workstream 2 — Point and trip forms / shared fields: COMPLETE.** The auth/account form consumers in its dependency map were included; AdminUserForm remains in the separate Admin workstream.
- No API, DTO, validation, authentication, route, data or business logic changed. No build, tests, lint, CI or browser validation was run.
## 11.49 — Map renderer and feature composition workstream closed (2026-11-19)

- Reconciled GoogleMapView, PointLocationPicker, TripLocationPicker, TripMapSection, CreatePointPage and EditPointPage against their current preset owners.
- GoogleMapView uses dimension-preserving renderer/loading helpers; map lifecycle, markers, paths, InfoWindows and event callbacks remain SDK/renderer behavior.
- PointLocationPicker and TripLocationPicker use their own semantic AddressAutocomplete variants, feature-specific map frames/actions/hints and existing button roles. Their distinct GPS, coordinate, marker-clear and address-selection behavior remains unchanged.
- TripMapSection uses the shared map card/stepper contracts; CreatePointPage uses the CREATE_POINT_* page layout contracts and point panel preset.
- Migrated the remaining EditPointPage parent composition into named EDIT_POINT_* presets: root page, loading/error, map frame, responsive content ordering, form card, image section/grid/tile/delete overlay and empty-image frame. The image tile and placeholder retain their own parent-owned geometry.
- All reviewed map feature components now reference named presets or MUI theme defaults for presentation; no direct React style prop or component-local visual object remains in these map/page compositions.
- **Workstream 3 — Map renderer and map feature composition: COMPLETE.** No map lifecycle, coordinates, GPS, autocomplete, marker, selection, API or navigation behavior changed.
- No build, tests, lint, CI or browser validation was run.
## 11.50 — Admin tables and actions (2026-11-19)

### Source changes
- Added src/styles/presets/admin.ts as the owner for admin directory cards, bulk-selection toolbar, route diagnostics, image inventory/preview and user-edit panel composition.
- Migrated AdminUsers grid/cards/content/identity/action spacing and pagination wrapper; existing profile avatar modes, preview, role visibility and primary/danger action roles remain.
- Migrated AdminFailedLogs selection toolbar and assigned the shared danger-text role to Delete selected.
- Migrated AdminReports destructive Delete to BUTTON_STYLES.dangerText; existing table/pagination contracts retained.
- Migrated AdminRouteNotFoundLogs diagnostic field/pre/details layout and expanded-cell state to named admin presets; View/Hide remains a native MUI disclosure action.
- Migrated AdminImages missing-thumbnail layout, alert/toolbar spacing, pagination rows, preview trigger/thumbnail/url cell, close action, DialogContent and full-image stage to named admin presets.
- Migrated AdminUserForm panel geometry, password-field stack and Back placement to admin presets; Save/Delete retain existing semantic button roles.

### Preserved
- Admin API requests, pagination state and limits, filtering/role visibility, selection behavior, bulk operations, confirmation flows, delete mutations, query invalidation and error handling.
- Route diagnostic expand/collapse behavior and content formatting; image preview open/close, image URLs, sizing/fit and selection/thumbnail generation behavior.
- Admin user authorization rules, field registration, role/status controls, optional password update, profile image handling and routing.
- No API, DTO, validation, authorization, route, data or business logic changed.

### Result
- Added one shared preset owner and updated six admin source components; all six ledger rows refreshed.
- **Workstream 4 — Admin tables and actions: COMPLETE.** Admin navigation/shell remains tracked under the separate application-shell workstream.
- No build, tests, lint, CI or browser validation was run.
## 11.51 — Comments and social interaction presentation (2026-11-19)

- Added `src/styles/presets/comments.ts` for comment panel/list/card, edit/create forms, author/body/timestamp, reply nesting, social rows and toggle layout.
- Migrated CommentsSection and RepliesSection to the named contracts; all edit/delete/cancel/reply icon actions use shared icon-action roles. Comment Cards continue to inherit the MUI Card theme surface.
- Replaced CommentsToggle's native inline flex style with MUI Box + named row preset; empty-label spacing is centralized.
- Added social preset helpers for inline action rows, Trip Group actions, compact error feedback and runtime overlay sizing. EngagementBar no longer carries its own nested visual object for overlay size/badge behavior.
- TripGroupSocialActions uses shared action-row/error contracts. LikeButton, FavoriteButton and ReportButton already consumed shared icon/button contracts from 11.39; their ledger rows are now reconciled.

### Preserved
- Comment/reply CRUD, permissions, authentication/config gates, query keys/invalidation, optimistic/cache behavior, counts, loading/errors, nested reply state and confirmation flows.
- Like/favorite/report mutations and eligibility, share fallback, animation state, comments open/close control, overlay event propagation, icon sizes and compact badge behavior.
- No API, DTO, validation, auth, routing, data or business logic changed.

### Result
- Added one comments preset owner; updated five comment/social consumers and the social preset owner; reconciled three previously migrated social button consumers.
- **Workstream 5 — Comments/social interactions: COMPLETE.**
- No build, tests, lint, CI or browser validation was run.
## 11.52 — Live tracking controls and surface (2026-11-19)

### Source changes
- Added `src/styles/presets/tracking.ts` as the owner for LiveTracker map frame, loading state, control row/status, telemetry grid/stat frame/value, and Google Maps SDK configuration.
- Migrated `LiveTracker.tsx` away from component-local `TRACKING_SURFACE_SX` and inline visual objects.
- Start tracking uses the shared primary role; Stop tracking uses the shared danger role. Reset and Center on my location retain MUI default text-button styling because they are non-destructive utility actions.
- Google Maps `mapContainerStyle` and Polyline `options` remain SDK-required configuration objects, now centralized in the tracking preset owner; they are not React `style` props.

### Preserved
- GPS collection, start/stop/reset behavior, follow toggle and map pan, Google Maps load/unmount lifecycle, drag-to-disable-follow, route path/marker, telemetry values/formatting, session-only storage notice, loading and warning states.
- No GPS, tracking hook, API, data, route, backend or business logic changed.

### Result
- One shared tracking preset owner and one migrated component; the Section 10.1 LiveTracker row is reconciled.
- **Workstream 6 — Live tracking controls/surface: COMPLETE.**
- No build, tests, lint, CI or browser validation was run.

### Next
- Workstream 7 — Trip Details/gallery composition. Continue from the existing Section 10.1 and Sections 11.12/11.34 ownership maps; do not redo image gallery or image component migrations already closed in 11.34.
## 11.53 — Trip Details and gallery composition (2026-11-19)

### Source changes
- Added `src/styles/presets/trip-details.ts` for TripDetails card/header/metadata/description/action/social layout, sticky day-navigation shell and PointSection composition.
- Migrated `TripDetails.tsx`: removed `React.CSSProperties` aliases and all React `style` props; card, metadata, description, action column and social row use named presets. Currency-info and expand/collapse IconButtons now use the shared focus-visible icon-action contract.
- Migrated `TripDetailsView.tsx` sticky shell to `getTripDetailsStickyHeaderSx`. Its unique responsive page grid, row composition and container-query behavior remain in `TripDetailsView.module.css`.
- Migrated `PointSection.tsx` card/content/title/note/description/action-row and empty-image frame to named presets. The point image frame remains parent-owned and distinct from the placeholder's internal rendering.
- Reconciled `DayImagesGallery.tsx`: it already used `DAY_IMAGE_PLACEHOLDER_FRAME_SX`; populated gallery rendering remains owned by ImageGallery. No redundant source change.

### Preserved
- Day selection and URL state, trip metadata, price/currency tooltip, description expand/collapse, favorite eligibility, TripActions navigation/management, Back destination, social/comment state and action ordering.
- Point selection/comment target, map-marker notice, ImageGallery behavior, placeholder parent dimensions, PointActions and comment toggle behavior.
- CSS Module page grid and responsive container-query composition remain intact; no gallery/lightbox internals were moved or reimplemented.
- No API, DTO, validation, auth, routing, data or business logic changed.

### Result
- Added one shared preset owner; updated three source components and reconciled DayImagesGallery as already migrated.
- **Workstream 7 — Trip Details/gallery composition: COMPLETE.**
- No build, tests, lint, CI or browser validation was run.

### Next
- Workstream 8 — Account route shells. Inspect route layout wrappers and shared account page/loading/error owners; do not redo ProfileForm/auth form migration.
## 11.53 — Trip Details and gallery composition (2026-11-19)

### Source changes
- Public Trip Details route now renders its main shell through `Box component="main"` and `CENTERED_PAGE_MAIN_SX`; removed the remaining React `style` prop and corrected the route to consume the existing `*_SX` contract.
- Reconciled `TripDetails` against `trip-details.ts`: card/header/title, price row, metadata, description, expand toggle, action column and social row are preset-owned; currency/expand controls use shared icon-action roles.
- Reconciled `PointSection`: Card/content/title/note/description/action row and populated/empty image parent frames use the existing trip-details/image-gallery presets. No React style prop remains.
- Reconciled `DayImagesGallery`: populated image composition remains delegated to ImageGallery; the empty-day square frame remains parent-owned through `DAY_IMAGE_PLACEHOLDER_FRAME_SX`.
- `TripDetailsView` continues to use `getTripDetailsStickyHeaderSx` and `STICKY_SOCIAL_SX`; its CSS Module remains the sole owner of the route-specific grid, responsive ordering and container-query behavior.

### Ownership decisions
- Kept TripDetailsView.module.css. Its 1200px page shell, two distinct grid tracks, 1120px container-query stack/order and 600px responsive gaps are unique structural composition, not reusable card/button skins.
- Kept the 20px margins on the Trip Details card in the page CSS Module: this is the parent-owned placement of that card in this one route, not a shared spacing contract. Existing `--ht-spacing-*` variables remain in use for shared responsive gaps.
- Kept parent frame ownership separate from SocialObjectPlaceholder and ImageGallery; no parent width/aspect-ratio rules were moved into child placeholders/gallery internals.

### Preserved
- Trip/day selection, query-string history replacement, comments targets/counts, selected-point state, social actions, image gallery/lightbox behavior, map selection and point navigation.
- Server trip fetch, day resolution, notFound handling, metadata/canonical and JSON-LD generation.
- No API, DTO, validation, routing, SEO data, auth or business logic changed.

### Result
- One public route source changed; existing trip-details/image-gallery/layout preset owners and child components were reconciled without duplicating their contracts.
- **Workstream 7 — Trip Details/gallery composition: COMPLETE.**
- No build, tests, lint, CI or browser validation was run.
## 11.54 — Account route shells (2026-11-19)

- Reconciled the complete `(account)` route group: shared layout, Profile, Favorites, My Trips, Trip Create, Trip Edit and Point Edit routes.
- Added `ACCOUNT_PROFILE_PAGE_SX` and `ACCOUNT_PROFILE_PANEL_SX` to `src/styles/presets/layouts.ts`; the Profile route now consumes these named presets instead of owning two local sx objects.
- `app/(account)/layout.tsx` already consumes `ACCOUNT_LAYOUT_MAIN_SX`; Favorites and My Trips already consume ACCOUNT_TRIPS_* contracts and shared TripList/action presets. No redundant changes were made.
- Trip Create, Trip Edit and Point Edit are route-only wrappers; their visual responsibilities are already owned by TripForm, EditTripLayout and EditPointPage respectively. The route files contain no independent visual declarations.
- RequireAuth, RequireTripOwner, metadata/noindex, server-side ID validation, notFound behavior, data fetching and route destinations were left unchanged.
- **Workstream 8 — Account route shells: COMPLETE.**
- No build, tests, lint, CI or browser validation was run.

### Next
- Workstream 9 — Public route shells/editorial pages. Reuse the existing public route ownership map and preserve route-specific content/SEO behavior.
## 11.54 — Account route shells and account landing pages (2026-11-19)

- Reconciled the authenticated route shell: `app/(account)/layout.tsx` uses `Box component="main"` with `ACCOUNT_LAYOUT_MAIN_SX`; Header/main/Footer ordering and RequireAuth remain unchanged.
- Favorites and My Trips already consume the shared `ACCOUNT_TRIPS_*` page/content/heading/loading/error/empty-state contracts. Confirmed no route-local presentation object remains; populated content delegates to the already-migrated TripList.
- Profile page now consumes both `ACCOUNT_PROFILE_PAGE_SX` and `ACCOUNT_PROFILE_PANEL_SX`. Replaced its duplicate inline theme callback/panel geometry with the imported preset; panel width, responsive padding, alignment and gap are preserved.
- Create Trip and Create Trip Point route files are composition-only Suspense wrappers; Edit Point and Edit Trip routes delegate to their already-migrated feature owners. No unnecessary route styles were introduced.

### Preserved
- RequireAuth, route metadata/noindex, query keys, trip/favorites API calls, loading/error/empty states, CTA URL and TripList behavior.
- ProfileForm and all profile image/password subflows; route remains a layout owner only.
- No API, auth, authorization, validation, route behavior or business logic changed.

### Result
- Updated the Profile route source; account shell/list pages were already migrated and verified against current branch.
- **Workstream 8 — Account route shells: COMPLETE.**
- No build, tests, lint, CI or browser validation was run.
## 11.55 — Public route shells and editorial pages (2026-11-19)

### Source changes
- Added `PublicLayout.module.css` and migrated the public layout's flex-fill wrapper from React `style` to a scoped structural class; Header/Footer order and short-page footer behavior remain unchanged.
- Extended the existing AboutPage.module.css with shared image, wide-image and marker-image classes; removed the page-local imageStyle object and all seven Next Image style props. Image sources, alt text, width/height, sizes, priority and ordering remain unchanged.
- Added `TRIPS_INTRO_SX` and migrated both normal and error-state Trips page introductions from caller-local max-width sx objects.
- Added `LIVE_TRACKING_PAGE_MAIN_SX` and migrated the live-tracking route main gutter to a named preset.
- Reconciled Home, Trips, public Trip Details and Privacy Policy routes. Home/trips/detail already used named page presets; Privacy Policy is fully CSS Module-owned with native href navigation and token-backed legal-specific typography/link roles.

### Preserved
- Public shell Header/Footer order and flex-fill behavior; Home/Trips server data, filtering, pagination, canonical/noindex metadata and SEO; public Trip Details metadata/JSON-LD/notFound flow.
- About content, image URLs, alt text, dimensions, responsive image row and editorial structure.
- Privacy document content, section IDs, anchors and native Back-to-Home href; live-tracking moderator redirect, noindex metadata and feature rendering.
- No API, DTO, auth, route behavior, SEO content, data or business logic changed.

### Result
- Added one legal return-link semantic preset; updated the legal page, AboutPage.module.css usage, typography and tracking preset consumers; existing PublicLayout.module.css and public route shell contracts were reconciled.
- **Workstream 9 — Public route shells/editorial pages: COMPLETE.**
- No build, tests, lint, CI or browser validation was run.

### Next
- Workstream 10 — Shared surface/theme adoption. Reconcile remaining Card/Paper/Alert/Accordion/Popover and custom surface consumers against the existing `surface.ts`, Card and Dialog theme owners; do not redesign established token values.
## 11.55 — Public route shells and editorial pages (2026-11-19)

### Source changes and reconciled ownership
- Public layout keeps Header → flexible page content → Footer. The flex-fill rule is owned by `PublicLayout.module.css`, not React style transport.
- Home route uses `CENTERED_PAGE_MAIN_SX`; HomeHero uses `HOME_HERO_INTRO_SX`; HomeTrips uses `HOME_HEADING_SX` and shared TripList.
- Trips route uses `CENTERED_PAGE_MAIN_SX` for both success/error branches and `TRIPS_PAGE_INTRO_SX` for the 900px editorial intro. The duplicate `TRIPS_INTRO_SX` implementation was removed; the new variant composes `HOME_INTRO_SX` instead of duplicating typography values.
- Live Tracking route uses `LIVE_TRACKING_PAGE_MAIN_SX`; its moderator gate and LiveTracker remain unchanged.
- About page image variants and responsive image rows use AboutPage.module.css classes; no React style prop remains. Image source, dimensions, alt text, priority and sizes are unchanged.
- Privacy Policy retains its dedicated long-form document CSS Module. Its return anchor keeps native `href="/"` navigation and now consumes `LEGAL_BACK_LINK_SX` from the shared button preset owner; the duplicate `.legalPageBack` skin was removed.
- Public Trip Details route was completed separately in Section 11.53 and uses `CENTERED_PAGE_MAIN_SX`.

### Preserved
- Public route metadata, canonical/noindex rules, server data fetching, trip query parsing, filters, pagination and error handling.
- Public shell order, footer positioning, editorial text/image content, image dimensions/sizes and legal document anchors.
- No API, DTO, auth, route semantics, SEO content or business logic changed.

### Result
- Added one legal return-link semantic preset; updated the legal page and CSS Module; consolidated Home/Trips intro variants; reconciled all public route/page owners.
- **Workstream 9 — Public route shells and editorial pages: COMPLETE.**
- No build, tests, lint, CI or browser validation was run.
## 11.56 — Shared surface/theme adoption (2026-11-19)

### Source changes
- Added `getOutlinedSurfaceStyles(theme)` to `src/theme/components/surface.ts` for bordered Paper surfaces without elevation.
- Added `src/theme/components/paper.ts`; MuiPaper outlined variants now receive theme background, divider border, shape radius and no shadow. Elevated Paper instances retain their existing MUI elevation behavior.
- Registered `MuiPaper` in `src/theme/index.ts`.
- Reduced `ADMIN_TABLE_CONTAINER_SX` to width only; its former local border radius is now owned by the shared Paper theme.

### Consumer reconciliation
- AdminReports, AdminFailedLogs, AdminRouteNotFoundLogs and AdminImages use `TableContainer component={Paper} variant="outlined"`; all now receive the shared outlined surface contract.
- Header Drawer Paper uses elevation 12 and is intentionally not affected by the outlined-only override.
- All MUI Cards continue to receive `getSurfaceStyles` through `card.ts`; all MUI Dialog Papers receive it through `dialog.ts`. ImageLightbox's imageLightbox background remains an explicit semantic variant layered on top.
- PANEL_SX uses the same elevated surface resolver. No Accordion or Popover component consumers were found in the current source tree.

### Preserved
- Card elevation, Dialog surface, ImageLightbox image-specific background, outlined admin table semantics, Drawer elevation and all table/dialog interactions.
- No API, DTO, data, route, business logic or content changes.

### Result
- Added one theme component override, extended the shared surface resolver and registered it centrally; four Paper table consumers now inherit the outlined surface from theme.
- **Workstream 10 — Shared surface/theme adoption: COMPLETE.**
- No build, tests, lint, CI or browser validation was run.

### Next
- Workstream 11 — Shared common controls and application shell. Continue from the existing Header/BackButton/NotificationProvider/error-state ownership maps; do not redo the already-migrated Header top navigation, ConfirmDialog action roles or icon actions.
## 11.56 — Shared surface and theme adoption (2026-11-19)

### Confirmed theme ownership
- `getSurfaceStyles(theme)` owns elevated surfaces: theme paper background, divider border, shape radius and semantic surface shadow. `MuiCard` applies it to every Card; `MuiDialog.paper` applies it to Dialogs.
- `getOutlinedSurfaceStyles(theme)` is applied only to `MuiPaper` with `variant="outlined"`. All four admin `TableContainer component={Paper} variant="outlined"` consumers therefore receive the shared outlined surface contract. No blanket `MuiPaper` root override was introduced.
- `PANEL_SX` composes the elevated surface primitive for admin/edit panels; `AUTH_FORM_SX` composes panel surface plus form geometry. `POINT_FORM_PANEL_SX` remains a distinct Card content/layout contract, not a competing surface skin.
- ImageLightbox's Dialog Paper background is an intentional `imageLightbox` semantic variant; its stage/controls are owned by image-gallery presets. ProfileImage, AdminImages, ConfirmDialog and ReportButton retain the shared Dialog Paper surface unless their image stage explicitly overrides it.
- Header Drawer Paper remains an elevated MUI Paper with explicit elevation 12; only its `height: auto` slot style moved to `HEADER_DRAWER_PAPER_SX`. It is not forced into the outlined table surface.
- Social overlay and sticky social surfaces retain their dedicated semantic tokens/presets; they are not converted into ordinary Cards.

### Source changes
- Header Drawer Paper sizing is owned by `HEADER_DRAWER_PAPER_SX` in `header.ts`; elevation 12 remains an explicit MUI slot prop. No duplicate layout-level alias remains.
- Added `NOTIFICATION_ALERT_SX` in `src/styles/presets/feedback.ts` and migrated NotificationProvider's Alert width away from local sx.
- Confirmed outlined Paper theme override covers the four admin table containers; no redundant per-table surface styles were added.

### Boundaries / preserved
- Alert/Snackbar severity, variant, placement, duration and close semantics remain MUI/notification-constant owned. No global Alert redesign was introduced.
- No MUI Popover consumer was found in the current TSX inventory; no speculative Popover override was added.
- Elevated Drawer, outlined admin tables, Cards, Dialogs, image stages and social overlays remain distinct semantic surface roles.
- No data, API, auth, routing or business logic changed.

### Result
- Two existing surface consumers migrated to named presets; one new feedback preset file added; existing theme surface owners reconciled.
- **Workstream 10 — Shared surface/theme adoption: COMPLETE.**
- No build, tests, lint, CI or browser validation was run.
## 11.57 — Shared common controls and application shell (2026-11-19)

### Source changes
- Admin and auth route shells now use `ROUTE_LAYOUT_MAIN_SX`, `AUTH_LAYOUT_MAIN_SX` and `AUTH_LAYOUT_CONTENT_SX`; AdminNavigation consumes `ADMIN_NAVIGATION_SX`. This removes the remaining route-shell React style props while preserving RequireRole/GuestOnly gates and shell order.
- NotFound's native Home button presentation now uses `NOT_FOUND_HOME_BUTTON_SX`; the CSS Module retains only the 404 hero/content structure.
- Added `src/styles/presets/header.ts`; Header root, welcome row, menu icon, Drawer Paper sizing, drawer navigation, drawer buttons and responsive Toolbar now use named contracts. All desktop, mobile and authenticated welcome/logout navigation actions use the existing BUTTON_STYLES.navigation role.
- Added GLOBAL_ERROR_PAGE_SX to the existing `feedback.ts`; `app/error.tsx` now uses it and BUTTON_STYLES.primary for Retry.
- Added EXPANDABLE_TEXT_COLLAPSED_SX; ExpandableText no longer owns a local clamp style object.
- NotificationProvider now uses its existing NOTIFICATION_ALERT_SX contract.
- Added ADMIN_NAVIGATION_SX; AdminNavigation's container layout is centralized while active/inactive MUI variant/color states remain the semantic state owner.
- Added `UI_SIZES.footerHorizontalPadding` and emitted `--ht-spacing-footer-horizontal` from the theme; Footer.module.css consumes the variable instead of a literal 20px padding.

### Verified and intentionally retained
- BackButton already applies BUTTON_STYLES.back last; callers retain only placement/dimension sx and own href/router behavior. No change required.
- NotFound retains its scoped CSS Module hero; the unique contrast-on-hero Home CTA uses `NOT_FOUND_HOME_BUTTON_SX` rather than the generic contained primary skin.
- AdminNavigation active/inactive states already use contained/text and primary/inherit MUI variants; no duplicate button style was introduced.
- Footer iOS landscape scroll behavior, listener cleanup and copyright content were untouched.

### Preserved
- Header route visibility, auth/moderator gates, logout flow, desktop/mobile breakpoints, Drawer open/close, Escape/keyboard handling and link destinations.
- Notification severity, durations, positions, callbacks and dismissal; ExpandableText DOM content, clamp measurement, state and SEO visibility; global error reset callback.
- No auth, route, API, data or business logic changed.

### Result
- Added header/feedback preset ownership and extended UI size/CSS-variable bridge; updated Header, ExpandableText, NotificationProvider, AdminNavigation, NotFound CTA, admin/auth route shells, Footer CSS and global error page.
- **Workstream 11 — Shared common controls and application shell: COMPLETE.**
- No build, tests, lint, CI or browser validation was run.

### Next
- Workstream 12 — OG image renderer exception review. Inspect Satori's renderer-only style-object requirements and document the narrow exception; do not convert renderer configuration into DOM styling.
## 11.58 — OG image renderer exception review (2026-11-19)

### Evidence
- `src/lib/images/renderTripOgImage.tsx` is the single composition owner used by both `app/opengraph-image.tsx` and `app/api/og/trips/[id]/route.ts` (and the Twitter metadata image entry point).
- It returns Next.js `ImageResponse`, which rasterizes a JSX tree server-side through Satori. The `style` objects are Satori's rendering input; ordinary DOM CSS Modules, browser stylesheets, React/MUI `sx` and theme component overrides do not style this output.
- Brand colors and image dimensions already come from `SEO_BRAND` and centralized OG constants. The remaining literal geometry/typography values describe one fixed 1200×630 generated composition, not recurring DOM component styles.
- Moving these objects into DOM-oriented presets or CSS Modules would not reduce coupling to the renderer and would not be consumed by ImageResponse. A renderer-specific style module could centralize literals but would still need to pass style objects to Satori and would add indirection without eliminating the required API.

### Approved SEO renderer boundary
- **APPROVED by the user on 2026-11-19:** SEO social-image rendering remains a separate presentation boundary. `src/lib/images/renderTripOgImage.tsx` may use inline `style` objects only for Satori/ImageResponse-supported properties required to render the generated Open Graph/Twitter image.
- This is an SEO image-renderer exception, not a general React styling exception. It does not apply to ordinary React DOM components, route pages, shared UI components or other SEO page content.
- Keep SEO brand colors, typography values, image dimensions and content/data assembly in their existing SEO-specific owners/constants. The renderer consumes these; do not pull its Satori composition into MUI/CSS Modules or the general application design-system presets.
- Any future SEO visual components should remain under the SEO/image-rendering boundary with their own explicit contracts; they must not silently introduce style props into the ordinary UI.
- No source change was made to the renderer, route, data loader, image fetching/validation or cache behavior.

### Status
- **Workstream 12 — SEO OG image renderer: COMPLETE.** The renderer-specific exception is approved and recorded.
- No build, tests, lint, CI or browser validation was run.
## 11.59 — Remaining social and dynamic background style-prop cleanup (2026-11-19)

- `ReportButton.tsx`: replaced the inline-flex tooltip wrapper with `REPORT_BUTTON_TOOLTIP_WRAPPER_SX`; replaced the reason-field margin with `REPORT_BUTTON_REASON_FIELD_SX`; replaced the stale `socialErrorTextStyle` reference with `SOCIAL_ERROR_TEXT_SX`; converted error/status spans to MUI Box with `sx`, including MUI's `visuallyHidden` accessibility contract. Report icon remains `ICON_ACTION_STYLES.report`.
- Added the two ReportButton-specific layout contracts to the existing social preset owner; no new semantic color or button variant was introduced.
- `useBackground.tsx`: replaced the dynamic React `style` background layer with Next Image (`fill`, `unoptimized`, dynamic `src`) inside a new `useBackground.module.css` fixed-position layer. The existing image preload/decode and generation/cancellation lifecycle remains unchanged.
- The CSS Module preserves fixed/inset positioning, negative stacking order, pointer-event suppression, cover sizing and centered image position. `unoptimized` keeps the original image URL path so the preloaded image can be reused.

### Preserved
- Report/withdraw state, permission gating, reason input, pending/error state, callbacks, dialog open/close and accessible status announcement.
- Background API loading, preload/decode, route eligibility, navigation generations, stale-request guards, next/current image context and image URL.
- No API, auth, data, routing or business logic changed.

### Result
- Two previously identified ordinary React style-prop owners migrated; one CSS Module added; social preset owner extended.
- Final current-branch spot-check of the previously flagged shared DOM owners (ScrambleHeading, WelcomeHeading, AppImage, SocialObjectPlaceholder, TripList, TripDetails, PointSection, CommentsSection, CommentsToggle, TripGroupSocialActions, ReportButton and useBackground) found no remaining React `style` prop. The only known remaining `style` objects are confined to `src/lib/images/renderTripOgImage.tsx`, the Satori/ImageResponse renderer.
- No build, tests, lint, CI or browser validation was run.

## 11.60 — User approval and SEO styling boundary (2026-11-19)

- User explicitly approved keeping SEO social-image generation separate from the general application design system.
- The only approved inline-style exception is `src/lib/images/renderTripOgImage.tsx`, for Satori/ImageResponse rendering only.
- SEO metadata, structured data, canonical/sitemap rules, OG image data and SEO brand constants remain in their dedicated SEO modules. This approval does not authorize styling exceptions elsewhere in the app.
- **All 12 coordinated migration workstreams are now closed at the source/audit level.** This does not mean the migration has passed runtime, visual-regression, accessibility or production validation; those checks have not been run.

### Remaining work after the migration batches
- Reconcile the historical Section 10.1 ledger and older NEXT TASK blocks against the completed Sections 11.28–11.60. Some legacy rows still show pre-migration statuses (for example TripPagination and image/social owners); these are stale historical records, not evidence that those migrations were not performed.
- Then, with explicit user permission, run the agreed validation sequence (typecheck/build/lint/tests as applicable) and browser/visual checks. No such validation has been run in this migration pass.
- No further Styling API exception is currently identified beyond the approved Satori SEO image renderer.


## 11.61 — File-level inventory reconciliation and first residual cleanup (2026-11-19)

### Section 10.1 file register
- The 127 entries in Section 10.1 are the complete file-level inventory carried forward from the approved audit scope. Each entry records the file's responsibility, the centralized contracts already consumed, and the remaining concern or reason no direct styling migration is required.
- The register is an inventory and migration ledger, not a claim that all 127 files have been re-opened and re-verified against the current branch in this pass. Historical status labels must be reconciled against the later source changes in Sections 11.28–11.60 before treating them as current.
- Route wrappers, barrel exports, auth guards, data registries and SEO metadata endpoints are explicitly identified as structural/non-visual entries; their child UI owners are listed separately. They must not be counted as independent visual migrations.
- The only approved React inline-style exception remains `src/lib/images/renderTripOgImage.tsx`, exclusively for Satori/ImageResponse output, as approved and documented in Section 11.58. Section 10.1 now reflects that approval.

### Source changes — WelcomeHeading
- Added `src/components/common/WelcomeHeading.module.css` and moved the wrapper and heading-group flex layout out of inline `sx` objects.
- Preserved the exact existing layout: both wrappers remain flex columns with centered alignment; heading-group horizontal padding remains 25px and bottom margin remains 16px.
- `HOME_HEADING_SX` remains the owner of heading typography. The responsive single-line/split heading decision, touch-triggered scramble, children placement and animation behavior were not changed.
- This is a structural CSS Module migration, not a new shared visual preset: the geometry is unique to this component.

### Result
- Section 10.1 now records the current WelcomeHeading ownership and the already-approved SEO renderer exception accurately.
- One confirmed inline-sx violation migrated without changing its geometry or behavior.
- The remaining 126 inventory entries are not declared complete by this change. Continue reconciling and fixing concrete residual violations against the current source; do not infer completion from historical workstream labels.
- No build, tests, lint, CI or browser validation was run.


## 11.62 — About editorial typography and TripFilters ledger reconciliation (2026-11-19)

### Source changes
- Added `ABOUT_EDITORIAL_TYPOGRAPHY` to `src/constants/ui/typography.ts` to own the existing About font family, weight, heading margins, responsive heading sizes and h3 line height.
- Exposed those values as theme-generated CSS custom properties in `src/theme/index.ts`; `app/(public)/about/AboutPage.module.css` now consumes the variables instead of owning repeated typography literals.
- Preserved the existing Space Mono stack, font weight 600, all three clamp expressions, 8px 0 heading margins and 1.6 h3 line height. No visual redesign intended.
- Reconciled the Section 10.1 `TripFilters.tsx` entry: its current source already consumes the named `trip-filters` presets for toolbar, select controls and search controls. The old CHANGE REQUIRED note was stale; no source change was necessary for that file in this pass.

### Result
- About editorial typography now has one token owner and a theme-to-CSS-variable bridge; unique page/image geometry remains local.
- TripFilters is recorded as migrated based on its current source, not its historical ledger status.
- No build, tests, lint, CI or browser validation was run.


## 11.63 — PointCard semantic Edit action and ledger correction (2026-11-19)

### Scope and preflight
- Continued in the existing Section 10.1 file-register order and Section 11.12 C1 action workstream; no replacement checklist or inventory was created.
- Re-opened the current `PointCard.tsx`, `buttons.ts` and `cards.ts` source before changing the ledger.
- Confirmed the move-up/down IconButtons already consume `ICON_ACTION_STYLES.base`; their point-specific visibility and compact padding are layout/state composition in the card preset, not an unshared icon skin.

### Source changes
- Added `BUTTON_STYLES.edit` as a semantic alias of the existing primary action treatment. This establishes a dedicated Edit role without changing any color, dimensions, typography, hover behavior or visual appearance.
- Migrated PointCard's Edit Point action from the generic `primary` role to `edit`. Delete Point continues to consume `danger`.
- Corrected the Section 10.1 PointCard row: move controls already use the shared icon-action base; only their point-specific visibility/padding and card layout remain local.

### Preserved
- Edit/Delete handlers, permission checks, disabled states, point ordering, map marker, content, responsive card geometry and action-row layout.
- No API, route, data, validation or business logic changed.

### Result and status
- **2 source files changed**; one stale ledger statement corrected.
- PointCard Edit/Delete roles and move-icon base: **SHARED CONTRACTS APPLIED**.
- PointCard geometry, caller/state verification and remaining point-card composition: **PARTIAL — STILL OPEN**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 point entry: `src/components/points/PointForm.tsx`. Inspect its primary, Back, map lookup, upload and field contracts before making any change; preserve caller-owned navigation and form behavior.


## 11.64 — PointForm semantic action roles and map-search preset (2026-11-19)

### Scope and preflight
- Continued with the next point entry in Section 10.1 after PointCard; used the existing C1 action-role map and current preset owners.
- Re-read `PointForm.tsx`, `forms.ts`, `buttons.ts`, `map-controls.ts` and `BackButton.tsx` before changing source.
- Confirmed BackButton already applies its shared Back role after caller sx. PointForm's caller was redundantly passing the Primary role to Back, even though the shared Back role wins.

### Source changes
- Added semantic `BUTTON_STYLES.create` and `BUTTON_STYLES.add` aliases of the existing primary appearance; retained the dedicated `edit` role added in Section 11.63. These aliases do not change the current visual values.
- PointForm submit now selects `edit` when editing and `create` when creating/retrying a point; Add Next Day Trip consumes `add`.
- Added `POINT_FORM_FIND_MAP_BUTTON_SX` to the existing forms preset owner and migrated the Find in Map action away from an inline ad hoc sx object.
- Removed the redundant Primary override from BackButton; it now receives only the existing point-form action dimensions while BackButton owns its semantic appearance.

### Preserved
- Form submission, retry-without-duplicate behavior, permission/disabled conditions, geocoding, map selection callbacks, query-cache updates, image upload flow, reset behavior and caller-owned Back/Done navigation.
- Existing action appearance is unchanged: `create`, `add` and `edit` are semantic aliases of the same primary skin at this stage.
- No API, DTO, validation, route, data or business logic changed.

### Result and status
- **3 source files changed**; the Section 10.1 PointForm row was reconciled.
- PointForm Create/Add/Edit/Back roles and Find in Map presentation: **SOURCE MIGRATED**.
- PointForm field contract, upload controls, form geometry, caller/state verification and disabled/loading behavior: **PARTIAL — STILL OPEN**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 point entry: `src/components/points/PointActions.tsx`. Verify wrapper geometry and all delegated social action contracts before making changes.


## 11.65 — PointActions source verification and stale-ledger correction (2026-11-19)

### Scope and preflight
- Continued with the next Section 10.1 point entry after PointForm.
- Inspected `PointActions.tsx`, `social.ts`, `LikeButton.tsx`, `FavoriteButton.tsx` and `ReportButton.tsx` on `feature/frontend-modernization`.

### Findings
- `PointActions` already consumes the named `POINT_SOCIAL_ACTIONS_SX` preset; the ledger's statement that its wrapper layout was local was stale.
- Like and Favorite consume `ICON_ACTION_STYLES.base`; Report consumes `ICON_ACTION_STYLES.report`.
- The shared controls own their mutation/pending/error/pressed states. `SocialConfigStatus` remains the shared configuration-feedback owner.
- No source change was necessary in this batch; adding another PointActions-specific style preset would duplicate existing ownership.

### Result and status
- Section 10.1 was corrected to reflect current source ownership.
- PointActions wrapper and nested social-control presentation: **SHARED CONTRACTS VERIFIED**.
- Full caller/route and responsive parity verification remains open; therefore the file remains **PARTIAL**, not declared fully migrated.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 point entry: `src/components/points/PointList.tsx`. Verify list geometry, empty-state typography and all rendered callers before deciding whether any migration is required.


## 11.66 — PointList preset verification and stale-ledger correction (2026-11-19)

### Scope and preflight
- Continued with the next Section 10.1 point entry after PointActions.
- Inspected `PointList.tsx`, `layouts.ts` and `typography.ts` on the target branch.

### Findings
- The list container already consumes `POINT_LIST_SX` from the shared layout preset owner.
- The empty state already consumes `POINT_LIST_EMPTY_SX` from the shared typography preset owner.
- Every populated row delegates to the shared `PointCard`; sorting and item identity remain component behavior.
- No local visual declaration or duplicate preset was found in PointList. No source change was necessary.

### Result and status
- Section 10.1 was corrected to record the current preset consumers instead of describing the layout as local.
- PointList container and empty-state presentation: **SHARED PRESETS VERIFIED**.
- Caller and responsive composition verification remains open; the file remains **PARTIAL** rather than being declared fully complete.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 trip entry: `src/components/trips/TripCard.tsx`. Inspect the Details navigation role, stepper controls, card geometry and all callers before making changes.


## 11.67 — TripCard Details navigation role and ledger reconciliation (2026-11-19)

### Scope and preflight
- Continued in Section 10.1 order after the point components.
- Inspected `TripCard.tsx`, the shared card presets, button presets and MUI Button theme override.

### Source changes
- Added `BUTTON_STYLES.navigationAction` as a semantic alias of the existing `primaryWide` treatment.
- Migrated the TripCard Details link to `navigationAction`; its contained appearance, wide padding, dimensions and hover behavior are unchanged.
- The MobileStepper Back/Next controls remain native MobileStepper slot Buttons using MUI's text-button defaults. No duplicate custom style was added where the theme/default component contract already applies.

### Preserved
- Details href generation, selected-day query behavior, pagination, image selection, touch-swipe navigation, disabled stepper bounds, card layout and responsive dimensions.
- No API, route, data, SEO or business logic changed.

### Result and status
- **2 source files changed**; the Section 10.1 TripCard row was reconciled.
- TripCard Details navigation role: **SOURCE MIGRATED**.
- MobileStepper defaults: **INTENTIONALLY RETAINED**; card geometry/content and full responsive/caller verification remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 trip entry: `src/components/trips/TripActions.tsx`. Verify its existing Add/Edit/Delete semantic contracts and caller-level layout before deciding whether any source change is required.


## 11.68 — TripActions semantic role mapping (2026-11-19)

### Scope and preflight
- Continued with the next Section 10.1 trip entry after TripCard.
- Re-read `TripActions.tsx` and the shared button preset owner; confirmed the existing trip-specific geometry is already centralized in `tripAction` / `tripActionDanger`.

### Source changes
- Added semantic aliases `tripAdd`, `tripEdit`, `tripManage` and `tripDelete` while retaining the existing shared visual contracts.
- Migrated Add Next Day Trip, Add/Edit Points, Edit Day, Delete Day and Delete Trip to the corresponding semantic roles.
- No visual values or action dimensions changed; all aliases resolve to the existing trip action or destructive trip action preset.

### Preserved
- Owner gating, route destinations, day selection, confirmation text/flow, mutation pending states, delete callbacks, cache updates and redirects.
- No API, route, data, validation or business logic changed.

### Result and status
- **2 source files changed**; the Section 10.1 TripActions row was reconciled.
- Trip Add/Edit/Manage/Delete semantic ownership: **SOURCE MIGRATED**.
- Exhaustive caller and interaction-state parity remains open; file status stays **PARTIAL** until verified.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next relevant trip action entry in Section 10.1: `src/components/trips/TripDetails.tsx`. Inspect its action roles and surface/content geometry before making changes.


## 11.69 — TripDetails shared action and presentation verification (2026-11-19)

### Scope and preflight
- Continued with the next Section 10.1 trip entry after TripActions.
- Re-read `TripDetails.tsx` and verified its current shared preset/component consumers.

### Findings
- The Card surface inherits the global `MuiCard` surface contract.
- Header, title, price, metadata, description, action column and social row consume named contracts from `trip-details.ts`.
- Currency-info and description disclosure IconButtons consume `ICON_ACTION_STYLES.base`; Back uses the shared `BackButton` and only receives the trip action layout dimensions.
- TripActions is now backed by the semantic trip Add/Edit/Manage/Delete roles recorded in Section 11.68.
- No local style object or duplicate visual contract was found; no source change was necessary.

### Result and status
- The existing Section 10.1 **MIGRATED** status remains accurate; this verification adds confirmation of the current action-role ownership.
- TripDetails presentation and action composition: **SHARED CONTRACTS VERIFIED**.
- No API, route, data, validation or business logic changed. No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 trip entry: `src/components/trips/TripForm.tsx`. Inspect form fields, upload controls, day controls and action roles before changing anything.


## 11.70 — TripForm semantic Create/Add action roles (2026-11-19)

### Scope and preflight
- Continued with the next Section 10.1 trip entry after TripDetails.
- Inspected `TripForm.tsx`, its existing form/action presets and the shared button role owner.
- Confirmed the day-number decrement/increment controls already use their named stepper roles and Back already delegates to `BackButton`.

### Source changes
- Migrated Add trip to `BUTTON_STYLES.create`.
- Migrated Add next day trip to `BUTTON_STYLES.add`.
- Added `BUTTON_STYLES.addPoints` as a semantic alias of the existing secondary-light-text treatment and migrated Add points for the trip to it. This preserves the existing visual distinction of that action.
- Existing action-row geometry remains in `TRIP_FORM_ACTIONS_SX`; no local style object was added.

### Preserved
- Form validation, day-number bounds and duplicate checks, create-trip/create-day intent, selected map coordinates, concurrent image uploads/retries, route navigation, disabled/submitting conditions, field values and Back behavior.
- No API, DTO, validation, route, data or business logic changed.

### Result and status
- **2 source files changed**; the Section 10.1 TripForm row was reconciled.
- TripForm Create/Add/AddPoints/Back and day-stepper roles: **SOURCE MIGRATED / EXISTING CONTRACTS RETAINED**.
- Field states, upload/remove controls, loading/disabled/focus parity and full caller verification remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 trip entry: `src/components/trips/EditTripLayout.tsx`. Re-check the existing day-number, trip-image delete and action presets before changing anything; do not duplicate the work already recorded in Section 11.40.


## 11.71 — EditTripLayout semantic Edit actions (2026-11-19)

### Scope and preflight
- Continued with the next Section 10.1 trip entry after TripForm.
- Re-read `EditTripLayout.tsx` and confirmed the day stepper, image-delete icon and layout geometry were already consuming their shared contracts, as recorded in Section 11.40.

### Source changes
- Migrated Set/Change Day and Edit Your Trip from generic `BUTTON_STYLES.primary` to the semantic `BUTTON_STYLES.edit` role.
- The Edit role is an alias of the existing primary appearance, so no visual values or interaction states changed.
- Corrected the Section 10.1 row to explicitly record the existing shared stepper, image-delete and Back contracts.

### Preserved
- Day-number bounds/locking/confirmation, trip update and reorder flow, image deletion confirmation and pending state, upload/retry lifecycle, navigation and responsive geometry.
- No API, DTO, validation, route, data or business logic changed.

### Result and status
- **1 source file changed**; the Section 10.1 EditTripLayout row was reconciled.
- Edit action roles and existing day-stepper/image-delete/Back contracts: **SOURCE MIGRATED / VERIFIED**.
- Form-field states, error presentation, upload/remove action family and complete responsive/caller verification remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 trip entry after EditTripLayout. Inspect the remaining trip feature components in their existing ledger order; do not repeat the already-migrated day/image actions from Section 11.40.


## 11.72 — TripMapSection map and stepper contract verification (2026-11-19)

### Scope and preflight
- Continued with the next trip/map consumer in the existing Section 10.1 register.
- Re-read `TripMapSection.tsx` and verified the current `map-controls.ts` preset ownership.

### Findings
- The Card frame consumes `TRIP_MAP_SECTION_CARD_SX`; its surface is inherited from the shared `MuiCard` theme contract.
- The MobileStepper container consumes `TRIP_MAP_SECTION_STEPPER_SX`.
- Back/Next slot controls are native MUI Buttons using the MobileStepper text-button defaults. No competing custom visual skin is present, so no redundant preset was introduced.
- Google Maps rendering, route path, marker selection, overview/focus state and responsive scroll adjustment remain feature behavior.

### Result and status
- The existing Section 10.1 **MIGRATED** status is accurate; no source change was required.
- Map frame, surface and stepper container: **SHARED CONTRACTS VERIFIED**.
- No API, route, data or business logic changed. No build, tests, lint, CI or browser validation was run.

### Next
- Continue reconciling the next trip navigation consumer in Section 10.1, beginning with `TripPagination.tsx`; verify its native-link destinations, active/focus states and CSS Module ownership without converting crawlable links into buttons.


## 11.73 — TripPagination native-link visual token migration (2026-11-19)

### Scope and preflight
- Continued with the next trip-navigation entry in Section 10.1 after TripMapSection.
- Inspected `TripPagination.tsx`, `TripPagination.module.css`, the UI size/spacing/typography owners and the theme CSS-variable bridge.
- Preserved the component's crawlable native-link design; no MUI Button conversion was considered appropriate.

### Source changes
- Added central tokens for pagination item minimum size (32px), vertical/horizontal padding (6px/10px), focus outline width/offset (2px/2px), semibold weight (600) and outer spacing (20px via the 8px spacing scale).
- Exposed those values through theme-generated CSS variables.
- Migrated `TripPagination.module.css` to consume the variables for outer spacing, item dimensions/padding, focus outline and current-page font weight. Existing primary/hover colors, shape radius and list gap already consumed theme variables and remain unchanged.
- Reconciled both Section 10.1 entries for the TSX component and its CSS Module.

### Preserved
- Real href destinations, search/group/transport/sort query preservation, Previous/Next availability, current-page `aria-current`, anchor keyboard behavior and list semantics.
- Exact existing values and visual intent; no redesign.
- No API, route, SEO, data or business logic changed.

### Result and status
- **5 source files changed**: UI sizes, spacing, typography, theme CSS-variable bridge and TripPagination CSS Module.
- TripPagination link/active/focus visual contract: **SOURCE MIGRATED**.
- Native navigation semantics and query behavior: **PRESERVED**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue through the existing trip list/navigation register; verify `TripDaysNav.tsx` and `TripFilters.tsx` against the current branch rather than trusting their historical status labels.


## 11.74 — TripDaysNav residual sx cleanup and stale reference fix (2026-11-19)

### Scope and preflight
- Continued with the next trip navigation consumer after TripPagination.
- Re-opened `TripDaysNav.tsx` and `pagination.ts` on the target branch instead of relying on the earlier Section 11.41 completion note.
- Found a stale `PAGE_ITEM_SX` reference on the non-page PaginationItem branch after the original local constant had been removed. The remaining AppBar, Box and Pagination sx objects also bypassed the named-preset-only styling API.

### Source changes
- Added `TRIP_DAYS_NAV_APP_BAR_SX`, `TRIP_DAYS_NAV_CONTENT_SX` and `TRIP_DAYS_NAV_PAGINATION_SX` to the existing pagination preset owner.
- Migrated the AppBar, centered content wrapper and Pagination top spacing to those named presets.
- Replaced the stale `PAGE_ITEM_SX` reference with `TRIP_DAY_PAGE_ITEM_SX`, so both page and non-page PaginationItem branches use the existing shared day-navigation contract.
- Reconciled the Section 10.1 TripDaysNav entry.

### Preserved
- AppBar sticky-parent composition, day count/selection, page labels, URL updates, optional client-side `onSelect`, router scroll behavior and PaginationItem semantics.
- Existing dimensions, margins, colors, hover and selected states; no redesign.
- No API, route, data or business logic changed.

### Result and status
- **2 source files changed**; one stale reference corrected and three local sx objects migrated to named presets.
- TripDaysNav presentation: **SOURCE MIGRATED**.
- No build, tests, lint, CI or browser validation was run.
 
### Next
- Verify `TripFilters.tsx` and its preset owner against the current source, then continue with the next outstanding Section 10.1 entry.


## 11.75 — TripFilters current-branch verification (2026-11-19)

### Scope and findings
- Re-opened `TripFilters.tsx` and `trip-filters.ts` after the earlier Section 11.62 ledger reconciliation.
- Confirmed the component consumes named contracts for the Toolbar, selector group/boxes/labels/selects, search wrapper/surface/icon/button and input.
- No local styled-components or component-local sx objects remain in the consumer. URL query construction, filter state and event handlers remain component-owned.
- The preset's remaining values describe this Trips-only toolbar/search role; shared colors and spacing already reference central UI tokens where applicable. No repeated global AppBar skin or generic field skin was introduced.

### Result and status
- Section 10.1 **MIGRATED** status is confirmed against the current branch; no source change was necessary.
- TripFilters consumer: **SHARED PRESET VERIFIED**.
- No API, route, data or business logic changed. No build, tests, lint, CI or browser validation was run.

### Next
- Continue from the next outstanding trip/image entry in Section 10.1; keep SEO/social-image rendering separate under the approved Section 11.58 boundary.


## 11.76 — PointSection current-source reconciliation (2026-11-19)

### Scope and findings
- Continued with the next point-section entry in Section 10.1.
- Re-opened `PointSection.tsx` and verified the current `trip-details.ts` and `image-gallery.ts` preset consumers.
- The earlier ledger note claiming a React `style` prop was stale: the current component has no React style prop and no component-local sx object.
- Card/content/title/note/description/action-row and image-frame presentation are all named-preset-owned; image, social, comment and expandable-text behavior is delegated to shared child components.

### Result and status
- Corrected the Section 10.1 PointSection row to reflect the current branch.
- PointSection presentation: **MIGRATED / VERIFIED**.
- Parent-route responsive parity and delegated child-state verification remain part of their respective component entries; no duplicate PointSection preset was added.
- No API, route, data or business logic changed. No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 trip field entry: `src/components/trips/TripSelectField.tsx`. Verify its TextField/Autocomplete contract and existing theme defaults before adding or changing a preset.


## 11.77 — TripSelectField base-field contract verification (2026-11-19)

### Scope and findings
- Continued with the next Section 10.1 trip field entry.
- Inspected `TripSelectField.tsx` and `src/theme/components/text-field.ts`.
- TripSelectField does not define a local visual skin or ad hoc sx object. Its TextField and Autocomplete renderInput inherit the application TextField defaults (outlined / medium).
- The global TextField theme owner currently defines only default variant and size; complete border, label, helper-text, focus, error, disabled and adornment states remain an open C3 field-system task.
- Adding a TripSelectField-only style would create a parallel field skin and is not appropriate before the base field contract is completed.

### Result and status
- No source change was necessary; Section 10.1 remains **PARTIAL** because the shared base field contract is incomplete, not because TripSelectField owns local styles.
- TripSelectField consumer behavior: **CURRENT MUI DEFAULTS VERIFIED**.
- No API, route, data or business logic changed. No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 image entry: `src/components/images/AppImage.tsx`. Inspect its style-prop transport, image preset ownership and all direct consumers before changing the rendering API.


## 11.78 — AppImage current-source reconciliation (2026-11-19)

### Scope and findings
- Continued with the next image entry in Section 10.1.
- Re-opened `AppImage.tsx`, `AppImage.module.css` and `constants/images/presets.ts`.
- The old ledger claim that AppImage passes presentation through the React `style` prop was stale. The current component has no `style` prop in its API and no `style=` transport to Next Image or the fallback.
- Named preset object-fit roles map to CSS Module classes; dimensions, fill, sizes, priority and thumbnail behavior are resolved by the shared AppImage owner.
- The remaining image audit is preset/caller frame parity and responsive `sizes`, not prohibited inline style transport.

### Result and status
- Corrected the Section 10.1 AppImage row; no source change was needed.
- AppImage style-prop policy: **VERIFIED / COMPLIANT**.
- Image preset dimensions, frame ratios and all direct caller compositions: **PARTIAL — STILL OPEN**.
- No API, route, data or business logic changed. No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 image entry: `src/components/images/ImageGallery.tsx`. Inspect its runtime grid/focus styles and CSS Module consumers before making changes.


## 11.79 — Shared focus tokens for TripPagination and ImageGallery (2026-11-19)

### Scope and preflight
- Continued with the next Section 10.1 image entry after AppImage.
- Inspected `ImageGallery.tsx`, `ImageGallery.module.css`, `image-gallery.ts` and the TripPagination CSS Module migrated in Section 11.73.
- Confirmed ImageGallery's grid/stack/row composition is already class-based CSS Module structure; the earlier ledger statement that runtime grid/focus sx remained local was stale.

### Source changes
- Promoted the matching 2px focus outline width and 2px offset used by TripPagination and ImageGallery into shared `UI_SIZES.focusOutlineWidth` / `focusOutlineOffset` tokens.
- Exposed the shared values through `--ht-focus-outline-width` and `--ht-focus-outline-offset` theme-generated CSS variables.
- Updated both CSS Modules to consume the same focus variables; TripPagination retains its item-specific dimensions/padding tokens.
- Reconciled the Section 10.1 ImageGallery row.

### Preserved
- Native image-button semantics, focus-visible behavior and outline values; gallery row/stack/grid layout, runtime column selection, image click/index state, overlay placement, ImageLightbox behavior and image preset selection.
- No image URL, dimension, loading/priority, social or comment behavior changed.

### Result and status
- **4 source files changed** plus the Section 10.1 ledger: shared UI size token, theme CSS-variable bridge and two CSS Modules.
- ImageGallery's local focus literals are now shared-token consumers; its unique structural CSS remains local.
- Image frame ratios, overlay stacking and all responsive caller states remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 image entry: `src/components/images/ImageLightbox.tsx`. Inspect close/previous/next icon-action roles, surface and stage geometry before changing the component.


## 11.80 — ImageLightbox current-source reconciliation (2026-11-19)

### Scope and findings
- Continued with the next Section 10.1 image entry after ImageGallery.
- Re-opened `ImageLightbox.tsx`, `image-gallery.ts`, `dialog.ts` and `AppImage.tsx`.
- The former CHANGE REQUIRED ledger note was stale: close/previous/next controls, control positions/z-index, counter, root, stage, image frame and Dialog image-stage surface already consume named presets/shared icon-action contracts.
- Dialog's base Paper surface remains theme-owned; the image-lightbox background is an explicit semantic variant.
- Keyboard arrow navigation, touch swipe and wraparound are behavior/state, not local visual styling.

### Result and status
- Corrected the Section 10.1 ImageLightbox row to match current source.
- Lightbox presentation: **MIGRATED / VERIFIED**.
- Caller-specific image ratio/size and responsive parity remain in the AppImage/direct-caller image audit; no duplicate lightbox styles were added.
- No API, route, data or business logic changed. No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 image entry: `src/components/images/ImageUploadField.tsx`. Inspect upload/remove/delete-all action semantics, thumbnail frames and its direct callers before changing the component.


## 11.81 — Semantic Upload and draft Remove actions (2026-11-19)

### Scope and preflight
- Continued with the next Section 10.1 image-upload entry.
- Inspected `ImageUploadField.tsx`, `image-upload.ts` and `CustomFileUploadButton.tsx`.
- Confirmed upload and preview/remove visual geometry was already owned by named image-upload presets; the missing piece was explicit semantic action naming rather than new local styles.

### Source changes
- Added `BUTTON_STYLES.upload` and `ICON_ACTION_STYLES.upload` aliases of the existing primary upload appearance.
- Added `BUTTON_STYLES.removeSelection` and `ICON_ACTION_STYLES.removeSelection` for removing unsubmitted draft files; these preserve the existing primary/base appearance and remain distinct from permanent Delete/danger actions.
- Updated the shared image-upload preset owner so desktop/mobile upload triggers consume `upload`, and Remove All draft controls consume `removeSelection`.
- Individual preview removal remains on the existing danger icon role.

### Preserved
- File picker modes, accepted MIME types, multiple selection, max-count gating, 25 MB input limit, client compression, preview object URLs/cleanup, remove-one/remove-all behavior, processing state and error messages.
- No upload API, server validation, image storage, data or business logic changed.

### Result and status
- **2 source files changed** plus the Section 10.1 ledger rows for ImageUploadField and CustomFileUploadButton.
- Upload and draft Remove action semantics: **SOURCE MIGRATED**.
- Preview frame sizing, direct consumer parity, responsive and disabled/loading state verification remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 image consumer: `src/components/images/DayImagesGallery.tsx`. Verify image frame sizing and AppImage preset use against its parent trip layout.


## 11.82 — DayImagesGallery current-source reconciliation (2026-11-19)

### Scope and findings
- Continued with the next Section 10.1 image consumer after ImageUploadField.
- Re-opened `DayImagesGallery.tsx` and `image-gallery.ts`.
- The previous note that local image container width/maxWidth/aspect ratio remained was stale. Populated content delegates to `ImageGallery` with the named `gallery` preset and grid variant; the empty placeholder uses `DAY_IMAGE_PLACEHOLDER_FRAME_SX`.
- No local visual sx object or CSS declaration exists in DayImagesGallery.

### Result and status
- Corrected the Section 10.1 DayImagesGallery row.
- Day image composition and placeholder frame: **MIGRATED / VERIFIED**.
- Gallery frame ratios, overlay stacking and responsive caller parity remain tracked under ImageGallery; no duplicate DayImagesGallery styles were added.
- No API, route, data or business logic changed. No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next outstanding image consumer in Section 10.1: `src/components/images/ImageUploadField.tsx` / `CustomFileUploadButton.tsx` caller-state verification, then inspect the remaining account/admin profile image consumers.


## 11.83 — ImageGallery CSS Module ledger reconciliation (2026-11-19)

- Updated the Section 10.1 CSS Module row to record that focus-visible outline width/offset now consume shared theme variables, as implemented in Section 11.79.
- Corrected the stale reference to a focus-visible sx rule in `ImageGallery.tsx`; the rule is in `ImageGallery.module.css`.
- The module remains **PARTIAL** because unique frame ratios, clipping/overflow and caller-responsive parity still require verification; these are not duplicate shared skins.
- No source change was needed in this reconciliation. No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the profile/admin image consumers in Section 10.1, beginning with `src/components/auth/ProfileImage.tsx` and `src/components/admin/AdminUserProfileImage.tsx`.


## 11.84 — Profile image and admin profile-image action contracts (2026-11-19)

### Scope and preflight
- Continued with the profile/admin image consumers identified in Section 10.1.
- Re-opened `ProfileImage.tsx`, `AdminUserProfileImage.tsx`, `profile-image.ts` and the image-upload preset owner.
- Confirmed ProfileImage's display/delete/fullscreen composition already consumes named presets; the old local-frame/position ledger note was stale.
- AdminUserProfileImage still had one local upload-button alignment sx object and direct Delete/Upload button role styling.

### Source changes
- Added `ADMIN_PROFILE_IMAGE_UPLOAD_BUTTON_SX` to the profile-image preset owner; it composes the semantic Upload role with the existing start alignment.
- Admin profile-image Delete now explicitly consumes `BUTTON_STYLES.dangerText`, retaining its existing error-colored outlined appearance.
- Admin profile-image Upload/Replace now consumes the named upload/alignment preset instead of a component-local sx object.
- Reconciled the Section 10.1 ProfileImage and AdminUserProfileImage rows.

### Preserved
- Profile image loading, delete confirmation, fullscreen open/close, image URLs/presets, preview object-URL lifecycle, upload/replace/delete mutations, query invalidation, error states and disabled/pending conditions.
- No API, route, data or business logic changed.

### Result and status
- **2 source files changed** plus the Section 10.1 ledger reconciliation.
- ProfileImage presentation: **MIGRATED / VERIFIED**.
- AdminUserProfileImage action/avatar presentation: **SOURCE MIGRATED**; caller/state verification remains **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the remaining admin image controls and image preset/caller parity; do not duplicate the already-centralized AppImage, ImageLightbox or profile-image roles.


## 11.85 — AdminImages pagination contract completion (2026-11-19)

### Scope and preflight
- Continued with the remaining admin image inventory controls after the profile-image consumers.
- Re-opened `AdminImages.tsx` and confirmed the preview trigger, thumbnail, close control, dialog content and preview frame already consume named `ADMIN_IMAGE_*` presets.
- Found three Previous/Next controls in the Database and Orphan image tabs that did not yet consume the shared admin pagination width preset.

### Source changes
- Applied `ADMIN_PAGINATION_BUTTON_SX` to the remaining Database Previous and Orphan Previous/Next controls.
- Reconciled the Section 10.1 AdminImages row to reflect current shared surface, pagination and preview ownership.

### Preserved
- Page state, query keys, disabled conditions, selection behavior, 100-image generation limit, thumbnail generation mutation, preview open/close, URLs, error/result alerts and table contents.
- No API, data, route or business logic changed.

### Result and status
- **1 source file changed** plus the Section 10.1 ledger reconciliation.
- All audited AdminImages Previous/Next controls: **SHARED PAGINATION CONTRACT APPLIED**.
- Toolbar action semantics, Checkbox states, responsive table behavior and complete preview/selection/pending parity remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 admin image/table entry in order: `src/components/admin/AdminUsers.tsx` and verify the Edit/Delete, pagination and avatar contracts against the current source.


## 11.86 — AdminUsers semantic Edit role and ledger reconciliation (2026-11-19)

### Scope and preflight
- Continued with the next Section 10.1 admin user/image consumer.
- Re-opened `AdminUsers.tsx` and verified the current admin card, profile avatar, pagination and lightbox preset consumers.
- Found that Edit User still used the generic Primary role even though the dedicated Edit role had been introduced in Section 11.63.

### Source changes
- Migrated Edit User to `BUTTON_STYLES.edit`; its current visual treatment remains identical to Primary.
- Delete already consumes `BUTTON_STYLES.dangerText`; Previous/Next already consume the shared admin pagination preset.
- Reconciled the Section 10.1 row to record the existing `ADMIN_USER_CARD_*` and profile-avatar preset ownership.

### Preserved
- Admin/manager role visibility, route href, delete confirmation, mutation/invalidation, pagination state, profile image preview and lightbox behavior.
- No API, role/authorization, route, data or business logic changed.

### Result and status
- **1 source file changed** plus the Section 10.1 ledger reconciliation.
- AdminUsers Edit/Delete/pagination/avatar roles: **SHARED CONTRACTS APPLIED**.
- Responsive/caller and authorization/mutation state verification remains **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 admin feature entry: `src/components/admin/AdminReports.tsx`. Verify report actions, pagination, row state and existing table surface presets.


## 11.87 — Shared DeleteText role for admin image/user/report actions (2026-11-19)

### Source changes
- Added `BUTTON_STYLES.delete` (filled destructive role) and `BUTTON_STYLES.deleteText` (text destructive role) as semantic aliases of the existing danger treatments.
- Migrated the existing text-style Delete actions in AdminReports, AdminUsers and AdminUserProfileImage to `deleteText`; their current error color and visual appearance are unchanged.
- Reconciled the Section 10.1 AdminReports row: its Paper surface and pagination were already shared; Delete now has an explicit semantic role.

### Preserved
- Delete confirmation flows, permission/role visibility, mutation pending states, query invalidation, error handling and pagination behavior.
- No API, data, authorization or business logic changed.

### Result and status
- **4 source files changed** plus the Section 10.1 AdminReports ledger row.
- AdminReports/AdminUsers/AdminUserProfileImage text Delete actions: **SEMANTIC ROLE CENTRALIZED**.
- AdminReports row and responsive/state verification remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next admin table entry in Section 10.1: `src/components/admin/AdminFailedLogs.tsx`. Verify its selection, delete/clear actions, pagination and row states against the shared action contracts.


## 11.88 — AdminFailedLogs semantic Delete and pagination verification (2026-11-19)

### Source changes
- Migrated Delete selected from generic `dangerText` to the semantic `BUTTON_STYLES.deleteText` role introduced in Section 11.87.
- Confirmed the outlined Paper surface, Checkbox defaults and Previous/Next pagination sizing already use their shared theme/component contracts.
- Reconciled the Section 10.1 AdminFailedLogs row.

### Preserved
- Selected-ID Set behavior, select-all/toggle-one logic, confirmation flow, delete mutation, query invalidation, selection reset, pending/disabled and error states.
- No API, data, authorization or business logic changed.

### Result and status
- **1 source file changed** plus the Section 10.1 ledger reconciliation.
- Delete and pagination roles: **SHARED CONTRACTS APPLIED**.
- Checkbox state parity, confirmation/mutation state and responsive table verification remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 admin table entry: `src/components/admin/AdminRouteNotFoundLogs.tsx`. Verify disclosure, Delete/Clear actions and pagination contracts.


## 11.89 — AdminRouteNotFoundLogs current-source verification (2026-11-19)

### Scope and findings
- Continued with the next Section 10.1 admin table entry after AdminFailedLogs.
- Re-opened `AdminRouteNotFoundLogs.tsx` and verified the current admin diagnostic preset owner.
- Previous/Next already consume the shared admin pagination contract; the outlined Paper table inherits the theme surface.
- Diagnostic fields, expanded details and expanded table-cell presentation use named presets. View/Hide remains a native MUI Button default and exposes `aria-expanded` and `aria-controls`; no local disclosure skin was found.

### Result and status
- Corrected the Section 10.1 row to remove stale claims about direct pagination styles and local typography/spacing sx.
- AdminRouteNotFoundLogs presentation: **SHARED/THEME CONTRACTS VERIFIED**.
- Expanded-row content, focus/keyboard and responsive table states remain **PARTIAL**; no duplicate disclosure preset was added.
- No source change, API, route, data or business logic change. No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the remaining admin feature consumers in Section 10.1, beginning with `src/components/admin/AdminUserForm.tsx` and then reconcile the rest of the admin action/table owners.


## 11.90 — AdminUserForm semantic Save/Delete role verification (2026-11-19)

### Scope and source changes
- Continued with the next Section 10.1 admin form entry after the admin log tables.
- Re-opened `AdminUserForm.tsx` and confirmed Save already consumes `BUTTON_STYLES.save`, Back uses `BackButton` plus `ADMIN_USER_FORM_BACK_SX`, and the form/panel/password stack use named presets.
- Migrated Delete user from generic `dangerText` to the semantic `BUTTON_STYLES.deleteText` role.
- Reconciled the Section 10.1 AdminUserForm row.

### Preserved
- Admin/manager field visibility, role/status choices, password expansion and clearing, validation, update/delete mutations, confirmation, navigation, query invalidation and pending states.
- No API, authorization, validation, route, data or business logic changed.

### Result and status
- **1 source file changed** plus the Section 10.1 ledger reconciliation.
- Save/Delete/Back action ownership: **SHARED CONTRACTS APPLIED**.
- Field, Switch/Select, PasswordField and PasswordRequirements state parity remains **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next outstanding Section 10.1 admin/auth consumers; prioritize `AdminReports.tsx` and `AdminFailedLogs.tsx` status reconciliation, then the remaining auth form action roles.


## 11.91 — ChangePasswordForm semantic Save role (2026-11-19)

### Scope and findings
- Continued with the next Section 10.1 auth form entry after AdminUserForm.
- Re-opened `ChangePasswordForm.tsx` and verified its existing form/action preset consumers.
- The save-button alignment and margin were already owned by `ACCOUNT_PASSWORD_SAVE_BUTTON_SX`; the old ledger note describing local geometry was stale.

### Source changes
- Migrated Save password from generic `BUTTON_STYLES.primary` to semantic `BUTTON_STYLES.save`; the role remains a visual alias of the same primary appearance.
- Reconciled the Section 10.1 row and corrected Section 11.90's next position to the auth-form sequence.

### Preserved
- Current-password requirement, validation, password-difference/match checks, expanded/reset behavior, API request, notification messages, disabled/submitting state and helper text.
- No API, validation, auth or business logic changed.

### Result and status
- **1 source file changed** plus the Section 10.1 ledger reconciliation.
- Save/form layout roles: **SHARED CONTRACTS APPLIED**.
- Global field states and PasswordField/PasswordRequirements visual parity remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 auth form entry: `src/components/auth/VerifyEmailForm.tsx`. Give its Go to login action a semantic navigation role while preserving the current visual treatment.


## 11.92 — VerifyEmailForm semantic navigation action (2026-11-19)

### Source changes
- Added `BUTTON_STYLES.navigationLink` as a semantic alias of the existing primary appearance (without the wide padding of `navigationAction`).
- Migrated Go to login to `navigationLink`; no color, dimensions, typography or hover values changed.
- Reconciled the Section 10.1 VerifyEmailForm row.

### Preserved
- Verification token flow, success/error/loading status, notification timing, tab-sync event, redirect timeout/cancellation and login destination.
- No API, auth, route or business logic changed.

### Result and status
- **2 source files changed** plus the Section 10.1 ledger reconciliation.
- VerifyEmailForm navigation and Card presentation: **SHARED CONTRACTS APPLIED**.
- Status-state and responsive content verification remains **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 auth form entry: `src/components/auth/RegisterForm.tsx`. Map Register, alternate auth navigation and password/checkbox states before changing any role.


## 11.93 — RegisterForm semantic Create and secondary-navigation roles (2026-11-19)

### Source changes
- Migrated Register to `BUTTON_STYLES.create`.
- Added `BUTTON_STYLES.navigationSecondary` as a semantic alias of the existing secondary appearance and migrated Login/Resend Verification links to it.
- Removed the component-local `SECONDARY_BUTTON_SX` alias; all three actions now select named semantic roles.
- Reconciled the Section 10.1 RegisterForm row.

### Preserved
- Registration schema, accepted-terms validation, CAPTCHA token/reset lifecycle, locked/submitting state, success notification/redirect, login/resend destinations and password requirement behavior.
- Existing action appearance is unchanged; Create remains primary and both alternate navigation actions retain the secondary skin.
- No API, auth, validation, route or business logic changed.

### Result and status
- **2 source files changed** plus the Section 10.1 ledger reconciliation.
- Register/Create and secondary-navigation roles: **SOURCE MIGRATED**.
- Field, Checkbox, CAPTCHA, password reveal and all pending/disabled state parity remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 auth form entry: `src/components/auth/ProfileForm.tsx`. Migrate Edit Profile and Change Password to their semantic roles while preserving the existing appearance.


## 11.94 — ProfileForm semantic Edit and Disclosure roles (2026-11-19)

### Source changes
- Migrated Edit Profile from generic Primary to `BUTTON_STYLES.edit`.
- Added `BUTTON_STYLES.disclosure` as a semantic alias of the existing secondary appearance and migrated the Change Password toggle to it.
- Back, form layout, title, action row and read-only email field remain owned by their existing shared contracts.
- Reconciled the Section 10.1 ProfileForm row.

### Preserved
- Profile update, optional image upload, dirty/valid/submitting conditions, auth-context update, reset behavior, notifications, password-section toggle and browser Back navigation.
- Existing Edit/Change Password button appearances are unchanged.
- No API, validation, auth, route, data or business logic changed.

### Result and status
- **2 source files changed** plus the Section 10.1 ledger reconciliation.
- Edit and Disclosure action roles: **SOURCE MIGRATED**.
- Field, profile-image and password state parity remains **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 auth form entry: `src/components/auth/ForgotPasswordForm.tsx`. Give the submit and Back navigation actions explicit semantic roles, preserving the existing appearance.


## 11.95 — ForgotPasswordForm semantic Submit role (2026-11-19)

### Source changes
- Added `BUTTON_STYLES.submit` as a semantic alias of the existing primary appearance.
- Migrated Send reset link from generic Primary to Submit.
- Back to login already uses the shared BackButton and named auth back-action geometry; corrected the Section 10.1 row accordingly.

### Preserved
- Forgot-password schema, CAPTCHA token/reset lifecycle, request payload, success notification, error handling and submitting/disabled state.
- Existing button appearance, Back link destination and form layout.
- No API, auth, validation, route, data or business logic changed.

### Result and status
- **2 source files changed** plus the Section 10.1 ledger reconciliation.
- Submit and Back roles: **SOURCE MIGRATED**.
- Field and CAPTCHA state parity remains **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 auth form entry: `src/components/auth/LoginForm.tsx`. Give Login and alternate navigation actions semantic roles; verify password reveal separately through PasswordField.


## 11.96 — LoginForm semantic Submit/navigation/password-visibility roles (2026-11-19)

### Source changes
- Migrated Login to `BUTTON_STYLES.submit`.
- Migrated Register, Forgot Password and Resend Verification to the shared `BUTTON_STYLES.navigationSecondary` role and removed the component-local secondary alias.
- Added `ICON_ACTION_STYLES.passwordVisibility` as a semantic alias of the existing icon-action base and migrated Show/Hide password to it.
- Reconciled the Section 10.1 LoginForm row.

### Preserved
- Login validation, CAPTCHA token/reset lifecycle, cross-tab email-verified notification, password visibility state, focus retention on mouse down, submit/loading/disabled state and redirect.
- Existing action/icon appearance is unchanged.
- No API, auth, validation, route, data or business logic changed.

### Result and status
- **2 source files changed** plus the Section 10.1 ledger reconciliation.
- Submit, secondary navigation and password-visibility roles: **SOURCE MIGRATED**.
- TextField, CAPTCHA, password visibility keyboard/focus and all state parity remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 auth form entry: `src/components/auth/ResendVerificationForm.tsx`. Migrate its submit role and verify Back/CAPTCHA states.


## 11.97 — ResendVerificationForm semantic Submit role (2026-11-19)

### Source changes
- Migrated Resend verification email from generic Primary to `BUTTON_STYLES.submit`.
- Back to login already uses the shared BackButton and named auth back-action geometry; reconciled the Section 10.1 row.

### Preserved
- Resend schema, email field, CAPTCHA token/reset lifecycle, request payload, success/error notifications and submitting/disabled state.
- Existing visual appearance, Back link destination and form layout.
- No API, auth, validation, route, data or business logic changed.

### Result and status
- **1 source file changed** plus the Section 10.1 ledger reconciliation.
- Submit/Back roles: **SOURCE MIGRATED**.
- Field/CAPTCHA and pending/disabled state parity remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 auth form entry: `src/components/auth/ResetPasswordForm.tsx`. Migrate its submit role and verify password/requirements state contracts.


## 11.98 — ResetPasswordForm semantic Submit/navigation roles (2026-11-19)

### Source changes
- Migrated Reset password from generic Primary to `BUTTON_STYLES.submit`.
- Added the semantic `BUTTON_STYLES.navigationLink` role to the success-state Go to login action.
- Back to login already uses shared BackButton; reconciled the Section 10.1 row.

### Preserved
- Reset-token validation, password schema/requirements, API request, success/error notifications, success redirect timer/cancellation, disabled/submitting state and login destinations.
- Existing visual appearance; both new aliases preserve the existing primary skin.
- No API, auth, validation, route, data or business logic changed.

### Result and status
- **1 source file changed** plus the Section 10.1 ledger reconciliation.
- Submit/navigation/Back roles: **SOURCE MIGRATED**.
- Password field/requirements and token/success/pending state parity remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 auth entry: `src/components/auth/PasswordField.tsx`. Verify password visibility IconButton roles and field state contracts across all mapped consumers.


## 11.99 — Shared PasswordField visibility action role (2026-11-19)

### Source changes
- Migrated the shared PasswordField reveal/hide IconButton from generic `ICON_ACTION_STYLES.base` to semantic `ICON_ACTION_STYLES.passwordVisibility`.
- The new role is an alias of the existing base appearance, so dimensions, colors, hover/focus and edge placement remain unchanged.
- Reconciled the Section 10.1 PasswordField row; LoginForm already consumes the same role as recorded in Section 11.96.

### Preserved
- Password visibility state, labels, disabled behavior, mouse-down focus retention, registration forwarding, maxLength, autocomplete, error/helper text and all direct consumer behavior.
- No validation, auth, API or business logic changed.

### Result and status
- **1 source file changed** plus the Section 10.1 ledger reconciliation.
- Shared password visibility icon role: **SOURCE MIGRATED**.
- Global TextField visual states and all consumer parity remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 auth form entry: `src/components/auth/ChangePasswordForm.tsx` has its Save role migrated; verify the remaining auth forms and global field contract before declaring the auth workstream complete.


## 11.100 — CAPTCHA and password-requirement feedback presets (2026-11-19)

### Source changes
- Added `getCaptchaContainerSx(disabled)` to the shared form preset owner and migrated Captcha's local wrapper sx object to it.
- Added `PASSWORD_REQUIREMENT_INVALID_ICON_SX` and migrated the unchecked password-requirement icon away from its local sx object.
- Existing password requirement list/item layout was already preset-owned; reconciled both Section 10.1 rows.

### Preserved
- CAPTCHA script loading, site-key fallback, widget render/reset lifecycle, token/expiry/error callbacks, disabled pointer-events and opacity values.
- Password requirement calculation, responsive grid, success/invalid palette colors and all consumer behavior.
- No auth, API, validation or business logic changed.

### Result and status
- **3 source files changed** plus the Section 10.1 ledger reconciliation.
- CAPTCHA wrapper and password feedback presentation: **SOURCE MIGRATED**.
- Third-party widget behavior and all consumer/field state parity remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue the auth field-system audit: verify whether MUI's built-in outlined TextField/Checkbox states already satisfy the shared base contract before adding any custom theme overrides; do not duplicate MUI defaults or change their appearance.


## 11.101 — Global TextField and Checkbox baseline verification (2026-11-19)

### Scope and findings
- Completed the field-baseline check requested in Section 11.100 by inspecting `theme/index.ts`, `theme/components/text-field.ts`, the auth forms and current field consumers.
- `MuiTextField` is explicitly configured to use `outlined` / `medium`, matching MUI's defaults; its internal OutlinedInput, InputLabel and FormHelperText state styling remains the MUI theme baseline.
- Checkbox controls have no feature-local visual overrides in the audited auth form and inherit the shared MUI default component behavior.
- The theme intentionally does not duplicate MUI's built-in border, label, focus, error, disabled or checkbox styles. A custom override should be added only for a documented brand deviation, not to mirror dependency defaults.
- `ACCOUNT_FORM_READONLY_FIELD_SX` remains a deliberate field-specific exception for readable disabled email text; it does not redefine the global field skin.

### Result and status
- Updated the Section 10.1 TripSelectField, PasswordField and RegisterForm rows to record the shared MUI baseline accurately.
- Global TextField/Checkbox base appearance: **MUI THEME DEFAULTS VERIFIED / INTENTIONALLY RETAINED**.
- Component-specific helper/error/disabled/locked states and responsive caller parity remain open for targeted verification; no redundant theme overrides were added.
- No source change, API, validation, auth or business logic change. No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next remaining auth/field entry in Section 10.1: `src/components/auth/ChangePasswordForm.tsx` / `ProfileForm.tsx` consumer-state verification, then proceed to the remaining common components in the register.


## 11.102 — ScrambleHeading current-source reconciliation (2026-11-19)

### Scope and findings
- Continued with the next common component in Section 10.1.
- Re-opened `ScrambleHeading.tsx`, `WelcomeHeading.tsx` and `WelcomeHeading.module.css`.
- The old ledger note claiming a public React `style` prop was stale. The current ScrambleHeading props are only `text` and the imperative ref; its heading consumes `HOME_HEADING_SX`.
- WelcomeHeading's unique wrapper/heading-group geometry remains in its CSS Module as recorded in Section 11.61; touch handling, responsive split and scramble behavior remain unchanged.

### Result and status
- Corrected the Section 10.1 ScrambleHeading row.
- React style-prop policy: **VERIFIED / COMPLIANT**.
- Typography and unique wrapper layout: **SHARED PRESET + CSS MODULE VERIFIED**.
- No source change, API, route or business logic change. No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next common component in Section 10.1: `src/components/comments/CommentsSection.tsx`. Inspect its React style transport, edit/delete/reply/report icon-action roles and field states before making changes.


## 11.103 — CommentsSection semantic icon-action roles (2026-11-19)

### Scope and preflight
- Continued with the next common interaction component in Section 10.1.
- Re-opened `CommentsSection.tsx` and `comments.ts`; confirmed the panel/list/card/author/body/timestamp/edit/create/action-row/hint presentation already consumes named presets and no React `style` prop remains.
- The remaining direct action issue was that several semantically different IconButtons all consumed the generic icon-action base role.

### Source changes
- Added semantic `ICON_ACTION_STYLES.edit`, `save`, `cancel`, `disclosure`, `submit` and `delete` aliases while preserving the existing base/danger appearances.
- Migrated Save comment, Cancel edit, Edit comment, Show/Hide replies, Post comment, Add/Close comment and Delete comment to the matching semantic roles.
- Reconciled the Section 10.1 CommentsSection row.

### Preserved
- Comment query keys, viewer cache separation, permission/social-config gating, edit/create/delete mutations, confirmation, invalidation, form focus, reply toggling, count badges, notifications and pending/disabled states.
- No API, DTO, validation, authorization, route or business logic changed.

### Result and status
- **2 source files changed** plus the Section 10.1 ledger reconciliation.
- Comment icon-action semantics: **SOURCE MIGRATED**.
- Permission/config, field, mutation and responsive state parity remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 comments entry: `src/components/comments/CommentsToggle.tsx`. Verify its React style transport and disclosure action role before changing it.


## 11.104 — CommentsToggle disclosure role and ledger reconciliation (2026-11-19)

### Scope and findings
- Continued with the next Section 10.1 comments entry.
- Re-opened `CommentsToggle.tsx` and confirmed wrapper/empty-label layout already consumes named comment presets; the old React style-prop/local-margin ledger note was stale.
- The only remaining generic action role was the Show/Hide/Add comment IconButton.

### Source changes
- Migrated the toggle to `ICON_ACTION_STYLES.disclosure`, the semantic alias introduced in Section 11.103.
- Reconciled the Section 10.1 CommentsToggle row.

### Preserved
- Count badge, empty label, open/closed icons, tooltip/aria labels, `aria-expanded`, parent-owned toggle callback and visual appearance.
- No API, comment behavior or business logic changed.

### Result and status
- **1 source file changed** plus the Section 10.1 ledger reconciliation.
- CommentsToggle disclosure presentation: **SOURCE MIGRATED**.
- Count/open/empty and keyboard/focus parity through parent callers remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 comments entry: `src/components/comments/RepliesSection.tsx`. Map reply/edit/delete/cancel/submit icon roles and remaining local style declarations.


## 11.105 — RepliesSection semantic icon-action roles (2026-11-19)

### Scope and findings
- Continued with the next Section 10.1 comments entry after CommentsToggle.
- Re-opened `RepliesSection.tsx` and confirmed reply item/edit/body/social/create geometry already consumes named `REPLY_*` presets; the old note about local border/spacing styles was stale.
- The remaining direct action issue was that Save, Cancel, Edit, Reply and Delete IconButtons shared generic base/danger roles.

### Source changes
- Migrated Save reply to `save`, Cancel edit/reply to `cancel`, Edit reply to `edit`, Reply submit to `submit` and Delete reply to `delete` semantic icon-action roles.
- Reconciled the Section 10.1 RepliesSection row.

### Preserved
- Reply query/cache keys, viewer-state reset, permission/social-config gating, create/update/delete mutations, confirmation, invalidation, reply text state, Like/Favorite/Report actions and pending/disabled behavior.
- No API, DTO, validation, authorization, route or business logic changed.

### Result and status
- **1 source file changed** plus the Section 10.1 ledger reconciliation.
- Reply action semantics: **SOURCE MIGRATED**.
- Permission/config, field, mutation and responsive nested-state parity remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 social component: `src/components/social/EngagementBar.tsx`. Verify overlay action roles, responsive geometry and all Like/Favorite/Report state variants.


## 11.106 — EngagementBar disclosure role and ledger reconciliation (2026-11-19)

### Scope and findings
- Continued with the next Section 10.1 social component.
- Re-opened `EngagementBar.tsx` and verified inline/overlay shell and action-row layout are already preset-owned through `SOCIAL_ENGAGEMENT_INLINE_SX`, `getSocialOverlaySx` and `getSocialEngagementActionsSx`.
- Like/Favorite/Report already delegate to shared social controls; the only generic icon role in this component was the comments disclosure action.

### Source changes
- Migrated the comments Show/Hide/Add IconButton to `ICON_ACTION_STYLES.disclosure`.
- Reconciled the Section 10.1 EngagementBar row to remove stale claims about local responsive sx and raw unstyled IconButtons.

### Preserved
- Overlay/inline modes, small/medium size, comment count badge, external/internal comment ownership, event propagation suppression, social-config permission checks and nested CommentsSection behavior.
- No API, social, comment or business logic changed.

### Result and status
- **1 source file changed** plus the Section 10.1 ledger reconciliation.
- EngagementBar action and presentation contracts: **SOURCE MIGRATED**.
- All caller/responsive overlay states and permission/config combinations remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 social component: `src/components/social/TripGroupSocialActions.tsx`. Verify action semantics, animation, count badges and any remaining local style transport.


## 11.107 — Semantic Like/Favorite/Report/Share icon roles (2026-11-19)

### Source changes
- Added `ICON_ACTION_STYLES.like`, `favorite` and `share` aliases of the existing icon-action base; Report already had its semantic role.
- Migrated TripGroupSocialActions Like/Favorite/Report/Share IconButtons to their semantic roles.
- Migrated the shared LikeButton and FavoriteButton components to the same roles, so all consumers share one semantic contract.
- Reconciled the Section 10.1 TripGroupSocialActions row.

### Preserved
- Like/favorite/report API mutations and permissions, current-user pressed states, counts/badges, animation requests/failure feedback, report withdrawal, share URL/title/text/day query and copied-link feedback.
- Existing icon dimensions, colors, hover/focus behavior and action ordering.
- No API, social, route, data or business logic changed.

### Result and status
- **4 source files changed** plus the Section 10.1 ledger reconciliation.
- Like/Favorite/Report/Share icon-action roles: **SOURCE MIGRATED**.
- Permission/config, animation, share-feedback and responsive caller state parity remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the remaining common social components in Section 10.1; verify ReportButton's dialog Cancel/Submit roles and the shared social action wrappers before moving to the live-tracking feature.


## 11.108 — ReportButton dialog/action contract verification (2026-11-19)

### Scope and findings
- Continued the shared social-action review after Section 11.107.
- Re-opened `ReportButton.tsx` and verified the icon uses `ICON_ACTION_STYLES.report`; tooltip wrapper, reason field and error feedback use named social presets.
- Dialog Paper inherits the shared `MuiDialog` surface. Cancel and Submit are native MUI text Buttons with no local sx skin; their default appearance is intentionally retained rather than duplicated in a new preset.
- Report open/close, submit, pending, error and withdraw states are component/hook behavior, not local visual styling.

### Result and status
- Report icon/dialog surface/field/error presentation: **SHARED/THEME CONTRACTS VERIFIED**.
- Cancel/Submit intentionally retain MUI text-button defaults; no source change was necessary.
- Report dialog field-state and keyboard/focus parity remain part of the global field-state audit.
- No API, report permission or mutation behavior changed. No build, tests, lint, CI or browser validation was run.

### Next
- Remove the remaining ad hoc badge/animation sx objects from shared LikeButton/FavoriteButton by moving them into the existing social preset owner.


## 11.109 — Like/Favorite badge and animation sx centralization (2026-11-19)

### Source changes
- Added `getSocialBadgeSx(size)` to the shared social preset owner; small badge dimensions now have one named consumer API.
- Migrated LikeButton and FavoriteButton away from inline conditional badge sx objects.
- Migrated LikeButton's inline icon animation sx object to the existing `getSocialLikeAnimationSx` preset helper.
- This completes the dynamic presentation ownership used by the shared Like/Favorite controls and TripGroupSocialActions.

### Preserved
- Small/medium badge appearance, counts, zero-count visibility, like animation values/timing, mutation state, pressed state, tooltip/aria labels and social API behavior.
- No visual values or social behavior changed.

### Result and status
- **3 source files changed**.
- Shared Like/Favorite badge and like-animation presentation: **PRESET-OWNED**.
- Consumer permission/config, responsive overlay and mutation state parity remain **PARTIAL** under the social workstream.
- No API, data, route or business logic changed. No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the remaining common/social consumer verification in Section 10.1, then move to `src/components/tracking/LiveTracker.tsx` and the maps/tracking action contracts.


## 11.110 — LiveTracker current-source reconciliation (2026-11-19)

### Scope and findings
- Continued with the next tracking component in Section 10.1.
- Re-opened `LiveTracker.tsx` and `tracking.ts`.
- The old CHANGE REQUIRED row was stale: map frame/loading, Google Maps configuration, action row, status and telemetry layout already consume named tracking presets/constants.
- Start/Stop use the named tracking action styles. Reset/Follow intentionally retain MUI text-button defaults; no redundant custom preset is added.
- `mapContainerStyle` is a Google Maps SDK configuration prop, not a React `style` prop.

### Result and status
- Corrected the Section 10.1 LiveTracker row.
- LiveTracker visual ownership: **SHARED PRESETS / MUI DEFAULTS VERIFIED**.
- Geolocation permission/error, tracking lifecycle, follow/pan and responsive telemetry state parity remain **PARTIAL**.
- No source change, API, route, data or tracking behavior changed. No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next map/tracking entry in Section 10.1: `src/components/maps/GoogleMapView.tsx`. Verify the map canvas/loading geometry contract and its direct consumers without treating Google Maps SDK options as React inline styles.


## 11.111 — GoogleMapView SDK container/loading preset migration (2026-11-19)

### Source changes
- Added `getGoogleMapContainerStyle(height)` to the map-controls preset owner for the Google Maps SDK's required `mapContainerStyle` configuration.
- Added `GOOGLE_MAP_LOADING_INDICATOR_SIZE` to the same owner.
- Migrated GoogleMapView away from its component-local SDK config object and numeric CircularProgress size literal.
- Reconciled the Section 10.1 GoogleMapView row.

### Preserved
- Map width/height conversion, loading frame dimensions, SDK loading, center/zoom, options, markers, polyline, InfoWindow, fitBounds/focus, map click/drag and caller callbacks.
- The SDK's `mapContainerStyle` remains a configuration prop, not a React `style` prop.
- No API, map data, route or business logic changed.

### Result and status
- **2 source files changed** plus the Section 10.1 ledger reconciliation.
- GoogleMapView frame/loading/SDK container presentation: **PRESET-OWNED**.
- Direct caller frame ratios, responsive map interactions and loading/error parity remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with `PointLocationPicker.tsx` and `TripLocationPicker.tsx`; keep their distinct GPS/find-in-map versus trip search/marker-clear semantics separate while auditing shared map/action contracts.


## 11.112 — Map picker Remove Marker role and GPS loading token (2026-11-19)

### Source changes
- Added `BUTTON_STYLES.removeMarker` as a semantic alias of the existing secondary appearance.
- Migrated PointLocationPicker's Remove Marker action to the shared role and reused it in TripLocationPicker's existing marker-clear preset.
- Added `POINT_LOCATION_GPS_LOADING_INDICATOR_SIZE` to the map-controls preset owner and replaced the component-local 14px CircularProgress literal.
- Reconciled both Section 10.1 map-picker rows.

### Preserved
- Point picker GPS permission/error flow, find-in-map trigger, coordinate synchronization, marker click/drag, address-to-point-name behavior and Snackbar.
- Trip picker map click/drag, address search, marker clear, center/zoom and hint behavior. Point and trip pickers remain separate implementations.
- Existing Remove Marker appearance and GPS loading indicator size.
- No API, coordinate, map, route or business logic changed.

### Result and status
- **3 source files changed** plus the Section 10.1 ledger reconciliation.
- Remove Marker role and GPS loading size: **SOURCE MIGRATED**.
- Geolocation/search/marker and responsive caller state parity remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the remaining map/social components in Section 10.1; verify AddressAutocomplete and map picker callers, then proceed to the remaining auth/common/admin action owners.


## 11.113 — Admin Delete role ledger reconciliation (2026-11-19)

- Reconciled the Section 10.1 AdminUsers and AdminUserProfileImage rows after Section 11.87 migrated their Delete actions from `dangerText` to the explicit `deleteText` role.
- No source change was required; this closes a stale wording gap between the operational register and the later implementation notes.
- Both files remain **PARTIAL** only for caller/authorization/mutation-state verification.
- No build, tests, lint, CI or browser validation was run.

### Next
- Return to the next point-page entry in Section 10.1 order: `src/components/points/EditPointPage.tsx`, then `CreatePointPage.tsx`.


## 11.114 — EditPointPage current-source reconciliation and Delete role (2026-11-19)

### Scope and findings
- Returned to the next point-page entry in Section 10.1 order after completing the intervening admin/auth/social/map checks.
- Re-opened `EditPointPage.tsx` and the `forms.ts` preset owner.
- The old CHANGE REQUIRED note was stale: page/loading/error/map/content/form/image-grid/tile/placeholder geometry already consumed named `EDIT_POINT_*` presets; map, form and image rendering delegated to shared components.
- The image-delete overlay preset was the remaining generic danger role.

### Source changes
- Migrated `EDIT_POINT_IMAGE_DELETE_SX` from generic `ICON_ACTION_STYLES.danger` to semantic `ICON_ACTION_STYLES.delete`.
- Reconciled the Section 10.1 EditPointPage row.

### Preserved
- Point fetch/permission checks, map coordinate synchronization, find-in-map trigger, image grid/count, delete confirmation, pending state, API call and local image removal.
- Existing delete overlay appearance, position and z-index.
- No API, route, data or business logic changed.

### Result and status
- **1 source file changed** plus the Section 10.1 ledger reconciliation.
- EditPointPage page composition: **PRESET-OWNED**; image Delete role: **SOURCE MIGRATED**.
- Permission/load/delete and responsive caller state parity remain **PARTIAL**.
- No build, tests, lint, CI or browser validation was run.

### Next
- Continue with the next Section 10.1 point-page entry: `src/components/points/CreatePointPage.tsx`. Verify its page geometry, loading/error state, map frame and nested PointForm ownership.
