const User = require('../models/user');


module.exports.renderRegisForm = (req, res) => { 
    res.render('users/register');
}

module.exports.createNewUser = async (req, res, next) => {
    try {  const { email, username, password } = req.body;
    const user = new User({ email, username, password });
    const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => { 
            if (err) return next(err)
            req.flash('success', 'Welcome to Yelpcamp!');
            res.redirect('/campgrounds'); 
        })
    } catch (e) { 
        req.flash('error', e.message);
        res.redirect('register');
    }
   
}

module.exports.renderLogIn = (req, res) => { 
    res.render('users/login')
}

module.exports.logIn =  (req, res) => { 
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');
}

module.exports.logOut = (req, res, next) => { 
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
      });
}

