import express,{Response, Request} from "express";
import mongoose from "mongoose";
import Book from "./model/books.model";
import bodyparser from "body-parser";
import  cors from "cors";


mongoose.set('useFindAndModify', false);

const app= express();
app.use(bodyparser.json());
app.use(cors());

app.get("/", (req, res)=>{
    res.send("Hello world");
});
//Connection à la BD
const uri= "mongodb://localhost:27017/LibrairyBooks";
mongoose.connect(uri,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err)=>{
    if (err) console.log("Connection Error: "+ err);
    else console.log("Connection successed!!");
});
/* Requete  HTTP get */
app.get("/books", (req:Request, res:Response)=>{
    Book.find((err, books)=>{
        if(err) res.status(500).send("Interne Error: "+ err);
        else res.send(books);
    });
   /* Book.find((err, books)=>{
        if(err) res.status(500).send("Interne Error: "+ err);
        else res.send(books);
    });*/

});
/* Requette HTTP POST*/
app.post("/books",(req:Request, res:Response )=>{
    let book= new Book(req.body);
    book.save((err) =>{
        if (err) res.status(500).send(err);
        else res.send(book);
    });
});
app.get("/books/:id", (req:Request, res:Response)=>{
    // @ts-ignore
    Book.findById(req.params.id,req.body, (book, err)=>{
        if(err) res.status(500).send("Interne Error: "+ err);
        else res.send(book);
    });

});
/* Requette HTTP PUT*/
app.put("/books/:id", (req:Request, res:Response)=>{
    Book.findByIdAndUpdate(req.params.id,req.body,(err, book)=>{
        if(err) res.status(500).send("Interne Error: "+ err);
        else res.send(book);
    });

});
/* Requete HTTP Delete*/
app.delete("/books/:id", (req:Request,res:Response)=>{
    Book.findByIdAndDelete(req.params.id,req.body, err=> {
        if (err) res.status(500).send("Interne Error: " + err);
        else console.log("Delete Successful");
    });

});

/* Requete HTTP GET Pagination: http://localhost:8282/pbooks?page=p&size=1*/

app.get("/pbooks", (req:Request, res:Response)=>{
    let p:number= parseInt(String(req.query.page || 1 ));
    let size: number= parseInt(String(req.query.size || 1));

    Book.paginate({}, {page:p, limit:size},
    (err, books)=>{
        if (err) res.status(500).send("Interne Error: "+ err);
        else res.send(books);

    });

});

/* Requete HTTP GET Search: http://localhost:8282/pbooks?kw=page&size=1*/

app.get("/books-search", (req, res)=>{
    let p:number= parseInt(String(req.query.page || 1) );
    let size: number= parseInt(String(req.query.size || 1));
    let kw: string= (String(req.query.kw || ""));

    Book.paginate({title: {$regex:".*(?i)"+kw+".*"}}, {page:p, limit:size},
        (err, books)=>{
            if (err) res.status(500).send("Interne Error: "+ err);
            else res.send(books);

        });

});



app.listen(8282, ()=>{
    console.log("Server NodeJS Started!!");
})