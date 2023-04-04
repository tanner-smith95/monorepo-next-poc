import contentstack from "@contentstack/management";
import https from "https";
import dotenv from "dotenv";
import { readFile } from "fs/promises";

dotenv.config();

async function deletePlaceholders() {
  const contentType = "placeholder_content";

  const entryUids = JSON.parse(
    await readFile(new URL("../uids.json", import.meta.url))
  );

  let pause = false;

  let promises = [];

  const contentstackClient = contentstack.client();

  const branch = process.env.CONTENTSTACK_BRANCH || "main";

  const stack = contentstackClient.stack({
    api_key: process.env.CONTENTSTACK_API_KEY,
    management_token: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
    branch_uid: branch,
  });

  for (let i = 0; i < entryUids.length; i += 1) {
    if (pause) {
      console.log(
        "\n*****************************\nWaiting...\n*****************************\n"
      );
      await new Promise((resolve) => setTimeout(resolve, 1100));
      pause = false;
    }

    promises.push(
      new Promise(async (resolve, reject) => {
        let entryUid = entryUids[i];

        try {
          if (entryUid) {
            let options = {
              hostname: "api.contentstack.io",
              path: `/v3/content_types/${contentType}/entries/${entryUid}?delete_all_localized=true`,
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                api_key: process.env.CONTENTSTACK_API_KEY,
                authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
                branch: branch,
              },
            };

            let req = https.request(options, (res) => {
              res.on("data", (d) => {
                process.stdout.write(d);
              });

              console.log(`Entry Deleted: ${entryUid}`);
              resolve(true);
            });

            req.on("error", (e) => {
              console.error(e);
              reject(e);
            });

            req.write("");
            req.end();
          }
        } catch (error) {
          console.log(`TEST Failed at entry ${i}`);

          console.log(error?.errorMessage);
          console.log(error?.errors);
          reject(error);
        }
      })
    );

    if (promises.length >= 5) {
      await Promise.all(promises);

      pause = true;

      promises = [];
    }
  }
}

deletePlaceholders();
