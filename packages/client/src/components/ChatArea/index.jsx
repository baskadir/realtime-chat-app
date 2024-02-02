import { TabPanel, TabPanels, VStack, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { FriendContext } from "../../context/FriendContext";

const ChatArea = () => {
  const { friendList } = useContext(FriendContext);

  return friendList.length > 0 ? (
    <VStack>
      <TabPanels>
        <TabPanel>friend one</TabPanel>
        <TabPanel>friend two</TabPanel>
      </TabPanels>
    </VStack>
  ) : (
    <VStack
      justify="center"
      pt="5rem"
      w="100%"
      textAlign="center"
      fontSize="large"
      fontWeight="700"
    >
      <TabPanels>
        <Text>There are no friends.. Click add friend to start chat</Text>
      </TabPanels>
    </VStack>
  );
};

export default ChatArea;
