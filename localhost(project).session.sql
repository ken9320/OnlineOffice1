CREATE TABLE companys (
    id SERIAL PRIMARY KEY,
    company_id  INTEGER NOT NULL,
    companyname VARCHAR(255) NOT NULL,
    subscriptionexpiresday DATE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

ALTER TABLE companys ADD COLUMN payment boolean;

UPDATE companys SET payment = true WHERE company_id = 1000;
UPDATE companys SET payment = FALSE WHERE company_id = 2000;

UPDATE companys SET payment = TRUE, updated_at = NOW() WHERE companyname = 'ok shop';


INSERT INTO companys
(company_id, companyname, subscriptionexpiresday, created_at, updated_at) VALUES
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
    updated_at TIMESTAMP NOT NULL,
    photo VARCHAR(255)
);

ALTER TABLE staffs ADD COLUMN photo VARCHAR(255)
;

INSERT INTO staffs (company, staff_id, staffPassword, name, dept, position, entry_date, created_at, updated_at) VALUES
    (1, 1001, '0001', 'Peter', 1, (SELECT id FROM positions WHERE position = 'Boss'), '2000-01-01', NOW(), NOW()),
    (1, 1002, '0002', 'Tom', 2, (SELECT id FROM positions WHERE position = 'manager'), '2000-01-02', NOW(), NOW()),
    (1, 1003, '0003', 'Him', 3, (SELECT id FROM positions WHERE position = 'staff'), '2000-01-03', NOW(), NOW()),
    (1, 1004, '0004', 'Ada', 4, (SELECT id FROM positions WHERE position = 'staff'), '2000-01-04', NOW(), NOW()),
    (2, 2001, '0001', 'Alex', 1, (SELECT id FROM positions WHERE position = 'Boss'), '2001-01-01', NOW(), NOW()),
    (2, 2002, '0002', 'Angel', 2, (SELECT id FROM positions WHERE position = 'manager'), '2001-01-02', NOW(), NOW()),
    (2, 2003, '0003', 'Angela', 3, (SELECT id FROM positions WHERE position = 'staff'), '2001-01-03', NOW(), NOW()),
    (2, 2004, '0004', 'Him', 4, (SELECT id FROM positions WHERE position = 'staff'), '2001-01-04', NOW(), NOW());

INSERT INTO staffs (company, staff_id, staffPassword, name, dept, position, entry_date, created_at, updated_at) VALUES
            ((SELECT id FROM companys WHERE company_id = '1000'), $1, $2, $3, $4, $5, $6, NOW(), NOW())

ALTER TABLE public.staffs ADD photo varchar(255) NULL;

UPDATE public.staffs
SET company=1, staff_id=1220, staffpassword='$2a$10$yZ1v86YAbBmXfVWhBy4v1uUkpv4BGkNAJ.KNe6L78E.69FmetoYD2', "name"='Rose', dept=2, "position"=3, entry_date='2022-07-12', created_at='2022-07-12 17:15:54.573', updated_at='2022-07-12 17:15:54.573', photo='c9476f679cb6aa0c2f27afb00.png'
WHERE id=45;
UPDATE public.staffs
SET company=1, staff_id=1001, staffpassword='$2a$10$ByJqLgH5NXa7hBOYL2x3z.V7ogU9kAP5OXpI6XwQyDLYgDb/TItdG', "name"='Peter', dept=1, "position"=1, entry_date='2000-01-01', created_at='2022-07-06 23:35:50.389', updated_at='2022-07-06 23:35:50.389', photo='6def0becacec7450a7e400c36ab5bdd9.jpg'
WHERE id=3;
UPDATE public.staffs
SET company=2, staff_id=2001, staffpassword='$2a$10$ByJqLgH5NXa7hBOYL2x3z.V7ogU9kAP5OXpI6XwQyDLYgDb/TItdG', "name"='Alex', dept=1, "position"=1, entry_date='2001-01-01', created_at='2022-07-06 23:35:50.389', updated_at='2022-07-06 23:35:50.389', photo='1a0933f8fbf2ff1a89ed68b00.png'
WHERE id=7;
UPDATE public.staffs
SET company=1, staff_id=1002, staffpassword='$2a$10$recc4DSvLFXCEXzZxHkQYuR7U7S.pERjLj5v5WA6kFYsEdiXcs4d6', "name"='Tom', dept=2, "position"=2, entry_date='2000-01-02', created_at='2022-07-06 23:35:50.389', updated_at='2022-07-06 23:35:50.389', photo='086cf1cbab06c7190ca77ddd051f972a.jpg'
WHERE id=4;
UPDATE public.staffs
SET company=2, staff_id=2002, staffpassword='$2a$10$recc4DSvLFXCEXzZxHkQYuR7U7S.pERjLj5v5WA6kFYsEdiXcs4d6', "name"='Angel', dept=2, "position"=2, entry_date='2001-01-02', created_at='2022-07-06 23:35:50.389', updated_at='2022-07-06 23:35:50.389', photo='0467d8d5e9c3a7290f1229400.png'
WHERE id=8;
UPDATE public.staffs
SET company=1, staff_id=1003, staffpassword='$2a$10$5vEnzCzotkwDAent1evRUOde/HpQ5x3gJ2UzvJ.Lf59IlZ0q1PSwm', "name"='Him', dept=3, "position"=3, entry_date='2000-01-03', created_at='2022-07-06 23:35:50.389', updated_at='2022-07-06 23:35:50.389', photo='9949d46e405267ffb00c5afe10593c2a.jpg'
WHERE id=5;
UPDATE public.staffs
SET company=2, staff_id=2003, staffpassword='$2a$10$5vEnzCzotkwDAent1evRUOde/HpQ5x3gJ2UzvJ.Lf59IlZ0q1PSwm', "name"='Angela', dept=3, "position"=3, entry_date='2001-01-03', created_at='2022-07-06 23:35:50.389', updated_at='2022-07-06 23:35:50.389', photo='24520b0fe13e868571afe4e00.png'
WHERE id=9;
UPDATE public.staffs
SET company=2, staff_id=2004, staffpassword='$2a$10$QOI6M57pvf6r50zT2rreKunEDNzkcxVh18bqgVjIgJH7Tk.O09XFa', "name"='Him', dept=4, "position"=3, entry_date='2001-01-04', created_at='2022-07-06 23:35:50.389', updated_at='2022-07-06 23:35:50.389', photo='bda0db8c92f24ef72d1e5f708bd099df.jpg'
WHERE id=10;
UPDATE public.staffs
SET company=1, staff_id=1004, staffpassword='$2a$10$QOI6M57pvf6r50zT2rreKunEDNzkcxVh18bqgVjIgJH7Tk.O09XFa', "name"='Ada', dept=4, "position"=3, entry_date='2000-01-04', created_at='2022-07-06 23:35:50.389', updated_at='2022-07-06 23:35:50.389', photo='c9476f679cb6aa0c2f27afb00.png'
WHERE id=6;
UPDATE public.staffs
SET company=1, staff_id=1401, staffpassword='$2a$10$I.gRz9fQHYK41uCVVpqydOQx8hjaZFC/a/eZruZPMSiBHgLXJdpQ.', "name"='Herry', dept=4, "position"=3, entry_date='2022-07-08', created_at='2022-07-08 16:21:34.211', updated_at='2022-07-08 16:21:34.211', photo='d426488282cb72acac7378a00.jpg'
WHERE id=18;
UPDATE public.staffs
SET company=1, staff_id=1402, staffpassword='$2a$10$ky9ldjKDLtIPhlXZCuZHP.WVILljA4Lod7zfNKPRQuD/TfSQ3UuNW', "name"='Adam', dept=4, "position"=3, entry_date='2022-07-08', created_at='2022-07-08 16:23:40.345', updated_at='2022-07-08 16:23:40.345', photo='ec29e8c7b9e7619ec7527f200.jpg'
WHERE id=20;
UPDATE public.staffs
SET company=1, staff_id=1403, staffpassword='$2a$10$pNJEfT/qUpebncrqRCpdX.e5IZn6Tqr9jkI16FttPxiqN6B4SfJmK', "name"='Annie', dept=4, "position"=3, entry_date='2022-07-08', created_at='2022-07-08 16:49:43.577', updated_at='2022-07-08 16:49:43.577', photo='f5f61dcd30b26b33490169b00.jpg'
WHERE id=25;
UPDATE public.staffs
SET company=1, staff_id=1302, staffpassword='$2a$10$0msprlSHGNrPsMGgz0HXyeHGh6Z/Wc3DU2O6Zamt3NwuvpuOGPx4e', "name"='Jasmine', dept=3, "position"=3, entry_date='2022-07-08', created_at='2022-07-08 16:59:14.885', updated_at='2022-07-08 16:59:14.885', photo='f1105a4fa44b9145f10d2bd00.png'
WHERE id=27;
UPDATE public.staffs
SET company=1, staff_id=1303, staffpassword='$2a$10$CGMAMU02JGXMXlA6UJMOA.ULzOXb7c9oTxkmFfaXfZ8ADijrkEZ/G', "name"='Anson', dept=3, "position"=3, entry_date='2022-10-07', created_at='2022-07-10 23:47:31.129', updated_at='2022-07-10 23:47:31.129', photo='icon-person250x250.png'
WHERE id=31;
UPDATE public.staffs
SET company=1, staff_id=1118, staffpassword='$2a$10$vnxPRqBozB6Nx4qtSjJaJOqOCmdWZsL.faO./3o7v2sTI5ZS8zL06', "name"='Sherry', dept=1, "position"=1, entry_date='2022-07-30', created_at='2022-07-12 15:39:17.880', updated_at='2022-07-12 15:39:17.880', photo='icon-person250x250.png'
WHERE id=36;
UPDATE public.staffs
SET company=1, staff_id=1301, staffpassword='$2a$10$bEYne4wVIDg4lU3DcxTn9OQqJCLHC2bIi3IMRrqspmeQmywAzJx36', "name"='Jerry', dept=3, "position"=3, entry_date='2022-07-08', created_at='2022-07-08 16:56:13.336', updated_at='2022-07-08 16:56:13.336', photo='icon-person250x250.png'
WHERE id=26;
UPDATE public.staffs
SET company=1, staff_id=1201, staffpassword='$2a$10$apomZxlwCmUBLZBspJR5pudjff5AdQxpwCjimzt17sE8dJxcspEDG', "name"='Man', dept=2, "position"=3, entry_date='2022-07-12', created_at='2022-07-12 10:25:48.710', updated_at='2022-07-12 10:25:48.710', photo='icon-person250x250.png'
WHERE id=35;


SELECT company_id, companyname, dept_id, deptname, staff_id, name, positions.position FROM staffs join companys ON staffs.company = companys.id join department ON staffs.dept = department.id join positions ON staffs.position = positions.id;

SELECT * FROM staffs join companys ON staffs.company = companys.id join department ON staffs.dept = department.id join positions ON staffs.position = positions.id;

SELECT company_id, companyname, dept_id, deptname, staff_id, name, positions.position FROM staffs join companys ON staffs.company = companys.id join department ON staffs.dept = department.id join positions ON staffs.position = positions.id WHERE company_id IN (SELECT company_id FROM staffs join companys ON staffs.company = companys.id join department ON staffs.dept = department.id join positions ON staffs.position = positions.id WHERE (positions.position LIKE 'l%' OR department.deptname LIKE 'l%') AND company_id=1000);
           
SELECT company_id FROM staffs join companys ON staffs.company = companys.id join department ON staffs.dept = department.id join positions ON staffs.position = positions.id WHERE positions.position = 's%' OR department.deptname LIKE 'l%';


CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
  
    div_id VARCHAR(255) NOT NULL,
    event TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

SELECT * FROM schedule ORDER BY id;

SELECT * FROM schedule WHERE staffid = 1001;

INSERT INTO schedule (staffid, event, date, time, div_id, created_at, updated_at) VALUES (1001, 'test', '2000-01-01', '00:00:00', '000', NOW(), NOW());

 UPDATE staffs SET staffpassword='$2a$10$ByJqLgH5NXa7hBOYL2x3z.V7ogU9kAP5OXpI6XwQyDLYgDb/TItdG'  where staff_id='1001';
 UPDATE staffs SET staffpassword='$2a$10$ByJqLgH5NXa7hBOYL2x3z.V7ogU9kAP5OXpI6XwQyDLYgDb/TItdG'  where staff_id='2001';
 UPDATE staffs SET staffpassword='$2a$10$recc4DSvLFXCEXzZxHkQYuR7U7S.pERjLj5v5WA6kFYsEdiXcs4d6'  where staff_id='1002';
 UPDATE staffs SET staffpassword='$2a$10$recc4DSvLFXCEXzZxHkQYuR7U7S.pERjLj5v5WA6kFYsEdiXcs4d6'  where staff_id='2002';
 UPDATE staffs SET staffpassword='$2a$10$5vEnzCzotkwDAent1evRUOde/HpQ5x3gJ2UzvJ.Lf59IlZ0q1PSwm'  where staff_id='1003';
 UPDATE staffs SET staffpassword='$2a$10$5vEnzCzotkwDAent1evRUOde/HpQ5x3gJ2UzvJ.Lf59IlZ0q1PSwm'  where staff_id='2003';
 UPDATE staffs SET staffpassword='$2a$10$QOI6M57pvf6r50zT2rreKunEDNzkcxVh18bqgVjIgJH7Tk.O09XFa'  where staff_id='2004';
 UPDATE staffs SET staffpassword='$2a$10$QOI6M57pvf6r50zT2rreKunEDNzkcxVh18bqgVjIgJH7Tk.O09XFa'  where staff_id='1004';








