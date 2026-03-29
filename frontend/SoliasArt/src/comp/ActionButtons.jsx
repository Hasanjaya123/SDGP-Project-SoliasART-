function ActionButtons() {
  return (
    <div className="flex items-center gap-4">
      <button className="px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition text-sm font-medium text-gray-300">
        Group
      </button>


      <button className="px-6 py-2 rounded-full bg-amber-500 hover:bg-amber-600 transition text-white font-semibold text-sm">
        Create
      </button>
    </div>
  );
}

export default ActionButtons;