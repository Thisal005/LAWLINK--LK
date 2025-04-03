import jwt from 'jsonwebtoken';

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '2d'
  });
  res.cookie('jwt', token, {
    maxAge: 2 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'none', 
    path: '/'
  });
};

export default generateToken;