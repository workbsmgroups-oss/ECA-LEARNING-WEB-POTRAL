```js
/**
 * ECA.Auth — session + route protection.
 *
 * IMPORTANT:
 * This prototype uses localStorage/sessionStorage.
 * It is NOT suitable for production security.
 *
 * Admin account:
 * Email:    srirammarudhaiyappan45@gmail.com
 * Password: Sriram Ceo Eca
 */

const ECA_SESSION_KEY = "eca_session_v1";

ECA.Auth = (function () {

  /*
   * Make sure the main admin account exists.
   *
   * This is required because an older eca_db_v1 may already exist
   * in the browser's localStorage.
   */
  function ensureSriramAdmin() {
    const db = ECA.load();

    if (!Array.isArray(db.users)) {
      db.users = [];
    }

    const adminEmail = "srirammarudhaiyappan45@gmail.com";
    const adminPassword = "Sriram Ceo Eca";

    let admin = db.users.find(
      (u) =>
        String(u.email || "").toLowerCase() ===
        adminEmail.toLowerCase()
    );

    if (admin) {
      // Update the existing account
      admin.name = "B. Sriram Marudhaiyappan";
      admin.email = adminEmail;
      admin.password = adminPassword;
      admin.role = "admin";
      admin.status = "active";

      if (!admin.created_at) {
        admin.created_at = ECA.nowISO();
      }

      if (!Object.prototype.hasOwnProperty.call(admin, "last_login")) {
        admin.last_login = null;
      }
    } else {
      // Create the account
      admin = {
        id: "user_admin_sriram",
        name: "B. Sriram Marudhaiyappan",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        status: "active",
        avatar: "",
        created_at: ECA.nowISO(),
        last_login: null,
      };

      db.users.push(admin);
    }

    ECA.save(db);

    return admin;
  }


  function currentUser() {
    const raw = sessionStorage.getItem(ECA_SESSION_KEY);

    if (!raw) {
      return null;
    }

    try {
      const session = JSON.parse(raw);
      const db = ECA.load();

      const user = db.users.find(
        (u) => u.id === session.user_id
      );

      if (!user || user.status !== "active") {
        return null;
      }

      return user;

    } catch (e) {
      return null;
    }
  }


  function login(email, password) {

    /*
     * IMPORTANT:
     * Run the admin migration before checking credentials.
     * This fixes the situation where the browser already has
     * an old eca_db_v1.
     */
    ensureSriramAdmin();

    const db = ECA.load();

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    const user = db.users.find(
      (u) =>
        String(u.email || "")
          .trim()
          .toLowerCase() === normalizedEmail
    );

    if (!user) {
      return {
        ok: false,
        error: "No account found with that email.",
      };
    }

    if (user.status !== "active") {
      return {
        ok: false,
        error:
          "This account has been disabled. Contact support.",
      };
    }

    if (user.password !== password) {
      return {
        ok: false,
        error: "Incorrect password.",
      };
    }

    // Update last login
    user.last_login = ECA.nowISO();

    ECA.save(db);

    // Create session
    sessionStorage.setItem(
      ECA_SESSION_KEY,
      JSON.stringify({
        user_id: user.id,
      })
    );

    return {
      ok: true,
      user: user,
    };
  }


  function logout() {
    sessionStorage.removeItem(ECA_SESSION_KEY);

    window.location.href =
      redirectBase() + "login.html";
  }


  /*
   * Figures out relative path prefix based on current location.
   */
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


  /*
   * Student route protection.
   */
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


  /*
   * Admin route protection.
   */
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


  /*
   * Redirect logged-in users away from login/public pages.
   */
  function redirectIfLoggedIn() {

    const user = currentUser();

    if (!user) {
      return;
    }

    if (user.role === "admin") {

      window.location.href =
        adminBase() + "index.html";

    } else {

      window.location.href =
        "dashboard.html";
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
    ensureSriramAdmin,
  };

})();
```

### Now do exactly this

1. Replace your current:

   ```text
   assets/js/auth.js
   ```

   with the code above.

2. Keep your `login.html` exactly as you originally sent it.

3. **Refresh the login page completely** with:
   **Ctrl + Shift + R**

4. Login with:

```text
Email:
srirammarudhaiyappan45@gmail.com

Password:
Sriram Ceo Eca
```

5. It should redirect to:

```text
admin/index.html
```

### Why this version should fix it

Your original `auth.js` searches `db.users` directly for the email.

Your existing database still has:

```text
admin@eca.com
admin123
```

as the admin account.

The new `auth.js` first runs `ensureSriramAdmin()`, which **adds or updates**:

```text
B. Sriram Marudhaiyappan
srirammarudhaiyappan45@gmail.com
Sriram Ceo Eca
admin
active
```

So it doesn't matter whether your browser already has the old `eca_db_v1`.

**You don't need to delete your existing students, courses, progress, or database.**
