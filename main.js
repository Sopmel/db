import prompt from "prompt-sync";
import mongoose, { connect, Types } from "mongoose";
const { ObjectId } = mongoose.Types;


const con = await connect("mongodb://127.0.0.1:27017/grouptask");

const SuppliersSchema = new mongoose.Schema({
    Name: {type: String},
    Contact: {type: String}  
});

const supplierModel = mongoose.model("Suppliers", SuppliersSchema);

const productsSchema = new mongoose.Schema({
    Name: { type: String },
    Category: { type: String },
    Price: { type: Number },
    Cost: { type: Number },
    Stock: { type: Number },
    SupplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Suppliers' }
   
});

const productModel = mongoose.model("Products", productsSchema);

const p = prompt();

console.log("Menu")
console.log("1. Add new category")
console.log("2. Add new product")
console.log("3. View products by category")
console.log("4. View products by supplier")
console.log("5. View all offers within a price range")
console.log("6. View all offers that contain a product from a specific category")
console.log("7. View the number of offers based on the number of its products in stock")
console.log("8. Create order for products")
console.log("9. Create order for offers")
console.log("10. Ship orders")
console.log("11. Add a new supplier")
console.log("12. View suppliers")
console.log("13. View all sales")
console.log("14. View sum of all profits")
console.log("15. Close app")

let runApp = true;

while(runApp){
    let input = p("Make a choice by entering a number: ");

    if(input == "1"){
        let allProducts = await productModel.find({})



        console.log("Here is a list of all the products: ");
        console.log(allProducts);

    }

    else if (input === "2") {
        let newName = p("Add Name of product: ");
        let newCategory = p("Add Category of product: ");
        let newPrice = p("Add Price of product: ");
        let newCost = p("Add Cost of product: ");
        let newStock = p("Add Stock of product: ");
    
        let supplierInput = p("Choose supplier for the new product:\n1. Electronics\n2. Fashion\n3. Add new Supplier\n");
    
        if (supplierInput === "1" || supplierInput === "2") {
            // Get the supplier based on the input
            let supplierId;
            if (supplierInput === "1") {
                supplierId = '65d5b5b413a069370e593b7c'; // Existing supplier for Electronics
            } else {
                supplierId = '65d5b5b413a069370e593b7d'; // Existing supplier for Fashion
            }
    
            // Create the product with the obtained supplierId
            productModel.create({
                Name: newName,
                Category: newCategory,
                Price: newPrice,
                Cost: newCost,
                Stock: newStock,
                SupplierId: supplierId
            })
            .then(() => {
                console.log("Product added successfully!");
            })
            .catch(err => {
                console.error("Error adding product:", err);
            });
        } else if (supplierInput === "3") {
            let supplierName = p("Enter the name of the new supplier: ");
            let supplierContact = p("Enter the contact information of the new supplier: ");
    
            try {
                // Check if the supplier already exists
                let existingSupplier = await supplierModel.findOne({ Name: supplierName });
    
                if (existingSupplier) {
                    // If the supplier exists, use its ID
                    await productModel.create({
                        Name: newName,
                        Category: newCategory,
                        Price: newPrice,
                        Cost: newCost,
                        Stock: newStock,
                        SupplierId: existingSupplier._id
                    });
                    console.log("Product added successfully!");
                } else {
                    // If the supplier doesn't exist, create a new one
                    let newSupplier = await supplierModel.create({
                        Name: supplierName,
                        Contact: supplierContact
                    });
    
                    await productModel.create({
                        Name: newName,
                        Category: newCategory,
                        Price: newPrice,
                        Cost: newCost,
                        Stock: newStock,
                        SupplierId: newSupplier._id
                    });
                    console.log("Supplier and product added successfully!");
                }
            } catch (err) {
                console.error("Error:", err);
            }
        } else {
            console.log("Invalid option.");
        }
    }
    else if(input == "15"){
        runApp = false;
    }

    else{
        console.log("Please enter a number between 1 and 15.")
    }

};






