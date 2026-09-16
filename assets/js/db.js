```js
/**
 * ECA.DB — localStorage-backed data layer.
 *
 * This mimics the relational schema described in the platform spec:
 *   users -> course_access -> courses -> modules -> videos -> video_progress
 *
 * IMPORTANT (read before shipping to production):
 * This is a client-side stand-in for a real database so the full product
 * flow (auth, RBAC, CRUD, progress, access control) can be built and
 * demoed without a live backend. It is NOT secure — anyone with dev
 * tools can edit localStorage. To go to production, swap the methods
 * below for real Supabase calls (supabase.from('videos').select() etc.)
 * and enforce every rule currently living in this file as a Postgres
 * Row Level Security policy instead. The method names/shapes here were
 * chosen to make that swap mechanical.
 */

const ECA_DB_KEY = "eca_db_v1";

const ECA = (function () {
  function uid(prefix) {
    return (
      prefix +
      "_" +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 8)
    );
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function seed() {
    const courseId = "course_ai_creator";

    const modules = [
      "AI Video Creation Fundamentals",
      "Prompt Engineering",
      "AI Image Creation",
      "AI Avatar Creation",
      "AI Video Generation",
      "AI Voiceover",
      "AI Music & Songs",
      "AI Business Advertisement",
      "AI Cartoon Video Creation",
      "AI Short Film Creation",
      "AI Movie Creation",
      "Advanced AI Video Workflows",
    ].map((title, i) => ({
      id: "mod_" + (i + 1),
      course_id: courseId,
      title: title,
      description: "",
      order: i + 1,
      status: "published",
      created_at: nowISO(),
    }));

    const sampleTitles = [
      "Welcome & Platform Orientation",
      "Setting Up Your Workspace",
      "Core Concepts Overview",
      "Hands-On Walkthrough",
      "Common Mistakes to Avoid",
      "Case Study Breakdown",
    ];

    let videos = [];
    let lessonCounter = 1;

    modules.forEach((m, mi) => {
      const count = mi === 0 ? 6 : 4 + (mi % 3);

      for (let i = 0; i < count; i++) {
        videos.push({
          id: "vid_" + lessonCounter,
          course_id: courseId,
          module_id: m.id,
          title:
            sampleTitles[i % sampleTitles.length] +
            (i >= sampleTitles.length ? " " + (i + 1) : ""),
          description:
            "Lesson " +
            lessonCounter +
            " of the " +
            m.title +
            " module. Follow along and mark complete when you're done.",
          video_url: "https://player.vimeo.com/video/76979871",
          thumbnail: "",
          duration_seconds: 300 + ((i * 47) % 600),
          lesson_number: i + 1,
          order: i + 1,
          status: "published",
          created_at: nowISO(),
        });

        lessonCounter++;
      }
    });

    const course = {
      id: courseId,
      title: "AI Video Creation Master Course",
      description:
        "A complete, hands-on path from first principles to advanced AI video workflows — prompt engineering, avatars, voiceover, and full production pipelines.",
      thumbnail: "",
      instructor: "Enjoy Creator Academy Faculty",
      status: "published",
      access_type: "invite",
      order: 1,
      created_at: nowISO(),
    };

    const secondCourse = {
      id: "course_yt",
      title: "YouTube Master Course",
      description:
        "Grow a channel from zero: content strategy, retention editing, thumbnails, and the algorithm.",
      thumbnail: "",
      instructor: "Enjoy Creator Academy Faculty",
      status: "published",
      access_type: "invite",
      order: 2,
      created_at: nowISO(),
    };

    const ytModules = [
      {
        id: "mod_yt_1",
        course_id: "course_yt",
        title: "Channel Strategy",
        description: "",
        order: 1,
        status: "published",
        created_at: nowISO(),
      },
      {
        id: "mod_yt_2",
        course_id: "course_yt",
        title: "Retention Editing",
        description: "",
        order: 2,
        status: "published",
        created_at: nowISO(),
      },
    ];

    const ytVideos = [
      {
        id: "vid_yt_1",
        course_id: "course_yt",
        module_id: "mod_yt_1",
        title: "Finding Your Niche",
        description: "Lesson 1",
        video_url: "https://player.vimeo.com/video/76979871",
        thumbnail: "",
        duration_seconds: 420,
        lesson_number: 1,
        order: 1,
        status: "published",
        created_at: nowISO(),
      },
      {
        id: "vid_yt_2",
        course_id: "course_yt",
        module_id: "mod_yt_1",
        title: "Channel Setup",
        description: "Lesson 2",
        video_url: "https://player.vimeo.com/video/76979871",
        thumbnail: "",
        duration_seconds: 380,
        lesson_number: 2,
        order: 2,
        status: "published",
        created_at: nowISO(),
      },
      {
        id: "vid_yt_3",
        course_id: "course_yt",
        module_id: "mod_yt_2",
        title: "The First Three Seconds",
        description: "Lesson 3",
        video_url: "https://player.vimeo.com/video/76979871",
        thumbnail: "",
        duration_seconds: 300,
        lesson_number: 1,
        order: 1,
        status: "published",
        created_at: nowISO(),
      },
    ];

    /*
     * USERS
     *
     * New admin account:
     * Email: srirammarudhaiyappan45@gmail.com
     * Password: Sriram Ceo Eca
     */
    const users = [
      {
        id: "user_admin",
        name: "B. Sriram Marudhaiyappan",
        email: "srirammarudhaiyappan45@gmail.com",
        password: "Sriram Ceo Eca",
        role: "admin",
        status: "active",
        avatar: "",
        created_at: nowISO(),
        last_login: null,
      },
      {
        id: "user_rahul",
        name: "Rahul Sharma",
        email: "rahul@student.com",
        password: "student123",
        role: "student",
        status: "active",
        avatar: "",
        created_at: nowISO(),
        last_login: null,
      },
      {
        id: "user_priya",
        name: "Priya Nair",
        email: "priya@student.com",
        password: "student123",
        role: "student",
        status: "active",
        avatar: "",
        created_at: nowISO(),
        last_login: null,
      },
    ];

    const course_access = [
      {
        id: uid("acc"),
        user_id: "user_rahul",
        course_id: courseId,
        granted_at: nowISO(),
      },
      {
        id: uid("acc"),
        user_id: "user_priya",
        course_id: courseId,
        granted_at: nowISO(),
      },
      {
        id: uid("acc"),
        user_id: "user_priya",
        course_id: "course_yt",
        granted_at: nowISO(),
      },
    ];

    // Give Rahul some progress so the dashboard isn't empty on first look.
    const video_progress = [];
    const rahulVideos = videos.slice(0, 14);

    rahulVideos.forEach((v, i) => {
      video_progress.push({
        id: uid("prog"),
        user_id: "user_rahul",
        course_id: courseId,
        module_id: v.module_id,
        video_id: v.id,
        started_at: nowISO(),
        completed_at: i < 11 ? nowISO() : null,
        watch_seconds:
          i < 11
            ? v.duration_seconds
            : Math.floor(v.duration_seconds * 0.4),
        last_position_seconds:
          i < 11
            ? v.duration_seconds
            : Math.floor(v.duration_seconds * 0.4),
      });
    });

    return {
      users,

      courses: [course, secondCourse],

      modules: modules.concat(ytModules),

      videos: videos.concat(ytVideos),

      course_access,

      video_progress,

      announcements: [
        {
          id: uid("ann"),
          title: "Welcome to Enjoy Creator Academy",
          body:
            "Your learning portal is live. Start with Module 01 of the AI Video Creation Master Course.",
          created_at: nowISO(),
        },
      ],

      platform_settings: {
        academy_name: "Enjoy Creator Academy",
        short_name: "ECA",
        description:
          "Premium AI education and creator learning platform.",
        support_email: "support@enjoycreatoracademy.com",
        login_message: "Login to continue your learning journey.",
        welcome_message: "Welcome back. Let's keep building.",
      },

      session: null,
    };
  }

  function load() {
    const raw = localStorage.getItem(ECA_DB_KEY);

    if (!raw) {
      const fresh = seed();
      localStorage.setItem(ECA_DB_KEY, JSON.stringify(fresh));
      return fresh;
    }

    try {
      const db = JSON.parse(raw);

      /*
       * IMPORTANT:
       * Automatically add/update Sriram's admin account.
       *
       * This means you do NOT have to delete the existing database.
       */
      if (!Array.isArray(db.users)) {
        db.users = [];
      }

      const adminEmail = "srirammarudhaiyappan45@gmail.com";

      const existingAdmin = db.users.find(
        (user) =>
          String(user.email || "").toLowerCase() ===
          adminEmail.toLowerCase()
      );

      if (existingAdmin) {
        existingAdmin.name = "B. Sriram Marudhaiyappan";
        existingAdmin.email = adminEmail;
```
