import { VStack, ButtonGroup, Button, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "../../components/TextField";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Yup.object({
        username: Yup.string()
          .required("Username required!")
          .min(6, "Username too short!")
          .max(28, "Username too long!"),
        password: Yup.string()
          .required("Password required!")
          .min(6, "Password too short!")
          .max(28, "Password too long!"),
      })}
      onSubmit={(values, actions) => {
        alert(JSON.stringify(values, null, 2));
        actions.resetForm();
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
          <Button colorScheme="teal">Log In</Button>
          <Button onClick={() => navigate("/register")}>Create Account</Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default Login;
