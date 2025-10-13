export interface AssetSubset {
  fileName: string;
  contentfulUrl: string;
}

export interface CollectionSubset {
  slug: string;
  baseType: string;
  assets: AssetSubset[];
}
