const ECA_SESSION_KEY = "eca_session_v1";

ECA.Auth = (function () {

  // =========================================================
  // FORCE / MIGRATE ADMIN ACCOUNT
  // =========================================================
  function ensureAdminAccount() {
    const db = ECA.load();

    if (!db.users) {
      db.users = [];
    }

    const adminEmail = "srirammarudhaiyappan45@gmail.com";
    const adminPassword = "Sriram Ceo Eca";

    let admin = db.users.find(
      (u) =>
        String(u.email || "").trim().toLowerCase() ===
        adminEmail.toLowerCase()
    );

    if (!admin) {
      admin = {
        id: "user_admin_sriram",
        name: "B. Sriram Marudhaiyappan",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        status: "active",
        avatar: "",
        created_at: ECA.nowISO(),
        last_login: null
      };

      db.users.push(admin);
    } else {
      admin.name = "B. Sriram Marudhaiyappan";
      admin.email = adminEmail;
      admin.password = adminPassword;
      admin.role = "admin";
      admin.status = "active";
    }

    ECA.save(db);

    return admin;
  }


  // =========================================================
  // CURRENT USER
  // =========================================================
  function currentUser() {
    const raw = sessionStorage.getItem(ECA_SESSION_KEY);

    if (!raw) return null;

    try {
      const session = JSON.parse(raw);
      const db = ECA.load();

      if (!db.users) return null;

      const user = db.users.find(
        (u) => u.id === session.user_id
      );

      if (!user) return null;

      if (user.status !== "active") return null;

      return user;

    } catch (e) {
      console.error("Session error:", e);
      sessionStorage.removeItem(ECA_SESSION_KEY);
      return null;
    }
  }


  // =========================================================
  // LOGIN
  // =========================================================
  function login(email, password) {

    // Always make sure admin account exists
    ensureAdminAccount();

    const db = ECA.load();

    const inputEmail = String(email || "")
      .trim()
      .toLowerCase();

    const inputPassword = String(password || "");

    const user = db.users.find(
      (u) =>
        String(u.email || "")
          .trim()
          .toLowerCase() === inputEmail
    );

    if (!user) {
      return {
        ok: false,
        error: "No account found with that email."
      };
    }

    if (user.status !== "active") {
      return {
        ok: false,
        error: "This account has been disabled. Contact support."
      };
    }

    if (String(user.password) !== inputPassword) {
      return {
        ok: false,
        error: "Incorrect password."
      };
    }

    user.last_login = ECA.nowISO();

    ECA.save(db);

    sessionStorage.setItem(
      ECA_SESSION_KEY,
      JSON.stringify({
        user_id: user.id
      })
    );

    return {
      ok: true,
      user: user
    };
  }


  // =========================================================
  // LOGOUT
  // =========================================================
  function logout() {

    sessionStorage.removeItem(ECA_SESSION_KEY);

    window.location.href =
      redirectBase() + "login.html";
  }


  // =========================================================
  // PATH HELPERS
  // =========================================================
  function redirectBase() {
    return window.location.pathname.includes("/admin/")
      ? "../"
      : "";
  }

  function adminBase() {
    return window.location.pathname.includes("/admin/")
      ? ""
      : "admin/";
  }


  // =========================================================
  // STUDENT GUARD
  // =========================================================
  function guardStudent() {

    const user = currentUser();

    if (!user) {
      window.location.href =
        redirectBase() + "login.html";

      return null;
    }

    if (user.role === "admin") {

      window.location.href =
        redirectBase() + "admin/index.html";

      return null;
    }

    return user;
  }


  // =========================================================
  // ADMIN GUARD
  // =========================================================
  function guardAdmin() {

    const user = currentUser();

    if (!user) {

      window.location.href =
        redirectBase() + "login.html";

      return null;
    }

    if (user.role !== "admin") {

      window.location.href =
        redirectBase() + "dashboard.html";

      return null;
    }

    return user;
  }


  // =========================================================
  // REDIRECT IF ALREADY LOGGED IN
  // =========================================================
  function redirectIfLoggedIn() {

    const user = currentUser();

    if (!user) return;

    if (user.role === "admin") {

      window.location.href =
        adminBase() + "index.html";

    } else {

      window.location.href =
        "dashboard.html";

    }
  }


  // =========================================================
  // PUBLIC API
  // =========================================================
  return {
    currentUser,
    login,
    logout,
    guardStudent,
    guardAdmin,
    redirectIfLoggedIn,
    redirectBase,
    adminBase,
    ensureAdminAccount
  };

})();
