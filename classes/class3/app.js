import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const db = new Pool({
  user: process.env.DB_USER, // DB Users
  password: process.env.DB_PASSWORD, // DB Password
  host: process.env.DB_HOST, // DB Host
  port: process.env.DB_PORT, // DB Port
  database: process.env.DB_NAME, // DB Name
});

const app = express();

app.use(express.json());

// API ROUTES

app.get("/", async (req, res) => {
  try {
    const sql = "SELECT * FROM contacts";

    const contacts = await db.query(sql);

    res.status(200).send(contacts.rows);
  } catch (e) {
    console.log(e);
    res.status(500).send({ erro: "An error has occured" });
  }
});

app.listen(3000, () =>
  console.log("Contacts - WEB API listening on port 3000"),
);
