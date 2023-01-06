import { strict as assert } from "assert";
import { EnvironmentGetter } from "contentful-typescript-codegen";
import { createClient } from "contentful-management";

// This file generates typescript interfaces for all contentful assets
// contentful-typescript-codegen is the package

const {
  CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT,
} = process.env;

const getContentfulEnvironment: EnvironmentGetter = () => {
  const contentfulClient = createClient({
    accessToken: CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN as string,
  });

  return contentfulClient
    .getSpace(CONTENTFUL_SPACE_ID as string)
    .then((space) => space.getEnvironment(CONTENTFUL_ENVIRONMENT as string));
};

module.exports = getContentfulEnvironment;
