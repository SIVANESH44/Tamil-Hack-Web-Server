const express = require('express')
const router = express.Router()
const Shop = require('../models/Shop')
const {ensureAuth, ensureGuest} = require('../middleware/auth')

// @desc : landing page
// @route : GET /
router.get('/',ensureGuest,(req,res) => {
    res.render('intro',{
        layout : "intro"
    })
})

router.get('/login',ensureGuest,(req,res) => {
    res.render('landing',{
        layout:"login",
    });
})

// @desc : home page
// @route : GET /home
router.get('/home',ensureAuth,(req,res) => {
    console.log(req.user.emailId);
    res.render('home',{
        'user' : req.user.tamilName,
    });
})

router.get('/customer',ensureAuth,(req,res) => {
    res.render('qr-scan',{
    })
})

router.get('/:id/qr',ensureAuth,(req,res)=>{
    res.render('qr-gen',{
        layout:'main2',
        'id' : req.params.id,
    })
})

router.get("/about",ensureAuth,async (req,res) => {
    res.render('about_us',{
        layout:'main2',

    });
})

module.exports = router