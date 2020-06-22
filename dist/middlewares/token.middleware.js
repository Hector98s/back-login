"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (function () { return ({
    verify: function (req, res, next) {
        // Get Auth Header Value
        var bearerHeader = req.headers["authorization"];
        if (!bearerHeader)
            return res.status(401).json({
                ok: false,
                msg: "You need to be logged in to do that",
            });
        // Get token from array
        var bearerToken = bearerHeader.split(" ")[1];
        // Verify token
        jsonwebtoken_1.default.verify(bearerToken, "secretkeyword", function (err, tokenDecoded) {
            if (err)
                return res
                    .status(403)
                    .json({ ok: false, msg: "Sorry! No access.", err: err });
            req.body.authUser = tokenDecoded;
        });
        next();
    },
}); });
