# HackTrip Frontend — CSS & Design System Audit

> **Работен документ / source of truth за CSS, MUI Theme, UI tokens, presets и визуалната миграция.**
>
> Това е продължение на одобрения план „HackTrip Frontend – Единен план за Design System и Styling Architecture“. Не започвай нов одит при всяка сесия. Прочети този документ и продължи от секция 11. Актуализирай manifest-а и добавяй записи в audit log-а.

- Repository: AngelGeorgievStoyanov/hacktrip-web
- Branch: feature/frontend-modernization
- Audit baseline: f77d0cff2f98298279273d0d15a27b7a236a2dd7
- Audit date: 2026-11-18
- Scope: frontend presentation layer — app/, src/components/, src/constants/ui/, src/constants/images/, src/theme/, src/styles/.
- No backend/API/business-logic changes, no branch creation, no build/tests/lint/CI without explicit user authorization.

---

## 1. Цел и задължителни правила

Целта е цялата повтаряща се визуална система да има централен собственик. Смяна на цветовата схема (например синьо/бяло към charcoal/gold) трябва да става основно чрез промяна на tokens/theme, а не чрез редактиране на десетки feature компоненти.

### 1.1 Един визуален договор за еднаква роля

Еднаквите компоненти и действия трябва да изглеждат еднакво навсякъде, независимо от страницата или feature-а:

- **Back** — един общ стил, размер, padding, radius, hover/focus/active/disabled икона/позициониране, когато е част от ролята.
- **Edit** — един общ стил за Edit действие.
- **Create / Add** — общи роли за създаване и добавяне; отделни само когато UX семантиката е различна.
- **Delete / Remove** — общи семантични роли; отделни само при доказана разлика в значението.
- **Save / Cancel / Confirm / Secondary / Navigation** — централизирани роли.
- **Cards** — еднакъв тип карта споделя surface color, border, radius, shadow, основни вътрешни отстояния и states. Разликата в съдържанието или layout-а не създава нов skin.
- **Panels, dialogs, tables, fields, image frames, social controls, map controls, alerts и pagination** — повтарящите се роли имат общ договор.

Не уеднаквявай различни действия само защото са един и същ HTML/MUI елемент. Уеднаквявай еднаквото предназначение. Изключение е допустимо само когато е семантично обосновано и описано.

### 1.2 Забранено като краен резултат

- Локални цветове, hex/rgb/rgba/gradient, radius, shadow, typography, spacing, padding, margin, размери или interaction states, когато стойността се повтаря или е споделена.
- Локални константи за визуални правила във feature/page/component файлове, когато принадлежат на обща роля.
- Различни локални реализации на един и същ Back/Edit/Delete/Add/Save бутон.
- Различни локални Card/Paper surface стилове за карти от един и същ тип.
- Inline style={{...}} или sx={{...}} за повтаряща се визия.
- Повтарящи се CSS декларации в CSS Modules, когато трябва да използват централен token/preset.
- Паралелни styling системи за един и същ елемент без изрично описана причина.

### 1.3 Какво може да остане локално

Само истински специфична структура или геометрия, която не е споделена: уникална grid композиция, специфично позициониране в карта, layout на една конкретна страница, responsive пренареждане или third-party интеграция. И тогава всички споделени визуални стойности идват от tokens/theme/presets.

CSS Modules са позволени за структурно оформление и специфични responsive правила, но не са втори склад за цветове, radius, shadows, typography и повтарящи се component skins.

### 1.4 Не променяй визуалните стойности на сляпо

Текущата синьо-бяла визия се запазва по време на архитектурната миграция. При конфликт първо се описват всички потребители и текущото поведение. Не се избира произволно цвят/размер и не се прави редизайн без одобрение.

---

## 2. Одобрена целева архитектура

    app/
      globals.css                 # минимален reset, app shell, CSS variable consumers

    src/
      constants/
        ui/                       # colors, spacing, sizes, breakpoints, shape, shadows, typography, z-index
        images/presets.ts         # named image rendering roles
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
        cards.ts                  # content/layout only; surface belongs to theme
        forms.ts
        layouts.ts
        map-controls.ts
        panels.ts
        social.ts
        typography.ts
      components/                 # feature UI consumes semantic contracts

### Единствен собственик на всяка стойност

| Concern | Owner |
|---|---|
| Brand/semantic colors | src/constants/ui/colors.ts → MUI palette / CSS variables |
| Spacing and gutters | src/constants/ui/spacing.ts |
| Shared dimensions | src/constants/ui/sizes.ts |
| Breakpoints | src/constants/ui/breakpoints.ts |
| Radius | src/constants/ui/shape.ts |
| Elevation/shadows | src/constants/ui/shadows.ts + theme resolver |
| Typography | src/constants/ui/typography.ts → theme |
| MUI global behavior | src/theme/components/* |
| Semantic reusable sx contracts | src/styles/presets/* |
| Named image behavior | src/constants/images/presets.ts + AppImage |
| CSS consumers | app/globals.css and CSS Modules using CSS variables |
| Unique layout composition | feature component/CSS Module only when not reusable |

Една стойност няма право да има два независими собственика. Ако token трябва да се използва от CSS и MUI, дефинира се веднъж и се предоставя на CSS чрез CSS variable от theme.

---

## 3. Одитирана база и ограничения

При baseline f77d0cff2f98298279273d0d15a27b7a236a2dd7 recursive repository tree съдържа 274 tracked files и 246 файла под app/ и src/ с TS/TSX/JS/JSX/CSS разширения. Този одит обхваща presentation layer. API clients, DTOs, validation schemas, SEO builders и server utilities не са styling migration targets, освен ако consumer search не докаже друго.

**Статуси:**
- PARTIAL: файлът е прочетен/инспектиран, но consumers, call sites, states или visual parity не са изчерпателно проверени.
- PENDING: предстои отделна проверка.
- CHANGE REQUIRED: има конкретно наблюдавано локално/дублирано визуално правило, което трябва да се мигрира.
- VERIFIED: само след проверка на декларации, всички consumers, semantic role, responsive поведение и states. На този baseline няма VERIFIED файлове.

Това е source-code одит, не browser screenshot/visual QA. Не са изпълнявани build, tests, lint, CI или visual regression.

---

## 4. Потвърдени архитектурни проблеми

### 4.1 Няколко паралелни styling пътя

Визията идва едновременно от:
1. MUI theme и component overrides.
2. src/styles/presets/*.ts през sx.
3. CSS custom properties от src/theme/index.ts.
4. app/globals.css, включително отделния .ht-button.
5. CSS Modules.
6. component-local sx={{...}}, style={{...}} и локални style constants.
7. директни MUI props color/variant/size и native HTML controls.

Това позволява еднакви контроли да изглеждат различно в различни features. Целта не е премахване на MUI или CSS Modules, а ясен собственик за всяка визуална роля и премахване на конкуриращите се локални дефиниции.

### 4.2 Buttons — семантичната система е непълна

Потвърдено:
- src/styles/presets/buttons.ts има primary/save alias, danger, dangerText, secondary/back alias, createTrip, tripAction, tripActionDanger и day stepper.
- BackButton.tsx използва BUTTON_STYLES.back, но публичните props позволяват caller sx и така всеки call site може да променя общия стил.
- Back е alias на Secondary; това е текущо решение, не доказателство, че всички Back контроли го използват.
- Header има локален NAV_BUTTON_SX и директни MUI color props.
- AdminNavigation дефинира active/inactive цветове и variants локално.
- Admin pagination използва голи MUI Button defaults.
- Auth формите използват primary/secondary presets непоследователно; някои Back calls override-ват spacing.
- PointCard използва primary/danger, но много Edit/Delete/Save/Remove IconButtons в comments, images, profiles и admin са raw MUI IconButtons.
- ConfirmDialog използва директни MUI primary buttons.
- ReportButton има директни Cancel/Submit buttons.
- LiveTracker и TripMapSection имат директни buttons.
- CSS .ht-button е отделен server-rendered button contract.

**Необходимо:** дефинирай semantic roles (Back, Primary/Submit, Create, Add, Edit, Delete, Remove, Save, Cancel, Confirm, Secondary, Navigation, pagination/stepper). Създай reusable components или API, което не позволява произволен caller visual override. Провери MUI и native/server-rendered buttons. Не оставяй .ht-button като паралелна design system. Icon-only controls са отделно семейство със споделени размери, hit area, radius, focus ring и disabled behavior.

### 4.3 Cards and surfaces — глобалната собственост е частична

Потвърдено:
- MUI Card използва cardOverrides и getSurfaceStyles: paper background, divider border, theme radius и surface shadow.
- Dialog Paper използва същия surface resolver.
- PANEL_SX също делегира към същия resolver.
- Други Paper, Box-as-card, native containers и CSS surfaces не се покриват автоматично.
- Card presets смесват content spacing и trip-card geometry.
- Локални Card sx остават в comments, trip details, trip form, point form, admin и други features.
- Sticky social и map/image overlays са отделни surface роли.

**Необходимо:** един base card contract (surface color, border, radius, shadow, states). Card-specific layout е отделно. TripCard и PointCard могат да имат различно съдържание, но не и различен базов skin, ако са една и съща card роля. Прилагай договора към MUI Card, Paper panels и Box/native елементи, които действат като карти. Премахвай локални surface overrides без документирана причина.

### 4.4 Fields and forms — theme contract е непълен

- src/theme/components/text-field.ts задава само default variant/size; не описва пълния app field contract.
- forms.ts смесва form layout presets и фиксирани field dimensions.
- TextFields в auth, profile, admin, points, trips, comments и maps разчитат на defaults или локални props/sx.
- Map address autocomplete има отделен visual treatment; трябва да остане named map-specific variant, не произволен локален override.

**Необходимо:** централен field contract за default/hover/focus/error/disabled/read-only, label, helper text, input padding/height, border, radius, typography и adornments. Всички стандартни полета да са еднакви; map field да наследява общия договор и да променя само описаните map-specific свойства.

### 4.5 Colors and semantic tokens

Потвърдени несъответствия в src/constants/ui/colors.ts:
- brand.primary е синьо (#1976d2), brand.primaryHover е зелено (#4daf30).
- action.danger е literal red, feedback.error е #d32f2f, dangerHover е #ef0a0a.
- Secondary/Create/Navigation имат отделни legacy цветове.
- CSS variables expose само част от semantic colors; CSS Modules съдържат literals.
- MUI palette и plain CSS нямат пълна parity.

**Необходимо:** запази текущите стойности до одобрение на coherent mapping. Изгради semantic tokens за brand, neutral surfaces, text, border, feedback, destructive, hover/focus/selected/disabled, overlay и decorative. Всички tokens, нужни в CSS Modules, се излагат като CSS variables от theme. Без повторени hex/rgb literals във feature CSS.

### 4.6 Spacing, shape, shadows, typography, breakpoints

- Spacing scale използва 8px MUI unit, но presets/CSS съдържат raw px/rem и numeric MUI spacing.
- Shape има general radius 4, map input radius 5 и legal TOC radius 6. Всички еднакви card роли трябва да се уеднаквят.
- MUI surfaces използват theme elevation; profile-image и social-overlay имат literal CSS shadows.
- Typography tokens възпроизвеждат MUI defaults, но About използва локален Space Mono и локални font sizes/weights.
- MUI breakpoints и legacy feature thresholds съществуват едновременно.
- Z-index tokens съществуват, но raw z-index стойности остават в component styles.

**Необходимо:** замени повтарящите се raw spacing/size с named tokens; дефинирай semantic radius roles и един card radius; semantic elevations; централизирай typography и editorial variant; централизирай breakpoint constants и raw z-index.

### 4.7 Images

- IMAGE_PRESETS централизират named dimensions, object-fit и някои preset styles.
- AppImage derives style only from selected preset и не expose-ва arbitrary style prop — това е правилната API посока.
- Някои call sites заобикалят AppImage с Next Image или component="img" и локални style objects (About, image upload previews, profile previews).
- Image frame/button/overlay behavior е разделено между ImageGallery CSS Module и локални sx в ImageGallery/ImageLightbox/ProfileImage/EditPointPage/TripForm/Admin.

**Необходимо:** използвай AppImage/named image presets за споделените image roles, където е съвместимо. Централизирай fit, frame radius, thumbnail dimensions, preview size, lightbox controls и overlays. Проверявай всеки AppImage и direct Image/img consumer преди промяна на API.

### 4.8 CSS Modules and globals

Потвърдени локални декларации:
- app/globals.css: app shell плюс отделен .ht-button skin.
- AboutPage.module.css: Space Mono, font weights/sizes, text shadow, margins.
- LegalPage.module.css: page/content padding, font sizing/line-height, Back link skin.
- NotFound.module.css: Home button color/background/padding/margin.
- Footer.module.css: literal horizontal padding.
- TripDetailsView.module.css: уникална grid/container geometry плюс literal widths/margins за класификация.
- TripList.module.css: local empty-state typography/margins.
- TripPagination.module.css: local outer margin.
- ImageGallery.module.css: inspected declarations използват shared spacing/shape variables; нуждае се от пълна selector/consumer verification.

**Необходимо:** запази unique structural grid/flex/container rules; замени shared visual literals с CSS variables; мигрирай shared button/link/card skins към semantic components/theme; не създавай нови CSS Modules за shared visual values.

---

## 5. Файлове и конкретни промени

### 5.1 Central tokens and theme — най-висок приоритет

| File | Потвърдено състояние | Required action |
|---|---|---|
| src/constants/ui/colors.ts | Semantic colors; primary hover/danger несъответствия | Reconcile semantic map след consumer inventory; не сменяй текущи стойности без одобрение |
| src/constants/ui/spacing.ts | 8px scale + page/route/About gutters | Tokenize повтарящи се spacing стойности |
| src/constants/ui/sizes.ts | Малък набор shared dimensions | Добави само доказани повторяеми sizes |
| src/constants/ui/breakpoints.ts | MUI + legacy thresholds | Map every use; обедини aliases със същото значение |
| src/constants/ui/shape.ts | Radius 4/5/6 | Semantic roles; еднаквите cards трябва да имат един radius |
| src/constants/ui/shadows.ts | MUI elevations + literal shadows | Semantic elevations за shared surfaces |
| src/constants/ui/typography.ts | MUI typography tokens | Named editorial role само ако е нужно |
| src/constants/ui/z-index.ts | App layering scale | Замени повтарящи се raw z-index |
| src/constants/ui/index.ts | Token barrel | Поддържай единни exports |
| src/theme/index.ts | MUI theme + CSS variables | Разшири CSS variable bridge за всички CSS Module consumers |
| src/theme/palette.ts | MUI palette from UI_COLORS | Единствен palette mapping |
| src/theme/shape.ts | MUI radius | Derive from semantic shape token |
| src/theme/shadows.ts | Semantic elevation resolver | Единствен MUI elevation resolver |
| src/theme/typography.ts | MUI typography mapping | Единствен MUI typography mapping |
| src/theme/components/surface.ts | Shared Card/Panel/Dialog surface resolver | Единствен surface skin contract |
| src/theme/components/card.ts | MUI Card override | Запази; премахни локални surface overrides |
| src/theme/components/dialog.ts | Dialog paper surface | Align dialog states |
| src/theme/components/button.ts | Само typography/radius | Добави shared global interaction behavior |
| src/theme/components/text-field.ts | Defaults only | Пълен field contract and states |
| src/constants/images/presets.ts | Named image roles; style/objectFit | Провери всички consumers; раздели frame/fit/size roles чисто |

### 5.2 Presets

| File | Issue | Required action |
|---|---|---|
| src/styles/presets/buttons.ts | Непълни roles; Back=Secondary alias | Semantic role API; Edit/Add/Remove/Cancel/Confirm/Navigation/IconButton; премахни подвеждащи aliases |
| src/styles/presets/cards.ts | Content insets + trip-card geometry | Отдели shared surface (theme) от content/layout |
| src/styles/presets/forms.ts | Смесени layout, field dimensions, panel styles | Раздели field appearance от form composition |
| src/styles/presets/layouts.ts | Page/list/admin layout | Запази structural presets; tokenize spacing |
| src/styles/presets/map-controls.ts | Named map address field variant | Наследява base field contract + map delta |
| src/styles/presets/panels.ts | Delegates to shared surface | Остави само ако има смисъл като semantic alias |
| src/styles/presets/social.ts | Social actions/badges/overlay/sticky surface | Раздели social controls от image/map overlay surface; centralize metrics |
| src/styles/presets/typography.ts | Legacy headings/home intro | Named text roles; премахни локални дубликати |

### 5.3 Global CSS and CSS Modules

| File | Local declarations | Required action |
|---|---|---|
| app/globals.css | App shell + independent .ht-button skin | Остави reset/shell; премахни parallel button skin след миграция на consumers |
| app/(public)/about/AboutPage.module.css | Space Mono, weights/clamp sizes, margins, text shadow | Consume typography tokens/CSS vars; остави layout/responsive |
| app/(public)/privacy-policy/LegalPage.module.css | Page/content padding, typography, Back link skin | Tokenize; Back link да използва shared Back role |
| src/components/common/NotFound.module.css | Home button skin | Shared CTA role; остави page layout/background |
| src/components/images/ImageGallery.module.css | Gallery structure; shared vars | Verify selectors/consumers; запази structure |
| src/components/layout/Footer.module.css | Literal horizontal padding | Shared page/container gutter |
| src/components/trips/TripDetailsView.module.css | Unique grid/container queries + literal widths/margins | Запази geometry; tokenize repeated spacing |
| src/components/trips/TripList.module.css | Empty-state typography/margins | Shared typography/spacing |
| src/components/trips/TripPagination.module.css | Outer margin | Shared pagination spacing |

### 5.4 Shared/common, navigation and images

| File | Finding | Required action |
|---|---|---|
| src/components/common/BackButton.tsx | Back preset, but caller can override sx | Enforce Back role; allow layout/accessibility props only |
| src/components/common/ConfirmDialog.tsx | Confirm/Cancel direct MUI buttons | Shared Confirm/Cancel roles |
| src/components/common/NotFound.tsx | Native button + CSS skin | Shared CTA role |
| src/components/common/ExpandableText.tsx | Direct Button + local sx | Shared Expand/Collapse role |
| src/components/common/PasswordField.tsx | TextField + IconButton defaults | Common field/icon-control contract |
| src/components/common/PasswordRequirements.tsx | Local row sx and conditional colors | Feedback tokens + shared typography |
| src/components/common/NotificationProvider.tsx | Snackbar/Alert local width sx | Verify notification surface/spacing |
| src/components/layout/Header.tsx | Local NAV_BUTTON_SX, menu icon size, direct nav Button props | Shared Navigation role; desktop/drawer parity |
| src/components/layout/Footer.tsx | CSS Module consumer | Shared footer/page gutter |
| src/components/CustomFileUploadButton.tsx | Raw IconButton and Button | Shared Upload/Select and icon roles |
| src/components/images/AppImage.tsx | Central preset resolver; no arbitrary style prop | Preserve boundary; named preset for each shared image role |
| src/components/images/ImageGallery.tsx | CSS Module + local sx | Shared image button/frame presets |
| src/components/images/ImageLightbox.tsx | Local overlay controls sx | Shared lightbox frame/overlay/icon controls |
| src/components/images/ImageUploadField.tsx | Local preview geometry/radius/objectFit + raw buttons | Image preview preset + Remove/Upload roles |
| src/components/auth/ProfileImage.tsx | Local circle frame/shadow/lightbox + preview objectFit | Shared profile frame, remove control, lightbox, preview |
| src/components/admin/AdminUserProfileImage.tsx | Local image button dimensions + raw Delete/Upload | Reuse profile image/action roles |
| src/components/admin/AdminImages.tsx | Raw pagination/action buttons, local row/cell sx, dialog | Shared pagination/table/image actions/dialog |
| src/components/placeholders/SocialObjectPlaceholder.tsx | Local overlay/text sizes/gradient | Shared placeholder overlay tokens/typography |

### 5.5 Auth, profile and admin

| File | Finding | Required action |
|---|---|---|
| src/components/auth/LoginForm.tsx | Auth presets; raw IconButton | Normalize actions and fields |
| src/components/auth/RegisterForm.tsx | Auth presets; local pointerEvents sx | Normalize fields/actions; keep interaction-only behavior |
| src/components/auth/ForgotPasswordForm.tsx | Shared presets; Back caller margin override | Enforce Back role |
| src/components/auth/ResendVerificationForm.tsx | Same Back margin override | Enforce Back role |
| src/components/auth/ResetPasswordForm.tsx | Direct contained Button in success state + preset in form | Same semantic role in both states |
| src/components/auth/VerifyEmailForm.tsx | Local Card sx/heading weight | Shared panel/card/typography |
| src/components/auth/ChangePasswordForm.tsx | Account field preset; local action spacing | Shared field and Save/Submit |
| src/components/auth/ProfileForm.tsx | Local title/field sx; primary/secondary buttons | Shared field/heading/action roles |
| src/components/auth/ProfileImage.tsx | See image findings | Shared image/action roles |
| src/components/auth/Captcha.tsx | Local CAPTCHA container sx | Keep integration geometry; tokenize spacing |
| src/components/admin/AdminUserForm.tsx | Save/Danger presets but local panel/layout sx | Shared form/panel/Delete |
| src/components/admin/AdminUsers.tsx | Local Card/CardContent layout + raw Edit/Delete/pagination | Common card surface/action roles |
| src/components/admin/AdminNavigation.tsx | Local nav layout and active/inactive styles | Shared Navigation role |
| src/components/admin/AdminDashboard.tsx | Link-based admin navigation | Verify link/button role parity |
| src/components/admin/AdminFailedLogs.tsx | Local filter/action layout + raw pagination/delete | Shared filter/action/pagination |
| src/components/admin/AdminReports.tsx | Raw destructive and pagination buttons | Shared Delete/Resolve/Pagination |
| src/components/admin/AdminRouteNotFoundLogs.tsx | Local expanded row sx + raw buttons | Shared table/details/pagination |

### 5.6 Points, trips, maps and tracking

| File | Finding | Required action |
|---|---|---|
| src/components/points/CreatePointPage.tsx | Local page/container sx + central panel | Shared page shell and form panel |
| src/components/points/EditPointPage.tsx | Many local sx, image controls/frame dimensions | Shared point form, image frame, icon controls |
| src/components/points/PointActions.tsx | Local action-row layout sx | Shared action row and Edit/Delete |
| src/components/points/PointCard.tsx | Presets + local Card sx/icon controls/layout | Common Card surface; Edit/Delete/icon roles |
| src/components/points/PointForm.tsx | Local field/layout sx and stacked buttons | Common fields and Create/Save/Cancel |
| src/components/points/PointList.tsx | Local list/container composition | Shared list/empty state if repeated |
| src/components/trips/TripActions.tsx | Existing tripAction/tripActionDanger | Compare same roles across all features |
| src/components/trips/TripCard.tsx | Presets + local responsive geometry + raw stepper buttons | Common card surface; stepper role |
| src/components/trips/TripDetails.tsx | Local Card sx, inline NAME/LINE styles, raw icons | Common card/content typography/actions |
| src/components/trips/TripDetailsView.tsx | CSS Module layout + local overlay sx | Preserve layout; centralize overlay |
| src/components/trips/TripFilters.tsx | Local select/filter style objects | Common field/select contract |
| src/components/trips/TripForm.tsx | Some stepper presets, local Card/field/layout | Common card/field/action contracts |
| src/components/trips/EditTripLayout.tsx | Many local sx, stepper and image actions | Migrate panel, fields, stepper, image actions, Save/Add/Cancel |
| src/components/trips/TripDaysNav.tsx | Local page-item colors/spacing | Shared day-navigation role/states |
| src/components/trips/TripMapSection.tsx | Local Card + raw buttons | Common card/map surface/actions |
| src/components/trips/PointSection.tsx | Local style constants, Card layout, inline style, image geometry | Common card/content/image presets |
| src/components/trips/PointsSection.tsx | No style matches in initial scan | Full file/import check before VERIFIED |
| src/components/trips/DayImagesGallery.tsx | Local image wrapper geometry | Named image frame preset |
| src/components/trips/TripList.tsx | CSS Module + local heading/list style constants | Shared empty-state typography/list |
| src/components/trips/TripPagination.tsx | CSS Module pagination structure | Shared pagination role/spacing |
| src/components/trips/TripSelectField.tsx | TextField usage | Common field contract |
| src/components/maps/AddressAutocomplete.tsx | Caller textFieldProps/sx/buttonSx + map preset | Enforce map variant; limit overrides |
| src/components/maps/GoogleMapView.tsx | Local loading/map container geometry | Shared spacing; map canvas remains integration-specific |
| src/components/maps/PointLocationPicker.tsx | Primary/secondary presets + local container/button sx | Shared map field/action/panel |
| src/components/maps/TripLocationPicker.tsx | Local primary color values + presets | Remove duplicate primary colors |
| src/components/tracking/LiveTracker.tsx | Local surface sx + raw Start/Stop/Reset/Follow buttons | Shared panel and tracking action roles |

### 5.7 Comments and social

| File | Finding | Required action |
|---|---|---|
| src/components/comments/CommentsSection.tsx | Local COMMENTS_PANEL_SX / COMMENT_CARD_SX, local sx, raw Edit/Delete/Save/Cancel IconButtons | Central panel/comment-card surface and semantic icon/action roles |
| src/components/comments/CommentsToggle.tsx | Native inline layout style + local typography margin | Shared comments toggle role/layout |
| src/components/comments/RepliesSection.tsx | Local reply border/spacing, raw action IconButtons | Shared nested comment layout and action roles |
| src/components/social/LikeButton.tsx | Shared badge preset + local conditional sx wrapper | Central like icon states |
| src/components/social/FavoriteButton.tsx | Shared badge preset + local conditional sx wrapper | Central favorite icon states |
| src/components/social/EngagementBar.tsx | Local conditional sx + raw social controls | Shared engagement layout/icon roles |
| src/components/social/ReportButton.tsx | Inline span styles, raw Cancel/Submit, local error sx | Shared Report/Cancel/Submit/feedback roles |
| src/components/social/TripGroupSocialActions.tsx | Repeated raw icon controls and local error spans | Shared Like/Favorite/Report roles |
| src/components/social/SocialConfigStatus.tsx | Local compact sx | Shared status indicator role |
| src/components/social/LikeAnimation.tsx | No style match in initial scan | Verify full motion behavior separately from skin |

---

## 6. Одобреният шестетапен план — не го заменяй

### Stage 1 — Full inventory and audit
- [x] Recursive tree inventory at baseline.
- [x] Read all nine CSS files.
- [x] Read core UI tokens, theme and presets.
- [x] Read primary UI component families and record observed local styles.
- [ ] Exhaustive consumer mapping for every CSS selector, CSS variable, token and preset.
- [ ] Search every sx, style, inline CSS object, local style constant, direct MUI visual prop and native button/link.
- [ ] Verify imports and call sites for every shared component.
- [ ] Classify local declarations as shared visual token, semantic component skin, reusable layout preset or genuine one-off geometry.
- [ ] Finish manifest for all UI-bearing files. No file is VERIFIED yet.

### Stage 2 — Design Tokens + MUI Theme
- [ ] Resolve semantic color roles while preserving current design.
- [ ] Establish spacing, sizes, breakpoints, shape, shadows, typography and z-index.
- [ ] Expose tokens as CSS variables.
- [ ] Define common card/panel/button/field states.
- [ ] Keep true special variants as documented deltas.

### Stage 3 — MUI Component Overrides + reusable presets
- [ ] Complete Button and IconButton contracts.
- [ ] Complete Card/Paper/Panel/Dialog surface contract.
- [ ] Complete TextField/Select/FormControl state contract.
- [ ] Add semantic action roles/components: Back/Edit/Create/Add/Delete/Remove/Save/Cancel/Confirm/Secondary/Navigation.
- [ ] Separate visual skins from layout/geometry presets.
- [ ] Ensure coherent exports/types and no duplicate owners.

### Stage 4 — CSS Modules + Global CSS
- [ ] Reduce globals to reset, shell and CSS-variable consumers.
- [ ] Remove .ht-button as independent style path after all consumers migrate.
- [ ] Replace shared literals in CSS Modules with CSS variables.
- [ ] Keep only unique structural/responsive rules in Modules.
- [ ] Check responsive breakpoints and visual states.

### Stage 5 — Systematic component migration
Мигрирай в този ред:
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

Stage 5 остава OPEN, докато всеки consumer не е мигриран и проверен отново. Файлът не е готов само защото импортира preset; старите локални визуални декларации трябва да бъдат премахнати или изрично оправдани.

### Stage 6 — Final audit and validation
- [ ] Exhaustive search for raw color/spacing/radius/shadow/typography in UI source.
- [ ] Exhaustive search for local visual constants and inline style/sx.
- [ ] Verify semantic button/card/field parity.
- [ ] Verify CSS Module/global variable ownership.
- [ ] Verify hover/focus/active/disabled/error/loading states and responsive breakpoints.
- [ ] Build/tests/lint/CI only after explicit user authorization.
- [ ] Browser visual regression only after explicit authorization and environment availability.
- [ ] Mark files VERIFIED only with evidence.

---

## 7. Задължителна search matrix

За всеки search запиши точната команда/scope, брой резултати и consumer paths в audit log-а.

- CSS Modules imports: *.module.css, *.module.scss.
- CSS selectors: всички exported class names и всички styles.* / className consumers.
- CSS variables: --ht-* declarations и var(--ht-*) consumers.
- Token imports: @/constants/ui и всеки exported token usage.
- Preset imports: @/styles/presets/* и всички property-level consumers.
- Inline styling: sx=, sx={{, sx={(, style=, style={{, style={.
- Local style constants: имена STYLE, _SX, _STYLE, *_STYLES плюс object literals в sx/style.
- Visual values: hex/rgb/hsl/rgba/gradient, borderRadius, boxShadow, fontSize, fontWeight, padding, margin, gap, border, background, color.
- Buttons: Button, IconButton, ButtonGroup, native button, links styled as buttons, BackButton; semantic labels Back/Edit/Create/Add/Delete/Remove/Save/Cancel/Confirm.
- Surfaces: Card, Paper, Dialog, Accordion, Alert, Box/native elements styled as cards/panels.
- Fields: TextField, Select, Autocomplete, InputBase, FormControl, Checkbox, Radio, Switch.
- Images: AppImage, Next Image, component="img", native img, objectFit, image frame/overlay/lightbox.
- States: hover, focus-visible, focus, active, selected, disabled, error, loading, expanded, pressed.
- Responsive: MUI breakpoints, media queries, container queries, responsive sx.

Search не е завършен само с намиране на imports. Следвай всеки резултат до компонента и всички call sites.

---

## 8. Изрични договори за изграждане

### Buttons
Създай един semantic role map и reusable API. Минимални роли:
Back, Primary/Submit, Create, Add, Edit, Save, Delete, Remove, Cancel, Confirm, Secondary, Navigation, Icon action, Pagination/stepper.

Една и съща роля не трябва да приема произволни caller colors/variants/sx. Разрешавай layout-only props като fullWidth/size само като изрични options.

### Cards/surfaces
Base card contract: surface color, border, radius, shadow, text contrast, padding/content spacing и interaction states. Card-specific layout е отделно. TripCard и PointCard могат да имат различна композиция, но еднакъв base surface skin, ако са една и съща card роля.

### Fields
Base field contract: typography, label, input height/padding, border, radius, hover/focus/error/disabled/read-only, helper text и adornments. Map address input е named variant, който наследява базовия договор.

### Images
Named roles: avatar/profile, card thumbnail, point thumbnail, gallery grid, gallery stack, upload preview, editor thumbnail, lightbox, hero/OG, About illustration. Fit, frame, radius, dimensions и overlay controls се дефинират веднъж за всяка роля.

---

## 9. Правила за безопасна миграция

1. Не променяй API calls, DTOs, validation, authentication, business logic или backend behavior.
2. Не създавай branch. Работи само в feature/frontend-modernization.
3. Не изтривай стар token/preset/class преди exhaustive consumer search.
4. Не изтривай CSS Module само защото има локални стилове; отдели структурата от skin-а.
5. Не заменяй semantic roles с един generic button style.
6. Не сливай map/image/social overlays с общия card surface без основание.
7. Не променяй текущи цветове/dimensions без before/after и причина.
8. Не изпълнявай build/tests/lint/CI без изрично разрешение.
9. След всяка source промяна направи targeted search за стари декларации и всички засегнати consumers.
10. След всеки batch актуализирай този документ и append-вай log entry. Не започвай отначало.

---

## 10. File status manifest

Статусите са консервативни. PARTIAL означава inspected, не migrated/verified. PENDING означава, че е нужна отделна проверка.

### Styling foundation

| File | Status |
|---|---|
| src/constants/ui/breakpoints.ts | PARTIAL |
| src/constants/ui/colors.ts | PARTIAL |
| src/constants/ui/index.ts | PARTIAL |
| src/constants/ui/shadows.ts | PARTIAL |
| src/constants/ui/shape.ts | PARTIAL |
| src/constants/ui/sizes.ts | PARTIAL |
| src/constants/ui/spacing.ts | PARTIAL |
| src/constants/ui/typography.ts | PARTIAL |
| src/constants/ui/z-index.ts | PARTIAL |
| src/constants/images/presets.ts | PARTIAL |
| src/theme/index.ts | PARTIAL |
| src/theme/palette.ts | PARTIAL |
| src/theme/shadows.ts | PARTIAL |
| src/theme/shape.ts | PARTIAL |
| src/theme/typography.ts | PARTIAL |
| src/theme/components/button.ts | PARTIAL |
| src/theme/components/card.ts | PARTIAL |
| src/theme/components/dialog.ts | PARTIAL |
| src/theme/components/surface.ts | PARTIAL |
| src/theme/components/text-field.ts | PARTIAL |
| src/styles/presets/buttons.ts | PARTIAL |
| src/styles/presets/cards.ts | PARTIAL |
| src/styles/presets/forms.ts | PARTIAL |
| src/styles/presets/layouts.ts | PARTIAL |
| src/styles/presets/map-controls.ts | PARTIAL |
| src/styles/presets/panels.ts | PARTIAL |
| src/styles/presets/social.ts | PARTIAL |
| src/styles/presets/typography.ts | PARTIAL |

### Stylesheets

| File | Status |
|---|---|
| app/globals.css | CHANGE REQUIRED |
| app/(public)/about/AboutPage.module.css | CHANGE REQUIRED |
| app/(public)/privacy-policy/LegalPage.module.css | CHANGE REQUIRED |
| src/components/common/NotFound.module.css | CHANGE REQUIRED |
| src/components/images/ImageGallery.module.css | PARTIAL |
| src/components/layout/Footer.module.css | CHANGE REQUIRED |
| src/components/trips/TripDetailsView.module.css | PARTIAL |
| src/components/trips/TripList.module.css | CHANGE REQUIRED |
| src/components/trips/TripPagination.module.css | CHANGE REQUIRED |

### Shared/common, images, layout, maps and placeholders

| File | Status |
|---|---|
| src/components/CustomFileUploadButton.tsx | CHANGE REQUIRED |
| src/components/common/BackButton.tsx | CHANGE REQUIRED |
| src/components/common/ConfirmDialog.tsx | CHANGE REQUIRED |
| src/components/common/ExpandableText.tsx | PARTIAL |
| src/components/common/NotFound.tsx | CHANGE REQUIRED |
| src/components/common/NotificationProvider.tsx | PARTIAL |
| src/components/common/PasswordField.tsx | PARTIAL |
| src/components/common/PasswordRequirements.tsx | PARTIAL |
| src/components/common/ScrambleHeading.tsx | PARTIAL |
| src/components/common/WelcomeHeading.tsx | CHANGE REQUIRED |
| src/components/home/HomeHero.tsx | CHANGE REQUIRED |
| src/components/home/HomeTrips.tsx | CHANGE REQUIRED |
| src/components/images/AppImage.tsx | PARTIAL |
| src/components/images/ImageGallery.tsx | PARTIAL |
| src/components/images/ImageLightbox.tsx | CHANGE REQUIRED |
| src/components/images/ImageUploadField.tsx | CHANGE REQUIRED |
| src/components/layout/Footer.tsx | PARTIAL |
| src/components/layout/Header.tsx | CHANGE REQUIRED |
| src/components/maps/AddressAutocomplete.tsx | PARTIAL |
| src/components/maps/GoogleMapView.tsx | PARTIAL |
| src/components/maps/PointLocationPicker.tsx | PARTIAL |
| src/components/maps/TripLocationPicker.tsx | CHANGE REQUIRED |
| src/components/placeholders/SocialObjectPlaceholder.tsx | CHANGE REQUIRED |

### Auth and admin

| File | Status |
|---|---|
| src/components/auth/Captcha.tsx | PARTIAL |
| src/components/auth/ChangePasswordForm.tsx | PARTIAL |
| src/components/auth/ForgotPasswordForm.tsx | CHANGE REQUIRED |
| src/components/auth/LoginForm.tsx | PARTIAL |
| src/components/auth/ProfileForm.tsx | CHANGE REQUIRED |
| src/components/auth/ProfileImage.tsx | CHANGE REQUIRED |
| src/components/auth/RegisterForm.tsx | PARTIAL |
| src/components/auth/ResendVerificationForm.tsx | CHANGE REQUIRED |
| src/components/auth/ResetPasswordForm.tsx | CHANGE REQUIRED |
| src/components/auth/VerifyEmailForm.tsx | CHANGE REQUIRED |
| src/components/admin/AdminDashboard.tsx | PARTIAL |
| src/components/admin/AdminFailedLogs.tsx | CHANGE REQUIRED |
| src/components/admin/AdminImages.tsx | CHANGE REQUIRED |
| src/components/admin/AdminNavigation.tsx | CHANGE REQUIRED |
| src/components/admin/AdminReports.tsx | CHANGE REQUIRED |
| src/components/admin/AdminRouteNotFoundLogs.tsx | CHANGE REQUIRED |
| src/components/admin/AdminUserForm.tsx | PARTIAL |
| src/components/admin/AdminUserProfileImage.tsx | CHANGE REQUIRED |
| src/components/admin/AdminUsers.tsx | CHANGE REQUIRED |

### Comments, social, points, trips and tracking

| File | Status |
|---|---|
| src/components/comments/CommentsSection.tsx | CHANGE REQUIRED |
| src/components/comments/CommentsToggle.tsx | CHANGE REQUIRED |
| src/components/comments/RepliesSection.tsx | CHANGE REQUIRED |
| src/components/points/CreatePointPage.tsx | PARTIAL |
| src/components/points/EditPointPage.tsx | CHANGE REQUIRED |
| src/components/points/PointActions.tsx | CHANGE REQUIRED |
| src/components/points/PointCard.tsx | CHANGE REQUIRED |
| src/components/points/PointForm.tsx | CHANGE REQUIRED |
| src/components/points/PointList.tsx | PARTIAL |
| src/components/social/EngagementBar.tsx | CHANGE REQUIRED |
| src/components/social/FavoriteButton.tsx | PARTIAL |
| src/components/social/LikeAnimation.tsx | PENDING |
| src/components/social/LikeButton.tsx | PARTIAL |
| src/components/social/ReportButton.tsx | CHANGE REQUIRED |
| src/components/social/SocialConfigStatus.tsx | PARTIAL |
| src/components/social/TripGroupSocialActions.tsx | CHANGE REQUIRED |
| src/components/tracking/LiveTracker.tsx | CHANGE REQUIRED |
| src/components/trips/DayImagesGallery.tsx | PARTIAL |
| src/components/trips/EditTripLayout.tsx | CHANGE REQUIRED |
| src/components/trips/PointSection.tsx | CHANGE REQUIRED |
| src/components/trips/PointsSection.tsx | PENDING |
| src/components/trips/TripActions.tsx | PARTIAL |
| src/components/trips/TripCard.tsx | CHANGE REQUIRED |
| src/components/trips/TripDaysNav.tsx | CHANGE REQUIRED |
| src/components/trips/TripDetails.tsx | CHANGE REQUIRED |
| src/components/trips/TripDetailsView.tsx | PARTIAL |
| src/components/trips/TripFilters.tsx | CHANGE REQUIRED |
| src/components/trips/TripForm.tsx | CHANGE REQUIRED |
| src/components/trips/TripList.tsx | CHANGE REQUIRED |
| src/components/trips/TripMapSection.tsx | CHANGE REQUIRED |
| src/components/trips/TripPagination.tsx | PARTIAL |
| src/components/trips/TripSelectField.tsx | PARTIAL |

### Route/page and layout consumers

| File | Status |
|---|---|
| app/layout.tsx | PARTIAL |
| app/providers.tsx | PARTIAL |
| app/(account)/layout.tsx | CHANGE REQUIRED |
| app/(admin)/layout.tsx | CHANGE REQUIRED |
| app/(auth)/layout.tsx | CHANGE REQUIRED |
| app/(public)/layout.tsx | PARTIAL |
| app/(account)/favorites/page.tsx | PARTIAL |
| app/(account)/my-trips/page.tsx | PARTIAL |
| app/(account)/profile/page.tsx | PARTIAL |
| app/(public)/about/page.tsx | CHANGE REQUIRED |
| app/(public)/live-tracking/page.tsx | CHANGE REQUIRED |
| app/(public)/page.tsx | PARTIAL |
| app/(public)/trips/[id]/page.tsx | PARTIAL |
| app/(public)/trips/page.tsx | PARTIAL |

Page wrappers without visual declarations are not automatically migration targets. Their imported components are actual styling consumers. Remaining route files need a confirmation pass for imported UI and overlooked local styles before VERIFIED.

---

## 11. Текущ статус и точна следваща задача

### Current stage
**Stage 1 — inventory and audit: IN PROGRESS.**

### Потвърдено извършено
- Прочетени са всичките 9 CSS файла.
- Прочетени са UI token files, image presets, MUI theme и всичките 8 shared style preset files.
- Инспектирани са основните component families: common controls, images, auth/profile, admin, comments/social, points, trips, maps и tracking.
- Записани са конкретни migration targets в секция 5 и file statuses в секция 10.
- Установен е основният проблем: MUI Theme + presets + global CSS + CSS Modules + local sx/style coexist без завършен semantic ownership contract.

### Не е завършено — не твърди обратното
- Exhaustive search на всеки CSS variable/token/preset export до всички consumers.
- Пълно четене на всички останали UI файлове от 246-те app/src файла.
- Пълна call-site verification за всеки shared component.
- Browser/visual verification на всички roles/states.
- Няма application source migration в този audit batch.
- Не са изпълнявани build/tests/lint/CI.

### Следващ AI/developer — изпълни точно това, без нов план

1. Прочети този документ първо.
2. Потвърди branch и HEAD; не създавай branch.
3. Сравни текущия HEAD с audit baseline; инспектирай само changed files след baseline и изрично PENDING файловете.
4. Довърши Stage 1 consumer mapping по search matrix от секция 7. Започни със semantic button consumers, след това card/surface, fields, image roles, CSS variables и preset exports.
5. Обнови manifest-а и добави dated log entry с точните paths, search results и discoveries.
6. След приключване на Stage 1 премини към Stage 2 и Stage 3; не чакай нов prompt, за да измисляш план.
7. Мигрирай в Stage 5 реда. Всеки batch обновява точните file statuses и следващата задача.
8. Не преодитирай непроменени файлове само за контекст. Използвай този документ и Git diff.

**Immediate next batch — exhaustive semantic action consumer mapping:**
- Search every BackButton, BUTTON_STYLES.*, Button, IconButton, native button and links styled as actions.
- Направи role matrix (Back/Edit/Create/Add/Delete/Remove/Save/Cancel/Confirm/Secondary/Navigation/Pagination/stepper) с всеки file и call site.
- Сравни еднаквите роли и определи точния component/preset/API owner.
- Не променяй source, преди role map да е записана.

---

## 12. Audit log (append-only)

### 2026-11-18 — Dedicated CSS & Design System audit document created

- Branch: feature/frontend-modernization
- Baseline HEAD: f77d0cff2f98298279273d0d15a27b7a236a2dd7
- Stage: 1 — full inventory and audit.
- Създаден е този отделен оперативен документ, за да запази audit findings, file targets, statuses и handoff instructions между сесиите.
- Потвърден recursive tree: 274 tracked files общо; 246 TS/TSX/JS/JSX/CSS files под app/ и src/.
- Прочетени са всичките 9 CSS файла, UI token/theme/image-preset foundation и 8 shared style preset files.
- Инспектирани са основните UI component families; локалните стилове и target migrations са записани в секция 5. Manifest-ът е в секция 10.
- Source-level audit only. Не са променяни application source files. Не са изпълнявани build, tests, lint, CI или browser visual verification.
- Няма VERIFIED files. Stage 1 остава OPEN до приключване на consumer search matrix и прегледа на останалите UI файлове.
- Следваща задача: завърши semantic action/button consumer matrix по секция 11, след това card/surface и field/image consumer mapping.
