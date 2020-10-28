// Index Controller
exports.getHome = (req, res, next) => {
    res.json({
        super: {
            message: 'Welcome to the home page!'
        }
    })
};

// News Controller
exports.getNews = (req, res, next) => {
    console.log(req.user);
    res.json({
            message: 'North East South West',
            username: req.user.name
    })
};
