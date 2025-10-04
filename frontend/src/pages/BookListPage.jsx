import React, { useState, useEffect } from 'react';
import API from '../services/api';
import BookCard from '../components/BookCard';
import { Row, Col, Pagination } from 'react-bootstrap';

const BookListPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/books?page=${currentPage}`);
        setBooks(data.books);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
      setLoading(false);
    };
    fetchBooks();
  }, [currentPage]);

  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
        {number}
      </Pagination.Item>,
    );
  }

  if (loading) return <p className="text-center text-light">Loading books...</p>;

  return (
    <>
      <h1 className="text-light mb-4">All Books</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {books.map((book) => (
          <Col key={book._id}>
            <BookCard book={book} />
          </Col>
        ))}
      </Row>
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>{items}</Pagination>
        </div>
      )}
    </>
  );
};

export default BookListPage;