const { Pool } = require('pg');

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres', //This _should_ be your username, as it's the default one Postgres uses
  host: 'localhost',
  database: 'Rental-System', //This should be changed to reflect your actual database
  password: 'tori', //This should be changed to reflect the password you used when setting up Postgres
  port: 5432,
});

/**
 * Creates the database tables, if they do not already exist.
 */
async function createTable() {
  // TODO: Add code to create Movies, Customers, and Rentals tables
  // Movies table
  // don't want the same table twice
  // - one director only and genre
  await pool.query(`
    CREATE TABLE IF NOT EXISTS movies ( 
      movie_id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      release_year INT NOT NULL,
      genre TEXT,
      director TEXT
    );
  `);
  // customers table
  // phone number should be TEXT not int
  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers ( 
      customer_id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone_number TEXT
    );
  `);

  // rentals table
  // movie was returned or should be 
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rentals ( 
      rental_id SERIAL PRIMARY KEY,  
      customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE,
      movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
      rental_date DATE NOT NULL,
      return_date DATE
    );
  `);
}


/**
 * Inserts a new movie into the Movies table.
 * @param {string} title Title of the movie
 * @param {number} year Year the movie was released
 * @param {string} genre Genre of the movie
 * @param {string} director Director of the movie
 */
async function insertMovie(title, year, genre, director) {
  try {
  await pool.query (`
  INSERT INTO movies (title, release_year, genre, director)
  VALUES ($1, $2, $3, $4)`, // numbers are placed holder for title and soon
  [title, year, genre, director]);
  console.log(`The Inserted movie ${title}`); // want to know if the movie was inserted 
  } catch (error) {
    // throw an error if it doesnt work
    console.error('There was an error when inserting the movie', error)
  }
};

/**
 * Prints all movies in the database to the console
 */
// need to make sure that all movies are being display
async function displayMovies() {
  try {
const allResult = await pool.query(`SELECT * FROM movies`);
  console.log('Movies:'); // double check 
  allResult.rows.forEach((movie) => {
    console.log(
      `Movie ID: ${movie.movie_id}, Title: ${movie.title}, Release Year: ${movie.release_year}, Genre: ${movie.genre}, Director: ${movie.director}`
    ); // gives back all info
  });
} catch (error) {
  console.error('There was an error displaying all of the movies', error) // want a error if it doesnt work
}

};

/**
 * Updates a customer's email address.
 * @param {number} customerId ID of the customer
 * @param {string} newEmail New email address of the customer
 */
async function updateCustomerEmail(customerId, newEmail) {
  try {
   const result = await pool.query(
    `UPDATE customers 
    SET email = $1 
    WHERE customerID = $2`,
    // 1 and 2 are placedholders 
    [newEmail, customerId]
   );

   if (result.rowCount === 0) { // if 0 nothing was chnaged 
      console.log(`The Customer ID "${customerId}" not found.`);
    } else {
      // email was changed 
      console.log(`The Customer email updated to "${newEmail}".`);
    }
  } catch (error) {
    console.error("There was an error updating the customer's email: ", error);
  }
};


/**
 * Removes a customer from the database along with their rental history.
 * 
 * @param {number} customerId ID of the customer to remove
 */
async function removeCustomer(customerId) {
   try {
     const result = await pool.query(
       `DELETE FROM customers 
      WHERE id = $1`,
       // 1 is a placedholders for id
       [customerId]
     );

     if (result.rowCount === 0) {
       // if 0 nothing was chnaged
       console.log(`The Customer ID "${customerId}" not found.`);
     } else {
       // customer id would be removed
       // when remove the rental history will be as well
       console.log(`The Customer ID "${customerId}" has been removed as well as their rental history.`);
     }
   } catch (error) {
     console.error("There was an error removing the customer ", error);
   }
};

/**
 * Prints a help message to the console
 */
function printHelp() {
  console.log('Usage:');
  console.log('  insert <title> <year> <genre> <director> - Insert a movie');
  console.log('  show - Show all movies');
  console.log('  update <customer_id> <new_email> - Update a customer\'s email');
  console.log('  remove <customer_id> - Remove a customer from the database');
}

/**
 * Runs our CLI app to manage the movie rentals database
 */
async function runCLI() {
   await createTable(); // Ensure that tables are created before processing commands

   const args = process.argv.slice(2);
   switch (args[0]) {
     case "insert":
       if (args.length !== 5) {
         printHelp();
         return;
       }
       await insertMovie(args[1], parseInt(args[2]), args[3], args[4]);
       break;
     case "show":
       await displayMovies();
       break;
     case "update":
       if (args.length !== 3) {
         printHelp();
         return;
       }
       await updateCustomerEmail(parseInt(args[1]), args[2]);
       break;
     case "remove":
       if (args.length !== 2) {
         printHelp();
         return;
       }
       await removeCustomer(parseInt(args[1]));
       break;
     default:
       printHelp();
       break;
   }

   await pool.end();
}

 runCLI().catch((err) => console.error("Error running CLI:", err));
