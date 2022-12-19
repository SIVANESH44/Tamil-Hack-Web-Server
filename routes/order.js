const express = require('express')
const router = express.Router()
const Shop = require('../models/Shop')
const Item = require('../models/Item')
const Cart = require('../models/cart')
const Order  = require('../models/Order')
const colors = require('colors');
const nodemailer = require('nodemailer');
const compare = require('../helper/sort')
const translate = require('../helper/translate');
const {ensureAuth, ensureGuest} = require('../middleware/auth')

// @desc : Creds for shopq.services mail app
let mailTransporter = nodemailer.createTransport({
    service : "gmail",
    auth:{
        user:"poompugaar.services@gmail.com",
        pass:"aqvvvsyqxqebaxce",
    }
})

// @desc : structure of the mail
let details ={
    from:"poompugaar.services@gmail.com",
    subject:"பூம்புகார் ஆர்டர் - Regarding",
}

router.post('/:id/ok',ensureAuth,async (req,res) => {
    var itemsOrdered = []
    var total = 0.0;
    for(var itemId in req.body){
        const cur_item = await Item.findById(itemId).lean();
        total += cur_item.itemPrice * req.body[itemId];
        var new_item = cur_item;
        new_item.itemQuantity = new_item.itemQuantity - req.body[itemId];
        console.log(new_item);
        await Item.findOneAndUpdate({_id : itemId },new_item,{
            new:true,
            runValidators:true
        });
        itemsOrdered.push({
            'item' : itemId,
            'itemQuantity' : req.body[itemId]
        })
    }
    new_cart = {
        'user' : req.user,
        'shop' : req.params.id,
        'itemsOrdered' : itemsOrdered
    }
    console.log(new_cart);
        await Cart.create(new_cart,async (err,cart) => {
            console.log(cart._id);

            new_order = {
                'cartId' : cart._id,
                'totalAmount' : total
            }
            await Order.create(new_order,async (err,order) => {
                const curr_cart = await Cart.findById(cart._id).populate('itemsOrdered.item').populate('shop').populate('user').lean();
                // for(var i=0;i<curr_cart.itemsOrdered.length;i++){
                //     console.log(curr_cart[itemsOrdered][i]);
                // }
                curr_cart.date = curr_cart.createdAt.toLocaleDateString("en-US");
                curr_cart.time = curr_cart.createdAt.toLocaleTimeString("en-US");
                for(var i=0;i<curr_cart.itemsOrdered.length;i++){
                    console.log(curr_cart.itemsOrdered[i]);
                    curr_cart.itemsOrdered[i].itemTotal = curr_cart.itemsOrdered[i].itemQuantity * curr_cart.itemsOrdered[i].item.itemPrice;
                }
                console.log(`${curr_cart}`.yellow.bold);
                return res.render('order-info-2',{
                    'cart' : curr_cart,
                    'total' : total,
                    layout : 'intro'
                })
            });

        });

})

router.get('/:id/deliver',ensureAuth,async (req,res) => {
    const order1 = await Cart.findById(req.params.id).lean();
    var new_order = order1;
    new_order.delivered = true
    console.log(new_order);
    await Cart.findOneAndUpdate({_id : req.params.id },new_order,{
        new:true,
        runValidators:true
    });
    const order = await Cart.findById(req.params.id).populate("shop").lean();
    const order2 = await Cart.findById(req.params.id).populate("user").lean();
    var mailContent = `உங்களது ஆர்டர் ${order.shop.shopNameEnglish} வழங்கப்பட்டுவிட்டது \n எங்களை தேர்ந்தெடுத்ததற்கு நன்றி !`;
    var orderDetails = ` ஆர்டர் எண்: ${order._id} \n வாடிக்கையாளர் பெயர்: ${order2.user.displayName} \n தேதி : ${order.createdAt.toLocaleDateString("en-US")} சமயம் : ${order.createdAt.toLocaleTimeString("en-US")} \n கடை பெயர் : ${order.shop.shopNameTamil} \n கடை எண் : ${order.shop.shopPhone}` ;
    var footer = `\n\n\n\n இப்படிக்கு,\n பூம்புகார் குழு \n `
    const to_mail = order2.user.emailId;
    details.to = to_mail;
    details.text = mailContent + '\n' + orderDetails + '\n' + footer;
    console.log(details);
    mailTransporter.sendMail(details,(err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Mail sent successfully");
        }
    });
    res.redirect(`/shop/${order.shop._id}/orders`);
})

router.get('/:id/view',ensureAuth,async (req,res)=>{
    const curr_cart = await Cart.findById(req.params.id).populate('itemsOrdered.item').populate('shop').populate('user').lean();
                // for(var i=0;i<curr_cart.itemsOrdered.length;i++){
                //     console.log(curr_cart[itemsOrdered][i]);
                // }
                curr_cart.date = curr_cart.createdAt.toLocaleDateString("en-US");
                curr_cart.time = curr_cart.createdAt.toLocaleTimeString("en-US");
                var total = 0;
                for(var i=0;i<curr_cart.itemsOrdered.length;i++){
                    // curr_cart[i].date = curr_cart[i].createdAt.toLocaleDateString("en-US");
                    // curr_cart[i].time = curr_cart[i].createdAt.toLocaleTimeString("en-US");
                    console.log(curr_cart.itemsOrdered[i]);
                    curr_cart.itemsOrdered[i].itemTotal = curr_cart.itemsOrdered[i].itemQuantity * curr_cart.itemsOrdered[i].item.itemPrice;
                    total += curr_cart.itemsOrdered[i].itemTotal;
                }
                console.log(`${curr_cart}`.yellow.bold);
                return res.render('order-info-2',{
                    'cart' : curr_cart,
                    'total' : total,
                    layout : 'intro'
                })
})

router.get('/:id/alert',ensureAuth,async (req,res)=>{
    const order = await Cart.findById(req.params.id).populate("shop").lean();
    const order2 = await Cart.findById(req.params.id).populate("user").lean();
    var mailContent = `உங்களது ஆர்டர் ${order.shop.shopNameTamil} தயாராக உள்ளது! `;
    var orderDetails = ` ஆர்டர் எண்: ${order._id} \n வாடிக்கையாளர் பெயர்: ${order2.user.displayName} \n தேதி : ${order.createdAt.toLocaleDateString("en-US")} சமயம் : ${order.createdAt.toLocaleTimeString("en-US")} \n கடை பெயர் : ${order.shop.shopNameTamil} \n கடை எண் : ${order.shop.shopPhone}` ;
    var footer = `\n\n\n\n இப்படிக்கு,\n பூம்புகார் குழு \n `
    const to_mail = order2.user.emailId;
    details.to = to_mail;
    details.text = mailContent + '\n' + orderDetails + '\n' + footer;
    console.log(details);
    mailTransporter.sendMail(details,(err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Mail sent successfully");
        }
    });
    
    res.redirect(`/shop/${order.shop._id}/orders`);
})

router.get('/myorders',ensureAuth,async (req,res) => {
    const orders = await Cart.find({"user" : req.user}).populate("shop").populate("user").lean();
    for(var i=0;i<orders.length;i++){
        orders[i].date = orders[i].createdAt.toLocaleDateString("en-US");
        orders[i].time = orders[i].createdAt.toLocaleTimeString("en-US");
    }
    console.log(orders);
    res.render('my-orders',{
        "orders" : orders,
        layout : "main2"
    })
})
module.exports = router