# ide.ts

View it here @ [jamesaide.com](https://jamesaide.com/)

A place to store hiking trips, photo collections and the occasional blog entry.

This is a re-write of my [original site in Gatsby](https://github.com/JamesIde/jamesaide.com) to NextJS with TypeScript. All content is served from Contentful and styled with TailwindCSS. Text is rendered using React-Markdown.

## techy resources

- [Contentful interface generator](https://github.com/intercom/contentful-typescript-codegen) to generate typings for the environment
- [iron-session](https://github.com/vvo/iron-session) for handling sessions which are cached in Redis
- [QStash](https://docs.upstash.com/qstash) for serverless message brokering. A pub/sub solution consumed by [ide.qstash.ts](https://github.com/JamesIde/ide.qstash.ts) for emails.

## original resources and inspiration

- Harmen Hoek's [travel itinerary](https://harmenhoek.com/) for inspiration to create, design and document my adventures.
- Jamie Barnes' [website](https://www.jamiebarnesoutdoors.co.uk/) for further design inspiration.
- Max Mitchell's [video](https://www.youtube.com/watch?v=m6vxzu95sOI) on building his website with Gatsby and using Contentful. This was my first exposure to the world of content management systems in a well-layed out video with a tangible result at the end.

## re: closing thoughts

original:: For a long time I have wanted to create a site capable of supporting the material (primarily images) I've gathered on my travels. Eventually, this cultivated itself as the website you see today. The challenge of building a website like this presented itself as an ample opportunity to use technologies that were previously unknown to me, and allow me to creatively express myself in a manner I have never done before. Ultimately, the content on this website is for myself to look back at the adventures I've been on, and for those who are interested in seeing what I've been up to.

2023:: Migrating the website to NextJS will ensure the website remains resilient and up to date with the latest development trends. I see NextJS as a timeless framework for building a combination of SSG, SSR and client-side rendered websites. This website be used for the foreseeable future to post primarily hiking trips, with a sprinkling of other content.
