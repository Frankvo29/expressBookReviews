const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
 
let users = [];

const isValid = (username)=>{
  let userwithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userwithsamename.length > 0) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username, password)=> {
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password );
  });
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//Only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) { // Check if username or password is missing
    return res.status(404).json({message: "Error logging in"})
  }

  // If username & password are filled, check if they're authenticated
  if (authenticatedUser(username, password)) {

    // If authenticated -> Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, "access", {expiresIn: 60*60});

    // Then store the access token & username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in")
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const newReview = req.body.newReview;

  if (!books[isbn]) { // Check if the book exists
    return res.status(404).json({ message: "Book not found!" });
  }

  // Validate newReview
  if (newReview.trim().length === 0) {
    return res.status(400).json({ message: "Invalid review" });
  }

  const allReviews = Object.keys(books[isbn].reviews); // get details of all reviews
  const existReview = allReviews.find((review) => books[isbn].reviews[review].includes(`--by user: ${username}`)) // check if user has any review for current book

    if (existReview) { // if review exist, update that one
        books[isbn].reviews[existReview] = `${newReview} --by user: ${username}`;
        return res.status(200).json({ message: "Review updated!", reviewId: existReview });
    } else { // if not, create new review
        const newReviewId = `${allReviews.length + 1}`
        books[isbn].reviews[newReviewId] = `${newReview} --by user: ${username}`; // Store the review in the reviews object
        return res.status(200).json({ message: "Review added!", reviewId: newReviewId });
    }
  }
);

// Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const title = books[isbn].title;
  const username = req.session.authorization.username;
  const allReviews = Object.keys(books[isbn].reviews);
  const existReview = allReviews.find((review) => books[isbn].reviews[review].includes(`--by user: ${username}`))

  if (existReview) {
    delete books[isbn].reviews[existReview];
  }
  res.status(200).json(`Your review for ${title} has been deleted.`)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
