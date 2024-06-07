import {  useLoaderData, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarker } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import data from '../../data.json';


const EventPage = ({  deleteEvent }) => {
  const navigate = useNavigate();
  const event = useLoaderData();

  const onDeleteClick = (Id) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this event?'
    );

    if (!confirm) return;
    deleteEvent(Id);
    toast.success('Event deleted successfully');
    navigate('/events');
  };

  return (
    <>
      <section>
        <div className='container m-auto py-6 px-6'>
          <Link
            to='/events'
            className='text-indigo-500 hover:text-indigo-600 flex items-center'
          >
            <FaArrowLeft className='mr-2' /> Back to Event Listings
          </Link>
        </div>
      </section>

      <section className='bg-indigo-50'>
        <div className='container m-auto py-10 px-6'>
          <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
            <main>
              <div className='bg-white p-6 rounded-lg shadow-md text-center md:text-left'>
                <div className='text-gray-500 mb-4'>{event.type}</div>
                <h1 className='text-3xl font-bold mb-4'>{event.title}</h1>
                <div className='text-gray-500 mb-4 flex align-middle justify-center md:justify-start'>
                  <FaMapMarker className='text-orange-700 mr-1' />
                  <p className='text-orange-700'>{event.location}</p>
                </div>
              </div>

              <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
                <h3 className='text-indigo-800 text-lg font-bold mb-6'>
                  Event Description
                </h3>
                <p className='mb-4'>{event.description}</p>
                <h3 className="text-indigo-800 text-lg font-bold mb-2">Event Time</h3>
                <p className='mb-4'>{event.startTime}-{event.endTime}</p>
              </div>
            </main>

            {/* <!-- Sidebar --> */}
            <aside>
              <div className='bg-white p-6 rounded-lg shadow-md'>
                <h3 className='text-xl font-bold mb-6'>Host Info</h3>
                <h2 className='text-2xl'>{event.host.name}</h2>
                <p className='my-2'>{event.host.description}</p>
                <hr className='my-4' />
                <h3 className='text-xl'>Contact Email:</h3>
                <p className='my-2 bg-indigo-100 p-2 font-bold'>
                  {event.host.email}
                </p>
                <h3 className='text-xl'>Contact Phone:</h3>
                <p className='my-2 bg-indigo-100 p-2 font-bold'>
                  {' '}
                  {event.host.phone}
                </p>
              </div>

              <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
                <h3 className='text-xl font-bold mb-6'>Manage Event</h3>
                <Link
                  to={`/edit-event/${event.id}`}
                  className='bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block'
                >
                  Edit Event
                </Link>
                <button
                  onClick={() => onDeleteClick(event.id)}
                  className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block'
                >
                  Delete Event
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

const eventLoader = async ({ params }) => {
  // const res = await fetch(`/api/events/${params.id}`);
  // const data = await res.json();
  // return data;
  return data[0];
};

export { EventPage as default, eventLoader };
