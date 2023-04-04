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
    cookie: { secure: true, maxAge: (1000 * 60 * 60 * 24) }
}))



import { connection } from "./db/config.js";
// index page
app.get('/', function (req, res) {
    if (req.session.cart === undefined) {
        console.log("set session cart")
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
    res.render('pages/cart')
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
app.post('/cart', (req, res) => {
    console.log("test session why undefined", req.session.cart)
    console.log("test session why undefined", req.session)
    // const product = req.body.idProduct
    // console.log(product)
    // req.session.cart.push(product)
    // console.log(req.session)
    res.redirect('/products')


})

app.listen(5000);
console.log('5000 is the magic port');


