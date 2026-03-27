function Header({ name, followingCount, searchPlaceholder }) {
  return (
    <header className="bg-[#FEFDFB] shadow-sm sticky top-0 z-50 border-b border-[#E5DDD0]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full max-w-xl bg-[#F0EBE3] px-5 py-3 rounded-full text-[#2C2416] placeholder-[#9B8B7A] focus:outline-none focus:ring-2 focus:ring-[#C58940] transition-all duration-200"
        />

        <div className="flex items-center gap-4 ml-6">
          <div className="w-10 h-10 rounded-full bg-[#C58940] flex items-center justify-center text-white font-semibold shadow-md">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="hidden sm:block">
            <p className="font-semibold text-[#2C2416]">{name}</p>
            <p className="text-sm text-[#9B8B7A]">
              {followingCount} following
            </p>
          </div>

          <button className="bg-[#F0EBE3] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#E5DDD0] transition text-[#4A3F2E]">
            Share profile
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;

