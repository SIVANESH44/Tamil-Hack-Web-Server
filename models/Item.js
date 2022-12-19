const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    itemNameEnglish:{
        type: 'string',
        required: true
    },
    itemNameTamil:{
        type: 'string',
        required : true
    },
    itemImage:{
        type: 'string',
        required: false,
    },
    itemPrice:{
        type: 'number',
        required: true
    },
    itemQuantity:{
        type: 'number',
        required: true,
    },
    itemShop:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Shop'
    }
})

module.exports =mongoose.model('Item',ItemSchema);