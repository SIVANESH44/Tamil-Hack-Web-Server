const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    cartId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Cart',
    },
    totalAmount :{
        type : 'number',
        required : true
    },
    delivered:{
        type:"boolean",
        default: false
    },
    createdAt:{
        type: Date,
        default:Date.now()
    }    
})

module.exports =mongoose.model('Order',OrderSchema);