import { useState, useEffect } from 'react';
import EventListing from './EventListing';
import Spinner from './Spinner';
import data from '../../data.json';
import { getAllEvents,getEventByUser } from '../services/event'
import { useUser } from '../context/UserContext';

const EventListings = ({ isHome = false, myEvent = false }) => {
  const [events, setEvents] = useState(data);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userEvents = await getEventByUser();
        if (myEvent) {
          setEvents(userEvents);
          setUserEvents(userEvents.map((e) => e.id));
        } else{
          // get all events
          const data = await getAllEvents(3)
          setEvents(data);
          // get users events
          setUserEvents(userEvents.map((e) => e.id));
        }

      } catch (error) {
        console.log('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSubscribe = (eventId) => {
    console.log('Subscribing to event', eventId);
    events.forEach((event) => {
      if (event.id === eventId) {
        event.subscribers.push(user.id);
      }
    })
    setEvents(events);
    setUserEvents(prevEvents => [...prevEvents, eventId]);
  };

  const handleUnsubscribe = (eventId) => {
    console.log('Unsubscribing from event', eventId);
    events.forEach((event) => {
      if (event.id === eventId) {
        event.subscribers = event.subscribers.filter(id => id !== user.id);
      }
    })
    setUserEvents(prevEvents => prevEvents.filter(id => id !== eventId));
  };

  return (
    <section className='bg-blue-50 px-4 py-10'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-indigo-500 mb-6 text-center'>
          {isHome ? 'Recent Events' : 'Browse Events'}
        </h2>

        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {events.map((event) => (
              <EventListing key={event.id} event={event} userEvents={userEvents} handleSubscribe={handleSubscribe} handleUnsubscribe={handleUnsubscribe} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
export default EventListings;
