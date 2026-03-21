function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    
    <nav className="flex gap-2 border-b border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          
          className={`px-5 py-2.5 text-sm font-semibold transition-colors
            ${activeTab === tab
              ? 'text-white border-b-2 border-amber-500'
              : 'text-gray-500 hover:text-gray-300'
            }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

export default TabNavigation;
