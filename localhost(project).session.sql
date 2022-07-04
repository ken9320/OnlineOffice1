CREATE TABLE companys (
    id SERIAL PRIMARY KEY,
    companyName VARCHAR(255) NOT NULL,
    SubscriptionEXpiresday DATE NOT NULL
)

CREATE TABLE staffs (
    id SERIAL PRIMARY KEY,
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
    FOREIGN key (staff_id) REFERENCES staffs (id)
    event TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

