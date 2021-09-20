const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('../config/index')
const jwt = require('jsonwebtoken')
const {check,validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

const validateResult = require('../middlewares/validationResult')

router.post(
  '/register',
  [
    check('email', 'Invalid email').isEmail().exists(),
    check('userName', 'Minimum length of the username is 2').isLength({min: 2}).exists(),
    check('password', 'Minimum length of the password is 5')
      .isLength({ min: 5 }).exists()
  ],
  async (req, res) => {
  try {

    validateResult(req, res, 'Invalid data via registration')

    const {email, userName, password} = req.body

    const candidateMail = await User.findOne({ email })
    const candidateName = await User.findOne({ userName })

    if (candidateMail || candidateName) {
      return res.status(400).json({ message: 'This user already has been created' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({ email, userName, password: hashedPassword })

    await user.save()

    res.status(201).json({ message: 'User has created successfully =)' })

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Something goes wrong, try again' })
  }
})

router.post(
  '/login',
  [
    check('email', 'Enter a valid email').normalizeEmail().isEmail().exists(),
    check('password', 'Enter a password').exists()
  ],
  async (req, res) => {
  try {

    validateResult(req, res, 'Invalid data via login')

    const {email, password, userName} = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'User is not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Passwords are not match' })
    }

    const token = jwt.sign(
      { userId: user.id },
      config.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({ token })

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Something goes wrong, try again' })
  }
})

module.exports = router
