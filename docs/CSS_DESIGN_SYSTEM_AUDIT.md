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

## 10.1 File-level implementation ledger — explicit completed vs remaining work

This ledger is the operational source for answering "what is actually fixed in each file?". A file marked PARTIAL or inspected is **not** considered fixed. "Centralized" below means the source currently consumes an existing shared contract; it does not mean the entire file has been migrated or visually verified.

| File | Already centralized / confirmed | Still remaining | Current result |
|---|---|---|---|
| `src/components/points/PointCard.tsx` | Edit/Delete buttons consume `BUTTON_STYLES.primary` / `BUTTON_STYLES.danger`; card surface (background, border, radius, shadow) is inherited from the global `MuiCard` theme override; text inset and button margin consume named card presets. | Edit has no dedicated semantic preset (still generic primary); move-up/down IconButtons keep local `sx`; card geometry/padding and action-row layout remain local composition; description repeats inline `overflowWrap` rather than reusing the existing wrap preset; exact caller/visual-state verification remains. | PARTIAL — several visual responsibilities are centralized, file is NOT fully fixed. |
| `src/components/points/PointForm.tsx` | Imports the shared `BackButton` and `BUTTON_STYLES`; primary action uses the shared button preset. | Local layout/spacing `sx` remains; inspect all form states and action consistency; verify BackButton caller contract and all remaining controls. | PARTIAL — not fully fixed. |
| `src/components/points/PointActions.tsx` | Social actions are delegated to shared Like/Favorite/Report components and shared status component. | Wrapper layout `sx` is local; verify the nested social controls' visual contract and all callers. | PARTIAL — not fully fixed. |
| `src/components/points/PointList.tsx` | Delegates each item to the shared `PointCard`. | List layout remains local; verify responsive/layout requirements and empty state typography. | PARTIAL — not fully fixed. |
| `src/components/trips/TripCard.tsx` | Uses shared `BUTTON_STYLES`, `cardStyle`, and `CARD_TEXT_INSET_SX`; card surface is inherited from `MuiCard` theme. | Stepper Buttons are still direct MUI defaults; substantial card geometry and content composition remain in local `sx` constants; verify responsive variants and all card callers. | PARTIAL — not fully fixed. |
| `src/components/trips/TripActions.tsx` | Uses named `tripAction` and `tripActionDanger` presets for trip actions. | Edit still shares generic tripAction rather than a semantic Edit role; verify parity with point/admin actions and all states. | PARTIAL — not fully fixed. |
| `src/components/common/BackButton.tsx` | Shared component consumes `BUTTON_STYLES.back`. | `back` currently aliases `secondary`; public props still allow caller `sx` and broad MUI Button props; caller contract and semantic distinction need design. | PARTIAL — shared but contract incomplete. |
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
| `src/components/auth/ChangePasswordForm.tsx` | Uses shared account form field preset and primary button preset. | Local button spacing and remaining form states/callers need verification. | PARTIAL. |
| `src/components/auth/VerifyEmailForm.tsx` | Uses MUI Card and primary button preset. | Card content/heading sx and complete field/state contract need verification. | CHANGE REQUIRED. |
| `src/components/auth/RegisterForm.tsx` | Uses shared auth form layout/title/action presets and primary/secondary button presets. | TextField/Checkbox contract and locked-state treatment need verification; secondary semantic callers need mapping. | PARTIAL. |
| `src/components/auth/ProfileForm.tsx` | Uses shared account field preset, BackButton and primary/secondary presets. | Multiple local field/heading sx and caller-level action layout remain. | CHANGE REQUIRED. |
| `src/components/auth/ProfileImage.tsx` | Uses AppImage, Dialog and shared UI color/shadow tokens in some controls. | Local image frame dimensions/radii, IconButton positions, thumbnail sx and overlay states remain. | CHANGE REQUIRED. |
| `src/components/maps/AddressAutocomplete.tsx` | Uses MUI TextField and Autocomplete. | Local inputSx/containerSx and direct action Button remain; establish a named map-field variant inheriting the base field contract. | PARTIAL. |
| `src/components/maps/GoogleMapView.tsx` | Wrapper uses responsive grid/flex layout sx. | No button/field/surface styling surfaced in this inspection; verify only if later consumer tracing finds visual controls. | PARTIAL. |
| `src/components/maps/PointLocationPicker.tsx` | Uses primary/secondary button presets. | Local map layout and position sx remain; verify map-specific action roles and states. | PARTIAL. |
| `src/components/maps/TripLocationPicker.tsx` | Uses primary/secondary button presets. | Local layout/position sx and map field/action states remain. | CHANGE REQUIRED. |
| `src/components/trips/TripSelectField.tsx` | Reuses MUI TextField/Autocomplete for trip selection. | No explicit shared field preset at call sites; must inherit the centralized base field contract without feature-local skin. | PARTIAL. |
| `src/components/CustomFileUploadButton.tsx` | Shared upload component boundary exists. | Raw IconButton and contained Button component=label remain; define upload and icon-action roles. | CHANGE REQUIRED. |
| `src/components/images/AppImage.tsx` | Central AppImage abstraction selects named image presets and computes rendering style internally. | Audit every preset and caller; internal computed React style is an implementation detail of the approved image abstraction, not permission for consumer-level style props. Document and preserve this boundary. | PARTIAL. |
| `src/components/images/ImageGallery.tsx` | Uses AppImage and CSS Module for gallery structure. | Local sx and every gallery frame/control caller need comparison with image role presets. | PARTIAL. |
| `src/components/images/ImageLightbox.tsx` | Uses Dialog and AppImage. | Multiple IconButtons define local position/z-index/control sx; centralize lightbox control roles while retaining unique overlay geometry. | CHANGE REQUIRED. |
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
| `src/components/trips/TripMapSection.tsx` | Uses MUI Card and shared map composition. | Card local sx and direct previous/next Buttons remain; separate map navigation role from generic actions. | CHANGE REQUIRED. |
| `src/components/trips/DayImagesGallery.tsx` | Uses image gallery composition. | Local image container width/maxWidth/aspect ratio remains; compare with named gallery image roles and CSS module geometry. | PARTIAL. |

### Surface / Paper clarification

- MUI `Card` is already globally wired to `getSurfaceStyles` through `MuiCard`.
- MUI `Dialog`'s `paper` slot also uses the same `getSurfaceStyles`.
- This does **not** prove that every standalone `Paper`, custom panel, CSS surface or image/map overlay is centralized. A repository-wide Paper/surface consumer audit is still required.
- Therefore: Card background/border/radius/shadow are centralized at the MUI Card level; general Paper parity is **not yet complete or verified**.

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
