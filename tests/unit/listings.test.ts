import {test,expect} from 'bun:test';
import {listingGateway,listingImage,listingPath,listingPrice} from '../../src/lib/content/listings';
import {ContentUnavailableError} from '../../src/lib/content/errors';

const config={environment:'production' as const,mode:'cms' as const,cmsBaseUrl:'https://cms.example.test'};
const respond=(body:unknown,status=200)=>(async()=>Response.json(body,{status})) as typeof fetch;
test('listing reads distinguish empty, missing and unavailable content',async()=>{
 expect(await listingGateway(config,respond({items:[]})).list('th')).toEqual([]);
 expect(await listingGateway(config,respond({},404)).get('en','missing')).toBeNull();
 await expect(listingGateway(config,respond({},503)).list('th')).rejects.toBeInstanceOf(ContentUnavailableError);
 await expect(listingGateway(config,respond({items:[{status:'draft'}]})).list('th')).rejects.toBeInstanceOf(ContentUnavailableError);
 await expect(listingGateway(config,respond(null)).list('th')).rejects.toBeInstanceOf(ContentUnavailableError);
});
test('listings keep zero price, satang precision, safe paths and safe image schemes',()=>{
 expect(listingPrice(null,'th')).toBe('สอบถามราคา');
 expect(listingPrice(0,'en')).toContain('0');
 expect(listingPrice(125050,'en')).toContain('1,250.50');
 expect(listingPath('en','a/b')).toBe('/en/farm/a%2Fb/');
 expect(listingImage('javascript:alert(1)')).toBeNull();
 expect(listingImage('https://cms.test/media/image.png')).toBe('https://cms.test/media/image.png');
});
