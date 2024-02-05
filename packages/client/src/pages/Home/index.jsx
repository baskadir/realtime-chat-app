import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import ChatArea from "../../components/ChatArea";
import ChatProvider from "../../context/ChatProvider";
import { useState } from "react";

const Home = () => {
  const [friendIndex, setFriendIndex] = useState(0);
  return (
    <ChatProvider>
      <Grid
        templateColumns="repeat(10, 1fr)"
        h="100vh"
        as={Tabs}
        onChange={(index) => setFriendIndex(index)}
      >
        <GridItem colSpan="3" borderRight="1px solid gray">
          <Sidebar />
        </GridItem>
        <GridItem colSpan="7" maxH="100vh">
          <ChatArea friendIndex={friendIndex} />
        </GridItem>
      </Grid>
    </ChatProvider>
  );
};

export default Home;
