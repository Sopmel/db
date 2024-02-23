import prompt from "prompt-sync";
import mongoose, { connect } from "mongoose";
//const { ObjectId } = mongoose.Types;


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

const salesOrdersSchema = new mongoose.Schema({
    products: { type: [ String ] },
    Quantity: { type: [ Number ] },
    TotalPrice: { type: Number },
    Status:  { type:  String }
});

const salesOrdersModel = mongoose.model("salesOrders", salesOrdersSchema);

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
    let input = p(  " \n Make a choice by entering a number: ");

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
        const GroupCategory = await productModel.aggregate([
            {
                $group: {
                    _id: "$Category"
                }
            }
        ])
        console.log(GroupCategory);

        GroupCategory.forEach((data, index) => {
            console.log();
            console.log(index + ". " + data._id);
            console.log();
            console.log("---------------------");
        })

        const UsersChoice = p("Choose a category: ")

        const GetProducts = await productModel.find({ Category: UsersChoice })

        console.log(GetProducts);
    }
    //4. View products by supplier
    else if (input == "4") {
        const allSupplier = await supplierModel.find({})
        allSupplier.forEach((data, index) => {
            console.log();
            console.log((index + 1) + ". " + data.Name);
            
        })
        const userUhoice = Number(p("Choose supplier to wiew products: "))
        

        if (userUhoice >= "1"){
            let selsup = allSupplier[userUhoice-1]
            let supname = selsup.Name
            
            const SupplierNameByUser = await productModel.find({ SupplierName: supname })
console.log(SupplierNameByUser);
        }
        else{
            console.log("error");
        }
        
        // const SupplierNameByUser = await productModel.find({ SupplierName: userUhoice })


        // SupplierNameByUser.forEach((product) => {
        //     console.log("-----------------------");
        //     console.log(product.Name);
        //     console.log(product.Category);
        //     console.log(product.Price);
        //     console.log(product.Cost);
        //     console.log(product.Stock);



        // })


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

    else if(input==7){

        let allOffers = await offersModel.find();
        
        let allProductsInStockCount = 0;
        let someProductsInStockCount = 0;
        let noProductsInStockCount = 0;
        
        for (let offer of allOffers) {
             let allProductsInStock = true;
            for (let productName of offer.Products) {
                let product = await productModel.findOne({ Name: productName });
                if (product.Stock === 0) {
                    allProductsInStock = false;
                    break;
                }
            }
        
            if (allProductsInStock) {
                allProductsInStockCount++;
            } else {
                let someProductsInStock = false;
                for (let productName of offer.Products) {
                    let product = await productModel.findOne({ Name: productName });
                    if (product.Stock > 0) {
                        someProductsInStock = true;
                        break;
                    }
                }
                if (someProductsInStock) {
                    someProductsInStockCount++;
                } else {
                    noProductsInStockCount++;
                }
            }
        }
        
        
        console.log("Summary:");
        console.log(`- Offers with all products in stock: ${allProductsInStockCount}`);
        console.log(`- Offers with some products in stock: ${someProductsInStockCount}`);
        console.log(`- Offers with no products in stock: ${noProductsInStockCount}`);
        
        
        
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

        let orderInput = p("Choose category to view products( 0 to finish): ");

            if (parseInt(orderInput) === 0) {
                console.log("Exiting order creation.");
                break;
            }

        if (parseInt(orderInput) >= 1 && parseInt(orderInput) <= categories.length) {
            let selectedCategory = categories[parseInt(orderInput) - 1];

            try {
                let products = await productModel.aggregate([
                    { $match: { Category: selectedCategory.Name } }
                ]);

                if (products.length > 0) {
                    console.log(`Products in category "${selectedCategory.Name}":`);
                    products.forEach((product, index) => {
                        console.log(` ${index + 1}. Name: ${product.Name}, Price: ${product.Price}, Stock: ${product.Stock}`);
                    });

                    while (true) {
                        let productIndex = parseInt(p("Choose product to add (0 to exit): "))

                        if ( productIndex === 0 ) break;
                        if ( productIndex < 1 || productIndex > products.length ){
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
        // Beräkna det totala priset för ordern
        let totalPriceResult = await productModel.aggregate([
            { $match: { _id: { $in: orderItems.map(item => item.product._id) } } },
            { $group: { _id: null, totalPrice: { $sum: { $multiply: ["$Price", { $arrayElemAt: [orderItems.map(item => item.quantity), 0] }] } } } }
        ]);

        if (totalPriceResult.length === 0) {
            console.log("Failed to calculate total price.");
        
        }

        let totalPrice = totalPriceResult[0].totalPrice;
        // Skapa en ny order
        try {
            let newOrder = await salesOrdersModel.create({
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

//9. Create order for offers
else if (input == "9") {
    console.log("Create order for offers");

    let orderItems = [];
    let continueAddingOffer = true;

    while (continueAddingOffer) {
        let offers = await offersModel.aggregate([
            {
                $group: {
                    _id: "$Products",
                    totalQuantity: { $sum: 1 },
                    totalPrice: { $first: "$Price" }
                }
            }
        ]);

        offers.forEach((offer, index) => {
            console.log(`${index + 1}. Offer: \n Products: ${offer._id.join(', ')} \n Price: ${offer.totalPrice}`);
        });

        let orderInput = p("Choose offer to add (0 to finish): ");

        if (parseInt(orderInput) === 0) {
            console.log("Exiting offer creation.");
            break;
        }

        if (parseInt(orderInput) >= 1 && parseInt(orderInput) <= offers.length) {
            let selectedOffer = offers[parseInt(orderInput) - 1];

            let quantity = parseInt(p("How many would you like to add? "));
            if (quantity <= 0) {
                console.log("Quantity must be greater than 0.");
                continue;
            }

            orderItems.push({ offer: selectedOffer, quantity });
        } else {
            console.log("Invalid option for Offer.");
        }

        let continueInput = p("Do you want to add more offers? (yes/no): ");
        continueAddingOffer = continueInput.toLowerCase() === 'yes';
    }

    if (orderItems.length > 0) {
        try {
            // Beräkna den totala priset för ordern baserat på valda erbjudanden
            let totalPrice = orderItems.reduce((total, item) => total + item.quantity * item.offer.totalPrice, 0);

            // Skapa en ny order
            let newOrder = await salesOrdersModel.create({
                products: orderItems.map(item => item.offer._id.join(', ')),
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

//10.Ship Orders
else if (input == "10"){
    console.log("Ship Orders");

    let shipItems = [];
    let continueShipping = true;

    while (continueShipping) {
        let salesOrders = await salesOrdersModel.aggregate([
            {
                $group: {
                    _id: "$Products",
                    totalQuantity: { $sum: 1 },
                    totalPrice: { $first: "$Price" },
                    Status: "Status"
                }
            }
        ]);

        salesOrders.forEach((orderToShip, index) => {
            console.log(`\n${index + 1}. Order: \n Products: ${orderToShip.Products} \n Price: ${orderToShip.totalPrice} \n Price: ${orderToShip.Status}`);
        });

        let orderInput = p("Choose order to ship (0 to finish): ");

        if (parseInt(orderInput) === 0) {
            break;
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
    else if (input == "13") {

        let allSales = await salesModel.find();


        for (let sale of allSales) {
            let orderNumber = sale._id;
            let offer = await offersModel.findOne({});
            let offerPrice = offer.Price;
            let totalCost = sale.Quantity * offerPrice;
            console.log(`Order number: ${orderNumber}`);

            console.log(`Offer: ${sale.Offer}`);
            console.log(`Quantity: ${sale.Quantity}`);
            console.log(`Status: ${sale.Status ? 'Shipped' : 'Pending'}`);
            console.log(`Total cost: ${totalCost}\n`);
        }


    }

    else if (input == "14") {


        let getProfit = await productModel.aggregate([{
            $group: {
                _id: null,
                sumOfCost: { "$sum": "$Cost" },
                sumOfPrice: { "$sum": "$Price" }
            }

        }, {
            $addFields: {
                profit: { $subtract: ["$sumOfPrice", "$sumOfCost"] },
                profitmultiply: { $multiply: ["$profit", 2] }
            }
        }



        ])//test
        console.log(getProfit._id);
        console.log(getProfit.sumOfCost);
        console.log(getProfit.sumOfPrice);
        console.log(getProfit);
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









