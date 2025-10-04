import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

const BookFormPage = () => {
    const { id } = useParams(); // For editing
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        genre: '',
        publishedYear: '',
    });

    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode) {
            const fetchBook = async () => {
                try {
                    const { data } = await API.get(`/books/${id}`);
                    if (data.book.addedBy._id !== user._id) {
                        alert("You are not authorized to edit this book.");
                        navigate('/');
                        return;
                    }
                    setFormData({
                        title: data.book.title,
                        author: data.book.author,
                        description: data.book.description,
                        genre: data.book.genre,
                        publishedYear: data.book.publishedYear,
                    });
                } catch (error) {
                    console.error('Failed to fetch book for editing:', error);
                    navigate('/');
                }
            };
            fetchBook();
        }
    }, [id, isEditMode, navigate, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await API.put(`/books/${id}`, formData);
            } else {
                await API.post('/books', formData);
            }
            navigate('/');
        } catch (error) {
            console.error('Failed to save book:', error);
            alert('An error occurred while saving the book.');
        }
    };

    return (
        <Row className="justify-content-md-center">
            <Col md={8}>
                <Card bg="secondary" text="light">
                    <Card.Body>
                        <h2 className="text-center mb-4">{isEditMode ? 'Edit Book' : 'Add a New Book'}</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Author</Form.Label>
                                <Form.Control type="text" name="author" value={formData.author} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Genre</Form.Label>
                                <Form.Control type="text" name="genre" value={formData.genre} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Published Year</Form.Label>
                                <Form.Control type="number" name="publishedYear" value={formData.publishedYear} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={5} name="description" value={formData.description} onChange={handleChange} required />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100">
                                {isEditMode ? 'Update Book' : 'Add Book'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default BookFormPage;