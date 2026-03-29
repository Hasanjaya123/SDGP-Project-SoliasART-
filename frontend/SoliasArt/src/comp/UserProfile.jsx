const UserProfile = ({ name, role, avatar, collectionCount, likedCount, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col items-center py-8 border-b border-gray-800 mb-8">

      {/* Avatar */}
      <img
        src={avatar}
        alt={name}
        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 mb-3 transition-colors"
      />

      {/* Name & Role */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">{name}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 transition-colors">{role}</p>

      {/* Stats */}
      <div className="flex items-center gap-10 mb-6">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{collectionCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">In Collection</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{likedCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Liked</p>
        </div>
      </div>

      {/* Tab buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onTabChange('collection')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors
            ${activeTab === 'collection'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          My Collection
        </button>
        <button
          onClick={() => onTabChange('liked')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors
            ${activeTab === 'liked'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          Liked
        </button>
      </div>

    </div>
  );
};

export default UserProfile;