CREATE TABLE staffs (
    id SERIAL PRIMARY KEY,
    staffid INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    entry_date DATE NOT NULL,
);

CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    staffid INTEGER NOT NULL,
    event TEXT,
    time VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
);

