// Imports
const jwt = require('jsonwebtoken');

exports.createJWT = (user) => {
    const jwtToken = jwt.sign({
        email: user.email,
        name: user.name
    }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });

    return jwtToken;
};

exports.verifyJWT = async (token) => {
    const obj = await jwt.verify(token, process.env.JWT_SECRET);
    return obj;
}
