import Select from "react-select";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
// import Input from "@material-ui/core/Input";

import { Input, Button, TextField } from "@mui/material";


interface IFormInput {
  firstName: string;
  lastName: string;
  iceCreamType: { label: string; value: string };
}

const MyForm = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      iceCreamType: {},
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => <TextField {...field} />}
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
      <input type="submit" />
    </form>
  );
};

export default MyForm;
