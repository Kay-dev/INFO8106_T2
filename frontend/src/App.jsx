
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
import MyEventsPage from './pages/MyEventsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddEventPage from './pages/AddEventPage';
import { UserProvider } from './context/UserContext';
import {createEvent, updateEvent, deleteEvent} from "./services/event";

function App() {

  const addEvent = async (newEvent) => {
    await createEvent(newEvent)
    return;
  };

  // Delete Event
  const deleteEventFunction = async (id) => {
    await deleteEvent(id)
    return;
  };

  // Update Event
  const updateEventFunction = async (event) => {
    console.log(event)
    await updateEvent({id:event.id, newObj:event})
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
        <Route path='/add-event' element={<AddEventPage saveEventSubmit={addEvent} />} />
        <Route
          path='/edit-event/:id'
          element={<AddEventPage saveEventSubmit={updateEventFunction} edit={true}/>}
          loader={eventLoader}
        />
        <Route
          path='/events/:id'
          element={<EventPage deleteEvent={deleteEventFunction} />}
          loader={eventLoader}
        />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    )
  );

  return (
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
  );
}

export default App
