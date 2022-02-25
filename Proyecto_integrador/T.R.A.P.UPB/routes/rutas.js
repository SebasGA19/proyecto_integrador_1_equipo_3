const express = require('express');
const router = express.Router();
const path = require('path');

const pool = require('../db/database');

router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../home/index.html'));
})

module.exports=router