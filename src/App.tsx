import { useState } from "react";
import StartScreen from "./components/pages/StartScreen";
import GamePhase from "./components/pages/GamePhase";
import { Phase, StreamingService } from "./Types";
import Carousel from "./components/atoms/Carousel";
import SongDisplayResults from "./components/molecules/SongDisplayResults";
import SongDisplaySelection from "./components/molecules/SongDisplaySelection";

const App = () => {
  const dummySong = {
    title: "先駆者",
    videoId: "RpvCh0EhAZM",
    type: StreamingService.Youtube,
  };
  const dummySong2 = {
    title: "ビビデバ / 星街すいせい(official)",
    videoId: "8ZP5eqm4JqM",
    type: StreamingService.Youtube,
  };
  const dummySongList = [dummySong, dummySong2];

  const [phase, setPhase] = useState(Phase.Input);
  const [songs, setSongs] = useState<any[]>([]);

  let screen;

  // 3 main phases of the game: tournament entries, tournament selection, results screen
  switch (phase) {
    case Phase.Input:
      screen = <StartScreen phaseSwitcher={setPhase} returnSongs={setSongs} />;
      break;
    case Phase.Game:
      screen = (
        <GamePhase
          songs={songs}
          phaseSwitcher={setPhase}
          returnSongs={setSongs}
        />
      );
      break;
    case Phase.Results:
      screen = (
        <Carousel>
          {songs.map((song) => {
            return <SongDisplayResults song={song}></SongDisplayResults>;
          })}
        </Carousel>
      );
      break;
    default:
      screen = <div>Error: Unknown game phase.</div>;
  }

  // return <><GamePhase songs={dummySongList} phaseSwitcher={setPhase} returnSongs={setSongs}/></>;
  return <>{screen}</>;
};

export default App;

// TODO:
// calculate progress bar by calculating comparisons remaining (with recursion) and comparing it to original amount of comparisons
// (derived from prop passed in (songs.length))
// Show tournament list -> shuffling
// Spotify support
// Spotify UI
