import baseClient from "../../config/baseClient";
import { ViewCount } from "../../@types/ViewCount";

export async function updateRecordViewCount(contentfulId: string): Promise<ViewCount> {
  const res = await baseClient.post(`/api/records?contentfulId=${contentfulId}`);
  return res.data;
}
