const express = require('express')
const router = express.Router()
const Shop = require('../models/Shop')
const Item = require('../models/Item')
const colors = require('colors');
const compare = require('../helper/sort')
const translate = require('../helper/translate');
const multer = require('multer');
const {ensureAuth, ensureGuest} = require('../middleware/auth')


//writing middleware
const multerMiddle = function(itemImage){
    if(itemImage == undefined){
        return next();
    }
    else{
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, 'public/item_images')
            },
            filename: function (req, file, cb) {
                const fname=file.originalname.replace(' ','_').split('.')[0];
              const ext=file.originalname.split('.')[file.originalname.split('.').length-1]
              cb(null, fname  + '-' + Date.now()+'.'+ext)
            }
          })
          
        const uploadOptions = multer({ storage: storage })

        return uploadOptions.single(itemImage);
    }
}


// @desc : welcome page
// @route : GET /item/add
router.get('/:id/add',ensureAuth,async (req,res) => {
    res.render('add-item',{
        'shopid' : req.params.id
    });
})

router.post('/:id/add/ok',multerMiddle('itemImage'),async (req,res) => {
    req.body.itemShop = req.params.id;
    if(req.body.translate == 'YES'){
        const itemNameTamil = await translate(req.body.itemNameEnglish);
        return res.render('item-translate',{
            'values' : req.body,
            'itemNameTamil' : itemNameTamil,
            'shopid' : req.params.id,
        });
    }
    const fileName=req.file.filename;
    const basePath = `/item_images/` + fileName;
    req.body.itemImage=basePath;
    console.log(`${req.body.itemImage}`.blue.bold);
    const new_item = {
        itemNameEnglish : req.body.itemNameEnglish,
        itemNameTamil : req.body.itemNameTamil,
        itemPrice : req.body.itemPrice,
        itemQuantity : req.body.itemQuantity,
        itemShop : req.body.itemShop,
        itemImage : req.body.itemImage,
    }
    await Item.create(new_item);
    console.log("Items added to mongo..".yellow.bold);
    res.redirect('/shop/explore/'+req.params.id);
})

router.get('/:id/edit',ensureAuth,async (req,res)=>{
    const item = await Item.findById(req.params.id).lean();
    res.render('edit-item',{
        'item' : item,
    })
})

router.post('/:id/edit/ok',ensureAuth,async (req,res) => {
    const item = await Item.findById(req.params.id).lean();
    console.log(req.body);
    console.log(item);
    var new_item = req.body;
    new_item.itemImage = item.itemImage;
    console.log(new_item);
    await Item.findOneAndUpdate({_id : req.params.id },new_item,{
        new:true,
        runValidators:true
    });
    res.redirect(`/shop/explore/${item.itemShop}`)
})

router.post('/:id/delete',ensureAuth,async(req,res)=> {
    const item = await Item.findById(req.params.id).lean();
    const shop = item.itemShop;
    await Item.remove({_id: req.params.id});
    res.redirect(`/shop/explore/${shop}`);
})

module.exports = router