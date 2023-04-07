import contentstack from "@contentstack/management";
import getPlaceholder from "./getPlaceholder.js";
import https from "https";
import dotenv from "dotenv";

dotenv.config();

async function createPlaceholders() {
  const contentType = "placeholder_content";
  const numPlaceholders = 100000;
  const startIndex = 30323;

  let pause = false;

  let promises = [];

  const contentstackClient = contentstack.client();

  const branch = process.env.CONTENTSTACK_BRANCH || "main";

  const stack = contentstackClient.stack({
    api_key: process.env.CONTENTSTACK_API_KEY,
    management_token: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
    branch_uid: branch,
    fetchOptions: {
      retryDelay: 300, // in milliseconds
      maxRequests: 10,
      retryLimit: 30,
    },
  });

  console.log("************************\n", stack);

  for (let i = startIndex; i < numPlaceholders; i += 1) {
    try {
      if (pause) {
        console.log("\n*****************************\nWaiting...\n");
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log("Finished Waiting...\n*****************************\n");
        pause = false;
      }

      promises.push(
        new Promise(async (resolve, reject) => {
          const entry = getPlaceholder(i);

          let entryUid = null;
          let entryVersion = null;
          let entryTitle = null;

          console.log(`Started creaating placeholder ${i}\n`);
          try {
            if (entry) {
              await stack
                .contentType(contentType)
                .entry()
                .create({ entry })
                .then((result) => {
                  console.log(`Created placeholder ${i}\n`);
                  entryUid = result?.uid;
                  entryVersion = result?._version;
                  entryTitle = result?.title;
                });
            }

            if (entryUid && entryVersion) {
              let postData = JSON.stringify({
                entry: {
                  environments: ["prod"],
                },
                version: entryVersion,
              });

              let options = {
                hostname: "api.contentstack.io",
                path: `/v3/content_types/${contentType}/entries/${entryUid}/publish`,
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  api_key: process.env.CONTENTSTACK_API_KEY,
                  authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
                  branch: branch,
                },
              };

              console.log(`Started publishing entry ${i}\n`);
              let req = https.request(options, (res) => {
                res.on("data", (d) => {
                  process.stdout.write(d);
                });

                console.log(
                  `Entry Published: ${entryTitle} - UID: ${entryUid}\n`
                );
                resolve(true);
              });

              req.on("error", (e) => {
                console.error(e);
                reject(e);
              });

              req.write(postData);
              req.end();
            }
          } catch (error) {
            console.log(`TEST Failed at entry ${i}\n`);

            console.log(error);
            // reject(error);
          }
        })
      );

      if (promises.length >= 5) {
        await Promise.all(promises);

        pause = true;

        promises = [];
      }
    } catch (error) {
      console.log(`Outter Failed at entry ${i}\n`);

      console.log(error);
      // reject(error);

      pause = true;

      promises = [];
    }
  }
}

createPlaceholders();
