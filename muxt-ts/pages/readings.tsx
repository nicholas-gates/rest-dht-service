import React, { useState } from "react";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import MainLayout from "./layouts/MainLayout";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { useForm, Controller, SubmitHandler } from "react-hook-form";

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

interface IFormInput {
  earliestDate: string;
  latestDate: string;
}

interface DateEvent {
  $d: Date | null;
}

export default function DHTTable({ readings }: ReadingsProps) {
  const [earliestDate, setEarliestDate] = useState(new Date());
  const [latestDate, setLatestDate] = useState(new Date());

  const [earliestDateError, setEarliestDateError] = useState(false);
  const [latestDateError, setLatestDateError] = useState(false);

  const handleEarliestDateChange = (value: DateEvent | null) => {
    console.log(`earliestDate: ${earliestDate.toDateString()}`);
    if (value != null && value.$d != null) {
      setEarliestDate(value.$d);
    }
  };

  const handleLatestDateChange = (value: DateEvent | null) => {
    console.log(`latestDate: ${latestDate}`);
    if (value != null && value.$d != null) {
      setLatestDate(value.$d);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    setEarliestDateError(false);
    setLatestDateError(false);

    if (earliestDate == null) {
      setEarliestDateError(true);
    }

    if (latestDate == null) {
      setLatestDateError(true);
    }

    if (earliestDate && latestDate) {
      console.log(earliestDate, latestDate);
    }
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

      <form autoComplete="off" onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Earliest Date"
            value={{ $d: earliestDate }}
            onChange={handleEarliestDateChange}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Latest Date"
            value={{ $d: latestDate }}
            onChange={handleLatestDateChange}
          />
        </LocalizationProvider>

        <Button variant="contained" component="label">
          Submit
          <input hidden type="submit" />
        </Button>
      </form>
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
