const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

let server;

describe('recipes', function() {


    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('should list recipes on GET', function() {
      return chai.request(app)
        .get('/recipes')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
  
          expect(res.body.length).to.be.at.least(1);

          const expectedKeys = ['id','name', 'ingredients'];
          res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys(expectedKeys);
          });
        });
    });
});

it('should add a recipe on POST', function() {
    const newItem = {name: 'coffee', ingredients: ['coffee beans']};
    return chai.request(app)
      .post('/recipes')
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201);
    })
      .catch(function(err) {
      console.log('error making post', err);
    });
});

it('should update recipes on PUT', function() {
    const updateData = {
      name: 'foo',
      ingredients: 'bar'
    };
    return chai.request(app)
      // first have to get so we have an idea of object to update
      .get('/recipes')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/recipes/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        expect(res).to.have.status(204);
        expect(res).to.be.json;
      })
      .catch(function(err) {
        console.log('you have a put method error', err);
      })

});

it('should delete recipes on DELETE', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
    })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
});