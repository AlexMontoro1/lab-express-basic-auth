const router = require("express").Router();

const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", async (req, res, next) => {
  //console.log(req.body);
  const { username, password } = req.body;
  // Aqui todas las validaciones
  // Validacion de UserName
  const regexUsername = /(?!.*[\.\-\_]{2,})^[a-zA-Z0-9\.\-\_]{3,24}$/gm;
  if (regexUsername.test(username) === false) {
    res.render("auth/signup.hbs", {
      errorMessage:
        "Username can only contain alphanumeric characters and the following special characters: dot (.), underscore(_) and dash (-). The special characters cannot appear more than once consecutively or combined. And contain minimum 3 characters and maximum 24.",
    });
    return;
  }
  // Password Validation
  const regexPassword =
    /((?=.*[\d])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[A-Z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[a-z])(?=.*[^\w\d\s])).{7,30}$/gm;
  if (regexPassword.test(password) === false) {
    res.render("auth/signup.hbs", {
      errorMessage:
        "Password must have 3 of 4 of the following items: lower case, upper case, numbers or special characters",
    });
    return;
  }
  try {
    const foundUser = await User.findOne({ username });
    if (foundUser !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "This username already exist, try another",
      });
      return;
    }
    // password encrypt
    const salt = await bcrypt.genSalt(12);
    const encryptedPassword = await bcrypt.hash(password, salt);
    //console.log(encryptedPassword);
    await User.create({
      username,
      password: encryptedPassword,
    });
    console.log("Created User !");
    res.redirect("/auth/login");
  } catch (err) {
    next(err);
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

router.post("/login", async (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;
  // Validations !
  // username and password empty
  if (username === "" && password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "Username and password are required !!",
    });
    return;
  } else if (username === "") {
    res.render("auth/login.hbs", {
      errorMessage: "Username is required !!",
    });
    return;
  } else if (password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "Password is required !!",
    });
    return;
  }
  try {
    // username validation
    const foundUser = await User.findOne({ username });
    if (foundUser === null) {
      res.render("auth/login.hbs", {
        errorMessage: "This username does not exist!",
      });
      return;
    }
    // password validation
    const correctPassword = await bcrypt.compare(password, foundUser.password);
    console.log(correctPassword);
    if (correctPassword === false) {
      res.render("auth/login.hbs", {
        errorMessage: "Incorrect Password",
        username,
      });
      return;
    }
    req.session.activeUser = foundUser;
    req.session.save(() => {});

    res.redirect("/profile/main");
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
