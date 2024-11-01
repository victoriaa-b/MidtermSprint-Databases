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