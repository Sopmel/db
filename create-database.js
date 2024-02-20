import mongoose, { connect } from "mongoose";

const con = await connect("mongodb://127.0.0.1:27017/gouptask");

const { db } = mongoose.connection;

const productsSchema = new mongoose.Schema({
    Name: { type: String },
    Category: { type: String },
    Price: { type: Number },
    Cost: { type: Number },
    Stock: { type: Number },
   
});

const productModel = mongoose.model("Products", productsSchema);



let productsCollection = await productModel.createCollection();

productsCollection.insertMany()