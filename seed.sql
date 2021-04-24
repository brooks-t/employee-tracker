USE employee_tracker;

INSERT INTO department (name) VALUES ("Human Resources");
INSERT INTO department (name) VALUES ("Customer Service");
INSERT INTO department (name) VALUES ("User Experience");
INSERT INTO department (name) VALUES ("Executive Suite");

INSERT INTO role (title, salary, department_id) VALUES ("HR Specialist", 60000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Customer Service Rep", 40000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("UX Researcher", 40000, 3);
INSERT INTO role (title, salary, department_id) VALUES ("God Emperor", 100000000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Hingle", "McCringleberry", 1, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Depez", "Poopsie", 2, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("J'Dinklage", "Morgoone", 3, 4);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Deckster", "Gibbs", 4);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;