CREATE TABLE companys (
    id SERIAL PRIMARY KEY,
    companyName VARCHAR(255) NOT NULL,
    SubscriptionEXpiresday DATE NOT NULL
)

CREATE TABLE staffs (
    id SERIAL PRIMARY KEY,
    company INTEGER NOT NULL,
    
    FOREIGN KEY (company) REFERENCES companys (id),
    staffid INTEGER NOT NULL,
    staffPassword VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,

    department VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    entry_date DATE NOT NULL
);

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER NOT NULL,
    FOREIGN key (staff_id) REFERENCES staffs (id),
    div_id VARCHAR(255) NOT NULL,
    event TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

ALTER TABLE schedule ADD COLUMN div_id VARCHAR(255);

SELECT * FROM schedule;


INSERT INTO public.companys
(id, companyname, subscriptionexpiresday)
VALUES(1, '689store', '2022-12-30');
INSERT INTO public.companys
(id, companyname, subscriptionexpiresday)
VALUES(2, 'ok shop', '2022-11-28');


INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(1, 1, 1001, '0001', 'Peter', 'CEO', 'CEO', '2000-01-01');
INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(2, 1, 1002, '0002', 'Tom', 'HR', 'deptHead', '2000-01-02');
INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(3, 1, 1003, '0003', 'Him', 'logistics ', 'staff', '2000-01-03');
INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(4, 1, 1004, '0004', 'Ada', 'salesman', 'staff', '2000-01-04');
INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(5, 2, 2001, '0001', 'Alex', 'CEO', 'CEO', '2001-01-01');
INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(6, 2, 2002, '0002', 'Angel', 'HR', 'deptHead', '2001-01-02');
INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(7, 2, 2003, '0003', 'Angela', 'logistics ', 'staff', '2001-01-03');
INSERT INTO public.staffs (id, company, staffid, staffpassword, "name", department, "position", entry_date) VALUES(8, 2, 2004, '0004', 'Him', 'salesman	', 'staff', '2001-01-04');



