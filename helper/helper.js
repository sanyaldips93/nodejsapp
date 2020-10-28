// Import
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// Model
const UserModel = require('../models/User');
const TokenModel = require('../models/Token');

// Mail Transporter
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        process.env.SENDGRID_API_KEY
    }
  })
);


exports.hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac(process.env.HASH_ALGO, salt).update(password).digest("base64");
    return salt+'$'+hash;
}

exports.createUser = async (req, res) => {
    const user = new UserModel(req.body);
    try {
      const savedUser = await user.save();
      // Create a verification token for this user
      const token = new TokenModel({ _userId: savedUser._id, token: crypto.randomBytes(16).toString('hex') });
      // Save the verification token
      token.save((err) => {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          // Send the email
          sendMail(req, savedUser, token.token, res);
      });
    } catch(err) {
      res.status(500).json({ message: 'Server Error..' });
      console.log(err);
    }
}

exports.comparePassword = (user, password) => {
    const userPwdFields = user.password.split('$');
    const salt = userPwdFields[0];
    const hash = crypto.createHmac(process.env.HASH_ALGO, salt).update(password).digest("base64");
    if (hash === userPwdFields[1]) return true;
    else return false;
}

function sendMail(req, user, token, res) {
  // Send the email
  const mailOptions = {
    from: ' sanyaldips@gmail.com',
    to: user.email,
    subject: 'Account Verification Token',
    text: `Hello,\n\n` + `Please verify your account by clicking the link: \nhttps://` + req.headers.host + `/confirmation/` + token + `\n`
  };
  transporter.sendMail(mailOptions, (err) => {
      if (err) { return res.status(500).json({ msg: err.message }); }
      res.status(200).json('A verification email has been sent to ' + user.email + '.');
  });
}
