const express = require("express");
const { Client } = require("pg");
const fs = require("fs");


const app = express();
app.use(express.json()); 
const port = 3000;

const sslCertificate = fs.readFileSync("us-east-1-bundle.pem").toString();

const client = new Client({
  host: "none",
  port: 5432,
  user: "postgres",
  password: "none",
  database: "postgres",
  ssl: {
    ca: sslCertificate,
  },
});

client.connect();

app.get("/data", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM orders");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data");
  }
});

app.get("/menu-get", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM menu_item");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data");
  }
});

app.post("/menu-insert", async (req, res) => {
  const { menu_item_name, description, price, category, menu_item_image } =
    req.body;
  try {
    const result = await client.query(
      "INSERT INTO menu_item (menu_item_name, description, price, category, menu_item_image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [menu_item_name, description, price, category, menu_item_image]
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error inserting data");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
