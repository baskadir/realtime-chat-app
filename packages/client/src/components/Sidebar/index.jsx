import {
  Button,
  Divider,
  HStack,
  Heading,
  VStack,
  Text,
  TabList,
  Tab,
  Circle,
  useDisclosure,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatProvider";
import AddFriendModal from "../AddFriendModal";

const Sidebar = () => {
  const { friendList } = useContext(ChatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <VStack py="1.4rem">
        <HStack justify="space-evenly" w="100%">
          <Heading size="md">Add Friend</Heading>
          <Button onClick={onOpen}>
            <ChatIcon />
          </Button>
        </HStack>
        <Divider />
        <VStack as={TabList}>
          {friendList?.map((friend) => (
            <HStack as={Tab} key={`friend:${friend.userid}`}>
              <Circle
                bg={friend.isConnected ? "green.600" : "red.500"}
                w="15px"
                h="15px"
              />
              <Text>{friend.username}</Text>
            </HStack>
          ))}
        </VStack>
      </VStack>
      <AddFriendModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Sidebar;
