const mysql = require("mysql");
const inquirer = require("inquirer");

const roleList = [];
const roleId = [];
const managerList = [];
const managerId = [];
const employeeList = [];


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

  const getRoleId = async () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        res.forEach(({id, title}) => roleId.push({id, title}));
    })
  };

  const getManagerList = async () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        res.forEach(({first_name, last_name}) => managerList.push(first_name + " " + last_name));
    }) 
  };

  const getEmployeeList = async () => {
    connection.query("SELECT employee.id, first_name, last_name, title FROM employee JOIN role ON employee.role_id = role.id;", (err, res) => {
        if (err) throw err;
        res.forEach(({id, first_name, last_name, title}) => employeeList.push({id, first_name, last_name, title}));
    }) 
  };

  const getManagerId = async () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        res.forEach(({id, first_name, last_name}) => managerId.push({id, first_name, last_name}));
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

        const getDepartmentId = () => {
            for (i=0; i < departmentList.length; i++) {
                if (departmentList[i].name === answer.departmentChoice) {
                    let matchedId = departmentList[i].id;
                    return matchedId
                };
            };
        };

        const departmentId = getDepartmentId();

        const queryAddRole = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
        const queryRoles = "SELECT title, salary, name AS department FROM role JOIN department ON department_id = department.id;";
        
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

    await getManagerList();

    await getRoleId();

    await getManagerId();
    
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
        },
        {
            name: "managerChoice",
            type: "list",
            message: "Which manager would you like to assign to this employee?",
            choices: managerList
        }
    ])
    .then(answer => {
        const queryAddEmployee = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
        const queryEmployee = "SELECT employee.id, first_name, last_name, title AS role, manager_id FROM employee JOIN role ON employee.id = role.id;";

        const matchRoleId = () => {
            for (i=0; i < roleId.length; i++) {
                if (roleId[i].title === answer.roleChoice) {
                    let matchedId = roleId[i].id;
                    return matchedId;
                }
            }
        }

        const matchedRoleId = matchRoleId();

        const getManagerChoiceIndex = () => {
            for (i=0; i < managerList.length; i++) {
                if (answer.managerChoice === managerList[i]) {
                    let managerIndex = i;
                    return managerIndex;
                }

            }
        }
        const managerChoiceIndex = getManagerChoiceIndex();

        const matchManagerId = () => {
            for(i=0; i < managerId.length; i++) {
                if (managerChoiceIndex === i) {
                    let matchedId = managerId[i].id;
                    return matchedId;
                }
            }
        }

        const matchedManagerId = matchManagerId();

        connection.query(queryAddEmployee, [answer.firstName, answer.lastName, matchedRoleId, matchedManagerId], (err, res) => {
            if (err) throw err;
            console.log(`${answer.firstName} ${answer.lastName} has been given the role of ${answer.roleChoice} and has been assigned manager ${answer.managerChoice}. Adding to database....`);
            connection.query(queryEmployee, (err, res) => {
                if (err) throw err;
                console.table(res);
                inquirer
                .prompt({
                    name: "choice",
                    type: "list",
                    message: "What would you like to do next?",
                    choices: ["Return to main menu", "Add another employee", "Exit"]
                })
                .then(answer => {
                    if (answer.choice === "Exit") {
                        connection.end();
                        console.log("Exiting Employee Tracker...\nGoodbye!");
                    } else if (answer.choice === "Return to main menu") {
                        start();
                    } else {
                        addEmployee();
                    }
                })
            })
        })
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
    connection.query('SELECT title, salary, name AS department FROM role JOIN department ON department_id = department.id;', (err, res) => {
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
    connection.query('SELECT employee.id, first_name, last_name, title AS role, manager_id FROM employee JOIN role ON employee.id = role.id;', (err, res) => {
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

  const updateEmployeeRoles = async () => {
    console.log("-------------------------");
    console.log("-- UPDATE EMPLOYEE ROLES --");
    console.log("-------------------------");

    const employeeNames = [];

    await getRoleList();

    await getRoleId();

    await getManagerId();

    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        res.forEach(({first_name, last_name}) => employeeNames.push(first_name + " " + last_name));
        inquirer
        .prompt([
            {
                name: "employeeChoice",
                type: "list",
                message: "Which employee's role would you like to update?",
                choices: employeeNames
            },
            {
                name: "roleUpdate",
                type: "list",
                message: "Which role would you like to assign them?",
                choices: roleList
            }
        ])
        .then(answer => {

            const matchRoleId = () => {
                for (i=0; i < roleId.length; i++) {
                    if (roleId[i].title === answer.roleUpdate) {
                        let matchedId = roleId[i].id;
                        return matchedId;
                    }
                }
            }

            const matchedRoleId = matchRoleId();

            const getEmployeeChoiceIndex = () => {
                for (i=0; i < employeeNames.length; i++) {
                    if (answer.employeeChoice === employeeNames[i]) {
                        let employeeIndex = i;
                        return employeeIndex;
                    }
    
                }
            }
            const employeeChoiceIndex = getEmployeeChoiceIndex();

            const matchEmployeeId = () => {
                for(i=0; i < managerId.length; i++) {
                    if (employeeChoiceIndex === i) {
                        let matchedId = managerId[i].id;
                        return matchedId;
                    }
                }
            }
            const matchedEmployeeId = matchEmployeeId();

            const queryUpdateRole = "UPDATE employee SET ? WHERE ?";
            const queryUpdatedTable = "SELECT employee.id, first_name, last_name, title AS role, manager_id FROM employee JOIN role ON employee.id = role.id;";

            connection.query(queryUpdateRole, [{role_id: matchedRoleId},{id: matchedEmployeeId}], (err, res) => {
                if (err) throw err;
                console.log(`${answer.employeeChoice} with an id of ${matchedEmployeeId} has had their role updated to ${answer.roleUpdate} which has a role id of ${matchedRoleId}. Adding to database...`);
                connection.query(queryUpdatedTable, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    inquirer
                    .prompt({
                        name: "choice",
                        type: "list",
                        message: "What would you like to do next?",
                        choices: ["Return to main menu", "Update another employee's role", "Exit"]
                    })
                    .then(answer => {
                        if (answer.choice === "Exit") {
                            connection.end();
                            console.log("Exiting Employee Tracker...\nGoodbye!");
                        } else if (answer.choice === "Return to main menu") {
                            start();
                        } else {
                            updateEmployeeRoles();
                        }
                    })
                })
            })
        })
    })
  };
