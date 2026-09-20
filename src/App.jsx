import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PresentationManager from './pages/DeckManager';
import DeckEditor from './pages/DeckEditor';
import DeckPresenter from './pages/DeckPresenter';
import DeckAudience from './pages/DeckAudience';
import DeckCreate from './pages/DeckCreate';
import Join from './pages/Join';
import Admin from './pages/Admin';

/**
 * The root component of the PresentLive application.
 *
 * Sets up the main layout, including the header, navigation, and routes
 * for the pages. Uses React Router v6 for client-side routing.
 *
 * @component
 * @example
 * return <App />;
 *
 * @returns {JSX.Element} The rendered PresentLive app.
 */
function App() {
  const navLinks = [
    { path: '/decks', text: 'My presentations' },
    { path: '/join', text: 'Join' },
  ]

  return (
    <Router>
      <Header brandText="PresentLive" navLinks={navLinks} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decks" element={<PresentationManager />} />
          <Route path="/decks/:id/editor" element={<DeckEditor />} />
          <Route path="/decks/:id/presenter" element={<DeckPresenter />} />
          <Route path="/decks/:id/audience" element={<DeckAudience />} />
          <Route path="/join" element={<Join />} />
          <Route path="/decks/create" element={<DeckCreate />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;