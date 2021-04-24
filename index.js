const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employee_tracker',
  });

  connection.connect((err) => {
      if (err) throw err;
      console.log("success!")
      connection.end()
  })