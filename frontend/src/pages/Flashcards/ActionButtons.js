const ActionButtons = ({ handleAction }) => {
  const actions = [
    { label: "Bad", style: "bg-red-500 hover:bg-red-600" },
    { label: "Good", style: "bg-yellow-500 hover:bg-yellow-600" },
    { label: "Great", style: "bg-green-500 hover:bg-green-600" },
  ];

  return (
    <div className="flex space-x-4 mt-4">
      {actions.map(({ label, style }) => (
        <button
          key={label}
          className={`px-4 py-2 rounded text-white ${style}`}
          onClick={() => handleAction(label.toLowerCase())}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
