
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import NotFoundPage from './pages/NotFoundPage';
import EventPage, { eventLoader } from './pages/EventPage';
import EditEventPage from './pages/EditEventPage';
import MyEventsPage from './pages/MyEventsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddEventPage from './pages/AddEventPage';

function App() {

  const addEvent = async (newEvent) => {
    return;
  };

  // Delete Event
  const deleteEvent = async (id) => {

    return;
  };

  // Update Event
  const updateEvent = async (job) => {

    return;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path='/events' element={<EventsPage />} />
        <Route path='/my-events' element={<MyEventsPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/sign-up' element={<RegisterPage />} />
        <Route path='/add-event' element={<AddEventPage addEventSubmit={addEvent} />} />
        <Route
          path='/edit-event/:id'
          element={<EditEventPage addEventSubmit={updateEvent} />}
          loader={eventLoader}
        />
        <Route
          path='/events/:id'
          element={<EventPage deleteEvent={deleteEvent} />}
          loader={eventLoader}
        />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App
