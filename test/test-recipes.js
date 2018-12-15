const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

// this lets us use *expect* style syntax in our tests
const expect = chai.expect;

// Code to allow us to use HTTP requests 
chai.use(chaiHttp);

describe("Recipes", function(){
    // RunServer to start server for the tests
    // Return promise to ensure server is running before tests
    before(function() {
        return runServer();
    })

    // Close/stop server after tests complete to avoid errors 
    // if other tests are run 
    after(function() {
        return closeServer();
    });

    // Test Strategy:
    // 1. Make requests to `/recipes`
    // 2. Inspect response object for code and keys

    // Test GET endpoint
    it("should list recipe items on GET", function() {
        return chai
            .request(app) // pass in app
            .get("/recipes") // pass in endpoint
            .then(function luna (res) { // pass in the function, then accept the request
                expect(res).to.have.status(200); // pass req into expect
                expect(res).to.be.json;
                expect(res.body).to.be.a("array");

                // 2 recipes return on app load
                expect(res.body.length).to.be.at.least(1);

                // set expected keys
                const expectedKeys = ["name", "id", "ingredients"];

                // each item is object with key/value pairs
                res.body.forEach(function(item){
                    expect(item).to.be.a("object");
                    expect(item).to.include.keys(expectedKeys);

                });
            });
    });

    // Test POST endpoint
    // Test Strategy: 
    //  1. Make POST request with data for new item
    //  2. Inspect response object and prove it has 
    //      correct status code and returned object has "id"
    it("should add a recipe item on POST", function() {
        const newItem = { name: "salsa", ingredients : ["tomato", "garlic", "habenero"]};
        return chai
            .request(app)
            .post("/recipes")
            .send(newItem)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.include.keys("id", "name", "ingredients");
                expect(res.body.id).to.not.equal(null);
                // response deep equal new item above if assigned `id`
                expect(res.body).to.eql(
                    Object.assign(newItem, { id: res.body.id })
                );
            });
    
    });


    // Test DELETE endpoint
    // Test strategy
    //  1: GET shopping list items to get ID of one
    //  2: Delete item and ensure we get back 204
    it("should delete recipe item on DELETE", function(){
        return (
            chai
                .request(app)
                // Get the shopping list and id of an item
                .get("/recipes")
                .then(function(res) {
                    return chai.request(app).delete(`/recipes/${res.body[0].id}`);
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                })
        );
    });

    // Test PUT endpoint to update a recipe
    // Test Strategy
    //  1: initialize data
    //  2: make GET request to get id of item to update
    //  3: add id to `updateData`
    //  4: Make PUT request with `updateData`
    //  5. Inspect response object for status code and key/values
    it("should update recipe items on PUT", function() {
        const updateData = {
            name: "hummus", 
            ingredients: ["garbanzo beans", "lemon", "garlic"]
        };

        return(
            chai    
                .request(app)
                // get object to update
                .get("/recipes")
                // get the id in the response object
                .then(function(res) {
                    updateData.id = res.body[0].id;
                    return chai
                        .request(app)
                        .put(`/recipes/${updateData.id}`)
                        .send(updateData);
                })
            // Prove Put request has correct status code and updated item(?)
            .then(function(res) {
                expect(res).to.have.status(204);
                expect(res.body).to.be.a("object");
              // Get?
            })      
        );
    });

});