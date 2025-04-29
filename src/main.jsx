// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AboutUs from './pages/user/about_us';
import Events from './pages/user/events';
import Galery from './pages/user/gallery';
import News from './pages/user/news';
import NewsDetailed from './pages/user/newsDetailed';
import Partnership from './pages/user/partnership';
import RehersalInfo from './pages/user/rehersal_info';
import RehersalForm from './pages/user/rehersal_form';
import AdminAuth from './pages/admin/auth';
import EventDetailed from './pages/user/eventDetailed';
import EventForm from './pages/user/event_registration_form';
//  add     <Route path="*" element={<NotFound />} />
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetailed />} />
      <Route path="/events/registration/:id" element={<EventForm />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/gallery" element={<Galery />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:id" element={<NewsDetailed />} />
      <Route path="/partnership" element={<Partnership />} />
      <Route path="/about-rehersal" element={<RehersalInfo />} />
      <Route path="/form-rehersal" element={<RehersalForm />} />
      <Route path="/admin-auth" element={<AdminAuth />} />
    </Routes>
  </BrowserRouter>
);
