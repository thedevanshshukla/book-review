import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

const BookCard = ({ book }) => {
  return (
    <Card bg="secondary" text="light" className="h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Title>{book.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">by {book.author}</Card.Subtitle>
        <Card.Text className="text-light-emphasis">
          Genre: {book.genre}
        </Card.Text>
        <Button as={Link} to={`/books/${book._id}`} variant="primary" className="mt-auto">View Details</Button>
      </Card.Body>
    </Card>
  );
};

export default BookCard;