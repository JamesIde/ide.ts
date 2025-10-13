import { Asset, Entry } from "contentful";
import { IPhotoCollection, IThumbnail } from "../../@types/generated/contentful";
import { AssetSubset, CollectionSubset } from "./models/models";
import * as dotenv from "dotenv";
import { downloadFromContentful, getContentfulEntries } from "./utils/contentful.js";
import { extractMultidayTripCollectionSubset } from "./utils/data-extract.js";
import { checkExistsCDN, uploadImageCDN } from "./utils/cdn-api";
dotenv.config();

export async function sync() {
  console.log("Contentful and R2 image sync starting");
  // var photoCollections = await getContentfulEntries<IPhotoCollection[]>("photoCollection");
  // console.log(`Found ${photoCollections.items.length} collections`);
  // photoCollections.items.forEach((collection) => {
  //   var extractedData = extractCollectionSubset(collection);
  //   console.log(extractedData);
  // });

  var multidayTrips = await getContentfulEntries<IThumbnail[]>("thumbnail");

  for (const trip of multidayTrips.items) {
    const content = extractMultidayTripCollectionSubset(trip);
    await processAssets(content);
    console.log(`Finished processing ${content.slug}`);
  }
  console.log("Contentful and R2 image sync finished");
}

async function processAssets(collection: CollectionSubset) {
  console.log(`Begin process for ${collection.slug}`);
  var cdnExistResponses = await checkExistsCDN(collection);
  var missingImages = mapResults(collection, cdnExistResponses);

  if (missingImages.length == 0) {
    console.log(`No new images to upload to R2 for collection ${collection.slug}`);
    return;
  }

  console.log(`Found ${missingImages.length} images to upload to R2 for collection ${collection.slug}`);

  // Filter the original collections list by the list of files we know do not exist in R2
  const filesToDownload: CollectionSubset = {
    ...collection,
    assets: collection.assets.filter((asset) => missingImages.find((l) => l.image.fileName == asset.fileName)),
  };

  var contentfulImageResponses = await downloadFromContentful(filesToDownload);
  await uploadImageCDN(`${collection.baseType}/${collection.slug}`, contentfulImageResponses);
}

function mapResults(collection: CollectionSubset, responses: Response[]) {
  return responses
    .map((response, index) => ({
      image: collection.assets[index],
      exists: response.ok,
    }))
    .filter((r) => !r.exists);
}
