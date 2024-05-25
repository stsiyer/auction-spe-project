
const jwt = require('jsonwebtoken'); // Mock jwt for testing
const { signin } = require('../../controllers/authControllers');
const User = require('../../models/User');

jest.mock('jsonwebtoken'); // Mock jwt library

describe('signin function', () => {
  // Successful Login Test
  test('should login user with valid credentials', async () => {
    const mockUser = { _id: '123', email: 'test@example.com', password: 'validPassword' };
    const mockReq = { body: { email: mockUser.email, password: mockUser.password } };
    const mockRes = { json: jest.fn() };

    User.findOne = jest.fn().mockResolvedValue(mockUser);
    jwt.sign = jest.fn().mockReturnValue('sample-token');

    await signin(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Login successful', token: 'sample-token' });
  });

  // Missing Email/Password Test
  test('should return 400 error for missing email or password', async () => {
    const mockRes = {
      status: jest.fn(),
      json: jest.fn() // Mock the json method
    };

    const mockReq = { body: { email: '' } }; // Missing password

    await signin(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400); // Expect 400 status code
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Please fill in all fields' });
  });

  // User Not Found Test
  test('should return 401 error for user not found', async () => {
    const mockReq = { body: { email: 'unknown@example.com', password: 'validPassword' } };
    const mockRes = { status: jest.fn(), json: jest.fn() };

    User.findOne = jest.fn().mockResolvedValue(null);

    await signin(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401); // Expect 401 status code
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
  });

  // // Invalid Password Test
  test('should return 401 error for invalid password', async () => {
    const mockUser = { _id: '123', email: 'test@example.com', password: 'validPassword' };
    const mockReq = { body: { email: mockUser.email, password: 'wrongPassword' } };
    const mockRes = { status: jest.fn(), json: jest.fn() };

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    await signin(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401); // Expect 401 status code
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
  });

  // // Server Error Test
  test('should return 500 error for server error', async () => {
    const mockReq = { body: { email: 'test@example.com', password: 'validPassword' } };
    const mockRes = { status: jest.fn(), json: jest.fn() };

    User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

    await signin(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500); // Expect 500 status code
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});