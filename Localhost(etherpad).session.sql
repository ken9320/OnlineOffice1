SELECT * from store;

CREATE TABLE store (
    id SERIAL primary key,
    key VARCHAR(255) not null,
    value TEXT not null,
);