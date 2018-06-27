var express         = require('express'),
    app             = module.exports = express(),
    request         = require("request"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

//Selects which database to use depending on the NODE_ENV enviroment variable
if(process.env.NODE_ENV && process.env.NODE_ENV == "production"){
    //production = mongodb://dbu:a159753@ds221271.mlab.com:21271/dezyelpcamp
    mongoose.connect(process.env.DBURL);
} else {
    //development = mongodb://localhost/yelp_camp
    mongoose.connect("mongodb://localhost/yelp_camp");
}


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //This resets the database and adds dummy content. Comment to stop

//=======================================
//          PASSPORT CONFIG
//=======================================
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware to send user data to all routes
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
//=======================================

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Selects which mode to listen on [development] or [production]
if(process.env.NODE_ENV && process.env.NODE_ENV == "production"){
    //production
    app.listen(process.env.PORT, process.env.IP, function(){
        console.log("DezYelpCamp app started! [production]");
    });
} else {
    //dev
    app.listen(3000, function(){
        console.log("====  http://localhost:3000  ====");
        console.log("DezYelpCamp app started! [development]");
    });
}




















