// backend/controllers/bookController.js

const Book = require('../models/Book');
const Review = require('../models/Review');
const mongoose = require('mongoose');

// @desc    Get all books with pagination
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5; // 5 books per page
  const skip = (page - 1) * limit;

  try {
    const books = await Book.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const totalBooks = await Book.countDocuments();
    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single book by ID with reviews
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('addedBy', 'name');

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const reviews = await Review.find({ bookId: req.params.id }).populate('userId', 'name');

        // Calculate average rating
        let averageRating = 0;
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
            averageRating = totalRating / reviews.length;
        }

        res.json({ book, reviews, averageRating: averageRating.toFixed(1) });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
const addBook = async (req, res) => {
  const { title, author, description, genre, publishedYear } = req.body;
  try {
    const book = new Book({
      title,
      author,
      description,
      genre,
      publishedYear,
      addedBy: req.user.id,
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(400).json({ message: 'Invalid book data' });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the user is the one who added the book
    if (book.addedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const { title, author, description, genre, publishedYear } = req.body;
    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.genre = genre || book.genre;
    book.publishedYear = publishedYear || book.publishedYear;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.addedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Review.deleteMany({ bookId: req.params.id }); // Also delete associated reviews
    await book.deleteOne();

    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getBooks, getBookById, addBook, updateBook, deleteBook };