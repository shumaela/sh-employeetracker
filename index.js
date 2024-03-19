const inquirer = require('inquirer');
const mysql = require('mysql2');



// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'koko',
    database: 'office_db'
});

// Connect to the database
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Function to start the application
function startApp() {
    // Display initial prompts
    mainMenu();
}

// Function to display main menu options
function mainMenu() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then(answer => {
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
}

// Implement database functions directly here

function viewDepartments() {
    connection.query('SELECT * FROM department', (err, departments) => {
        if (err) throw err;
        console.table(departments);
        mainMenu();
    });
}

function viewRoles() {
    connection.query('SELECT role.title, role.id AS roleId, department.name AS departmentName, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;', (err, roles) => {
        if (err) throw err;
        console.table(roles);
        mainMenu();
    });
}

function viewEmployees() {
    // employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    // Employee, join role, department, employee
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, manager.first_name AS managerFirstName, manager.last_name AS managerLastName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON manager.id = employee.manager_id;', (err, employees) => {
        if (err) throw err;
        console.table(employees);
        mainMenu();
    });
}

function addDepartment() {
    inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the department:'
    }).then(answer => {
        connection.query('INSERT INTO department SET ?', { name: answer.name }, (err, res) => {
            if (err) throw err;
            console.log('Department added successfully!');
            mainMenu();
        });
    });
}

function addRole() {
    connection.query('SELECT * FROM department', (err, departments) => {
        if (err) throw err;
        const departmentData = departments.map(({id, name})=> ({
            name:name,
            value: id
        }))
        
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the title of the role:'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the salary for this role:'
            },
            {
                type: 'list', 
                name: 'department_id',
                message: 'Enter the department ID for this role:',
                choices: departmentData
            }
        ]).then(answer => {
            connection.query('INSERT INTO role SET ?', answer, (err, res) => {
                if (err) throw err;
                console.log('Role added successfully!');
                mainMenu();
            });
        });
    });

}

function addEmployee() {
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'Enter the first name of the employee:'
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'Enter the last name of the employee:'
        },
        {
            name: 'role_id',
            type: 'input',
            message: 'Enter the role ID for this employee:'
        },
        {
            name: 'manager_id',
            type: 'input',
            message: 'Enter the manager ID for this employee (optional):'
        }
    ]).then(answer => {
        connection.query('INSERT INTO employees SET ?', {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.role_id,
            manager_id: answer.manager_id || null // Set manager_id to null if not provided
        }, (err, res) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            mainMenu();
        });
    });
}


function updateEmployeeRole() {
    // Get the list of employees from the database
    connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employees', (err, employees) => {
        if (err) throw err;

        // Prompt the user to select an employee to update
        inquirer.prompt({
            name: 'employeeId',
            type: 'list',
            message: 'Select the employee to update:',
            choices: employees.map(employee => ({ name: employee.full_name, value: employee.id }))
        }).then(employeeAnswer => {
            // Get the list of roles from the database
            connection.query('SELECT id, title FROM roles', (err, roles) => {
                if (err) throw err;

                // Prompt the user to select a new role for the employee
                inquirer.prompt({
                    name: 'roleId',
                    type: 'list',
                    message: 'Select the new role for the employee:',
                    choices: roles.map(role => ({ name: role.title, value: role.id }))
                }).then(roleAnswer => {
                    // Execute the SQL UPDATE query to update the employee's role
                    connection.query(
                        'UPDATE employees SET role_id = ? WHERE id = ?',
                        [roleAnswer.roleId, employeeAnswer.employeeId],
                        (err, res) => {
                            if (err) throw err;
                            console.log('Employee role updated successfully!');
                            mainMenu();
                        }
                    );
                });
            });
        });
    });
}

startApp();
// Run the application


