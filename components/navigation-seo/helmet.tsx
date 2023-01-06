import Head from "next/head";

function Helmet({ title }: { title: string }) {
  return (
    <Head>
      <title>James Ide | {title}</title>
      <meta name="description" content="James Ide's website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
export default Helmet;
