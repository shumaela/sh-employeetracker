-- Insert departments
INSERT INTO department (name)
VALUES
('Tech'),
('Finance'),
('HR'),
('Asset Protection');

-- Insert roles
INSERT INTO role (title, salary, department_id)
VALUES
('FS Developer', 120000, 1),
('Accountant', 95000, 2),
('HR Manager', 100000, 3),
('Security', 65000, 4),
('Financial Analyst', 100000, 2);

-- Insert managers first
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Ava', 'Marie', 3, NULL), -- Ava Marie is HR Manager
('Sarah', 'Kaif', 1, 1),
('Steve', 'Roberts', 2,1),
('Don', 'Jackman', 4, 1),
('Adam', 'Stark', 2,1);








