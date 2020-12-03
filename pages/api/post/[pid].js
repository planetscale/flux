export default (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ title: 'This is a post', content: 'lorem ipsum' });
};
