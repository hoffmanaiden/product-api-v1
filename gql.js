const {gql} = require('apollo-server')
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

module.exports = { typeDefs, resolvers}