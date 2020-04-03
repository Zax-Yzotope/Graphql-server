const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const schema = require('./schema');
// const pg = require('pg');

const mysql = require('mysql');

// var con = mysql.createConnection({
//     host: "localhost",
//     port: "3306",
//     user: "jeunex",
//     password: "password",
//     database: "Application_Development"
// });

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("mysql connected... je pense");
//     console.log(con.config.database)
    
// });

// connexion to PG
// var conpg = pg.createConnection({
//     host: "localhost",
//     port: "5432",
//     user: "postgres",
//     password: "patate",
//     database: "datawarehouse"

// });

// conpg.connect(function(err) {
//     if (err) throw err;
//     console.log("pg connected, PATATE!");
//     // console.log(con.config.database)
    
// });

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,

}));

app.listen(4000,() => {
    console.log("It is listenning, patate!")
})