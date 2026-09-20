import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import PresentationManager from './components/DeckManager';
import DeckEditor from './components/DeckEditor';
import DeckPresenter from './components/DeckPresenter';
import DeckAudience from './components/DeckAudience';
import Join from './components/Join';
import NewDeck from './components/NewDeck';
import Admin from './components/Admin';

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
          <Route path="/decks/create" element={<NewDeck />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;