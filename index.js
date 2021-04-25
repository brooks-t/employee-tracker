const mysql = require("mysql");
const inquirer = require("inquirer");

const roleList =[];

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

  const getRoleList = async () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        res.forEach(({title}) => roleList.push(title));
    }) 
  };

  const start = () => {
      console.log("======================");
      console.log("== EMPLOYEE TRACKER ==");
      console.log("======================");
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
            
            case "Exit":
                console.log("Exiting Employee Tracker...\nGoodebye!");
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
    .then(answer => {
        const addName = "INSERT INTO department (name) VALUES (?)";
        const queryDepartments = "SELECT * FROM department";
        connection.query(addName, answer.departmentName, (err, res) => {
            if (err) throw err;
            console.log(answer.departmentName, ` has been added to Departments!`);
            connection.query(queryDepartments, (err, res) => {
                if (err) throw err;
                console.table(res);
                inquirer
                .prompt({
                    name: "choice",
                    type: "list",
                    message: "What would you like to do next?",
                    choices: ["Return to main menu", "Add another department", "Exit"]
                })
                .then(answer => {
                    if (answer.choice === "Exit") {
                        connection.end();
                        console.log("Exiting Employee Tracker...\nGoodbye!");
                    } else if (answer.choice === "Return to main menu") {
                        start();
                    } else {
                        addDepartment();
                    }
                })  
            });
        });
    });
  };
  
  const addRole = () => {
    console.log("--------------");
    console.log("-- ADD ROLE --");
    console.log("--------------");
    
    const departmentList = [];
    
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        res.forEach(({ id, name }) => departmentList.push({id, name}));
    })

    inquirer
    .prompt([
        {
            name: "roleTitle",
            type: "input",
            message: "Please enter the title of the role you would like to add: "
        },
        {
            name: "roleSalary",
            type: "input",
            message: "Please enter the salary for role you are adding: "
        },
        {
            name: "departmentChoice",
            type: "list",
            message: "Which department would you like to add this role to?",
            choices: departmentList
        }
    ])
    .then(answer => {
        console.log(`Adding role:\n`, answer);

        const queryAddRole = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
        const queryRoles = "SELECT * FROM role";

        const getDepartmentId = () => {
            for (i=0; i < departmentList.length; i++) {
                if (departmentList[i].name === answer.departmentChoice) {
                    let matchedId = departmentList[i].id;
                    console.log(`${answer.departmentChoice} is matched with ${matchedId}`);
                    return matchedId
                };
            };
        };

        const departmentId = getDepartmentId();
        
        connection.query(queryAddRole, [answer.roleTitle, answer.roleSalary, departmentId], (err, res) => {
            if (err) throw err;
            console.log(`Title: ${answer.roleTitle}\nSalary: ${answer.roleSalary}\nDepartment: ${answer.departmentChoice}\n has been added to Roles!`);
            connection.query(queryRoles, (err, res) => {
                if (err) throw err;
                console.table(res);
                inquirer
                .prompt({
                    name: "choice",
                    type: "list",
                    message: "What would you like to do next?",
                    choices: ["Return to main menu", "Add another role", "Exit"]
                })
                .then(answer => {
                    if (answer.choice === "Exit") {
                        connection.end();
                        console.log("Exiting Employee Tracker...\nGoodbye!");
                    } else if (answer.choice === "Return to main menu") {
                        start();
                    } else {
                        addRole();
                    };
                })  
            });
        });
    });
  };
  
  const addEmployee = async () => { 
    console.log("------------------");
    console.log("-- ADD EMPLOYEE --");
    console.log("------------------");

    await getRoleList();
    
    await inquirer
    .prompt([
        {
            name: "firstName",
            type: "input",
            message: "Please enter the first name of this employee: "
        },
        {
            name: "lastName",
            type: "input",
            message: "Please enter the last name of this employee"
        },
        {
            name: "roleChoice",
            type: "list",
            message: "Please assign a role to your employee",
            choices: roleList
        }
    ])
    .then(answer => {
        console.log(`The employee's name is ${answer.firstName} ${answer.lastName} and their role is ${answer.roleChoice}`);
        connection.end();
    })
  }

  const viewDepartments = () => {
    console.log("----------------------");
    console.log("-- VIEW DEPARTMENTS --");
    console.log("----------------------");
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "What would you like to do next?",
            choices: ["Return to main menu", "Exit"]
        })
        .then(answer => {
            if (answer.choice === "Exit") {
                connection.end();
                console.log("Exiting Employee Tracker...\nGoodbye!");
            } else {
                start();
            }
        })  
    })
  };

  const viewRoles = () => {
    console.log("----------------");
    console.log("-- VIEW ROLES --");
    console.log("----------------");
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "What would you like to do next?",
            choices: ["Return to main menu", "Exit"]
        })
        .then(answer => {
            if (answer.choice === "Exit") {
                connection.end();
                console.log("Exiting Employee Tracker...\nGoodbye!");
            } else {
                start();
            }
        })  
    })
  };

  const viewEmployees = () => {
    console.log("--------------------");
    console.log("-- VIEW EMPLOYEES --");
    console.log("--------------------");
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "What would you like to do next?",
            choices: ["Return to main menu", "Exit"]
        })
        .then(answer => {
            if (answer.choice === "Exit") {
                connection.end();
                console.log("Exiting Employee Tracker...\nGoodbye!");
            } else {
                start();
            }
        })  
    })
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
  };

