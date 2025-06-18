async function isAuth(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect("/");
	}
}

async function isAdmin(req, res, next) {
	if (req.session.user && req.session.user.role === "admin") {
		next();
	} else {
		res.redirect("/");
	}
}

module.exports = { isAuth, isAdmin };
