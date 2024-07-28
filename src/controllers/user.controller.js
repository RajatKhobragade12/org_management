const { User } = require('../models/user.model');


async function register(req, res) {
    try {

        const { username, email, password, role } = req.body;
        if (!username || !email || !password || !role) {
            return res.status(400).send({ message: "Missing fields" })
        }
        let existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).send({ message: "Email already registerd" })
        }
        const newUser = await User.create({ username: username, password: password, email: email, role: role });
        return res.status(400).send({ message: "User created successfully", data: newUser })

    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error })
    }
};


async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Missing fields" })
        }
        let existingUser = await User.findOne({ where: { email: email } });

        if (!existingUser) {
            return res.status(404).send({ message: "User not found" })
        }
        if (existingUser.email != email || existingUser.password != password) {
            return res.status(400).send({ message: "Invalid email or password" })

        }
        req.session.userId = existingUser.id
        req.session.cookie.expires = new Date(Date.now() + (60 * 60 * 1000));
        return res.status(200).send({ message: "Login successfully" })
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message })

    }

}

module.exports = {
    register,
    login
}