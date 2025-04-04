import { useEffect, useState } from "react";
import { Phase, Side, SongData } from "../../Types";
import Button from "../atoms/Button";
import SongDisplaySelection from "../molecules/SongDisplaySelection";
import ProgressBar from "../atoms/ProgressBar";

interface Props {
  songs: any[];
  phaseSwitcher: (phase: Phase) => void;
  returnSongs: (result: any[]) => void;
}

const GamePhase = ({ songs, phaseSwitcher, returnSongs }: Props) => {
  // Initial values
  const startQueue = songs.map((song) => [song]);
  const startCurrentBuild: any[] = [];


  // State for tracking bracket
  const [{ queue, currentBuild, queueLeftPos, queueRightPos }, setState] =
    useState({
      // queue: The queue of sublists to compare for mergesort.
      queue: startQueue,
      // currentBuild: The current list being built with mergesort.
      currentBuild: startCurrentBuild,
      // queueLeftPos/queueRightPos: Tracks the indices being compared during mergesort (for the first two sublists of queue).
      queueLeftPos: 0,
      queueRightPos: 0,
    });

  // List of previous states for undo function
  const [history, setHistory] = useState([
    { queue, currentBuild, queueLeftPos, queueRightPos },
  ]);

  // Progress bar state
  const [progress, setProgress] = useState(0);

  // Purpose: Updates the comparison queue and currentBuild based on the winner passed in. (song selection)
  // If the left or right list is empty, proceeds with next mergesort step.
  const makeComparison = (winner: SongData, side: Side) => {
    let currentBuildNext = [...currentBuild, winner];
    let queueNext = [...queue];

    let queueLeftPosNext = queueLeftPos;
    let queueRightPosNext = queueRightPos;
    // Incrementing the pointers for mergesort based on the winner.
    switch (side) {
      case Side.Left: {
        queueLeftPosNext++;
        break;
      }
      case Side.Right: {
        queueRightPosNext++;
        break;
      }
    }

    // Check if we have reached the end of either array. If so, then we add the rest of the items to currentBuildNext and
    // start the next cycle of mergesorting.
    if (
      queueLeftPosNext >= queue[0].length ||
      queueRightPosNext >= queue[1].length
    ) {
      // Adding the rest of the remaining array.
      switch (side) {
        case Side.Left: {
          currentBuildNext = currentBuildNext.concat(
            queue[1].slice(queueRightPos)
          );
          break;
        }
        case Side.Right: {
          currentBuildNext = currentBuildNext.concat(
            queue[0].slice(queueLeftPos)
          );
          break;
        }
      }
      // Updating the queue with our result and preparing for the next cycle.
      queueNext.push(currentBuildNext);
      queueNext = queueNext.slice(2);
      currentBuildNext = [];
      queueLeftPosNext = 0;
      queueRightPosNext = 0;
    }

    // State updates

    const historyNext = [
      ...history,
      { queue, currentBuild, queueLeftPos, queueRightPos },
    ];
    setHistory(historyNext);

    setState({
      queue: queueNext,
      currentBuild: currentBuildNext,
      queueLeftPos: queueLeftPosNext,
      queueRightPos: queueRightPosNext,
    });
  };

  // Purpose: Update progress bar (progress bar)
  const updateProgress = () => {
    if (queue.length == 1) {
      setProgress(1);
      return;
    }
    const roundsRemaining = getRoundsLeft(queue);
    const maxRounds = getRoundsLeft(startQueue);

    // Simulating the next round, and then...
    let queueNext: any[][] = [];
    queue.forEach(array => queueNext.push(array));
    const nextMerge = [...queueNext[0], ... queueNext[1]]
    queueNext.push(nextMerge);
    queueNext.splice(0, 2);

    // Calculating progress at next round
    const nextRoundsRemaining = getRoundsLeft(queueNext);

    // We use the difference between current progress and next round's progress to smoothly transition the bar so that it doesn't 
    // abruptly jump if the user heavily favors one side of the mergesort or the other.

    let currentProgress = 1 - (roundsRemaining / maxRounds);
    const nextProgress = 1 - (nextRoundsRemaining / maxRounds);
    let progressDiff = nextProgress - currentProgress;
    
    // Add progress by giving more weighting to the list with the most items processed, and then giving a little weighting to the
    // list with less items processed.
    const leftProgress = ((queueLeftPos) / queue[0].length);
    const rightProgress = ((queueRightPos) / queue[1].length);
    currentProgress += Math.max(leftProgress, rightProgress) * progressDiff;
    progressDiff = nextProgress - currentProgress;
    currentProgress += Math.min(leftProgress, rightProgress) * progressDiff

    setProgress(currentProgress);
  };

  // Purpose: Calculate rounds remaining
  const getRoundsLeft = (queue: any[][]) => {
    let roundsRemaining = 0;

    // Max amount of rounds when merging two lists of length x and y = x + y - 1, so simulate tournament rounds with this formula until the tournament finishes.
    let listLengths = queue.map((arr) => arr.length);
    while (listLengths.length > 1) {
      listLengths.push(listLengths[0] + listLengths[1]);
      roundsRemaining += listLengths[0] + listLengths[1] - 1;
      listLengths.splice(0, 2);
    }

    return roundsRemaining;
  };

  // Purpose: Return to previous state (undo button)
  const undoState = () => {
    if (history.length > 1) {
      setState(history[history.length - 1]);
      setHistory(history.slice(0, -1));
    }
  };

  // Moving to next phase

  // Purpose: Checks if we are done with mergesort (if the queue has length = 1). If so, return the values to the main state.
  const updatePhase = () => {
    if (queue.length <= 1) {
      returnSongs(queue[0]);
      phaseSwitcher(Phase.Results);
    }
  };

  // Listener every time a song is selected. Updates progress bar and moves to end screen when appropriate.
  useEffect(() => {
    updatePhase();
    updateProgress();
  }, [queue]);

  

  return (
    <>
      <div className="flex-col h-screen bg-gradient-to-br from-rich-black to-raisin-black h-screen text-platinum">
        <div className="flex justify-around items-center h-[70%]">
          <SongDisplaySelection
            onClick={() => {
              makeComparison(queue[0][queueLeftPos], Side.Left);
            }}
            song={queue[0][queueLeftPos]}
          />
          <SongDisplaySelection
            onClick={() => {
              makeComparison(queue[1][queueRightPos], Side.Right);
            }}
            song={queue.length > 1 && queue[1][queueRightPos]}
          />
        </div>
        <div className="flex justify-around h-[10%] w-full p-3">
          <ProgressBar progress={progress} />
          {progress}
        </div>
        <div className="small-button h-[20%] p-3">
          {history.length > 1 && (
            <Button onClick={undoState} size={1}>
              Undo
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default GamePhase;
