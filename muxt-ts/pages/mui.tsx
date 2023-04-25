import React, { useRef } from "react";

import { Controller, useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";

interface IMyFormProps {
  name: string;
  description: string;
  occurrenceTimestamp: Date;
}

const MyForm: React.FC<IMyFormProps> = (props: IMyFormProps) => {
  // set up details for ReactHookForm
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: props.name,
      description: props.description,
      occurrenceTimestamp: props.occurrenceTimestamp,
    },
    mode: "all",
  });

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);

  register("name", { required: true });
  register("description", { required: true });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <TextField
        type="string"
        label="Name"
        fullWidth
        {...register("name", {
          required: "Required",
        })}
      />
      {errors.name && errors.name.message}

      {/* a text input for Name */}
      {/* <TextField
        // inputRef={register('name', { required: true })}
        inputRef={nameRef}
        name="name"
        label="Name"
        fullWidth
      /> */}

      {/* a text input for Description */}
      <TextField
        // inputRef={register("description", { required: true })}
        inputRef={descriptionRef}
        name="description"
        label="Description"
        fullWidth
      />

      {/* The Date/Time Picker */}
      <Controller
        render={(props) => (
          <TextField
            {...props}
            type="datetime-local"
            label="Occurrence Date/Time"
          />
        )}
        name="occurrenceTimestamp"
        control={control}
      />

      {/* The Submit Button */}
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default MyForm;
