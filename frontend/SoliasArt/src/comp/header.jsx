function Header({ name, followingCount, searchPlaceholder }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full max-w-xl bg-gray-100 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <div className="flex items-center gap-4 ml-6">
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="hidden sm:block">
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">
              {followingCount} following
            </p>
          </div>

          <button className="bg-gray-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition">
            Share profile
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;
