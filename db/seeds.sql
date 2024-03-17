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
INSERT INTO employee (first_name, last_name, role_id)
VALUES 
('Ava', 'Marie', 3); -- Ava Marie is HR Manager

-- Query existing employees to ensure correct manager_id values
SET @manager_id1 = (SELECT id FROM employee WHERE first_name = 'Ava' AND last_name = 'Marie');

-- Insert other employees, ensuring that their manager_id references existing managers' id values
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Sarah', 'Kaif', 1, @manager_id1),
('Steve', 'Roberts', 2, @manager_id1),
('Don', 'Jackman', 4, @manager_id1),
('Adam', 'Stark', 2, @manager_id1);





