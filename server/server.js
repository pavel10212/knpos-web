const express = require("express");
const { Client } = require("pg");
const fs = require("fs");
const cors = require("cors")


const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const sslCertificate = fs.readFileSync("us-east-1-bundle.pem").toString();

const client = new Client({
  host: "knpos-database.chq84ao80cyq.us-east-1.rds.amazonaws.com",
  port: 5432,
  user: "postgres",
  password: "JXBy2NuoEuwZJc0mcDb6",
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

app.get("/inventory-get", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM inventory_item");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching data");
  }
});

app.get("/orders-get", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM orders");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching orders");
  }
});

app.post("/orders-insert", async (req, res) => {
  const {
    order_status,
    total_amount,
    order_date_time,
    completion_date_time,
    order_details,
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO orders
        (order_status, total_amount, order_date_time, completion_date_time, order_details)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [order_status, total_amount, order_date_time, completion_date_time, order_details]
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error inserting order");
  }
});

app.post("/table-insert", async (req, res) => {
    const tables = req.body;

    try {
        const results = [];
        for (const table of tables) {
            const { table_num, status, capacity, location } = table;
            const result = await client.query(
                `INSERT INTO table_table (table_num, status, capacity, x, y)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [table_num, status, capacity, location]
            );
            results.push(result.rows[0]);
        }
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error inserting tables", details: err.message });
    }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});