# How to Add, Update, or Remove Fees — Step-by-Step Guide

Everything about the fee structure lives in **one file**:

```
js/fees-data.js
```

You never need to touch `fees-modal.js`, the CSS, or the HTML. Just edit
`fees-data.js`, save, refresh the page. That's it.

This guide shows you exactly how to do every kind of change, with copy‑paste
examples.

---

## 1. The Big Picture — How the File Is Organized

```
FEES_DATA
  └── categories  (an array — these become the sidebar tabs, e.g. "Primary School")
        └── bills (an array inside each category — these become the chips/buttons,
                    e.g. "Returning Bill for Primary (Boarding)")
              └── rows (the actual line items: School Fee, Feeding Fee, etc.)
```

So there are **3 levels**:

1. **Category** → a tab in the left sidebar (e.g. "Primary School", "Secondary School (Day)")
2. **Bill** → a chip/button inside a category (e.g. "New In-Take Bill for Primary")
3. **Row** → one line in the fee table (e.g. "School Fee … ₦82,000")

---

## 2. Adding a New ROW to an Existing Bill (most common change)

This is for when a bill already exists, and you just want to add or change a
line item — e.g. adding "Sports Wear Fee".

**Find the bill** inside `fees-data.js` (use Ctrl+F / Cmd+F and search for its
title, e.g. `"Returning Bill for Primary"`). You'll see something like:

```js
rows: [
  { label: "School Fee", values: [82000] },
  { label: "Feeding Fee", values: [206100] },
  { label: "Accommodation & Other Services", values: [17500] },
  { label: "First Aid", values: [6000] },
  { label: "ID Card", values: [3000] }
],
showTotal: true,
totals: [314600],
```

To add a new row, just add a new line with a comma after the previous one:

```js
rows: [
  { label: "School Fee", values: [82000] },
  { label: "Feeding Fee", values: [206100] },
  { label: "Accommodation & Other Services", values: [17500] },
  { label: "First Aid", values: [6000] },
  { label: "ID Card", values: [3000] },
  { label: "Sports Wear Fee", values: [4000] }      // <-- NEW ROW
],
showTotal: true,
totals: [318600],   // <-- don't forget to update the total!
```

**Important:** the number of values inside `values: [...]` must match the
number of columns the bill has.
- If the bill has **one column** ("Amount") → `values: [4000]`
- If the bill has **two columns** ("Male", "Female") → `values: [4000, 5000]`
- If the bill has **three columns** ("Male", "Female", "Returning") → `values: [4000, 5000, 3000]`

Check the `columns:` line right above `rows:` to see how many you need.

### Removing a row
Just delete that line (the whole `{ label: ..., values: [...] },` line) and
update the `totals:` to match.

### Changing an amount
Just change the number inside `values: [ ]`. E.g. school fee increased from
82,000 to 90,000:

```js
{ label: "School Fee", values: [90000] },
```

Then update `totals:` to reflect the new total.

---

## 3. Adding a Brand-New BILL to an Existing Category

Example: you want to add a "New In-Take Bill for Senior Secondary (Day)" and
it belongs under the existing **"Secondary School (Day)"** category.

1. Find the category block — search for `id: "secondary-day"`.
2. Inside it you'll see `bills: [ ... ]`. Add a new bill object **inside that
   array**, separated by a comma from the one before it:

```js
{
  id: "secondary-day",
  label: "Secondary School (Day)",
  icon: "fa-user-graduate",
  bills: [
    { /* existing bill 1 */ },
    { /* existing bill 2 */ },

    /* ============ PASTE YOUR NEW BILL HERE ============ */
    {
      id: "new-bill-unique-id-2027",            // must be unique across the whole file
      title: "New Bill Title Shown To Users",
      subtitle: "Short description shown under the title",
      columns: ["Male", "Female"],               // or ["Amount"], or 3 columns, etc.
      rows: [
        { label: "School Fee", values: [90000, 95000] },
        { label: "Uniform", values: [20000, 25000] }
      ],
      showTotal: true,
      totals: [110000, 120000],
      notes: [
        "Add any special notes for this bill here.",
        "One sentence per line."
      ]
      // "account" is optional — if you skip it, it uses the default
      // First Bank account already set up in defaultAccount at the top of the file.
    }
    /* ==================================================== */
  ]
}
```

3. Save the file. The new bill will automatically appear as a new chip under
   "Secondary School (Day)" — no other file needs to change.

### Template you can always copy-paste for a new bill:

```js
{
  id: "REPLACE_WITH_UNIQUE_ID",
  title: "REPLACE WITH TITLE",
  subtitle: "REPLACE WITH SHORT SUBTITLE",
  columns: ["Amount"],
  rows: [
    { label: "School Fee", values: [0] }
  ],
  showTotal: true,
  totals: [0],
  notes: [
    "Note 1",
    "Note 2"
  ]
}
```

---

## 4. Adding a Brand-New CATEGORY (a whole new sidebar tab)

Example: you want to add a tab for "Nursery School".

Find the very end of the `categories: [ ... ]` array (search for the last
`}` right before the closing `]` and `};` near the bottom of the file). Add a
comma after the last category's closing `}`, then paste a new category:

```js
categories: [
  { /* secondary-boarding category */ },
  { /* secondary-day category */ },
  { /* primary category */ },

  /* ============ PASTE YOUR NEW CATEGORY HERE ============ */
  {
    id: "nursery",                     // must be unique
    label: "Nursery School",           // shown in the sidebar
    icon: "fa-baby",                   // any Font Awesome icon name
    bills: [
      {
        id: "nursery-returning",
        title: "Returning Bill for Nursery",
        subtitle: "Nursery School · Returning Students",
        columns: ["Amount"],
        rows: [
          { label: "School Fee", values: [60000] },
          { label: "Feeding Fee", values: [150000] }
        ],
        showTotal: true,
        totals: [210000],
        notes: ["Pay 70% before resumption."]
      }
    ]
  }
  /* ======================================================== */
]
```

The new "Nursery School" tab will now show up automatically in the sidebar
with its own bill(s).

**Tip on icons:** any icon name from Font Awesome works (the site already
loads Font Awesome). Browse free icons at https://fontawesome.com/icons and
use the name shown there with `fa-` in front, e.g. `fa-baby`, `fa-bus`,
`fa-book`.

---

## 5. Removing Things

| To remove...        | Do this |
|----------------------|---------|
| One row/line item    | Delete its `{ label: ..., values: [...] },` line, then fix `totals:` |
| One whole bill       | Delete the entire `{ id: ..., title: ..., ... }` block for that bill (from its opening `{` to its closing `}`, including the comma after it) |
| One whole category   | Delete the entire `{ id: ..., label: ..., bills: [...] }` block for that category |

**Always double-check commas** after deleting something. JavaScript needs a
comma between items in a list but NOT after the very last item. If you delete
the last bill in a list and it had a comma before it, remove that trailing
comma too. (See the "Common Mistakes" section below for what this looks like.)

---

## 6. Changing the Notes Section

Each bill has its own `notes:` array. Each line is one bullet point shown
under the table:

```js
notes: [
  "Hair cut costs ₦2,000 for male and plaiting of hair costs ₦5,000 for female.",
  "Kindly pay this in cash to the school bursar on resumption.",
  "May Allah bless you."
]
```

Add a new note → add a new line ending with a comma (except the last one).
Remove a note → delete that line.

If a bill has **no** `notes:` field at all, it will automatically use the
`defaultNotes` list near the top of the file instead.

---

## 7. Changing the Bank Account

There's one shared default account near the very top of the file:

```js
defaultAccount: {
  name: "Sulawal Merit Nigeria Limited / Aleemanschoolofscience",
  number: "2029687516",
  bank: "First Bank"
}
```

Every bill uses this unless it has its own `account: { ... }` field (some
Primary School bills do, since they use a different account number). To give
one specific bill its own account, add this inside that bill object:

```js
account: {
  name: "Account Name Here",
  number: "0123456789",
  bank: "Bank Name Here"
}
```

To remove a bill-specific account (so it falls back to the shared default),
just delete that bill's `account: { ... }` block.

---

## 8. Common Mistakes to Avoid

1. **Forgetting a comma between items.**
   Every item in a list (`rows`, `bills`, `categories`, `notes`) needs a comma
   after it — except the very last one.

   ✅ Correct:
   ```js
   rows: [
     { label: "A", values: [1000] },
     { label: "B", values: [2000] }
   ]
   ```
   ❌ Wrong (missing comma after first row):
   ```js
   rows: [
     { label: "A", values: [1000] }
     { label: "B", values: [2000] }
   ]
   ```

2. **Mismatched columns and values.**
   If `columns: ["Male", "Female"]` (2 columns), every row's `values` must
   also have exactly 2 numbers: `values: [1000, 1200]`. If you only put one
   number, the table will show a blank cell.

3. **Duplicate `id` values.**
   Every category and every bill needs its OWN unique `id` (the `id: "..."`
   field). Never copy a bill/category and forget to change its `id` — this
   can make the menu behave oddly.

4. **Missing quotation marks.**
   Text values always need double quotes: `"like this"`. Numbers do not:
   `82000` (no quotes, no commas inside the number itself).

5. **Forgetting to update `totals:` after changing rows.**
   The total is NOT calculated automatically — you must type the correct
   total yourself after adding/removing/changing a row.

---

## 9. How to Test Your Change Safely

After editing `fees-data.js`:

1. Save the file.
2. Open `admissions/index.html` in your browser (or refresh the live site).
3. Click **"View Full Fee Structure."**
4. Check your category/bill appears, the numbers are correct, and the total
   matches.

If the modal doesn't open or looks broken after an edit, it's almost always
one of the "Common Mistakes" above (usually a missing/extra comma). Open your
browser's developer console (press F12 → "Console" tab) — it will usually
point to the exact line number with the problem.

---

## 10. Quick Cheat Sheet

```js
/* ONE NEW ROW (inside an existing bill's "rows" array) */
{ label: "New Item Name", values: [AMOUNT] },

/* ONE NEW BILL (inside an existing category's "bills" array) */
{
  id: "unique-id-here",
  title: "Bill Title",
  subtitle: "Short subtitle",
  columns: ["Amount"],
  rows: [
    { label: "School Fee", values: [0] }
  ],
  showTotal: true,
  totals: [0],
  notes: ["Note here."]
},

/* ONE NEW CATEGORY (inside FEES_DATA.categories array) */
{
  id: "unique-category-id",
  label: "Category Name (shown in sidebar)",
  icon: "fa-icon-name",
  bills: [
    /* one or more bill objects from the template above */
  ]
},
```

That's everything — copy, paste, edit the text/numbers, save, refresh.