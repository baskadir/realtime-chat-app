import { VStack, ButtonGroup, Button, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import TextField from "../../components/TextField";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { formSchema } from "@chat-app/common";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={formSchema}
      onSubmit={(values, actions) => {
        actions.resetForm();
        fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
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
        <Heading>Sign Up</Heading>

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
          <Button colorScheme="teal">Create Account</Button>
          <Button onClick={() => navigate("/")} leftIcon={<ArrowBackIcon />}>
            Back to Log In
          </Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default Signup;
