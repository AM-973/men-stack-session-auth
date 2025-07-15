const express = require("express")
const router = express.Router()


router.get('/', (req, res)=>{
    res.send('Do I work?')
})
module.exports = router