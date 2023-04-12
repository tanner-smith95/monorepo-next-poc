import { GetStaticProps } from "next";
// import queryData from "../utils/contentstack/queryData";
import queryData from "../utils/apollo/queryData";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  Pagination,
  HitsPerPage,
} from "react-instantsearch-hooks-web";
import algoliasearch from "algoliasearch";

import modelFragments from "../queries/modelFragments";

export default function Home({ data }) {
  // Algolia Search

  // Connect and authenticate with your Algolia app
  const client = algoliasearch(
    "68W8EJJMF6",
    "b3f926665b7c661823175ee0440e6f6f"
  );

  const HitComponent = ({ hit }) => {
    return hit ? (
      <div>
        <hr />
        {hit?.title && (
          <h2>
            <Highlight attribute="title" hit={hit} />
          </h2>
        )}
        {hit?.value_1 && (
          <div>
            <Highlight attribute="value_1" hit={hit} />
          </div>
        )}
        {hit?.value_2 && (
          <div>
            <Highlight attribute="value_2" hit={hit} />
          </div>
        )}
        {hit?.value_3 && (
          <div>
            <Highlight attribute="value_3" hit={hit} />
          </div>
        )}
      </div>
    ) : null;
  };
  return (
    <>
      <h1>Contentstack GraphQL POC</h1>
      <h2>Collections</h2>
      {Object.keys(data).map((key, index) => (
        <pre key={`obj-${key}-${index}`}>
          {key}: {JSON.stringify(data[key]?.items?.length, null, 2)}
        </pre>
      ))}
      <h2>Payload</h2>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <pre>{JSON.stringify(data?.englishPlaceholders?.english, null, 2)}</pre>
      <pre>{JSON.stringify(data?.frenchPlaceholders?.english, null, 2)}</pre>
      <pre>{JSON.stringify(data?.spanishPlaceholders?.english, null, 2)}</pre>
      <pre>{JSON.stringify(data?.germanPlaceholders?.english, null, 2)}</pre>
      <pre>{JSON.stringify(data?.Placeholder2English?.english, null, 2)}</pre>
      <pre>{JSON.stringify(data?.Placeholder2French?.english, null, 2)}</pre>

      <InstantSearch indexName="test_index" searchClient={client}>
        <SearchBox />

        <HitsPerPage
          items={[
            { label: "8 hits per page", value: 8, default: true },
            { label: "16 hits per page", value: 16 },
          ]}
        />

        <Pagination />

        <Hits hitComponent={({ hit }) => <HitComponent hit={hit} />} />
      </InstantSearch>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const collectionLimit = 5;

  const response = await queryData(`
  query {
    englishPlaceholders: all_placeholder_content(limit: ${collectionLimit}, locale: "en-us") {
      ${modelFragments.placeholderContent}
    }
    frenchPlaceholders: all_placeholder_content(limit: ${collectionLimit}, locale: "fr") {
      ${modelFragments.placeholderContent}
    }
    spanishPlaceholders: all_placeholder_content(limit: ${collectionLimit}, locale: "es") {
      ${modelFragments.placeholderContent}
    }
    germanPlaceholders: all_placeholder_content(limit: ${collectionLimit}, locale: "de") {
      ${modelFragments.placeholderContent}
    }
    Placeholder2English: all_placeholder_content_2(limit: ${collectionLimit}, locale: "en-us") {
      ${modelFragments.placeholderContent2}
    }
    Placeholder2French: all_placeholder_content_2(limit: ${collectionLimit}, locale: "fr") {
      ${modelFragments.placeholderContent2}
    }
  }
`);

  // const queryArray = [
  //   {
  //     type: "englishPlaceholders: all_placeholder_content",
  //     params: {
  //       limit: 5,
  //       locale: "en-us",
  //     },
  //     query: "{ items { title system { uid locale } } }",
  //   },
  //   {
  //     type: "frenchPlaceholders: all_placeholder_content",
  //     params: {
  //       limit: 5,
  //       locale: "fr",
  //     },
  //     query: "{ items { title system { uid locale } } }",
  //   },
  //   {
  //     type: "spanishPlaceholders: all_placeholder_content",
  //     params: {
  //       limit: 5,
  //       locale: "es",
  //     },
  //     query: "{ items { title system { uid locale } } }",
  //   },
  //   {
  //     type: "germanPlaceholders: all_placeholder_content",
  //     params: {
  //       limit: 5,
  //       locale: "de",
  //     },
  //     query: "{ items { title system { uid locale } } }",
  //   },
  //   {
  //     type: "Placeholder2English: all_placeholder_content_2",
  //     params: {
  //       limit: 5,
  //       locale: "en-us",
  //     },
  //     query: "{ items { title system { uid locale } } }",
  //   },
  //   {
  //     type: "Placeholder2French: all_placeholder_content_2",
  //     params: {
  //       limit: 5,
  //       locale: "fr",
  //     },
  //     query: "{ items { title system { uid locale } } }",
  //   },
  // ];

  // const response = await queryData(queryArray);

  // *************************************************************************************
  // Generate a list of placeholder UIDs

  // const uids = [];

  // for (let i = 0; i < response.all_placeholder_content.items.length; i += 1) {
  //   const currentID =
  //     response?.all_placeholder_content?.items?.[i]?.system?.uid;

  //   if (currentID) {
  //     uids.push(currentID);
  //   }
  // }

  // const fs = require("fs");

  // fs.writeFile("uids.json", JSON.stringify(uids, null, 2), (err) => {
  //   if (err) console.log(err);
  // });

  // console.log(uids);

  // *************************************************************************************
  // Generate Algolia Index

  // const collectionQuery = `
  // {
  //   items {
  //     system {
  //       content_type_uid
  //     }
  //     title
  //     value_1
  //     value_2
  //     value_3
  //   }
  // }
  // `;

  // const collectionConfig = [
  //   {
  //     type: "all_placeholder_content",
  //     params: {
  //       limit: 0,
  //       locale: "en-us",
  //     },
  //     query: collectionQuery,
  //   },
  // ];

  // const collection = await queryData(collectionConfig);

  // console.log(collection);

  // const arraySlice = collection.all_placeholder_content.items.slice(-100);

  // const fs = require("fs");

  // fs.writeFile(
  //   "algolia-index.json",
  //   JSON.stringify(arraySlice, null, 2),
  //   (err) => {
  //     if (err) console.log(err);
  //   }
  // );

  // console.log(arraySlice);

  return {
    props: {
      data: response?.data || "NOT FOUND",
    },
  };
};
