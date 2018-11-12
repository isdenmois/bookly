const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use('/login', require('./login'));
app.use('/users/:user/books/:type', require('./userBooks'));
app.use('/challenges/:year/readers/:user', require('./challenges'));
app.use('/me/books', require('./myBook'));
app.use('/books', require('./books'));

app.listen(3000, () => console.log('listen on *:3000'));
