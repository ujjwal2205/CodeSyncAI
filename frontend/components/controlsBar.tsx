export default function ControlsBar({
  language,
  setLanguage,
  theme,
  setTheme,
}: any) {
  return (
    <div className="flex gap-4 px-4 py-2 border-b border-gray-700">

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-gray-800 px-2 py-1 rounded text-sm"
      >
        <option value="javascript">JavaScript</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="bg-gray-800 px-2 py-1 rounded text-sm"
      >
        <option value="vs-dark">Dark</option>
        <option value="vs">Light</option>
      </select>

    </div>
  );
}