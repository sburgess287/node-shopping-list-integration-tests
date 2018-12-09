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
            .request(app)
            .get("/recipes")
            .then(function(res) {
                expect(res).to.have.status(200);
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
        const newItem = { name: "salsa", checked: false }; // what is checked: false for?
    });

});