/**
 * ECA.UI — shared chrome: sidebar, topbar user chip, toasts, confirm modal.
 */

ECA.UI = (function () {
  const STUDENT_NAV = [
    { href: "dashboard.html", label: "Dashboard", icon: "▢" },
    { href: "dashboard.html#my-courses", label: "My Courses", icon: "▤" },
    { href: "profile.html", label: "Profile", icon: "◐" },
  ];

  const ADMIN_NAV = [
    { href: "index.html", label: "Dashboard", icon: "▢" },
    { href: "courses.html", label: "Courses", icon: "▤" },
    { href: "modules.html", label: "Modules", icon: "☰" },
    { href: "videos.html", label: "Videos", icon: "▶" },
    { href: "students.html", label: "Students", icon: "◍" },
    { href: "settings.html", label: "Settings", icon: "⚙" },
  ];

  function initials(name) {
    return (name || "?")
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function renderShell(opts) {
    // opts: { role: 'student'|'admin', active: 'dashboard.html', user, title, sub }
    const isAdmin = opts.role === "admin";
    const nav = isAdmin ? ADMIN_NAV : STUDENT_NAV;
    const base = isAdmin ? "" : "";
    const logoutHref = isAdmin ? "../login.html" : "login.html";
    const homeHref = isAdmin ? "../index.html" : "index.html";

    const navHtml = nav
      .map((item) => {
        const activeClass = item.href.split("#")[0] === opts.active ? "active" : "";
        return `<a href="${item.href}" class="${activeClass}"><span>${item.icon}</span>${item.label}</a>`;
      })
      .join("");

    const sidebarHtml = `
      <aside class="eca-sidebar" id="ecaSidebar">
        <a href="${homeHref}" class="eca-brand">
          <span class="mark">E</span>
          <span class="word">ENJOY CREATOR<small>ACADEMY™${isAdmin ? " · ADMIN" : ""}</small></span>
        </a>
        <nav class="eca-nav">${navHtml}</nav>
        <div class="eca-nav-foot">
          <a href="#" id="ecaLogoutLink">⏻ Logout</a>
        </div>
      </aside>`;

    const el = document.getElementById("ecaSidebarMount");
    if (el) el.outerHTML = sidebarHtml;

    const chip = document.getElementById("ecaUserChip");
    if (chip) {
      chip.innerHTML = `
        <span class="avatar">${initials(opts.user.name)}</span>
        <span>
          <span class="name" style="display:block;">${opts.user.name}</span>
          <span class="role">${opts.user.role === "admin" ? "Administrator" : "Student"}</span>
        </span>`;
    }

    const titleEl = document.getElementById("ecaPageTitle");
    if (titleEl && opts.title) titleEl.textContent = opts.title;
    const subEl = document.getElementById("ecaPageSub");
    if (subEl && opts.sub) subEl.textContent = opts.sub;

    document.getElementById("ecaLogoutLink").addEventListener("click", function (e) {
      e.preventDefault();
      ECA.Auth.logout();
    });

    const toggle = document.getElementById("ecaMobileToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        document.getElementById("ecaSidebar").classList.toggle("open");
      });
    }
  }

  function toast(message, type) {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    const t = document.createElement("div");
    t.className = "toast" + (type === "error" ? " error" : "");
    t.textContent = message;
    stack.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  function confirmModal(opts) {
    // opts: { title, body, confirmLabel, danger, onConfirm }
    let overlay = document.getElementById("ecaConfirmOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "ecaConfirmOverlay";
      overlay.className = "modal-overlay";
      overlay.hidden = true;
      overlay.innerHTML = `
        <div class="modal">
          <h3 id="ecaConfirmTitle"></h3>
          <div class="modal-body" id="ecaConfirmBody"></div>
          <div class="modal-actions">
            <button class="btn btn-ghost" id="ecaConfirmCancel">Cancel</button>
            <button class="btn" id="ecaConfirmOk"></button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
    }
    overlay.querySelector("#ecaConfirmTitle").textContent = opts.title;
    overlay.querySelector("#ecaConfirmBody").textContent = opts.body;
    const okBtn = overlay.querySelector("#ecaConfirmOk");
    okBtn.textContent = opts.confirmLabel || "Confirm";
    okBtn.className = "btn " + (opts.danger ? "btn-danger" : "btn-primary");
    overlay.hidden = false;

    function close() {
      overlay.hidden = true;
      okBtn.removeEventListener("click", onOk);
    }
    function onOk() {
      close();
      opts.onConfirm && opts.onConfirm();
    }
    okBtn.addEventListener("click", onOk);
    overlay.querySelector("#ecaConfirmCancel").onclick = close;
    overlay.onclick = function (e) {
      if (e.target === overlay) close();
    };
  }

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  return { renderShell, toast, confirmModal, initials, esc };
})();
