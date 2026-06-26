/* =====================================================================
   AL-EEMAN SCHOOL OF SCIENCE AND ARABIC STUDIES
   FEES DATA SOURCE FILE
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to add, remove, or update a
   fee schedule. Everything is plain JavaScript objects/arrays — no HTML
   editing required. The fee modal (fees-modal.js) reads this file and
   builds the whole UI automatically.

   HOW TO ADD A NEW BILL
   ----------------------
   1. Copy any object inside FEES_DATA.categories[].bills[] below.
   2. Change "id" to something unique (e.g. "new-bill-2027").
   3. Change "title" to what should appear in the menu.
   4. Fill "columns" with the column headers (e.g. ["Male","Female"]).
      Use a single column called "Amount" for bills with one price list.
   5. Fill "rows" — each row is { label: "Item name", values: [..] }
      "values" must have the same length as "columns".
   6. Add a "total" row the same way if needed, or set showTotal:true
      and totals:[...] to auto-render a highlighted total row.
   7. Add any "notes" (array of strings) — shown under the table.
   8. Add "account" info if the bill has its own payment account,
      otherwise it will fall back to FEES_DATA.defaultAccount.

   Currency: amounts are stored as plain numbers (no commas/symbols).
   The renderer formats them with the Naira sign and thousands commas.
   ===================================================================== */

const FEES_DATA = {
  schoolName: "AL-EEMAN SCHOOL OF SCIENCE AND ARABIC STUDIES",
  session: "2025/2026 Academic Session",
  currencySymbol: "₦",

  /* Used when a bill object does not specify its own "account" */
  defaultAccount: {
    name: "Sulawal Merit Nigeria Limited / Aleemanschoolofscience",
    number: "2029687516",
    bank: "First Bank"
  },

  /* Generic notes shown at the bottom of every bill unless the bill
     supplies its own "notes" array */
  defaultNotes: [
    "Please ensure you come along with your teller / payment evidence.",
    "May Allah bless you."
  ],

  /* ===================================================================
     CATEGORIES — each becomes a tab / group in the fee modal menu.
     =================================================================== */
  categories: [
    {
      id: "secondary-boarding",
      label: "Secondary School (Boarding)",
      icon: "fa-school",
      bills: [
        {
          id: "returning-senior-boarding",
          title: "Returning Senior Student (Boarding)",
          subtitle: "Senior Secondary · Boarding · Returning Students",
          columns: ["Amount"],
          rows: [
            { label: "School Fee", values: [106000] },
            { label: "Feeding Fee", values: [206100] },
            { label: "Accommodation Fee & Other Charges", values: [30000] },
            { label: "First Aid", values: [6000] },
            { label: "ID Card", values: [3000] }
          ],
          showTotal: true,
          totals: [351100],
          notes: [
            "Hair cut costs ₦2,000 for male and plaiting of hair costs ₦5,000 for female per term.",
            "Kindly pay this in cash to the school bursar on resumption.",
            "All other fees should be paid into the account below.",
            "Please ensure you come along with your teller.",
            "May Allah bless you."
          ]
        },
        {
          id: "returning-junior-boarding",
          title: "Returning Student (Junior Secondary, Boarding)",
          subtitle: "Junior Secondary School · Boarding · Returning Students",
          columns: ["Amount"],
          rows: [
            { label: "School Fee", values: [104000] },
            { label: "Feeding Fee", values: [206100] },
            { label: "Accommodation & Other Services", values: [20000] },
            { label: "First Aid", values: [6000] },
            { label: "ID Card", values: [3000] }
          ],
          showTotal: true,
          totals: [339100],
          notes: [
            "You are expected to pay at least 70% of the whole fee on or before resumption.",
            "Cash payment is not allowed.",
            "Hair cut for boys costs ₦2,000 per term and plaiting of hair costs ₦5,000 for girls per term."
          ]
        },
        {
          id: "new-intake-junior-boarding",
          title: "New In-Take Student (Junior Secondary, Boarding)",
          subtitle: "Junior Secondary School · Boarding · New Students",
          columns: ["Male", "Female"],
          rows: [
            { label: "School Fee", values: [104000, 104000] },
            { label: "Feeding Fee", values: [206100, 206100] },
            { label: "Accommodation & Other Charges", values: [26000, 26000] },
            { label: "First Aid", values: [6000, 6000] },
            { label: "A Pair of School Uniform (2)", values: [34000, 40000] },
            { label: "Hostel Wear (2)", values: [30000, 30000] },
            { label: "Friday Wear", values: [17000, 20000] },
            { label: "Cardigan", values: [10000, 10000] },
            { label: "ID Card", values: [3000, 3000] }
          ],
          showTotal: true,
          totals: [436100, 445100],
          notes: [
            "School Form: ₦7,000.",
            "You are expected to pay at least 70% of the whole fee on or before resumption.",
            "Pay to the bank with the account information below.",
            "Cash payment is not allowed.",
            "Hair cut for boys costs ₦2,000 per term and plaiting of hair costs ₦5,000 for girls per term."
          ]
        },
        {
          id: "new-intake-senior-boarding",
          title: "New In-Take Senior Student (Boarding)",
          subtitle: "Senior Secondary School · Boarding · New Students",
          columns: ["Male", "Female"],
          rows: [
            { label: "School Fee", values: [106000, 106000] },
            { label: "A Pair of School Uniform (2)", values: [36000, 44000] },
            { label: "Hostel Wear (2)", values: [32000, 30000] },
            { label: "Cardigan", values: [10000, 10000] },
            { label: "Friday Wear", values: [18000, 20000] },
            { label: "Accommodation Fee & Other Charges", values: [30000, 30000] },
            { label: "Feeding Fee", values: [206100, 206100] },
            { label: "First Aid", values: [6000, 6000] },
            { label: "ID Card", values: [3000, 3000] }
          ],
          showTotal: true,
          totals: [447100, 455100],
          notes: [
            "Form Fee: ₦7,000 (to be paid in cash to VP Admin).",
            "Hair cut costs ₦2,000 for male and plaiting of hair costs ₦5,000 for female per term.",
            "Kindly pay this in cash to school bursar on resumption.",
            "All other fees should be paid into the account below."
          ]
        }
      ]
    },

    {
      id: "secondary-day",
      label: "Secondary School (Day)",
      icon: "fa-user-graduate",
      bills: [
        {
          id: "new-intake-junior-day",
          title: "New In-Take Junior Student's Bill (Day)",
          subtitle: "Junior Secondary School · Day Student",
          columns: ["Male", "Female", "Returning"],
          rows: [
            { label: "School Fee", values: [85000, 85000, 85000] },
            { label: "A Pair of School Uniform (2)", values: [34000, 40000, "-"] },
            { label: "Friday Wear", values: [17000, 20000, "-"] },
            { label: "Cardigan", values: [10000, 10000, "-"] },
            { label: "ID Card", values: [3000, 3000, 3000] },
            { label: "First Aid", values: [3000, 3000, 3000] }
          ],
          showTotal: true,
          totals: [152000, 161000, 91000],
          notes: [
            "Form Fee: ₦7,000 (to be paid to the office of V.P Admin).",
            "Please ensure you come along with your teller.",
            "May Allah bless you."
          ]
        },
        {
          id: "new-intake-senior-day",
          title: "New In-Take Senior Student's Bill (Day)",
          subtitle: "Senior Secondary School · Day Student",
          columns: ["Male", "Female", "Returning"],
          rows: [
            { label: "School Fee", values: [87000, 87000, 87000] },
            { label: "A Pair of School Uniform (2)", values: [36000, 44000, "-"] },
            { label: "Friday Wear", values: [18000, 20000, "-"] },
            { label: "Cardigan", values: [10000, 10000, "-"] },
            { label: "ID Card", values: [3000, 3000, 3000] },
            { label: "First Aid", values: [3000, 3000, 3000] }
          ],
          showTotal: true,
          totals: [157000, 167000, 93000],
          notes: [
            "Form Fee: ₦7,000 (to be paid to the office of V.P Admin).",
            "Please ensure you come along with your teller.",
            "May Allah bless you."
          ]
        }
      ]
    },

    {
      id: "primary",
      label: "Primary School",
      icon: "fa-child",
      bills: [
        {
          id: "returning-primary-boarding",
          title: "Returning Bill for Primary (Boarding)",
          subtitle: "Primary School · Boarding · Returning Students",
          columns: ["Amount"],
          rows: [
            { label: "School Fee", values: [82000] },
            { label: "Feeding Fee", values: [206100] },
            { label: "Accommodation & Other Services", values: [17500] },
            { label: "First Aid", values: [6000] },
            { label: "ID Card", values: [3000] }
          ],
          showTotal: true,
          totals: [314600],
          notes: [
            "Hair cut for boys costs ₦2,000 per term and plaiting of hair costs ₦5,000 for girls per term.",
            "You are expected to pay at least 70% of the whole fee on or before resumption.",
            "Cash payment is not allowed."
          ],
          account: {
            name: "Sulawal Merit Nig. Ltd. / Aleemannurseryandprimaryschool",
            number: "2029687671",
            bank: "First Bank"
          }
        },
        {
          id: "new-intake-primary-boarding",
          title: "New In-Take Bill for Primary (Boarding)",
          subtitle: "Primary School · Boarding · New Students",
          columns: ["Male", "Female"],
          rows: [
            { label: "School Fee", values: [82000, 82000] },
            { label: "Feeding Fee", values: [206100, 206100] },
            { label: "Accommodation & other Services", values: [17500, 17500] },
            { label: "First Aid", values: [6000, 6000] },
            { label: "A Pair of School Uniform (2)", values: [26000, 26000] },
            { label: "Pair of Hostel Wear (2)", values: [28000, 32000] },
            { label: "Friday wear", values: [15000, 18000] },
            { label: "Thursday wear", values: [13000, 16000] },
            { label: "Sport wear", values: [9000, 9000] },
            { label: "Cardigan", values: [10000, 10000] },
            { label: "ID Card", values: [3000, 3000] }
          ],
          showTotal: true,
          totals: [415600, 425600],
          notes: [
            "Additional Information — School Form: ₦7,000.",
            "Hair cut for boys costs ₦2,000 per term and plaiting of hair costs ₦5,000 for girls per term.",
            "You are expected to pay at least 70% of the whole fee on or before resumption.",
            "Cash payment is not allowed."
          ],
          account: {
            name: "Sulawal Merit Nig. Ltd. / Aleemannurseryandprimaryschool",
            number: "2029687671",
            bank: "First Bank"
          },
          materials: {
            title: "Required Material Aspect (Provisions)",
            items: [
              { name: "Ariel / Sunlight detergent", qty: "4kg" },
              { name: "Toothpaste", qty: "2 pieces" },
              { name: "Toothbrush", qty: "1 big size" },
              { name: "Bathing soap", qty: "3 pieces" },
              { name: "Hair brush and comb", qty: "1 each" },
              { name: "Mattress, bed sheet and body cover", qty: "1 set" },
              { name: "Mosquito net", qty: "1" },
              { name: "White socks and Black shoes or sandals", qty: "3 pairs" },
              { name: "A pair of slippers", qty: "1" },
              { name: "Provisions", qty: "as needed" },
              { name: "Writing materials (6 pens and pencils each)", qty: "set" },
              { name: "White caps", qty: "as needed" },
              { name: "Body and hair cream", qty: "2 pairs" },
              { name: "2 pairs of mufti wears", qty: "2" }
            ]
          }
        }
      ]
    }
  ]
};

/* Make available to other scripts (modal renderer) */
if (typeof window !== "undefined") {
  window.FEES_DATA = FEES_DATA;
}