import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
} from "@chakra-ui/react";
import TextField from "../TextField/index";
import { Form, Formik } from "formik";
import { friendFormSchema } from "@chat-app/common";
import socket from "../../socket";
import { useCallback, useContext, useState } from "react";
import { ChatContext } from "../../context/ChatProvider";

const AddFriendModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState("");
  const { setFriendList } = useContext(ChatContext);

  const closeModal = useCallback(() => {
    setError("");
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a new friend</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ friendName: "" }}
          onSubmit={(values) => {
            socket.emit(
              "add_friend",
              values.friendName,
              ({ done, errorMessage, newFriend }) => {
                if (done) {
                  setFriendList((prev) => [newFriend, ...prev]);
                  closeModal();
                  return;
                }
                setError(errorMessage);
              }
            );
          }}
          validationSchema={friendFormSchema}
        >
          <Form>
            <ModalBody>
              <Heading as="p" color="red.500" textAlign="center" fontSize="lg">
                {error}
              </Heading>
              <TextField
                label="Friend's name"
                placeholder="Enter friend's username."
                autoComplete="off"
                name="friendName"
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddFriendModal;
