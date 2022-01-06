import "multirange/multirange.css";
import Head from "next/head";
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
        <link
          crossOrigin=""
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
