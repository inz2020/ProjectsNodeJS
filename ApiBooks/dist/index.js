"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const books_model_1 = __importDefault(require("./model/books.model"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
mongoose_1.default.set('useFindAndModify', false);
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(cors_1.default());
app.get("/", (req, res) => {
    res.send("Hello world");
});
//Connection à la BD
const uri = "mongodb://localhost:27017/LibrairyBooks";
mongoose_1.default.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err)
        console.log("Connection Error: " + err);
    else
        console.log("Connection successed!!");
});
/* Requete  HTTP get */
app.get("/books", (req, res) => {
    books_model_1.default.find((err, books) => {
        if (err)
            res.status(500).send("Interne Error: " + err);
        else
            res.send(books);
    });
    /* Book.find((err, books)=>{
         if(err) res.status(500).send("Interne Error: "+ err);
         else res.send(books);
     });*/
});
/* Requette HTTP POST*/
app.post("/books", (req, res) => {
    let book = new books_model_1.default(req.body);
    book.save((err) => {
        if (err)
            res.status(500).send(err);
        else
            res.send(book);
    });
});
app.get("/books/:id", (req, res) => {
    // @ts-ignore
    books_model_1.default.findById(req.params.id, req.body, (book, err) => {
        if (err)
            res.status(500).send("Interne Error: " + err);
        else
            res.send(book);
    });
});
/* Requette HTTP PUT*/
app.put("/books/:id", (req, res) => {
    books_model_1.default.findByIdAndUpdate(req.params.id, req.body, (err, book) => {
        if (err)
            res.status(500).send("Interne Error: " + err);
        else
            res.send(book);
    });
});
/* Requete HTTP Delete*/
app.delete("/books/:id", (req, res) => {
    books_model_1.default.findByIdAndDelete(req.params.id, req.body, err => {
        if (err)
            res.status(500).send("Interne Error: " + err);
        else
            console.log("Delete Successful");
    });
});
/* Requete HTTP GET Pagination: http://localhost:8282/pbooks?page=p&size=1*/
app.get("/pbooks", (req, res) => {
    let p = parseInt(String(req.query.page || 1));
    let size = parseInt(String(req.query.size || 1));
    books_model_1.default.paginate({}, { page: p, limit: size }, (err, books) => {
        if (err)
            res.status(500).send("Interne Error: " + err);
        else
            res.send(books);
    });
});
/* Requete HTTP GET Search: http://localhost:8282/pbooks?kw=page&size=1*/
app.get("/books-search", (req, res) => {
    let p = parseInt(String(req.query.page || 1));
    let size = parseInt(String(req.query.size || 1));
    let kw = (String(req.query.kw || ""));
    books_model_1.default.paginate({ title: { $regex: ".*(?i)" + kw + ".*" } }, { page: p, limit: size }, (err, books) => {
        if (err)
            res.status(500).send("Interne Error: " + err);
        else
            res.send(books);
    });
});
app.listen(8282, () => {
    console.log("Server NodeJS Started!!");
});
