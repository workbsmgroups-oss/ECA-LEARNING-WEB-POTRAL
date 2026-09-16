/**
 * ECA.DB — localStorage-backed data layer.
 *
 * Demo / prototype database for ENJOY CREATOR ACADEMY™.
 *
 * IMPORTANT:
 * This is NOT secure for production.
 * Passwords and data are stored in browser localStorage.
 * For production, replace this with Supabase Auth + PostgreSQL + RLS.
 */

const ECA_DB_KEY = "eca_db_v1";

const ECA = (function () {

  /* =========================================================
     BASIC HELPERS
  ========================================================= */

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


  /* =========================================================
     DATABASE SEED
  ========================================================= */

  function seed() {

    const courseId = "course_ai_creator";

    /* -------------------------
       AI COURSE MODULES
    ------------------------- */

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
      "Advanced AI Video Workflows"
    ].map((title, i) => ({
      id: "mod_" + (i + 1),
      course_id: courseId,
      title: title,
      description: "",
      order: i + 1,
      status: "published",
      created_at: nowISO()
    }));


    /* -------------------------
       SAMPLE VIDEO TITLES
    ------------------------- */

    const sampleTitles = [
      "Welcome & Platform Orientation",
      "Setting Up Your Workspace",
      "Core Concepts Overview",
      "Hands-On Walkthrough",
      "Common Mistakes to Avoid",
      "Case Study Breakdown"
    ];


    /* -------------------------
       AI COURSE VIDEOS
    ------------------------- */

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

          video_url:
            "https://player.vimeo.com/video/76979871",

          thumbnail: "",

          duration_seconds:
            300 + ((i * 47) % 600),

          lesson_number: i + 1,

          order: i + 1,

          status: "published",

          created_at: nowISO()
        });

        lessonCounter++;
      }
    });


    /* =========================================================
       COURSES
    ========================================================= */

    const course = {
      id: courseId,

      title:
        "AI Video Creation Master Course",

      description:
        "A complete, hands-on path from first principles to advanced AI video workflows — prompt engineering, avatars, voiceover, and full production pipelines.",

      thumbnail: "",

      instructor:
        "Enjoy Creator Academy Faculty",

      status: "published",

      access_type: "invite",

      order: 1,

      created_at: nowISO()
    };


    const secondCourse = {

      id: "course_yt",

      title:
        "YouTube Master Course",

      description:
        "Grow a channel from zero: content strategy, retention editing, thumbnails, and the algorithm.",

      thumbnail: "",

      instructor:
        "Enjoy Creator Academy Faculty",

      status: "published",

      access_type: "invite",

      order: 2,

      created_at: nowISO()
    };


    /* =========================================================
       YOUTUBE COURSE MODULES
    ========================================================= */

    const ytModules = [

      {
        id: "mod_yt_1",
        course_id: "course_yt",
        title: "Channel Strategy",
        description: "",
        order: 1,
        status: "published",
        created_at: nowISO()
      },

      {
        id: "mod_yt_2",
        course_id: "course_yt",
        title: "Retention Editing",
        description: "",
        order: 2,
        status: "published",
        created_at: nowISO()
      }

    ];


    /* =========================================================
       YOUTUBE COURSE VIDEOS
    ========================================================= */

    const ytVideos = [

      {
        id: "vid_yt_1",

        course_id: "course_yt",

        module_id: "mod_yt_1",

        title:
          "Finding Your Niche",

        description:
          "Lesson 1",

        video_url:
          "https://player.vimeo.com/video/76979871",

        thumbnail: "",

        duration_seconds: 420,

        lesson_number: 1,

        order: 1,

        status: "published",

        created_at: nowISO()
      },


      {
        id: "vid_yt_2",

        course_id: "course_yt",

        module_id: "mod_yt_1",

        title:
          "Channel Setup",

        description:
          "Lesson 2",

        video_url:
          "https://player.vimeo.com/video/76979871",

        thumbnail: "",

        duration_seconds: 380,

        lesson_number: 2,

        order: 2,

        status: "published",

        created_at: nowISO()
      },


      {
        id: "vid_yt_3",

        course_id: "course_yt",

        module_id: "mod_yt_2",

        title:
          "The First Three Seconds",

        description:
          "Lesson 3",

        video_url:
          "https://player.vimeo.com/video/76979871",

        thumbnail: "",

        duration_seconds: 300,

        lesson_number: 1,

        order: 1,

        status: "published",

        created_at: nowISO()
      }

    ];


    /* =========================================================
       USERS
    ========================================================= */

    const users = [

      /* ADMIN */

      {
        id: "user_admin",

        name:
          "B. Sriram Marudhaiyappan",

        email:
          "srirammarudhaiyappan45@gmail.com",

        password:
          "Sriram Ceo Eca",

        role:
          "admin",

        status:
          "active",

        avatar:
          "",

        created_at:
          nowISO(),

        last_login:
          null
      },


      /* STUDENT 1 */

      {
        id: "user_rahul",

        name:
          "Rahul Sharma",

        email:
          "rahul@student.com",

        password:
          "student123",

        role:
          "student",

        status:
          "active",

        avatar:
          "",

        created_at:
          nowISO(),

        last_login:
          null
      },


      /* STUDENT 2 */

      {
        id: "user_priya",

        name:
          "Priya Nair",

        email:
          "priya@student.com",

        password:
          "student123",

        role:
          "student",

        status:
          "active",

        avatar:
          "",

        created_at:
          nowISO(),

        last_login:
          null
      }

    ];


    /* =========================================================
       COURSE ACCESS
    ========================================================= */

    const course_access = [

      {
        id: uid("acc"),

        user_id:
          "user_rahul",

        course_id:
          courseId,

        granted_at:
          nowISO()
      },


      {
        id: uid("acc"),

        user_id:
          "user_priya",

        course_id:
          courseId,

        granted_at:
          nowISO()
      },


      {
        id: uid("acc"),

        user_id:
          "user_priya",

        course_id:
          "course_yt",

        granted_at:
          nowISO()
      }

    ];


    /* =========================================================
       VIDEO PROGRESS
    ========================================================= */

    const video_progress = [];

    const rahulVideos =
      videos.slice(0, 14);


    rahulVideos.forEach((v, i) => {

      video_progress.push({

        id:
          uid("prog"),

        user_id:
          "user_rahul",

        course_id:
          courseId,

        module_id:
          v.module_id,

        video_id:
          v.id,

        started_at:
          nowISO(),

        completed_at:
          i < 11
            ? nowISO()
            : null,

        watch_seconds:
          i < 11
            ? v.duration_seconds
            : Math.floor(
                v.duration_seconds * 0.4
              ),

        last_position_seconds:
          i < 11
            ? v.duration_seconds
            : Math.floor(
                v.duration_seconds * 0.4
              )

      });

    });


    /* =========================================================
       FINAL DATABASE
    ========================================================= */

    return {

      users: users,

      courses: [
        course,
        secondCourse
      ],

      modules:
        modules.concat(ytModules),

      videos:
        videos.concat(ytVideos),

      course_access:
        course_access,

      video_progress:
        video_progress,

      announcements: [

        {
          id:
            uid("ann"),

          title:
            "Welcome to Enjoy Creator Academy",

          body:
            "Your learning portal is live. Start with Module 01 of the AI Video Creation Master Course.",

          created_at:
            nowISO()
        }

      ],

      platform_settings: {

        academy_name:
          "Enjoy Creator Academy",

        short_name:
          "ECA",

        description:
          "Premium AI education and creator learning platform.",

        support_email:
          "support@enjoycreatoracademy.com",

        login_message:
          "Login to continue your learning journey.",

        welcome_message:
          "Welcome back. Let's keep building."

      },

      session:
        null

    };

  }


  /* =========================================================
     LOAD DATABASE
  ========================================================= */

  function load() {

    const raw =
      localStorage.getItem(ECA_DB_KEY);


    /* --------------------------------
       FIRST TIME
    -------------------------------- */

    if (!raw) {

      const fresh =
        seed();

      localStorage.setItem(
        ECA_DB_KEY,
        JSON.stringify(fresh)
      );

      return fresh;
    }


    /* --------------------------------
       EXISTING DATABASE
    -------------------------------- */

    try {

      const db =
        JSON.parse(raw);


      if (!Array.isArray(db.users)) {
        db.users = [];
      }


      if (!Array.isArray(db.courses)) {
        db.courses = [];
      }


      if (!Array.isArray(db.modules)) {
        db.modules = [];
      }


      if (!Array.isArray(db.videos)) {
        db.videos = [];
      }


      if (!Array.isArray(db.course_access)) {
        db.course_access = [];
      }


      if (!Array.isArray(db.video_progress)) {
        db.video_progress = [];
      }


      if (!Array.isArray(db.announcements)) {
        db.announcements = [];
      }


      if (!db.platform_settings) {

        db.platform_settings = {

          academy_name:
            "Enjoy Creator Academy",

          short_name:
            "ECA",

          description:
            "Premium AI education and creator learning platform.",

          support_email:
            "support@enjoycreatoracademy.com",

          login_message:
            "Login to continue your learning journey.",

          welcome_message:
            "Welcome back. Let's keep building."

        };

      }


      /* =====================================================
         ENSURE ADMIN ACCOUNT
      ===================================================== */

      const adminEmail =
        "srirammarudhaiyappan45@gmail.com";

      const adminPassword =
        "Sriram Ceo Eca";


      let existingAdmin =
        db.users.find(
          (user) =>
            String(user.email || "")
              .trim()
              .toLowerCase() ===
            adminEmail.toLowerCase()
        );


      /* --------------------------------
         ADMIN DOES NOT EXIST
      -------------------------------- */

      if (!existingAdmin) {

        existingAdmin = {

          id:
            "user_admin_sriram",

          name:
            "B. Sriram Marudhaiyappan",

          email:
            adminEmail,

          password:
            adminPassword,

          role:
            "admin",

          status:
            "active",

          avatar:
            "",

          created_at:
            nowISO(),

          last_login:
            null

        };


        db.users.push(
          existingAdmin
        );

      }


      /* --------------------------------
         UPDATE ADMIN
      -------------------------------- */

      else {

        existingAdmin.name =
          "B. Sriram Marudhaiyappan";

        existingAdmin.email =
          adminEmail;

        existingAdmin.password =
          adminPassword;

        existingAdmin.role =
          "admin";

        existingAdmin.status =
          "active";

      }


      /* --------------------------------
         SAVE UPDATED DATABASE
      -------------------------------- */

      localStorage.setItem(
        ECA_DB_KEY,
        JSON.stringify(db)
      );


      return db;

    }


    /* =====================================================
       DATABASE ERROR
    ===================================================== */

    catch (error) {

      console.error(
        "ECA database error:",
        error
      );


      const fresh =
        seed();


      localStorage.setItem(
        ECA_DB_KEY,
        JSON.stringify(fresh)
      );


      return fresh;

    }

  }


  /* =========================================================
     SAVE DATABASE
  ========================================================= */

  function save(db) {

    localStorage.setItem(
      ECA_DB_KEY,
      JSON.stringify(db)
    );

    return db;

  }


  /* =========================================================
     RESET DATABASE
  ========================================================= */

  function resetAll() {

    localStorage.removeItem(
      ECA_DB_KEY
    );

    sessionStorage.removeItem(
      "eca_session_v1"
    );

    return load();

  }


  /* =========================================================
     GET COURSES FOR USER
  ========================================================= */

  function coursesForUser(db, userId) {

    if (!db || !userId) {
      return [];
    }


    const access =
      db.course_access.filter(
        (item) =>
          item.user_id === userId
      );


    return access
      .map((item) =>
        db.courses.find(
          (course) =>
            course.id === item.course_id
        )
      )
      .filter(Boolean)
      .filter(
        (course) =>
          course.status === "published"
      );

  }


  /* =========================================================
     CHECK COURSE ACCESS
  ========================================================= */

  function userHasCourseAccess(
    db,
    userId,
    courseId
  ) {

    if (!db || !userId || !courseId) {
      return false;
    }


    const user =
      db.users.find(
        (u) =>
          u.id === userId
      );


    /* ADMIN HAS FULL ACCESS */

    if (
      user &&
      user.role === "admin"
    ) {
      return true;
    }


    return db.course_access.some(
      (access) =>
        access.user_id === userId &&
        access.course_id === courseId
    );

  }


  /* =========================================================
     GET MODULES FOR COURSE
  ========================================================= */

  function modulesForCourse(
    db,
    courseId
  ) {

    if (!db || !courseId) {
      return [];
    }


    return db.modules

      .filter(
        (module) =>
          module.course_id === courseId
      )

      .filter(
        (module) =>
          module.status === "published"
      )

      .sort(
        (a, b) =>
          Number(a.order || 0) -
          Number(b.order || 0)
      );

  }


  /* =========================================================
     GET VIDEOS FOR MODULE
  ========================================================= */

  function videosForModule(
    db,
    moduleId
  ) {

    if (!db || !moduleId) {
      return [];
    }


    return db.videos

      .filter(
        (video) =>
          video.module_id === moduleId
      )

      .filter(
        (video) =>
          video.status === "published"
      )

      .sort(
        (a, b) =>
          Number(a.order || 0) -
          Number(b.order || 0)
      );

  }


  /* =========================================================
     GET VIDEOS FOR COURSE
  ========================================================= */

  function videosForCourse(
    db,
    courseId
  ) {

    if (!db || !courseId) {
      return [];
    }


    return db.videos

      .filter(
        (video) =>
          video.course_id === courseId
      )

      .filter(
        (video) =>
          video.status === "published"
      )

      .sort(
        (a, b) =>
          Number(a.order || 0) -
          Number(b.order || 0)
      );

  }


  /* =========================================================
     GET VIDEO PROGRESS
  ========================================================= */

  function progressFor(
    db,
    userId,
    videoId
  ) {

    if (
      !db ||
      !userId ||
      !videoId
    ) {
      return null;
    }


    return (
      db.video_progress.find(
        (progress) =>
          progress.user_id === userId &&
          progress.video_id === videoId
      ) || null
    );

  }


  /* =========================================================
     COURSE PROGRESS %
  ========================================================= */

  function courseProgressPct(
    db,
    userId,
    courseId
  ) {

    const videos =
      videosForCourse(
        db,
        courseId
      );


    if (!videos.length) {
      return 0;
    }


    const completed =
      videos.filter(
        (video) => {

          const progress =
            progressFor(
              db,
              userId,
              video.id
            );

          return (
            progress &&
            progress.completed_at
          );

        }
      ).length;


    return Math.round(
      (completed / videos.length) * 100
    );

  }


  /* =========================================================
     MODULE PROGRESS %
  ========================================================= */

  function moduleProgressPct(
    db,
    userId,
    moduleId
  ) {

    const videos =
      videosForModule(
        db,
        moduleId
      );


    if (!videos.length) {
      return 0;
    }


    const completed =
      videos.filter(
        (video) => {

          const progress =
            progressFor(
              db,
              userId,
              video.id
            );

          return (
            progress &&
            progress.completed_at
          );

        }
      ).length;


    return Math.round(
      (completed / videos.length) * 100
    );

  }


  /* =========================================================
     MARK VIDEO COMPLETE
  ========================================================= */

  function markVideoComplete(
    db,
    userId,
    video
  ) {

    if (
      !db ||
      !userId ||
      !video
    ) {
      return null;
    }


    let progress =
      progressFor(
        db,
        userId,
        video.id
      );


    /* --------------------------------
       CREATE PROGRESS
    -------------------------------- */

    if (!progress) {

      progress = {

        id:
          uid("prog"),

        user_id:
          userId,

        course_id:
          video.course_id,

        module_id:
          video.module_id,

        video_id:
          video.id,

        started_at:
          nowISO(),

        completed_at:
          nowISO(),

        watch_seconds:
          Number(
            video.duration_seconds || 0
          ),

        last_position_seconds:
          Number(
            video.duration_seconds || 0
          )

      };


      db.video_progress.push(
        progress
      );

    }


    /* --------------------------------
       UPDATE EXISTING PROGRESS
    -------------------------------- */

    else {

      if (!progress.started_at) {
        progress.started_at =
          nowISO();
      }


      progress.completed_at =
        nowISO();


      progress.watch_seconds =
        Number(
          video.duration_seconds || 0
        );


      progress.last_position_seconds =
        Number(
          video.duration_seconds || 0
        );

    }


    save(db);


    return progress;

  }


  /* =========================================================
     RECENTLY WATCHED
  ========================================================= */

  function recentlyWatched(
    db,
    userId,
    limit
  ) {

    limit =
      Number(limit || 5);


    if (
      !db ||
      !userId
    ) {
      return [];
    }


    return db.video_progress

      .filter(
        (progress) =>
          progress.user_id === userId
      )

      .sort(
        (a, b) =>
          new Date(
            b.started_at || 0
          ) -
          new Date(
            a.started_at || 0
          )
      )

      .slice(0, limit)

      .map(
        (progress) => {

          const video =
            db.videos.find(
              (v) =>
                v.id ===
                progress.video_id
            );


          return {

            progress:
              progress,

            video:
              video || null

          };

        }
      )

      .filter(
        (item) =>
          item.video
      );

  }


  /* =========================================================
     FORMAT DURATION
  ========================================================= */

  function fmtDuration(
    totalSeconds
  ) {

    totalSeconds =
      Math.max(
        0,
        Math.floor(
          Number(totalSeconds || 0)
        )
      );


    const hours =
      Math.floor(
        totalSeconds / 3600
      );


    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );


    const seconds =
      totalSeconds % 60;


    if (hours > 0) {

      return (
        hours +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
      );

    }


    return (
      minutes +
      ":" +
      String(seconds).padStart(2, "0")
    );

  }


  /* =========================================================
     PUBLIC API
  ========================================================= */

  return {

    uid,

    nowISO,

    seed,

    load,

    save,

    resetAll,

    coursesForUser,

    userHasCourseAccess,

    modulesForCourse,

    videosForModule,

    videosForCourse,

    progressFor,

    courseProgressPct,

    moduleProgressPct,

    markVideoComplete,

    recentlyWatched,

    fmtDuration

  };

})();
