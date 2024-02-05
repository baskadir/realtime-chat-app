import { TabPanel, TabPanels, VStack, Text } from "@chakra-ui/react";
import { useContext, useEffect, useRef } from "react";
import ChatBox from "../ChatBox/index";
import { ChatContext } from "../../context/ChatProvider";

const ChatArea = ({ friendIndex }) => {
  const { friendList, messages } = useContext(ChatContext);
  const bottomDivRef = useRef(null);

  useEffect(() => {
    bottomDivRef.current?.scrollIntoView();
  });

  return friendList.length > 0 ? (
    <VStack h="100%" justify="end">
      <TabPanels overflowY="scroll">
        {friendList.map((friend) => (
          <VStack
            flexDir="column-reverse"
            as={TabPanel}
            key={`chat:${friend.username}`}
            w="100%"
          >
            <div ref={bottomDivRef} />
            {messages
              .filter(
                (msg) => msg.to === friend.userid || msg.from === friend.userid
              )
              .map((message, index) => (
                <Text
                  m={
                    message.to === friend.userid
                      ? "1rem 0 0 auto !important"
                      : "1rem auto 0 0 !important"
                  }
                  maxW="50%"
                  key={`message:${friend.username}.${index}`}
                  fontSize="lg"
                  bg={message.to === friend.userid ? "blue.100" : "gray.100"}
                  color="gray.800"
                  borderRadius="10px"
                  p="0.5rem 1rem"
                >
                  {message.content}
                </Text>
              ))}
          </VStack>
        ))}
      </TabPanels>
      <ChatBox userId={friendList[friendIndex].userid} />
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
        <TabPanel>
          <Text>There are no friends.. Click add friend to start chat</Text>
        </TabPanel>
      </TabPanels>
    </VStack>
  );
};

export default ChatArea;
