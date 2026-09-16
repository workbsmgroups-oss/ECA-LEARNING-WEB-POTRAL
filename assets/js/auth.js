/**
 * ECA.Auth — session + route protection.
 *
 * Passwords here are compared in plaintext because there is no server to
 * hash against in this static prototype. In production this entire file
 * is replaced by supabase.auth.signInWithPassword(), and every "guard*"
 * function below becomes a Postgres RLS policy checked server-side —
 * client-side route guarding (as done here) is a UX convenience only
 * and must never be the actual security boundary.
 */

const ECA_SESSION_KEY = "eca_session_v1";

ECA.Auth = (function () {
  function currentUser() {
    const raw = sessionStorage.getItem(ECA_SESSION_KEY);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw);
      const db = ECA.load();
      const user = db.users.find((u) => u.id === session.user_id);
      if (!user || user.status !== "active") return null;
      return user;
    } catch (e) {
      return null;
    }
  }

  function login(email, password) {
    const db = ECA.load();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase()
    );
    if (!user) return { ok: false, error: "No account found with that email." };
    if (user.status !== "active")
      return { ok: false, error: "This account has been disabled. Contact support." };
    if (user.password !== password)
      return { ok: false, error: "Incorrect password." };
    user.last_login = ECA.nowISO();
    ECA.save(db);
    sessionStorage.setItem(ECA_SESSION_KEY, JSON.stringify({ user_id: user.id }));
    return { ok: true, user: user };
  }

  function logout() {
    sessionStorage.removeItem(ECA_SESSION_KEY);
    window.location.href = redirectBase() + "login.html";
  }

  // Figures out relative path prefix based on current location, so the
  // same auth.js works whether it's loaded from / or /admin/.
  function redirectBase() {
    return window.location.pathname.includes("/admin/") ? "../" : "";
  }

  function adminBase() {
    return window.location.pathname.includes("/admin/") ? "" : "admin/";
  }

  // Call at the top of any page that requires a logged-in student.
  function guardStudent() {
    const user = currentUser();
    if (!user) {
      window.location.href = redirectBase() + "login.html";
      return null;
    }
    if (user.role === "admin") {
      window.location.href = redirectBase() + "admin/index.html";
      return null;
    }
    return user;
  }

  // Call at the top of any page under /admin/.
  function guardAdmin() {
    const user = currentUser();
    if (!user) {
      window.location.href = redirectBase() + "login.html";
      return null;
    }
    if (user.role !== "admin") {
      window.location.href = redirectBase() + "dashboard.html";
      return null;
    }
    return user;
  }

  // If already logged in and visiting login/public pages, bounce forward.
  function redirectIfLoggedIn() {
    const user = currentUser();
    if (!user) return;
    if (user.role === "admin") {
      window.location.href = adminBase() + "index.html".replace("index.html", "index.html");
      window.location.href = adminBase() + "index.html";
    } else {
      window.location.href = "dashboard.html";
    }
  }

  return {
    currentUser,
    login,
    logout,
    guardStudent,
    guardAdmin,
    redirectIfLoggedIn,
    redirectBase,
    adminBase,
  };
})();
