const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET);
};

module.exports = generateToken;
