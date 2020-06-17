require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const port = 4545;

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cors());

const connection = require("./config");

// écoute de l'url "/api/users" avec le verbe GET
app.get("/api/users", (req, res) => {
    connection.query("SELECT * from user", (err, results) => {
        if (err) {
            console.log(err.message);
            res
                .status(500)
                .send(
                    `Erreur lors de la récupération de l'user ${process.env.DB_NAME}`
                );
        } else {
            res.json(results);
        }
    });
});

// écoute de l'url "/api/users" avec le verbe POST
app.post("/api/users", (req, res) => {
    const formData = req.body;
    connection.query("INSERT INTO user SET ?", formData, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Erreur lors de la sauvegarde d'un utilisateur");
        } else {
            res.sendStatus(200);
        }
    });
});

// écoute de l'url "/api/users" avec le verbe PUT
// Si l'ID est passé en tant que paramètre
app.put("/api/users/:id", (req, res) => {
    const idUser = req.params.id;
    const formData = req.body;

    connection.query(
        "UPDATE user SET ? WHERE id = ?", [formData, idUser],
        (err) => {
            if (err) {
                console.log(err);
                res.status(500).send("Erreur lors de la modification d'un user");
            } else {
                res.sendStatus(200);
            }
        }
    );
});

// écoute de l'url "/api/users" avec le verbe DELETE
app.delete("/api/users/:id", (req, res) => {
    const idUser = req.params.id;
    connection.query("DELETE FROM user WHERE id = ?", [idUser], (err) => {
        if (err) {
            console.log(err);
            res.status(500).send("Erreur lors de la suppression d'un utilisateur");
        } else {
            res.sendStatus(200);
        }
    });
});

app.listen(port, (err) => {
    if (err) {
        throw new Error("Something bad happened...");
    }
    console.log(`Server is listening on ${port}`);
});