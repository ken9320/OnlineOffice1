CREATE TABLE companys (
    id SERIAL PRIMARY KEY,
    company_id  INTEGER NOT NULL,
    companyname VARCHAR(255) NOT NULL,
    subscriptionexpiresday DATE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

INSERT INTO companys
(company_id, companyname, subscriptionsxpiresday, created_at, updated_at) VALUES
    (1000, '689store', '2022-12-30', NOW(), NOW()),
    (2000, 'ok shop', '2022-11-28', NOW(), NOW());

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    dept_id INTEGER NOT NULL,
    deptname VARCHAR(255) NOT NULL
);

INSERT INTO department (dept_id, deptname) VALUES
    (100, 'CEO'),
    (200, 'HR'),
    (300, 'logistics'),
    (400, 'sales');

CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    position VARCHAR(255) NOT NULL,
    manager boolean NOT NULL
);

INSERT INTO positions (position, manager) VALUES
    ('Boss', TRUE),
    ('manager', TRUE),
    ('staff', FALSE);

CREATE TABLE staffs (
    id SERIAL PRIMARY KEY,
    company INTEGER NOT NULL,
    FOREIGN KEY (company) REFERENCES companys(id),
    staff_id INTEGER NOT NULL,
    staffpassword VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    dept INTEGER NOT NULL,
    FOREIGN KEY (dept) REFERENCES department(id),
    position INTEGER NOT NULL,
    FOREIGN KEY (position) REFERENCES positions(id),
    entry_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);


INSERT INTO staffs (company, staff_id, staffPassword, name, dept, position, entry_date, created_at, updated_at) VALUES
    (1, 1001, '0001', 'Peter', 1, (SELECT id FROM positions WHERE position = 'Boss'), '2000-01-01', NOW(), NOW()),
    (1, 1002, '0002', 'Tom', 2, (SELECT id FROM positions WHERE position = 'manager'), '2000-01-02', NOW(), NOW()),
    (1, 1003, '0003', 'Him', 3, (SELECT id FROM positions WHERE position = 'staff'), '2000-01-03', NOW(), NOW()),
    (1, 1004, '0004', 'Ada', 4, (SELECT id FROM positions WHERE position = 'staff'), '2000-01-04', NOW(), NOW()),
    (2, 2001, '0001', 'Alex', 1, (SELECT id FROM positions WHERE position = 'Boss'), '2001-01-01', NOW(), NOW()),
    (2, 2002, '0002', 'Angel', 2, (SELECT id FROM positions WHERE position = 'manager'), '2001-01-02', NOW(), NOW()),
    (2, 2003, '0003', 'Angela', 3, (SELECT id FROM positions WHERE position = 'staff'), '2001-01-03', NOW(), NOW()),
    (2, 2004, '0004', 'Him', 4, (SELECT id FROM positions WHERE position = 'staff'), '2001-01-04', NOW(), NOW());


 SELECT * FROM staffs join companys ON staffs.company = companys.id join department ON staffs.dept = department.id join positions ON staffs.position = positions.id;

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    FOREIGN key (staff_id) REFERENCES staffs (staff_id),
    div_id VARCHAR(255) NOT NULL,
    event TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

ALTER TABLE schedule ADD COLUMN div_id VARCHAR(255);

SELECT * FROM schedule;


 UPDATE staffs SET staffpassword='$2a$10$ByJqLgH5NXa7hBOYL2x3z.V7ogU9kAP5OXpI6XwQyDLYgDb/TItdG'  where staff_id='1001';
 UPDATE staffs SET staffpassword='$2a$10$ByJqLgH5NXa7hBOYL2x3z.V7ogU9kAP5OXpI6XwQyDLYgDb/TItdG'  where staff_id='2001';
 UPDATE staffs SET staffpassword='$2a$10$recc4DSvLFXCEXzZxHkQYuR7U7S.pERjLj5v5WA6kFYsEdiXcs4d6'  where staff_id='1002';
 UPDATE staffs SET staffpassword='$2a$10$recc4DSvLFXCEXzZxHkQYuR7U7S.pERjLj5v5WA6kFYsEdiXcs4d6'  where staff_id='2002';
 UPDATE staffs SET staffpassword='$2a$10$5vEnzCzotkwDAent1evRUOde/HpQ5x3gJ2UzvJ.Lf59IlZ0q1PSwm'  where staff_id='1003';
 UPDATE staffs SET staffpassword='$2a$10$5vEnzCzotkwDAent1evRUOde/HpQ5x3gJ2UzvJ.Lf59IlZ0q1PSwm'  where staff_id='2003';
 UPDATE staffs SET staffpassword='$2a$10$QOI6M57pvf6r50zT2rreKunEDNzkcxVh18bqgVjIgJH7Tk.O09XFa'  where staff_id='2004';
 UPDATE staffs SET staffpassword='$2a$10$QOI6M57pvf6r50zT2rreKunEDNzkcxVh18bqgVjIgJH7Tk.O09XFa'  where staff_id='1004';





INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(1, 1, 1001, '0001', 'Peter', 'CEO', 'CEO', '2000-01-01');
INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(2, 1, 1002, '0002', 'Tom', 'HR', 'deptHead', '2000-01-02');
INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(3, 1, 1003, '0003', 'Him', 'logistics ', 'staff', '2000-01-03');
INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(4, 1, 1004, '0004', 'Ada', 'salesman', 'staff', '2000-01-04');
INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(5, 2, 2001, '0001', 'Alex', 'CEO', 'CEO', '2001-01-01');
INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(6, 2, 2002, '0002', 'Angel', 'HR', 'deptHead', '2001-01-02');
INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(7, 2, 2003, '0003', 'Angela', 'logistics ', 'staff', '2001-01-03');
INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(8, 2, 2004, '0004', 'Him', 'salesman	', 'staff', '2001-01-04');



