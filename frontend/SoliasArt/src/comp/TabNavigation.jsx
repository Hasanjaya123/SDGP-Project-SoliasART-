function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={activeTab === tab ? 'active' : ''}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

export default TabNavigation;