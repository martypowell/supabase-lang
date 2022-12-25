import { useState } from "react";
import {
  Button,
  Container,
  Grid,
  List,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import useSaveItem from "../hooks/useSaveItem";
import useGetItems from "../hooks/useGetItem";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const queryKey = { collection: "language", select: "name, locale" };
  const { data: languages, isLoading, error } = useGetItems(queryKey);
  const { mutate: saveLanguage } = useSaveItem(queryKey);
  const form = useForm({
    initialValues: {
      name: "",
      locale: "",
    },
    validate: {
      name: (value) => (value ? null : "Name is required"),
    },
  });

  return (
    <Container>
      {languages && languages.length > 0 ? (
        <Grid>
          <List>
            {languages.map(({ name, locale }) => (
              <List.Item key={locale}>
                {name} - {locale}
              </List.Item>
            ))}
          </List>
        </Grid>
      ) : (
        <div>
          <Text>No lanuages available</Text>
        </div>
      )}
      <Space h="md" />
      <form onSubmit={form.onSubmit(saveLanguage)}>
        <TextInput
          name="name"
          label="Name"
          withAsterisk
          mb="md"
          {...form.getInputProps("name")}
        />
        <TextInput
          name="locale"
          label="Locale"
          mb="md"
          description="Javascript locale that correponds to i18n-next"
          {...form.getInputProps("locale")}
        />
        <Button type="submit">Add</Button>
      </form>
    </Container>
  );
}
