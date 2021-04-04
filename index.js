const {ApolloServer} = require('apollo-server')
const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')
require('dotenv').config();
const mongoose = require('mongoose');

const {typeDefs, resolvers} = require('./gql');



mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vkt8n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;


// --------------------------------- mongo schema
const mongoProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  img: String
});
// ------ mongo model
const Product = mongoose.model('Product', mongoProductSchema);

// ---------------------------------- Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({req}) => {
    const fakeUser = {
      userId: "helloImFakeUser"
    };
    return {
      ...fakeUser
    }
  }
});

db.on('error', console.error.bind(console.error, 'connection error:'));
db.once('open', function () {
  console.log('MongoDB connected!')
  server.listen({
    port: process.env.PORT || 4000
  }).then(({url}) => { console.log(`Server running on ${url}`)})  
})