import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PresentationManager from './pages/DeckManager';
import DeckCreate from './pages/DeckCreate';
import DeckEditor from './pages/DeckEditor';
import { DeckPresenter, DeckAudience, DeckReview, DeckPreview } from './pages/DeckView';
import DeckResults from './pages/DeckResults';
import AttendeeInfo from './pages/AttendeeInfo';
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
export default function App() {
  const navLinks = [
    { path: '/', text: 'Home' },
    { path: '/decks', text: 'My presentations' },
    { path: '/join', text: 'Join' },
  ]

  return (
    <Router>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <Header brandText="PresentLive" navLinks={navLinks} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decks" element={<PresentationManager />} />
          <Route path="/decks/create" element={<DeckCreate />} />
          <Route path="/decks/edit/:presentationId" element={<DeckEditor />} />
          <Route path="/decks/present/:presentationId" element={<DeckPresenter />} />
          <Route path="/decks/view/:presentationId" element={<DeckAudience />} />
          <Route path="/decks/review/:presentationId" element={<DeckReview />} />
          <Route path="/decks/preview/:presentationId" element={<DeckPreview />} />
          <Route path="/decks/results/:presentationId" element={<DeckResults />} />
          <Route path="/attendee/:attendeeId" element={<AttendeeInfo />} />
          <Route path="/join" element={<Join />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}