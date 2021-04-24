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
    console.log(`success! connected as id ${connection.threadId}`);
    start();
  })

  const start = () => {
      inquirer
      .prompt(
          {
              name: "choice",
              type: "list",
              message: "What would you like to do?",
              choices: [
                "Add department",
                "Add role",
                "Add employee",
                "View departments",
                "View roles",
                "View employees",
                "Update employee roles",
                "Exit"
            ]
          }
      )
      .then(answer => {
        switch (answer.choice) {
            case "Add department":
                addDepartment();
                break;
            
            case "Add role":
                addRole();
                break;
            
            case "Add employee":
                addEmployee();
                break;
            
            case "View departments":
                viewDepartments();
                break;
            
            case "View roles":
                viewRoles();
                break;
            
            case "View employees":
                viewEmployees();
                break;
            
            case "Update employee roles":
                updateEmployeeRoles();
                break;
            
            case "Exit": // exits but I also get some wierd error
                console.log("Goodebye!");
                connection.end();
                break;
            
            default:
                console.log("Somehow you found a way to break me! Please choose a valid option.");
                start();
                break;
        }
      });
  }
  
  const addDepartment = () => {
    console.log("--------------------");
    console.log("-- ADD DEPARTMENT --");
    console.log("--------------------");
    inquirer
    .prompt({
        name: "departmentName",
        type: "input",
        message: "Please enter the name of the department you would like to add: "
    })
    // TODO: THIS IS BROKEN WITH SYTAX
    .then((answer) => {
        const addName = "INSERT INTO department (name) VALUES ?";
        connection.query(addName, {departmentName: answer.departmentName}, (err, res) => {
            if (err) throw err;
            console.log(res);
        });
    });
  };
  
  const addRole = () => {
    console.log("--------------");
    console.log("-- ADD ROLE --");
    console.log("--------------");
  };
  
  const addEmployee = () => {
    console.log("------------------");
    console.log("-- ADD EMPLOYEE --");
    console.log("------------------");
  };

  const viewDepartments = () => {
    console.log("----------------------");
    console.log("-- VIEW DEPARTMENTS --");
    console.log("----------------------");
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        connection.end();
    })
  };

  const viewRoles = () => {
    console.log("----------------");
    console.log("-- VIEW ROLES --");
    console.log("----------------");
  };

  const viewEmployees = () => {
    console.log("--------------------");
    console.log("-- VIEW EMPLOYEES --");
    console.log("--------------------");
  };

  const updateEmployeeRoles = () => {
    console.log("-------------------------");
    console.log("-- UPDATE EMPLOYEE ROLES --");
    console.log("-------------------------");
  };



  const afterConnection = () => {
      connection.query('SELECT * FROM employee', (err, res) => {
          if (err) throw err;
          console.table(res);
          connection.end();
      })
  }


