import { SongData } from "../../Types";
import useFitText from "use-fit-text";

interface Props {
  song: SongData;
}

const SongDisplay = ({ song }: Props) => {
  const { fontSize, ref } = useFitText();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ height: "100vh" }}
    >
      <h2 ref={ref} style={{ fontSize, width: 560 }}>
        {song.title}
      </h2>
      <iframe
        className="rounded-lg"
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${song.videoId}`}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default SongDisplay;
