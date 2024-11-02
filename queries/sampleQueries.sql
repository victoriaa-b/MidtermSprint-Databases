-- Creating tables

-- movies
CREATE TABLE IF NOT EXISTS movies ( 
    movie_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    release_year INT NOT NULL,
    genre TEXT,
    director TEXT
    );

-- customers
CREATE TABLE IF NOT EXISTS customers ( 
    customer_id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT
    );

-- rentals
CREATE TABLE IF NOT EXISTS rentals ( 
    rental_id SERIAL PRIMARY KEY,  
    customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE,
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    rental_date DATE NOT NULL,
    return_date DATE
    );

-- inserting data
-- 5 movies
INSERT INTO movies (title, release_year, genre, director)
VALUES
('The Last Song', '2010', 'Romance', 'Julie Anne Robinson'),
('Hannah Montana: The Movie', '2009', 'Family', 'Peter Chelsom'),
('So Undercover', '2012', 'Action', 'Tom Vaughan'),
('LOL', '2012', 'Romance', ' Lisa Azuelos'),
('If I Stay', '2014', 'Drama', 'R.J. Cutler');

-- 5 customers 
INSERT INTO customers (first_name, last_name, email, phone_number)
VALUES
('Deino', 'Dog','theDeinoDog@dogmail.com', '123-070-0222'),
('Damian', 'Breen', 'damianBreen8@dogmail.com', '123-444-2121'),
('Loki', 'Smith', 'lokiTheCat@dogmail.com', '123-222-2323'),
('Chelsea', 'Mooney', 'chelseaMooney@dogmail.com', '123-689-1234'),
('Sully', 'Shea', 'sullyMan@dogmail.com', '123-987-2202');

-- 10 rentals 
INSERT INTO rentals (customer_id, movie_id, rental_date, return_date)
VALUES 
-- maybe not all returned?
(1,2, '2024-09-02' , '2024-04-22'),
(2,3, '2024-05-11' , '2024-04-24'),
(3,1, '2024-05-02' , '2024-10-03'),
(4,4, '2024-02-11' , '2024-10-11'),
(5,5, '2024-02-02' , '2024-11-15'),
(2,5, '2024-03-02' , '2024-06-05'),
(5,4, '2024-08-02' , '2024-03-06'),
(3,3, '2024-09-02' , '2024-06-08'),
(2,2, '2024-04-02' , '2024-05-18'),
(4,1, '2024-01-02' , '2024-02-03'),
(1,4, '2024-02-02' , NULL);

