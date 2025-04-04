interface Props {
  progress: number;
}

const ProgressBar = ({ progress }: Props) => {
  return (
    <div className="flex items-center w-[50%] p-2">
        <p className="m-0 flex-1">Progress: </p>
        <div className="flex-5 h-4 bg-gray-200 rounded-full">
          <div
            className="w-full h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${100 * progress}%` }}
          ></div>
        </div>
    </div>
  );
};

export default ProgressBar;
