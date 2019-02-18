const express = require('express');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./blog-model');

const jsonParser = bodyParser.json();

const app = express();

BlogPosts.create(
    'My first post',
    'My first post is just a hello how are you, welcome to this blog type of deal. I won\'t bore you with too much talk',
    'Mahmoud',
    '2019-02-16'
);

BlogPosts.create(
    'Good night world',
    'It is time to go to sleep. I hope you are enjoying my blog',
    'Mahmoud',
    '2019-02-17'
)

app.get('/blog-posts', (req, res) => {
    res.json(BlogPosts.get());
  });

app.post('/blog-posts', jsonParser, (req,res) => {
    const requiredFields = ['title','content','author','publishDate'];
    for(let i = 0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
        
    }
    const post = BlogPosts.create(req.body.title,req.body.content,req.body.author,req.body.publishDate);
        res.status(201).json(post);
})

app.delete('/blog-posts/:id',(req,res)=>{
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post\`${req.params.ID}\``);
  res.status(204).end();
})

app.put('/blog-posts/:id',jsonParser,(req,res) =>{
    const requiredFields = ['title','content','author','publishDate'];
    for(let i = 0 ; i < requiredFields.length; i++){
      const field = requiredFields[i];
      if(!(field in req.body)){
        const message = `Missing ${field} in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    if(req.params.id !== req.body.id){
      const message = `Request path id (${req.params.id}) and request body id(${req.body.id}) must match`;
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updagting Blog post ${req.params.id}`);
    BlogPosts.update({
      id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      publishDate: req.body.publishDate
    });
    res.status(204).end();
  })

  app.listen(process.env.PORT || 8080, () => {
      console.log(`app is listening on port ${process.env.PORT || 8080}`)
  })