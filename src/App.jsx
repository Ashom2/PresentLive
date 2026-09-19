import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import PresentationManager from './components/PresentationManager';
import { decks } from './data/decks';

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
    { path: '/presentations', text: 'My presentations' },
    { path: '/', text: 'Join' },
  ];

  return (
    <Router>
      <div>
        <Header brandText="PresentLive" navLinks={navLinks} />
        <div className="container mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/presentations" element={<PresentationManager decks={decks} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;