import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/login', formData);
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
                    <h2 className="text-center mb-4">Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" required onChange={handleChange} />
                        </Form.Group>
                        <Button type="submit" className="w-100">Login</Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        Need an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    </Row>
  );
};

export default LoginPage;