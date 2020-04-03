const graphql = require('graphql');
const _ = require('lodash');
const mysql = require('mysql');
const { Client } = require('pg')

//################################################################################################################################//
//################################################################################################################################//

//========================= CONNEXION DATABASE POSTGRESQL =========================//
const client = new Client({
    host: "codeboxx-postgresql.cq6zrczewpu2.us-east-1.rds.amazonaws.com",
    port: "5432",
    database: "DavidAmyot",
    user: "codeboxx",
    password: "Codeboxx1!",
})
client.connect()

//========================= CONNEXION DATABASE MYSQL =========================//
var con = mysql.createConnection({
    host: "codeboxx.cq6zrczewpu2.us-east-1.rds.amazonaws.com",
    port:"3306",
    user: "codeboxx",
    password: "Codeboxx1!",
    database: "DavidAmyot",
});
con.connect(function(err) {
    // if (err) throw err;
    console.log("mysql connected... je pense");
    console.log(con.config.database)
});

// import graphQL type
const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLDateTime} = graphql;

//################################################################################################################################//
//################################################################################################################################//


//========================= PSQL =========================//
interventions = [];
client.query("SELECT * FROM factintervention", (err, res) => {
    for (i = 0; i < res.rows.length; i++) interventions.push(JSON.parse(JSON.stringify(res.rows[i])));
    // console.log(interventions)   
    client.end()
})

//========================= MYSQL =========================//
buildings = [];
con.query("SELECT * FROM buildings", (err, res) => {
    for (result of res) buildings.push(JSON.parse(JSON.stringify(result)));
    // console.log(buildings)   
})

buildingdetails = [];
con.query("SELECT * FROM building_details", (err, res) => {
    for (result of res) buildingdetails.push(JSON.parse(JSON.stringify(result)));
    // console.log(buildingdetails)   
})

addresses = [];
con.query("SELECT * FROM adresses", (err, res) => {
    for (result of res) addresses.push(JSON.parse(JSON.stringify(result)));
    // console.log(addresses)   
})

customers = [];
con.query("SELECT * FROM customers", (err, res) => {
    for (result of res) customers.push(JSON.parse(JSON.stringify(result)));
    // console.log(customers)   
})

employees = [];
con.query("SELECT * FROM employees", (err, res) => {
    for (result of res) employees.push(JSON.parse(JSON.stringify(result)));
    // console.log(employees)   
})



//========================= CREATING OBJECTS =========================//
const InterventionType = new GraphQLObjectType({
    name: 'intervention',
    fields: () =>({
        id: {type: GraphQLString},
        building_id: {type: GraphQLString},
        employee_id: {type: GraphQLString},
        start_date: {type: GraphQLString},
        end_date: {type: GraphQLString},
        building: {
            type: BuildingType,
            resolve(parent, args){
                return _.find(buildings, {id: parseInt(parent.building_id)})
            }
        },
        employee: {
            type: EmployeeType,
            resolve(parent, args){
                return _.find(employees, {id: parseInt(parent.employee_id)})
            }
        }
    })
})

const EmployeeType = new GraphQLObjectType({
    name: 'employee',
    fields: () =>({
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        firstName: {type: GraphQLString},  
        interventions:{
            type: new GraphQLList(InterventionType),
            resolve(parent, args){
                return _.filter(interventions, {employee_id: parent.id.toString(8)})
            }
        }
    })
})


const BuildingType = new GraphQLObjectType({
    name: 'building',
    fields: () =>({
        id: {type: GraphQLInt},
        building_name: {type: GraphQLString},
        adress_id: {type: GraphQLInt},
        customer_id: {type: GraphQLInt},
        address: {
            type: AddressType,
            resolve(parent, args){
                return _.find(addresses, {id: parent.adress_id})
            }
        },
        customer: {
            type: CustomerType,
            resolve(parent, args){
                return _.find(customers, {id: parent.customer_id})
            }
        },
        interventions:{
            type: new GraphQLList(InterventionType),
            resolve(parent, args){
                return _.filter(interventions, {building_id: parent.id.toString(8)})
            }
        },
        buildingdetails:{
            type: new GraphQLList(BuildingdetailType),
            resolve(parent, args){
                return _.filter(buildingdetails, {building_id: parent.id})
            }
        }
    })
})

const BuildingdetailType = new GraphQLObjectType({
    name: 'buildingdetail',
    fields: () =>({
        key: {type: GraphQLString},
        value: {type: GraphQLString},
        building_id: {type: GraphQLInt},
        building: {
            type: BuildingType,
            resolve(parent, args){
                return _.find(buildings, {id: parent.building_id})
            }
        }
       
    })
})

const AddressType = new GraphQLObjectType({
    name: 'address',
    fields: () =>({
        id: {type: GraphQLInt},
        num_street: {type: GraphQLString},
        suite: {type: GraphQLString},
        city: {type: GraphQLString},
        postal_code: {type: GraphQLString},
        country: {type: GraphQLString},
        customer_id: {type: GraphQLInt},
        // customer: {
        //     type: CustomerType,
        //     resolve(parent, args){
        //         return _.find(customers, {id: parent.customer_id})
        //     }
        // }

    })
})

const CustomerType = new GraphQLObjectType({
    name: 'customer',
    fields: () =>({
        id: {type: GraphQLInt},
        company_name: {type: GraphQLString},
        adress_id: {type: GraphQLInt},
        address: {
            type: AddressType,
            resolve(parent, args){
                return _.find(addresses, {id: parent.adress_id})
            }
        }

    })
})


//========================= CREATING QUERIES =========================//
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        building:{            
            type: BuildingType,
            args: {id:{type: GraphQLInt}},
            resolve(parent, args){
                return _.find(buildings, {id: args.id});
                           
            }
        },
        buildings: {
            type: new GraphQLList(BuildingType),
            resolve(parent, args){
                return buildings
            }
        },
        buildingdetail:{            
            type: BuildingdetailType,
            args: {id:{type: GraphQLInt}},
            resolve(parent, args){
                return _.find(buildingdetails, {id: args.id});
                           
            }
        },
        buildingdetails: {
            type: new GraphQLList(BuildingdetailType),
            resolve(parent, args){
                return buildingdetails
            }
        },
        address:{            
            type: AddressType,
            args: {id:{type: GraphQLInt}},
            resolve(parent, args){
                return _.find(addresses, {id: args.id});
                           
            }
        },
        addresses: {
            type: new GraphQLList(AddressType),
            resolve(parent, args){
                return addresses
            }
        },
        customer:{            
            type: CustomerType,
            args: {id:{type: GraphQLInt}},
            resolve(parent, args){
                return _.find(customers, {id: args.id});
                           
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parent, args){
                return customers
            }
        },
        intervention:{            
            type: InterventionType,
            args: {id:{type: GraphQLString}},
            resolve(parent, args){
                return _.find(interventions, {id: args.id});
            }
        },
        interventions: {
            type: new GraphQLList(InterventionType),
            resolve(parent, args){
                return interventions
            }
        },
        employee:{            
            type: EmployeeType,
            args: {id:{type: GraphQLInt}},
            resolve(parent, args){
                return _.find(employees, {id: args.id});
                           
            }
        },
        employees: {
            type: new GraphQLList(EmployeeType),
            resolve(parent, args){
                return employees
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})