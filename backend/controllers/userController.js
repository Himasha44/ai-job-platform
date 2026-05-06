const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
    const { name, email, password, role } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "User registered" });
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0)
            return res.status(404).json({ message: "User not found" });

        const user = result[0];

        const valid = bcrypt.compareSync(password, user.password);
        if (!valid)
            return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

        res.json({ token, user });
    });
};