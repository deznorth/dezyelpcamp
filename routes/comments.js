var express = require("express"),
    router = express.Router({mergeParams:true}),
    middleware = require("../middleware"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

//=======================================
//          Comment routes
//=======================================

//NEW -- Show form to create new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
           console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
});

//CREATE -- adds a new comment to the given campground
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            //add flash message
            req.flash("error", "Error finding campground!");
            res.redirect("/campgrounds");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    //add flash message
                    req.flash("error", "Error creating comment!");
                    //redirect to campground show page
                    res.redirect("/campgrounds/"+ campground._id);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground show page
                    res.redirect("/campgrounds/"+ campground._id);
                }
            });
        }
    });
});

//EDIT -- show form to edit a comment
router.get("/:comment_id/edit", middleware.isAuthorizedComment, function(req, res){
    Campground.findById(req.params._id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id:req.params.id, comment:foundComment});
            }
        });
    }); 
});

//UPDATE -- updates the info on a comment
router.put("/:comment_id", middleware.isAuthorizedComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//DESTROY -- deletes a comment
router.delete("/:comment_id", middleware.isAuthorizedComment, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            //add flash message
            req.flash("error", "Could not delete comment.");
            res.redirect("back");
        } else {
            //add flash message
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;