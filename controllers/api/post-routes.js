const sequelize = require('../../config/connection'); //to use a special thing
const router = require('express').Router();
//we get user and post both bc we need info about User as well
//with the foreign key, user_id, can form a JOIN
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all users' posts
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
        attributes: [//choose what we want
            'id',
            'post_content',
            'title',
            'created_at'
        ], 
        order: [['created_at', 'DESC']], //order by newest created
        include: [ //JOINing
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
                model: User, //referring to User model
                attributes: ['username'] //from the User model
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//get a single post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: { //set the value of id using req.params.id
            id: req.params.id
        },
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
        if (!dbPostData) {
            res.status(404).json({message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//create a post
router.post('/', withAuth, (req, res) => {
    //expects {title: 'Post Title', post_content: 'my post lalala', user_id: 1(any integer)}
    Post.create({ //req.body is the request from the user and has these properties
        //req.body populates the post table
        title: req.body.title,
        post_content: req.body.post_content,
        // /api/posts endpoint requires user ID from the currecnt session:
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//update a post title
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title,
            post_content: req.body.post_content
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//delete a post
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;