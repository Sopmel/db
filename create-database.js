import mongoose, { connect, Types } from "mongoose";

const con = await connect("mongodb://127.0.0.1:27017/grouptask");

const { db } = mongoose.connection;
const { ObjectId } = mongoose.Types;

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
    SupplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Suppliers' }
   
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
        SupplierId: new ObjectId('65d5b5b413a069370e593b7c') 
       },
       {
        Name: "Smartphone",
        Category: "Electronics",
        Price: 800,
        Cost: 600,
        Stock: 40,
        SupplierId: new ObjectId('65d5b5b413a069370e593b7c')  
       },
       {
        Name: "T-shirt",
        Category: "Clothing",
        Price: 20,
        Cost: 10,
        Stock: 100,
        SupplierId: new ObjectId('65d5b5b413a069370e593b7d')
       },
       {
        Name: "Refrigerator",
        Category: "Home Appliances",
        Price: 1200,
        Cost: 1000,
        Stock: 30,
        SupplierId: new ObjectId('65d5b5b413a069370e593b7c') 
       },
       {
        Name: "Shampoo",
        Category: "Beauty & Personal Care",
        Price: 10,
        Cost: 5,
        Stock: 80,
        SupplierId: new ObjectId('65d5b5b413a069370e593b7d')
       },
       {
        Name: "Soccer Ball",
        Category: "Sports & Outdoors",
        Price: 30,
        Cost: 20,
        Stock: 60,
        SupplierId: new ObjectId('65d5b5b413a069370e593b7d')
       }

    ]
);

const OffersSchema = new mongoose.Schema({
    Products: {type: [String]},
    Price: {type: Number},
    Active: {type: Boolean} 
});

const offersModel = mongoose.model("Offers", OffersSchema);



let offersCollection = await offersModel.createCollection();

offersCollection.insertMany(
    [     
       {
        Products: ["Laptop", "Smartphone"],
        Price: 1800,
        Active: true
       },
       {
        Products: ["T-shirt", "Shampoo"],
        Price: 30,
        Active: true
       },
       {
        Products: ["Refrigerator", "Smartphone", "Soccer Ball"],
        Price: 1830,
        Active: false
       }
    ]
);

const salesSchema = new mongoose.Schema({
      Offer: {type: String},
      Quantity: {type: Number},
      Status: {type: Boolean} 
});

const salesModel = mongoose.model("Sales Offers", salesSchema);



let salesCollection = await salesModel.createCollection();

salesCollection.insertMany(
    [     
       {
        Offer: "Offer 1",
        Quantity: 2,
        Status: 'pending'
       },
       {
        Offer: "Offer 3",
        Quantity: 1,
        Status: 'pending'
       }
    ]
);



// let result = await productModel.find({})

// console.log(result);

