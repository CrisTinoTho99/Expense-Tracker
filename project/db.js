const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

let connection;
async function main() {
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "expense tracker",
      port: 3307,
    });

    console.log("Connected to MySQL Server!");

    app.get("/transactions", async (req, res) => {
      try {
        const [rows] = await connection.query("SELECT * FROM transactions");
        console.log("The data from transactions table are:\n", rows);
        res.json(rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.get("/categories", async (req, res) => {
      try {
        const [rows] = await connection.query("SELECT * FROM categories");
        console.log("The data from categories table are:\n", rows);
        res.json(rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Task : Amount of money spend in category
    // Goal get data expenses and income  print data in database
    app.get("/expenses", async (req, res) => {
      try {
        const [rows] = await connection.query(
          "SELECT SUM(amount) as total_expense FROM transactions WHERE type = 'expense'",
        );

        res.json(rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    // Task : Amount of money income in category
    //

    app.get("/income", async (req, res) => {
      try {
        const [rows] = await connection.query(
          "SELECT SUM(amount) as total_income FROM transactions WHERE type = 'income'",
        );
        res.json(rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.get("/balance", async (req, res) => {
      try {
        const [rows] = await connection.query(
          "SELECT SUM(amount) as total_income FROM transactions WHERE type = 'income'",
        );
        const [rows2] = await connection.query(
          "SELECT SUM(amount) as total_expense FROM transactions WHERE type = 'expense'",
        );
        const balance = rows[0].total_income - rows2[0].total_expense;
        res.json({ balance });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.post("/insert", async (req, res) => {
      try {
        const fakeData = {
          type: "expense",
          amount: Math.floor(Math.random() * 100000),
          category: "food",
          note: "fake data test",
          date: new Date().toISOString().slice(0, 10),
        };

        await connection.query(
          "INSERT INTO transactions (type, amount, category, note, date) VALUES (?, ?, ?, ?, ?)",
          [
            fakeData.type,
            fakeData.amount,
            fakeData.category,
            fakeData.note,
            fakeData.date,
          ],
        );

        res.json({
          success: true,
          data: fakeData,
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
    app.delete("/delete/:id", async (req, res) => {
      try {
        const id = req.params.id;
        await connection.query("DELETE FROM transactions WHERE id = ?", [id]);
        res.json({
          success: true,
          message: `Transaction with id ${id} deleted.`,
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.put("/update/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { type, amount, category, note, date } = req.body;

        const [result] = await connection.query(
          `UPDATE transactions 
       SET type = ?, amount = ?, category = ?, note = ?, date = ?
       WHERE id = ?`,
          [type, amount, category, note, date, id],
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Transaction not found",
          });
        }

        res.json({
          success: true,
          message: `Transaction ${id} updated`,
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.listen(3000, () => {
      console.log("Server is running at port 3000");
    });
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

main();
// so we must use await because mysql2  function createconection returns function promise
