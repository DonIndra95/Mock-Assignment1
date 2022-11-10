const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


const authentication = async function (req, res, next) {
  try {
    let bearerToken = req.headers["authorization"];
    var token = null;
    if (typeof bearerToken !== "undefined") {
      let bearer = bearerToken.split(" ");
      token = bearer[1];
    }

    if (!token)
      return res.status(401).send({
        status: false,
        message: "You are not logged in (token Missing)",
      });

    jwt.verify(token, "mock-secret-key", function (err, decoded) {
      if (err) {
        let msg =
          err.message === "jwt expired"
            ? "token is expired"
            : "token is invalid";

        return res.status(401).send({ status: false, message: msg });
      } else {
        req.decodeToken = decoded;
        next();
      }
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};



module.exports = { authentication };
