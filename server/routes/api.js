const express = require('express')
const router = express.Router()

router.get('/ip', (req, res) => {
  res.json(req.ip)
})

module.exports = router 