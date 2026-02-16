function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="flex gap-2 border-b border-gray-200 mb-6">
     {tabs.map((tab) => (
       <button
         key={tab}
         className={`px-6 py-3 font-semibold transition ${
           activeTab === tab 
             ? 'text-gray-900 border-b-2 border-gray-900' 
             : 'text-gray-500 hover:text-gray-700'
         }`}
         onClick={() => onTabChange(tab)}
       >
         {tab}
       </button>
     ))}
   </nav>
  );
}

export default TabNavigation;