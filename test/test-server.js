const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;
chai.use(chaiHttp);
describe("Blog Posts", function(){
    before(function(){
        return runServer();
    });
    after(function(){
        return closeServer();
    });

    it("should list posts on GET",function(){
        return chai
            .request(app)
            .get("/blog-posts")
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.at.least(1);
                expectedKeys = ["id","title","content","author","publishDate"];
                res.body.forEach(function(element){
                    expect(element).to.be.a("object");
                    expect(element).to.include.all.keys(expectedKeys);
                });

            });
    });

    it("should add a post on POST",function(){
        const newPost = {
            title : "Awsome post",
            content: "Definitely worth your time to read",
            author: "Mahmoud",
            publishDate: "2019-02-21"
        }

        return chai
            .request(app)
            .post("/blog-posts")
            .send(newPost)
            .then(function(res){
                expect(res).to.have.status(201);
                expect(res.body).to.be.a("object");
                expect(res.body).to.include.keys("id","title","content","author","publishDate");
                expect(res.body.id).to.not.equal(null);
                expect(res.body).to.deep.equal(
                    Object.assign(newPost,{id: res.body.id})
                );
            });
    });

    it("should update posts on PUT", function() {
        const updatePost = {
            title : "First post",
            content: "Definitely worth your time to read",
            author: "Mahmoud",
            publishDate: "2019-01-01" 
        }
        return (
          chai
            .request(app)
            .get("/blog-posts")
            .then(function(res) {
              updatePost.id = res.body[0].id;
              return chai
                .request(app)
                .put(`/blog-posts/${res.body[0].id}`)
                .send(updatePost);
            })
                .then(function(res) {
                    expect(res).to.have.status(204);
                    //expect(res).to.be.json;
                    //expect(res.body).to.be.a("object");
                    //expect(res.body).to.deep.equal(updatePost);
                })
            );
      });

      it("should delete posts on DELETE", function() {
        return (
          chai.request(app).get("/blog-posts").then(function(res) {
              return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
          })
            .then(function(res) {
                expect(res).to.have.status(204);
            })
        );
      });

});