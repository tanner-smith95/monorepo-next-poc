import {
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink,
  from,
} from "@apollo/client";

let fetch = require("node-fetch");

const link = new HttpLink({
  uri: `https://graphql.contentstack.com/stacks/${process.env.CONTENTSTACK_API_KEY}?environment=${process.env.CONTENTSTACK_ENVIRONMENT}`,
  headers: {
    access_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,
    branch: process.env.CONTENTSTACK_BRANCH || "main",
  },
  fetch,
});

const client = new ApolloClient({
  link: from([link]),
  cache: new InMemoryCache(),
});

async function queryData(query) {
  const response = await client.query({
    query: gql`
      ${query}
    `,
  });

  return response;
}

export default queryData;
