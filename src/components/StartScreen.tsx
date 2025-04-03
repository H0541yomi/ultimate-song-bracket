import { Phase, StreamingService } from "../Types";
import axios from "axios";
import { useState } from "react";
import TextInput from "./TextInput";

interface Props {
  phaseSwitcher: (phase: Phase) => void;
  returnSongs: (songs: string[]) => void;
}

const API_KEY = "AIzaSyAGfzkxK44ldbWM9j0vkYerwQtlpuMs5U0";

const StartScreen = ({ phaseSwitcher, returnSongs }: Props) => {
  const [playlistLink, setPlaylistLink] = useState("");

  const startGame = async () => {
    // Extracting playlist id for loadSongs
    const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
    const match = playlistLink.match(regex);

    if (!match) {
      console.error("Invalid Playlist Link.");
      return;
    }

    const songData = await loadSongs(match[1]);
    returnSongs(songData);
    phaseSwitcher(Phase.Game);
  };

  const loadSongs = async (
    playlistId: string,
    pageToken: string | null = null
  ) => {
    let songs: any[] = [];

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "snippet",
          playlistId: playlistId,
          key: API_KEY,
          maxResults: 50,
          pageToken: pageToken,
        },
      }
    );

    songs.push(...response.data.items);

    // Recursively handle pagination by adding songs to the end of the current list
    if (response.data.pageToken) {
      songs.push(await loadSongs(playlistId, response.data.pageToken));
    }

    songs = songs.map((song) => {
      return {
        title: song.snippet.title,
        videoId: song.snippet.resourceId.videoId,
        type: StreamingService.Youtube,
      };
    });
    return songs;
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h1 className="flex justify-center p-[2%] gap-[1%]">
          Ultimate Song Tournament
        </h1>
        <TextInput
          title="Playlist Link:"
          content={playlistLink}
          onChange={(e) => setPlaylistLink(e.target.value)}
        />
        <div className="flex justify-center p-[2%] gap-[1%] normal-button">
          <button type="button" className="btn btn-primary" onClick={startGame}>
            Start!
          </button>
        </div>
      </div>
    </>
  );
};

export default StartScreen;
