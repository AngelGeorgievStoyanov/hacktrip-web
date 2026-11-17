# HackTrip Frontend Architecture

## 1. Purpose

This document describes the architecture of the HackTrip frontend.

The frontend is a Next.js application that communicates with the HackTrip Backend through the documented API contract and integrates with Google Maps independently as a browser-side SDK.

The current modernization is an incremental migration of an existing application.

The goal is to improve structure, maintainability, security and consistency without silently removing existing functionality.

The backend API contract is defined separately in:

`docs/API_CONTRACT.md`

That document is authoritative for backend communication.

This document must not redefine the backend API contract.

---

# 2. Architectural Principles

The frontend follows these principles:

1. Backend contract is authoritative.
2. Frontend modernization is incremental.
3. Existing functionality must be preserved during migration.
4. Backend authorization is authoritative.
5. Authentication state and authorization UI are separate concerns.
6. API communication is centralized.
7. Google Maps is a separate integration boundary.
8. Server Components are preferred where browser interactivity is not required.
9. Client Components are isolated to interactive/browser-dependent functionality.
10. Constants are centralized and organized by responsibility.
11. Feature code should remain cohesive.
12. Shared infrastructure should not be duplicated.
13. API models must remain aligned with backend DTOs.
14. Public SEO-sensitive content should be server-rendered where practical.
15. Security-sensitive behavior must not depend on client-side assumptions.

---

# 3. High-Level Architecture

The frontend has two rendering environments and a feature-oriented data layer. Feature hooks are used where React-facing state or React Query coordination is needed; otherwise callers use the Feature API directly.

```text
                         Next.js App
                            │
              ┌─────────────┴─────────────┐
              │                           │
       Server Components           Client Components
              │                           │
       Server composition          Feature Hooks
       Server data loading         Interaction state
              │                           │
              └─────────────┬─────────────┘
                            ↓
                 Feature API
                            ↓
                       api/client.ts
                            ↓
                          Axios
                            ↓
                    HackTrip Backend
```

A Server Component may call the Feature API directly. An interactive Client Component uses a feature hook when React Query or client lifecycle coordination is needed.

Google Maps is deliberately outside the backend API flow:

```text
                         FRONTEND
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ↓                           ↓
       HackTrip Backend             Google Maps
              │                           │
       api/client.ts                Google Maps SDK
              │                           │
            Axios                   Map components
              │
          Express API
```

Google Maps operations must not be routed through `api/client.ts` unless the backend contract explicitly introduces a corresponding endpoint.

# 4. Repository Structure

The primary frontend structure is:

```text
app/
  globals.css
src/
  api/
  components/
  constants/
    ui/
  hooks/
  lib/
  styles/
    presets/
  theme/
  types/
  validations/
  config/
docs/
```

The repository currently uses `src/constants/icons.ts` as its central icon registry. Do not refer to `src/constants/icons/index.ts` unless the registry is deliberately moved and all imports are updated together.

Responsibilities:

```text
app/
    Next.js App Router, pages, layouts, route groups and route-level composition

src/components/
    reusable UI components, feature UI and interactive UI

src/api/
    backend API communication, feature endpoint modules and centralized Axios client

src/hooks/
    reusable React hooks, feature query/mutation coordination and browser interactions

src/validations/
    Zod schemas, form validation and request/query validation where appropriate

src/types/
    TypeScript models, API DTO types, feature models and UI models

src/constants/
    centralized application constants organized by responsibility

src/constants/ui/
    semantic design tokens and shared UI scales: colors, spacing, sizes, breakpoints, shape, shadows, typography and z-index

src/theme/
    current MUI theme creation, palette, typography, shape, elevation resolution and component overrides

src/styles/presets/
    reusable composed sx/style fragments for buttons, cards, forms, layouts, panels, social actions, map controls and typography

app/globals.css
    minimal document reset, app shell, CSS variables consumers and server-rendered styles that need CSS selectors

CSS Modules
    complex component-local layout and responsive styles; they are not a second design-token store

src/lib/
    framework-independent utilities and shared low-level helpers

src/config/
    application/environment configuration
```

Do not add an intermediate frontend layer or unnecessary pass-through abstractions.

# 5. Next.js App Router

The application uses the Next.js App Router.

The `app/` directory owns:

- routing
- layouts
- pages
- route groups
- metadata
- route-level composition

Route organization should represent application navigation and page boundaries rather than backend controller structure.

Do not create frontend routes simply because a backend endpoint exists.

---

# 6. Server Components

Server Components are the default.

Use Server Components when a component does not require:

- browser APIs
- React client hooks
- browser event handlers
- interactive state
- client-only authentication interaction
- map SDK access
- geolocation
- live tracking

Server Components are preferred for:

- public trip pages
- public point pages
- informational pages
- SEO-sensitive content
- static page composition
- server-side data loading where appropriate

Avoid unnecessary `"use client"` boundaries.

---

# 7. Client Components

Client Components are required for browser-side functionality.

Typical examples:

- interactive forms
- authentication forms
- interactive navigation
- dialogs
- image upload UI
- drag/drop
- likes
- favorites
- comments interaction
- Google Maps
- geolocation
- live tracking
- touch interactions
- swipe interactions
- browser-specific behavior

Client Components should remain as small and isolated as practical.

Do not convert an entire page or feature to a Client Component merely because one child component needs browser functionality.

Prefer:

```text
Server Page
    ↓
Server composition
    ↓
Client interactive island
```

---

# 8. API Architecture

All communication with the HackTrip Backend must use the centralized API architecture.

The transport path is:

```text
Feature API
    ↓
api/client.ts
    ↓
Axios
    ↓
HackTrip Backend
```

A Server Component may call a feature API directly for server-side data loading. An interactive Client Component normally uses a feature hook when it needs React Query, mutations, cache invalidation, or reusable client-side lifecycle state:

```text
Server Component ───────────────→ Feature API
                                      ↓
                                  api/client.ts

Client Component → Feature Hook → Feature API
                                      ↓
                                  api/client.ts
```

Use the direct feature-oriented flow:

```text
Component / Page
       ↓
Feature Hook (when needed)
       ↓
Feature API
       ↓
api/client.ts
       ↓
Axios
       ↓
HackTrip Backend
```

A Server Component may call Feature API directly.

The layers have distinct responsibilities.

---

## 8.1 `api/client.ts`

`src/api/client.ts` is the centralized Axios client.

It owns common HTTP behavior such as backend base URL, common headers, `x-hacktrip-client`, authentication header handling, credentials, refresh behavior, common response handling, and request payload normalization before transport.

The request interceptor normalizes every outgoing request body:

- JSON-like objects and arrays are copied and their ordinary string values are trimmed recursively.
- `FormData` is copied; text fields are trimmed and file/blob values are preserved unchanged.
- Fields whose names contain `token` or `captcha` are opaque and are preserved unchanged. The frontend must not trim verification/reset tokens or CAPTCHA response tokens.
- The normalizer does not mutate the caller's original object or FormData instance.

This is transport normalization, not a replacement for Zod validation. It must remain aligned with the backend's global body-trim middleware.

There must not be multiple independent Axios clients implementing competing authentication behavior.

Raw Axios calls must not be scattered across the application.

---

## 8.2 Feature API modules

Feature API modules expose endpoint-specific operations. Examples include `auth/`, `trips/`, `points/`, `comments/`, `social/`, `admin/`, and other feature directories under `src/api/`.

The exact directory structure follows the actual repository.

Feature APIs should contain HTTP endpoint operations and their request/response typing rather than UI logic. They must use the centralized client and follow `docs/API_CONTRACT.md`.

Feature APIs must not contain React hooks, component state, presentation logic, or UI notifications.

# 9. Feature Hooks

## 9.1 Feature hooks

Feature hooks provide a React-facing interface for interactive features. They may coordinate React Query queries and mutations, query keys and cache invalidation, loading/error state, client-side lifecycle and interaction state, and calls to one or more feature API operations.

Hooks may live under `src/hooks/` or in a feature-local hooks directory when that improves cohesion.

Do not create a hook that only renames a single API call unless it provides a useful, reusable React-facing contract.

# 10. API Contract Boundary

`docs/API_CONTRACT.md` defines the backend boundary.

The frontend must follow:

- endpoint paths
- HTTP methods
- request DTOs
- response DTOs
- authentication requirements
- authorization requirements
- error codes
- pagination
- ownership rules
- image rules
- public access rules

Do not invent frontend assumptions about the backend.

When a frontend requirement conflicts with the API contract, stop and resolve the contract discrepancy instead of silently implementing a different protocol.

---

# 10.1 Trip GET response model

The frontend must use exactly the same Trip Group response model defined in `docs/API_CONTRACT.md` and returned by the Backend for all Trip GET endpoints.

The canonical response model is:

```text
TripGroupResponse
├── id
├── permissions
├── social
└── days[]
    ├── id
    ├── dayNumber
    ├── permissions
    ├── title
    ├── description
    ├── countPeoples
    ├── destination
    ├── lat
    ├── lng
    ├── price
    ├── currency { id, code, name }
    ├── transport
    ├── group
    ├── images[] + social
    ├── social
    ├── points[]
    │   ├── id
    │   ├── name
    │   ├── description
    │   ├── lat
    │   ├── lng
    │   ├── pointNumber
    │   ├── tripId
    │   ├── images[] + social
    │   ├── permissions
    │   └── social
    ├── createdAt
    └── updatedAt
```

The response is intentionally aligned with the database field naming for public Trip/Point fields. Do not rename or reshape these fields in the frontend API model.

### TripGroupDay

Each item in `TripGroupResponse.days[]` represents one `trips` database row and contains the public day-level fields:

```json
{
  "id": 1001,
  "dayNumber": 1,
  "title": "Day 1",
  "description": "Day description",
  "countPeoples": 2,
  "destination": "Sofia",
  "lat": 42.6975,
  "lng": 23.3241,
  "price": 250,
  "currency": {
    "id": 22,
    "code": "BGN",
    "name": "Bulgarian Lev"
  },
  "transport": {
    "key": "car",
    "name": "Car"
  },
  "group": {
    "key": "friends",
    "name": "Friends"
  },
  "images": [ SocialImageDto ],
  "social": SocialState,
  "points": [ TripPoint ],
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

All four day-specific database fields `countPeoples`, `destination`, `lat` and `lng` belong inside each `days[]` item. They must not be moved to `TripGroupResponse` level.

### TripPoint

Each point uses the database/API field names directly:

```json
{
  "id": 2001,
  "tripId": 1001,
  "name": "Point title",
  "description": "Point description",
  "lat": 42.6975,
  "lng": 23.3241,
   "pointNumber": 1,
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp",
  "images": [ SocialImageDto ],
  "permissions": {
    "canEdit": true,
    "canDelete": true
  },
  "social": SocialState
}
```

Point coordinates are `lat` and `lng`. Do not rename them to `latitude` / `longitude` in the API DTO.

`pointNumber` is a server-generated integer that defines the persisted point order. It is never supplied in create/update request bodies (`docs/API_CONTRACT.md` §18.8). Points are returned in numeric `pointNumber` order, with `id` as the tie-break where required by the backend.

`ownerId` and `countEdited` are never part of the public Point response. `tripId`, `createdAt`, `updatedAt` and the server-computed `permissions` are part of the point response as defined by `docs/API_CONTRACT.md` §10.7.

### Ownership/security

`ownerId` and `userId` are never part of the public Trip Group, Day or Point response. They remain server-side ownership/authentication data and must not be added to frontend API DTOs, UI models, query parameters, or client-generated request identity.

### Shared response rules

A Trip Group is the grouping container. Day-specific metadata belongs to `days[]`, not to the Trip Group root.

Missing day numbers are preserved. For example, a group containing days 1, 3 and 5 returns exactly those existing days; the frontend must not generate missing days.

The `currency` object is supplied by the backend configuration:

```json
{
  "id": 22,
  "code": "BGN",
  "name": "Bulgarian Lev"
}
```

Currency options must not be hard-coded in the frontend.

Day images, point images and all social structures must be consumed exactly as defined by `docs/API_CONTRACT.md`. Do not create a second frontend-specific image or social DTO.

Endpoint cardinality:

- `GET /trips` → `TripGroupResponse[]`
- `GET /trips/top` → up to 5 `TripGroupResponse[]`
- `GET /trips/:id` → one complete `TripGroupResponse`
- `GET /me/trips` → `TripGroupResponse[]`
- `GET /me/favorites` → `TripGroupResponse[]`

For `GET /trips/:id`, `id` is the `tripGroupId`. The backend returns the complete group and all its days. If the user opened a specific day, the frontend selects that day from the returned `days[]`; it must not expect the endpoint to return only that day.

The same TypeScript/API model must be reused for all five endpoints. The frontend must not maintain a legacy Trip response shape alongside the canonical response.

# 10.2 Trip creation and day workflow

The frontend must treat `tripGroupId` only as the identifier that groups days together. It is not a day identifier and it does not contain day metadata such as title, description, price, currency, transport or group.

All trip creation actions must use the backend response as the source of truth. The backend returns a complete `TripGroupResponse` containing the current group and its `days[]`.

## Add Trip

`Add Trip` creates the day currently being entered in the form. It does not mean that the day must be Day 1.

The frontend chooses the endpoint from whether a Trip Group already exists:

```text
tripGroupId exists?
    │
    ├── NO
    │    ↓
    │  POST /trips
    │    ↓
    │  BE creates Trip Group + current Day
    │
    └── YES
         ↓
       POST /trips/:tripId/days
         ↓
       BE creates current Day in existing Trip Group
```

Both operations return the same `TripGroupResponse` structure.

For example, if the existing group contains days 1, 2 and 3 and the user is currently creating Day 6, `Add Trip` creates Day 6 and then navigates to Trip Details with Day 6 selected.

After either POST:

1. Use the returned `id`.
2. Find the newly created day in the returned `days[]`.
3. Use that day's `id` as the day identifier.
4. Navigate to Trip Details.
5. Open exactly the newly created day, not the first day by default.

The frontend must not construct a fake day from the form after the request succeeds. The returned backend data is authoritative.

## Add Next Day Trip

`Add Next Day Trip` creates a day. It may be used when the Trip Group already exists, and the current form may also represent a day being created as part of the same creation flow.

When a Trip Group already exists:

```text
POST /trips/:tripId/days
→ BE creates the current day
→ returns TripGroupResponse
→ FE stays on the current trip form
```

When no Trip Group exists yet:

```text
POST /trips
→ BE creates Trip Group + current Day
→ returns TripGroupResponse
→ FE stays on the form
```

After receiving the response, the frontend uses the returned `days[]` to determine the highest existing `dayNumber`. The next form is prepared with:

```text
next dayNumber = highest existing dayNumber + 1
currency       = values from the latest day
transport      = values from the latest day
group          = values from the latest day
```

The values must come from the backend response, not from a separate hard-coded default.

## Add Points for this Day

The button is named `Add Points for this Day`.

The current day may belong to an existing Trip Group or may be the first day being persisted. The frontend therefore uses the same creation decision:

```text
tripGroupId exists?
    │
    ├── NO → POST /trips
    │
    └── YES → POST /trips/:tripId/days
```

The returned `TripGroupResponse` is then used to identify both required IDs:

648:

```text
TripGroupResponse
├── id
└── days[]
    └── newly created Day
        └── id
```

The frontend navigates to the Add Points flow using:

```text
tripGroupId → identifies the Trip Group
day.id      → identifies the specific Day to which points belong
```

Point creation must use the specific `day.id`; points are not attached directly to the Trip Group.

## Editing a Day

From Trip Details, the owner action is labelled `EDIT DAY N` for the currently selected day. It navigates to:

```text
/trips/:tripGroupId/edit?dayId=:dayId
```

The route loads the Trip Group and opens the matching day editor. The `dayId` is the database ID from the selected `days[].id`; it must not be replaced with the displayed `dayNumber`. If the supplied day ID does not belong to the group, the route returns not found.

Saving that editor uses:

```text
PUT /trips/:tripGroupId/days/:dayId
```

The backend returns the updated `TripGroupResponse`.

### Day number changes and reordering

The frontend uses `PUT /trips/:tripGroupId/days/reorder` for every change to existing day numbers. The request contains the complete set of days in the group:

```json
{
  "days": [
    { "tripId": 101, "dayNumber": 1 },
    { "tripId": 412, "dayNumber": 3 },
    { "tripId": 309, "dayNumber": 7 }
  ]
}
```

- `tripId` is the database ID from `days[].id`; `dayNumber` is the requested logical day number.
- The frontend sends every existing day, not only the days being changed.
- When the selected number is already used by another day, the editor swaps the two day numbers.
- The Days manager's move up/down controls also swap the two selected days' existing numbers. They do not compact gaps or derive numbers from array positions.
- All other day numbers remain unchanged.
- The endpoint returns the complete `TripGroupResponse`; the frontend replaces the cached trip group with that response.

When the Edit Trip form also changes day details, it first saves those fields using the current day number, then submits the complete reorder request. If the reorder request fails, the other edited fields may already have been saved; the form displays the error and does not navigate away.

After a successful edit:

1. Keep the `dayId` that was being edited.
2. Use the returned `days[]` from the response.
3. Find the same day by its `id`.
4. Navigate to Trip Details.
5. Open exactly that day and display the newly returned values.

The frontend must not perform a second request merely to reconstruct the result of the successful PUT when the returned `TripGroupResponse` already contains the complete updated group.

## Trip Details navigation rule

`GET /trips/:id` uses `id = tripGroupId` and returns the complete Trip Group with all existing days.

When navigation originates from a specific day, the frontend must preserve that target day's `day.id` or `dayNumber` and select that day after the complete response is loaded.

The frontend must never assume that the first day is the selected day.

# 11. Authentication Architecture

Authentication has two separate token mechanisms:

```text
Access token
    ↓
memory only

Refresh token
    ↓
HttpOnly cookie
```

The frontend never reads the refresh token.

## 11.1 Login

The login flow is:

```text
Login form
    ↓
auth API
    ↓
POST /auth/login
    ↓
backend
    ├── access token
    └── refresh cookie
    ↓
access token stored in memory
```

The refresh token must never enter React state or JavaScript-accessible storage.

## 11.2 Session Restoration

After a browser reload, the frontend must not use `localStorage`, `sessionStorage`, IndexedDB, or another client-side persistence mechanism to store authentication/session state or a session-presence hint.

An anonymous visitor on a public page must not proactively call `POST /auth/refresh` merely because the page was reloaded.

Because the refresh token is HttpOnly and the access token is memory-only, the frontend cannot inspect the refresh cookie directly before making a request. The contract therefore provides a read-only session-presence probe:

```text
GET /auth/session
```

The probe:

- uses the public frontend bearer token;
- is sent with credentials enabled so the browser may include the HttpOnly refresh cookie;
- returns only `{ "hasSession": true|false }`;
- does not return or rotate access/refresh tokens;
- does not return user identity, role, account status or other account data;
- does not establish an authenticated access-token context;
- must return the same response shape for absent or invalid sessions.

The expected public-page reload behavior is:

```text
Public page reload
      ↓
GET /auth/session
      ↓
hasSession?
   ┌───┴────┐
   ↓        ↓
 false     true
   ↓        ↓
remain     POST /auth/refresh
anonymous       ↓
   ↓       new access token
no refresh       ↓
             memory
                ↓
            GET /auth/me
                ↓
          authenticated state
```

If `hasSession` is `false`, the frontend must not call `POST /auth/refresh` and must continue as anonymous using the public frontend token for public API requests.

If `hasSession` is `true`, the frontend may intentionally call the normal refresh flow. A definitive refresh failure must result in anonymous state without an infinite retry loop.

The session probe is read-only and is not a substitute for authentication. A successful probe only indicates that a valid refresh session is present; the backend remains authoritative when the actual refresh and authenticated requests occur.

## 11.3 Anonymous Public Pages

Public pages must remain usable for anonymous visitors. Anonymous page loads and reloads must not require a user access token or an authenticated refresh session unless the page itself is protected.

Public API requests follow the public-access rules in `docs/API_CONTRACT.md`. The public frontend token identifies the frontend client for public access; it is not a substitute for a user's authentication token.

# 12. Access Token Handling

Access tokens are application-memory state.

Do not persist access tokens in:

- localStorage
- sessionStorage
- IndexedDB

Do not create alternative token storage mechanisms.

The centralized API client is responsible for attaching the current access token when appropriate.

---

# 13. Refresh Token Handling

Refresh tokens are HttpOnly cookies.

The browser owns the cookie lifecycle.

The frontend JavaScript must not:

- read the refresh token
- write the refresh token
- copy the refresh token into state
- log the refresh token
- expose the refresh token to components

Axios requests that depend on the refresh cookie use:

```text
withCredentials: true
```

Fetch requests that depend on the refresh cookie use:

```text
credentials: 'include'
```

---

# 14. Refresh and 401 Handling

Authenticated requests may receive `401`.

The frontend API layer handles access-token restoration.

The expected flow is:

```text
Authenticated request
      ↓
401
      ↓
restoreSession()
      ↓
refresh access token
      ↓
retry original request once
```

Refresh requests themselves must not recursively enter the same refresh cycle.

Only one refresh operation should be active when multiple requests fail concurrently.

Conceptually:

```text
Request A ──┐
Request B ──┼──→ single refresh operation
Request C ──┘
                 ↓
             new token
                 ↓
          retry eligible requests
```

The frontend must prevent refresh storms and infinite retry loops.

---

# 15. Public Access and Client Identification

The following concepts are independent:

```text
x-hacktrip-client: web
        ↓
identifies the frontend client

Public bearer token
        ↓
public frontend access

User access JWT
        ↓
authenticated identity

Refresh HttpOnly cookie
        ↓
session restoration
```

The frontend must not merge these mechanisms into one generic token concept.

The exact behavior is defined by `docs/API_CONTRACT.md`.

---

# 16. Authorization Architecture

Authorization is ultimately enforced by the backend.

The frontend may provide UX guards.

Examples:

```text
RequireAuth
RequireRole
RequireTripOwner
```

These guards improve navigation and user experience.

They are not security boundaries.

The backend must independently enforce:

- authentication
- role permissions
- ownership
- account status
- resource access

Never assume that hiding a button or route is sufficient authorization.

---

# 17. Account State

Authentication state and account state are separate concerns.

Relevant backend states include:

- pending verification
- active
- suspended
- deactivated

Frontend behavior should distinguish meaningful backend authentication/account errors rather than treating every failure as anonymous.

For example:

```text
EMAIL_NOT_VERIFIED
ACCOUNT_SUSPENDED
ACCOUNT_DEACTIVATED
```

must remain distinguishable where the UI needs to communicate the correct state.

---

# 18. Routing Guards

Frontend guards should preserve navigation context where applicable.

For protected routes:

```text
unauthenticated
      ↓
login
      ↓
returnTo
      ↓
original destination
```

For role-protected routes:

```text
authenticated
      ↓
role check
      ↓
allowed → render
not allowed → appropriate fallback
```

For ownership-protected UI:

```text
authenticated
      ↓
resource owner check
      ↓
owner → edit UI
non-owner → public/read-only UI
```

Backend ownership remains authoritative.

---

# 19. Data Fetching

Data fetching should happen at the most appropriate layer.

Prefer server-side fetching for public, SEO-sensitive content when possible.

Use client-side fetching when functionality requires:

- browser interaction
- live updates
- user-specific state
- interactive mutations
- browser-only APIs

Do not automatically introduce a client-side data fetching layer for every request.

Use the dependencies already present in the repository according to the established architecture.

Do not add another data-fetching library without a concrete architectural requirement.

---

# 20. React Query

If React Query is used by the application, it must have a clear responsibility.

React Query is appropriate for client-side server state requiring features such as:

- caching
- synchronization
- invalidation
- background refetching
- mutation state
- query lifecycle management

React Query must not replace the API architecture.

The flow remains:

```text
Client Component / hook
      ↓
React Query
      ↓
Feature API (called directly or through a feature hook)
      ↓
api/client.ts
      ↓
Backend
```

Do not call Axios directly from arbitrary React Query callbacks; use the relevant Feature API.

Do not introduce React Query into server-only page data simply because it is available in `package.json`.

---

# 21. Google Maps Architecture

Google Maps is a separate browser integration.

It does not belong under the HackTrip backend API layer.

The conceptual architecture is:

```text
Map page/component
       ↓
Google Maps integration
       ↓
Google Maps JavaScript SDK
       ↓
Google Maps
```

Backend data can be combined with map rendering:

```text
HackTrip API
     ↓
trip/point data
     ↓
map component
     ↓
Google Maps SDK
```

But the Google Maps SDK itself is not accessed through Axios.

---

# 22. Google Maps Loading

Google Maps must be loaded through the existing Google Maps integration rather than through the HackTrip API client.

Google Maps functionality should remain within Client Components because the Maps JavaScript SDK requires browser execution.

The integration should centralize:

- API key configuration
- script loading
- map availability
- map-related context/provider behavior

Do not load the Google Maps JavaScript SDK independently in multiple components.

Do not duplicate script loaders.

---

# 23. Google Maps Deprecations

Google Maps APIs evolve independently from the HackTrip backend.

Existing deprecated Google Maps APIs must not be replaced blindly during unrelated migration work.

If the application currently uses deprecated APIs such as:

```text
google.maps.Marker
google.maps.places.Autocomplete
```

the migration must:

1. identify all usages;
2. determine whether the current Google Maps library supports the recommended replacement;
3. inspect existing behavior;
4. verify the replacement's interaction and visual behavior;
5. migrate deliberately;
6. verify desktop, mobile and touch behavior.

The current Google Maps deprecation warnings do not justify changing unrelated HackTrip architecture.

Google Maps API migrations are separate compatibility tasks.

---

# 24. Maps and Trip Data

Trip/point data comes from the HackTrip backend.

Map-specific rendering remains a frontend responsibility.

Conceptually:

```text
Backend trip
    ↓
Trip API
    ↓
Feature hook (when needed)
    ↓
Map component
    ↓
markers / polylines / routes
```

Do not put map rendering logic into API modules.

Do not put Axios calls directly inside low-level map primitives.

---

# 25. Live Tracking

Live tracking is browser-side functionality.

The conceptual flow is:

```text
Browser GPS
     ↓
tracking hook
     ↓
tracking state
     ↓
map component
```

The tracking system may combine:

- browser geolocation
- current coordinates
- trip route data
- map position
- polylines
- markers
- user interaction

Tracking should not require converting the complete trip page into a Client Component.

Keep browser-dependent logic isolated.

---

# 26. Constants Architecture

Constants live under:

```text
src/constants/
```

They are organized by responsibility.

Current architecture includes areas such as:

```text
src/constants/
├── images/
├── maps/
├── points/
├── trips/
├── ui/
└── ...
```

The purpose of this structure is to prevent unrelated constants from being placed into large generic files.

Examples:

```text
images/
    image presets
    image sizes

maps/
    map defaults
    map configuration

points/
    point-related limits
    point configuration

trips/
    trip-related limits
    trip configuration

ui/
    UI-specific constants
```

Follow the actual repository structure when adding new constants.

Do not recreate removed flat files merely because older documentation referenced them.

---

# 27. Image Architecture

Images are handled through centralized image-related functionality.

The current image preset architecture includes:

```text
src/constants/images/presets.ts
```

Image constants should remain centralized.

Do not recreate removed legacy files such as:

```text
src/lib/images/imageUrl.ts
src/lib/images/imageMetadata.ts
```

unless a future architectural decision explicitly introduces those responsibilities again.

---

# 28. Image Components

Image rendering should use the existing shared image components and utilities.

Use `next/image` where appropriate.

Image URLs should come from the backend contract/data model.

Do not reconstruct backend storage URLs manually inside components.

Image presentation may include:

- thumbnails
- full-size images
- galleries
- previews
- upload previews

Image interaction must preserve existing legacy behavior.

---

# 29. Image Upload Architecture

Image upload follows the backend contract.

The frontend must respect backend limits.

Typical constraints include:

- one image per request
- maximum image count per entity
- maximum file size
- supported image formats

Client-side validation is only an early UX check.

The backend remains authoritative.

The frontend must not assume that client validation makes an upload safe or valid.

---

# 30. Forms and Validation

Forms use React form patterns and Zod validation.

The conceptual flow is:

```text
Form
 ↓
Zod validation
 ↓
Feature hook (when needed)
 ↓
Feature API
 ↓
Backend validation
```

Client validation exists for usability.

Backend validation remains authoritative.

The FE and BE must apply matching input semantics:

- Ordinary text fields are trimmed before validation and submission.
- Passwords are trimmed at the boundaries before password validation; the resulting password must satisfy the backend policy. Do not preserve surrounding whitespace as part of a password.
- Opaque token and CAPTCHA fields are not trimmed. Their values must be preserved unchanged and whitespace must be rejected by validation.
- JSON API body schemas accept actual JSON numbers, not numeric strings. Form-only adapters may convert numeric input strings to numbers before calling the API; API request schemas remain strict.
- Multipart upload requests preserve file/blob content. Text fields, if an endpoint allows them, are trimmed; current image upload endpoints send only the binary `file` field.

Forms must handle documented backend validation errors.

Do not send fields that are generated or owned by the backend.

---

# 31. API Types

API types should reflect backend DTOs.

Where useful, distinguish:

```text
Request DTO
Response DTO
UI model
Form model
```

Do not expose database implementation details to UI code.

Do not assume that a backend database model and API DTO are identical.

---

# 32. Error Handling

Backend errors should retain their meaning.

The frontend should map documented error codes to appropriate UI behavior.

Examples may include:

```text
401 UNAUTHORIZED
403 FORBIDDEN
403 EMAIL_NOT_VERIFIED
403 ACCOUNT_SUSPENDED
403 ACCOUNT_DEACTIVATED
404 NOT_FOUND
409 CONFLICT
400 VALIDATION_ERROR
500 INTERNAL_SERVER_ERROR
```

The exact contract is defined in `docs/API_CONTRACT.md`.

Do not create frontend-only error codes that pretend to be backend contract values.

Unexpected errors should not expose internal implementation details.

---

## 32.1 Backend API Feedback

User-facing feedback for requests to the HackTrip Backend must use the shared `NotificationProvider`.

- API request failures and backend-returned operation errors are displayed through `useNotification().error(...)`.
- Successful API operations that require user feedback use `useNotification().success(...)`.
- Do not render backend/API errors in component-local MUI `Alert`, `Snackbar`, or ad-hoc error-message state.
- Do not duplicate the same API result in both an inline message and a notification.
- Keep client-side form validation next to its field (for example, React Hook Form helper text). This is not an API error and must not become a notification.
- Keep local validation and browser/integration errors (for example, invalid file selection or geolocation failure) in the relevant UI when they are not responses to a backend request.
- Preserve the backend error mapping from `src/lib/errors.ts`; notifications must display the mapped message and must not change API/business logic.

`NotificationProvider` is the single shared presentation mechanism for backend operation feedback. Components should not create their own API-error Snackbar/Alert implementations.

---

# 33. Public Pages and SEO

Public pages should be designed for server rendering and SEO.

Relevant content includes:

- trips
- points
- About
- Privacy Policy
- other public informational pages

Use Next.js metadata APIs for:

- title
- description
- canonical
- Open Graph
- Twitter/X metadata

SEO metadata should not expose private user information.

Public pages should not require client-side JavaScript merely to render their primary content unless functionality genuinely requires it.

---

# 34. UI Architecture

MUI is the primary UI component system.

Reusable UI belongs in shared component locations.

Feature-specific UI should remain close to the feature when appropriate.

A generic component should not contain feature-specific backend logic.

Avoid:

```text
Button
  ↓
API call
  ↓
backend
```

Prefer:

```text
Button
  ↓
feature action / hook
  ↓
Feature API
  ↓
Feature API
```

---

# 35. Responsive Architecture

Responsive behavior is part of the existing application's functionality.

The modernization must support:

- desktop
- tablet
- mobile

Responsive behavior includes more than CSS.

It may include:

- different navigation
- different controls
- different interaction patterns
- different component layouts
- touch behavior
- mobile-specific gestures
- desktop hover behavior

Do not remove behavior simply because a new responsive implementation looks visually equivalent.

---

# 36. Input and Interaction Compatibility

Existing input behavior is considered functionality.

Preserve, where applicable:

- mouse click
- mouse hover
- mouse movement
- touch
- swipe
- drag
- keyboard
- pointer events
- device-specific behavior

When replacing a component:

```text
old component
    ↓
inspect interactions
    ↓
list behaviors
    ↓
implement equivalent behavior
    ↓
verify
    ↓
remove old implementation
```

Visual similarity alone is not sufficient.

---

# 37. Legacy Migration

The current frontend modernization is a migration rather than a redesign.

A replacement implementation must be compared against the legacy implementation before the old implementation is removed.

The migration process is:

```text
Legacy implementation
        ↓
Inventory functionality
        ↓
Target architecture
        ↓
Functional comparison
        ↓
Migrate missing behavior
        ↓
Verification
        ↓
Remove obsolete code
```

Legacy behavior includes:

- UI behavior
- API calls
- navigation
- validation
- responsive behavior
- mouse behavior
- touch behavior
- swipe behavior
- map behavior
- image behavior
- keyboard behavior
- loading states
- error states
- animations when functionally relevant

Do not interpret "modernization" as permission to redesign or simplify functionality.

---

# 38. Comments and Code Clarity

Code should explain itself where possible.

Avoid comments that merely describe obvious operations.

Bad:

```ts
// Get trip
const trip = await getTrip(id);
```

Good:

```ts
// Backend derives the owner from the authenticated user; do not send ownerId.
```

Comments should explain:

- why
- architectural constraint
- security requirement
- backend contract requirement
- compatibility requirement
- workaround
- non-obvious browser behavior

Do not add comments solely to increase documentation volume.

---

# 39. Security Boundaries

The browser is not a trusted security boundary.

Never trust:

- frontend role state
- frontend ownership state
- hidden buttons
- hidden routes
- client-side validation
- locally stored permissions

The backend must enforce authorization.

Frontend checks are for:

- navigation
- UX
- avoiding unnecessary requests
- presenting appropriate UI

They are not security controls.

---

# 40. Secrets and Configuration

Secrets must never be included in browser-exposed code.

Anything available through client-side JavaScript must be considered public.

Environment configuration must distinguish between:

```text
server-only secrets
```

and:

```text
browser-exposed configuration
```

Google Maps browser configuration must follow the Google Maps platform's intended browser key restrictions.

Backend secrets never belong in frontend code.

---

# 41. Dependency Boundaries

Existing dependencies should be reused where appropriate.

Current relevant dependencies include:

- Next.js
- React
- MUI
- Axios
- Zod
- React Hook Form
- React Query
- Google Maps integration

Do not add another library solving an existing problem without an explicit reason.

In particular, do not introduce:

- another HTTP client
- another validation library
- another data-fetching library
- another Google Maps loader

without a documented architectural need.

---

# 42. React Query Boundary

React Query, where used, is a client-side server-state mechanism.

It does not replace:

- API modules
- Axios client
- backend contract

Its responsibility is state lifecycle:

```text
query
cache
invalidate
refetch
mutation state
```

not HTTP transport configuration.

The HTTP boundary remains:

```text
React Query
    ↓
Feature API (optionally coordinated by a feature hook)
    ↓
api/client.ts
    ↓
backend
```

---

# 43. File and Folder Ownership

Each layer should have a clear responsibility.

```text
app/
    route/page composition

components/
    UI

api/
    backend HTTP operations

hooks/
    reusable React/browser behavior and feature query/mutation coordination

validations/
    Zod validation

types/
    TypeScript models

constants/
    reusable constants

lib/
    low-level shared utilities

config/
    configuration
```

Do not place API calls in constants.

Do not place backend transport logic in map components.

Do not place map SDK logic in the backend API client.

---

# 44. Migration Verification

Every migration batch must verify more than compilation.

At minimum:

```text
TypeScript
Lint
Build
Relevant tests
API contract
Legacy functionality
Responsive behavior
Authentication behavior
```

Where a component is replaced, verify its previous functionality.

Where an API operation is migrated, verify:

- endpoint
- method
- request payload
- authentication
- response handling
- error handling

---

# 45. Documentation Boundaries

The project has three distinct documentation responsibilities.

### `AGENTS.md`

Defines rules for coding agents and contributors.

### `docs/ARCHITECTURE.md`

Defines frontend architecture and boundaries.

### `docs/API_CONTRACT.md`

Defines the backend API contract.

These documents complement one another.

Do not create another frontend API contract.

Do not copy the complete backend contract into architecture documentation.

Do not modify the backend contract merely because the frontend architecture changed.

---

# 46. Modernization Scope

The current modernization should proceed incrementally.

Each batch should:

1. inspect existing implementation;
2. inspect legacy behavior where applicable;
3. identify the exact migration scope;
4. make the smallest coherent change;
5. preserve functionality;
6. verify the result;
7. commit the batch separately.

Do not combine unrelated modernization work into one large rewrite.

---

# 47. Current Architecture Direction

The target frontend architecture is:

```text
                         Next.js
                            │
              ┌─────────────┴─────────────┐
              │                           │
       Server Components           Client Components
              │                           │
       Feature API direct         Feature Hooks
              │                           │
              └─────────────┬─────────────┘
                            ↓
                 Feature API
                            ↓
                       api/client.ts
                            ↓
                           Axios
                            ↓
                    HackTrip Backend
```

Separately:

```text
Client Components
       ↓
Google Maps integration
       ↓
Google Maps JavaScript SDK
```

Authentication:

```text
Login
  ↓
access token → memory

refresh token
  ↓
HttpOnly cookie
```

Session restoration:

```text
Reload
  ↓
GET /auth/session
  ↓
hasSession?
  ├── false → remain anonymous
  │
  └── true
        ↓
    /auth/refresh
        ↓
    HttpOnly cookie
        ↓
    new access token
        ↓
    memory
        ↓
    /auth/me
```

Authorization:

```text
Frontend guards → UX
Backend          → authority
```

---

# 48. Final Architectural Rule

HackTrip frontend modernization must improve architecture without silently changing application behavior.

The most important rule is:

> **Modernization is a migration, not a redesign. Existing functionality must be preserved unless its removal is explicitly required.**

When architecture and legacy behavior appear to conflict:

1. inspect the legacy implementation;
2. identify the behavior;
3. compare it with the target architecture;
4. migrate the behavior into the target architecture;
5. verify it;
6. only then remove obsolete code.

The backend API contract remains the authoritative source for backend communication.

The frontend architecture remains responsible for clean separation between:

- pages
- UI
- API modules
- HTTP transport
- authentication
- browser integrations
- Google Maps
- validation
- configuration
- constants

No layer should silently absorb another layer's responsibility.

# 49. Public, User-Specific and Moderation Flows

These rules add frontend-specific behavior for functionality defined by `docs/API_CONTRACT.md`. The API contract remains authoritative for endpoint paths, DTOs, authentication, authorization and errors.

## 49.1 Public Top 5 Trips

Top 5 trips is a public feature. An anonymous visitor may load it without logging in.

The frontend must use the public endpoint defined by the API contract and must send the required `PUBLIC_FRONTEND_TOKEN` for public anonymous API access. It must not call `/auth/refresh` merely to load Top 5.

The response contains up to five trip groups, ranked by the number of likes associated with each trip group. If fewer than five trip groups exist, the frontend displays the returned groups only. Equal like counts are valid; the frontend must not invent a secondary ranking.

The returned items use the normal trip/trip-group response structure defined by the API contract.

## 49.2 My Trips and My Favorites

My Trips and My Favorites are authenticated-user features.

The frontend must not send a `userId` in these new requests when the API contract defines the current user from the authenticated session. The backend is responsible for determining the authenticated user.

My Trips returns the trip groups actually owned by the authenticated user.

My Favorites returns the trip groups for which the authenticated user has an actual persisted favorite record. A favorite is based on the backend relationship between the user and `tripGroupId`; the frontend must not infer a favorite from local UI state.

If the authenticated user has no favorites, the API response should be handled as the documented empty collection and the UI should represent that there are currently no favorites.

## 49.3 Background Images

Background images are public resources and must work for anonymous visitors.

The frontend must not read the Google Cloud Storage bucket directly and must not request the complete background-image list from Google Cloud Storage.

The backend's existing `refreshSlow()` flow loads background object names from Google Cloud Storage into dynamic configuration. A successful refresh replaces the stored list with the newly discovered names. If a later refresh fails, the last successful list remains available; the failure may be logged as a warning and must not break startup or dynamic-config refresh.

The backend background component selects random images from the dynamic-config list and returns a pair of ready-to-use public values through the public background endpoint: `current` for the current background and `next` as a candidate for the next navigation.

The frontend calls the public background endpoint and consumes the image pair. The frontend does not implement the random-selection algorithm.

The frontend must send the required `PUBLIC_FRONTEND_TOKEN` for this public anonymous API request. Loading a background image must not require user login or `/auth/refresh`.

### Background Image Loading and Navigation

The frontend implements a preloading pipeline to enable instant background transitions on navigation:

1. **Initial load**: The frontend fetches the image pair from `GET /api/v1/trips/background`. It loads and decodes the `current` image before displaying it. Once the current image is displayed, the `next` image is preloaded and decoded in the background.

2. **Navigation**: When the pathname changes (and the route is not `/admin`), the background provider checks whether a fully decoded `next` image is available at that moment.
   - If a ready `next` image exists, it is promoted to `current` immediately and synchronously, without waiting for an API request.
   - If no ready `next` image exists at that moment, the currently visible background remains unchanged. The navigation proceeds without a background transition.

3. **After navigation**: After a navigation (whether a transition occurred or not), the frontend requests a new image pair from the API and begins preloading the new `next` candidate in the background. The preloaded candidate becomes available for the next navigation.

4. **No delayed transitions**: A candidate that finishes loading _after_ a navigation has been handled must not trigger a delayed background transition for that navigation. The preload completion only updates the `next` candidate for future navigations; it never changes the visible `current` background independently.

5. **Error handling**: If an API request or image preload fails, the currently visible background is preserved. The error is logged silently and does not clear or replace the visible background. A subsequent navigation will retry fetching a new image pair.

6. **Exclusions**: The `/admin` route group is excluded from background rendering. When entering `/admin`, the background is cleared. When leaving `/admin`, a fresh initial load begins.

7. **Concurrency and stale results**: The implementation uses generation counters to prevent stale asynchronous operations (API responses or image preloads) from overwriting newer state. Rapid navigation and concurrent requests are handled safely without duplicate or stale transitions.

The frontend must send the required `PUBLIC_FRONTEND_TOKEN` for this public anonymous API request. Loading a background image must not require user login or `/auth/refresh`.

## 49.4 Reports and Admin Triage

Reports are moderation data created when a user reports a trip or comment that may violate the application's content/good-conduct policy.

The frontend moderation area must retrieve current reports from the backend so existing reports appear automatically when an authorized moderation user opens the relevant page.

Report data includes at least trip reports and comment reports. The moderation flow supports listing/triage and deleting/removing resolved reports according to the API contract.

Only authenticated users with the required manager/admin privileges may access report-triage endpoints. A normal authenticated user must not be able to list, inspect or delete reports merely because they are logged in.

Report deletion/removal is a moderation action and must remain protected by backend authorization. The frontend guard is UX only.

Legacy report endpoints are migration references only. Once the new contract is implemented, the frontend must use the new documented endpoints rather than calling legacy admin endpoints directly.

## 49.5 Authentication Boundary on Public Reload

For any public route, the frontend must distinguish anonymous navigation from authenticated-session restoration without persisting authentication/session state in browser storage.

```text
Public page reload
        ↓
GET /auth/session
        ↓
hasSession?
   ┌────┴────┐
   ↓         ↓
 false      true
   ↓         ↓
anonymous   POST /auth/refresh
   ↓         ↓
no refresh  memory access token
                ↓
            GET /auth/me
                ↓
          authenticated
```

The frontend must not use `localStorage`, `sessionStorage`, IndexedDB, or another client-side persistence mechanism as a session-presence hint.

If `hasSession` is `false`, the frontend must not call `POST /auth/refresh`.

If `hasSession` is `true`, the frontend may intentionally attempt the normal refresh flow. A definitive refresh failure results in anonymous state and must not create a refresh loop.

`GET /auth/session` is read-only and returns only the boolean session-presence result. It does not expose or rotate tokens or account information.

## 49.6 Verification Requirements

When migrating these features, verify both functionality and access boundaries:

```text
Anonymous → Top 5 → public token → success
Anonymous → Background → public token → one random value → success
Anonymous → public page reload → no /auth/refresh
Authenticated → reload → refresh session → /auth/me
Authenticated → My Trips → own trip groups only
Authenticated → My Favorites → persisted favorite trip groups only
Manager/Admin → Reports → current trip/comment reports
Manager/Admin → delete report → authorized moderation action
Normal user → Reports → denied
```

These rules supplement the existing architecture and migration-verification sections. They do not remove or replace existing functionality or documentation.

# 49.7 Current-user Trip and Favorite API Boundary

The current-user endpoints are:

```text
GET /me/trips
GET /me/favorites
```

Both endpoints resolve the current user exclusively from the authenticated session. The frontend must not send a `userId` or `ownerId` as an ownership selector.

Both endpoints return the same unified trip-group response model used by the other modern trip GET endpoints:

```text
GET /me/trips      → TripGroupResponse[]
GET /me/favorites  → TripGroupResponse[]
```

Each returned item has the normal complete Trip Group structure:

```text
TripGroupResponse
├── id
├── social
└── days[]
    ├── id
    ├── dayNumber
    ├── title
    ├── description
    ├── price
    ├── currency { id, code, name } | null
    ├── transport
    ├── group
    ├── images[] + social
    ├── social
    └── points[]
        ├── Point + social
        └── images[] + social
```

The frontend must consume these responses exactly as the unified Trip Group model. It must not expect the old `TripListItem` summary structure and must not maintain a separate response model for these two endpoints.

The Trip Group is only the container identified by `tripGroupId`. Trip-specific content belongs to `days[]`. The frontend must not expect `title`, `description`, `price`, `currency`, `transport` or `group` directly on the Trip Group.

For both endpoints:

- `tripGroupId` identifies the Trip Group.
- `days[].id` identifies the actual `trips` row/day.
- `days[].dayNumber` is the displayed/logical day number and is not the database ID.
- Existing day numbers must be preserved; the frontend must not generate missing days.
- Day, point and image social state must be consumed from their respective response levels.

### Security boundary

The response must not expose `userId`, `ownerId`, or an `author.id`/owner UUID for the trip owner. In particular, `GET /me/favorites` must never expose the UUID of another user's account merely because that user's trip was favorited.

The authenticated user identity is a backend security concern. The frontend must use the endpoint result without receiving or relying on database user identifiers. The backend remains responsible for resolving the current user, checking ownership/favorite relationships and enforcing authorization.

For `GET /me/trips`, only groups owned by the authenticated user are returned.

For `GET /me/favorites`, only groups for which the authenticated user has a persisted favorite relationship are returned. The frontend must not infer favorite state from local UI state.

The frontend should call these endpoints through the Feature API and centralized API client:

```text
Page / feature hook
    ↓
feature API
    ↓
api/client.ts
    ↓
Axios
    ↓
GET /me/trips or GET /me/favorites
```

The frontend does not provide the user ID and does not infer ownership client-side. Backend authentication, authorization, ownership and favorite checks remain authoritative.

# 49.8 Public Trip Discovery and Background API Boundary

The public endpoints remain:

```text
GET /trips/top
GET /trips/background
```

Both are available to anonymous visitors using the required public Frontend authentication contract. They must use the public Frontend token and must not require an authenticated user session.

`GET /trips/top` returns up to five trip groups ranked by their total likes. The frontend consumes the normal trip response structure and does not implement the ranking or grouping logic.

`GET /trips/background` returns a pair of image objects: `current` for the current background and `next` as a preloaded candidate for the next navigation. Background images are not read directly from Google Cloud Storage by the frontend. The backend refreshes the available filenames through its slow dynamic-config refresh, keeps the last successful list when a refresh fails, and the backend background component selects the random image pair.

The frontend therefore performs:

```text
public page / component
    ↓
Feature API
    ↓
GET /trips/background
    ↓
{ current: { url }, next: { url } }
```

The frontend loads and decodes the `current` image before displaying it. The `next` image is preloaded and decoded in the background. On navigation, if the `next` image is fully ready, it is promoted to `current` immediately without waiting for an API request. If the `next` image is not ready at the moment navigation occurs, the current background is kept and no delayed transition occurs later.

Loading a background image must work for an anonymous visitor and must not require `/auth/refresh`.

# 46. Comment and Social API Integration

Trip detail comments are loaded for the selected day using GET /trips/:tripGroupId/days/:tripId/comments; the group id and day row id remain separate identifiers. Comment DTOs preserve parentCommentId and the complete viewer-aware social state from the backend.

Social action availability comes from `GET /config/social`, fetched through the centralized config API and cached with React Query. Components map route/UI aliases (`tripGroup`/`tripgroup`, `day`/`trip`) to the backend configuration keys, then check the action, target, operation, and, for `replyComment`, the root-comment context. A missing or failed configuration check hides that action and displays the configuration load/error state.

This configuration describes global feature capabilities only. It does not grant a user permission to mutate content. Comment author/moderator permissions (`canEdit` and `canDelete`), authentication state, and backend authorization remain independent checks. Replies can be created, edited, or deleted only for point-root comments; the API uses the parent comment id and derives the parent relationship server-side.

Viewer-specific trip, point, comment, and reply query keys include an opaque authentication session version. This prevents cached `likedByMe`, `favoritedByMe`, `reportedByMe`, and permission fields from carrying across login, logout, or session restoration. Queries that return viewer state wait until authentication resolves and remain disabled on account-status errors.

Replies use the dedicated /comments/:commentId/replies collection and /replies/:replyId update/delete routes. They retain the parent comment's target and are displayed one level deep. Like, favorite and report mutations on comments or replies use the comment target id. A user's report is withdrawn with DELETE /reports?targetType=comment&targetId=...; report ids are only used by administrative report removal.

Feature API modules validate query/body inputs and preserve backend DTO field names. The shared Axios error normalizer retains the backend error code and HTTP status so feature UI can display contract-specific outcomes.

## 10.3 Trip creation form implementation rules

The Trip creation form reads an optional `tripGroupId` from the `/trips/create?tripGroupId=<id>` query parameter. The form loads that complete group through `tripApi.getTrip` and uses the returned `days[]` as the source of truth for occupied day numbers and the latest saved select values.

- `Add Trip`: submit the current day with `POST /trips` when no group ID exists, or `POST /trips/:tripGroupId/days` when one exists. After successful image handling, navigate to Trip Details and select the created day.
- `Add Next Day Trip`: use the same endpoint decision, keep the user on the create form, retain the group ID in the URL, and prepare the next number as the highest returned `dayNumber + 1`. Reset day-specific text, price, destination, coordinates and image selections; retain the latest saved count and select values where the corresponding backend options still exist.
- Before submission, compare the selected `dayNumber` against the group's actual `days[]`. If occupied, show the legacy-style error Snackbar (for example, `Day 3 already exists!`) and disable both submit actions. A free number re-enables submission. The backend unique constraint remains authoritative for concurrent requests.
- Both create operations use the full `tripWriteSchema` payload. Coordinates are included as `lat` and `lng`; day images are uploaded through the separate day-image endpoint after the day exists.
- Do not infer missing days from the highest number except when calculating the next day for the form. Existing groups may legitimately contain gaps.

---

# 11. UI Architecture and Design System

MUI is the primary UI component system. The design system must provide one consistent source of truth for shared visual decisions without forcing every component into a global abstraction.

## 11.1 Ownership

The current implementation uses the following ownership boundaries:

```text
app/
  globals.css
    document reset, app shell and small CSS-only server-rendered rules

src/constants/ui/
  colors.ts
  spacing.ts
  sizes.ts
  breakpoints.ts
  shape.ts
  shadows.ts
  typography.ts
  z-index.ts
    semantic design tokens and shared UI scales

src/theme/
  index.ts
  palette.ts
  typography.ts
  shape.ts
  shadows.ts
  components/
    button.ts
    card.ts
    dialog.ts
    surface.ts
    text-field.ts
    MUI theme creation and component defaults/overrides

src/styles/presets/
  buttons.ts
  cards.ts
  forms.ts
  layouts.ts
  map-controls.ts
  panels.ts
  social.ts
  typography.ts
    reusable composed sx/style fragments; this is not a second token store

app/providers.tsx
    provider composition and ThemeProvider wiring; imports the theme from src/theme/

src/components/
    reusable UI building blocks and feature components
    CSS Modules own complex component-local layout and responsive rules
```

`src/theme/index.ts` is the single MUI theme entry point. `app/providers.tsx` wires that theme into the application; it does not create a second theme.

`UI_COLORS` is the semantic color source of truth. The unused flat `COLORS` compatibility map has been removed. Shared spacing and dimensions are represented by `UI_SPACING` and `UI_SIZES`; MUI spacing numbers are multipliers of the configured 8px theme unit. The MUI palette is explicitly derived from semantic tokens for primary color, canvas/paper surfaces, text, dividers and action states; equivalent CSS custom properties are exposed by the single theme for plain CSS consumers.

`src/constants/ui/styles.ts` still contains the legacy `CARD_BORDER` token, but the profile and trip-edit panels no longer consume it. Do not add new styles there; remove the token only after a repository-wide consumer check.

## 11.2 Styling rules

- Concrete reusable colors, spacing, sizes, radii, shadows, typography and JavaScript/MUI breakpoints have one central owner under `src/constants/ui/`.
- MUI palette, typography, shape, elevation resolution and component defaults belong in `src/theme/`.
- Reusable combinations of styles belong in `src/styles/presets/`. Presets compose tokens and theme values; they must not become a second source of raw design-token values.
- MUI component surface defaults belong in the theme. Component `sx` should focus on layout, composition or state-dependent differences.
- CSS Modules are appropriate for complex component-local layout and responsive rules. Keep unique geometry local; do not force one-off rules into global CSS or a generic preset.
- `app/globals.css` stays minimal: document reset, app shell, and CSS-only behavior needed by server-rendered markup. Shared colors, shape and button geometry/typography used by global CSS are exposed as CSS variables by the MUI theme.
- Use `BREAKPOINTS` and media helpers for JavaScript/MUI responsive styles. CSS Modules retain local media/container queries where CSS cannot consume TypeScript tokens; keep those thresholds documented and aligned where they share the same semantic breakpoint.
- Extract a shared pattern only when call sites have the same visual meaning. Similar-looking styles with different semantics may remain separate.
- Centralization must preserve existing visual behavior; it is not an unrequested redesign.

## 11.3 Verified migration inventory and deeper styling audit

The following audit was performed against the current modernization branch. It inspected the token and theme layers, provider wiring, global CSS, every CSS Module present in the repository, reusable presets, and representative consumers across layout, home, authentication, admin, comments/social, maps, points and trips. This is a deeper verified inventory, not a claim that every JSX style expression in every component has been exhaustively classified.

### Runtime ownership and CSS variables

- `app/providers.tsx` mounts MUI `CssBaseline` inside the single `ThemeProvider`; the CSS variables declared by `src/theme/index.ts` are therefore emitted at runtime.
- The inspected `app/globals.css` and CSS Modules consume semantic variables that are declared by the theme. The global stylesheet is appropriately small: reset, app shell, code font and the CSS-only `.ht-button` rules needed by server-rendered trip markup.
- Keep the `.ht-button` rules in global CSS while server-rendered trip surfaces depend on them. Their shared button geometry and typography are already sourced from theme-generated CSS variables.
- `UI_SPACING` uses an 8px MUI unit. `PAGE_CONTENT_PADDING` remains a separate 30px page-gutter value; do not silently replace it with a multiple of the spacing scale where exact legacy geometry is required.
- The shared MUI font stack is `TYPOGRAPHY.fontFamily`, consumed by the theme/CssBaseline and Footer. The About page has a separate `Space Mono` heading declaration; verify font loading and intended brand treatment before changing it. Do not introduce a second global font stack.
- The primary token is currently blue (`#1976d2`) while its hover token is green (`#4daf30`). This is existing visual behavior and has deliberately not been changed during architecture migration. Revisit both together during the planned brand redesign rather than making an incidental styling change.

### Reusable patterns verified

- LoginForm, RegisterForm and ForgotPasswordForm already consume `AUTH_FORM_SX` and the related auth presets. Do not migrate them again.
- The compact social count badge had the same five metrics in EngagementBar, LikeButton and FavoriteButton. These are now owned by `SOCIAL_BADGE_COMPACT_STYLE` in `src/styles/presets/social.ts`, and all three consumers reference that preset. This is a genuine shared visual pattern, not a new design token.
- CreatePointPage and EditPointPage had the same Point form Card contract (responsive padding, 600px max width, min-width handling, box sizing and nested FormControl spacing). These are now owned by `POINT_FORM_PANEL_SX` in `src/styles/presets/forms.ts`; each page retains only its distinct outer spacing/order rules. TripForm deliberately remains separate because its width, control spacing and responsive behavior differ.
- `SOCIAL_ACTIONS_SX` and the compact horizontal group in TripGroupSocialActions have different spacing/behavior; do not force them into one preset without a visual and interaction comparison.
- CommentsSection has its own comments panel and comment-card layout definitions. They currently describe a feature-specific structure, not a proven cross-feature surface pattern; keep them local unless another consumer with the same semantics is found.
- `CARD_TEXT_INSET_SX` is shared by trip-card and trip-details content. PointCard uses a different 10px inset, so it must not be silently changed to the shared 15px card inset.
- Header navigation button spacing, Footer padding, HomeHero text width/margins, map picker geometry and form-specific responsive widths are local compositions. Their current reuse scope does not justify global tokens or universal presets.

### Legacy surfaces and theme

- The profile page and EditTripLayout have been migrated from `LEGACY_PANEL_SX` to `PANEL_SX(theme)`. The legacy preset has been removed. `UI_SHADOWS.profileImageControl` remains separately used by the circular profile-image control.
- MUI Card, Dialog and shared panel surfaces resolve through `getSurfaceStyles(theme)`; component `sx` should not recreate their shared background, border, radius and shadow.
- TextField defaults are centralized as outlined/medium in the theme. Do not repeat those defaults in individual forms without a specific exception.
- Semantic palette tokens explicitly own the primary color, canvas/paper, primary/secondary text, divider and selected/hover action states. Preserve the deliberate distinction between MUI paper and the legacy translucent card surface.

### CSS Modules and responsive rules

All CSS files currently present in the repository were inspected: AboutPage, LegalPage, NotFound, ImageGallery, TripDetailsView, TripList, TripPagination and globals.

- Keep TripDetailsView's grid/container-query composition local. Its 1120px container threshold is based on available component width, not the same semantic breakpoint as the legacy 900px viewport breakpoint in `BREAKPOINTS.tripDetails`.
- Keep the image gallery's grid/stack/thumbnail geometry local to the gallery.
- TripList empty-state typography and TripPagination list geometry are feature-local. Reuse shared tokens only where a genuine semantic value is established.
- About's 820px layout threshold is page-specific. The 600px rules in other modules should be compared with `BREAKPOINTS.smallPhone` before changing; CSS Modules cannot directly import TypeScript constants.
- LegalPage and NotFound already use semantic CSS variables for their shared colors. Their remaining padding, border radius and image/layout values are currently local page geometry, not evidence for global tokens.

### Additional component and route coverage

- The admin list screens reuse `ADMIN_PAGINATION_SX`; AdminUserForm and AdminUserProfileImage reuse `COLUMN_STACK_SX`. Their remaining grid/card dimensions are screen-specific and should stay local unless another screen proves the same layout contract.
- Auth forms beyond the initial three (ResendVerificationForm and ResetPasswordForm) also use the shared auth form presets. VerifyEmailForm has a different confirmation layout and should not be forced into the standalone form panel.
- Both PointLocationPicker and TripLocationPicker consume `MAP_ADDRESS_INPUT_SX`. Keep that preset map-specific; the surrounding picker and responsive control geometry differs.
- Account trip/favorites pages use shared page/heading/empty-state presets. The account, admin, auth and public route-group layouts still contain a small number of inline structural wrappers; their 2rem/30px gutters are not interchangeable without checking the intended route width and legacy rendering.
- ImageLightbox keeps its repeated control treatment local to the lightbox, while image upload field borders and radii remain upload-specific. The tracking surface is local to LiveTracker. These are not yet cross-feature patterns.
- The reviewed public pages use CSS Modules or shared centered-page presets; the remaining inline styles in About and Trips are page content/layout composition rather than duplicate theme definitions.

### First-pass source inventory and newly verified form patterns

A repository-wide GitHub code-search pass on the modernization branch identified files containing the main styling entry points. The result counts below are matching files, not counts of individual style declarations; files may appear in more than one category:

- 63 files matched the sx= entry point.
- 36 files matched the style= entry point.
- 5 files matched the className= entry point.
- 1 file matched MUI's styled() API (TripFilters.tsx).
- All 8 CSS files in the repository were fetched and inspected separately.

This is a broad source inventory, but it is not yet a completed semantic classification of every style expression. Matching files still need to be checked for shared visual meaning, one-off geometry, dynamic styles and intentional feature-specific differences before Stage 1 can be closed.

The deeper form review confirmed two related but distinct repeated field-inset patterns:

- ProfileForm and ChangePasswordForm were re-opened declaration-by-declaration. Both use the same vertical stack (`gap: 1.5`, `width: 100%`) and the exact same TextField inset (`width: calc(100% - 10px)`, `mx: 5px`). This is now a confirmed small composable account-profile field-layout candidate, not an auth-panel candidate. ProfileForm additionally owns `alignItems: stretch`, a profile heading, disabled-email rendering and its three-action row; ChangePasswordForm additionally owns `mt: 2` and its submit action. Those differences must remain caller-owned if the common field layout is extracted.
- The nested `.MuiFormControl-root` inset (`m: 0.5`, `width: calc(100% - 10px)`) is centralized as `FORM_CONTROL_INSET_SX` and reused by `POINT_FORM_PANEL_SX`, PointForm and EditTripLayout. The shared inset is extracted independently so panel padding, max width and wrapper sizing remain owned by their respective components.
- TripForm is demonstrably a different contract: its Card uses `m: 4px`, `width: 100%`, its own 620px card width, 30px desktop/16px mobile padding, 600px responsive override and distinct action group. Do not merge its form-control rule with the Point/EditTrip inset pattern.
- TripDetails and PointSection share CARD_TEXT_INSET_SX in their text content, but retain different card and image geometry. Do not merge their full layouts.
- The width: 100%; height: 100%; object-fit: cover inline image style appears in admin user cards, admin profile-image management and profile-image display. It is a candidate for a shared image-fit style only if the rendered element/container contract is confirmed to be identical; the full-screen profile image deliberately uses contain and must remain distinct.

The source inventory also reconfirmed that CSS Modules are limited to the eight files listed above. Their local grid, gallery, legal-page and responsive compositions remain distinct from shared design tokens.

### Color, typography, spacing, shape and layering audit — findings

#### Colors

- Semantic colors are centralized in `src/constants/ui/colors.ts`; most application-owned color treatments found in the reviewed components consume `UI_COLORS` or MUI semantic palette names (`primary.main`, `text.secondary`, `divider`, `action.hover`, `common.white`).
- `ProfileForm` still has a direct `rgba(0, 0, 0, 0.87)` for `WebkitTextFillColor` on the disabled email field. This is a browser-specific disabled-input rendering override, not automatically a new general-purpose text token. Validate whether it can use `text.primary` without changing disabled-field contrast before altering it.
- The remaining color literals found in `colors.ts` are the intended token definitions. Do not create additional aliases for identical values unless they represent different semantic roles.
- CSS Modules currently consume semantic CSS variables for shared colors. The legal-page-specific link/border/background variables and the About/NotFound text variables are deliberate semantic usages; the CSS variable list in `theme/index.ts` should be checked against all CSS-module references during the final audit.

#### Typography

- The application font stack is centralized in `TYPOGRAPHY.fontFamily` and used by the MUI theme. Footer consumes the same stack. The About page's `Space Mono` heading font is a page-specific visual treatment; the generated OG image uses `Arial` and `Georgia` inside its own image-rendering environment, which is separate from the browser UI theme.
- `AdminRouteNotFoundLogs` uses a monospace diagnostic block and a local `0.8rem` size; keep it feature-specific.
- `SocialObjectPlaceholder` has local `0.95rem` and `0.72rem` text sizes for its compact overlay hierarchy. These are not yet proven to be shared with other components.
- MUI typography variants should remain the primary shared type scale. Do not turn every local variant adjustment or generated-image text size into an application token.

#### Spacing and dimensions

- The 8px MUI spacing base and named `UI_SPACING` multipliers are centralized. Existing `PAGE_CONTENT_PADDING = '30px'` is intentionally not equivalent to `UI_SPACING.lg` (24px) or `UI_SPACING.xl` (32px).
- `UI_SIZES` contains established cross-component dimensions. Many fixed values in CSS Modules (gallery grid gaps, thumbnail geometry, trip-detail columns, pagination spacing) describe local composition and should remain local unless a true repeated contract is found.
- `TripDetailsView.module.css` uses a 1120px container-query threshold and a 600px viewport media query. The 1120px threshold is content-container geometry, not the legacy 900px trip-details viewport breakpoint; do not merge them.
- The `30px` point-form panel padding and the 30px global page gutter happen to match numerically but have different ownership and responsive behavior. Keep them semantically distinct.

#### Shape, shadows and layering

- The MUI surface contract centralizes the default paper background, divider border, theme radius and theme elevation through `getSurfaceStyles`. `UI_SHAPE.borderRadius` and `UI_ELEVATION` feed that contract.
- The former legacy panel surface has been removed from both known consumers. After confirming the remaining source consumers had migrated, the unused `CARD_BORDER` and `UI_SHAPE.squareRadius` compatibility tokens were removed. The circular profile-image control retains its dedicated `UI_SHADOWS.profileImageControl` shadow.
- `UI_SHADOWS.socialOverlay` is a separate overlay-specific CSS shadow. Keep it distinct from the MUI theme elevation scale unless a visual comparison proves the same elevation intent.
- `UI_Z_INDEX` represents global MUI/app layer levels. Repeated `zIndex: 1`/`2` values in ImageLightbox, ProfileImage and EngagementBar are local stacking relationships inside component surfaces; `zIndex: -1` in the background hook is also local. Do not replace these with global modal/app-bar tokens.

#### Ownership boundaries carried into implementation

- Theme component overrides currently own the shared MUI Button font family, Card and Dialog surface treatment, and TextField default variant/size. Button color/interaction variants and feature-specific layout are still owned by presets and local composition.
- The presets layer contains both visual treatments and layout fragments. This is acceptable where each preset has a clear documented responsibility, but later stages should avoid adding a second source of truth for the same property between theme overrides, tokens and presets.
- This pass reviewed the token definitions, theme overrides, preset definitions, all eight CSS files, the main direct-color and typography search results, and the identified z-index consumers. The final 63/36/5 source-inventory reconciliation and preset/token consumer review are recorded in the Stage 1 closure section below.

### Inline-style and repeated-value audit — additional findings

#### Confirmed reusable candidates

- `HomeTrips` and `WelcomeHeading` independently define the same welcome-heading treatment: 2px margin, centered alignment and the shared `headingTextStyle`. `ScrambleHeading` also hardcodes the same 2px heading margin while accepting caller style overrides. This is a real shared heading composition candidate; the scramble component's caller override and responsive behavior must remain intact.
- `HomeHero` and the public Trips page intro both combine `headingTextStyle`, centered text, `lineHeight: 1.6`, and `margin: 0 20px 24px`. Their max widths differ (850px vs 900px), so a shared base intro treatment with caller-owned max width is preferable to a single rigid preset.
- `AppImage` consumers in `AdminUsers`, `AdminUserProfileImage` and `ProfileImage` repeat the exact `width: 100%; height: 100%; object-fit: cover` style. This is a confirmed reusable image-fill style candidate. `ProfileImage`'s full-screen `height: auto; max-height: 85vh; object-fit: contain` is a different behavior and must not be folded into it.
- Auth, Admin, Account and Live Tracking route layouts contain repeated `padding: 2rem` on main content wrappers. Auth additionally centers a constrained 480px content column; Admin includes its navigation. A shared route-content padding token/preset may be appropriate, but the 2rem (32px) value must remain distinct from the existing 30px page gutter.

#### Similar values that are not automatically shared

- `gap: 1` is repeated throughout the app and maps to the existing 8px `UI_SPACING.xs` token under MUI's spacing scale. The value can be migrated to the token where it represents application spacing, but the same number in generated OG-image markup or local CSS geometry is not automatically the same design contract.
- `gap: 2` similarly maps to `UI_SPACING.md` (16px). The audit must distinguish MUI spacing values from literal CSS pixel values and non-MUI inline style properties before replacing them.
- `borderRadius: 1` in MUI `sx` resolves through the theme's 4px radius scale and already follows `UI_SHAPE.borderRadius`; local `borderRadius: '50%'` is avatar/circle geometry and remains local. CSS Module radii need separate comparison with CSS variables.
- `PointSection` uses a 25px text inset while TripCard/TripDetails use the shared 15px `CARD_TEXT_INSET_SX`. Preserve the distinction unless the design is intentionally changed.
- `CommentsSection` has its own panel/card padding and comment-author/content spacing. These are comment-feature compositions, not yet proven to match generic panels or cards.
- TripCard's 200px image frame, 105px heading block, 58px social-count area and 20px stepper spacer form one fixed-height card composition. Do not turn each dimension into a global token merely because it is repeated within that component.

#### Remaining source classification

- The inline-style search surfaced route layouts, Home/About/Trips content, Footer, TripDetails, PointSection, social controls, image components, Admin image surfaces, CommentsSection, LiveTracker and the OG image renderer. Several style props are intentionally dynamic or are passed through `AppImage`; they are not all duplicated CSS declarations.
- `renderTripOgImage.tsx` uses its own HTML/CSS rendering environment and brand-specific typography. Treat it as a separate output surface; share semantic brand tokens only where technically appropriate, not browser MUI component styles.
- CSS Modules contain local composition rules. `ImageGallery.module.css` uses a 4px image-button radius; compare it with the theme-backed `--ht-shape-border-radius` variable before migrating. Legal page's 6px table-of-contents radius and its content spacing remain page-specific.
- TypeScript tokens remain the source of truth for spacing, sizes, breakpoints, shape, shadows and z-index. CSS variables are emitted only for the semantic values consumed by the inventoried plain CSS/CSS Module rules; do not mirror every token into CSS.

### Stage 2 implementation record — Design Tokens and MUI Theme

The existing token/theme foundation has now been completed in code without changing the current blue/white identity:

- **Palette:** `UI_COLORS` now explicitly owns primary/secondary brand colors, feedback colors (error/warning/info/success), semantic text, surfaces, borders and action states. MUI `common`, `primary`, `secondary`, feedback, background, text, divider and action roles are derived from these tokens. Existing MUI secondary/status defaults are preserved.
- **Typography:** `TYPOGRAPHY` now defines the complete MUI variant scale (h1–h6, subtitle1–2, body1–2, button, caption and overline) plus shared font weights and the existing font stack. Values match MUI's existing defaults; this is centralization, not a visual redesign.
- **Breakpoints:** `MUI_BREAKPOINTS` explicitly defines the existing MUI scale (0/600/900/1200/1536). Feature-specific legacy thresholds remain separately named in `BREAKPOINTS` and are not remapped.
- **Spacing and dimensions:** `UI_SPACING`, `PAGE_CONTENT_PADDING` and `UI_SIZES` remain the shared sources. Numeric spacing values are MUI 8px multipliers, not pixel values.
- **Shape, elevation and layering:** `UI_SHAPE`, `UI_ELEVATION`, `UI_SHADOWS` and `UI_Z_INDEX` remain centralized with legacy values retained where consumers still require them.
- **CSS variables:** root variables are now limited to values with inventoried CSS/CSS Module consumers. Unused canvas/paper/divider/secondary/action-state variables were removed; values used only by MUI/TypeScript remain in their typed token/theme contracts.

**Implementation status:** Stage 2 code changes are committed. Runtime/build/type-check verification has not been performed in this environment, so the stage remains pending that verification before it is formally closed.

### Admin, maps and remaining feature-surface audit

#### Admin

- `ADMIN_PAGINATION_SX` is already shared by AdminUsers, AdminImages, AdminReports, AdminFailedLogs and AdminRouteNotFoundLogs. Keep its consumers on the existing preset.
- `COLUMN_STACK_SX` is already used by AdminUserForm and AdminUserProfileImage; AdminUserForm adds its own max width, panel padding and surface treatment around that stack.
- AdminUserForm's outer Box has since been migrated to `PANEL_SX(theme)`, matching the shared theme-owned panel surface while retaining its own width, padding and content layout.
- AdminUsers uses a 320px minimum card grid and a local 1.25 spacing for card content. AdminImages has its own thumbnail dimensions and table controls. Admin logs use diagnostic/monospace presentation. These are feature-specific layouts.
- The three AppImage profile/avatar consumers share the exact cover-fill style identified above; this remains the strongest confirmed reusable inline image style.

#### Maps and trip filters

- `MAP_ADDRESS_INPUT_SX` is correctly shared by PointLocationPicker and TripLocationPicker through AddressAutocomplete. Preserve the map-specific surface, radius, text and outline contract.
- `AddressAutocomplete` exposes caller-owned `inputSx`, `buttonSx`, `containerSx` and responsive direction. These are intentional composition extension points, not duplicate styles to hide inside the generic component.
- PointLocationPicker and TripLocationPicker share the 600px map width and map picker constants, but their control rows differ (GPS action, remove-marker action, button heights and responsive arrangements). Keep their compositions distinct.
- TripFilters is the sole MUI `styled()` consumer found. It uses `theme.shape`, `theme.spacing`, `theme.breakpoints` and `alpha(theme.palette.common.white, ...)`; it is already theme-aware. Its search control geometry and select widths remain filter-specific.
- TripDetailsView's sticky day/social header uses the global `appBar` z-index token, while its 2.5 radius and elevation 1 belong to the local sticky social surface. Do not merge this surface with generic cards without a visual comparison.

#### Forms, comments and social

- Standalone authentication forms already use shared AUTH_FORM presets; do not re-migrate them. ProfileForm and ChangePasswordForm have the separate shared nested-field pattern documented above.
- TripForm and PointForm use different panel dimensions, control spacing and responsive ordering. Preserve those distinctions; only extract independently verified field-level patterns.
- CommentsSection and RepliesSection retain comment-specific panel, reply and author/content layouts. `SOCIAL_ACTIONS_SX`, compact social badges and shared social error text are already reused; TripGroupSocialActions' compact horizontal group has different spacing and behavior.
- Social overlay colors/shadow and the sticky social bar are different semantic surfaces; keep their token roles separate.

#### Stage 1 progress boundary

- The source-level inventory still covers 63 `sx=` files, 36 `style=` files, five `className=` files, one MUI `styled()` consumer and all eight CSS files. The declaration review has now covered all 36 App Router TSX files in addition to the feature components and the CSS/token/theme/preset layers.
- Confirmed reusable candidates remain deliberately small: account-profile field inset, Point/EditTrip nested control inset, trip-action sizing, three AppImage cover-fill consumers, shared home heading/intro treatment, a route-content gutter candidate distinct from the 30px page gutter, and existing shared presets. The reviewed local compositions listed above remain local; no new global token family is justified by this pass.
- The declaration inventory and component/route reviews are reconciled into the ownership categories recorded in the Stage 1 closure below. The remaining items are implementation/migration work for later stages, not unfinished discovery. No migration should start merely because a matching value appears in multiple files.

### Trip, point, navigation and utility component audit

- `TripActions` owns two local button-size presets (`LEGACY_BUTTON_SX` and `DANGER_ACTION_BUTTON_SX`) that differ only in the semantic button color treatment. Both share 10px padding, full width, 48px minimum height and border-box sizing. `TripDetails`' BackButton supplies the exact same four sizing properties through its caller `sx`. This is a confirmed trip-action sizing candidate. If extracted, keep primary/danger/back semantic colors in `BUTTON_STYLES` and keep navigation/action behavior caller-owned; do not make the general `BackButton` globally full-width.
- `PointCard` deliberately uses a 10px text inset and a compact 300px card with its own map/actions arrangement. It must not be merged with the 15px TripCard/TripDetails text inset or the 25px PointSection note inset.
- `TripDaysNav` has its own 3px pagination-item margin and 10px top offset. These belong to the day-navigation control, not the general pagination preset used by Admin lists.
- `ExpandableText` uses a dynamic three-line clamp and its own show-more interaction. Its clamp styles are component behavior, not a generic typography preset.
- `PointActions` and `SocialConfigStatus` use compact action/control spacing. `SOCIAL_ACTIONS_SX` remains the shared alignment for like/favorite/report groups; the point-action and status arrangements have distinct semantics.
- `GoogleMapView` uses caller-provided `maxWidth` and `height` to support different map contexts. Map sizing remains a component API contract plus map-specific constants, not a generic UI card size.
- `ImageUploadField`, `ImageGallery`, `ImageLightbox` and `DayImagesGallery` use image-specific thumbnail, upload, grid and full-screen geometry. Their `object-fit`, aspect ratios, control positions and responsive grids should stay local unless an exact shared image behavior is established.
- `LiveTracker` owns a tracking-specific surface and status layout. Do not replace it with the generic Card surface without comparing its current border/radius/shadow treatment.
- AdminFailedLogs and AdminReports reuse the existing admin pagination preset. NotificationProvider and Captcha have isolated control sizing/positioning; no cross-feature style pattern was established in this pass.
- `app/error.tsx` uses a standalone error-boundary layout with 32px padding and 16px gap. It is not the same as the 30px page gutter or the account/admin route content wrapper contract.


### Declaration-level review — navigation, cards, comments, images and tracking

The next targeted source pass re-opened the style declarations in `AdminNavigation`, `AdminUsers`, `CommentsSection`, `RepliesSection`, `ExpandableText`, `ScrambleHeading`, `WelcomeHeading`, `HomeHero`, `HomeTrips`, `ImageLightbox`, `Footer`, `Header`, `PointCard`, `LiveTracker`, `PointSection`, `TripCard` and `TripDaysNav`.

- `Header` uses one local `NAV_BUTTON_SX` for its desktop navigation links and logout action, plus a shared icon-size token for the menu button. The navigation item spacing is currently local to this component; the mobile drawer has a different vertical layout. `AdminNavigation` has one independent wrapping row. No cross-feature navigation preset is justified by these declarations.
- `AdminUsers` keeps its 320px-minimum responsive card grid, 1.25 card-content gap, 88px avatar and action-row composition. Its image uses the already identified shared AppImage cover-fill behavior; the surrounding admin card/grid dimensions are feature-specific.
- `TripCard` has named local constants for its own heading block, image frame, social-count region, stepper spacer, card content, pagination and description clamp. These constants make the component internally readable; they are not global tokens merely because they are named. Its 352px card, 300×200 image and fixed-height composition remain TripCard-owned. Existing `CARD_TEXT_INSET_SX` and `BUTTON_STYLES.primaryWide` are the genuine shared pieces.
- `PointCard` uses its own 10px text inset, point reorder control visibility and compact card/action composition. Do not merge that inset with TripCard/TripDetails' 15px inset or PointSection's distinct content-note spacing.
- `PointSection` uses shared trip text inset for the point title and a local negative-margin image bleed to align the gallery with CardContent. The image bleed and note treatment are composition-specific, not generic card padding.
- `CommentsSection` and `RepliesSection` use feature-owned comment panel/card, author, reply, edit-form and nested reply spacing. Their shared `SOCIAL_ACTIONS_SX` use is appropriate; the comment-specific surfaces and reply indentation are not generic panels/forms.
- `ImageLightbox` keeps absolute-positioned close/previous/next controls and contained full-screen image sizing within the lightbox. These styles are one cohesive overlay interaction, not a cross-feature button preset.
- `LiveTracker` repeats its own tracking surface for the map and status/stat panels. This is a tracking-specific surface contract and should not be replaced with generic Card/Paper styling without a visual comparison.
- `TripDaysNav` pagination item margin/color and its 10px top offset are day-navigation-specific. They must remain separate from `ADMIN_PAGINATION_SX`.
- `ExpandableText`'s conditional line clamp is interaction behavior. `ScrambleHeading` intentionally merges caller-supplied style after its shared heading style, so any future heading preset must preserve caller override precedence.
- `HomeHero`/home headings continue to match the previously identified heading/intro candidates. `Footer` consumes the shared typography and color tokens; no additional typography token is needed for its copyright line.
- No new cross-feature preset was justified by this pass beyond the already recorded account-profile fields, Point/EditTrip field inset, trip-action sizing, image cover-fill and heading/intro candidates.


### Declaration-level review — Auth, Admin, Maps, uploads and social controls

The follow-up pass checked the remaining component-level styling entry points in the Admin lists/logs, Auth forms, image upload/gallery, Maps, Point pages/actions, and Social controls.

- The standalone Login, Register, Forgot Password, Resend Verification and Reset Password forms consistently consume `AUTH_FORM_SX`, `AUTH_FORM_TITLE_SX`, and the appropriate shared action/back presets. Keep them on those presets; the registration terms checkbox state treatment and individual form content remain local. `GuestOnly`, `RequireAuth`, `RequireRole`, `RequireTripOwner` and moderator guards have no styling declarations to migrate.
- `AdminFailedLogs`, `AdminReports`, `AdminRouteNotFoundLogs` and the main AdminImages table pagination consume `ADMIN_PAGINATION_SX`. AdminImages also has a local `IMAGE_PAGINATION_ROW_SX` used by three other image-inventory sections; it shares flex/gap/alignment but intentionally has no preset top margin. Do not replace it with the full pagination preset without preserving that margin distinction.
- AdminImages' thumbnail button/image dimensions, preview dialog sizing and table URL wrapping are image-management-specific. AdminRouteNotFoundLogs' preformatted diagnostic fields and compact expansion rows remain diagnostic UI, not generic text/card presets.
- `AddressAutocomplete` is the map-specific composition boundary: it accepts caller-owned `inputSx`, `buttonSx` and `containerSx`, while PointLocationPicker and TripLocationPicker provide the shared map address input preset. Preserve caller overrides and map-specific responsive arrangements.
- PointLocationPicker's 40px control row and TripLocationPicker's 56px search/clear controls are different interaction layouts. Do not force them into one universal control-height token. GoogleMapView's caller-supplied `maxWidth` and `height` remain its component API.
- ImageGallery combines CSS Module grid/thumbnail composition with a minimal focus-visible MUI outline; ImageUploadField owns its upload queue, preview rows and file-specific dimensions. EditPointPage's image thumbnail/delete overlay and placeholder sizing are also page-local.
- `AppImage` forwards caller-provided className/style to Next Image or its fallback; it is not itself an independent style system. The already documented three profile/avatar consumers share the cover-fill contract.
- PointActions' compact gap and SocialConfigStatus placement differ from TripGroupSocialActions' horizontal group. Existing social badge, action and error-text presets are the actual shared pieces; report tooltip wrappers, animation styles and feature-level action spacing remain local.
- `CustomFileUploadButton` has a single 30ch wrapper and no repeated cross-feature contract. PasswordRequirements' checklist spacing and icon treatment are component-specific.
- No additional global preset was justified by this pass. Existing map, auth, admin pagination and social presets have the expected consumers; keep local upload/gallery/diagnostic and responsive composition in their owning features.


### Declaration-level review — App Router pages and route composition

All 36 `app/**/*.tsx` files were fetched and checked for styling entry points. The route-level findings are:

- Account, Admin and Auth layouts repeat a 32px (`2rem`) main-content gutter. Auth additionally owns a centered 480px content column; Admin composes its navigation inside the content area; Account remains a simple content wrapper. Keep the common gutter candidate distinct from `PAGE_CONTENT_PADDING = 30px`, and preserve each route's composition.
- Public layout only provides the flex-growing page wrapper; individual public pages own their main content. Home and public Trips use `CENTERED_PAGE_MAIN_STYLE`; public Trip Details uses the same centered page shell before rendering its interactive detail view.
- Account Favorites and My Trips already consume the shared account page, content, heading and empty-state presets. Do not recreate or re-migrate those styles at route level.
- The account Profile page now composes its form inside `PANEL_SX(theme)`, sharing the same theme-owned surface contract as Cards and Dialog paper.
- Live Tracking has a 32px route content gutter but a tracking-specific page body; do not merge it with the 30px public page gutter or generic form panel.
- `app/error.tsx` uses a standalone error-boundary stack with MUI `p: 4` and `gap: 2` (32px/16px under the current theme spacing scale). It is not a general page-shell preset.
- About uses a local shared image-style object for its editorial images and a CSS Module for page composition. Privacy Policy uses its own legal-page CSS Module. Their local content/layout rules remain page-owned.
- Auth/Admin route page files are thin route adapters without additional styling; the standalone form presets are owned by their feature components. The Open Graph/Twitter route image files do not introduce browser UI styling.
- The route-level review found no reason to add a second global page-layout system. Preserve the existing centered-page and account presets, and treat the route gutters as a later, explicit ownership decision.

### Theme completeness and cross-system consistency findings

- `themePalette` explicitly maps primary, background, text, divider and action roles, but does not yet define the full MUI semantic palette (`secondary`, `error`, `warning`, `info`, `success`, their contrast text, and related action states). Components using MUI semantic colors such as `error` currently rely on MUI's built-in defaults. Stage 2 must decide and explicitly own the semantic palette roles that the application actually uses; do not blindly copy every MUI default into custom tokens.
- `themeTypography` currently defines only the application font family and Button typography. Heading/body/caption variant sizes, weights and line heights still inherit MUI's defaults unless locally overridden. This is an incomplete typography token contract for a fully brand-switchable design system and must be addressed in Stage 2.
- `themeShape` centralizes the MUI default 4px radius. Other component radii are either theme multipliers or local geometry; do not flatten circular avatars, map input radius 5px, sticky-social radius 10px and legal-page 6px into one global radius.
- `UI_SPACING.unit = 8` is the MUI spacing base and is passed to `createTheme`; named spacing values are multipliers. However, many components still write raw MUI multipliers (`gap: 1`, `p: 2`, etc.) rather than `UI_SPACING` names. These are migration candidates when they represent shared design spacing, not when they are feature-specific or part of a third-party/generated rendering context.
- Application `BREAKPOINTS` are exact legacy pixel thresholds and are not configured as MUI `theme.breakpoints`. TripFilters uses MUI's default `theme.breakpoints.up('sm')` while other app components use the explicit `BREAKPOINTS` helpers. CSS Modules also contain local media/container thresholds. Stage 2/4 must explicitly decide whether to retain two intentional breakpoint systems or map the MUI scale to the app scale; avoid changing any thresholds until all affected layouts are compared.
- `UI_Z_INDEX` is passed directly to the theme and matches the current MUI global layer scale. App-owned local z-index values remain separate as documented above.
- `UI_ELEVATION` resolves through the MUI shadow array, while legacy CSS shadows remain in `UI_SHADOWS`. This split is intentional during migration; the final system should keep semantic elevation levels distinct from special-purpose overlay shadows.
- `CssBaseline` is mounted once inside the single root `ThemeProvider` in `app/providers.tsx`. The CSS variables emitted by the theme are therefore runtime-owned and available to the app's global CSS/CSS Modules. The currently emitted variables cover the CSS consumers identified in this audit, but do not yet expose every token family; add only variables required by real CSS consumers.

### Remaining migration candidates

- `ProfileForm` and `ChangePasswordForm` both consume `ACCOUNT_FORM_FIELDS_SX`. The password form keeps its `mt: 2` as local composition; heading/content, action row and profile-only disabled field remain separate.
- The 2rem route-content gutter is now centralized as `ROUTE_CONTENT_PADDING` and used by Account, Admin, Auth and Live Tracking route shells. It remains distinct from the 30px public page gutter and 30px Point form padding.
- The declaration-level review has reconciled the 63 `sx=`, 36 `style=` and five `className=` source-file inventories, the single MUI `styled()` consumer, all eight CSS files and all 36 App Router TSX files. Ownership is classified as shared token, reusable preset, theme-owned MUI default, feature-local composition, dynamic component API/pass-through, or legacy pending visual verification.
- The consumer review covers `BUTTON_STYLES`, panel/surface, layout/form/map/social/typography presets, UI tokens, MUI theme overrides and CSS variables. Legacy constants with documented consumers remain in place; no destructive cleanup is part of Stage 1.
- Trip-action sizing, Point/EditTrip nested field inset and AppImage cover-fill are now represented by shared presets and consumed by their reviewed call sites. Preserve the documented exceptions (BackButton semantic treatment, profile fullscreen `contain`, and feature-owned layout geometry).

### Stage 1 closure — final ownership reconciliation

Stage 1 is complete as an audit and architecture-definition phase. The source inventories and targeted declaration reviews have been reconciled; the remaining items below are implementation candidates for Stages 2–5, not reasons to reopen discovery.

#### Ownership rules established

| Style concern | Owner | Rule |
|---|---|---|
| Brand and semantic colors | `src/constants/ui/colors.ts` | Components consume semantic roles; preserve the current blue/white values until the separate brand redesign. |
| Shared typeface and typography scales | `src/constants/ui/typography.ts` and `src/theme/typography.ts` | Shared typography belongs to tokens/theme; page-specific editorial typography remains local when intentional. |
| Shared spacing and dimensions | `src/constants/ui/spacing.ts`, `sizes.ts`, `breakpoints.ts` | Promote only established cross-feature values; preserve legacy thresholds and distinguish 30px, 32px and component-specific gutters. |
| Shape, elevation and layering | `shape.ts`, `shadows.ts`, `z-index.ts`, `src/theme/` | MUI surface defaults are theme-owned; special overlays and feature-specific geometry remain distinct. |
| Repeated composed UI patterns | `src/styles/presets/` | Presets own repeated combinations, not every isolated style object or feature-specific composition. |
| MUI component defaults | `src/theme/components/` | Theme owns shared MUI component defaults/surfaces; caller `sx` owns feature layout and semantic variants. |
| Local layout and responsive composition | Component styles and CSS Modules | Keep grids, image geometry, sticky layouts, map dimensions, feature-specific breakpoints and interaction positioning local. |
| Dynamic sizing and pass-through props | Component API | Caller-provided values such as map `maxWidth`/`height` and forwarded image `className`/`style` are APIs, not duplicate tokens. |
| Legacy styles awaiting visual comparison | Existing legacy constants/presets | Keep until all consumers are migrated and visual parity is verified. |

#### Confirmed shared patterns and remaining consumers

- Auth standalone forms share the auth presets. Both profile and change-password forms use `ACCOUNT_FORM_FIELDS_SX`.
- Point create/edit page wrappers use `POINT_FORM_PANEL_SX`; the inner `PointForm` field-control inset is a matching extraction candidate, but its form gap, width constraints and responsive action layout must remain independent.
- Admin pagination, account trips pages, map address inputs, social action groups, trip-card text inset and shared typography are already represented by presets.
- Trip-action sizing, profile/trip-card image cover-fit, shared home heading/intro treatment and the 32px route-content gutter have been migrated to shared presets/tokens. Their semantic variants and the existing 30px page gutter remain distinct.
- The legacy panel preset and unused `CARD_BORDER`/`UI_SHAPE.squareRadius` tokens are removed. The circular profile-image control retains a separately named `UI_SHADOWS.profileImageControl` token because it is not a Card or panel surface.
- CSS Modules are limited to the eight inventoried files. They own page/component geometry; the About page's Space Mono editorial headings, legal-page typography/spacing, trip-detail container query, image-gallery geometry and NotFound composition remain intentionally local.
- `app/globals.css` remains minimal. Its `.ht-button` rules are required by server-rendered trip markup and must not be removed while those consumers exist.

#### CSS variable reconciliation

The emitted variables used by current plain CSS/CSS Module consumers are the button variables, primary/primary-hover, inverse and primary text, page surface, contrast action background, danger hover, legal border/link/back surface, and decorative heading shadow. The theme currently also emits canvas/paper/divider/secondary/action-state variables that have no consumer in the eight CSS files; Stage 2 may remove or retain them only after checking for non-CSS consumers. Do not add a CSS variable for every token automatically.

#### Known boundary decisions

- The app's exact legacy `BREAKPOINTS` and MUI's default breakpoint scale are currently separate. Stage 2 must decide ownership/mapping without changing observed thresholds.
- `UI_SPACING` values are MUI spacing multipliers based on an 8px unit, not pixel values.
- Semantic MUI palette roles beyond primary/background/text/divider/action are not fully token-owned yet; this is a Stage 2 implementation gap, not an audit discovery gap.
- Typography currently centralizes the font family and Button settings; heading/body variant scales remain a Stage 2 implementation gap.
- Runtime CSS variables are generated through the single root ThemeProvider/CssBaseline. Only variables with actual CSS consumers should be part of the final contract.

**Exit criterion met:** every inventoried style surface has an explicit ownership rule or a named migration/visual-verification exception. No current visual values were changed during this audit.

The next safe migration is to continue from the verified shared-pattern inventory above. Do not remove legacy styles, change visual tokens or redesign the blue/white identity as part of this migration.
## 11.4 Reusable UI patterns

Extract shared components or patterns when multiple call sites have the same semantics and behavior. Prefer small, composable building blocks for repeated form fields/actions, cards and content surfaces, dialogs and confirmation flows, icon buttons/action groups, and loading/empty/error states.

Do not merge components solely because their markup looks similar when their domain behavior or accessibility semantics differ. Avoid universal components with many feature-specific flags.

## 11.5 Icon registry

The current central registry is `src/constants/icons.ts`, imported through `@/constants/icons`.

Components must not import icons directly from `@mui/icons-material/*`. Add new icon exports to the registry using stable semantic names and keep icon-library implementation details inside that file.

The directory-style path `src/constants/icons/index.ts` is not the current repository structure. Do not move the registry without updating all consumers and the agent instructions in the same change.


## Stage 3 implementation progress — shared component defaults

The Stage 2 local validation commands (`npm run check` and `npm run build`) are intentionally deferred to Stage 6 at the user's direction. Stage 2 implementation is present, but is not marked as locally verified.

### Implemented in the current Stage 3 pass

- `MuiCard` explicitly defaults to elevation 1 and obtains its background, border, radius and shadow from the shared `getSurfaceStyles(theme)` contract. Individual cards should use `sx` for dimensions/content layout, not redefine the shared surface appearance.
- `MuiButton` typography and border radius are now explicitly derived from `theme.typography.button` and `theme.shape.borderRadius`; semantic colors and states remain palette/variant-owned.
- `ChangePasswordForm` now consumes `ACCOUNT_FORM_FIELDS_SX`, matching `ProfileForm` and removing the duplicated field-stack declarations while preserving its local top margin.

### Still required before Stage 3 closure

- The known profile, trip-edit and admin-user form panel consumers have been migrated to `PANEL_SX(theme)`. The obsolete legacy border/square-radius tokens have been removed after consumer reconciliation; the circular profile-image control keeps its dedicated special-purpose shadow.
- Review repeated presets and component overrides for duplicated visual values, while keeping feature-specific geometry and responsive layout local.
- Check other MUI surface types and variants only where their semantics require the shared surface contract; do not apply card styling indiscriminately to every `Paper`.
- Stage 3 is in progress. Build/typecheck/lint and final visual/regression checks remain deferred to Stage 6.


### Additional Stage 3 migration — shared panel surface

- The profile page and trip-edit form previously spread `LEGACY_PANEL_SX`, which carried its own background, black shadow, border and square radius. Both now consume `PANEL_SX(theme)` and therefore share the same theme-owned surface contract as MUI Cards and Dialog paper.
- The obsolete `LEGACY_PANEL_SX` preset and its local token imports have been removed. The profile form and trip-edit form retain their own padding, spacing, width and responsive layout; only the visual surface is shared.
- `UI_SHADOWS.profileImageControl` is a special-purpose circular image-control shadow, not a Card/panel surface token.


### Additional Stage 3 migration — shared form-control inset

- Extracted `FORM_CONTROL_INSET_SX` into `src/styles/presets/forms.ts`.
- Reused it in `POINT_FORM_PANEL_SX`, `PointForm` and `EditTripLayout`, removing three copies of the same nested control spacing/width rule without coupling the forms' outer layout.
- Stage 3 remains in progress; component/preset coverage and remaining legacy values still need systematic review before closure.


### Additional Stage 3 migration — admin form surface

- `AdminUserForm` previously defined its own border, divider color, radius, paper background and elevation. It now composes `PANEL_SX(theme)`, matching the profile panel, trip-edit panel, authentication form surfaces, MUI Cards and Dialog paper.
- Its content stack, width, padding and centering remain local layout concerns. The shared surface contract owns only the visual shell.


### Additional Stage 3 review — Card surface consistency

- Reviewed the current branch implementations of `TripCard`, `PointSection`, `PointCard`, `TripMapSection`, `TripForm`, point create/edit wrappers, `VerifyEmailForm`, account/auth forms, and the shared admin/list components.
- MUI Card consumers now rely on the theme surface contract; their local `sx` is limited to content layout, spacing, sizing and responsive composition. No component-level background, border, radius or shadow overrides were found in the reviewed Card consumers.
- `Dialog` paper uses the same `getSurfaceStyles(theme)` helper. Standalone auth/profile/trip-edit/admin panels use `PANEL_SX(theme)` where a non-Card surface is appropriate.
- The legacy `CARD_BORDER` export is retained as a compatibility token for any remaining legacy consumer, but its comments now explicitly prohibit using it for new Card/panel surfaces. It is not removed until a complete current-branch consumer check and final cleanup.
- No global `MuiPaper` override was added: Paper can represent menus, popovers and other semantic surfaces, so applying the Card contract indiscriminately would create unintended coupling.

Stage 3 remains in progress. The next work is the remaining repeated presets and feature-specific surface exceptions, followed by a complete migration pass in Stage 5. Validation remains deferred to Stage 6.


## Stage 3 closure — MUI components and reusable presets

Stage 3 implementation is complete. The MUI component overrides and all files under `src/styles/presets/` were reviewed. Shared Card and Dialog surfaces use the common theme contract; Button typography/shape and TextField defaults are theme-owned; repeated form, panel, card-content, map-control, social, layout and typography patterns remain in the appropriate presets. Feature-specific geometry and specialized overlays remain local by design. No global Paper override was introduced because Paper is used for multiple semantic roles.

The remaining validation and visual/regression checks are intentionally part of Stage 6. The older “Still required before Stage 3 closure” progress list above is superseded by this closure record.

## Stage 4 implementation progress — Global CSS and CSS Modules

- Kept `app/globals.css` limited to document reset, body font smoothing, app-shell layout, code font and the small server-rendered `.ht-button` rules. These server-rendered button rules remain necessary and now consume theme-generated CSS variables.
- Added only CSS variables with confirmed stylesheet consumers: the MUI medium/large spacing values and the existing page-content gutter token. The page gutter variable is derived from `PAGE_CONTENT_PADDING`, not duplicated as a new literal.
- Migrated Trip Details responsive layout gaps to the shared spacing variables; migrated the About page desktop gutter to the shared page-padding token; migrated Image Gallery and Legal page control radii to the shared theme shape variable.
- CSS Modules continue to own local geometry, responsive composition, editorial typography and specialized component styling. No second token store was introduced.
- Stage 4 remains in progress. The remaining CSS Module values need a focused pass to distinguish genuine shared design tokens from intentionally local geometry before Stage 4 closure. Validation remains deferred to Stage 6.


## Stage 4 closure — Global CSS and CSS Modules

Stage 4 implementation is complete. `app/globals.css` remains a minimal global layer for document reset, app-shell layout, body rendering defaults, code font and the server-rendered `.ht-button` contract. Shared design values used by plain CSS are supplied through theme-generated CSS variables; no parallel CSS token file was introduced.

The audited CSS Modules retain feature-owned geometry, responsive breakpoints, image layout, legal-document presentation and editorial typography. Shared spacing, shape and page-gutter values were moved to theme variables only where the stylesheets consume them. The Footer presentation has also been moved from React inline styles into a dedicated `Footer.module.css`, using existing theme color variables; its iOS landscape behavior and copyright output were left unchanged.

The new Footer module increases the CSS Module count from the original Stage 1 inventory; this is an intentional migration, not an unexplained styling surface. Stage 4 is closed. Final validation remains deferred to Stage 6.

## Stage 5 implementation progress — systematic component migration

- Began the component migration with the shared layout layer. Footer colors now consume the theme CSS variables through its CSS Module, and presentation is no longer embedded in the JSX style prop.
- Header navigation uses the existing MUI theme defaults and shared button behavior; its navigation-specific spacing and drawer geometry remain component-owned.
- Map location pickers already consume the shared map-address and button presets; no duplicate map-input visual rules were introduced during this pass.
- Stage 5 began with a feature-by-feature pass through account/auth, trips/points/maps, images/social/comments and admin/public pages. The completed migrations and the explicit feature-owned exceptions are recorded below. Preserve behavior and responsive geometry; only shared visual ownership is centralized.


### Additional Stage 5 migration — auth/profile and layout styling

- Migrated Footer presentation from a React inline style object to `Footer.module.css`. Its background/text colors use the existing theme-generated CSS variables, while the legacy iOS landscape scroll behavior and content remain unchanged.
- Replaced the disabled profile-email input's hardcoded black text-fill value with the semantic `UI_COLORS.text.primary` token. The disabled cursor and label treatment remain local to that field.
- Confirmed that ProfileForm and ChangePasswordForm already share `ACCOUNT_FORM_FIELDS_SX`, standalone auth forms use `AUTH_FORM_SX`, and the map location pickers consume `MAP_ADDRESS_INPUT_SX` plus shared button presets.
- This was an early targeted migration in Stage 5; later passes below complete the remaining shared-pattern candidates. No functional behavior or API contract was changed.


### Additional Stage 5 migration — social overlay preset

- Extracted the image/map social-control overlay shell into `SOCIAL_OVERLAY_SX` in `src/styles/presets/social.ts`. The preset owns its positioning, translucent surface, border, radius, shadow, blur and hover treatment.
- `EngagementBar` now composes that shared preset with only its size-dependent icon padding and compact badge metrics. Social behavior, event handling and inline presentation are unchanged.
- The circular ProfileImage control remains a specialized circular control, not a Card surface; its unique geometry and overlay behavior are intentionally not forced into the shared Card contract.


### Additional Stage 5 migration — trip details social surface

- Extracted the sticky social-action container beneath TripDaysNav into `STICKY_SOCIAL_SX` in `src/styles/presets/social.ts`. The preset owns its translucent background, divider border, radius, elevation and backdrop blur, plus its shared inline placement.
- `TripDetailsView` now consumes the preset rather than declaring those visual rules inline. Sticky header bleed/width geometry remains local to the page layout, and social action behavior is unchanged.
- Reviewed TripForm, EditTripLayout, PointForm, PointCard and PointSection. TripForm and PointSection use MUI Card surfaces; local styles are layout/content-only. EditTripLayout and PointForm use shared panel/form presets. PointCard uses the shared button presets and MUI Card defaults. No further safe shared-surface extraction was needed in these files.


### Additional Stage 5 migration — admin data-table surfaces

- Added `ADMIN_TABLE_CONTAINER_SX` to the shared layout presets. It centralizes the common full-width table container and theme-based corner radius without owning table columns, overflow-specific content behavior or pagination layout.
- Applied the preset and the outlined Paper variant consistently to AdminReports, AdminFailedLogs, AdminRouteNotFoundLogs and the AdminImages missing-thumbnail table. This removes the prior mismatch where only the image inventory table explicitly used an outlined Paper surface.
- Existing table contents, pagination, selection and mutation behavior are unchanged. The map and image components reviewed in this pass already use semantic map/image tokens or feature-owned geometry; no forced abstraction was added there.


### Additional Stage 5 migration — trip action buttons

- Extracted the repeated full-width trip navigation/management button dimensions and primary/danger hover treatments into the semantic `BUTTON_STYLES.tripAction` and `BUTTON_STYLES.tripActionDanger` presets.
- `TripActions` now consumes those shared presets for add/edit/delete actions instead of maintaining two component-local style objects.
- Existing 10px padding, full-width sizing, 48px minimum height, box sizing, primary/danger variants, labels, routing, ownership checks and mutation behavior are unchanged.
- This extraction is intentionally limited to the repeated trip-action pattern; the PointForm buttons retain their distinct 32ch/mobile-stacked layout.


### Additional Stage 5 refinement — shared trip action dimensions

- Split the common full-width action dimensions into `TRIP_ACTION_BUTTON_LAYOUT_SX`, then composed the primary and destructive trip-action presets from that single layout contract.
- The Trip Details Back action now consumes the same layout preset, aligning its 10px padding, full-width sizing, 48px minimum height and box sizing with the adjacent Add/Edit/Delete actions while retaining the BackButton's own secondary visual treatment.
- Navigation targets, action labels, ownership checks and mutation behavior remain unchanged.


### Additional Stage 5 migration — trip-card image rendering

- Extended the existing image-preset contract with an optional `objectFit` default. `AppImage` applies the preset default while preserving explicit caller `style` values as higher-priority overrides.
- The shared `tripCard` image preset now owns the `cover` fit used by TripCard. The component keeps its own frame dimensions and responsive layout; it no longer duplicates the image-fit rule.
- Existing thumbnail fallback, loading priority, dimensions, image alt text and interaction behavior remain unchanged. The preset's responsive `sizes` hint is now also used by TripCard.


### Additional Stage 5 migration — shared profile-image cover rendering

- The `profile` image preset now owns the shared `objectFit: cover` default.
- AdminUsers, AdminUserProfileImage and ProfileImage now consume that preset instead of repeating the same cover-fit style inline. Their own rendered dimensions, avatar/circular clipping, click behavior and loading/fallback behavior remain caller-owned.
- Explicit AppImage `style` values continue to override preset defaults, so the full-screen profile image retains its distinct `contain` behavior and is not forced into the thumbnail preset.


### Additional Stage 5 migration — shared home/public-trips typography

- Added `HOME_HEADING_STYLE` and `HOME_INTRO_STYLE` to the shared typography presets. They own the repeated heading margin/alignment and the centered intro paragraph treatment (margin, alignment, shared heading typography and line-height).
- WelcomeHeading, ScrambleHeading and HomeTrips now use the shared heading preset. ScrambleHeading still applies caller-provided styles last, preserving its public override contract.
- HomeHero and the public Trips page now use the shared intro preset while retaining their distinct 850px and 900px content max-widths.
- Scramble timing, responsive heading split, touch/hover triggers, copy and page layout remain unchanged.


### Additional Stage 5 migration — authenticated and tracking route gutters

- Added the semantic `ROUTE_CONTENT_PADDING` token (`2rem`) to the shared UI spacing constants. It is intentionally distinct from the existing `PAGE_CONTENT_PADDING` value (`30px`).
- Account, Admin, Auth and Live Tracking route shells now consume the shared 32px gutter token rather than repeating the literal.
- Auth's centered 480px content column, Admin navigation placement, route flex behavior and Live Tracking's feature-specific body remain unchanged. The standalone error boundary and public page gutter were intentionally not folded into this token.


## Stage 5 status correction — migration reopened by mandatory styling contract

The Stage 5 closure recorded above is a historical status from the earlier, narrower audit. It is **superseded** by the mandatory styling ownership rules below and must not be treated as the current completion status. A follow-up source audit found remaining feature-local visual declarations and incomplete semantic contracts (including image overrides, day-number controls, admin actions and PointCard text spacing). Stage 5 is therefore **open** until those consumers are migrated and a complete current-branch source audit confirms the exit criteria. Stage 6 remains pending; build, tests, lint and CI are intentionally not run until explicitly authorized.

### Follow-up migration entries

- Centralized `editorPointThumb.objectFit = cover` in `IMAGE_PRESETS` and removed the call-site `style={{ objectFit: 'cover' }}` from `EditPointPage`.
- Added semantic day increment/decrement presets and a shared day-number button-group layout preset; `TripForm` now consumes them instead of local button interaction/dimension styles.
- Added a shared day-number field preset and removed its local `!important` width and inline input text alignment.
- Added a named Save preset and text-danger preset; `AdminUserForm` now consumes them for Save/Delete.
- Added the explicit `pointCardTextInset` token and named PointCard text/action presets; `PointCard` no longer declares its local 10px inset or repeated action margins.

- Added named `galleryGrid`, `lightbox` and `profileLightbox` image presets; ImageGallery and ImageLightbox now select those presets instead of passing local `objectFit` styles.
- Migrated profile avatars and TripCard image frames to the shared fill-based image presets, with frame sizing owned by the surrounding layout.
- Removed the arbitrary `style` prop from `AppImage`; image presentation now comes only from its named preset. A current-branch search of AppImage consumers found no remaining caller-side style overrides.

- Removed the unrestricted `AppImage.style` caller API after migrating all indexed AppImage consumers to named presets; profile avatar, profile lightbox, trip card, gallery grid and image lightbox rendering now use preset-owned fit/sizing behavior.
- Added central tokens for the About page mobile gutter and legal table-of-contents radius, exposed as theme CSS variables, and migrated the corresponding CSS Modules.

These are partial migrations, not evidence that all styling is centralized. Remaining known work includes removing arbitrary `AppImage.style` overrides after all consumers have named presets, tightening `BackButton` so callers cannot override its visual contract, auditing all semantic button roles and remaining local `sx`/CSS declarations, and confirming legacy selectors are truly unused.

## Stage 5 closure — systematic component migration

Stage 5 is complete for the shared styling patterns identified by the Stage 1 inventory and subsequent component review. The following contracts now have centralized ownership and migrated consumers:

- **Theme surfaces:** MUI Card and Dialog surfaces use the shared theme contract; standalone profile, trip-edit, auth and admin-user panels use `PANEL_SX(theme)`. Admin data-table containers share `ADMIN_TABLE_CONTAINER_SX` without forcing table-specific content/overflow behavior into the preset.
- **Buttons and forms:** shared button semantics remain in `BUTTON_STYLES`; trip action sizing is shared through `TRIP_ACTION_BUTTON_LAYOUT_SX`. Profile/change-password fields, Point/EditTrip nested controls, auth form shells and map address controls use their existing shared presets.
- **Images:** trip-card and profile-image cover-fit defaults are owned by `IMAGE_PRESETS` and applied by `AppImage`. Explicit caller styles still override defaults; full-screen profile/lightbox images retain `contain` where required.
- **Social and comments:** image/map overlay and sticky trip social surfaces use dedicated social presets. Comment cards use the shared MUI Card surface; reply indentation, comment composition and action behavior remain feature-owned.
- **Typography and page layout:** Home/Trips heading and intro composition use shared typography presets while page-specific max widths remain local. Account, Admin, Auth and Live Tracking route shells use `ROUTE_CONTENT_PADDING`, distinct from the 30px public page gutter.
- **Global CSS and CSS Modules:** global styles remain minimal; shared stylesheet values are supplied by theme-generated variables. CSS Modules retain page-specific geometry, editorial typography, image grids, legal-document layout and responsive composition.
- **Legacy cleanup:** after checking the known current-branch consumers had migrated, removed the unused `CARD_BORDER` export/file and `UI_SHAPE.squareRadius`. Renamed the remaining circular profile-image shadow to `UI_SHADOWS.profileImageControl` so it is not mistaken for a Card surface shadow.

No API contracts, data flow, validation rules, social behavior, routing, image upload behavior or business logic were changed in this stage. Feature-specific geometry and semantic exceptions were intentionally kept local rather than abstracted solely because values look similar.

**Stage 5 exit criterion met:** all shared candidates identified in the architecture inventory have been migrated or explicitly retained as feature-owned exceptions. **Stage 6 remains pending:** run the deferred local TypeScript/build/lint checks and perform final visual/regression review. Those checks have not been run in this pass, consistent with the earlier instruction to defer them.


## Design System — mandatory styling ownership rules

These rules apply to all new code and every component touched during the styling migration.

### Single source of truth

1. **Tokens own raw design values:** colors, typography, spacing scales, radii, shadows, breakpoints, sizes and z-index values belong in `src/constants/ui/` (or the matching domain-specific token registry, such as image presets).
2. **Theme owns framework defaults:** MUI palette, component defaults, variants and interaction states (hover, focus-visible, active, disabled) belong in `src/theme/`.
3. **Semantic presets own reusable visual roles:** repeated patterns such as Back, Edit, Delete, day increment/decrement, primary/secondary actions, cards, panels and form layouts belong in `src/styles/presets/`.
4. **Shared components own application-wide contracts:** use a shared component when a role needs enforced props/behavior, not just a copied style object.
5. **Feature components compose; they do not design:** feature components should select a semantic component/preset and provide data/handlers. They must not define local visual values.

### Button consistency contract

Button styling is centralized by **semantic role**, not forced into one appearance for every button.

- Every Back button uses the same Back contract.
- Every Edit button uses the same Edit contract.
- Every Delete button uses the same Delete contract.
- Every day increment (+) button uses the same increment contract.
- Every day decrement (−) button uses the same decrement contract.
- The contracts may intentionally differ from one another in color or emphasis, but each role must have one owner for background, text color, border, radius, dimensions, typography, hover, focus-visible, active and disabled states.
- A component may not override these properties locally. If a genuine exception is required, add a named semantic variant to the shared button system and document why it exists.
- MUI Button theme defaults must provide a predictable baseline; semantic variants/presets define role-specific differences. Do not rely on accidental MUI defaults in one feature and hand-written hover styles in another.

### No component-local styling values

The following are not allowed inside feature/component render code:

- inline style objects containing design values;
- inline `sx={{ ... }}` objects or locally declared sx constants;
- ad-hoc CSS classes that duplicate a token or semantic preset;
- direct hex/rgb/rgba/hsl colors;
- locally repeated radius, shadow, spacing, typography or interaction-state values;
- per-call-site `objectFit` declarations when an image preset owns the rendering role.

Use `sx` only to consume a centrally exported preset or a shared theme-owned style. CSS Modules are permitted only for genuinely component-specific layout/structure that cannot reasonably be represented by shared tokens/presets; their design values must still use shared CSS variables/tokens. A CSS Module must not create a competing color, radius, shadow or typography system.

### Override and precedence contract

The intended order is:

```text
Design tokens
    ↓
MUI Theme defaults and component variants
    ↓
Semantic shared presets / shared components
    ↓
Feature composition (selects role; supplies content and behavior)
```

Feature composition must not override the visual contract selected above it. Explicit overrides are allowed only through named, centrally defined variants. Avoid `!important`; any remaining use must be documented with its technical reason and an owner for removal.

### Images

Image rendering behavior belongs to named `IMAGE_PRESETS` consumed by `AppImage`. Components select a preset such as `tripCard`, `editorPointThumb` or `profile`; they do not repeat `objectFit`, dimensions, responsive sizes or thumbnail rules inline. If two image roles should render identically, they should share one preset or a shared preset base. If they differ, the difference must be named and centralized. Caller-provided inline styles must not be used to bypass an image preset.

### Migration and review gate

A styling migration is not complete merely because a token or preset exists. It is complete only when:
- all equivalent consumers use the same semantic contract;
- no competing local declarations remain;
- the override chain is understood and documented;
- intentional differences have named variants;
- source searches confirm old declarations/classes are no longer used.

Do not mark a styling stage complete while equivalent controls have divergent visual owners or a global rule is silently overridden by feature-local styling.


---

# 12. Design System Modernization — Execution Plan, Audit Register and Handoff

> **This section is the operational source of truth for the frontend styling-centralization project.** It supersedes older stage-completion statements in this document wherever they conflict with the current status recorded here. Update this section after every meaningful audit batch or migration commit. A new assistant or developer must read this section before starting work.

## 12.1 Objective and definition of done

The objective is to make the entire frontend use one coherent, centrally controlled design system so that a future visual redesign (for example, the current blue/white direction to a charcoal/gold direction) can be performed by changing central tokens, theme configuration and named semantic variants—not by editing dozens or hundreds of feature components.

The system must centrally own:

- Color roles and palettes, including semantic success/warning/error/info states and surface/background/text/border roles.
- Typography: font families, sizes, weights, line heights, letter spacing and responsive type scales.
- Spacing, page gutters, component padding, dimensions, control heights and responsive breakpoints.
- Shape: border radii, outlines, borders and clipping conventions.
- Elevation: shadows, overlays and layering/z-index.
- Component appearance and behavior: default, hover, focus-visible, active, selected, disabled, loading and error states.
- Semantic component roles: Back, Edit, Delete, Add, Remove, Save, primary/secondary actions, cards, panels, dialogs, fields, tabs, chips, avatars, image frames and map controls.
- Image presentation: object-fit, aspect ratio, dimensions, responsive sizes, thumbnail behavior and image-role defaults.
- CSS variables consumed by Global CSS and CSS Modules.

A token or preset existing is not enough. **Definition of done is consumer migration and verified consistency across every equivalent instance.** Feature components may choose a named role and provide data/handlers, but must not independently design that role.

### Non-negotiable visual consistency rules

1. All Back actions share one visual contract; all Edit actions share one; all Delete actions share one; likewise Add (+), Remove (−), Save and other repeated semantic roles.
2. Different semantic roles may have different colors/emphasis, but instances of the same role must agree on dimensions, typography, spacing, radius, border, shadow and all interaction states.
3. Equivalent Cards must share the same surface, border, radius, shadow and internal spacing contract unless a documented named variant explains the difference.
4. No ad-hoc inline `style={{...}}`, inline `sx={{...}}`, locally declared visual style objects, duplicated CSS rules or hard-coded design values in feature components.
5. `sx` is acceptable as a consumer only when it references a centrally defined preset (for example `sx={BUTTON_STYLES.edit}`); it must not be a locally authored style object.
6. CSS Modules may own genuinely unique structural layout and responsive composition. Their visual values must use shared CSS variables/tokens; they must not create a parallel palette, typography, shape or shadow system.
7. Image components must select named image presets. Call sites must not override preset-owned rendering behavior such as `objectFit`.
8. Avoid `!important`. Any unavoidable remaining use must be documented with its reason, exact file and removal condition.
9. Preserve all business logic, API contracts, routing, permissions, data flow and interaction behavior. This project is a styling-architecture migration, not a feature rewrite.
10. Do not delete a legacy selector, token, preset or component until repository-wide consumers and dynamic references have been checked.

## 12.2 Approved six-stage plan (the existing plan; not a replacement plan)

| Stage | Scope | Exit condition | Current status |
|---|---|---|---|
| 1. Full inventory and audit | Enumerate files; inspect styling architecture; scan local styles, tokens, variants, image rules, CSS and consumers; record findings | A versioned file manifest and actionable findings exist | **Partially documented; exhaustive file-by-file audit remains open** |
| 2. Design Tokens and MUI Theme | Centralize semantic tokens and map them into MUI theme/CSS variables | One authoritative source for every shared raw design value | **Foundation exists; completeness and consumers require verification** |
| 3. MUI overrides and reusable presets | Central component defaults, semantic variants and reusable presets | Shared component roles have explicit owners and predictable states | **Foundation exists; semantic coverage requires verification** |
| 4. Global CSS and CSS Modules | Minimize global CSS; migrate shared values to tokens/CSS variables; retain only justified structural module rules | No duplicate visual systems or unowned shared values remain | **Partially migrated; full audit remains open** |
| 5. Systematic component migration | Migrate all consumers in the agreed feature order and compare equivalent roles | Every in-scope file is checked; all shared patterns migrated or documented as exceptions | **OPEN — historical closure statements are superseded** |
| 6. Final audit and validation | Repeat source scans, verify consumer coverage and review visual/regression behavior; run checks only when authorized | Clean audit register, no unexplained exceptions, validation results recorded | **PENDING** |

### Stage 5 migration order

Follow this order unless a dependency requires a documented deviation:

1. Shared shell and Layout (header, footer, navigation, route shells, common controls).
2. Trips (cards, details, actions, forms, days, pagination, filters).
3. Points (cards, lists, forms, create/edit, actions).
4. Forms and Auth (fields, password controls, validation presentation, auth layouts).
5. Admin (tables, panels, user forms, logs, actions).
6. Social and Comments (like/favorite/report, engagement bars, comment/reply surfaces).
7. Maps and Tracking (map controls, address fields, overlays, tracking UI).
8. Images (AppImage, image presets, upload, gallery, lightboxes, avatars, thumbnails).
9. Public pages and remaining route-specific CSS Modules.

For each group: **inventory → inspect source and consumers → record findings → add/fix central token or preset → migrate all equivalent consumers → search again → verify behavior is unchanged → update this register**.

## 12.3 Architecture ownership map

| Concern | Authoritative owner | Consumer rule |
|---|---|---|
| Raw UI values | `src/constants/ui/` and domain-specific token registries | Components must not duplicate values |
| MUI palette/theme/variants/defaults | `src/theme/` | MUI components inherit central defaults |
| Reusable semantic visual patterns | `src/styles/presets/` | Feature components import named presets |
| Enforced application-wide UI roles | Shared components under `src/components/common/` or the relevant shared component area | Callers cannot bypass the role's visual contract |
| Image rendering contracts | `src/constants/images/presets.ts` and `AppImage` | Callers select a named preset; no arbitrary presentation overrides |
| Global document/app-shell rules | `app/globals.css` | Keep minimal; use theme-generated CSS variables |
| Unique structural/responsive composition | CSS Modules | Shared visual values must use CSS variables/tokens |
| Feature-specific content and behavior | Feature components | May compose layout and select semantic roles; may not redefine shared appearance |

Do not create extra abstraction layers merely to move a few lines. Extend an existing token/preset/component when it is the natural owner. Create a new named variant only when there is a real semantic distinction and more than one consumer or a clear reusable contract.

## 12.4 Efficient audit protocol — avoid repeating work

The audit is incremental and checkpoint-based. **Do not reread or rescan the entire repository on every continuation.**

At the start of a work session:

1. Read this section and the latest audit log entry.
2. Read the current branch HEAD and compare it with the recorded `AUDIT_BASE_COMMIT`.
3. Obtain the Git tree for the current branch. Compare it with the saved file manifest; identify added, deleted, renamed and changed files.
4. Inspect the diffs for files changed since the checkpoint. Do not re-audit unchanged files whose status is already `VERIFIED`, unless a changed dependency invalidates that verification.
5. For each changed file, inspect its full current contents when necessary and search all relevant consumers/references before changing a shared API, preset, token or component.
6. Expand the audit only to the dependency surface affected by the change. Examples: changing `AppImage` requires checking every AppImage consumer; changing a button preset requires checking every consumer of that semantic role; changing a CSS variable requires checking all references and its theme definition.
7. Update the status and checkpoint after each completed batch. Never rely on conversational memory as the only record of progress.

### When a full scan is justified

Run a full source scan only when one of these is true:

- The file manifest is missing, corrupt or materially out of date.
- A large refactor or mass rename makes the prior file-level status unreliable.
- A central API/contract changes in a way that may affect unknown consumers.
- A prior search was incomplete or produced ambiguous results.
- The final Stage 6 audit is being performed.

Otherwise, use the Git diff plus targeted consumer/reference searches. This prevents repeating completed checks and reduces context loss.

### Evidence and verification rules

- A file is not `VERIFIED` merely because it was opened. Record the exact checks performed and the result.
- A search result is not proof of no consumers unless the search scope is known to cover the current branch. Prefer a current-branch tree/blob scan or another exhaustive method over indexed search.
- Record exact paths and relevant symbols for each finding. Avoid vague notes such as “some local styles remain.”
- Do not claim a migration is complete until all consumers of the old contract are accounted for.
- Do not run build, tests, lint, CI or other validation commands unless the user authorizes them. Record them as `NOT RUN — awaiting authorization`, not as passed.
- If a tool limit interrupts a batch, record the exact completed range and resume from the first unchecked item. Never restart the completed range without a reason.
- If the branch HEAD changes externally, reconcile the new commits before writing. Do not overwrite another person's work.

## 12.5 Per-file status definitions

Use only these statuses in the manifest:

- `[ ] PENDING` — not yet inspected in the current audit cycle.
- `[~] PARTIAL` — previously modified or inspected, but the complete checklist/consumer verification is still outstanding.
- `[x] VERIFIED` — current file inspected against the checklist; relevant consumers checked; outcome recorded.
- `[!] BLOCKED` — cannot safely complete without missing evidence, a decision or an external dependency.
- `[-] OUT OF SCOPE` — excluded with a written reason. Do not use this merely to avoid an inconvenient file.

For every file marked `VERIFIED`, the audit log must state the scope checked, findings, migration (if any), and verification evidence. If a later change invalidates it, return it to `PENDING` or `PARTIAL`.

### Required file-level checklist

For each source file, inspect as applicable:

- Inline `style` props and locally declared style objects.
- `sx` inline objects, local sx constants and whether imported sx values are truly central.
- `className`, CSS Modules, global selectors and duplicate rules.
- Hard-coded colors, spacing, dimensions, typography, borders, radii, shadows and z-index.
- Hover, focus-visible, active, selected, disabled, loading and error states.
- Semantic button/action role and consistency with all equivalent instances.
- Card/panel/dialog/field surface consistency.
- Image sizing, `objectFit`, aspect ratio, responsive `sizes`, thumbnail and avatar behavior.
- Responsive breakpoints and repeated media-query values.
- Existing props/API that allow a caller to bypass the shared visual contract.
- Unused tokens/presets/selectors only after exhaustive consumer and dynamic-reference checks.
- Behavior preservation: handlers, navigation, ownership/permissions, data and accessibility must remain unchanged.

Not every item applies to every file; mark it not applicable in the file's audit note rather than inventing a styling change.

## 12.6 Baseline inventory and current checkpoint

The following manifest was generated from the recursive Git tree of the current branch, not inferred from memory.

- Repository: `AngelGeorgievStoyanov/hacktrip-web`
- Working branch: `feature/frontend-modernization`
- Baseline HEAD: `d86dc34bd8595bce4f6b3b36f6673e3dadbcb064`
- Inventory scope: tracked source files under `app/` and `src/` with TypeScript/JavaScript/stylesheet/MDX extensions, plus root package/build TypeScript configuration files listed below.
- Baseline count: **249 files** (246 app/src source files; 9 stylesheet files; 3 root configuration files).
- Current per-file status: **21 PARTIAL; 228 PENDING; 0 VERIFIED in this new file-by-file register.** This is intentionally conservative: previous component migrations are recorded above, but they have not yet passed the complete repeatable per-file checklist in this register.
- The manifest is a checkpoint, not a claim that every listed file has already been inspected.

### Status legend

- `[ ]` Pending full file-level audit.
- `[~]` Previously modified; must be re-audited and its consumers verified.
- Replace with `[x]` only after meeting the verification rules above.
- Replace with `[!]` only with a short blocker explanation in the audit log.

## 12.7 Complete tracked source-file manifest

### `app/`

- [ ] `app/(account)/favorites/page.tsx`
- [ ] `app/(account)/layout.tsx`
- [ ] `app/(account)/my-trips/page.tsx`
- [ ] `app/(account)/points/edit/[pointId]/page.tsx`
- [ ] `app/(account)/profile/page.tsx`
- [ ] `app/(account)/trips/[id]/edit/page.tsx`
- [ ] `app/(account)/trips/create/page.tsx`
- [ ] `app/(account)/trips/create/points/page.tsx`
- [ ] `app/(admin)/admin/failed-login-logs/page.tsx`
- [ ] `app/(admin)/admin/images/page.tsx`
- [ ] `app/(admin)/admin/page.tsx`
- [ ] `app/(admin)/admin/reports/page.tsx`
- [ ] `app/(admin)/admin/route-not-found-logs/page.tsx`
- [ ] `app/(admin)/admin/users/[userId]/page.tsx`
- [ ] `app/(admin)/admin/users/page.tsx`
- [ ] `app/(admin)/layout.tsx`
- [ ] `app/(auth)/forgot-password/page.tsx`
- [ ] `app/(auth)/layout.tsx`
- [ ] `app/(auth)/login/page.tsx`
- [ ] `app/(auth)/register/page.tsx`
- [ ] `app/(auth)/resend-verification/page.tsx`
- [ ] `app/(auth)/reset-password/page.tsx`
- [ ] `app/(auth)/verify-email/page.tsx`
- [~] `app/(public)/about/AboutPage.module.css` — stylesheet inspected; local typography/spacing declarations and consumers still require audit
- [ ] `app/(public)/about/page.tsx`
- [ ] `app/(public)/layout.tsx`
- [ ] `app/(public)/live-tracking/page.tsx`
- [ ] `app/(public)/page.tsx`
- [~] `app/(public)/privacy-policy/LegalPage.module.css` — stylesheet inspected; local spacing/typography/back-link treatment and consumers still require audit
- [ ] `app/(public)/privacy-policy/page.tsx`
- [ ] `app/(public)/trips/[id]/page.tsx`
- [ ] `app/(public)/trips/page.tsx`
- [ ] `app/api/og/trips/[id]/route.ts`
- [ ] `app/error.tsx`
- [~] `app/globals.css` — stylesheet inspected; selector consumers and migration still pending
- [ ] `app/layout.tsx`
- [ ] `app/not-found.tsx`
- [ ] `app/opengraph-image.tsx`
- [ ] `app/providers.tsx`
- [ ] `app/robots.ts`
- [ ] `app/sitemap.ts`
- [ ] `app/twitter-image.tsx`

### `root configuration/`

- [ ] `next.config.mjs`
- [ ] `package.json`
- [ ] `tsconfig.json`

### `src/api/admin/`

- [ ] `src/api/admin/index.ts`

### `src/api/auth/`

- [ ] `src/api/auth/index.ts`

### `src/api/client.ts/`

- [ ] `src/api/client.ts`

### `src/api/comments/`

- [ ] `src/api/comments/index.ts`

### `src/api/config/`

- [ ] `src/api/config/index.ts`

### `src/api/points/`

- [ ] `src/api/points/index.ts`

### `src/api/social/`

- [ ] `src/api/social/index.ts`

### `src/api/trips/`

- [ ] `src/api/trips/index.ts`

### `src/components/admin/`

- [ ] `src/components/admin/AdminDashboard.tsx`
- [ ] `src/components/admin/AdminFailedLogs.tsx`
- [ ] `src/components/admin/AdminImages.tsx`
- [ ] `src/components/admin/AdminNavigation.tsx`
- [ ] `src/components/admin/AdminReports.tsx`
- [ ] `src/components/admin/AdminRouteNotFoundLogs.tsx`
- [~] `src/components/admin/AdminUserForm.tsx` — previously modified; full audit still required
- [~] `src/components/admin/AdminUserProfileImage.tsx` — previously modified; full audit still required
- [~] `src/components/admin/AdminUsers.tsx` — previously modified; full audit still required
- [ ] `src/components/admin/index.ts`

### `src/components/auth/`

- [ ] `src/components/auth/Captcha.tsx`
- [ ] `src/components/auth/ChangePasswordForm.tsx`
- [ ] `src/components/auth/ForgotPasswordForm.tsx`
- [ ] `src/components/auth/GuestOnly.tsx`
- [ ] `src/components/auth/LoginForm.tsx`
- [ ] `src/components/auth/ProfileForm.tsx`
- [~] `src/components/auth/ProfileImage.tsx` — previously modified; full audit still required
- [ ] `src/components/auth/RegisterForm.tsx`
- [ ] `src/components/auth/RequireAuth.tsx`
- [ ] `src/components/auth/RequireModeratorRedirect.tsx`
- [ ] `src/components/auth/RequireRole.tsx`
- [ ] `src/components/auth/RequireTripOwner.tsx`
- [ ] `src/components/auth/ResendVerificationForm.tsx`
- [ ] `src/components/auth/ResetPasswordForm.tsx`
- [ ] `src/components/auth/VerifyEmailForm.tsx`
- [ ] `src/components/auth/index.ts`

### `src/components/comments/`

- [ ] `src/components/comments/CommentsSection.tsx`
- [ ] `src/components/comments/CommentsToggle.tsx`
- [ ] `src/components/comments/RepliesSection.tsx`

### `src/components/common/`

- [ ] `src/components/common/BackButton.tsx`
- [ ] `src/components/common/ConfirmDialog.tsx`
- [ ] `src/components/common/ExpandableText.tsx`
- [ ] `src/components/common/JsonLd.tsx`
- [~] `src/components/common/NotFound.module.css` — stylesheet inspected; local home-button treatment and consumers still require audit
- [ ] `src/components/common/NotFound.tsx`
- [ ] `src/components/common/NotificationProvider.tsx`
- [ ] `src/components/common/PasswordField.tsx`
- [ ] `src/components/common/PasswordRequirements.tsx`
- [ ] `src/components/common/ScrambleHeading.tsx`
- [ ] `src/components/common/TabSyncListener.tsx`
- [ ] `src/components/common/WelcomeHeading.tsx`

### `src/components/CustomFileUploadButton.tsx/`

- [ ] `src/components/CustomFileUploadButton.tsx`

### `src/components/home/`

- [ ] `src/components/home/HomeHero.tsx`
- [ ] `src/components/home/HomeTrips.tsx`
- [ ] `src/components/home/index.ts`

### `src/components/images/`

- [~] `src/components/images/AppImage.tsx` — previously modified; full audit still required
- [~] `src/components/images/ImageGallery.module.css` — stylesheet inspected; selector/consumer verification still pending
- [~] `src/components/images/ImageGallery.tsx` — previously modified; full audit still required
- [~] `src/components/images/ImageLightbox.tsx` — previously modified; full audit still required
- [ ] `src/components/images/ImageUploadField.tsx`
- [ ] `src/components/images/index.ts`

### `src/components/layout/`

- [~] `src/components/layout/Footer.module.css` — stylesheet inspected; literal horizontal padding and consumers still require audit
- [ ] `src/components/layout/Footer.tsx`
- [ ] `src/components/layout/Header.tsx`

### `src/components/maps/`

- [ ] `src/components/maps/AddressAutocomplete.tsx`
- [ ] `src/components/maps/GoogleMapView.tsx`
- [ ] `src/components/maps/PointLocationPicker.tsx`
- [ ] `src/components/maps/TripLocationPicker.tsx`

### `src/components/placeholders/`

- [ ] `src/components/placeholders/SocialObjectPlaceholder.tsx`
- [ ] `src/components/placeholders/index.ts`
- [ ] `src/components/placeholders/socialObjectPlaceholderAssets.ts`

### `src/components/points/`

- [ ] `src/components/points/CreatePointPage.tsx`
- [~] `src/components/points/EditPointPage.tsx` — previously modified; full audit still required
- [ ] `src/components/points/PointActions.tsx`
- [~] `src/components/points/PointCard.tsx` — previously modified; full audit still required
- [ ] `src/components/points/PointForm.tsx`
- [ ] `src/components/points/PointList.tsx`

### `src/components/social/`

- [ ] `src/components/social/EngagementBar.tsx`
- [ ] `src/components/social/FavoriteButton.tsx`
- [ ] `src/components/social/LikeAnimation.tsx`
- [ ] `src/components/social/LikeButton.tsx`
- [ ] `src/components/social/ReportButton.tsx`
- [ ] `src/components/social/SocialConfigStatus.tsx`
- [ ] `src/components/social/TripGroupSocialActions.tsx`

### `src/components/tracking/`

- [ ] `src/components/tracking/LiveTracker.tsx`
- [ ] `src/components/tracking/index.ts`

### `src/components/trips/`

- [ ] `src/components/trips/DayImagesGallery.tsx`
- [ ] `src/components/trips/EditTripLayout.tsx`
- [ ] `src/components/trips/PointSection.tsx`
- [ ] `src/components/trips/PointsSection.tsx`
- [ ] `src/components/trips/TripActions.tsx`
- [~] `src/components/trips/TripCard.tsx` — previously modified; full audit still required
- [ ] `src/components/trips/TripDaysNav.tsx`
- [ ] `src/components/trips/TripDetails.tsx`
- [~] `src/components/trips/TripDetailsView.module.css` — stylesheet inspected; structural geometry vs shared tokens and consumers still require audit
- [ ] `src/components/trips/TripDetailsView.tsx`
- [ ] `src/components/trips/TripFilters.tsx`
- [~] `src/components/trips/TripForm.tsx` — previously modified; full audit still required
- [~] `src/components/trips/TripList.module.css` — stylesheet inspected; local typography/margins and consumers still require audit
- [ ] `src/components/trips/TripList.tsx`
- [ ] `src/components/trips/TripMapSection.tsx`
- [~] `src/components/trips/TripPagination.module.css` — stylesheet inspected; literal outer margin and consumers still require audit
- [ ] `src/components/trips/TripPagination.tsx`
- [ ] `src/components/trips/TripSelectField.tsx`

### `src/config/index.ts/`

- [ ] `src/config/index.ts`

### `src/constants/admin/`

- [ ] `src/constants/admin/index.ts`

### `src/constants/api/`

- [ ] `src/constants/api/index.ts`

### `src/constants/comments/`

- [ ] `src/constants/comments/index.ts`

### `src/constants/config/`

- [ ] `src/constants/config/index.ts`

### `src/constants/icons.ts/`

- [ ] `src/constants/icons.ts`

### `src/constants/images/`

- [ ] `src/constants/images/index.ts`
- [~] `src/constants/images/presets.ts` — previously modified; full audit still required

### `src/constants/maps/`

- [ ] `src/constants/maps/index.ts`

### `src/constants/notifications.ts/`

- [ ] `src/constants/notifications.ts`

### `src/constants/pagination.ts/`

- [ ] `src/constants/pagination.ts`

### `src/constants/points/`

- [ ] `src/constants/points/index.ts`

### `src/constants/roles/`

- [ ] `src/constants/roles/index.ts`

### `src/constants/seo/`

- [ ] `src/constants/seo/branding.ts`
- [ ] `src/constants/seo/coordinates.ts`
- [ ] `src/constants/seo/defaults.ts`
- [ ] `src/constants/seo/images.ts`
- [ ] `src/constants/seo/index.ts`
- [ ] `src/constants/seo/limits.ts`
- [ ] `src/constants/seo/robots.ts`
- [ ] `src/constants/seo/sitemap.ts`

### `src/constants/trips/`

- [ ] `src/constants/trips/index.ts`

### `src/constants/ui/`

- [ ] `src/constants/ui/breakpoints.ts`
- [ ] `src/constants/ui/colors.ts`
- [ ] `src/constants/ui/index.ts`
- [ ] `src/constants/ui/shadows.ts`
- [~] `src/constants/ui/shape.ts` — previously modified; full audit still required
- [~] `src/constants/ui/sizes.ts` — previously modified; full audit still required
- [~] `src/constants/ui/spacing.ts` — previously modified; full audit still required
- [ ] `src/constants/ui/typography.ts`
- [ ] `src/constants/ui/z-index.ts`

### `src/hooks/useAuth.tsx/`

- [ ] `src/hooks/useAuth.tsx`

### `src/hooks/useBackground.tsx/`

- [ ] `src/hooks/useBackground.tsx`

### `src/hooks/useGoogleMapsLoader.ts/`

- [ ] `src/hooks/useGoogleMapsLoader.ts`

### `src/hooks/useLiveTracking.ts/`

- [ ] `src/hooks/useLiveTracking.ts`

### `src/hooks/useReportActions.ts/`

- [ ] `src/hooks/useReportActions.ts`

### `src/hooks/useSelects.ts/`

- [ ] `src/hooks/useSelects.ts`

### `src/hooks/useSocialConfig.ts/`

- [ ] `src/hooks/useSocialConfig.ts`

### `src/hooks/useTripGroup.ts/`

- [ ] `src/hooks/useTripGroup.ts`

### `src/lib/errors.ts/`

- [ ] `src/lib/errors.ts`

### `src/lib/images/`

- [ ] `src/lib/images/renderTripOgImage.tsx`
- [ ] `src/lib/images/representative.ts`
- [ ] `src/lib/images/thumbnail.ts`
- [ ] `src/lib/images/tripOgData.ts`
- [ ] `src/lib/images/validate.ts`

### `src/lib/maps.ts/`

- [ ] `src/lib/maps.ts`

### `src/lib/pointName.ts/`

- [ ] `src/lib/pointName.ts`

### `src/lib/selects.ts/`

- [ ] `src/lib/selects.ts`

### `src/lib/serverApi.ts/`

- [ ] `src/lib/serverApi.ts`

### `src/lib/share.ts/`

- [ ] `src/lib/share.ts`

### `src/lib/socialConfig.ts/`

- [ ] `src/lib/socialConfig.ts`

### `src/lib/socialQuerySync.ts/`

- [ ] `src/lib/socialQuerySync.ts`

### `src/lib/tabSync.ts/`

- [ ] `src/lib/tabSync.ts`

### `src/lib/tracking.ts/`

- [ ] `src/lib/tracking.ts`

### `src/lib/trimRequestData.ts/`

- [ ] `src/lib/trimRequestData.ts`

### `src/lib/tripUrl.ts/`

- [ ] `src/lib/tripUrl.ts`

### `src/lib/zodResolver.ts/`

- [ ] `src/lib/zodResolver.ts`

### `src/seo/index.ts/`

- [ ] `src/seo/index.ts`

### `src/seo/metadata/`

- [ ] `src/seo/metadata/buildMetadata.ts`

### `src/seo/modules/`

- [ ] `src/seo/modules/trip/buildContent.ts`
- [ ] `src/seo/modules/trip/buildMetadata.ts`
- [ ] `src/seo/modules/trip/buildStructuredData.ts`
- [ ] `src/seo/modules/trip/types.ts`

### `src/seo/SiteStructuredData.tsx/`

- [ ] `src/seo/SiteStructuredData.tsx`

### `src/seo/types.ts/`

- [ ] `src/seo/types.ts`

### `src/styles/presets/`

- [~] `src/styles/presets/buttons.ts` — previously modified; full audit still required
- [~] `src/styles/presets/cards.ts` — previously modified; full audit still required
- [~] `src/styles/presets/forms.ts` — previously modified; full audit still required
- [ ] `src/styles/presets/layouts.ts`
- [ ] `src/styles/presets/map-controls.ts`
- [ ] `src/styles/presets/panels.ts`
- [ ] `src/styles/presets/social.ts`
- [ ] `src/styles/presets/typography.ts`

### `src/theme/components/`

- [ ] `src/theme/components/button.ts`
- [ ] `src/theme/components/card.ts`
- [ ] `src/theme/components/dialog.ts`
- [ ] `src/theme/components/surface.ts`
- [ ] `src/theme/components/text-field.ts`

### `src/theme/index.ts/`

- [~] `src/theme/index.ts` — previously modified; full audit still required

### `src/theme/palette.ts/`

- [ ] `src/theme/palette.ts`

### `src/theme/shadows.ts/`

- [ ] `src/theme/shadows.ts`

### `src/theme/shape.ts/`

- [ ] `src/theme/shape.ts`

### `src/theme/typography.ts/`

- [ ] `src/theme/typography.ts`

### `src/types/admin.ts/`

- [ ] `src/types/admin.ts`

### `src/types/auth.ts/`

- [ ] `src/types/auth.ts`

### `src/types/comments.ts/`

- [ ] `src/types/comments.ts`

### `src/types/common.ts/`

- [ ] `src/types/common.ts`

### `src/types/config.ts/`

- [ ] `src/types/config.ts`

### `src/types/images.ts/`

- [ ] `src/types/images.ts`

### `src/types/index.ts/`

- [ ] `src/types/index.ts`

### `src/types/points.ts/`

- [ ] `src/types/points.ts`

### `src/types/social.ts/`

- [ ] `src/types/social.ts`

### `src/types/trips.ts/`

- [ ] `src/types/trips.ts`

### `src/validations/admin/`

- [ ] `src/validations/admin/index.ts`

### `src/validations/auth/`

- [ ] `src/validations/auth/index.ts`

### `src/validations/comments/`

- [ ] `src/validations/comments/index.ts`

### `src/validations/index.ts/`

- [ ] `src/validations/index.ts`

### `src/validations/params.ts/`

- [ ] `src/validations/params.ts`

### `src/validations/points/`

- [ ] `src/validations/points/index.ts`

### `src/validations/shared.ts/`

- [ ] `src/validations/shared.ts`

### `src/validations/social/`

- [ ] `src/validations/social/index.ts`

### `src/validations/trips/`

- [ ] `src/validations/trips/index.ts`

## 12.8 Known migration record — already changed, not yet fully re-audited

The following work is recorded as previously committed on this branch. It must not be repeated blindly; first compare the current file and its consumers with the intended result.

| Area | Files / change | Current audit status |
|---|---|---|
| Image presets | `src/constants/images/presets.ts`: editor/gallery/lightbox/profile/trip-card image roles centralized | PARTIAL — inspect current preset definitions and all consumers |
| AppImage contract | `src/components/images/AppImage.tsx`: arbitrary caller `style` API removed; named presets own image rendering | PARTIAL — inspect API and exhaustively verify all call sites |
| Point editor | `src/components/points/EditPointPage.tsx`: local object-fit removed | PARTIAL |
| Day controls | `src/styles/presets/buttons.ts`, `src/styles/presets/forms.ts`, `src/components/trips/TripForm.tsx`: increment/decrement and field presets | PARTIAL — compare all day controls |
| Admin user form | `src/components/admin/AdminUserForm.tsx`: Save/Delete semantic presets | PARTIAL — compare other admin actions |
| PointCard | `src/constants/ui/sizes.ts`, `src/styles/presets/cards.ts`, `src/components/points/PointCard.tsx`: inset/action/text-wrap presets | PARTIAL |
| Image consumers | `ImageGallery.tsx`, `ImageLightbox.tsx`, `ProfileImage.tsx`, `AdminUsers.tsx`, `AdminUserProfileImage.tsx`, `TripCard.tsx` | PARTIAL — verify dimensions, fit, clipping and fallback behavior |
| CSS Module tokens | About mobile gutter and Legal TOC radius moved to shared tokens/theme CSS variables | PARTIAL — inspect all module declarations and remaining raw values |
| Documentation | This architecture document contains the approved design-system rules and historical migration notes | UPDATED — this operational register supersedes older completion claims |

Previously recorded commits (historical; verify against current branch history before relying on them): `99020cef123f3eece3e3ce49c116371432f7ff42` and `d86dc34bd8595bce4f6b3b36f6673e3dadbcb064`.

## 12.9 Known risks and open questions — do not assume resolved

- `BackButton` may still expose caller-provided `sx` or other props that can weaken its semantic visual contract. Inspect the component API and all callers before tightening it.
- Semantic action coverage is incomplete until every Back/Edit/Delete/Add/Remove/Save and other repeated action is compared across the full current branch.
- Existing `.ht-button` global CSS/selectors must not be deleted until exhaustive static and dynamic consumer checks prove they are unused.
- Existing CSS Modules may legitimately own unique layout, but their colors, radii, shadows, typography and repeated spacing must be checked against shared tokens.
- Confirm there is no competing Card surface contract across MUI Card, Paper, custom panels and CSS Modules.
- Check whether theme tokens and preset tokens duplicate the same value or disagree; do not create duplicate sources of truth.
- Verify the current `AppImage` API and every consumer after the earlier removal of its arbitrary style prop. Do not reintroduce caller overrides as a shortcut.
- Distinguish true design values from content geometry, map SDK styling, third-party library requirements and one-off structural layout. Centralize shared design decisions, not every numeric value indiscriminately.

## 12.9.1 CSS and styling audit checkpoint — 2026-11-17

**Scope inspected in this batch:** all nine tracked stylesheet files in the current manifest:
- `app/globals.css`
- `app/(public)/about/AboutPage.module.css`
- `app/(public)/privacy-policy/LegalPage.module.css`
- `src/components/common/NotFound.module.css`
- `src/components/images/ImageGallery.module.css`
- `src/components/layout/Footer.module.css`
- `src/components/trips/TripDetailsView.module.css`
- `src/components/trips/TripList.module.css`
- `src/components/trips/TripPagination.module.css`

Central styling foundations inspected alongside those stylesheets:
- `src/theme/index.ts`, `src/theme/palette.ts`, `src/theme/shape.ts`, `src/theme/shadows.ts`, `src/theme/typography.ts`
- `src/theme/components/button.ts`, `card.ts`, `dialog.ts`, `surface.ts`, `text-field.ts`
- `src/constants/ui/colors.ts`, `spacing.ts`, `sizes.ts`, `shadows.ts`, `shape.ts`
- `src/styles/presets/layouts.ts`, `buttons.ts`

### Findings — confirmed, not yet migrated

1. **Global CSS has more than a reset.** It owns the app shell and a separate `.ht-button` visual contract. Its existence and actual consumers still need a branch-wide search before it can be consolidated or removed.
2. **Token coverage is incomplete for CSS consumers.** `:root` variables currently expose only a subset of semantic color/spacing/shape/typography values. Several stylesheet declarations still use literal values.
3. **Legacy/local visual declarations remain in CSS Modules.**
   - `NotFound.module.css`: local home-button padding/margin and button appearance; compare with the shared semantic button contract.
   - `Footer.module.css`: literal horizontal padding.
   - `AboutPage.module.css`: local font family/weights, responsive font sizing, margins and text shadow; font family and repeated typography need central ownership review.
   - `LegalPage.module.css`: literal page/content/TOC padding, margins, font sizing/line-height and a local back-link treatment.
   - `TripDetailsView.module.css`: literal content widths, margins and container breakpoints alongside shared spacing variables. Distinguish structural geometry from repeated design tokens before moving values.
   - `TripList.module.css`: local font sizes/weight and small margins.
   - `TripPagination.module.css`: literal outer margin.
   - `ImageGallery.module.css`: inspected declarations already consume shared spacing and shape variables; full selector/consumer verification is still required.
4. **Theme ownership is only partial.** MUI Card and Dialog Paper share `getSurfaceStyles`, but Paper and custom/CSS surfaces have not been proven to follow the same contract. TextField overrides currently declare defaults that match MUI defaults; this alone does not establish consistent field states/appearance.
5. **Semantic button roles are not complete.** `BUTTON_STYLES.back` aliases `secondary`; this does not prove Back actions are consistent across MUI buttons, anchors and plain HTML controls. `.ht-button` is another styling path.
6. **Token duplication / inconsistency needs a dedicated pass.** Spacing values appear as scale multipliers and literal pixel/rem values, and semantic values are exposed through CSS variables while other CSS still embeds literals. Do not consolidate until all consumers and intended exceptions are mapped.

### Status of this batch

- Stylesheet content inspected: **9/9**.
- Central theme/token/preset files inspected: **17 files** (listed above).
- Consumer-wide searches for every selector, token and preset: **not yet complete**.
- No stylesheet or application source was modified in this batch.
- No file is marked VERIFIED. Inspection alone is not completion: a file becomes VERIFIED only after declarations, imports, selectors, consumers, responsive states and relevant visual contracts are checked against the full repository.
- The nine stylesheet manifest entries are marked PARTIAL to record this inspection without implying migration or complete verification.

### Next task

Continue Stage 1 from the exact current branch HEAD: perform exhaustive selector/token/preset consumer searches, then audit the complete theme and preset dependency graph. Only after the ownership map is complete should migrations begin. Keep Stage 5 open until every feature group has been migrated and re-audited.

---
## 12.10 Append-only audit log and mandatory update protocol

**Append a new dated entry here after every completed audit batch, migration batch, meaningful discovery or checkpoint.** Keep older entries as history; correct them with a newer entry rather than silently rewriting history.

Each entry must contain:

1. Date/time and current branch HEAD.
2. Stage and functional group.
3. Exact files inspected and exact files modified.
4. Findings: local styles/legacy declarations, central owner, consumers and any exceptions.
5. Changes made and commit SHA (if committed).
6. Verification performed and its scope. Explicitly state which checks were not run.
7. File status changes (`PENDING → PARTIAL → VERIFIED`, etc.).
8. Remaining blockers and the single next task.
9. Updated checkpoint commit and manifest changes (new/deleted/renamed files).

### Audit log

#### 2026-11-17 — Operational register created

- Branch: `feature/frontend-modernization`
- Baseline HEAD before this documentation update: `d86dc34bd8595bce4f6b3b36f6673e3dadbcb064`
- Stage: 1 — inventory and audit process.
- Generated a recursive Git tree inventory and identified **249** in-scope files (246 under `app/` and `src/`, including 9 stylesheet files).
- Added a complete file manifest with conservative statuses. The 21 files with previously recorded modifications are marked PARTIAL, not VERIFIED. The remaining files are PENDING.
- Consolidated the project objective, six approved stages, ownership boundaries, semantic consistency rules, file-level checklist, incremental audit procedure and handoff instructions.
- No application source files were modified in this documentation batch. No build, tests, lint or CI were run.
- Next task: continue Stage 1 using the manifest, audit central styling foundations first, then proceed file-by-file and by dependency group. Do not re-scan unchanged files on each turn; use the Git diff from the latest checkpoint and targeted consumer searches.


#### 2026-11-17 — CSS foundation and stylesheet inspection checkpoint

- Branch: `feature/frontend-modernization`
- Starting HEAD: `4bdfdf649f6c231c086b188c76e973ddd69c8555`
- Stage: 1 — inventory and audit; CSS/theme foundation subgroup.
- Inspected all nine stylesheet files in the manifest and the 17 central theme/token/preset files listed in §12.9.1.
- Confirmed outstanding styling paths: global `.ht-button`, MUI theme overrides, CSS Modules, semantic `sx` presets and inline React styles coexist. This is not an exhaustive consumer list; repository-wide consumer searches remain pending.
- Confirmed local visual declarations remain in NotFound button, Footer padding, About typography, Legal page spacing/typography/back link, Trip Details layout geometry, Trip List typography/margins and Trip Pagination margin. ImageGallery CSS uses shared variables in the inspected declarations but its complete consumer contract remains unverified.
- Added findings and CSS checkpoint to §12.9.1; updated all nine stylesheet manifest entries to PARTIAL. No source files were modified.
- Verification: inspected file contents on the target branch. No build, tests, lint or CI run. No application behavior or visual regression checks performed.
- Current checkpoint before documentation commit: `4bdfdf649f6c231c086b188c76e973ddd69c8555`.
- Next task: exhaustive searches for CSS class selectors, CSS variables, token/preset imports, inline `style` and MUI `sx` usage; map consumers before any CSS cleanup or migration.