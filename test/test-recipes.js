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
    })

});