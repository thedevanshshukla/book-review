import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/register', formData);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Row className="justify-content-md-center">
        <Col md={6}>
            <Card bg="secondary" text="light">
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" id="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" required onChange={handleChange} />
                        </Form.Group>
                        <Button type="submit" className="w-100">Sign Up</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Col>
    </Row>
  );
};

export default SignupPage;