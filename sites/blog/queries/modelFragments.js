import fieldFragments from "./fieldFragments";

const modelFragments = {
  placeholderContent: `
  items {
    system {
      content_type_uid
      locale
    }
    url
    title
    value_1
    value_2
    value_3
    description {
      ${fieldFragments.richText}
    }
    banner_imageConnection {
      ${fieldFragments.image}
    }
    related_contentConnection {
      edges {
        node {
          ... on PlaceholderContent2 {
            title
            url
            banner_imageConnection {
              ${fieldFragments.image}
            }
            description {
              ${fieldFragments.richText}
            }
            value_1
            value_3
            value_2
          }
        }
      }
    }
  }
  `,
  placeholderContent2: `
  items {
    system {
      content_type_uid
      locale
    }
    url
    title
    value_1
    value_2
    value_3
    description {
      ${fieldFragments.richText}
    }
    banner_imageConnection {
      ${fieldFragments.image}
    }
  }
  `,
};

export default modelFragments;
