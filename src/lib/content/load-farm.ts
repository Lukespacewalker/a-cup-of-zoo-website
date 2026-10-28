import type { ProductDto } from '@lukespace-cms/client';
import type { Locale } from '../i18n/locale';
import { listingGateway } from './listings';
import { runtimeConfig } from './runtime-config';

export async function loadFarmIndex(locale:Locale) {
  try {return {listings:await listingGateway(runtimeConfig()).list(locale),status:200};}
  catch {return {listings:[] as ProductDto[],status:503};}
}
export async function loadFarmListing(locale:Locale,slug:string) {
  try {
    const listing=await listingGateway(runtimeConfig()).get(locale,slug);
    return {listing,status:listing?.translations.some(t=>t.locale===locale)?200:404};
  } catch {return {listing:null,status:503};}
}
