/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import queryData from "../../utils/contentstack/queryData";
import getPlaceholders from "../../collections/getPlaceholdes";
import modelFragments from "../../queries/modelFragments";
import PlaceholderTemplate from "../../components/templates/placeholderTemplate";

export default function Page({ data }) {
  return data?.all_placeholder_content_2?.items?.[0] ? (
    <PlaceholderTemplate
      pageData={data?.all_placeholder_content_2?.items?.[0]}
    />
  ) : null;
}

export async function getStaticPaths() {
  console.log(
    `getStaticPaths[...slug] ------------------------------------------------------------------------`
  );

  const response = await getPlaceholders(false);

  const slugs = [];

  // Build all alternate placeholder routes
  function getSlugs(currentUrl, currentLocale) {
    if (currentUrl) {
      slugs.push({
        params: { slug: currentUrl.split("/").concat([currentLocale]) },
      });
    }
  }

  for (let i = 0; i < response.placeholder2English.items.length; i += 1) {
    getSlugs(response?.placeholder2English?.items?.[i]?.url, "en-us");
  }

  for (let i = 0; i < response.placeholder2French.items.length; i += 1) {
    getSlugs(response?.placeholder2French?.items?.[i]?.url, "fr");
  }

  for (let i = 0; i < response.placeholder2Spanish.items.length; i += 1) {
    getSlugs(response?.placeholder2Spanish?.items?.[i]?.url, "es");
  }

  for (let i = 0; i < response.placeholder2German.items.length; i += 1) {
    getSlugs(response?.placeholder2German?.items?.[i]?.url, "de");
  }

  return {
    paths: slugs,
    fallback: false, // true, false, or 'blocking'
  };
}

export async function getStaticProps(context) {
  console.log(
    `getStaticProps[...slug] ------------------------------------------------------------------------`
  );

  const { params: { slug } = {} } = context ?? {};

  const locale = slug.pop();

  console.log("Page route:", slug.join("/"));

  const queryArray = [
    {
      type: "all_placeholder_content_2",
      params: {
        limit: 1,
        where: `{url: "${slug?.join("/")}"}`,
        locale: locale,
      },
      query: `{
        ${modelFragments?.placeholderContent2}
      }`,
    },
  ];

  const response = await queryData(queryArray);

  return {
    props: {
      data: response || "NO DATA",
    },
  };
}
