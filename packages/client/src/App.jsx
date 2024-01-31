import ToggleColorMode from "./components/ToggleColorMode";
import UserContext from "./context/AccountContext";
import AppRouter from "./routes";

function App() {
  return (
    <UserContext>
      <AppRouter />
      <ToggleColorMode />
    </UserContext>
  );
}

export default App;
