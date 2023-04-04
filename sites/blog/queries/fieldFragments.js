const fieldFragments = {
  image: `
    edges {
      node {
        url
        title
        description
        dimension {
          height
          width
        }
        filename
      }
    }
  `,
  richText: `
    json
  `,
};

export default fieldFragments;
