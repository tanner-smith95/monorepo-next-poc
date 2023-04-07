import "../styles/globals.css";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client";

import fetch from "node-fetch";

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

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
