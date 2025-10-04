import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Card, Button, ListGroup, Form, Alert, Row, Col } from 'react-bootstrap';

const BookDetailsPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');
    const [editingReview, setEditingReview] = useState(null);


    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchBookDetails = useCallback(async () => {
        try {
            const { data } = await API.get(`/books/${id}`);
            setBook(data.book);
            setReviews(data.reviews);
            setAverageRating(data.averageRating);
        } catch (error) {
            console.error('Failed to fetch book details:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchBookDetails();
    }, [fetchBookDetails]);

   const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating.');
            return;
        }

        try {
            if (editingReview) {
            // Update existing review
            await API.put(`/reviews/${editingReview._id}`, { rating, reviewText });
            setEditingReview(null);
            } else {
            // Add new review
            await API.post(`/reviews/${id}`, { rating, reviewText });
            }

            setRating(0);
            setReviewText('');
            setError('');
            fetchBookDetails();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        }
        };


    const handleDeleteBook = async () => {
        if (window.confirm('Are you sure you want to delete this book? This cannot be undone.')) {
            try {
                await API.delete(`/books/${id}`);
                navigate('/');
            } catch (error) {
                alert('Failed to delete book.');
            }
        }
    };
    const handleEditReview = (review) => {
        setEditingReview(review);
        setRating(review.rating);
        setReviewText(review.reviewText);
    };


    if (loading) return <p className="text-center text-light">Loading...</p>;
    if (!book) return <p className="text-center text-light mt-10">Book not found.</p>;

    return (
        <>
            <Card bg="secondary" text="light" className="mb-4">
                <Card.Body>
                    <Card.Title as="h1">{book.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        by {book.author} ({book.publishedYear})
                    </Card.Subtitle>
                    <Card.Text>{book.description}</Card.Text>
                    <hr />
                    <div className="d-flex align-items-center mb-3">
                        <h4 className="mb-0 me-3">Average Rating:</h4>
                        <span className="fs-4 text-warning">★ {averageRating}</span>
                        <span className="ms-2 text-muted">({reviews.length} reviews)</span>
                    </div>
                    {user && user._id === book.addedBy._id && (
                        <div>
                            <Button as={Link} to={`/edit-book/${id}`} variant="warning" className="me-2">Edit Book</Button>
                            <Button onClick={handleDeleteBook} variant="danger">Delete Book</Button>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Row>
                <Col md={6}>
                    <h3 className="text-light">Reviews</h3>
                    <ListGroup>
                    {reviews.length > 0 ? reviews.map(review => (
                    <ListGroup.Item key={review._id} variant="dark">
                    <strong>{review.userId.name}</strong>
                    <span className="text-warning ms-2">★ {review.rating}</span>
                    <p className="mb-0">{review.reviewText}</p>

                    {/* Show Edit button only if this review belongs to the logged-in user */}
                    {user && review.userId._id === user._id && (
                        <Button
                        variant="outline-warning"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleEditReview(review)}
                        >
                        Edit
                        </Button>
                    )}
                    </ListGroup.Item>
                        )) : (
                        <p className="text-light">No reviews yet. Be the first to leave one!</p>
                    )}
                    </ListGroup>

                </Col>
                {user && user._id !== book.addedBy._id && (
                    <Col md={6}>
                        <h3 className="text-light">
                            {editingReview ? 'Edit Your Review' : 'Leave a Review'}
                        </h3>
                        <Card bg="secondary" text="light">
                            <Card.Body>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleReviewSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Your Rating</Form.Label>
                                        <Form.Select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                            <option value="0" disabled>Select a rating</option>
                                            <option value="1">1 - Poor</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="3">3 - Good</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="5">5 - Excellent</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Your Review</Form.Label>
                                        <Form.Control as="textarea" rows={3} value={reviewText} onChange={(e) => setReviewText(e.target.value)} required />
                                    </Form.Group>
                                    <Button type="submit" variant="primary">
                                        {editingReview ? 'Update Review' : 'Submit Review'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </>
    );
};

export default BookDetailsPage;