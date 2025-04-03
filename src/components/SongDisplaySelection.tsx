import { SongData, StreamingService } from "../Types";
import Button from "./Button";

interface Props {
  song: SongData;
  onClick: () => void;
}

const SongDisplaySelection = ({ song, onClick }: Props) => {
  let result;

  switch (song.type) {
    case StreamingService.Youtube:
      {
        result = (
          <>
            <div className="@container flex flex-col justify-around items-center border rounded-sm h-[60%] w-[25%] bg-gradient-to-tl from-[#0077B6] to-[#00B4D8]">
              <h3 className="@sm:text-lg @md:text-md @lg:text-lg text-center w-[100%] truncate">
                {song.title}
              </h3>
              <iframe
                className="border border-red-400 p-2 rounded-sm w-[80%] aspect-video"
                src={`https://www.youtube.com/embed/${song.videoId}`}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <Button onClick={onClick} size={10}>
                This song is better
              </Button>
            </div>
          </>
        );
      }
      break;
    case StreamingService.Spotify:
      {
        result = <>SongDisplaySelection</>;
      }
      break;
    case StreamingService.AppleMusic:
      {
        result = <>SongDisplaySelection</>;
      }
      break;
  }

  return <>{result}</>;
};

export default SongDisplaySelection;
