import { Link, useLocation } from 'react-router-dom';

/**
 * Header component for PresentLive.
 *
 * Renders the top navigation bar with the brand and links to "My presentations" and "Join".
 *
 * @component
 * @param {Object} props
 * @param {string} props.brandText - Text shown as the brand link (redirects to home).
 * @param {Array<{text: string, path: string}>} props.navLinks - Links to render on the right.
 * @returns {JSX.Element} A styled navigation bar.
 *
 * @example
 * <Header
 *   brandText="PresentLive"
 *   navLinks={[
 *     { text: 'My presentations', path: '/decks' },
 *     { text: 'Join', path: '/join' },
 *   ]}
 * />
 */
function Header({ brandText, navLinks }) {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="w-100 d-flex align-items-center justify-content-between px-4">
        <Link to="/" className="navbar-brand">{brandText}</Link>
        <ul className="navbar-nav ms-auto flex-row gap-3">
          {navLinks.map((link, index) => (
            <li className="nav-item" key={index}>
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Header;