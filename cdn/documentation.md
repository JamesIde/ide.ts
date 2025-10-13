## cdn.jamesaide.com

Some notes on creating my own CDN for the website using Cloudflare Workers and R2 buckets.
There is also a script for migrating existing assets from Contentful into R2 and allowing them to remain in sync.
The flow is unidirectional with Contentful being the source of truth. Images are still embedded in assets, but they are served through the CDN instead of Contentfuls CDN.

### Cloudflare Worker CDN

This worker handles image requests serving them from the R2 bucket and
converting them to webp using the transformation functionality by the worker.
The response is then cached for 30 days.

#### Some notes on the implementation:

The documentation is slightly confusing regarding caching, serving data, and how to use Cloudflare Workers in general.
I had to move the domain over from Vercel to Cloudflare in order to put a custom domain (or route)
over the Cloudflare worker in order to take advantage of the caching.
The typescript types frequently run into issues with the existing fetch types hence the unfortunate use of 'any'
over the place.

#### A note on R2 Pricing:

The website will primarily fall into Class B operations as each user will be requesting the images when they visit the site. It's a little bit confusing so refer below for more information:

- [R2 Price Serving File Images](https://www.reddit.com/r/CloudFlare/comments/1ic51x1/r2_pricing_serving_filesimages_is_not_free/)
- [Vercel Pricing](https://vercel.com/docs/image-optimization/limits-and-pricing)

#### Additional Notes:

Despite following all of Vercel's image optimization guidelines and modifying my images (size, resolution, format) in Contentful, I have been frequently coming close to the free tier limit on Vercel for image cache reads (averaging about 60 - 75% total each month). If I were to expand
the website over the next decade (which I intend to), I would easily reach the maximum for the free tier and would have to upgrade to the pro plan costing me $30 USD a month.
Cloudflare R2 storage is not free, but it should cost me pennies in comparison to Vercel's paid tier if I ever exceed the 10 million Class B Operations per month.

#### TLDR:

- Free Vercel Tier: 300k month image cache reads (currently 60 - 75% used each month)
- Update to Vercel Paid Pro Plan would cost: 40c - 64c USD per 1M image cache reads plus $30 USD a month
- Moving to Cloudflare R2 Free Tier gives me : 10 million class b operations (equiv. to Vercel image cache reads) for free and up to

##### TODO:

- CORS
- Dynamic rendering of image formats by query params including formats

#### Additional Resources Used:

- [Cloudflare Cache API](https://developers.cloudflare.com/r2/examples/cache-api/)
- [Cloudflare Transform Images using Workers](https://developers.cloudflare.com/images/transform-images/transform-via-workers/)
- [Blog creating a CDN using Cloudflare Workers](https://transloadit.com/devtips/creating-a-free-image-cdn-with-cloudflare-r2/)

### Image Sync Between Contentful and R2 Bucket

TODO notes - goal is to move away from Contentful into Markdown. Use Contentful CDN as backup. Greater control over the quality of the images and they should be faster to serve than Contentful. Also get rid of Next Image not preloading all images when a user visits the site, meaning when they click to view an image in the modal it downloads it again.
