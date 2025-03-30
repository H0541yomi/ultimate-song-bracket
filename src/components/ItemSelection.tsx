import { SongData } from "../Types";
import Button from "./Button";
import SongDisplay from "./SongDisplay";

interface Props {
  songData: SongData;
  onClick: () => void;
}

const ItemSelection = ({ songData, onClick }: Props) => {
  return (
    <div className="item">
      <div className="container-vertical outline py-4 w-1">
        <SongDisplay song={songData} />
        <Button onClick={onClick} size={6}>
          This song is better
        </Button>
      </div>
    </div>
  );
};

export default ItemSelection;
