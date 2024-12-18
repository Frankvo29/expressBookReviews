const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered!"})
    } else {
      return res.status(404).json({message: "User already exists!"})
    }
  } else {
    return res.status(404).json({message: "Missing information"})
}});
 
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.status(200).send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books) // Obtain all the keys of the books object

  // Filter books by matching the author
  const booksByAuthor = keys
    .map(key => books[key]) // Iterate through the books' keys
    .filter(book => book.author === author); // Filter matching author

  if (booksByAuthor.length > 0) {
    res.status(200).json(booksByAuthor);
  } else {
    res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books) // Obtain all the keys of the books object

  // Filter books by matching the title
  const booksByTitle = keys
    .map(key => books[key]) // Iterate through the books' keys
    .filter(book => book.title === title); // Filter matching title

  if (booksByTitle.length > 0) {
    res.status(200).json(booksByTitle);
  } else {
    res.status(404).json({message: "No books found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn; // extract ISBN from the req para
  const reviews = books[isbn].reviews; // extract the review from the ISBN above
  res.status(200).json(reviews);
 });

module.exports.general = public_users;
