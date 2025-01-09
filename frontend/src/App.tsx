import { Toaster } from "sonner";
import { HomePage } from "./pages/home";

function App() {
  return (
    <>
      <HomePage />
      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton
        theme="light"
      />
    </>
  );
}

export default App;
