const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const graphqlResolver = require('./graphql/resolver');
const graphqlSchema = require('./graphql/schema');
const app = express();

app.use(bodyParser.json());
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(error) {
      if (!error.originalError) {
        return error;
      }
      const data = error.originalError.data;
      const message = error.originalError.message || 'An error occured ';
      const statusCode = error.originalError.code || 500;
      return { message: message, data: data, statusCode: statusCode };
    },
  })
);
app.use((error, req, res, next) => {
  console.log(error);
  const data = error.data;
  const message = error.message;
  const statusCode = error.statusCode;
});

mongoose
  .connect(
    'mongodb+srv://oluwatomisin:oluwatomisin@cluster0.uleg2xa.mongodb.net/?retryWrites=true&w=majority'
  )
  .then((result) => {
    app.listen(8000);
    console.log('connected!!');
  })
  .catch((error) => {
    console.log(error);
  });
