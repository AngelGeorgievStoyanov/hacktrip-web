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
| `app/globals.css` | Reset and `.app-shell` use structural global CSS; `.ht-button` and danger hover remain a parallel native/server-rendered button skin consuming selected `--ht-*` variables. | Keep reset/shell only; retain `.ht-button` until every server-rendered consumer and template is exhaustively traced, then migrate to the shared semantic action contract. | PARTIAL — legacy global skin still exists. |
| `app/(public)/about/AboutPage.module.css` | Space Mono, weights/clamp sizes, margins, text shadow | Consume typography tokens/CSS variables; keep layout/responsive rules |
| `app/(public)/privacy-policy/LegalPage.module.css` | Page/content padding, typography, Back-link skin | Tokenize; Back link must use shared Back role |
| `src/components/common/NotFound.module.css` | Home button skin | Use shared CTA role; keep page layout/background |
| `src/components/images/ImageGallery.module.css` | Gallery structure; shared variables | Verify selectors/consumers; preserve structure |
| `src/components/layout/Footer.module.css` | Literal horizontal padding | Use shared page/container gutter |
| `src/components/trips/TripDetailsView.module.css` | Unique responsive grid/flex, container query rearrangement and component-specific positioning; spacing partly uses `--ht-spacing-*`. | Literal max widths, grid tracks and `20px` content margins remain local geometry; classify which are truly unique and move repeated spacing to tokens. No card skin found. | PARTIAL — structural module with residual geometry literals. |
| `src/components/trips/TripList.module.css` | Empty-state typography/margins | Use shared typography/spacing |
| `src/components/trips/TripPagination.module.css` | Outer margin | Use shared pagination spacing |

### 5.4 Shared/common, navigation and images

| File | Finding | Required action |
|---|---|---|
| `src/components/common/BackButton.tsx` | Back preset, but callers can override `sx` | Enforce Back role; allow layout/accessibility props only |
| `src/components/common/ConfirmDialog.tsx` | MUI Dialog Paper inherits `MuiDialog.paper` → `getSurfaceStyles`. | Cancel and Confirm are both direct `contained` primary Buttons, so semantic action roles are indistinguishable; dialog spacing remains default/local composition. | PARTIAL — surface centralized, action roles missing. |
| `src/components/common/NotFound.tsx` | Native button + CSS skin | Use shared CTA role |
| `src/components/common/ExpandableText.tsx` | Direct Button + local `sx` | Use shared Expand/Collapse role |
| `src/components/common/PasswordField.tsx` | TextField + IconButton defaults | Use common field/icon-control contract |
| `src/components/common/PasswordRequirements.tsx` | Local row `sx` and conditional colors | Use feedback tokens + shared typography |
| `src/components/common/NotificationProvider.tsx` | Shared Snackbar + Alert provider; severity and placement are data-driven from notification constants. | Alert width is local `sx`; no custom Card/Paper surface. Confirm consistent global Alert/Snackbar states in theme overrides. | PARTIAL — shared provider, small local presentation override. |
| `src/components/layout/Header.tsx` | MUI AppBar/Toolbar and Drawer; drawer Paper uses local elevation 12 and height auto; breakpoint and menu icon size use shared constants. | Desktop and drawer navigation Buttons are direct MUI defaults; local `NAV_BUTTON_SX`, toolbar padding, Drawer Paper treatment and IconButton sizing lack semantic Navigation/Menu contracts. | CHANGE REQUIRED — navigation and Drawer surface parity incomplete. |
| `src/components/layout/Footer.tsx` | CSS Module consumer | Use shared footer/page gutter |
| `src/components/CustomFileUploadButton.tsx` | Raw IconButton and Button | Use shared Upload/Select and icon roles |
| `src/components/images/AppImage.tsx` | Central preset resolver; no arbitrary style prop | Preserve boundary; define a named preset for each shared image role |
| `src/components/images/ImageGallery.tsx` | CSS Module + local `sx` | Use shared image button/frame presets |
| `src/components/images/ImageLightbox.tsx` | MUI Dialog Paper inherits shared Dialog surface then intentionally overrides background with `UI_COLORS.surface.imageLightbox`; close/previous/next share local `controlSx`. | Overlay icon control appearance and three repeated position/z-index rules are local; caption and image-stage composition need named lightbox/overlay contracts. | PARTIAL — dedicated Dialog surface variant, overlay controls local. |
| `src/components/images/ImageUploadField.tsx` | Local preview geometry/radius/objectFit + raw buttons | Use image-preview preset + Remove/Upload roles |
| `src/components/auth/ProfileImage.tsx` | Fullscreen preview uses MUI Dialog; image stage consumes `imageLightbox`/`imageControl` color tokens; image rendering delegates to AppImage presets. | Dialog Paper itself has shared Dialog surface but inner stage overrides it; circular frame, remove control, preview border/radius/shadow and close control remain local. | PARTIAL — image surface tokens exist, component geometry/actions remain local. |
| `src/components/admin/AdminUserProfileImage.tsx` | Local image button dimensions + raw Delete/Upload | Reuse profile-image/action roles |
| `src/components/admin/AdminImages.tsx` | Preview uses MUI `Dialog` and inherits `MuiDialog.paper` surface; inventory tables use `TableContainer component={Paper}` and `ADMIN_TABLE_CONTAINER_SX`. | Standalone Paper skin is not covered by general `MuiPaper` override; preview Dialog inherits shared surface but image-stage geometry/close control are local; selection, action and pagination controls remain direct MUI. | PARTIAL — Dialog surface centralized; Paper/table and actions need contracts. |
| `src/components/placeholders/SocialObjectPlaceholder.tsx` | Local overlay/text sizes/gradient | Use shared placeholder overlay tokens/typography |

### 5.5 Auth, profile and admin

| File | Finding | Required action |
|---|---|---|
| `src/components/auth/LoginForm.tsx` | Form wrapper consumes `AUTH_FORM_SX` → `PANEL_SX` → `getSurfaceStyles`; action row and title use presets. | Password visibility IconButton is raw MUI; TextField states and semantic Register/Forgot/Resend actions remain uncentralized. | PARTIAL — auth panel surface centralized. |
| `src/components/auth/RegisterForm.tsx` | Form wrapper consumes `AUTH_FORM_SX` → `PANEL_SX` → `getSurfaceStyles`; action row/title use presets. | TextFields, PasswordField, Checkbox and disabled/validation states require form-control mapping; action roles remain generic. | PARTIAL — auth panel surface centralized. |
| `src/components/auth/ForgotPasswordForm.tsx` | Form wrapper consumes `AUTH_FORM_SX`, which composes `PANEL_SX` → `getSurfaceStyles`; title/back action use named presets. | TextField visual states and submit action still depend on theme defaults/preset; Back caller margin override remains. | PARTIAL — auth panel surface centralized. |
| `src/components/auth/ResendVerificationForm.tsx` | Form wrapper consumes `AUTH_FORM_SX` → `PANEL_SX` → `getSurfaceStyles`; title/back action use presets. | Field/submit states remain to map; Back caller margin override remains. | PARTIAL — auth panel surface centralized. |
| `src/components/auth/ResetPasswordForm.tsx` | Form wrapper and success section consume `AUTH_FORM_SX` → `PANEL_SX` → `getSurfaceStyles`. | Both form and success branch need consistent semantic action roles; fields and validation/disabled states remain open. | PARTIAL — auth panel surface centralized in both branches. |
| `src/components/auth/VerifyEmailForm.tsx` | Renders MUI Card, so base surface inherits `MuiCard` → `getSurfaceStyles`. | Local Card sizing/padding and heading weight remain; no dedicated semantic panel preset. | PARTIAL — base Card skin only. |
| `src/components/auth/ChangePasswordForm.tsx` | Account field preset; local action spacing | Use shared field and Save/Submit |
| `src/components/auth/ProfileForm.tsx` | Local title/field `sx`; primary/secondary buttons | Use shared field/heading/action roles |
| `src/components/auth/ProfileImage.tsx` | See image findings | Use shared image/action roles |
| `src/components/auth/Captcha.tsx` | Local CAPTCHA container `sx` | Keep integration geometry; tokenize spacing |
| `src/components/admin/AdminUserForm.tsx` | Imports and applies `PANEL_SX(theme)` to its rendered form panel; Save/Delete button presets are already used. | Panel caller still adds local layout/padding; field states and semantic Delete role need mapping. This is a direct rendered `PANEL_SX` consumer. | PARTIAL — shared panel skin composed with local geometry. |
| `src/components/admin/AdminUsers.tsx` | User entries render MUI `Card` and inherit `MuiCard` → `getSurfaceStyles`; profile preview delegates to `ImageLightbox`. | Card content/grid geometry remains local; Edit/Delete are direct MUI Buttons with different raw props; pagination buttons and state are not semantic presets. | PARTIAL — base Card surface centralized only. |
| `src/components/admin/AdminNavigation.tsx` | Local navigation layout and active/inactive styles | Use shared Navigation role |
| `src/components/admin/AdminDashboard.tsx` | Link-based admin navigation | Verify link/button role parity |
| `src/components/admin/AdminFailedLogs.tsx` | Admin table uses `TableContainer component={Paper}` and `ADMIN_TABLE_CONTAINER_SX`. | General `MuiPaper` surface override is absent; direct selection, retry/delete and pagination controls remain uncentralized. | PARTIAL — table layout preset, no shared Paper skin. |
| `src/components/admin/AdminReports.tsx` | Admin table uses `TableContainer component={Paper}` and `ADMIN_TABLE_CONTAINER_SX`. | General `MuiPaper` surface override is absent; Resolve/Delete and pagination actions remain raw MUI roles/states. | PARTIAL — table layout preset, no shared Paper skin. |
| `src/components/admin/AdminRouteNotFoundLogs.tsx` | Admin table uses `TableContainer component={Paper}` and `ADMIN_TABLE_CONTAINER_SX`. | General `MuiPaper` surface override is absent; expanded-row surface, raw action buttons and pagination remain local. | PARTIAL — table layout preset, no shared Paper skin. |

### 5.6 Points, trips, maps and tracking

| File | Finding | Required action |
|---|---|---|
| `src/components/points/CreatePointPage.tsx` | Renders MUI Card with `POINT_FORM_PANEL_SX`; Card inherits `MuiCard` → `getSurfaceStyles`. | Page/container geometry and panel offset remain local; `POINT_FORM_PANEL_SX` is a layout + field inset preset, not a `PANEL_SX` consumer. | PARTIAL — Card skin centralized, geometry local. |
| `src/components/points/EditPointPage.tsx` | Renders MUI Card with `POINT_FORM_PANEL_SX`; Card inherits `MuiCard` → `getSurfaceStyles`. | Page layout and image control/frame states remain local; `POINT_FORM_PANEL_SX` is layout + field inset, not a `PANEL_SX` consumer. | PARTIAL — Card skin centralized, geometry local. |
| `src/components/points/PointActions.tsx` | Local action-row layout `sx` | Use shared action row and Edit/Delete |
| `src/components/points/PointCard.tsx` | MUI Card inherits `MuiCard` → `getSurfaceStyles`; shared button/card presets are consumed. | Local Card geometry and move IconButtons remain; comments panel and image/social overlay responsibilities are delegated. | PARTIAL — base Card surface centralized only. |
| `src/components/points/PointForm.tsx` | Local field/layout `sx` and stacked buttons | Use common fields and Create/Save/Cancel |
| `src/components/points/PointList.tsx` | Local list/container composition | Use shared list/empty state if repeated |
| `src/components/trips/TripActions.tsx` | Existing tripAction/tripActionDanger | Compare the same roles across all features |
| `src/components/trips/TripCard.tsx` | Both Card render branches inherit `MuiCard` → `getSurfaceStyles`; shared card/button presets are consumed. | Responsive card geometry and stepper/navigation controls remain local; semantic action-role parity still open. | PARTIAL — base Card surface centralized only. |
| `src/components/trips/TripDetails.tsx` | Renders MUI Card and inherits `MuiCard` → `getSurfaceStyles`. | Card geometry/content styles and direct icon/action controls remain local; map caller passes marker title only to SDK InfoWindow, not a custom app panel. | PARTIAL — base Card surface centralized only. |
| `src/components/trips/TripDetailsView.tsx` | CSS Module layout + local overlay `sx` | Preserve layout; centralize overlay |
| `src/components/trips/TripFilters.tsx` | Local select/filter style objects | Use common field/select contract |
| `src/components/trips/TripForm.tsx` | Renders MUI Card and inherits `MuiCard` → `getSurfaceStyles`; some stepper button presets already exist. | Card/field layout, remaining controls and Save/Add/Cancel semantic roles/states remain local. | PARTIAL — base Card surface centralized only. |
| `src/components/trips/EditTripLayout.tsx` | Directly composes `PANEL_SX(theme)` into a rendered edit panel; panel surface comes from `getSurfaceStyles`. | Caller adds route-specific dimensions/spacing; stepper, image actions, fields and Save/Add/Cancel roles remain local. | PARTIAL — direct panel consumer with local composition. |
| `src/components/trips/TripDaysNav.tsx` | Local page-item colors/spacing | Use shared day-navigation role/states |
| `src/components/trips/TripMapSection.tsx` | Renders MUI Card and inherits `MuiCard` → `getSurfaceStyles`; map and SDK InfoWindow are delegated to GoogleMapView. | Card dimensions/mobile geometry remain local; MobileStepper Back/Next Buttons are direct MUI controls without semantic Navigation/Pagination roles. | PARTIAL — base Card surface centralized only. |
| `src/components/trips/PointSection.tsx` | Renders MUI Card and inherits `MuiCard` → `getSurfaceStyles`. | `POINT_CARD_STYLE` still combines local card layout/content and visual responsibilities; image sizing and action controls need shared contracts. | PARTIAL — base Card surface centralized only. |
| `src/components/trips/PointsSection.tsx` | No style matches in initial scan | Inspect full file/imports before marking VERIFIED |
| `src/components/trips/DayImagesGallery.tsx` | Local image-wrapper geometry | Use named image-frame preset |
| `src/components/trips/TripList.tsx` | Renders `TripCard`; list references `cardListStyle`, empty-state heading uses `headingTextStyle`. | Both presentation presets are applied through prohibited React `style`; empty-state typography and list composition need migration to approved sx/className/token consumers. | CHANGE REQUIRED — React style violations. |
| `src/components/trips/TripPagination.tsx` | Crawlable `<nav>` with real Next links and `aria-current`; structural classes are in `TripPagination.module.css`. | No semantic pagination visual preset for link/active/disabled states; class module owns only list layout. | CHANGE REQUIRED — role styling missing. |
| `src/components/trips/TripSelectField.tsx` | TextField usage | Use common field contract |
| `src/components/maps/AddressAutocomplete.tsx` | Shared Autocomplete/TextField composition; accepts caller `inputSx`, `buttonSx`, `containerSx`, direction and `textFieldProps`. | Broad caller style injection allows feature-specific visual drift; define a constrained map-search variant and central field/button roles while preserving layout customization. | CHANGE REQUIRED — shared control has unrestricted visual overrides. |
| `src/components/maps/GoogleMapView.tsx` | Shared Google Maps renderer; Box owns canvas/loading geometry; `InfoWindowF` is the SDK InfoWindow and receives caller-provided ReactNode. | SDK owns map controls and InfoWindow chrome; current trip map caller passes marker title only. No app Card/Paper/Dialog or custom surface is rendered here. Keep map canvas geometry integration-specific. | STRUCTURAL — no app-owned panel skin. |
| `src/components/maps/PointLocationPicker.tsx` | Primary/secondary presets + local container/button `sx` | Use shared map field/action/panel |
| `src/components/maps/TripLocationPicker.tsx` | Map wrapper and autocomplete compose shared `MAP_ADDRESS_INPUT_SX` and `BUTTON_STYLES`; hint background uses `UI_COLORS.map.pickerHintBackground`. | Primary button re-declares `primary.main` and disabled colors before shared preset; hint padding and marker-clear sizing remain local. No Card/Paper panel. | PARTIAL — duplicate primary skin remains. |
| `src/components/tracking/LiveTracker.tsx` | Local surface `sx` + raw Start/Stop/Reset/Follow buttons | Use shared panel and tracking action roles |

### 5.7 Comments and social

| File | Finding | Required action |
|---|---|---|
| `src/components/comments/CommentsSection.tsx` | Two MUI Cards render the comments panel and each comment item; both inherit `MuiCard` → `getSurfaceStyles`. | `COMMENTS_PANEL_SX` and `COMMENT_CARD_SX` duplicate local panel/card layout and possibly visual surface responsibilities; edit/delete/save/cancel IconButtons remain raw. | CHANGE REQUIRED — custom panel presets need separation into structure vs skin. |
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
| `app/layout.tsx` | Root metadata, viewport theme color, `globals.css`, root `<html>/<body>` and `.app-shell` wrapper. | No independent surface skin; shell geometry is delegated to `.app-shell`. Keep metadata/layout concerns separate from design tokens. | STRUCTURAL — no local component skin. |
| `app/providers.tsx` | Central `ThemeProvider` and `CssBaseline` wrap app providers; installs Query/Auth/Background/Notification/Confirm providers. | No surface declarations; provider order is composition, not visual styling. Verify theme/CSS-variable ownership in Stage 2. | STRUCTURAL — theme is mounted centrally. |
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

## 10.1 File-level implementation ledger — explicit completed vs remaining work

This ledger is the operational source for answering "what is actually fixed in each file?". A file marked PARTIAL or inspected is **not** considered fixed. "Centralized" below means the source currently consumes an existing shared contract; it does not mean the entire file has been migrated or visually verified.

| File | Already centralized / confirmed | Still remaining | Current result |
|---|---|---|---|
| `src/components/points/PointCard.tsx` | Edit Point uses `BUTTON_STYLES.primary`; Delete Point uses `BUTTON_STYLES.danger`; Card surface is inherited from `MuiCard`; text inset/button margin use named card presets. | Edit has no dedicated semantic Edit role; Delete is the only current direct `danger` consumer found. Move-up/down IconButtons, card geometry/padding and action-row layout remain local; description wrapping and caller/state verification remain open. | PARTIAL — several responsibilities centralized, not fully fixed. |
| `src/components/points/PointForm.tsx` | Uses `BUTTON_STYLES.primary` for map lookup and other primary form actions; shared `BackButton` handles Back/navigation. | Primary role is mixed with local width/margin geometry in a reusable sx constant and at the map lookup call site. BackButton has caller-specific layout/conditional behavior; remaining form fields, upload, icon and disabled/loading states remain open. | PARTIAL — not fully fixed. |
| `src/components/points/PointActions.tsx` | Social actions are delegated to shared Like/Favorite/Report components and shared status component. | Wrapper layout `sx` is local; verify the nested social controls' visual contract and all callers. | PARTIAL — not fully fixed. |
| `src/components/points/PointList.tsx` | Delegates each item to the shared `PointCard`. | List layout remains local; verify responsive/layout requirements and empty state typography. | PARTIAL — not fully fixed. |
| `src/components/trips/TripCard.tsx` | Details navigation uses `BUTTON_STYLES.primaryWide`; card surface uses `MuiCard`; content consumes shared card presets. | Details is navigation but uses generic primary-wide action styling. Stepper Buttons remain direct MUI defaults; substantial geometry/content sx and responsive/caller verification remain. | PARTIAL — not fully fixed. |
| `src/components/trips/TripActions.tsx` | Three non-destructive actions (Add Next Day Trip, Add/Edit Points, Edit Day) use `BUTTON_STYLES.tripAction`; Delete Day and Delete Trip use `tripActionDanger`. | Edit/Add semantics are grouped under one trip-specific appearance; destructive actions share one role. Verify parity with point/admin action roles and loading/disabled/focus states. | PARTIAL — not fully fixed. |
| `src/components/common/BackButton.tsx` | Shared Back action fixes MUI `variant="contained"` and applies `BUTTON_STYLES.back`; caller owns navigation behavior. | `back` is currently an alias of `secondary`. Caller `sx` is merged before the shared preset (shared overlapping properties win), while all non-overlapping layout overrides and broad Button props remain possible. Nine callers are mapped in Section 11.7; decide whether the public override surface is sufficiently constrained. | PARTIAL — shared but semantic contract incomplete. |
| `src/theme/components/card.ts` | All MUI Cards receive `getSurfaceStyles` from the theme: paper background, divider border, theme radius and semantic surface shadow. | Verify non-MUI/custom card surfaces and every Card consumer; separate geometry/layout from surface styling. | PARTIAL — MUI Card surface contract exists; app-wide parity not yet proven. |
| `src/theme/components/dialog.ts` | MUI Dialog Paper receives the same `getSurfaceStyles` contract. | Other standalone MUI Paper consumers are not yet proven to share this contract; inspect all Paper usages and custom surfaces. | PARTIAL — Dialog Paper is centralized; general Paper parity remains open. |
| `src/theme/components/surface.ts` | Defines one shared surface contract for background, border, radius and shadow. | Confirm every intended surface uses it and that semantic variants (card, dialog, panel, popover) are covered without over-generalizing. | PARTIAL — shared primitive exists; adoption audit remains open. |
| `src/components/trips/PointSection.tsx` | Card surface inherits the shared MUI Card theme; text inset references the shared card preset. | Contains a React `style` prop for the text wrapper (must be migrated under policy 1.4); local Card/content layout and multiple local `sx` values remain. | CHANGE REQUIRED. |
| `src/components/points/EditPointPage.tsx` | Uses MUI Card theme surface for its Card. | Local layout `sx`, local IconButton styling and other page composition remain; inspect against shared point form/action roles. | CHANGE REQUIRED. |
| `src/components/points/CreatePointPage.tsx` | Uses MUI Card theme surface for its Card and central size token for content width. | Local layout `sx` and page composition remain; verify all nested form and action consumers. | PARTIAL — not fully fixed. |


| `src/components/admin/AdminFailedLogs.tsx` | Uses Paper table, Checkbox selection and direct pagination Buttons. | Map checkbox and pagination contracts; inspect ADMIN_TABLE_CONTAINER_SX / ADMIN_PAGINATION_SX consumers and all states. | PARTIAL — direct action roles remain. |
| `src/components/admin/AdminImages.tsx` | Uses shared admin table/pagination presets and Dialog for preview. | Multiple direct pagination Buttons, local preview IconButton positioning, local image/status spacing and surface details remain. | CHANGE REQUIRED. |
| `src/components/admin/AdminReports.tsx` | Paper table uses shared admin table container preset. | Direct action and pagination Buttons need semantic contracts; verify row states. | CHANGE REQUIRED. |
| `src/components/admin/AdminRouteNotFoundLogs.tsx` | Paper table uses shared admin table container preset. | Direct pagination Buttons, disclosure/expand action and local typography/spacing sx remain. | CHANGE REQUIRED. |
| `src/components/admin/AdminUserProfileImage.tsx` | Uses AppImage and shared column layout preset. | Local zoom trigger geometry and direct upload/remove actions remain; verify image role. | CHANGE REQUIRED. |
| `src/components/auth/ChangePasswordForm.tsx` | Password-change form consumes `BUTTON_STYLES.primary` for Save password. | The primary role is only a generic visual contract; local `alignSelf` and margin are merged into the same sx object. Field, pending/disabled and validation states remain part of the field/action audit. | PARTIAL. |
| `src/components/auth/VerifyEmailForm.tsx` | Uses MUI Card and `BUTTON_STYLES.primary` for the Go to login action. | The action is navigation but currently uses generic primary styling; Card content/heading sx and complete status/field state contract remain open. | CHANGE REQUIRED. |
| `src/components/auth/RegisterForm.tsx` | Uses shared auth form layout/title/action presets; primary Register action and two secondary actions consume `BUTTON_STYLES.primary` and a local alias of `BUTTON_STYLES.secondary`. | Secondary roles include navigation/alternate auth actions but currently share one generic secondary skin. TextField/Checkbox contract and locked-state treatment remain open. | PARTIAL. |
| `src/components/auth/ProfileForm.tsx` | Uses shared account field preset; `BUTTON_STYLES.primary` for Edit Profile; `BUTTON_STYLES.secondary` for Change Password; shared `BackButton` for navigation. | The Edit/Change Password semantic roles are still generic primary/secondary. Field/heading sx and action layout remain local; the Back caller currently has no local sx override. | CHANGE REQUIRED. |
| `src/components/auth/ProfileImage.tsx` | Uses AppImage, Dialog and shared UI color/shadow tokens in some controls. | Local image frame dimensions/radii, IconButton positions, thumbnail sx and overlay states remain. | CHANGE REQUIRED. |
| `src/components/maps/AddressAutocomplete.tsx` | Uses MUI TextField and Autocomplete. | Local inputSx/containerSx and direct action Button remain; establish a named map-field variant inheriting the base field contract. | PARTIAL. |
| `src/components/maps/GoogleMapView.tsx` | Map canvas wrapper uses Box grid/flex layout and accepts size/height from callers; Google Maps owns map canvas and native map controls. | No MUI Card/Paper/Dialog or custom panel skin found in this file. Audit Google Maps built-in controls/InfoWindow separately from app-owned overlay surfaces; wrapper layout remains caller-owned. | PARTIAL — map canvas wrapper, not a shared surface implementation. |
| `src/components/maps/PointLocationPicker.tsx` | Map is rendered by `GoogleMapView`; address field consumes `MAP_ADDRESS_INPUT_SX`; Locate uses `BUTTON_STYLES.primary`; Clear Marker uses `BUTTON_STYLES.secondary`. | Map/action wrapper geometry and responsive sizing remain local sx; GPS action is a direct outlined Button; semantic roles and disabled/loading/focus states remain incomplete. No app-owned Card/Paper surface. | PARTIAL — field/action presets are partial; map composition remains local. |
| `src/components/maps/TripLocationPicker.tsx` | Map is rendered by `GoogleMapView`; address field consumes `MAP_ADDRESS_INPUT_SX`; Locate uses `BUTTON_STYLES.primary`; Clear Marker uses `BUTTON_STYLES.secondary`. | Hint overlay uses a local positioned Typography with `UI_COLORS.map.pickerHintBackground`; button height/background/disabled appearance are composed locally; map wrapper and responsive geometry remain local. No Card/Paper panel. | CHANGE REQUIRED — map hint and action composition are not fully centralized. |
| `src/components/trips/TripSelectField.tsx` | Reuses MUI TextField/Autocomplete for trip selection. | No explicit shared field preset at call sites; must inherit the centralized base field contract without feature-local skin. | PARTIAL. |
| `src/components/CustomFileUploadButton.tsx` | Shared upload component boundary exists. | Raw IconButton and contained Button component=label remain; define upload and icon-action roles. | CHANGE REQUIRED. |
| `src/components/images/AppImage.tsx` | Central AppImage abstraction selects named image presets and computes rendering style internally. | Audit every preset and caller; internal computed React style is an implementation detail of the approved image abstraction, not permission for consumer-level style props. Document and preserve this boundary. | PARTIAL. |
| `src/components/images/ImageGallery.tsx` | Uses AppImage named image presets and CSS Module for gallery structure; engagement controls delegate to shared `EngagementBar`. | Grid column count is runtime structural sx; native button focus-visible outline is locally specified; verify all image frame presets and overlay interaction states. No Card/Paper panel. | PARTIAL — image rendering and gallery structure are partly shared. |
| `src/components/images/ImageLightbox.tsx` | MUI Dialog Paper inherits shared Dialog surface contract; AppImage uses the `lightbox` image preset; image-control colors use semantic `UI_COLORS.surface.imageControl*`. | Dialog Paper background is overridden to `imageLightbox`; three IconButtons share `controlSx` but each repeats position/z-index geometry; caption and image stage use local overlay layout. Lightbox surface variant and icon-action role/state contract remain uncentralized. | CHANGE REQUIRED — base Dialog surface reused, image-specific overlay is a deliberate variant with local controls. |
| `src/components/images/ImageUploadField.tsx` | Shared upload field and AppImage usage. | Local thumbnail dimensions/objectFit/radii, layout sx, raw remove/delete-all IconButtons and upload Button remain. | CHANGE REQUIRED. |
| `src/components/common/ExpandableText.tsx` | Shared disclosure component exists. | Direct disclosure Button and local sx require a shared expand/collapse role and state contract. | PARTIAL. |
| `src/components/common/NotFound.tsx` | Uses a CSS Module boundary. | Native Home button must be mapped to a shared navigation/action role; inspect paired NotFound.module.css skin. | CHANGE REQUIRED. |
| `src/components/common/NotificationProvider.tsx` | Uses MUI notification primitives. | Only a width sx surfaced in this pass; inspect Alert/Snackbar global state and theme parity before marking complete. | PARTIAL. |
| `src/components/common/PasswordField.tsx` | Uses MUI TextField. | Password reveal IconButton is local; must consume the shared icon-action contract and base field states. | PARTIAL. |
| `src/components/common/WelcomeHeading.tsx` | Uses shared HOME_HEADING_STYLE preset and MUI typography. | React style prop on h1 and local padding/heading sx violate styling API policy; migrate after inventory. | CHANGE REQUIRED. |
| `src/components/comments/CommentsSection.tsx` | Uses shared comments panel/card and social action presets; MUI Card surface is theme-backed. | React style prop on list, local comment/card spacing and many IconButtons/TextFields remain; map all edit/delete/reply/report states. | CHANGE REQUIRED. |
| `src/components/comments/CommentsToggle.tsx` | Uses MUI IconButton for comments disclosure. | React style prop on wrapper and local heading margin remain; disclosure state should use shared contract. | CHANGE REQUIRED. |
| `src/components/comments/RepliesSection.tsx` | Uses shared social action preset and MUI TextField. | Multiple raw IconButtons and local border/spacing sx remain; map reply/edit/delete/cancel/submit roles. | CHANGE REQUIRED. |
| `src/components/social/EngagementBar.tsx` | Uses shared social action composition. | Responsive local sx and raw IconButton remain; verify all action states and consumers. | CHANGE REQUIRED. |
| `src/components/social/TripGroupSocialActions.tsx` | Uses shared like animation and social action components in part. | Multiple raw IconButtons, local gaps and React style error spans remain; centralize icon actions and state feedback without merging distinct semantics. | CHANGE REQUIRED. |
| `src/components/tracking/LiveTracker.tsx` | Uses TRACKING_SURFACE_SX and layout primitives. | Start/Stop/Reset/Follow are direct Buttons; local tracking surface and status/detail spacing need role and surface mapping. | CHANGE REQUIRED. |
| `src/components/trips/TripDaysNav.tsx` | Uses MUI PaginationItem with PAGE_ITEM_SX. | Local pagination item margins and outer margin remain; verify selected/disabled/focus states. | CHANGE REQUIRED. |
| `src/components/trips/TripFilters.tsx` | Uses theme values for some Select styling and reusable local constants. | SELECT_BOX_SX, FILTER_LABEL_SX and FILTER_SELECT_SX remain feature-owned; three Select consumers and responsive values need central field/filter variant mapping. | CHANGE REQUIRED. |
| `src/components/trips/TripMapSection.tsx` | MUI Card inherits `MuiCard` → `getSurfaceStyles`; map rendering is delegated to `GoogleMapView`; responsive breakpoints/dimensions come from map/UI constants. | Card width/height/box-sizing and mobile layout remain local sx; MobileStepper uses direct MUI Buttons for Back/Next with no semantic navigation preset. No `PANEL_SX` use. | CHANGE REQUIRED — surface base centralized, map-card geometry and navigation roles remain local. |
| `src/components/trips/DayImagesGallery.tsx` | Uses image gallery composition. | Local image container width/maxWidth/aspect ratio remains; compare with named gallery image roles and CSS module geometry. | PARTIAL. |


| `app/(account)/favorites/page.tsx` | Uses shared account page/content/heading/empty-state presets and delegates populated results to TripList. | Local CircularProgress margin and Alert max-width remain; verify empty-state typography alias and child TripList contract. | PARTIAL — wrapper partly centralized. |
| `app/(account)/profile/page.tsx` | Uses shared PANEL_SX for the inner panel. | Outer page layout and additional inner panel geometry/padding/gap remain local sx; distinguish reusable panel skin from unique route composition. | CHANGE REQUIRED. |
| `app/(account)/trips/create/page.tsx` | Route delegates to TripForm within Suspense; no direct visual styling found. | Verify TripForm consumer ledger; no separate route-level visual migration indicated. | PARTIAL — composition wrapper only. |
| `app/(account)/trips/create/points/page.tsx` | Route delegates to CreatePointPage within Suspense; no direct visual styling found. | Verify CreatePointPage consumer ledger; no separate route-level visual migration indicated. | PARTIAL — composition wrapper only. |
| `app/(public)/live-tracking/page.tsx` | Uses ROUTE_CONTENT_PADDING token as the source value. | Applies token through React style prop on main; move to approved class/preset/CSS variable contract. LiveTracker is separately audited. | CHANGE REQUIRED. |
| `app/(public)/page.tsx` | Uses HomeHero/HomeTrips shared feature components and CENTERED_PAGE_MAIN_STYLE preset. | Applies layout preset through React style prop on main; migrate to approved styling API. | CHANGE REQUIRED. |
| `app/(public)/trips/page.tsx` | Uses shared TripFilters, TripList, TripPagination, WelcomeHeading and typography/layout presets. | Applies React style props to main/p and defines local INTRO_STYLE by extending shared preset; catch branch also references MAIN_STYLE. Move shared composition to approved styling API and resolve the route-owned variant. | CHANGE REQUIRED. |
| `app/(public)/trips/[id]/page.tsx` | Delegates trip presentation to TripDetailsView and uses CENTERED_PAGE_MAIN_STYLE. | React style prop on main; move route composition to approved styling API. Nested TripDetailsView is separately audited. | CHANGE REQUIRED. |
| `src/components/admin/AdminDashboard.tsx` | Semantic nav/list/link structure; no local visual declarations found. | Verify rendered navigation/link styling against shared navigation contract and parent Admin layout; no direct style migration confirmed in this file. | PARTIAL — structural only. |
| `src/components/auth/RequireModeratorRedirect.tsx` | Auth guard returns children or null; no visual declarations. | No visual migration in this file; verify only through child component ownership. | NON-VISUAL — no styling target. |
| `src/components/common/JsonLd.tsx` | Emits JSON-LD script only; no rendered visual UI. | No visual migration target. | NON-VISUAL — no styling target. |
| `src/components/common/ScrambleHeading.tsx` | Uses HOME_HEADING_STYLE as base typography preset. | Public style prop allows caller-provided React presentation style and is spread into the h1; replace with approved semantic class/variant or documented nonvisual runtime API, then audit all callers. | CHANGE REQUIRED. |

| `app/(account)/layout.tsx` | Route shell currently applies ROUTE_CONTENT_PADDING through React style on main. | Replace presentation style prop with approved CSS class/preset/variable contract; preserve flex shell structure. | CHANGE REQUIRED. |
| `app/(account)/my-trips/page.tsx` | Uses shared page/content/heading/empty-state presets; empty-state CTA consumes `BUTTON_STYLES.createTrip` and links to trip creation. | The Create Trip role is still a one-off preset rather than a complete reusable semantic action contract. CircularProgress margin, Alert width/maxWidth and heading alias remain local. | CHANGE REQUIRED. |
| `app/(account)/points/edit/[pointId]/page.tsx` | Route delegates to EditPointPage; no direct visual declarations in route. | Ensure EditPointPage is independently represented in ledger and all its consumers are audited; route itself has no separate skin. | NON-VISUAL ROUTE — child owns UI. |
| `app/(account)/trips/[id]/edit/page.tsx` | Server route validates IDs/ownership and delegates presentation to EditTripLayout; no direct visual declarations. | Ensure EditTripLayout is independently audited; route itself has no separate skin. | NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/failed-login-logs/page.tsx` | Route wrapper delegates to AdminFailedLogs; no direct visual declarations. | AdminFailedLogs owns table, selection, pagination and action UI and must be tracked independently. | NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/images/page.tsx` | Route wrapper delegates to AdminImages; no direct visual declarations. | AdminImages owns image table, preview dialog, upload and pagination controls and must be tracked independently. | NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/page.tsx` | Minimal semantic section wrapper. | Raw h1 has no explicit shared heading contract; determine whether parent Admin layout owns heading defaults or use a shared semantic heading role. | CHANGE REQUIRED. |
| `app/(admin)/admin/reports/page.tsx` | Route delegates to AdminReports inside a semantic section. | AdminReports owns report action/table/pagination styles; raw h1 on route needs shared heading contract. | CHANGE REQUIRED. |
| `app/(admin)/admin/route-not-found-logs/page.tsx` | Route wrapper delegates to AdminRouteNotFoundLogs; no direct visual declarations. | AdminRouteNotFoundLogs owns table/disclosure/pagination controls and must be tracked independently. | NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/users/[userId]/page.tsx` | Route delegates to AdminUserForm in a semantic section; no local style declaration. | AdminUserForm owns form fields/actions and must be tracked independently. | NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/users/page.tsx` | Route wrapper delegates to AdminUsers; no direct visual declarations. | AdminUsers owns user table, filters and actions and must be tracked independently. | NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/layout.tsx` | Admin route shell uses ROUTE_CONTENT_PADDING but applies it via React style prop on main. | Move shared shell spacing to approved styling API; verify AdminNavigation and page content composition under this layout. | CHANGE REQUIRED. |

### Surface / Paper clarification

- MUI `Card` is already globally wired to `getSurfaceStyles` through `MuiCard`.
- MUI `Dialog`'s `paper` slot also uses the same `getSurfaceStyles`.
- This does **not** prove that every standalone `Paper`, custom panel, CSS surface or image/map overlay is centralized. A repository-wide Paper/surface consumer audit is still required.
- Therefore: Card background/border/radius/shadow are centralized at the MUI Card level; general Paper parity is **not yet complete or verified**.

| `app/(auth)/forgot-password/page.tsx` | Route metadata (`title`, `NOINDEX`) and delegation to `ForgotPasswordForm`; no route-owned visual declarations. | Audit the child form's field, button, loading/error and Back roles in its own ledger entry; route itself has no styling migration. | NON-VISUAL ROUTE — form owns UI. |
| `app/(auth)/layout.tsx` | Composes shared Header, Footer and GuestOnly auth gate; uses the canonical `ROUTE_CONTENT_PADDING` token. | `<main>` and inner width wrapper use React `style` props (`display`, centering, padding, flex, width, max-width); migrate presentation to approved CSS Module/preset/token consumers. Preserve the 480px auth content constraint as a named dimension if it recurs. | CHANGE REQUIRED. |
| `app/(auth)/login/page.tsx` | Route metadata (`Login`, `NOINDEX`) and Suspense boundary around `LoginForm`. | No route-level visual rules; `LoginForm` owns fields, password reveal, submit, errors and loading states and must be audited separately. | NON-VISUAL ROUTE — form owns UI. |
| `app/(auth)/register/page.tsx` | Route metadata and composition of `GuestOnly` with `RegisterForm`. | No route-level visual declarations; inspect the child form's shared field/checkbox/action contracts. The route-level GuestOnly boundary is behavioral, not a styling contract. | NON-VISUAL ROUTE — form owns UI. |
| `app/(auth)/resend-verification/page.tsx` | Route metadata (`NOINDEX`) and delegation to `ResendVerificationForm`. | No route-owned visual declarations; the child form owns fields, Back action, submit and feedback states. | NON-VISUAL ROUTE — form owns UI. |
| `app/(auth)/reset-password/page.tsx` | Route metadata and async `searchParams` handling; passes only a string token to `ResetPasswordForm`. | No route-level visual declarations; child form owns password fields, requirements, submit/Back actions and feedback states. | NON-VISUAL ROUTE — form owns UI. |
| `app/(auth)/verify-email/page.tsx` | Route metadata and async `searchParams` handling; passes only a string token to `VerifyEmailForm`. | No route-level visual declarations; child form owns Card surface, status/feedback and action styling. | NON-VISUAL ROUTE — form owns UI. |
| `app/(public)/about/AboutPage.module.css` | Page/container and image-row structure; page padding, colors, image-row gaps and decorative heading shadow already consume selected `--ht-*` variables; responsive stacking is unique layout. | Local Space Mono family, font weights, clamp font sizes, heading margins and text-shadow declaration still own typography/visual treatment; replace shared values with typography tokens/semantic editorial variant and CSS variables. Verify the remaining selectors against all About content. | CHANGE REQUIRED. |
| `app/(public)/about/page.tsx` | SEO metadata uses `buildSeoMetadata`; content hierarchy uses semantic sections; page imports `WelcomeHeading` and the named `aboutIllustration` image preset for image dimensions/sizes. | Defines local `imageStyle` and passes React `style` props to every Next Image (display, dimensions, max-width, margin, padding, object-fit); migrate to AppImage/named image role or CSS Module structure plus shared image tokens. Audit direct Next Image use and preserve responsive sizing, spacing and image rendering. | CHANGE REQUIRED. |
| `app/(public)/layout.tsx` | Shared Header/Footer composition; comment explains the flex-fill wrapper needed to keep Footer at the viewport bottom while pages own their `<main>`. | Wrapper uses React `style={{ flex: 1 }}`; move this structural shell rule to a semantic class/CSS Module or shared layout preset, preserving the shell behavior. | CHANGE REQUIRED. |
| `app/(public)/privacy-policy/LegalPage.module.css` | Page/content surface, text, border, link and TOC radius use selected `--ht-*` variables; CSS Module appropriately owns legal-document layout and anchor scroll offsets. | Local padding/margins/gaps, fixed font-size/line-height, and Back-link padding/skin remain; classify reusable spacing/typography and migrate to tokens. The `.legalPageBack` anchor is a separate native Back visual contract that must align with shared Back semantics without losing link navigation. | CHANGE REQUIRED. |
| `app/(public)/privacy-policy/page.tsx` | SEO metadata uses `buildSeoMetadata`; long-form terms/privacy content is data-driven through arrays and semantic sections; visual composition is delegated to `LegalPage.module.css`. | Native `.legalPageBack` anchor is the Back action consumer; verify its semantic consistency with shared BackButton while preserving href navigation. Check document headings/link typography against shared semantic typography; no React `style` or ad hoc `sx` found in this route. | CHANGE REQUIRED — native Back-link skin and typography parity remain. |

| `src/components/admin/AdminUserForm.tsx` | Admin user edit form; Save consumes `BUTTON_STYLES.save` (alias of primary), Delete uses `dangerText`, and navigation uses `BackButton`. | Save and Delete currently use different levels of destructive emphasis (filled primary vs text-only danger); confirm this is intentional. Back caller adds `alignSelf`/margin through sx. Form fields, pending state, confirmation and role-specific actions remain open. | CHANGE REQUIRED. |
| `src/components/auth/ForgotPasswordForm.tsx` | Forgot-password form; submit uses `BUTTON_STYLES.primary`; Back to login uses `BackButton` rendered as a Next Link. | Back caller supplies local margin via sx; primary submit and navigation roles are distinct but Back still aliases generic secondary. Audit shared field, captcha, loading/disabled and feedback states. | CHANGE REQUIRED. |
| `src/components/auth/LoginForm.tsx` | Login form uses `BUTTON_STYLES.primary` for Login and a local `SECONDARY_BUTTON_SX` alias of `BUTTON_STYLES.secondary` for three alternate/navigation actions (register and related auth actions). | One generic secondary skin is reused for multiple different secondary semantics; password reveal is a separate IconButton role. Audit fields, password visibility, disabled/loading and focus states. | CHANGE REQUIRED. |
| `src/components/auth/ResendVerificationForm.tsx` | Resend verification submit uses `BUTTON_STYLES.primary`; Back to login uses `BackButton` as a Next Link. | Back caller adds local margin via sx; generic primary/secondary aliases do not encode the distinct submit/navigation roles. Audit captcha, fields, loading/disabled and feedback states. | CHANGE REQUIRED. |
| `src/components/auth/ResetPasswordForm.tsx` | Reset password submit uses `BUTTON_STYLES.primary`; Back to login uses `BackButton` as a Next Link. | Generic primary and Back/secondary contracts remain; audit password fields, requirements, validation, loading/disabled and feedback states. | CHANGE REQUIRED. |
| `src/components/trips/EditTripLayout.tsx` | Edit Trip action uses `BUTTON_STYLES.primary`; route navigation uses shared `BackButton`. | Edit currently looks like generic primary rather than a semantic Edit role. Verify action layout and pending/disabled states with the shared trip action family. | CHANGE REQUIRED. |
| `src/components/trips/TripDetails.tsx` | Renders shared `BackButton` as a Next Link to `/trips`; supplies `TRIP_ACTION_BUTTON_LAYOUT_SX` for full-width/min-height layout. | Shared Back appearance is combined with trip-action geometry; confirm this role should remain visually secondary while preserving the full-width navigation affordance. | PARTIAL. |
| `src/components/trips/TripForm.tsx` | Uses `dayDecrement`/`dayIncrement` for day-number IconButtons; primary for Add Trip/Add Next Day; `secondaryLightText` for Add Points; shared BackButton for navigation. | Several different semantics still map to generic primary/secondary roles. Day stepper preset owns geometry and hover but lacks a complete icon-action state contract; Back and action layout remain caller-composed. Audit all form fields and state variants. | CHANGE REQUIRED. |

| `src/components/admin/AdminNavigation.tsx` | MUI Box nav wrapper and direct MUI Buttons; active/inactive navigation is expressed by local variant/color props. No shared navigation-action role is consumed. | Navigation role/state contract and local spacing/layout sx remain; map with header navigation consumers. | PARTIAL — visual role remains MUI defaults plus local composition. |
| `src/components/admin/AdminUsers.tsx` | MUI Card/CardContent surfaces inherit MuiCard; Avatar, Divider, Stack and shared admin pagination layout preset are used. | Card content geometry and avatar dimensions remain local; Edit/Delete and Previous/Next are direct Buttons with inconsistent role props; all states remain to map. | PARTIAL — surface base centralized, action and content contracts incomplete. |
| `src/components/auth/Captcha.tsx` | Uses MUI Box for the external CAPTCHA container; no custom panel or field preset. | Container min-height, disabled opacity and pointer-events are local runtime presentation; third-party widget owns its internal appearance. | PARTIAL — external widget boundary; wrapper state styling remains local. |
| `src/components/common/PasswordRequirements.tsx` | Semantic success/secondary/disabled colors use MUI palette; password rules are sourced from shared validation logic. | Grid/list spacing, icon state treatment and responsive columns remain component-local; map with field helper/error states. | PARTIAL — semantic colors theme-backed, layout/state contract incomplete. |
| `src/components/common/NotFound.module.css` | Text colors and spacing partially consume --ht-* CSS variables. | Home CTA still defines local background, padding, margin and border; page background image/position/cover and layout are unique composition but need documented ownership. | CHANGE REQUIRED — shared action visual values are partly local. |
| `src/components/home/HomeHero.tsx` | WelcomeHeading is shared; introductory typography consumes HOME_INTRO_STYLE preset. | Uses prohibited React style prop and adds local maxWidth 850; migrate to approved preset/class composition after inventory. | CHANGE REQUIRED — React style presentation violates policy 1.4. |
| `src/components/home/HomeTrips.tsx` | Heading consumes HOME_HEADING_STYLE preset; trip listing delegates to shared TripList. | Uses prohibited React style prop for heading; heading semantic HTML and spacing ownership need review. | CHANGE REQUIRED — React style presentation violates policy 1.4. |
| `src/components/images/ImageGallery.module.css` | Gallery spacing and image-button radius consume `--ht-spacing-*` and `--ht-shape-border-radius`; grid/stack variants are structural composition. | Native button reset, transparent background, clipping/overflow and aspect-ratio frame remain local; no card/panel surface. Cross-check focus-visible outline in `ImageGallery.tsx` and image frame presets. | PARTIAL — structural gallery module with some tokenized visuals. |
| `src/components/layout/Footer.module.css` | Text color uses inherit; footer primary/inverse colors consume --ht-* variables. | Horizontal padding and footer spacing remain hardcoded; verify footer/header surface and shell visual role consistency. | PARTIAL — colors centralized through CSS variables, spacing incomplete. |
| `src/components/layout/Footer.tsx` | Uses Footer CSS Module; behavior is isolated to iOS landscape scroll compatibility. | No visual declarations beyond class composition; footer CSS Module owns appearance and needs token review. | PARTIAL — component delegates visuals to module. |
| `src/components/layout/Header.tsx` | Uses BREAKPOINTS/mediaDown and UI_SIZES for responsive behavior and menu icon size; MUI AppBar/Drawer/Toolbar primitives. | Navigation buttons, welcome action, drawer Paper elevation/height and toolbar padding are mostly direct MUI props/local sx; no semantic nav/action presets. | CHANGE REQUIRED — navigation and drawer surface roles not fully centralized. |
| `src/components/placeholders/SocialObjectPlaceholder.tsx` | Placeholder colors consume UI_COLORS semantic tokens; image asset selection is data/state driven. | Overlay gradient, typography sizes, image object-fit style and geometry are local; React style on Next Image is a presentation exception candidate requiring approved abstraction. | PARTIAL — color tokens used, overlay contract remains local. |
| `src/components/trips/PointsSection.tsx` | Pure composition wrapper delegates selected point rendering to PointSection. | No visual skin of its own; selected-point section wrapper is semantic structure only. Child surface is owned by PointSection. | PARTIAL — composition only; consumer trace required. |
| `src/components/trips/TripDetailsView.tsx` | Uses CSS Module for unique trip-detail layout; sticky social controls consume STICKY_SOCIAL_SX and spacing token PAGE_CONTENT_PADDING. | Sticky shell geometry/background and component composition remain local; actual surfaces are delegated to TripDetails, gallery, comments and map children; no Card/Paper here. | PARTIAL — composition/layout owner; child surface contracts remain to audit. |
| `src/components/common/ConfirmDialog.tsx` | Uses MUI Dialog; its Paper inherits `MuiDialog.paper` → `getSurfaceStyles`. | Cancel and Confirm are direct MUI Buttons with the same primary/contained props; semantic roles, button states and dialog content spacing remain uncentralized. | PARTIAL — Dialog surface is centralized, action roles and layout remain. |
| `app/api/og/trips/[id]/route.ts` | Server route parses trip/day parameters, loads OG data and delegates image generation to `renderTripOgImage`; sets immutable cache headers. | No UI or CSS declarations in the route. Visual implementation is in the supporting renderer `src/lib/images/renderTripOgImage.tsx`; route cache/data behavior is not a styling concern. | STRUCTURAL — server image endpoint only. |
| `app/error.tsx` | Uses MUI Box, Typography and Alert; error message semantics are delegated to MUI primitives. | Local Box `sx` owns flex layout, gap, alignment and padding; retry is a direct contained MUI Button without the shared Retry/Navigation semantic role. No shared error-panel preset is consumed. | CHANGE REQUIRED — local error-screen composition and direct Retry action. |
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
| `src/lib/images/renderTripOgImage.tsx` | Supporting dependency outside the 163-file candidate filter; centralizes OG/Twitter image composition and consumes `SEO_BRAND`, OG dimensions and image validation/fetch limits. | Uses inline `style` objects for Next `ImageResponse`/Satori rendering, with many local geometry/typography literals. This is not an ordinary DOM consumer: record as a renderer-specific Styling API exception candidate and assess whether Satori's style-object contract requires it; no exception approval or source change made in this audit batch. | SUPPORTING DEPENDENCY — OG image renderer; separate review required. |

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
| `app/(account)/layout.tsx` | Route shell currently applies ROUTE_CONTENT_PADDING through React style on main. Remaining: Replace presentation style prop with approved CSS class/preset/variable contract; preserve flex shell structure. Status: CHANGE REQUIRED. |
| `app/(account)/my-trips/page.tsx` | Uses shared page/content/heading/empty-state presets and BUTTON_STYLES.createTrip. Remaining: CircularProgress local margin, Alert local width/maxWidth and heading style alias require mapping; audit all preset imports and empty/error/loading states. Status: CHANGE REQUIRED. |
| `app/(account)/points/edit/[pointId]/page.tsx` | Route delegates to EditPointPage; no direct visual declarations in route. Remaining: Ensure EditPointPage is independently represented in ledger and all its consumers are audited; route itself has no separate skin. Status: NON-VISUAL ROUTE — child owns UI. |
| `app/(account)/trips/[id]/edit/page.tsx` | Server route validates IDs/ownership and delegates presentation to EditTripLayout; no direct visual declarations. Remaining: Ensure EditTripLayout is independently audited; route itself has no separate skin. Status: NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/failed-login-logs/page.tsx` | Route wrapper delegates to AdminFailedLogs; no direct visual declarations. Remaining: AdminFailedLogs owns table, selection, pagination and action UI and must be tracked independently. Status: NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/images/page.tsx` | Route wrapper delegates to AdminImages; no direct visual declarations. Remaining: AdminImages owns image table, preview dialog, upload and pagination controls and must be tracked independently. Status: NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/page.tsx` | Minimal semantic section wrapper. Remaining: Raw h1 has no explicit shared heading contract; determine whether parent Admin layout owns heading defaults or use a shared semantic heading role. Status: CHANGE REQUIRED. |
| `app/(admin)/admin/reports/page.tsx` | Route delegates to AdminReports inside a semantic section. Remaining: AdminReports owns report action/table/pagination styles; raw h1 on route needs shared heading contract. Status: CHANGE REQUIRED. |
| `app/(admin)/admin/route-not-found-logs/page.tsx` | Route wrapper delegates to AdminRouteNotFoundLogs; no direct visual declarations. Remaining: AdminRouteNotFoundLogs owns table/disclosure/pagination controls and must be tracked independently. Status: NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/users/[userId]/page.tsx` | Route delegates to AdminUserForm in a semantic section; no local style declaration. Remaining: AdminUserForm owns form fields/actions and must be tracked independently. Status: NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/admin/users/page.tsx` | Route wrapper delegates to AdminUsers; no direct visual declarations. Remaining: AdminUsers owns user table, filters and actions and must be tracked independently. Status: NON-VISUAL ROUTE — child owns UI. |
| `app/(admin)/layout.tsx` | Admin route shell uses ROUTE_CONTENT_PADDING but applies it via React style prop on main. Remaining: Move shared shell spacing to approved styling API; verify AdminNavigation and page content composition under this layout. Status: CHANGE REQUIRED. |

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
