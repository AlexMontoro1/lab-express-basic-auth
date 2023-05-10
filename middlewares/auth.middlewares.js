const logged = (req, res, next) => {
    if(req.session.activeUser === undefined){
        res.redirect("/")
    }else{
        next()
    }
}

module.exports = logged