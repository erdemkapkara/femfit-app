import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import CycleTracker from './pages/CycleTracker';
import Active from './pages/Active';
import Nutrition from './pages/Nutrition';
import Social from './pages/Social';
import Profile from './pages/Profile';
import Blog from './pages/Blog';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cream">
        <Navbar />
        <main className="pb-20 md:pb-0">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/cycle"     element={<CycleTracker />} />
            <Route path="/active"    element={<Active />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/blog"      element={<Blog />} />
            <Route path="/social"    element={<Social />} />
            <Route path="/profile"   element={<Profile />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
