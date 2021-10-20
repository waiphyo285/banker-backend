exports.all = (req, res, next) => { 
    res.send({ status: 200, message: "Successfully retrieved", data: "Welcome to  React.js"});
}

exports.user = (req, res, next) => { 
    // res.send({ status: 200, message: "Successfully retrieved", data: "User Content"});
    next();
}

exports.customer = (req, res, next) => { 
    // res.send({ status: 200, message: "Successfully retrieved", data: "Customer Content"});
    next();
}

exports.history = (req, res, next) => { 
    // res.send({ status: 200, message: "Successfully retrieved", data: "History Content"});
    next();
}