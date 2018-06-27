var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

//app root
router.get('/', function(req, res){
    res.render("YelpCampLanding");
});

//=======================================
//          Auth routes
//=======================================
//          Register routes
//=======================================

//NEW -- shows register form
router.get("/register", function(req,res){
    res.render("register");
});

//CREATE -- Handles creation of a new user in the db
router.post("/register", function(req,res){
    var newUser = new User({username:req.body.username});
    
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //add flash message
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            //add flash message
            req.flash("success", "Successfuly registered!");
            res.redirect("/campgrounds");
        });
    });
});

//=======================================
//          Login routes
//=======================================

//NEW -- shows login form
router.get("/login", function(req,res){
    if(req.isAuthenticated()){
        return res.redirect("back");
    } else {
        res.render("login");
    }
});

//CREATE -- Handles creation of a new user in the db
router.post("/login", passport.authenticate("local", {
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}), function(req,res){
    
});

//=======================================
//          Logout route
//=======================================
router.get("/logout", function(req,res){
    req.logout();
    //add flash message
    req.flash("success", "Logged out");
    res.redirect("back");
});

module.exports = router;