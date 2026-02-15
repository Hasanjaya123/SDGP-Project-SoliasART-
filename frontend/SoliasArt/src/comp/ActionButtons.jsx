function ActionButtons() {
  return (
    <div className="flex items-center gap-4">
      <button className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-sm font-medium">
        Group
      </button>


      <button className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 transition text-white font-semibold">
        Create
      </button>
    </div>
  );
}

export default ActionButtons;