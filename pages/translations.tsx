import { useState } from "react";
import { Button, Container, Grid, Radio, TextInput } from "@mantine/core";
import { getItems } from "../hooks/useGetItem";
import { useForm } from "@mantine/form";
import useSaveItem from "../hooks/useSaveItem";
import useGetItems from "../hooks/useGetItem";

function Translations({ languages = [] }) {
  const form = useForm({
    initialValues: {
      namespace: "",
      translation: "",
    },
    validate: {
      namespace: (value) => (value ? null : "Name is required"),
      translation: (value) => (value ? null : "Translation is required"),
    },
  });
  const queryKey = {
    collection: "translation",
    select: "namespace, value, language_id",
  };
  const {
    data: translations,
    isLoading,
    error,
  } = useGetItems(queryKey, {
    onSuccess: (translations = []) => {
      translations.forEach(({ namespace, value, language_id }) => {
        form.setFieldValue(`translation-${language_id}`, value);
        form.setFieldValue("namespace", namespace);
      });
    },
  });
  const { mutate: saveTranslation } = useSaveItem(queryKey);

  const handleSave = ({ namespace, translation, language }) => {
    saveTranslation({ namespace, value: translation, language_id: language });
  };

  return (
    <Container>
      <Grid>
        <Grid.Col>
          <h1>Translations</h1>
        </Grid.Col>
        <Grid.Col>
          <form onSubmit={form.onSubmit(handleSave)}>
            <TextInput
              name="namespace"
              label="Namespace"
              description="`Use `.` to nest namespaces"
              mb="md"
              size="md"
              {...form.getInputProps("namespace")}
            />
            {/* TODO: Need to only have languages that don't already have a key,
			  	Maybe we can actually structure this a bit better
			   */}
            {languages.map(({ id, name }) => (
              <>
                <TextInput
                  name={`translation-${id}`}
                  label={name}
                  mb="md"
                  size="md"
                  {...form.getInputProps(`translation-${id}`)}
                />
              </>
            ))}
            <Button type="submit" size="md">
              Add
            </Button>
          </form>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  const languages = await getItems({
    queryKey: ["language", { select: "id, name, locale" }],
  });

  return {
    props: {
      languages,
    },
  };
}

export default Translations;
