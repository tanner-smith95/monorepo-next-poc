async function queryData(queryArray) {
  // Init query values
  const env = process.env.CONTENTSTACK_ENVIRONMENT;
  const apiKey = process.env.CONTENTSTACK_API_KEY;
  const deliveryToken = process.env.CONTENTSTACK_DELIVERY_TOKEN;

  const collections = {};

  if (queryArray?.length && env && apiKey && deliveryToken) {
    // Loop through each query object in queryArray
    for (let i = 0; i < queryArray.length; i += 1) {
      const current = queryArray[i];
      let endPagination = false;
      let paginationCounter = 0;

      let entries = [];

      if (current?.type && current?.query) {
        const parsedType = current?.type?.split(":")?.[0]?.replace(/ /g, "");

        // While there are still entries to query, query pages 100 entries at a time
        while (!endPagination) {
          console.log(
            "Query Page --------------------",
            `Query Type: ${current?.type}`,
            "--",
            `Pagination Counter: ${paginationCounter}`
          );

          // Initialize the current page query parameters
          let params = {
            limit: 100,
            skip: paginationCounter,
            where: current?.params?.where || null,
            locale: current?.params?.locale || null,
          };

          // Check if pagnination needs to continue after the current page
          if (
            current?.params?.limit &&
            current.params.limit - paginationCounter <= 100
          ) {
            endPagination = true;
            params.limit = current.params.limit - paginationCounter;
          }

          // Fetch the current page of entries
          const res = await fetch(
            `https://graphql.contentstack.com/stacks/${apiKey}?environment=${env}&query=query{ ${
              current.type
            }(limit: ${params.limit}, skip: ${params.skip}${
              params?.where ? `, where: ${params.where}` : ""
            }${params?.locale ? `, locale: "${params?.locale}"` : ""}) ${
              current?.query
            }}`,
            {
              headers: {
                "Content-Type": "application/json",
                access_token: deliveryToken,
                branch: process.env.CONTENTSTACK_BRANCH || "main",
              },
            }
          )
            .then((response) => response.json())
            .then((data) => {
              // Update the counter and return the retrieved data if the fetch was successful
              paginationCounter += 100;
              return data?.data || null;
            });

          // If any entries were fetched for the current page, update the retrieved entries array
          if (res?.[parsedType]?.items?.length) {
            entries = entries.concat(res[parsedType].items);
          } else {
            // Otherwise, indicate all entries have been retrieved for the current query rule
            endPagination = true;
          }
        }

        // If any entries were retrieved successfully, update the payload object to contain the retrieved collection
        if (entries?.length) {
          collections[parsedType] = {
            items: entries,
          };
        }
      }
    }
  }

  // Return the querried data
  return collections;
}

export default queryData;
