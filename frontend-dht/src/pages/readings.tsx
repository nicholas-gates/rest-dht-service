import Head from 'next/head'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import styles from '../styles/Home.module.css'

// create an interface for reading data
interface ReadingProps {
  _id: string;
  tempFahr: number;
  tempCel: number;
  humidity: number;
  modifiedAt: string;
  createdAt: string;
}

interface ReadingsProps {
  readings: ReadingProps[];
}

export default function Home({ readings }: ReadingsProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>DHT Readings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>DHT Readings</h1>

        <p className={styles.description}>
          <a href="https://www.spacex.com/launches/">DHT Readings</a>
        </p>

        <div className={styles.grid}>
          {readings.map((reading) => {
            return (
              <ul>
                <li>TempFahr: {reading.tempFahr}</li>
                <li>TempCel: {reading.tempCel}</li>
                <li>Humidity: {reading.humidity}</li>
                <li>Modified At: {reading.modifiedAt}</li>
                <li>Created At: {reading.createdAt}</li>
              </ul>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://graphql.us.fauna.com/graphql',
    cache: new InMemoryCache(),
    credentials: 'include',
    headers: {
      authorization: 'Bearer ',
    }
  });

  const { data } = await client.query({
    query: gql`
      query {
        getDhtReadingsByTimeRange(startTs: "2021-03-19T00:01:24.697092Z", endTs: "2021-06-30T00:01:24.697092Z") {
          _id
          tempFahr
          tempCel
          humidity
          modifiedAt
          createdAt
        }
      }
    `
  });

  console.log(data);
  return {
    props: {
      readings: data.getDhtReadingsByTimeRange
    }
  }
}