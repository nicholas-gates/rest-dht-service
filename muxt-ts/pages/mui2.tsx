import React, { useState } from "react";

import Select from "react-select";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
// import Input from "@material-ui/core/Input";

import { Input, Button, TextField } from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

interface IFormInput {
  modifiedAt: string;
  firstName: string;
  lastName: string;
  iceCreamType: { label: string; value: string };
}

const MyForm = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      modifiedAt: "",
      firstName: "",
      lastName: "",
      iceCreamType: {},
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  const [latestDate, setLatestDate] = useState(null);

  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => <LocalizationProvider dateAdapter={AdapterDayjs} {...field}>
        <DateTimePicker
          label="Latest Date"
          value={latestDate}
        />
      </LocalizationProvider>}
      />
      <Controller
        name="iceCreamType"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={[
              { value: "chocolate", label: "Chocolate" },
              { value: "strawberry", label: "Strawberry" },
              { value: "vanilla", label: "Vanilla" },
            ]}
          />
        )}
      />
      <Controller
        name="modifiedAt"
        control={control}
        render={({ field }) => <TextField label="First Name" {...field} />}
      />
      <input type="submit" />
    </form>
  );
};

export default MyForm;
