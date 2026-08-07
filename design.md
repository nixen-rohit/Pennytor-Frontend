# User Module — Design System & Structure Guide

> This doc covers the **User-facing** theme, layout conventions, and the internal
> structure of every folder under `frontend/components/User`.
> The separate `frontend/design.md` covers the **Admin** theme. The two are distinct.

---

## 1. How to read this module

Every directory under `User/` is a **feature**, and most are **pages** imported
by route files. Each feature folder owns its own markup, types, mock data, and
helpers — files are deliberately self-contained (no cross-folder imports except
shared `@/components/ui/*`, `@/utils/*`, and the generic `lib/utils` `cn`).

### Quick map

| Folder | Route intent | Pattern |
|---|---|---|
| `Dashboard/` | "My dashboard" overview | Cards + stat-grid |
| `Funds/` | "My Investments" overview | Cards (wallet + slip) |
| `AddFund/` | Add funds (UPI deposit) | Multi-step wizard (4) |
| `WithdrawFund/` | Withdraw funds | Multi-step wizard (3) |
| `KYC/` | KYC onboarding | Multi-step wizard (5) |
| `Transaction/` | Transaction history | Searchable/tabbable table |
| `ReferralChain/` | Referral network + tree | Tabs + table + tree |
| `Referral/` | Referral overview/stats | Cards + charts |
| `Profile/` | Profile + verification timeline | Split cards |
| `Layout/` | Sidebar & topbar nav data | Config data |

---

## 2. Tech & conventions

- **Framework:** Next.js App Router — every interactive component is a
  `"use client"` component (top of file, strict).
- **UI primitives:** shadcn/ui from `@/components/ui/*` (`Button`, `Card`,
  `Input`, `Select`, `Table`, `Dialog`, `Tabs`, `Badge`, `Label`).
- **Icons:** `lucide-react` (inline `className="h-X w-X"`). Some custom SVGs
  live inline (e.g. `Profile/icons.tsx`).
- **Dates:** `date-fns` `format(date, "...")` — patterns like
  `dd-MM-yyyy`, `MMM dd, yyyy`, `MMM`.
- **Class merge:** `cn` from `@/lib/utils`.
- **Currency (INR):** local helper `currency()` in `AddFund/format.ts` and
  `WithdrawFund/format.ts` (en-IN locale, `₹`, 0 decimals).
- **Images:** `next/image` (`/img/...`) — QR, bank QR, profile cover/avatar.

---

## 3. Theme (dark, User-specific)

The User UI is **always-dark** and mostly uses literal Tailwind utilities
rather than the admin theme tokens. Two visual variants exist:

### Variant A — "Glass / rose" (Dashboard, Referral, chart cards)

Used by the grid-of-stats dashboards. Semi-transparent panels over a backdrop.

```tsx
<Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
```

- Accent color: **rose `#E85B66`** (used as solid `bg-[#E85B66]`, buttons,
  icon color, active tab bg).
- Chart gradients: `bg-gradient-to-t from-[#E85B66]/60 to-[#4E385E]/60`.
- Secondary lavender tint: `text-[#4E385E]`, `from-[#4E385E]/30`.
- Text: `text-muted-foreground` labels, `text-foreground`/`font-bold` values.
- Positive = `text-green-500`, negative = `text-red-500`.

### Variant B — "solid / indigo" forms & tables (wizard flows, tables, profile)

Used by forms, tables, payment slips. Opaque dark panels.

```tsx
// outer page Card
<Card className="shadow-sm">
// inner info/data panel
<div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
```

- Accent color: **indigo** (`indigo-600` primary, `indigo-500/20 text-indigo-400`
  badges/tags, `bg-indigo-600` active pills/steps).
- Page bg: `bg-black` (set on the page wrapper), dark panels `bg-neutral-900/50`,
  `bg-neutral-950`.
- Borders/dividers: `border-neutral-700` / `border-neutral-800`,
  `divide-neutral-800`.
- Text: title `text-slate-50`, body `text-slate-200`/`text-slate-300`,
  muted `text-slate-400`, faint `text-slate-500`.
- Status: green (`text-green-400`), amber/yellow (`text-amber-300`,
  `bg-amber-500/10`), red (`text-red-400`).

### Shared color semantics (both variants)

| Meaning | Color |
|---|---|
| Primary/CTA, active | `bg-indigo-600 hover:bg-indigo-700 text-white` (forms/tables) |
| Brand accent (marketing cards) | `#E85B66` (rose) |
| Success / active / credit | green (`green-400`/`green-500`) |
| Pending / warning | amber/yellow (`amber-300`/`yellow-400`) |
| Error / debit / reject | red (`red-400`/`red-500`) |
| Neutral info / disabled | slate / neutral gray |

---

## 3. Page layout pattern

All pages follow the same shell:

```tsx
// outer wrapper (dark bg)
<div className="min-h-screen p-4">          // some pages add bg-black
  <div className="max-w-5xl mx-auto space-y-5">  // width varies: 5xl / 6xl / 7xl

    {/* Page title block */}
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
        Page Title
      </h1>
      {optional && <p className="text-sm text-slate-400 mt-1">Subtitle</p>}
    </div>

    {/* Cards / content */}
  </div>
</div>
```

Common responsive container widths: `max-w-5xl` (wizards/KYC/profile),
`max-w-6xl` (Funds), `max-w-7xl` (Transaction).

---

## 4. Pattern A — Multi-step Wizard

Used by `AddFund` (4 steps), `KYC` (5 steps), `WithdrawFund` (3 steps).
Identical skeleton across the three; only the content of each step differs.

### Structure of a wizard folder

```
Feature/
  index.tsx        // page shell ORCHESTRATOR: state, navigation, submit, submitted screen
  types.ts         // STEPS meta + FormState + initialFormState + FormErrors + FormChange
  StepDots.tsx / StepTimeline.tsx  // visual stepper header
  format.ts        // currency helper
  <StepX>.tsx      // one component per step (fields)
```

### Data source — `types.ts`

- `STEPS` / `PHASES`: `[{ step, title, icon }]` (icon from `lucide-react`).
- `FormState` interface, `initialFormState` constant.
- `FormErrors` interface.
- `FormChange` generic type:
  ```ts
  export type FormChange = <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  ```
- Feature constants (bank details, quick amounts, session info, methods, limits).

### Orchestrator — `index.tsx` responsibilities

```tsx
const [step, setStep] = useState(1)
const [form, setForm] = useState<FormState>(initialFormState)
const [errors, setErrors] = useState<FormErrors>({})
const [submitted, setSubmitted] = useState(false)
```

- `updateField` (wrapped with `useCallback`): sanitizes input, `setForm`,
  clears that field's error. Some sanitize via `@/utils/validation` helpers.
- `validateStepX()` per-step; sets `errors` and returns boolean.
- `goNext` / `goBack` clamp step between `1` and `STEPS.length`.
- `handleSubmit`: builds payload (maps form → API shape, adds session/system
  fields), currently `console.log` (API is TODO-stubbed), sets `submitted`.
- **Submitted screen:** swapped in early (early return) when `submitted`,
  shows success + a read-only slip + "start over" reset link.
- Step body rendered conditionally:
  ```tsx
  {step === 1 && <PaymentDetails data={form} errors={errors} onChange={updateField} />}
  ```
- Footer buttons: left = **Previous** (outline, disabled on step 1),
  right = **Submit** (last step) or **Next/Continue**.

### Step components signature (consistent convention)

```tsx
function StepComponent({ data, errors, onChange }) { ... }
```

Each step top-level wrapper:

```tsx
<div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
  <SectionHeading title="..." />      // <div className="border-b pb-2"><h3 .../>
</div>
```

### Header stepper (`StepDots` / `StepTimeline`)

Horizontal circles connected by progress lines; completed = filled indigo, active
= indigo + ring, upcoming = outlined. Progress fill:
`currentStep >= phase.step ? "bg-indigo-600" : "bg-neutral-800"`.
Mobile: collapsed to segmented bars + "Step X of Y" label.

### Reusable micro-components in wizards

- **`SlipRow`** — label/value read-only row (`flex justify-between`, `divide`),
  optional `mono`, `muted`, `badge` ("pending" | "draft"). Exists in both
  `AddFund/` and `WithdrawFund/` (identical).
- **`CopyField`** (`AddFund`) — label + mono value + copy button with
  "Copied" check feedback (clipboard).
- **`UploadField`** — drag/drop + click-to-upload, image preview, remove button,
  error text. Local variants exist per wizard.

### Two-column / input conventions

- Amount inputs: leading `₹`, `inputMode="numeric"`, digit-stripped onChange
  (`replace(/[^0-9]/g, "")`), `font-mono`. Quick-amount pill buttons use
  `QUICK_AMOUNTS`.
- Selectable option cards (e.g. withdrawal method): bordered button,
  `selected ? "border-indigo-600 bg-indigo-600/10" : "border-neutral-800 ..."`,
  trailing `Check`.

---

## 5. Pattern B — Searchable/Filterable Table

Used by `Transaction` and `ReferralChain/ReferralList`, and pagination by
`ReferralChain`.

### Folder shape

```
Transaction/
  index.tsx                // ORCHESTRATOR: state + filtering + pagination math
  types.ts                 // record types, seed data, option arrays
  TransactionToolbar.tsx   // search input + Filters button (badge count)
  TransactionFilterDialog.tsx // Dialog w/ Select filters
  TransactionTable.tsx     // shadcn Table + badges + empty state + footer slot
  Pagination.tsx           // page buttons w/ ellipsis
```

### Orchestrator responsibilities

Lifts all state up: `searchTerm`, individual filters, `entriesPerPage`,
`currentPage`, `openFilterDialog`.

- Derived: `activeFilterCount`, `hasActiveFilters`.
- `filtered` via `useMemo` (combines search + selects).
- Pagination math: `entriesPerPageNumber`, `totalPages`,
  `startIndex`/`endIndex`, sliced `currentData`.
- All filter setters reset `currentPage` to `1`.
- `clearFilters` resets selects.

### Table specifics

- Wrapped: `<Card className="shadow-sm"><CardContent className="p-0">`.
- Top bar: "Show `Select` entries" + "Showing X to Y of Z entries".
- Toolbar: search `Input` with `Search` icon (`left-3`), plus `Filters` button
  showing active-filter count badge (`bg-indigo-600`).
- Badges: request type (DR red / CR green), status by `statusStyles` map.
- Empty state: centered icon in `bg-neutral-800` circle + helper text +
  conditional "Clear all filters".
- Footer slot renders `Pagination`.

### Pagination

`h-8 w-8 p-0` square buttons; active `bg-indigo-600 text-white`, else outline.
Ellipsis `...` for large sets. Left/right chevrons disabled at boundaries.

---

## 6. Pattern C — Data + Tree

`ReferralChain`:

- `index.tsx` wraps `Tabs` (My Referrals / Referral Tree).
- `ReferralList.tsx` — table (same Pattern B). Uses `maskEmail` util.
- `ReferralTree.tsx` — recursive `TreeNode` with indent per depth, expand/collapse
  chevrons, root highlighted with indigo ring/avatar.
- `types.ts` — `ReferralUser`, `CommissionRecord`, `ReferralStats`,
  `ReferralTreeData`, `ReferralState` + `initialReferralState` seed.
- `utils.ts` — `maskEmail`, `getPageNumbers` (shared by pagination).

---

## 7. Profile & static-display pages

- `Profile/index.tsx` — split layout
  `lg:grid-cols-[minmax(0,340px)_1fr]`: left `ProfileCard`, right
  `VerificationTimeline`.
- `data.ts` — a single typed `profile: KycProfile` object.
- `types.ts` — `VerificationState` (`not_started|verified|pending|rejected`),
  `KycProfile`, and a `STATE_STYLES` map (label + text/bg/ring/dot classes per
  state) used to keep the timeline color-consistent.
- `icons.tsx` — hand-rolled inline SVGs (`IconClock`, `IconCheck`, `IconX`)
  wrapped by `StateIcon`.
- Uses subtle `white/x` opacities and `#90EF5D` accent for the eyebrow label.

---

## 8. Navigation layout data

- `Layout/sidebarData.tsx` — exports `menuData: MenuSection[]` (id/label/items;
  items have id, label, href, optional badge, isNew, External, `children[]`).
  Icons from `lucide-react` + `react-icons/md`.
- `Layout/topbarData.tsx` — exports `userTopbar: TopbarConfig` with `homeHref`
  and `menuItems` (link or logout).

---

## 9. Shared helpers & rules

- **`@/utils/validation.ts`** — the single source of truth for sanitizers and
  patterns: `sanitizeText`, `sanitizeAmount`, `sanitizeTransactionId`,
  `sanitizeDigits`, `containsUnsafe`; patterns `PAN_PATTERN`, `IFSC_PATTERN`,
  `AADHAAR_PATTERN`, `PHONE_PATTERN`, `ACCOUNT_NUMBER_PATTERN`,
  `AMOUNT_PATTERN`, `TRANSACTION_ID_PATTERN`.
  - KYC has its own `validation.ts` (`validateStep`) that reuses these.
- **Input hygiene:** all text inputs run through sanitizers; errors shown as
  `text-xs text-red-500` under the field. Required markers: `*` styled red.
- **Animations:** step/result wrappers use
  `animate-in fade-in-0 slide-in-from-right-4 duration-300`.
- **Mock-first:** every page renders with hardcoded seed data; API wiring is
  `TODO` (the payload is assembled in `handleSubmit` and `console.log`ged).

---

## 10. Consistency gotchas / DRY notes

- `SlipRow` (both `AddFund/` and `WithdrawFund/`) and `UploadField`
  (`AddFund`, `KYC`) are duplicated per feature — extract to
  `@/components/ui/` or `@/components/User/shared/` if you add more wizards.
- `Pagination` is duplicated between `Transaction/` and `ReferralChain/`
  (the latter shares `getPageNumbers` from `ReferralChain/utils`).
- `format.ts` currency helper is duplicated in `AddFund/` and `WithdrawFund/`.
- `StepDots`/`StepTimeline` are near-identical (only the step array differs)
  — a single shared stepper is a candidate for consolidation.

### When adding a new wizard or table page

1. Copy the folder pattern of `WithdrawFund/` (simple 3-step, no system fields)
   or `Transaction/` (table) as a scaffold.
2. Keep `index.tsx` as a thin orchestrator; put visuals in per-step / per-block
   components.
3. Wire all sanitization through `@/utils/validation`.
4. Follow Variant B (indigo, `neutral-950` panels) for forms/tables, Variant A
   (rose, translucent) for stat/marketing cards.