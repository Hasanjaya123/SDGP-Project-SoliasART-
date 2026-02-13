import SearchBar from './SearchBar';
import Profile from './Profile';

function Header({ name, followingCount, searchPlaceholder }) {
  return (
    <header className="header">
      <SearchBar placeholder={searchPlaceholder} />
      <Profile name={name} followingCount={followingCount} />
    </header>
  );
}

export default Header;