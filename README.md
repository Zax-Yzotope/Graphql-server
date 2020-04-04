# Graphql-server

With this API we could query by GraphQL to database MySQL and Postgres.

Here, three examples of queries:

1 - Retrieving the address of the building, the beginning and the end of the intervention for a specific intervention.
Replace intervention id by the one of the specified intervention (intervention id is to string)


{
  intervention(id: "1"){
    id
    building{
      id
      building_name
      address{
        id
        num_street
        city
        postal_code
        country
      }
    }
    start_date
    end_date
  }
}


-------------------------------------------------------------------------------------
2 - etrieving customer information and the list of interventions that took place for a specific building
Replace building id by the one of the specified building


{
    building(id: 1){
        id
        customer{
            id
            company_name
        }
        interventions{
            id
        }
    }
}

-------------------------------------------------------------------------------------------------------------
3 - Retrieval of all interventions carried out by a specified employee with the buildings associated with these interventions including the details (Table BuildingDetails) associated with these buildings.
Replace employee id by the one of the specified employee



{
    employee(id: 1){
        id
    	name
    	firstName
        interventions{
            id
            building{
                id
                building_name
                buildingdetails{
                    key
                    value
                }
            }
        }
    }
}
