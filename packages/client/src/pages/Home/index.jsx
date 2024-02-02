import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import ChatArea from "../../components/ChatArea";
import FriendProvider from "../../context/FriendContext";
import useSocketSetup from "../../hooks/useSocketSetup";

const Home = () => {
  useSocketSetup();
  return (
    <FriendProvider>
      <Grid templateColumns="repeat(10, 1fr)" h="100vh" as={Tabs}>
        <GridItem colSpan="3" borderRight="1px solid gray">
          <Sidebar />
        </GridItem>
        <GridItem colSpan="7">
          <ChatArea />
        </GridItem>
      </Grid>
    </FriendProvider>
  );
};

export default Home;
