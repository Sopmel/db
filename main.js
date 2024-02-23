import prompt from "prompt-sync";
import mongoose, { connect } from "mongoose";
const { ObjectId } = mongoose.Types;


const con = await connect("mongodb://127.0.0.1:27017/grouptask");

const SuppliersSchema = new mongoose.Schema({
    Name: { type: String },
    Contact: { type: String }
});

const supplierModel = mongoose.model("Suppliers", SuppliersSchema);

const categoriesSchema = new mongoose.Schema({
    Name: { type: String },
    Description: { type: String }
});

const categoriesModel = mongoose.model("Categories", categoriesSchema);

const productsSchema = new mongoose.Schema({
    Name: { type: String },
    Category: { type: String },
    Price: { type: Number },
    Cost: { type: Number },
    Stock: { type: Number },
    SupplierName: { type: String }

});

const productModel = mongoose.model("Products", productsSchema);

const OffersSchema = new mongoose.Schema({
    Products: { type: [String] },
    Price: { type: Number },
    Active: { type: Boolean }
});

const offersModel = mongoose.model("Offers", OffersSchema);

const ordersSchema = new mongoose.Schema({
    products: { type: [String] },
    Quantity: { type: [Number] },
    TotalPrice: { type: Number },
    Status: { type: Boolean }
});

const ordersModel = mongoose.model("Orders", ordersSchema);



const salesSchema = new mongoose.Schema({
    Offer: { type: String },
    Quantity: { type: Number },
    Status: { type: Boolean }
});

const salesModel = mongoose.model("Sales Offers", salesSchema);



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

while (runApp) {
    let input = p("Make a choice by entering a number: ");

    // 1. add new Category
    if (input == "1") {
        let newCategoryName = p("Add Name of new Category: ");
        let newCategoryDescription = p("Add Description to new Category: ")
        try {
            let newCategory = await categoriesModel.create({
                Name: newCategoryName,
                Description: newCategoryDescription
            });

            console.log("Category added Succesfully!")

            console.log(newCategory)

        } catch (err) {
            console.error("Error:", err);
        }
    }
    //add new Product
    else if (input === "2") {

        let newName = p("Add Name of product: ");

        console.log("Choose a Category for the new product:");
        console.log("1. Add new Category");

        let categories = await categoriesModel.find();
        categories.forEach((category, index) => {
            console.log(`${index + 2}. ${category.Name}`);
        });

        let categoryInput = p("");

        let newCategory;
        if (categoryInput === "1") {
            let newCategoryName = p("Add Name of new Category: ");
            let newCategoryDescription = p("Add Description to new Category: ");

            try {
                // Koll om kategorin redan finns
                let existingCategory = await categoriesModel.findOne({ Name: newCategoryName });
                if (existingCategory) {
                    console.log("Category already exists.");
                    newCategory = existingCategory.Name;
                } else {
                    // skapa ny om den inte finns
                    let newCategoryDoc = await categoriesModel.create({
                        Name: newCategoryName,
                        Description: newCategoryDescription
                    });
                    newCategory = newCategoryDoc.Name; // Uppdatera newCategory med det nya kategoridokumentet
                    console.log("New Category added successfully!");
                }
            } catch (err) {
                console.error("Error:", err);
            }
        } else if (parseInt(categoryInput) >= 2 && parseInt(categoryInput) <= categories.length + 1) {
            // använd en kategori som redan finns 
            let selectedCategory = categories[parseInt(categoryInput) - 2];
            newCategory = selectedCategory.Name;
        } else {
            console.log("Invalid option for Category.");

        }

        let newPrice = p("Add Price of product: ");
        let newCost = p("Add Cost of product: ");
        let newStock = p("Add Stock of product: ");

        console.log("Choose a supplier for the new product:");
        console.log("1. Add new Supplier");

        let suppliers = await supplierModel.find(); // Hämta suppliers från databas
        suppliers.forEach((supplier, index) => {
            console.log(`${index + 2}. ${supplier.Name}`);
        });

        let supplierInput = p("");

        if (supplierInput === "1") {
            let supplierName = p("Enter the name of the new supplier: ");
            let supplierContact = p("Enter the contact information of the new supplier: ");

            try {
                // Kolla om supplier redan finns
                let existingSupplier = await supplierModel.findOne({ Name: supplierName });

                if (existingSupplier) {
                    console.log("Supplier already exists.");
                    // Om supplier finns, använd den
                    await productModel.create({
                        Name: newName,
                        Category: newCategory,
                        Price: newPrice,
                        Cost: newCost,
                        Stock: newStock,
                        SupplierName: existingSupplier.Name
                    });
                    console.log("Product added successfully!");
                } else {
                    // Om supplier inte finns, skapa ny
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
                        SupplierName: newSupplier.Name
                    });
                    console.log("Supplier and product added successfully!");
                }
            } catch (err) {
                console.error("Error:", err);
            }
        } else if (parseInt(supplierInput) >= 2 && parseInt(supplierInput) <= suppliers.length + 1) {

            let selectedSupplier = suppliers[parseInt(supplierInput) - 2]; // anpassa indexet
            let supplierName = selectedSupplier.Name;

            await productModel.create({
                Name: newName,
                Category: newCategory,
                Price: newPrice,
                Cost: newCost,
                Stock: newStock,
                SupplierName: supplierName
            });
            console.log("Product added successfully!");
        } else {
            console.log("Invalid option.");
        }
    }
    //3. View products by category
    else if (input == "3") {
        const aaa = await productModel.aggregate([
            {
                $group: {
                    _id: "$Category"
                }
            }
        ])
        console.log(aaa);

        aaa.forEach((data, index) => {
            console.log();
            console.log(index + ". " + data._id);
            console.log();
            console.log("---------------------");
        })

        const ll = p("test")

        const dda = await productModel.find({ Category: ll })

        console.log(dda);
    }
    //4. View products by supplier
    else if (input == "4") {
        const x = await supplierModel.find({})
        let indexTransfer;
        const cookies = Number(p("test"))
        x.forEach((data, index) => {
            console.log((index + 1) + ". " + data.Name);

            if ((index + 1) == cookies) {

                indexTransfer = cookies

            }


        })
        console.log(indexTransfer);
        const cookies55 = await productModel.find({ SupplierId: indexTransfer })


        cookies55.forEach((prudoct) => {
            console.log("-----------------------");
            console.log(prudoct.Name);
            console.log(prudoct.Category);
            console.log(prudoct.Price);
            console.log(prudoct.Cost);
            console.log(prudoct.Stock);



        })


    }
    //5. View all offers within a price range
    else if (input == "5") {
        let priceRange = p('Enter the price range(use - in between)')
        let [minPrice, maxPrice] = priceRange.split("-").map(Number);

        let offers = await offersModel.find({ Price: { $gte: minPrice, $lte: maxPrice } }).select('-_id').sort({ Price: 1 });
        console.log(offers);
    }
    else if (input == '6') {
        let newOffers = await offersModel.find({})

        let chooseCategory = p('Select the category you want to see offers from?')
        let productsInCategory = await productModel.find({ Category: chooseCategory });

        let productNames = productsInCategory.map(product => product.Name);

        let showOffers = await offersModel.find({ Products: { $in: productNames } }).select('-_id')
        console.log(showOffers);


    }
    //8. Create order for products
    else if (input == "8") {
        console.log("Create order for products");

        let orderItems = [];
        let continueAdding = true;

        while (continueAdding) {
            let categories = await categoriesModel.find();
            categories.forEach((category, index) => {
                console.log(`${index + 1}. ${category.Name}`);
            });

            let orderInput = p("Choose category to view products( 0 to finnish): ");

            if (parseInt(orderInput) === 0) {
                console.log("Exiting order creation.");
                break;
            }

            if (parseInt(orderInput) >= 1 && parseInt(orderInput) <= categories.length) {
                let selectedCategory = categories[parseInt(orderInput) - 1];

                try {
                    let products = await productModel.find({ Category: selectedCategory.Name });

                    if (products.length > 0) {
                        console.log(`Products in category "${selectedCategory.Name}":`);
                        products.forEach((product, index) => {
                            console.log(` ${index + 1}. Name: ${product.Name}, Price: ${product.Price}, Stock: ${product.Stock}`);
                        });

                        while (true) {
                            let productIndex = parseInt(p("Choose product to add (0 to exit): "))

                            if (productIndex === 0) break;
                            if (productIndex < 1 || productIndex > products.length) {
                                console.log("Invalid number. "); continue;
                            }

                            let quantity = parseInt(p("How many would you like to add? "));
                            if (quantity <= 0) {
                                console.log("number must be greater than 0. "); continue;
                            }

                            let selectedProduct = products[productIndex - 1];
                            orderItems.push({ product: selectedProduct, quantity });
                        }

                    } else {
                        console.log("No products in this Category. ");
                    }
                } catch (err) {
                    console.log("Error fetching Products.");
                }
            } else {
                console.log("Invalid Category. ");
            }

            let continueInput = p("Do you want to add more products? (yes/no): ");
            continueAdding = continueInput.toLowerCase() === 'yes';
        }

        if (orderItems.length > 0) {
            // Skapa offerten baserat på orderItems
            console.log("Order summary:");
            orderItems.forEach((item, index) => {
                console.log(`${index + 1}. Name: ${item.product.Name}, Quantity: ${item.quantity}, Total Price: ${item.quantity * item.product.Price}`);
            });

            // Skapa en ny order
            try {
                let totalPrice = orderItems.reduce((total, item) => total + item.quantity * item.product.Price, 0);
                let newOrder = await ordersModel.create({
                    products: orderItems.map(item => item.product.Name),
                    Quantity: orderItems.map(item => item.quantity),
                    TotalPrice: totalPrice,
                    Status: false
                });
                console.log("Order created successfully:", newOrder);
            } catch (err) {
                console.error("Error creating order:", err);
            }
        }
    }
    //12. View suppliers
    else if (input == "12") {
        const aa = await supplierModel.find({})
        aa.forEach((data, index) => {
            console.log(index + 1);
            console.log(data.Name);
            console.log(data.Contact);
            console.log("---------------------");
        })
    }
    else if (input == "13") {}

    else if (input == "14") {


        let getProfit = await productModel.aggregate([{
            $group: {
                _id: null,
                sumOfCost: { "$sum": "$Cost" },
                sumOfPrice: { "$sum": "$Price" }
            }

        }, {
            $addFields: {
                profit: { $subtract: ["$sumOfPrice", "$sumOfCost"] }
            }
        }



        ])//test
        console.log(getProfit);


    }
    else if (input == "15") {
        runApp = false;
        mongoose.connection.close()
    }
    else if (input == "16") {
        let allProducts = await productModel.find({})



        console.log("Here is a list of all the products: ");
        console.log(allProducts);

    }

    else {
        console.log("Please enter a number between 1 and 15.")
    }

};






