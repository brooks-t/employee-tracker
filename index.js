const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employee_tracker',
  });

  const start = () => {
      inquirer.prompt(
          {
              name: "choice",
              type: "list",
              message: "What would you like to do?",
              choices: ["Add department", "Add roles", "Add employees", "View departments", "View roles", "View employees", "Update employee roles"]
          }
      ).then(answer => {
        console.log(`You chose: `, answer.choice)
      });
      connection.end();
  }

  const afterConnection = () => {
      connection.query('SELECT * FROM employee', (err, res) => {
          if (err) throw err;
          console.table(res);
          connection.end();
      })
  }
  
  connection.connect((err) => {
      if (err) throw err;
      console.log(`success! connected as id ${connection.threadId}`);
      start();
  })

