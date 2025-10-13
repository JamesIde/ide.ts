import { Entry, Asset } from "contentful";
import { IPhotoCollection, IThumbnail } from "../../../@types/generated/contentful";
import { CollectionSubset, AssetSubset } from "../models/models";

/**
 * Extracts all assets and other metadata from a photo collection entry.
 * i.e. Overland Track, Road Tripping Tasmania
 */
export function extractPhotoCollectionSubset(item: Entry<IPhotoCollection[]>): CollectionSubset {
  return {
    slug: item.fields["slug"],
    baseType: "collections",
    assets: extractAssetSubset(item.fields["photos"]),
  };
}

/**
 * Extracts all assets and other metadata from a multi-day trip entry.
 * I.e. The Cathedral of Stone or Crown Jewel of South Australia
 */
export function extractMultidayTripCollectionSubset(item: Entry<IThumbnail[]>): CollectionSubset {
  return {
    slug: item.fields["slug"],
    baseType: "records",
    assets: extractMultidayTripAssets(item.fields as unknown as IThumbnail),
  };
}

/**
 * Iterates over a multi-day trip asset and extracts the assets from the individual image block.
 * Returns a single array of all assets found in the entry type.
 * Note: Supports up to 10 days worth of image blocks.
 */
function extractMultidayTripAssets(record: IThumbnail) {
  var assets: AssetSubset[][] = [];
  let dayIndex = 1;
  while (record?.[`day${getDayName(dayIndex)}Description`]) {
    assets.push(extractAssetSubset(record[`imageBlock${dayIndex}`]));
    dayIndex++;
  }
  return assets.flat();
}

const getDayName = (num: number): string => {
  // TODO - if a trip ever exceeds 10 days, this would need to be adjusted.
  // It's because of the original naming of the contentful assets we have to deal with this...
  // The contentful asset nodes don't start at 0 either - no dayZeroDescription.
  // TODO - if this changes, update [slug].tsx in records to accommodate for longer trips.
  const dayNames = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
  return dayNames[num] || num.toString();
};

/**
 * Extracts asset metadata from a Contentful asset type.
 * The type is consistent across all Contentful entry types (atleast in my workspace)
 */
export function extractAssetSubset(assetList: Asset[]): AssetSubset[] {
  var assets: AssetSubset[] = [];
  assetList.forEach((asset) => {
    assets.push({
      contentfulUrl: asset.fields.file.url,
      fileName: asset.fields.file.fileName,
    });
  });
  return assets;
}
