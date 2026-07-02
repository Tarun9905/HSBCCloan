const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3500;

mongoose.connect('mongodb+srv://hsbcdemo7_db_user:mP8de7LHv3kWF9Q8@cluster0.i4jytln.mongodb.net/?appName=Cluster0')
  .then(() => console.log('mongoose connected successfully'))
  .catch((err) => console.log(err))

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello World');
});