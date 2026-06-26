/* =====================================================================
   AL-EEMAN SCHOOL — FEE STRUCTURE MODAL
   ---------------------------------------------------------------------
   This file ONLY renders what is described in fees-data.js.
   You never need to touch this file to add/remove/update a fee bill —
   just edit js/fees-data.js.

   Public API:
     openFeesModal()          -> opens the modal (used by the "School
                                  Fees" button via onclick="openFeesModal()")
     closeFeesModal()         -> closes it
   ===================================================================== */

(function () {
  "use strict";

  const DATA = window.FEES_DATA;
  let activeCategoryId = null;
  let activeBillId = null;
  let lastFocusedEl = null;

  /* ---------------------------- helpers ---------------------------- */

  function formatMoney(value) {
    if (value === null || value === undefined || value === "" || value === "-") {
      return "—";
    }
    if (typeof value === "string") return value;
    const symbol = (DATA && DATA.currencySymbol) || "₦";
    return symbol + Number(value).toLocaleString("en-NG");
  }

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function findCategory(id) {
    return DATA.categories.find((c) => c.id === id);
  }

  function findBill(category, id) {
    return category.bills.find((b) => b.id === id);
  }

  /* ----------------------------- markup ----------------------------- */

  function buildModalSkeleton() {
    const overlay = el("div", "fm-overlay");
    overlay.id = "feesModalOverlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "School Fee Structure");

    overlay.innerHTML = `
      <div class="fm-modal" role="document">
        <button type="button" class="fm-close" aria-label="Close fee structure">
          <i class="fas fa-times"></i>
        </button>

        <div class="fm-header">
          <div class="fm-header-icon"><i class="fas fa-coins"></i></div>
          <div>
            <h2 class="fm-title">School Fees Structure</h2>
            <p class="fm-subtitle">${DATA.schoolName} &middot; ${DATA.session}</p>
          </div>
        </div>

        <div class="fm-body">
          <nav class="fm-sidebar" aria-label="Fee categories"></nav>
          <div class="fm-content">
            <div class="fm-billlist" aria-label="Available bills"></div>
            <div class="fm-billview"></div>
          </div>
        </div>
      </div>
    `;

    overlay.querySelector(".fm-close").addEventListener("click", closeFeesModal);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeFeesModal();
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function renderSidebar(overlay) {
    const sidebar = overlay.querySelector(".fm-sidebar");
    sidebar.innerHTML = "";

    DATA.categories.forEach((cat) => {
      const btn = el(
        "button",
        "fm-cat-btn" + (cat.id === activeCategoryId ? " active" : ""),
        `<i class="fas ${cat.icon || "fa-folder"}"></i><span>${cat.label}</span>`
      );
      btn.type = "button";
      btn.addEventListener("click", function () {
        activeCategoryId = cat.id;
        activeBillId = cat.bills[0] ? cat.bills[0].id : null;
        renderSidebar(overlay);
        renderBillList(overlay);
        renderBillView(overlay);
      });
      sidebar.appendChild(btn);
    });
  }

  function renderBillList(overlay) {
    const listWrap = overlay.querySelector(".fm-billlist");
    listWrap.innerHTML = "";
    const category = findCategory(activeCategoryId);
    if (!category) return;

    const heading = el("div", "fm-billlist-title", category.label);
    listWrap.appendChild(heading);

    const chipRow = el("div", "fm-chip-row");
    category.bills.forEach((bill) => {
      const chip = el(
        "button",
        "fm-chip" + (bill.id === activeBillId ? " active" : ""),
        bill.title
      );
      chip.type = "button";
      chip.addEventListener("click", function () {
        activeBillId = bill.id;
        renderBillList(overlay);
        renderBillView(overlay);
      });
      chipRow.appendChild(chip);
    });
    listWrap.appendChild(chipRow);
  }

  function renderBillView(overlay) {
    const view = overlay.querySelector(".fm-billview");
    view.innerHTML = "";

    const category = findCategory(activeCategoryId);
    if (!category) return;
    const bill = findBill(category, activeBillId);
    if (!bill) {
      view.appendChild(el("p", "fm-empty", "Select a bill to view details."));
      return;
    }

    /* Header */
    const header = el("div", "fm-bill-header");
    header.innerHTML = `
      <h3>${bill.title}</h3>
      ${bill.subtitle ? `<p class="fm-bill-subtitle">${bill.subtitle}</p>` : ""}
    `;
    view.appendChild(header);

    /* Table */
    const tableWrap = el("div", "fm-table-wrap");
    const table = el("table", "fm-table");

    const thead = el("thead");
    const headRow = el("tr");
    headRow.appendChild(el("th", "fm-th-item", "Item"));
    bill.columns.forEach((colName) => {
      headRow.appendChild(el("th", "fm-th-amount", colName));
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = el("tbody");
    bill.rows.forEach((row) => {
      const tr = el("tr");
      tr.appendChild(el("td", "fm-td-item", row.label));
      row.values.forEach((v) => {
        tr.appendChild(el("td", "fm-td-amount", formatMoney(v)));
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    if (bill.showTotal && bill.totals) {
      const tfoot = el("tfoot");
      const tr = el("tr", "fm-total-row");
      tr.appendChild(el("td", "fm-td-item", "Total"));
      bill.totals.forEach((v) => {
        tr.appendChild(el("td", "fm-td-amount", formatMoney(v)));
      });
      tfoot.appendChild(tr);
      table.appendChild(tfoot);
    }

    tableWrap.appendChild(table);
    view.appendChild(tableWrap);

    /* Optional material/provisions checklist */
    if (bill.materials && bill.materials.items && bill.materials.items.length) {
      const matWrap = el("div", "fm-materials");
      matWrap.appendChild(el("h4", "", bill.materials.title || "Required Materials"));
      const grid = el("div", "fm-materials-grid");
      bill.materials.items.forEach((item) => {
        grid.appendChild(
          el(
            "div",
            "fm-material-item",
            `<i class="fas fa-check-circle"></i><span>${item.name}</span><em>${item.qty || ""}</em>`
          )
        );
      });
      matWrap.appendChild(grid);
      view.appendChild(matWrap);
    }

    /* Notes */
    const notes = bill.notes && bill.notes.length ? bill.notes : DATA.defaultNotes;
    if (notes && notes.length) {
      const notesBox = el("div", "fm-notes");
      notesBox.appendChild(el("h4", "", "<i class=\"fas fa-info-circle\"></i> Notes"));
      const ul = el("ul");
      notes.forEach((n) => ul.appendChild(el("li", "", n)));
      notesBox.appendChild(ul);
      view.appendChild(notesBox);
    }

    /* Payment account */
    const account = bill.account || DATA.defaultAccount;
    if (account) {
      const accBox = el("div", "fm-account");
      accBox.innerHTML = `
        <h4><i class="fas fa-university"></i> Payment Account</h4>
        <div class="fm-account-grid">
          <div><span>Account Name</span><strong>${account.name}</strong></div>
          <div><span>Account Number</span><strong>${account.number}</strong></div>
          <div><span>Bank</span><strong>${account.bank}</strong></div>
        </div>
      `;
      view.appendChild(accBox);
    }

    /* Actions */
    const actions = el("div", "fm-actions");
    const printBtn = el("button", "fm-action-btn", '<i class="fas fa-print"></i> Print / Save as PDF');
    printBtn.type = "button";
    printBtn.addEventListener("click", function () {
      printBill(bill, category);
    });
    actions.appendChild(printBtn);
    view.appendChild(actions);
  }

  function printBill(bill, category) {
    const account = bill.account || DATA.defaultAccount;
    const notes = bill.notes && bill.notes.length ? bill.notes : DATA.defaultNotes;

    let rowsHtml = bill.rows
      .map(
        (row) =>
          `<tr><td>${row.label}</td>${row.values.map((v) => `<td>${formatMoney(v)}</td>`).join("")}</tr>`
      )
      .join("");

    let totalHtml = "";
    if (bill.showTotal && bill.totals) {
      totalHtml = `<tr class="total"><td>Total</td>${bill.totals
        .map((v) => `<td>${formatMoney(v)}</td>`)
        .join("")}</tr>`;
    }

    const win = window.open("", "_blank", "width=720,height=900");
    win.document.write(`
      <html>
      <head>
        <title>${bill.title}</title>
        <style>
          body{font-family:Arial,Helvetica,sans-serif;color:#222;padding:30px;}
          h1{font-size:18px;text-align:center;margin-bottom:4px;}
          .sub{text-align:center;color:#555;margin-bottom:20px;font-size:13px;}
          table{width:100%;border-collapse:collapse;margin-bottom:18px;}
          th,td{border:1px solid #ccc;padding:8px 10px;text-align:left;font-size:13px;}
          th{background:#2E8B57;color:#fff;}
          tr.total td{font-weight:bold;background:#f1f8f4;}
          ul{font-size:12.5px;line-height:1.5;}
          .acc{margin-top:10px;font-size:13px;}
          .acc strong{display:inline-block;min-width:140px;}
        </style>
      </head>
      <body>
        <h1>${DATA.schoolName}</h1>
        <div class="sub">${bill.title} &middot; ${category.label} &middot; ${DATA.session}</div>
        <table>
          <thead><tr><th>Item</th>${bill.columns.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
          <tbody>${rowsHtml}${totalHtml}</tbody>
        </table>
        <h3>Notes</h3>
        <ul>${notes.map((n) => `<li>${n}</li>`).join("")}</ul>
        <div class="acc">
          <div><strong>Account Name:</strong> ${account.name}</div>
          <div><strong>Account Number:</strong> ${account.number}</div>
          <div><strong>Bank:</strong> ${account.bank}</div>
        </div>
        <script>window.onload = function(){ window.print(); };</script>
      </body>
      </html>
    `);
    win.document.close();
  }

  /* ----------------------------- public ----------------------------- */

  function openFeesModal() {
    if (!DATA || !DATA.categories || !DATA.categories.length) {
      console.error("FEES_DATA is missing or empty. Check that fees-data.js loaded before fees-modal.js");
      return;
    }

    lastFocusedEl = document.activeElement;

    let overlay = document.getElementById("feesModalOverlay");
    if (!overlay) overlay = buildModalSkeleton();

    if (!activeCategoryId) {
      activeCategoryId = DATA.categories[0].id;
      activeBillId = DATA.categories[0].bills[0] ? DATA.categories[0].bills[0].id : null;
    }

    renderSidebar(overlay);
    renderBillList(overlay);
    renderBillView(overlay);

    document.body.classList.add("fm-lock-scroll");
    requestAnimationFrame(function () {
      overlay.classList.add("fm-open");
    });

    overlay.querySelector(".fm-close").focus();
    document.addEventListener("keydown", handleKeydown);
  }

  function closeFeesModal() {
    const overlay = document.getElementById("feesModalOverlay");
    if (!overlay) return;
    overlay.classList.remove("fm-open");
    document.body.classList.remove("fm-lock-scroll");
    document.removeEventListener("keydown", handleKeydown);
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  }

  function handleKeydown(e) {
    if (e.key === "Escape") closeFeesModal();
  }

  /* Expose to global scope so the button's onclick can reach it */
  window.openFeesModal = openFeesModal;
  window.closeFeesModal = closeFeesModal;
})();