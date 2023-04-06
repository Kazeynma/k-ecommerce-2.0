// load the things we need
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
//to have ejs
app.set('view engine', 'ejs');
//to import images and style for pages
app.use(express.static('public'));
//to send data
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
// to use express session for coockies
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: (1000 * 60 * 60 * 24) }
}))



import { connection } from "./db/config.js";

//import function
import { clientFunction } from "./db/clients/fonctions.js";
import { productsFonction } from "./db/produits/fonctions.js";

// index page
app.get('/', function (req, res) {
    if (!req.session.cart) {
        req.session.cart = []
    }
    connection.query("SELECT * FROM product", (err, rows, fields) => {
        const tropicalArray = []
        const flowerArray = []
        const driedFlowerArray = []
        rows.forEach((product) => {
            if (product.category === "tropical") {
                tropicalArray.push(product)
            } else if (product.category === "flower") {
                flowerArray.push(product)
            } else if (product.category === "driedFlower") {
                driedFlowerArray.push(product)
            }
        })

        res.render('pages/index', {
            tropical: tropicalArray,
            flower: flowerArray,
            diredFlower: driedFlowerArray
        })
    })
});

// contact page
app.get('/contact', function (req, res) {
    res.render('pages/contactUs');
});

// products page
app.get('/products', function (req, res) {
    console.log(req.session)
    console.log(req.session.cart)
    connection.query("SELECT * FROM product", (err, rows, fields) => {
        const tropicalArray = []
        const flowerArray = []
        const driedFlowerArray = []
        rows.forEach((product) => {
            if (product.category === "tropical") {
                tropicalArray.push(product)
            } else if (product.category === "flower") {
                flowerArray.push(product)
            } else if (product.category === "driedFlower") {
                driedFlowerArray.push(product)
            }
        })
        res.render('pages/productPage', {
            tropical: tropicalArray,
            flower: flowerArray,
            diredFlower: driedFlowerArray
        })
    })
});

//cart page
app.get('/cart', function (req, res) {
    res.render('pages/cart', {
        cart: req.session.cart || []
    })
})

//message send page
app.get('/contact/sent', (req, res) => {
    res.render('pages/messageSend')
})

//POST
app.post('/contact', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const subject = req.body.subject
    const message = req.body.message
    const sql = "INSERT INTO questions SET name = ?, email = ?, subject = ?, message = ?"
    connection.query(sql, [name, email, subject, message], (err, rows, fiedls) => {
        res.redirect("/contact/sent")
    })
})

//permet d'ajouter un produit dans la panier en utilisant son id et l'id de l'utilisateur enregistré en cookie
app.post('/cart', async (req, res) => {
    console.log("cart 1 : ", req.session.cart)
    let cart
    if (!req.session.cart) {
        cart = []
    } else {
        cart = req.session.cart
    }

    let result = await productsFonction.getProductWithId(req.body.idProduct)
    cart.push(result[0])
    req.session.cart = cart
    console.log("cart : ", cart)
    res.render('pages/cart', {
        cart: req.session.cart
    })
})

//permet de retirer des éléments du panier (efface de temps en temps tous le panier)
app.post('/cart/delete', (req, res) => {
    let cart = req.session.cart

    let newCart = cart.slice(req.body.idProduct)
    console.log("new array", newCart)
    req.session.cart = newCart

    res.redirect("/cart")
})

//permet d'ajouter la commande dans une base de données 
app.post('/cart/add', async (req, res) => {
    const cart = req.session.cart
    console.log("/cart/add")
    const client = await clientFunction.getClientWithEmail(req.body.email)

    console.log("boop", client)
    if (!cart) {
        res.redirect("/products")
    }
    if (client.length === 0) {
        let newClient = await clientFunction.addClient(req.body)
        cart.forEach((product) => {
            productsFonction.addOrder(newClient.insertId, product.id)
        })
    } else {
        cart.forEach((product) => {
            productsFonction.addOrder(client[0].id, product.id)
        })
    }

})




app.listen(5000);
console.log('5000 is the magic port');


