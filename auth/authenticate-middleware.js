const jwt = require("jsonwebtoken");
const secretKeys = require("../api/secretKeys");
/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

module.exports = (req, res, next) => {
    try {
        // manually pull the token that got sent from the client's cookie jar
        //const token = req.cookies.token;
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ you: "shall not pass!" });
        }

        // checks to make sure the signature is valid and the token is not expired
        jwt.verify(token, secretKeys.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ you: "shall not pass!" });
            }

            next();
        });
    } catch (err) {
        next(err);
    }
};
