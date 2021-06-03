import  mongoose from "mongoose";
import mongoosePagination from "mongoose-paginate";


let bookSchema= new mongoose.Schema({
    title:{type:String, required:true, default:""},
    author:{type:String, required:true},
    price:{type:Number, required:true},
    publishingDate:{type:Date, required:true},
    available:{type: Boolean, required:true, default: true},
    quantity:{type:Number, required:true, default:0}

});

bookSchema.plugin(mongoosePagination);
const Book= mongoose.model("Book", bookSchema);
export default  Book;