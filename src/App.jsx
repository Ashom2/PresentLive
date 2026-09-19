import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import PresentationManager from './components/PresentationManager';
import DeckEditor from './components/DeckEditor';
import DeckPresenter from './components/DeckPresenter';
import DeckAudience from './components/DeckAudience';
import Join from './components/Join';

/**
 * The root component of the React Chef application.
 *
 * Sets up the main layout, including the header, navigation, and routes
 * for the Home, RecipeList, and Recipe pages. Uses React Router v6
 * for client-side routing.
 *
 * @component
 * @example
 * return <App />;
 *
 * @returns {JSX.Element} The rendered React Chef app.
 */
function App() {
  const navLinks = [
    { path: '/decks', text: 'My presentations' },
    { path: '/join', text: 'Join' },
  ];

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
        </Routes>
      </main>
    </Router>
  );
}

export default App;