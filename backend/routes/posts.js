const express = require('express');
const multer = require('multer');
const router = express.Router();
const postModel = require('../models/post');

const MIME_TYPE_MAP = {  
  'image/png': 'png',  
  'image/jpeg': 'jpg',  
  'image/jpg': 'jpg'  
}; 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid Mime Type");
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', multer({storage: storage}).single('image'), (req, res, next) =>{
  const url = req.protocol + '://' + req.get('host');
  const post = new postModel({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
  })
  post.save().then(result => {
    res.status(201).json({  
      message: 'Post added successfully',
      post: {
        ...result,
        id: result._id,
      }
    });
  });
});

router.get('', (req, res, next) =>{  
  postModel.find()
  .then((documents) => {
    console.log(documents);
    res.status(200).json({
      message: 'Posts Fetched Successfully',
      posts: documents,
    });  
  });
});

router.get('/:id', (req, res, next) =>{  
  postModel.findById(req.params.id)
  .then((post) => {
    if (post)
      res.status(200).json(post);
    else
      res.status(404).json({message: 'Post not found?'});
  });
});

router.delete('/:id', (req, res, next) => {
  postModel.deleteOne({_id: req.params.id})
  .then(result => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted!"
    })
  })
});

router.put("/:id", (req, res, next) => {
  const post = new postModel({  
    _id: req.body.id,  
    title: req.body.title,  
    content: req.body.content  
  });
  postModel.updateOne({_id: req.params.id}, post)
  .then(result =>  {
    console.log(result);
    res.status(200).json({message: "Update Successful!"});
  });
})

module.exports = router;