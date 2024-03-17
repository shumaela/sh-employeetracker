const inquirer = require('inquirer');
const mysql = require('mysql2');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: 'koko',
    database: 'office_db'
});

// Connect to the database
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
    startApp();
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
    connection.query('SELECT * FROM departments', (err, departments) => {
        if (err) throw err;
        console.table(departments);
        mainMenu();
    });
}

function viewRoles() {
    connection.query('SELECT * FROM roles', (err, roles) => {
        if (err) throw err;
        console.table(roles);
        mainMenu();
    });
}

function viewEmployees() {
    connection.query('SELECT * FROM employees', (err, employees) => {
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
        connection.query('INSERT INTO departments SET ?', { name: answer.name }, (err, res) => {
            if (err) throw err;
            console.log('Department added successfully!');
            mainMenu();
        });
    });
}

function addRole() {
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
            name: 'department_id',
            type: 'input',
            message: 'Enter the department ID for this role:'
        }
    ]).then(answer => {
        connection.query('INSERT INTO roles SET ?', {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department_id
        }, (err, res) => {
            if (err) throw err;
            console.log('Role added successfully!');
            mainMenu();
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


