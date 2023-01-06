import contentful from "contentful";
import { createClient } from "contentful";
// Create client and export it for use

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
});

export const getContentfulEntries = async (contentType: string) => {
  const entries = await client.getEntries({
    content_type: contentType,
  });
  return entries;
};
