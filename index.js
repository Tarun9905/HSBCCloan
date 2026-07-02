const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const RegisterModel = require('./Models/RegisterModel');

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

//Register API
app.post('/userRegister', async (req, res) => {
  try {
    const { userName, accountType, password, accountNo } = req.body;

    // 1. Validate
    if (!userName || !accountType || !password || !accountNo) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2. Check duplicate userName
    const existingUserName = await RegisterModel.findOne({ userName });
    if (existingUserName) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // 3. Check duplicate account number
    const existingAccount = await RegisterModel.findOne({ accountNo });
    if (existingAccount) {
      return res.status(409).json({ message: 'Account number already exists' });
    }

    // 4. Create user
    const newUser = new RegisterModel({
      userName,
      accountType,
      password, // later hash with bcrypt
      accountNo
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        userName,
        accountType,
        accountNo
      }
    });

  } catch (error) {
    console.error(error);

    // Handle duplicate key error from MongoDB also
    if (error.code === 11000) {
      if (error.keyPattern.userName) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      if (error.keyPattern.accountNo) {
        return res.status(409).json({ message: 'Account number already exists' });
      }
    }

    res.status(500).json({ message: 'Server error' });
  }
});

//Login API
app.post('/userLogin', async (req, res) => {
  try {
    const { userName } = req.body;

    if (!userName) {
      return res.status(400).json({ message: 'userName is required' });
    }

    const user = await RegisterModel.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      userName: user.userName,
      login: false
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Get login details with userId
app.get('/getRegisterDetails/:userName', async (req, res) => {
  try {
    const { userName } = req.params;

    const user = await RegisterModel.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      userName: user.userName,
      accountType: user.accountType,
      accountNo: user.accountNo
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World');
});