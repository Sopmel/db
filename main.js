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
    Name: { type: String },
    Products: { type: [String] },
    Price: { type: Number },
    Active: { type: Boolean }
});

const offersModel = mongoose.model("Offers", OffersSchema);

const salesOrdersSchema = new mongoose.Schema({
    Offer: { type: [String] },
    Products: { type: [String] },
    Quantity: { type: [Number] },
    TotalPrice: { type: Number },
    Status: { type: String }
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
console.log("11. View suppliers")
console.log("12. View all sales")
console.log("13. View sum of all profits")
console.log("14. Close app")
console.log("11. View suppliers")
console.log("12. View all sales")
console.log("13. View sum of all profits")
console.log("14. Close app")


let runApp = true;

while (runApp) {
    let input = p(" \n Make a choice by entering a number: ");

    // 1. add new Category
    if (input == "1") {
        let newCategoryName = p(" \n Add Name of new Category: ");
        let newCategoryDescription = p(" \n Add Description to new Category: ")
        try {
            let newCategory = await categoriesModel.create({
                Name: newCategoryName,
                Description: newCategoryDescription
            });

            console.log(" \nCategory added Succesfully!")

            console.log(newCategory)

        } catch (err) {
            console.error("Error:", err);
        }
    }
    //add new Product
    else if (input === "2") {

        let newName = p(" \n Add Name of product: ");

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
                    console.log(" \n Supplier already exists.");
                    // Om supplier finns, använd den
                    await productModel.create({
                        Name: newName,
                        Category: newCategory,
                        Price: newPrice,
                        Cost: newCost,
                        Stock: newStock,
                        SupplierName: existingSupplier.Name
                    });
                    console.log(" \n Product added successfully!");
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
                    console.log(" \n Supplier and product added successfully!");
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


        const allCategories = await categoriesModel.find({})
        allCategories.forEach((data, index) => {
            console.log();
            console.log((index + 1) + ". " + data.Name);
            console.log();
            console.log("---------------------");
        })

        const UsersChoice = p("Write the number of the category you wish to select: ): ")

        if (UsersChoice >= "1") {
            let selCat = allCategories[UsersChoice - 1]

            console.log(selCat);
            let catName = selCat.Name

            const productNameByUser = await productModel.find({ Category: catName })
            console.log("---------------------");
            productNameByUser.forEach((data, index) => {
                console.log(index + ".");
                console.log("Name: " + data.Name);
                console.log("Category: ", data.Category);
                console.log("Price: ", data.Price);
                console.log("Cost: ", data.Cost);
                console.log("Stock: ", data.Stock);
                console.log("---------------------");
            })
        }
        else {
            console.log("error");
        }

    }
    //4. View products by supplier
    else if (input == "4") {
        const allSupplier = await supplierModel.find({})
        allSupplier.forEach((data, index) => {
            console.log();
            console.log((index + 1) + ". " + data.Name);

        })
        const userChoice = Number(p("Choose supplier to view products (Type the number that is aside the supplier name): "))


        if (userChoice >= "1") {
            let selsup = allSupplier[userChoice - 1]
            let supname = selsup.Name

            const productNameByUser = await productModel.find({ SupplierName: supname })

            console.log("---------------------");
            productNameByUser.forEach((data, index) => {
                console.log(index + ".");
                console.log("Name: " + data.Name);
                console.log("Category: ", data.Category);
                console.log("Price: ", data.Price);
                console.log("Cost: ", data.Cost);
                console.log("Stock: ", data.Stock);
                console.log("---------------------");
            })
        }
        else {
            console.log("error");
        }

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
    else if (input == 7) {

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
    else if (input == 7) {

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

            let orderInput = p("\nChoose category to view products( 0 to finish): ");

            if (parseInt(orderInput) === 0) {
                
                break;
            }

            if (parseInt(orderInput) >= 1 && parseInt(orderInput) <= categories.length) {
                let selectedCategory = categories[parseInt(orderInput) - 1];

                try {
                    let products = await productModel.aggregate([
                        { $match: { Category: selectedCategory.Name } }
                    ]);

                    if (products.length > 0) {
                        console.log(`\n Products in category "${selectedCategory.Name}":`);
                        products.forEach((product, index) => {
                            console.log(` ${index + 1}. Name: ${product.Name}, Price: ${product.Price}, Stock: ${product.Stock}`);
                        });

                        while (true) {
                            let productIndex = parseInt(p("\nChoose product to add (0 to exit category): "))

                            if (productIndex === 0) break;
                            if (productIndex < 1 || productIndex > products.length) {
                                console.log("Invalid number. "); continue;
                            }

                            let quantity = parseInt(p("\nHow many would you like to add? "));
                            if (quantity <= 0) {
                                console.log("number must be greater than 0. "); continue;
                            }

                            let selectedProduct = products[productIndex - 1];
                            orderItems.push({ product: selectedProduct, quantity });
                        }

                    } else {
                        console.log("\nNo products in this Category. ");
                    }
                } catch (err) {
                    console.log("\nError fetching Products.");
                }
            } else {
                console.log("\nInvalid Category. ");
            }

            let continueInput = p("\nDo you want to add more products? (yes/no): ");
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
                    Offer: "Order",
                    Products: orderItems.map(item => item.product.Name),
                    Quantity: orderItems.map(item => item.quantity),
                    TotalPrice: totalPrice,
                    Status: "pending"
                });
                console.log("Order created successfully:", newOrder);
            } catch (err) {
                console.error("Error creating order:", err);
            }
        }
    }

    //9. Create order for offers
    else if (input == "9") {
        console.log("\n Create order for offers");

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

            let orderInput = p(" \nChoose offer to add (0 to finish): ");

            if (parseInt(orderInput) === 0) {
                break;
            }

            if (parseInt(orderInput) >= 1 && parseInt(orderInput) <= offers.length) {
                let selectedOffer = offers[parseInt(orderInput) - 1];

                let quantity = parseInt(p("\n How many would you like to add? "));
                if (quantity <= 0) {
                    console.log(" \n Quantity must be greater than 0.");
                    continue;
                }

                let offerName = `Offer ${orderItems.length + 1}`;
                orderItems.push({ offer: selectedOffer, quantity, offerName });

            } else {
                console.log("Invalid option for Offer.");
            }

            let continueInput = p("\n Do you want to add more offers? (yes/no): ");
            continueAddingOffer = continueInput.toLowerCase() === 'yes';
        }

        if (orderItems.length > 0) {
            try {
                // Beräkna den totala priset för ordern baserat på valda erbjudanden
                let totalPrice = orderItems.reduce((total, item) => total + item.quantity * item.offer.totalPrice, 0);

                // Hämta produkterna från varje orderItem
                let products = orderItems.map(item => item.offer._id).flat();
                // Hämta erbjudandets namn från varje orderItem
                let offerNames = orderItems.map(item => item.offer.Offer);

                // Skapa en ny order
                let newOrder = await salesOrdersModel.create({
                    Offer: orderItems.map(item => item.offerName),
                    Products: products,
                    Quantity: orderItems.map(item => item.quantity),
                    TotalPrice: totalPrice,
                    Status: "pending"
                });
                console.log("Order created successfully:", newOrder);
            } catch (err) {
                console.error("Error creating order:", err);
            }
        }
    }


//10. ship products
else if (input == "10") {
    console.log("\n0Ship Orders");

    while (true) {
        // Hämta alla ordrar med status "pending"
        let salesOrders = await salesOrdersModel.find({ Status: "pending" });

        if (salesOrders.length === 0) {
            console.log("No pending orders to ship.");
            break;
        }

        // Visa alla ordrar med status "pending"
        console.log("\nPending Orders:");
        salesOrders.forEach((orderToShip, index) => {
            console.log(`\n${index + 1}.`);
            console.log(`   Name: ${orderToShip.Offer ? orderToShip.Offer : "Order " + (index + 1)}`);
            console.log(`   Products: ${orderToShip.Products}`);
            console.log(`   Total Price: ${orderToShip.TotalPrice}`);
            console.log(`   Status: ${orderToShip.Status}`);
        });

        let orderIndex = parseInt(p("\nSelect the order to ship (0 to quit): "));

        if (parseInt(orderIndex) === 0) {
            console.log("Closing Orders");
            break;
        }
        if (isNaN(orderIndex) || orderIndex < 1 || orderIndex > salesOrders.length) {
            console.log("\nInvalid order number. Please try again.");
            continue;
        }

        let selectedOrder = salesOrders[orderIndex - 1];

        // Säkerställ att Quantity-matchar antalet produkter
        if (selectedOrder.Products.length !== selectedOrder.Quantity.length) {
    
            selectedOrder.Quantity = Array(selectedOrder.Products.length).fill(1);
            await selectedOrder.save();
            
        }

        // Variabel för att spåra om hela ordern kan skickas
        let canShipOrder = true;

        // Loopa igenom varje produkt i ordern för att kontrollera lagerstatusen
        for (let i = 0; i < selectedOrder.Products.length; i++) {
            let productName = selectedOrder.Products[i];
            let orderedQuantity = selectedOrder.Quantity[i]; // Hämta kvantiteten för den aktuella produkten

            let productInOrder = await productModel.findOne({ Name: productName });

            // Kontrollera om produkten finns och om det finns tillräckligt med lager för den beställda mängden
            if (productInOrder && productInOrder.Stock >= orderedQuantity) {
                // Uppdatera lagerstatusen för produkten
                let updatedStock = productInOrder.Stock - orderedQuantity;
                await productModel.updateOne({ Name: productName }, { $set: { Stock: updatedStock } });
                console.log(`\n Updated stock for product ${productName}: ${updatedStock}`);

                if (updatedStock === 0) {
                    // Hämta alla erbjudanden som innehåller den slutsålda produkten
                    let affectedOffers = await offersModel.find({ Products: productName });

                    // Loopa igenom varje påverkat erbjudande och uppdatera Active-fältet
                    for (let offer of affectedOffers) {
                        await offersModel.updateOne({ _id: offer._id }, { $set: { Active: false } });
                        console.log(`Offer ${offer.Name} is now inactive due to zero stock.`);
                    }
                }
            } else {
                console.log(`\n Cannot ship order. Insufficient stock for product ${productName}.`);
                canShipOrder = false; // Sätt canShipOrder till false om det inte finns tillräckligt med lager för minst en produkt
                break; // Avbryt loopen om en produkt saknar tillräckligt med lager
            }
        }

        // Uppdatera statusen till "shipped" endast om canShipOrder är true
        if (canShipOrder) {
            await salesOrdersModel.updateOne({ _id: selectedOrder._id }, { $set: { Status: "shipped" } });
            console.log(`\nYour Order has been marked as shipped.`);
        } else {
            console.log("\nCannot mark order as shipped due to insufficient stock for one or more products.");
        }
    }
}


    //11. View suppliers
    else if (input == "11") {
        const aa = await supplierModel.find({})
        aa.forEach((data, index) => {
            console.log(index + 1);
            console.log(data.Name);
            console.log(data.Contact);
            console.log("---------------------");
        })
    }
    else if (input == "12") {

        let allSales = await salesOrdersModel.find();

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

    else if (input == "13") {

        const getProduct = await productModel.find({});

        getProduct.forEach((product, index) => {
            console.log(`-----------\n${index + 1}. ${product.Name}`);
        });
        console.log(`-----------`);

        while (true) {

            const userChoice = p("Choose product (type the number to get the product),\n or press 0 to break (remember some products are not with offers\n for an exempel you at the begining the database there are no ordersales for T-shirt nor Shampoo ): ");
            if (userChoice === "0") {
                break;
            }
            let proName;
            const productNameByUser = await productModel.find({ SupplierName: proName })
            if (productNameByUser)
                if (userChoice >= "1") {
                    let selPro = getProduct[userChoice - 1]
                    proName = selPro.Name

                    const productNameByUser = await productModel.find({ SupplierName: proName })

                    console.log("---------------------");
                    productNameByUser.forEach((data, index) => {
                        console.log(index + ".");
                        console.log("Name: " + data.Name);
                        console.log("Category: ", data.Category);
                        console.log("Price: ", data.Price);
                        console.log("Cost: ", data.Cost);
                        console.log("Stock: ", data.Stock);
                        console.log("---------------------");
                    })
                }
                else {
                    console.log("error");
                }

            const getSalesOrders = await salesOrdersModel.find({ $nor: [{ Offer: "Order" }], Products: { $in: [proName] } });

            for (const salesOrder of getSalesOrders) {

                let totalCost = 0

                for (const Cookie of salesOrder.Products) {
                    let productCost = 0;
                    try {
                        productCost = await productModel.findOne({ Name: Cookie });

                        totalCost += productCost.Cost

                    } catch (error) {
                        console.error('Error finding product cost:', error);
                    }

                }
                const Profit = salesOrder.TotalPrice - totalCost
                const profitTax = (salesOrder.TotalPrice - totalCost) * 0.8
                console.log("-------------------------------------------------------------------------------------------");
                console.log(salesOrder.Products.join(" and "),
                    "Profit (including tax):", Profit,
                    "\n\n ---------------------------> profit (excluding tax):",
                    profitTax,
                    "<--------------------------------\n");

            }
            console.log("-------------------------------------------------------------------------------------------");
        }

    }
    else if (input == "14") {
        runApp = false;
        mongoose.connection.close()
    }
    else if (input == "15") {
        let allProducts = await productModel.find({})

        console.log("Here is a list of all the products: ");
        console.log(allProducts);

    }

    else {
        console.log("Please enter a number between 1 and 14.")
    }

};