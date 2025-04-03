interface Props {
  title: string;
  content: string;
  onChange: (e: any) => void;
}

const TextInput = ({ title, content, onChange }: Props) => {
  return (
    <>
      <label htmlFor="playlist-input">{title}</label>
      <input
        className="border-1 border-gray-200 p-2 rounded-md"
        type="text"
        id="playlist-input"
        value={content}
        onChange={onChange}
      />
    </>
  );
};

export default TextInput;
