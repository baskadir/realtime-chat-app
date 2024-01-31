import { VStack, ButtonGroup, Button, Heading, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import TextField from "../../components/TextField";
import { useNavigate } from "react-router-dom";
import { formSchema } from "@chat-app/common";
import { useContext, useState } from "react";
import { AccountContext } from "../../context/AccountContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AccountContext);
  const [error, setError] = useState(null);

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={formSchema}
      onSubmit={(values, actions) => {
        actions.resetForm();
        fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values }),
        })
          .then((res) => {
            if (!res || !res.ok || res.status >= 400) {
              return;
            }
            return res.json();
          })
          .then((data) => {
            if (!data) return;
            if(data.status) {
              setError(data.status);
            } else if (data.loggedIn) {
              setUser({ ...data });
              navigate("/home");
            }
          })
          .catch((err) => {
            return;
          });
      }}
    >
      <VStack
        as={Form}
        w={{ base: "%90", md: "500px" }}
        h="100vh"
        m="auto"
        justify="center"
        spacing="1rem"
      >
        <Heading>Log In</Heading>
        <Text as="p" color="red.500">
          {error}
        </Text>

        <TextField
          name="username"
          label="Username"
          placeholder="Enter Username"
          autoComplete="off"
        />
        <TextField
          name="password"
          label="Password"
          placeholder="Enter Password"
          autoComplete="off"
          type="password"
        />

        <ButtonGroup pt="1rem">
          <Button colorScheme="teal" type="submit">
            Log In
          </Button>
          <Button onClick={() => navigate("/register")}>Create Account</Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default Login;
