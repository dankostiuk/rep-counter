module.exports = {
    ensureAuthenticated: function(req, res, next) {
        console.log('authenticated user: ' + JSON.stringify(req.session.passport));

        // same as doing req.session.passport.user !== undefined
        if (req.isAuthenticated()) {
            return next();
        }
        console.log('Not authenticated.. redirecting back to home.')
        res.redirect('/');
    }
}