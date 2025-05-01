import "./App.css";
import Calculator from "./Calculator";

import { QueueProvider } from "./QueueContext";

function App() {
  return (
    <QueueProvider>
      <Calculator />
    </QueueProvider>
  );
}

export default App;
