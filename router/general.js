const express = require('express');
let books = require("./booksdb.js");
let auth_users = require("./auth_users.js");
let users = require("./auth_users.js");
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {

    if (!auth_users.doesExist(username)) {
      users.users.push({
        "username": username,
        "password": password
      });
      return res.status(200).json({
        message: "User successfully registred. Now you can login"
      });
    }
    else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

//only registered users can login
public_users.post("/login", (req, res) => {
  users.users.forEach(user => {
    if (user.username === req.body.username &&
      user.password === req.body.password)
      return res.status(200).json({ message: "User successfully authenticated." });
  })
  return res.status(200).json({ message: "User not authenticated." });
});


// Get the book list available in the shop, using an async function:
public_users.get('/', async function (req, res) {
  return res.status(200).json({ books: books });
});

// Get book details based on ISBN, using a Promise:
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  for (let k of Object.keys(books)) {
    for (let kk of Object.keys(books[k])) {
      if (kk === 'isbn' && books[k][kk] === isbn) {
        return res.status(200).json({ book: books[k] });
      }
    }
  }

  const prom = new Promise((resolve, reject) => {
    if (book) { resolve(book); }
    else { reject(); }
  });

  return prom.then(
    book => res.status(200).json({ book: book }),
    () => res.status(404).json({ message: "No book found." })
  );
})

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  for (let k of Object.keys(books)) {
    for (let kk of Object.keys(books[k])) {
      if (kk === 'author' && books[k][kk] === author) {
        return res.status(200).json({ book: books[k] });
      }
    }
  }
  return res.status(404).json({ message: "No book found." });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  for (let k of Object.keys(books)) {
    for (let kk of Object.keys(books[k])) {
      if (kk === 'title' && books[k][kk] === title) {
        return res.status(200).json({ book: books[k] });
      }
    }
  }
  return res.status(404).json({ message: "No books found." });
});

//  Get book review
public_users.get('/review/:isbn/', function (req, res) {
  const isbn = req.params.isbn;
  const reviewID = req.query.reviewID;

  for (let k of Object.keys(books)) {
    for (let kk of Object.keys(books[k])) {
      if (kk === 'isbn' && books[k][kk] === isbn) {

        if (reviewID === undefined) {
          return res.status(200).json({ reviews: books[k]["reviews"] });
        }
        else {
          return res.status(200).json({ review: books[k]["reviews"][reviewID] });
        }
      }
    }
  }
  return res.status(404).json({ message: "No reviews found." });
});

//  Edit book review
public_users.put('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const reviewID = req.query.reviewID;
  const newReviewText = req.body.newReviewText;

  for (let k of Object.keys(books)) {
    for (let kk of Object.keys(books[k])) {
      if (kk === 'isbn' && books[k][kk] === isbn) {

        const oldReviewText = books[k]["reviews"][reviewID];
        books[k]["reviews"][reviewID] = newReviewText;

        if (newReviewText.length > 0) {
          return res.status(201).json({
            message: "Review edited!",
            oldReviewText: oldReviewText,
            newReviewText: newReviewText,
            reviews: books[k]["reviews"],
          });
        }

      }
    }
  }
  return res.status(500);
});

//  Delete book review
public_users.delete('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const reviewID = req.query.reviewID;

  for (let k of Object.keys(books)) {
    for (let kk of Object.keys(books[k])) {
      if (kk === 'isbn' && books[k][kk] === isbn) {

        const deletedReview = books[k]["reviews"][reviewID];
        books[k]["reviews"].splice(reviewID, 1);
        return res.status(200).json({
          message: "Review deleted!",
          deletedReview: deletedReview,
          reviews: books[k]["reviews"],
        });

      }
    }
  }
  return res.status(500);
});

module.exports.general = public_users;
