import { LanguageSelector } from "./components/LanguageSelector";
import { GameProvider } from "./game/GameContext";
import { GameLoader } from "./game/GameLoader";

function App() {
  return (
    <GameProvider>
      <main className="app">
        <LanguageSelector />
        <GameLoader />
      </main>
    </GameProvider>
  );
}

export default App;