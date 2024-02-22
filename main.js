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

const OffersSchema = new mongoose.Schema({
    Products: {type: [String]},
    Price: {type: Number},
    Active: {type: Boolean} 
});

const offersModel = mongoose.model("Offers", OffersSchema);

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
    
        console.log("Choose a supplier for the new product:");
        console.log("1. Add new Supplier"); // Lägg till alternativet för att lägga till ny leverantör först
    
        let suppliers = await supplierModel.find(); // Hämta alla leverantörer från databasen
        suppliers.forEach((supplier, index) => {
            console.log(`${index + 2}. ${supplier.Name}`); // Placera befintliga leverantörer efter "Add new Supplier"
        });
    
        let supplierInput = p("");
    
        if (supplierInput === "1") {
            let supplierName = p("Enter the name of the new supplier: ");
            let supplierContact = p("Enter the contact information of the new supplier: ");
    
            try {
                // kolla om leverantören redan finns
                let existingSupplier = await supplierModel.findOne({ Name: supplierName });
    
                if (existingSupplier) {
                    console.log("Supplier already exists.");
                    // Om leverantören redan finns, använd den befintliga
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
                    // Om leverantören inte finns, skapa en ny
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
        } else if (parseInt(supplierInput) >= 2 && parseInt(supplierInput) <= suppliers.length + 1) {
            // Använd befintlig leverantör baserat på användarens val
            let selectedSupplier = suppliers[parseInt(supplierInput) - 2]; // Justera indexet
            let supplierId = selectedSupplier._id;
    
            await productModel.create({
                Name: newName,
                Category: newCategory,
                Price: newPrice,
                Cost: newCost,
                Stock: newStock,
                SupplierId: supplierId
            });
            console.log("Product added successfully!");
        } else {
            console.log("Invalid option.");
        }
    }


    else if(input=="5"){
let priceRange=p('Enter the price range(use - in between)')
 let [minPrice, maxPrice] = priceRange.split("-").map(Number);

let offers = await offersModel.find({ Price: { $gte: minPrice, $lte: maxPrice } }).select('-_id').sort({ Price: 1 });
        console.log(offers);
    }
    else if (input=='6') {
        let newOffers = await offersModel.find({})
       
     let chooseCategory=p('Select the category you want to see offers from?')
     let productsInCategory = await productModel.find({ Category: chooseCategory });

     let productNames = productsInCategory.map(product => product.Name);
  
let showOffers= await offersModel.find({ Products: { $in: productNames } }).select('-_id')
console.log(showOffers);

    
    }

    else if(input == "15"){
        runApp = false;
        mongoose.connection.close()
    }

    else{
        console.log("Please enter a number between 1 and 15.")
    }

};






