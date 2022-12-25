import { useState } from "react";
import { supabase } from "../data/supabaseClient";
import { Button, Card, Container, Grid, Space, TextInput } from "@mantine/core";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      console.log(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Grid>
        <Grid.Col span={6}>
          <Card>
            <h1 className="header">Cool Language App Name</h1>
            <p className="description">
              Sign in via magic link with your email below
            </p>
            <div>
              <TextInput
                className="inputField"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Space h="md" />
            <div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin(email);
                }}
                className="button block"
                disabled={loading}
              >
                <span>{loading ? "Loading" : "Send magic link"}</span>
              </Button>
            </div>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
