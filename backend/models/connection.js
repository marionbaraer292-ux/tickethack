const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://admin2:0JDNM90U99UCE7EM@cluster0.xqxkwei.mongodb.net/tickethack';

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
 .then(() => console.log('Database connected'))

  .catch(error => console.error(error));