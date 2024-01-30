import { VStack, ButtonGroup, Button, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import TextField from "../../components/TextField";
import { useNavigate } from "react-router-dom";
import { formSchema } from "@chat-app/common";

const Login = () => {
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={formSchema}
      onSubmit={(values, actions) => {
        console.log(values);
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
            console.log(data);
          })
          .catch((err) => {
            console.log(err);
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
