INSERT INTO department (name)
VALUES
('Tech'),
('Finance'),
('HR'),
('Asset Protection');

INSERT INTO role(title, salary, department_id)
VALUES
('FS Developer', 120000, 1),
('Accountant', 95000, 2),
('HR Manager', 100000, 3),
('Security', 65000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Sarah', 'Turner', 1, 3),
('Steve', 'Roberts', 2, 3),
('Ava', 'Marie', 3, NULL),
('Don', 'Jackman', 4, 3),
