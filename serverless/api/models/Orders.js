const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Orders = mongoose.model('Orders', new Schema({
    meal_id: {mtype: Schema.Types.ObjectId,ref:'Meal'},
    user_id: String,
}))

module.exports = Orders


