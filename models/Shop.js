const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    shopNameEnglish:{
        type: 'string',
        required: true
    },
    shopNameTamil:{
        type: 'string',
        required : true
    },
    shopPhone:{
        type: 'number',
        required: true
    },
    orderCount:{
        type: 'number',
        default:0
    },
    createdAt:{
        type: Date,
        default:Date.now()
    },
    
})

module.exports =mongoose.model('Shop',ShopSchema);