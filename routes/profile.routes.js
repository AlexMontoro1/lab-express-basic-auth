const router = require("express").Router();
const logged = require("../middlewares/auth.middlewares.js")

router.get("/main", logged, (req,res,next)=> {
    //console.log(req.session.activeUser);
    res.render("profile/main.hbs")
})
router.get("/private", logged, (req,res,next)=> {
    res.render("profile/private.hbs")
})


module.exports = router;