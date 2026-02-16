function ActionButtons() {
  return (
    <div className="flex items-center gap-4">
      <button className="px-4 py-2 rounded-full bg-[#F0EBE3] hover:bg-[#E5DDD0] transition text-sm font-medium text-[#4A3F2E]">
        Group
      </button>


      <button className="px-6 py-2 rounded-full bg-[#C58940] hover:bg-[#A67234] transition text-white font-semibold shadow-md hover:shadow-lg">
        Create
      </button>
    </div>
  );
}

export default ActionButtons;