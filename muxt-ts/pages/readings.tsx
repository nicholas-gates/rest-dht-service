import React, { useState } from "react";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from "@mui/material";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import MainLayout from "./layouts/MainLayout";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

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

export default function DHTTable({ readings }: ReadingsProps) {
  const [earliestDate, setEarliestDate] = useState(null);
  const [latestDate, setLatestDate] = useState(null);

  const handleEarliestDateChange = (date: any) => {
    setEarliestDate(date);
  };

  const handleLatestDateChange = (date: any) => {
    setLatestDate(date);
  };

  return (
    <MainLayout>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Temp (F)</TableCell>
            <TableCell>Temp (C)</TableCell>
            <TableCell>Humidity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {readings.map((reading) => (
            <TableRow key={reading._id}>
              <TableCell>{reading._id}</TableCell>
              <TableCell>{reading.tempFahr}</TableCell>
              <TableCell>{reading.tempCel}</TableCell>
              <TableCell>{reading.humidity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Earliest Date"
          value={earliestDate}
          onChange={handleEarliestDateChange}
        />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Latest Date"
          value={latestDate}
          onChange={handleLatestDateChange}
        />
      </LocalizationProvider>
    </MainLayout>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://graphql.us.fauna.com/graphql",
    cache: new InMemoryCache(),
    credentials: "include",
    headers: {
      authorization: `Bearer ${process.env.FAUNA_SECRET}`,
    },
  });

  const { data } = await client.query({
    query: gql`
      query {
        getDhtReadingsByTimeRange(
          startTs: "2021-03-19T00:01:24.697092Z"
          endTs: "2021-06-30T00:01:24.697092Z"
        ) {
          _id
          tempFahr
          tempCel
          humidity
          modifiedAt
          createdAt
        }
      }
    `,
  });

  console.log(data);
  return {
    props: {
      readings: data.getDhtReadingsByTimeRange,
    },
  };
}
