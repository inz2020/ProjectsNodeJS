"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const books_model_1 = __importDefault(require("../model/books.model"));
//mongoose.set(' useUnifiedTopology', true);
const app = express_1.default();
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
app.get("/books", (req, res) => {
    books_model_1.default.find((err, books) => {
        if (err)
            res.status(500).send("Interne Error: " + err);
        else
            res.send(books);
    });
});
app.listen(8282, () => {
    console.log("Server NodeJS Started!!");
});
