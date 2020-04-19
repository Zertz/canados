import Head from "next/head";
import "multirange/multirange.css";
import "../styles.css";

export default function Canados({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>
          Interactive map of tornados in Canada and the United States
        </title>
        <link
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌪️</text></svg>"
          rel="icon"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
