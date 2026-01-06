const bcrypt = require('bcrypt');


//Encrypt Password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};


//Compare Password 
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};
