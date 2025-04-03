import { useEffect, useState } from "react";
import { Phase, Side, SongData } from "../Types";
import Button from "./Button";
import SongDisplaySelection from "./SongDisplaySelection";

interface Props {
  songs: any[];
  phaseSwitcher: (phase: Phase) => void;
  returnSongs: (result: any[]) => void;
}

const GamePhase = ({ songs, phaseSwitcher, returnSongs }: Props) => {
  const startQueue = songs.map((song) => [song]);
  const startCurrentBuild: any[] = [];
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

  // Purpose: Updates the comparison queue and currentBuild based on the winner passed in.
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

  const undoState = () => {
    if (history.length > 1) {
      setState(history[history.length - 1]);
      setHistory(history.slice(0, -1));
    }
  };

  // Checks if we are done with mergesort (if the queue has length = 1). If so, return the values to the main state.
  const updatePhase = () => {
    if (queue.length <= 1) {
      returnSongs(queue[0]);
      phaseSwitcher(Phase.Results);
    }
  };

  // Check if we are done mergesorting every time the sorting queue is updated.
  useEffect(() => {
    updatePhase();
  }, [queue]);

  return (
    <>
      <div className="container-horizontal">
        <SongDisplaySelection onClick={() => {
            makeComparison(queue[0][queueLeftPos], Side.Left);
          }} song={queue[0][queueLeftPos]} />
        <SongDisplaySelection onClick={() => {
            makeComparison(queue[1][queueRightPos], Side.Right);
          }} song={queue.length > 1 && queue[1][queueRightPos]} />
      </div>
      <div className="small-button">
        {history.length > 1 && (
          <Button onClick={undoState} size={1}>
            Undo
          </Button>
        )}
      </div>
    </>
  );
};

export default GamePhase;
