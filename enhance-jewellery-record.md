# Enhancement Plan — "Given By" & "Belongs To" on Jewellery Records

**Status:** Complete. Backend verified against the live DB (create / read / update / nullability); frontend type-checks, builds, and the new UI is in the bundle.
**Scope:** Full-stack — frontend (types, forms, table, filter, sort, seed) + backend (entity, DTOs, service mapping, seed).
**Goal:** Track provenance of each item — *who gave it* and *who it currently belongs to* (e.g. "me", "daughter", "wife") — as two new columns in the item list, filterable and sortable.

## 1. Confirmed decisions

| Question | Decision |
| --- | --- |
| Input type | **Free text** — plain text fields, type anything (no fixed dropdown, no datalist suggestions). |
| Required? | **Optional / nullable** — both fields may be blank on any item. No new required-validation. |
| Filter & sort | **Yes** — add both to the filter bar (dropdown of existing values) and make both column headers click-to-sort. |
| Naming | `givenBy` / `belongsTo` (JSON + Java), `given_by` / `belongs_to` (DB columns). |

> Semantics: **Given By** = the person who gave/purchased the item for someone. **Belongs To** = the person the item is currently for/owned by (me, wife, daughter, son, …). Both are free-form person names, independent of each other (e.g. Given By "Mother-in-law", Belongs To "Wife").

## 2. Out of scope (for this change)

- Backend query-param filtering for the new fields. The UI already does **all** filtering/sorting client-side in `ItemList.tsx` (it calls `getItems()` with no params today), so the new filter/sort follows that same pattern and needs **no** controller/repository/JPQL changes.
- Dashboard stat cards, charts, or per-person value rollups (possible future work).
- A dedicated "people" entity/relationship — deliberately kept as simple free-text columns per the "free text" decision.

## 3. Data model

- Add two `String` fields to the item, **nullable**, each `@Size(max = 100)`.
- DB columns `given_by` and `belongs_to` (explicitly named; `belongs_to` is explicitly mapped so the reserved-word-ish base `BELONGS` is never emitted raw — the snake_case column is safe in MariaDB).
- Schema is created via `spring.jpa.hibernate.ddl-auto=update`, so the two **nullable** columns are added automatically to existing databases. **No manual migration / down-script needed** because both are nullable.

---

## 4. Backend changes

### 4.1 Entity — `backend/src/main/java/com/jeweltrack/backend/entity/JewelleryItem.java`
Add two fields + getters/setters (near `remarks`):
```java
@Size(max = 100)
@Column(name = "given_by")
private String givenBy;

@Size(max = 100)
@Column(name = "belongs_to")
private String belongsTo;
```

### 4.2 DTO — `backend/src/main/java/com/jeweltrack/backend/dto/JewelleryItemDto.java`
Add `private String givenBy;` and `private String belongsTo;` + getters/setters.

### 4.3 Request DTOs
- `backend/src/main/java/com/jeweltrack/backend/dto/JewelleryItemCreateRequest.java`
- `backend/src/main/java/com/jeweltrack/backend/dto/JewelleryItemUpdateRequest.java`

In **both**, add (optional, no `@NotNull`):
```java
@Size(max = 100)
private String givenBy;

@Size(max = 100)
private String belongsTo;
```
+ getters/setters.

### 4.4 Service mapping — `backend/src/main/java/com/jeweltrack/backend/service/JewelleryItemServiceImpl.java`
Wire the fields through the three mapping points:
- `createItem(...)`: `item.setGivenBy(request.getGivenBy());` `item.setBelongsTo(request.getBelongsTo());`
- `updateItem(...)`: `existing.setGivenBy(request.getGivenBy());` `existing.setBelongsTo(request.getBelongsTo());`
- `toDto(...)`: `dto.setGivenBy(item.getGivenBy());` `dto.setBelongsTo(item.getBelongsTo());`

### 4.5 Seed (optional, recommended) — `backend/src/main/resources/data.sql`
The seed runs only when the table is empty (fresh DBs). Add `given_by`, `belongs_to` to the INSERT column list and give a few items sample values (e.g. Bridal Kundan Set → `given_by` "Father-in-law", `belongs_to` "Wife"); leave the rest `NULL`. Purely illustrative — safe to skip.

> `data.sql` and the frontend `defaultItems` are independent seeds (existing known gap); keep them consistent only where convenient.

---

## 5. Frontend changes

### 5.1 Types — `frontend/src/types.ts`
```ts
export interface JewelleryItem {
  // ...existing fields...
  givenBy: string | null
  belongsTo: string | null
}

export interface FilterParams {
  // ...existing fields...
  givenBy?: string
  belongsTo?: string
}
```

### 5.2 Table, filter & sort — `frontend/src/components/ItemList.tsx`
This file has **both** the table and the active `EditItemModal`.

1. **Filter bar** — add two dropdowns (like the existing Carat one), each with an "Any" default and options derived from the items' distinct non-null values:
   ```ts
   const givenByOptions = useMemo(() =>
     Array.from(new Set(items.map(i => i.givenBy).filter((v): v is string => !!v))).sort((a,b) => a.localeCompare(b)),
   [items])
   const belongsToOptions = useMemo(() =>
     Array.from(new Set(items.map(i => i.belongsTo).filter((v): v is string => !!v))).sort((a,b) => a.localeCompare(b)),
   [items])
   ```
   Bind them to `filter.givenBy` / `filter.belongsTo`.

2. **Client-side filter** — in `filteredItems`, add (consistent with the existing substring style):
   ```ts
   if (filter.givenBy && filter.givenBy.trim()) {
     if (!item.givenBy || !item.givenBy.toLowerCase().includes(filter.givenBy.toLowerCase())) return false
   }
   if (filter.belongsTo && filter.belongsTo.trim()) {
     if (!item.belongsTo || !item.belongsTo.toLowerCase().includes(filter.belongsTo.toLowerCase())) return false
   }
   ```
   (Items with a blank field are excluded when that filter is active — correct "show all items that belong to Wife" behaviour.)

3. **Sort** — extend the `sortConfig` `switch`:
   ```ts
   case 'givenBy':
     comparison = (item.givenBy ?? '').localeCompare(b.givenBy ?? '') // use a./b.
     break
   case 'belongsTo':
     comparison = (a.belongsTo ?? '').localeCompare(b.belongsTo ?? '')
     break
   ```
   (Blank values sort to the top in `asc`.)

4. **Header column list** — insert the two new sortable columns (suggested order, before Remarks):
   ```ts
   { label: 'Name', field: 'name' },
   { label: 'Type', field: 'type' },
   { label: 'Carat', field: 'carat' },
   { label: 'Weight (g)', field: 'weightGrams' },
   { label: 'Amount (S$)', field: 'amountSpent' },
   { label: 'Belongs To', field: 'belongsTo' },   // new
   { label: 'Given By', field: 'givenBy' },         // new
   { label: 'Remarks', field: 'remarks' },
   { label: 'Added', field: 'createdAt' },
   ```
   ⚠️ **`colSpan`** on the "No items found" row must change from `colSpan={8}` → **`colSpan={10}`** (2 more data columns).

5. **Row cells** — add two `<td>` (with a blank/"—" fallback for null), placed to match the header order:
   ```tsx
   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
     {item.belongsTo || <span className="text-gray-300">—</span>}
   </td>
   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
     {item.givenBy || <span className="text-gray-300">—</span>}
   </td>
   ```

6. **`EditItemModal`** (in the same file) — add `givenBy` and `belongsTo` to `formData` (init from `item`), include them in the `onSubmit` payload as `formData.givenBy.trim() || null` / `formData.belongsTo.trim() || null`, and render two **optional** text inputs (label "Belongs To (optional)", "Given By (optional)"). No required marker, no validation rule.

### 5.3 Add form — `frontend/src/components/AddItemModal.tsx`
- `formData`: add `givenBy: ''`, `belongsTo: ''`.
- `resetForm()`: add the same two as `''`.
- `useEffect` populate-from-`initialData`: add `givenBy: initialData.givenBy ?? ''`, `belongsTo: initialData.belongsTo ?? ''`.
- `handleSubmit` payload: add `givenBy: formData.givenBy.trim() || null`, `belongsTo: formData.belongsTo.trim() || null`.
- Render two **optional** text inputs (no `*`), placed near Remarks.

### 5.4 Mock seed — `frontend/src/api/jewelleryService.ts`
- **`defaultItems`:** (optional, recommended) add sample `givenBy`/`belongsTo` to a few items (e.g. id 1 → `givenBy: "Father-in-law"`, `belongsTo: "Wife"`) so the new columns are visible on a fresh mock. Give the rest `null` / omit.
- **`MockJewelleryService`:** no code change needed — `createItem`/`updateItem` use object spread, so the new fields flow through once they're on the type. (Optionally mirror the two new fields in `getItems` filter/sort for parity, but the UI filters client-side, so this is not required.)

### 5.5 No changes needed (verify only)
- `frontend/src/api/httpClient.ts` — `createItem`/`updateItem` send the full object as JSON; new camelCase fields serialize automatically. ✅
- `frontend/src/hooks/useJewelleryService.ts` — generic; `items` are stored as returned and `itemData` passed through; no per-field mapping. ✅
- `backend/.../controller/JewelleryItemController.java` and `repository/...` — unchanged (filter/sort are client-side). ✅

---

## 6. Backward compatibility & migration

- **Backend:** `ddl-auto=update` adds two nullable columns to existing DBs automatically. Old rows get `NULL`. No data migration required.
- **Frontend mock / localStorage:** existing items saved under key `jeweltrack_items` won't have the fields → they'll render blank and be excluded when the new filters are active. This is acceptable and non-breaking. (New items will carry the fields.)
- **Validation:** because both are optional and nullable, no `@NotNull` anywhere; empty submissions are valid.

## 7. Verification checklist

1. **Type-check/build:** `cd frontend && npm run build` (tsc + vite). `cd backend && mvn clean package`.
2. **Fresh backend + DB:** `docker compose up -d db`, start backend, confirm `given_by`/`belongs_to` columns exist (`DESCRIBE jewellery_items`).
3. **Round-trip (backend on):** Add an item with Given By + Belongs To via the UI → confirm it's persisted (DB row) and returned (Network → `/items` JSON shows `givenBy`/`belongsTo`).
4. **Round-trip (mock/offline):** With backend down, add/edit items and confirm values persist to `localStorage` and survive reload.
5. **Edit:** Open EditItemModal on an item with values → pre-filled → change → save → persisted.
6. **Blank:** Save an item with both blank → allowed, renders "—".
7. **Filter:** Filter by Belongs To "Wife" → only matching rows; "Any" resets. Same for Given By.
8. **Sort:** Click both new headers → toggles asc/desc, blank values group to top (asc).
9. **Empty-state row:** With no items, the placeholder spans all 10 columns.

## 8. Files touched (checklist)

**Backend**
- [x] `backend/src/main/java/com/jeweltrack/backend/entity/JewelleryItem.java`
- [x] `backend/src/main/java/com/jeweltrack/backend/dto/JewelleryItemDto.java`
- [x] `backend/src/main/java/com/jeweltrack/backend/dto/JewelleryItemCreateRequest.java`
- [x] `backend/src/main/java/com/jeweltrack/backend/dto/JewelleryItemUpdateRequest.java`
- [x] `backend/src/main/java/com/jeweltrack/backend/service/JewelleryItemServiceImpl.java`
- [x] `backend/src/main/resources/data.sql` _(optional)_

**Frontend**
- [x] `frontend/src/types.ts`
- [x] `frontend/src/components/ItemList.tsx`  (table + filter + sort + EditItemModal + `colSpan`)
- [x] `frontend/src/components/AddItemModal.tsx`
- [x] `frontend/src/api/jewelleryService.ts`  _(optional seed sample)_

**Also (unrelated, pre-existing bug fix)**
- [x] `backend/src/main/resources/application.properties` — removed a leading space in the `DB_USER` default (`${DB_USER: jewel}` → `${DB_USER:jewel}`) that caused `Access denied` for a bare `java -jar` run (masked in Docker).

**No change:** `httpClient.ts`, `useJewelleryService.ts`, controller, repository.

## 9. Risks / notes
- **Free-text inconsistency:** "Daughter" vs "daughter" won't be grouped automatically. Mitigated by case-insensitive filter and value dropdowns (derived from existing values). Acceptable per the "free text" decision.
- **Column count:** Forgetting the `colSpan` update (8 → 10) is the easiest way to introduce a visible bug — flag it in review.
- **Reserved word:** Always map `belongsTo` → `belongs_to` explicitly (done via `@Column`), never emit the bare `BELONGS`.
- **Seeds diverge:** `data.sql` and `defaultItems` are already independent; keep the new sample values reasonable in both, but don't force parity.
