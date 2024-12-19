const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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
 
// TASK 1 - Get the book list available in the shop 
public_users.get('/',function (req, res) {
  const getListOfBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Books not found");
    }
  });

  getListOfBooks
  .then(list => {
    res.status(200).json(list)
  })
  .catch(error => {
    res.status(500).json(`error`, error)
  })
});

// TASK 2 - Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Books not found");
    }
  });

  getBookByISBN
  .then(list => {
    res.status(200).json(list)
  })
  .catch(error => {
    res.status(500).json(`error`, error)
  })
 });
  
// TASK 3 - Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books) // Obtain all the keys of the books object

  // Filter books by matching the author
  const booksByAuthor = keys
    .map(key => books[key]) // Iterate through the books' keys
    .filter(book => book.author === author); // Filter matching author

  const getBookByAuthor = new Promise((resolve, reject) => {
    if (booksByAuthor) {
      resolve(booksByAuthor);
    } else {
      reject("Books not found");
    }
  });

  getBookByAuthor
  .then(list => {
    res.status(200).json(list)
  })
  .catch(error => {
    res.status(500).json(`error`, error)
  })
  });

// TASK 4 - Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books)

  const booksByTitle = keys
    .map(key => books[key]) 
    .filter(book => book.title === title); 

  const getBookByTitle = new Promise((resolve, reject) => {
    if (booksByTitle) {
      resolve(booksByTitle);
    } else {
      reject("Books not found");
    }
  });

  getBookByTitle
  .then(list => {
    res.status(200).json(list)
  })
  .catch(error => {
    res.status(500).json(`error`, error)
  })
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn; // extract ISBN from the req para
  const reviews = books[isbn].reviews; // extract the review from the ISBN above
  res.status(200).json(reviews);
 });

module.exports.general = public_users;
