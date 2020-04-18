import Head from "next/head";
import "multirange/multirange.css";
import "../styles.css";

export default function Canados({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>
          🌪️ Interactive map of tornados in Canada and the United States
        </title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
