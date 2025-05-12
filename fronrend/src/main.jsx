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
import MainPage from './pages/admin/main_page';
import Registrations from './pages/admin/registrations';
import Rehersals from './pages/admin/rehersals';
import Edit from './pages/admin/eidt';
import ApplicantsList from './pages/admin/applicants_list';
import EditChoiristers from './pages/admin/edit-choiristers';
import EditGallery from './pages/admin/edit-gallery';
import EditNews from './pages/admin/edit-news';
import ApplicantDetailed from './pages/admin/applicantDetailed';
import EditEvent from './components/EditEvent';
import AddEvent from './components/AddEvent';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';

export const API_URL = "http://127.0.0.1:8000/api/"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <ScrollToTop/>
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

      {/*Страницы, доступные только по access токену */}
      <Route path="/admin-main-page" element={<PrivateRoute><MainPage /></PrivateRoute>} />
      <Route path="/admin-registrations" element={<PrivateRoute><Registrations /></PrivateRoute>} />
      <Route path="/admin-rehersals" element={<PrivateRoute><Rehersals/></PrivateRoute>} />
      <Route path="/admin-rehersals/:id" element={<PrivateRoute><ApplicantsList/></PrivateRoute>} />
      <Route path="/admin-edit" element={<PrivateRoute><Edit /></PrivateRoute>} />
      <Route path="/edit-choir" element={<PrivateRoute><EditChoiristers /></PrivateRoute>} />
      <Route path="/edit-news" element={<PrivateRoute><EditNews /></PrivateRoute>} />
      <Route path="/edit-gallery" element={<PrivateRoute><EditGallery /></PrivateRoute>} />
      <Route path="/edit-event/:id" element={<PrivateRoute><EditEvent /></PrivateRoute>} />
      <Route path="/add-event" element={<PrivateRoute><AddEvent /></PrivateRoute>} />
      <Route path="/admin-rehersals/applicant/:id" element={<PrivateRoute><ApplicantDetailed/></PrivateRoute>} />
    </Routes>
  </BrowserRouter>
);
