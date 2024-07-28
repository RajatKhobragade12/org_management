const { User } = require("../models/user.model");

function authentication(req, res, next) {
    try {
        const userSession = req.session.userId;
        const expiryTime = req.session.cookie.expires;
        const currentTime = new Date();
        if (!userSession) {
            return res.status(401).send({ message: "Unauthenticated or Session not found, Please login again." })
        }
        if (new Date(expiryTime) < currentTime) {
            return res.status(401).send({ message: "Session expired, Please login again" });
        }
        next();
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message })

    }
}

async function authorization(req, res, next) {
    try {
        const userId = req.session.userId;
        const user = await User.findOne({ where: { id: userId } })
        if (user.role != 'admin') {
            return res.status(403).send({ message: "Access denied. Admin only perform this operation" })

        }
        next();

    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message })

    }
}

module.exports = {
    authentication,
    authorization
}