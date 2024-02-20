import prompt from "prompt-sync";
import mongoose, { connect } from "mongoose";


const con = await connect("mongodb://127.0.0.1:27017/gouptask");

const productsSchema = new mongoose.Schema({
    Name: { type: String },
    Category: { type: String },
    Price: { type: Number },
    Cost: { type: Number },
    Stock: { type: Number }
   
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
        //let allProducts = await productModel.find({});

        console.log("Here is a list of all the products: ");
        //console.log(allProducts);

    }

    else if(input === "2"){
        // här e massa kod
    }
    else if(input == "15"){
        runApp = false;
    }

    else{
        console.log("Please enter a number between 1 and 15.")
    }

};






