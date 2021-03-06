const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');
const withAuth = require('../utils/auth');

//get the dashboard
router.get('/', withAuth, (req, res) => { //that's where the qt withAuth goes
   Post.findAll({
       where: {
           //use ID from the session
           user_id: req.session.user_id
       },
       attributes: [
           'id',
           'post_content',
           'title',
           'created_at'
       ],
       include: [
           {
               model: Comment,
               attributes: ['id','comment_text','post_id','user_id','created_at'],
               include: {
                   model: User,
                   attributes: ['username']
               }
           },
           {
               model: User,
               attributes: ['username']
           }
       ]
   })
   .then(dbPostData => {
       //serialize data before passing to template
       const posts = dbPostData.map(post => post.get({plain: true}));
       res.render('dashboard', {posts, loggedIn:true});
   })
   .catch(err => {
       console.log(err);
       res.status(500).json(err);
   });
  });

  //edit a post
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {id: req.params.id},
        attributes: [
            'id',
            'post_content',
            'title',
            'created_at'
        ],
        include: [
            //for getting comments:
            {
                model: Comment,
                attributes: ['id','comment_text','post_id','user_id','created_at'],
                include: { //comment model includes User model too so it can attach username to comment
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        //serialize it!
        const post = dbPostData.get({plain: true}); //just getting one here unlike above

        res.render('edit-post', {post, loggedIn:true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;