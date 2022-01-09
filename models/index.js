//this file holds all the models
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

//create associations
User.hasMany(Post, {
    foreignKey: 'user_id' //links the referenced id column from User to user_id in Post
});

Post.belongsTo(User, { //must make the reverse association too
    foreignKey: 'user_id' //links, and makes sure each post can have only one user associated
})

//comment stuff - we didnt need to specify comment as a through bc
//we don't need to access Post through Comment, we just want to see the user's
//comment and which post it was for
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

module.exports = {User, Post, Comment};