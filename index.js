// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const RegisterModel = require('./Models/RegisterModel');
// const BeneficiaryModel = require('./Models/BeneficiaryModel');
// const AmountDepositModel = require('./Models/AmountDeposit');
// const TransactionModel = require('./Models/TransactionModel');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 3500;

// mongoose.connect('mongodb+srv://hsbcdemo7_db_user:mP8de7LHv3kWF9Q8@cluster0.i4jytln.mongodb.net/?appName=Cluster0')
//   .then(() => console.log('mongoose connected successfully'))
//   .catch((err) => console.log(err))

// app.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });

// //Register API
// app.post('/userRegister', async (req, res) => {
//   try {
//     const { userName, accountType, password, accountNo, ifsc } = req.body;

//     // 1. Validate
//     if (!userName || !accountType || !password || !accountNo || !ifsc) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // 2. Check duplicate userName
//     const existingUserName = await RegisterModel.findOne({ userName });
//     if (existingUserName) {
//       return res.status(409).json({ message: 'Username already exists' });
//     }

//     // 3. Check duplicate account number
//     const existingAccount = await RegisterModel.findOne({ accountNo });
//     if (existingAccount) {
//       return res.status(409).json({ message: 'Account number already exists' });
//     }

//     // 4. Find pending transactions for this account number
//     const pendingTransactions = await TransactionModel.find({
//       toAccountNumber: accountNo,
//       status: 'pending'
//     });

//     // 5. Calculate pending total amount
//     const pendingAmount = pendingTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);

//     // 6. Create user with pending amount added to balance
//     const newUser = new RegisterModel({
//       userName,
//       accountType,
//       password, // later hash with bcrypt
//       accountNo,
//       ifsc,
//       amount: pendingAmount
//     });

//     await newUser.save();

//     // 7. Mark pending transactions as completed
//     if (pendingTransactions.length > 0) {
//       await TransactionModel.updateMany(
//         { toAccountNumber: accountNo, status: 'pending' },
//         { $set: { status: 'completed' } }
//       );
//     }

//     return res.status(201).json({
//       message:
//         pendingTransactions.length > 0
//           ? 'User registered successfully and pending transactions were credited'
//           : 'User registered successfully',
//       user: {
//         userName: newUser.userName,
//         accountType: newUser.accountType,
//         accountNo: newUser.accountNo,
//         ifsc: newUser.ifsc,
//         amount: newUser.amount
//       },
//       completedPendingTransactions: pendingTransactions.length
//     });

//   } catch (error) {
//     console.error(error);

//     if (error.code === 11000) {
//       if (error.keyPattern?.userName) {
//         return res.status(409).json({ message: 'Username already exists' });
//       }
//       if (error.keyPattern?.accountNo) {
//         return res.status(409).json({ message: 'Account number already exists' });
//       }
//     }

//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// //Login API
// app.post('/userLogin', async (req, res) => {
//   try {
//     const { userName } = req.body;

//     if (!userName) {
//       return res.status(400).json({ message: 'userName is required' });
//     }

//     const user = await RegisterModel.findOne({ userName });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // move current logonDate to lastLoginDate
//     user.lastLoginDate = user.logonDate;

//     // set new login time as current logonDate
//     user.logonDate = new Date();

//     await user.save();

//     return res.status(200).json({
//       userName: user.userName,
//       login: false,
//       logonDate: user.logonDate,
//       lastLoginDate: user.lastLoginDate
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// //Get login details with userId
// app.get('/getRegisterDetails/:userName', async (req, res) => {
//   try {
//     const { userName } = req.params;

//     const user = await RegisterModel.findOne({ userName }).select('-password');

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json(user);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Add beneficiary API
// app.post('/addBeneficiary', async (req, res) => {
//   try {
//     const {
//       beneficiaryName,
//       accountUserName,
//       beneficiaryNickName,
//       beneficiaryType,
//       accountNumber,
//       ifsc
//     } = req.body;

//     // Required field validation
//     if (!beneficiaryName || !accountUserName || !beneficiaryType || !accountNumber || !ifsc) {
//       return res.status(400).json({
//         message: 'beneficiaryName, accountUserName, beneficiaryType, accountNumber and ifsc are required'
//       });
//     }


//     // Create beneficiary
//     const newBeneficiary = new BeneficiaryModel({
//       beneficiaryName,
//       accountUserName,
//       beneficiaryNickName,
//       beneficiaryType,
//       accountNumber,
//       ifsc
//     });

//     await newBeneficiary.save();

//     return res.status(201).json({
//       exists: false,
//       message: 'Beneficiary added successfully',
//       beneficiary: {
//         beneficiaryName: newBeneficiary.beneficiaryName,
//         accountUserName: newBeneficiary.accountUserName,
//         beneficiaryNickName: newBeneficiary.beneficiaryNickName,
//         beneficiaryType: newBeneficiary.beneficiaryType,
//         accountNumber: newBeneficiary.accountNumber,
//         ifsc: newBeneficiary.ifsc
//       }
//     });

//   } catch (error) {
//     console.error(error);

//     // Mongo duplicate key error fallback
//     if (error.code === 11000) {
//       return res.status(409).json({
//         exists: true,
//         message: 'Account number already exists'
//       });
//     }

//     return res.status(500).json({
//       message: 'Server error'
//     });
//   }
// });

// // Get beneficiary details by account UserName
// app.get('/getBeneficiaries/:accountUserName', async (req, res) => {
//   try {
//     const { accountUserName } = req.params;

//     const beneficiaries = await BeneficiaryModel.find({ accountUserName });

//     if (beneficiaries.length === 0) {
//       return res.status(404).json({
//         message: 'No beneficiaries found for this user'
//       });
//     }

//     return res.status(200).json({
//       count: beneficiaries.length,
//       beneficiaries
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: 'Server error'
//     });
//   }
// });

// // Deposit Amount API
// app.post('/depositAmount', async (req, res) => {
//   try {
//     const { accountUserName, accountNumber, amount } = req.body;

//     if (!accountUserName || !accountNumber || amount == null) {
//       return res.status(400).json({
//         message: 'accountUserName, accountNumber and amount are required'
//       });
//     }

//     const depositAmount = Number(amount);

//     if (isNaN(depositAmount) || depositAmount <= 0) {
//       return res.status(400).json({
//         message: 'Amount must be greater than 0'
//       });
//     }

//     // Find account in RegisterModel
//     const user = await RegisterModel.findOne({
//       userName: accountUserName,
//       accountNo: accountNumber
//     });

//     if (!user) {
//       return res.status(404).json({
//         message: 'Account not found'
//       });
//     }

//     // Update balance
//     user.amount += depositAmount;
//     await user.save();

//     return res.status(200).json({
//       message: 'Amount deposited successfully',
//       userName: user.userName,
//       accountNo: user.accountNo,
//       updatedBalance: user.amount
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: 'Server error'
//     });
//   }
// });

// // get deposit details by account Number
// app.get('/getDeposits/:accountNumber', async (req, res) => {
//   try {
//     const { accountNumber } = req.params;

//     const deposits = await AmountDepositModel.find({ accountNumber }).sort({ date: -1 });

//     return res.status(200).json({
//       count: deposits.length,
//       deposits
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: 'Server error'
//     });
//   }
// });

// // transaction API
// app.post('/createTransaction', async (req, res) => {
//   try {
//     const {
//       fromAccountUserName,
//       fromAccountNumber,
//       toAccountUserName,
//       toAccountNumber,
//       amount,
//       transferType,
//       rtgsTransferType,
//       referance,
//       recurring
//     } = req.body;

//     if (
//       !fromAccountUserName ||
//       !fromAccountNumber ||
//       !toAccountNumber ||
//       amount == null ||
//       !transferType
//     ) {
//       return res.status(400).json({
//         message: 'fromAccountUserName, fromAccountNumber, toAccountNumber, amount and transferType are required'
//       });
//     }

//     const transferAmount = Number(amount);

//     if (isNaN(transferAmount) || transferAmount <= 0) {
//       return res.status(400).json({
//         message: 'Amount must be greater than 0'
//       });
//     }

//     // Find sender
//     const fromUser = await RegisterModel.findOne({
//       userName: fromAccountUserName,
//       accountNo: fromAccountNumber
//     });

//     if (!fromUser) {
//       return res.status(404).json({
//         message: 'From account not found'
//       });
//     }

//     // Check sender balance
//     if (fromUser.amount < transferAmount) {
//       return res.status(400).json({
//         message: 'Insufficient balance'
//       });
//     }

//     // Find receiver ONLY by account number
//     const toUser = await RegisterModel.findOne({
//       accountNo: toAccountNumber
//     });

//     let transactionStatus = 'pending';

//     // Deduct from sender
//     fromUser.amount -= transferAmount;
//     await fromUser.save();

//     // If receiver exists, credit receiver and mark completed
//     if (toUser) {
//       toUser.amount += transferAmount;
//       await toUser.save();
//       transactionStatus = 'completed';
//     }

//     // Save transaction
//     const newTransaction = new TransactionModel({
//       fromAccountUserName,
//       fromAccountNumber,
//       toAccountUserName,
//       toAccountNumber,
//       amount: transferAmount,
//       transferType,
//       rtgsTransferType,
//       referance,
//       recurring,
//       date: new Date(),
//       status: transactionStatus
//     });

//     await newTransaction.save();

//     return res.status(201).json({
//       message:
//         transactionStatus === 'completed'
//           ? 'Transaction completed successfully'
//           : 'Transaction created successfully, receiver not found so marked as pending',
//       transaction: newTransaction,
//       fromAccountUpdatedBalance: fromUser.amount,
//       toAccountUpdatedBalance: toUser ? toUser.amount : null
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: 'Server error'
//     });
//   }
// });

// //according to account number get transaction details
// app.get('/getTransactions/:accountNumber', async (req, res) => {
//   try {
//     const { accountNumber } = req.params;

//     const transactions = await TransactionModel.find({
//       $or: [
//         { fromAccountNumber: accountNumber },
//         { toAccountNumber: accountNumber }
//       ]
//     }).sort({ date: -1 });

//     if (!transactions.length) {
//       return res.status(404).json({
//         message: 'No transactions found for this account number'
//       });
//     }

//     return res.status(200).json(transactions);

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: 'Server error'
//     });
//   }
// });

// app.get('/', (req, res) => {
//   res.send('Hello World');
// });


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const RegisterModel = require('./Models/RegisterModel');
const TransactionModel = require('./Models/TransactionModel')
const BeneficiaryModel = require('./Models/BeneficiaryModel')


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

// register API
app.post('/userRegister', async (req, res) => {
  try {
    const { userName, accountType, password, accountNo, ifsc } = req.body;

    // 1. Validate required fields
    if (!userName || !accountType || !password || !accountNo || !ifsc) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // 2. Check if username already exists
    const existingUser = await RegisterModel.findOne({
      $or: [{ userName }, { accountNo }]
    });

    if (existingUser) {
      if (existingUser.userName === userName) {
        return res.status(409).json({
          success: false,
          message: 'Username already exists',
        });
      }

      if (existingUser.accountNo === accountNo) {
        return res.status(409).json({
          success: false,
          message: 'Account number already exists',
        });
      }
    }

    // 3. Create new user
    const newUser = new RegisterModel({
      userName,
      accountType,
      password,
      accountNo,
      ifsc,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: savedUser,
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Duplicate key error fallback
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Username or account number already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// Login
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

    // move current logonDate to lastLoginDate
    user.lastLoginDate = user.logonDate;

    // set new login time as current logonDate
    user.logonDate = new Date();

    await user.save();

    return res.status(200).json({
      userName: user.userName,
      login: false,
      logonDate: user.logonDate,
      lastLoginDate: user.lastLoginDate
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

    const user = await RegisterModel.findOne({ userName }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Transaction
app.post('/createTransaction', async (req, res) => {
  try {
    const {
      fromAccountUserName,
      fromAccountNumber,
      toAccountUserName,
      toAccountNumber,
      amount,
      transferType,
      rtgsTransferType,
      referance,
      recurring,
      date
    } = req.body;

    // 1. Validate required fields
    if (
      !fromAccountUserName ||
      !fromAccountNumber ||
      !toAccountUserName ||
      !toAccountNumber ||
      !amount
    ) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing',
      });
    }

    // 2. Prevent same account transfer (optional)
    if (fromAccountNumber === toAccountNumber) {
      return res.status(400).json({
        success: false,
        message: 'Sender and receiver account numbers cannot be the same',
      });
    }

    // 3. Create transaction
    const newTransaction = new TransactionModel({
      fromAccountUserName,
      fromAccountNumber,
      toAccountUserName,
      toAccountNumber,
      amount,
      transferType,
      rtgsTransferType,
      referance,
      recurring,
      date: date || new Date()
    });

    const savedTransaction = await newTransaction.save();

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: savedTransaction
    });

  } catch (error) {
    console.error('Transaction creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get Transactions
app.get('/getTransactions/:accountNumber', async (req, res) => {
  try {
    const { accountNumber } = req.params;

    if (!accountNumber) {
      return res.status(400).json({
        success: false,
        message: 'Account number is required'
      });
    }

    const transactions = await TransactionModel.find({
      $or: [
        { fromAccountNumber: accountNumber },
        { toAccountNumber: accountNumber }
      ]
    })

    // if no transactions found
    if (transactions.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No transactions found',
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transactions fetched successfully',
      count: transactions.length,
      data: transactions
    });

  } catch (error) {
    console.error('Fetch transactions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Add Beneficicary
app.post('/addBeneficiary', async (req, res) => {
  try {
    const {
      beneficiaryName,
      ownerUserName,
      ownerAccountNumber,
      beneficiaryNickName,
      beneficiaryType,
      beneficiaryAccountNumber,
      ifsc
    } = req.body;

    // 1. Required fields check
    if (
      !beneficiaryName ||
      !ownerUserName ||
      !ownerAccountNumber ||
      !beneficiaryType ||
      !beneficiaryAccountNumber ||
      !ifsc
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required fields are required'
      });
    }

    // 2. Check owner account exists in RegisterModel
    const ownerAccountExists = await RegisterModel.findOne({
      accountNo: ownerAccountNumber
    });

    if (!ownerAccountExists) {
      return res.status(404).json({
        success: false,
        message: 'Owner account number not found in Register'
      });
    }

    // 3. Check beneficiary account exists in RegisterModel
    const beneficiaryAccountExists = await RegisterModel.findOne({
      accountNo: beneficiaryAccountNumber
    });

    if (!beneficiaryAccountExists) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary account number not found in Register'
      });
    }

    // 4. Save beneficiary only if both accounts exist
    const newBeneficiary = new BeneficiaryModel({
      beneficiaryName,
      ownerUserName,
      ownerAccountNumber,
      beneficiaryNickName,
      beneficiaryType,
      beneficiaryAccountNumber,
      ifsc
    });

    const savedBeneficiary = await newBeneficiary.save();

    return res.status(201).json({
      success: true,
      message: 'Beneficiary added successfully',
      data: savedBeneficiary
    });

  } catch (error) {
    console.error('Add beneficiary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get Beneficicary
app.get('/getBeneficiaries/:accountNumber', async (req, res) => {
  try {
    const { accountNumber } = req.params;

    if (!accountNumber) {
      return res.status(400).json({
        success: false,
        message: 'Account number is required'
      });
    }

    const beneficiaries = await BeneficiaryModel.find({
      ownerAccountNumber: accountNumber
    });

    if (beneficiaries.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No beneficiaries found',
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Beneficiaries fetched successfully',
      count: beneficiaries.length,
      data: beneficiaries
    });

  } catch (error) {
    console.error('Fetch beneficiaries error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});


// Delete Beneficicary
app.delete('/deleteBeneficiary/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // check id present
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Beneficiary id is required'
      });
    }

    // find and delete
    const deletedBeneficiary = await BeneficiaryModel.findByIdAndDelete(id);

    // if not found
    if (!deletedBeneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Beneficiary deleted successfully',
      data: deletedBeneficiary
    });

  } catch (error) {
    console.error('Delete beneficiary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});