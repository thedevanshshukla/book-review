// backend/controllers/reviewController.js

const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Add a review for a book
// @route   POST /api/reviews/:bookId
// @access  Private
const addReview = async (req, res) => {
    const { rating, reviewText } = req.body;
    const { bookId } = req.params;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if user has already reviewed this book
        const existingReview = await Review.findOne({ bookId, userId: req.user.id });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this book' });
        }
        if (book.addedBy.toString() === req.user.id) {
            return res.status(403).json({ message: 'You cannot review your own book' });
        }

        const review = new Review({
            bookId,
            userId: req.user.id,
            rating,
            reviewText,
        });

        const createdReview = await review.save();
        res.status(201).json(createdReview);
    } catch (error) {
        res.status(400).json({ message: 'Invalid review data' });
    }
};

// @desc    Update a user's own review
// @route   PUT /api/reviews/:reviewId
// @access  Private
const updateReview = async (req, res) => {
    const { rating, reviewText } = req.body;
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the logged-in user is the owner of the review
        if (review.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        review.rating = rating || review.rating;
        review.reviewText = reviewText || review.reviewText;

        const updatedReview = await review.save();
        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a user's own review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await review.deleteOne();
        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { addReview, updateReview, deleteReview };