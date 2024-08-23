const User = require("../models/user");
module.exports.signupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({email,username});
        let registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err)
            {
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
       
    }catch(e)
    {
        console.log(e);
        req.flash("error",e.message);
        res.redirect("/signup")
    }
}

module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req, res) => {
    console.log(req.user); // Check if user is attached to the request
    req.flash('success', 'Welcome back!');
    let redirectUrl = req.session.redirectUrl || "/listings";
    console.log("red:",redirectUrl);
    res.redirect(redirectUrl);
  }

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}   