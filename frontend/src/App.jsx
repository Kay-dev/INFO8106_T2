
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
import AddJobPage from './pages/AddJobPage';
import EditJobPage from './pages/EditJobPage';
import MyEventsPage from './pages/MyEventsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {

  const addJob = async (newJob) => {
    return;
  };

  // Delete Job
  const deleteJob = async (id) => {

    return;
  };

  // Update Job
  const updateJob = async (job) => {

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
        <Route path='/add-job' element={<AddJobPage addJobSubmit={addJob} />} />
        <Route
          path='/edit-job/:id'
          element={<EditJobPage updateJobSubmit={updateJob} />}
          loader={eventLoader}
        />
        <Route
          path='/events/:id'
          element={<EventPage deleteEvent={deleteJob} />}
          loader={eventLoader}
        />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App
