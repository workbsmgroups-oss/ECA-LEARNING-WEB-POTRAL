const ECA_SESSION_KEY = "eca_session_v1";

ECA.Auth = (function () {

  const ADMIN_EMAIL = "srirammarudhaiyappan45@gmail.com";
  const ADMIN_PASSWORD = "Sriram Ceo Eca";

  function ensureAdminAccount() {
    const db = ECA.load();

    if (!Array.isArray(db.users)) {
      db.users = [];
    }

    let admin = db.users.find(function (user) {
      return String(user.email || "").trim().toLowerCase() ===
        ADMIN_EMAIL.toLowerCase();
    });

    if (!admin) {
      admin = {
        id: "user_admin_sriram",
        name: "B. Sriram Marudhaiyappan",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
        status: "active",
        avatar: "",
        created_at: ECA.nowISO(),
        last_login: null
      };

      db.users.push(admin);

    } else {

      admin.name = "B. Sriram Marudhaiyappan";
      admin.email = ADMIN_EMAIL;
      admin.password = ADMIN_PASSWORD;
      admin.role = "admin";
      admin.status = "active";

    }

    ECA.save(db);

    return admin;
  }


  function currentUser() {

    const raw =
      sessionStorage.getItem(ECA_SESSION_KEY);

    if (!raw) {
      return null;
    }

    try {

      const session =
        JSON.parse(raw);

      if (!session || !session.user_id) {
        return null;
      }

      const db =
        ECA.load();

      if (!Array.isArray(db.users)) {
        return null;
      }

      const user =
        db.users.find(function (u) {
          return u.id === session.user_id;
        });

      if (!user) {
        return null;
      }

      if (user.status !== "active") {
        return null;
      }

      return user;

    } catch (error) {

      console.error(
        "ECA session error:",
        error
      );

      sessionStorage.removeItem(
        ECA_SESSION_KEY
      );

      return null;
    }
  }


  function login(email, password) {

    const admin =
      ensureAdminAccount();

    const db =
      ECA.load();

    const inputEmail =
      String(email || "")
        .trim()
        .toLowerCase();

    const inputPassword =
      String(password || "");


    /* ==========================================
       ADMIN LOGIN
    ========================================== */

    if (
      inputEmail === ADMIN_EMAIL.toLowerCase() &&
      inputPassword === ADMIN_PASSWORD
    ) {

      admin.last_login =
        ECA.nowISO();

      admin.status =
        "active";

      admin.role =
        "admin";

      ECA.save(db);

      sessionStorage.setItem(
        ECA_SESSION_KEY,
        JSON.stringify({
          user_id: admin.id,
          role: "admin",
          email: ADMIN_EMAIL
        })
      );

      return {
        ok: true,
        user: admin
      };
    }


    /* ==========================================
       NORMAL USER LOGIN
    ========================================== */

    const user =
      db.users.find(function (u) {

        return (
          String(u.email || "")
            .trim()
            .toLowerCase() === inputEmail
        );

      });


    if (!user) {

      return {
        ok: false,
        error: "No account found with that email."
      };

    }


    if (user.status !== "active") {

      return {
        ok: false,
        error:
          "This account has been disabled. Contact support."
      };

    }


    if (
      String(user.password) !==
      inputPassword
    ) {

      return {
        ok: false,
        error: "Incorrect password."
      };

    }


    user.last_login =
      ECA.nowISO();

    ECA.save(db);


    sessionStorage.setItem(
      ECA_SESSION_KEY,
      JSON.stringify({
        user_id: user.id,
        role: user.role,
        email: user.email
      })
    );


    return {
      ok: true,
      user: user
    };

  }


  function logout() {

    sessionStorage.removeItem(
      ECA_SESSION_KEY
    );

    window.location.href =
      "../login.html";
  }


  function guardAdmin() {

    const user =
      currentUser();

    if (!user) {

      window.location.replace(
        "../login.html"
      );

      return null;
    }


    if (user.role !== "admin") {

      window.location.replace(
        "../dashboard.html"
      );

      return null;
    }


    return user;
  }


  function guardStudent() {

    const user =
      currentUser();

    if (!user) {

      window.location.replace(
        "login.html"
      );

      return null;
    }


    if (user.role === "admin") {

      window.location.replace(
        "admin/index.html"
      );

      return null;
    }


    return user;
  }


  function redirectIfLoggedIn() {

    const user =
      currentUser();

    if (!user) {
      return;
    }


    if (user.role === "admin") {

      window.location.replace(
        "admin/index.html"
      );

    } else {

      window.location.replace(
        "dashboard.html"
      );

    }

  }


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


  return {

    currentUser,
    login,
    logout,
    guardAdmin,
    guardStudent,
    redirectIfLoggedIn,
    redirectBase,
    adminBase,
    ensureAdminAccount

  };

})();
