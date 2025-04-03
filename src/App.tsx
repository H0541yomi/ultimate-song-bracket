import { useState } from "react";
import StartScreen from "./components/StartScreen";
import GamePhase from "./components/GamePhase";
import { Phase, StreamingService } from "./Types";
import Carousel from "./components/Carousel";
import SongDisplayResults from "./components/SongDisplayResults";
import SongDisplaySelection from "./components/SongDisplaySelection";

const App = () => {
  const dummySong = {
    title: "先駆者",
    videoId: "RpvCh0EhAZM",
    type: StreamingService.Youtube,
  };
  const dummySong2 = {
    title: "ビビデバ / 星街すいせい(official)",
    videoId: "8ZP5eqm4JqM",
    type: StreamingService.Youtube
  };
  const dummySongList = [
    { title: "先駆者", videoId: "RpvCh0EhAZM", type: StreamingService.Youtube },
  ];

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

  return (
    <>
      {screen}
    </>
  );
};

export default App;

// TODO:
// calculate progress bar by calculating comparisons remaining (with recursion) and comparing it to original amount of comparisons
// (derived from prop passed in (songs.length))
// Show tournament list -> shuffling
// Spotify support
// Spotify UI
