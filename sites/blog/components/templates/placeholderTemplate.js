/* eslint-disable @next/next/no-img-element */
import { jsonToHtml } from "@contentstack/json-rte-serializer";
import parse from "html-react-parser";
import Link from "next/link";

const PlaceholderTemplate = ({ pageData }) => {
  return pageData ? (
    <>
      <h1>{pageData?.title}</h1>
      {pageData?.value_1 && <h2>Value 1: {pageData.value_1}</h2>}
      {pageData?.value_2 && <h2>Value 2: {pageData.value_2}</h2>}
      {pageData?.value_3 && <h2>Value 3: {pageData.value_3}</h2>}
      {pageData?.related_contentConnection?.edges?.[0]?.node?.url && (
        <h2>
          <Link
            href={`/placeholder-2/${pageData.related_contentConnection.edges[0].node.url}`}
          >
            Related Content:{" "}
            {pageData?.related_contentConnection?.edges?.[0]?.node?.title ||
              pageData.related_contentConnection.edges[0].node.url}
          </Link>
        </h2>
      )}
      {pageData?.banner_imageConnection?.edges?.[0]?.node?.url && (
        <img
          style={{ width: "100%" }}
          src={pageData.banner_imageConnection.edges[0].node.url}
          alt={pageData?.banner_imageConnection?.edges?.[0]?.node?.filename}
        />
      )}
      {pageData?.description?.json && (
        <div>{parse(jsonToHtml(pageData.description.json))}</div>
      )}
      <h2>Payload</h2>
      <pre>{JSON.stringify(pageData, null, 2)}</pre>
    </>
  ) : null;
};

export default PlaceholderTemplate;
