const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const schema = require('./schema');
// const pg = require('pg');

const mysql = require('mysql');


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,

}));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Our app is running on port");
});