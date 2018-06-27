var Campground = require("../models/campground"),
    Comment = require("../models/comment");
//all the middleware goes here
var middlewareObj = {};

//check for owner of campground
middlewareObj.isAuthorizedCampground = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                //add flash message
                req.flash("error", "Server error!");
                //redirect
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    //add flash message
                    req.flash("error", "You don't have permission to do that!");
                    //redirect
                    res.redirect("back");
                }
            }
        });
    } else {
        //add flash message
        req.flash("error", "You need to be logged in to do that!");
        //redirect
        res.redirect("back");
    }
}

//check for owner of comment
middlewareObj.isAuthorizedComment = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                //add flash message
                req.flash("error", "Comment not found");
                //redirect
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    //add flash message
                    req.flash("error", "You don't have permission to do that!");
                    //redirect
                    res.redirect("back");
                }
            }
        });
    } else {
        //add flash message
        req.flash("error", "You need to be logged in to do that!");
        //redirect
        res.redirect("back");
    }
}

//check if user is logged in
middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    //add flash message
    req.flash("error", "You need to be logged in to do that!");
    //redirect
    res.redirect("/login");
}

module.exports = middlewareObj;