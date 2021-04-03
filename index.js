const {ApolloServer, gql} = require('apollo-server')
const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')
require('dotenv').config();
const mongoose = require('mongoose');

// Next Steps
// 1. setup & connect mongoDB
// 2. modularize code

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cb67g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
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

// ----------------------------- GraphQl Schema
const typeDefs = gql`
  type Product {
    id: ID
    name: String
    price: Float
    img: String
  }
  type Query {
    product(id: ID): Product
    products: [Product]
  }
  input ProductInput {
    id: ID
    name: String
    rating: Float
    img: String
  }
  type Mutation {
    addProduct(product: ProductInput): [Product]
  }
`;


// ---------------------------------- Resolvers (Query Responders)
const resolvers = {
  Query: {
    products: async () => {
      try{
        const allProducts = await Product.find();
        return allProducts;
      } catch(err){
        console.log('err', err);
        return[]
      }
    },
    product: async (obj, args, context, info) => {
      try{
        const foundProduct = await Product.findById(args.id)
        return foundProduct
      }catch(err){
        console.log('err', err);
        return {}
      }
    }
  },
  Mutation: {
    addProduct: async (obj, {product}, context, info) => {
      try {
        await Product.create({
          ...product
        })
        const allProducts = await Product.find();
        return allProducts
      }catch(err){
        console.log('error', err);
      }
    }
  }
}




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