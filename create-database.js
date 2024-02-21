import mongoose, { connect } from "mongoose";

const con = await connect("mongodb://127.0.0.1:27017/grouptask");

const { db } = mongoose.connection;

const SuppliersSchema = new mongoose.Schema({
    Name: {type: String},
    Contact: {type: String}  
});

const supplierModel = mongoose.model("Suppliers", SuppliersSchema);



let suppliersCollection = await supplierModel.createCollection();

suppliersCollection.insertMany(
    [     
       {
        Name: "Electronics Supplier Inc",
        Contact: "John Doe (john@electronicsupplier.com)"
       },
       {
        Name: "Fashion Supplier Co",
        Contact: "Jane Smith (jane@fashionsupplier.com)"
       }
    ]
);

const productsSchema = new mongoose.Schema({
    Name: { type: String },
    Category: { type: String },
    Price: { type: Number },
    Cost: { type: Number },
    Stock: { type: Number },
    SupplierId: {type: String}
   
});

const productModel = mongoose.model("Products", productsSchema);



let productsCollection = await productModel.createCollection();

productsCollection.insertMany(
    [
       { 
        Name: "Laptop",
        Category: "Electronics",
        Price: 1000,
        Cost: 800,
        Stock: 50,
        SupplierId: "65d5b5b413a069370e593b7c"
       },
       {
        Name: "Smartphone",
        Category: "Electronics",
        Price: 800,
        Cost: 600,
        Stock: 40,
        SupplierId: "65d5b5b413a069370e593b7c"
       },
       {
        Name: "T-shirt",
        Category: "Clothing",
        Price: 20,
        Cost: 10,
        Stock: 100,
        SupplierId: "65d5b5b413a069370e593b7d"
       }
    ]
)

