const { buildSchema } = require('graphql');
module.exports = buildSchema(` 
 type Post{
     id:ID !
     title:String!
     content:String!
     image:String!
     creator:User ! 
 }
 type User{
     id:ID!
     name:String!
     email:String!
     password: String!
     post:[Post!]!
 }
 input createPostInput {
title:String!
content:String! 
image: String! 
 
 }
 input createUserInput{
     name:String!
     email:String!
     password: String
 }

 type RootMutation{
    createPost(postInput:createPostInput) :Post!
    createUser(userInput:createUserInput) :User!
 }
 schema{
     mutation:RootMutation
 }
`);
