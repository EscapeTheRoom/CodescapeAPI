'use strict';

const express = require('express');
const app = express();

// Constants
const PORT = process.env.PORT || 8080;

// App
app.get('/', (req, res) => {
  res.send('Hello world\n');
});

app.listen(PORT, err => {
  if (err) {
    console.error('Internal server error', err)
  }
  console.log(`Server running on PORT ${PORT}`);
});