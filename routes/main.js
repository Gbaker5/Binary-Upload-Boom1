const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const upload = require("../middleware/multer");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/signupProfile", ensureAuth, postsController.getSignupProfile)
router.post("/signupProfile", ensureAuth, upload.single("file"), postsController.postSignupProfile)
router.get("/profileEdit", ensureAuth, postsController.getProfileEdit)
router.post("/profileEdit", ensureAuth, upload.single("file"), postsController.postProfileEdit)
router.put("/ProfileEdit", ensureAuth, postsController.putProfileEdit)
router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/guest:id", ensureAuth, postsController.getGuest)
router.get("/friends", ensureAuth, postsController.getFriends)
router.put("/bio", ensureAuth, postsController.putBio)

module.exports = router;
