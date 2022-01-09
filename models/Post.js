const { Model, DataTypes } = require('sequelize'); //from sequelize package
const sequelize = require('../config/connection'); //MySQL connection

//create Post model
class Post extends Model {}

//create fields/columns for Post model
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //at least 1 character long
                len: [1]
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: { //this is how we show who posted it
                model: 'user', //the other model we reference
                key: 'id' //the primary key from the other model
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;