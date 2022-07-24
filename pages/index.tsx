import { InferGetStaticPropsType } from "next";
import { createContext } from "react";
import Home from "../components/Home";
import { fetchTornados } from "../data/fetchTornados";
import { arrayify } from "../utils/arrayify";

export const getStaticProps = async () => {
  const [ca, caNTP, us] = await Promise.all([
    fetchTornados("CA"),
    fetchTornados("CA-NTP"),
    fetchTornados("US"),
  ]);

  return {
    props: {
      data: arrayify(ca.concat(caNTP).concat(us)) as TupleTornado[],
    },
  };
};

export const DataContext = createContext<
  InferGetStaticPropsType<typeof getStaticProps>["data"] | undefined
>(undefined);

export default function HomePage({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <DataContext.Provider value={data}>
      <Home />
    </DataContext.Provider>
  );
}
