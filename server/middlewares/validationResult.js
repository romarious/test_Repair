const {validationResult} = require('express-validator')

const validateResult = (req, res, msg) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: msg
        })
      }

}

module.exports = validateResult