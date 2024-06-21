import { useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {subscribeEvent, unsubscribeEvent} from "../services/event";
import {toast} from "react-toastify";
import {useUser} from "../context/UserContext";


const EventListing = ({ event, userEvents, handleSubscribe, handleUnsubscribe }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();
  const {token} = useUser();

  let description = event.description;

  if (!showFullDescription) {
    description = description.substring(0, 90) + '...';
  }

  const toEventPage = () => {
    navigate(`/events/${event.id}`);
  };

  const onSubscribe = async (e) => {
    e.stopPropagation();
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await subscribeEvent(event.id);
      handleSubscribe(event.id);
      toast.success('Event subscribed successfully');
    } catch (error) {
      toast.error(error);
    }
    return;
  };

  const onUnsubscribe = async (e) => {
    e.stopPropagation();
    try{
      await unsubscribeEvent(event.id);
      handleUnsubscribe(event.id);
      toast.success('Event unsubscribed successfully');
    }catch (error) {
      toast.error(error);
    }
    return;
  };

  return (
    <div className='bg-white rounded-xl shadow-md relative'>
      <div className='p-4' onClick={toEventPage}>
        <div className='mb-6'>
          <div className="flex justify-between">
            <div className="text-gray-600 my-2">{event.type}</div>
            <div className="text-gray-600 my-2">Subscribed: {event.subscribers.length} / {event.maxParticipants}</div>
          </div>
          <h3 className="text-xl font-bold">{event.title}</h3>
        </div>
        <div className='mb-5'>{description}</div>
        <h3 className='text-indigo-500 mb-2'>{(new Date(event.startTime)).toLocaleString()}-&nbsp;{(new Date(event.endTime)).toLocaleString()}</h3>
        <div className='border border-gray-100 mb-5'></div>
        <div className='flex flex-col lg:flex-row justify-between mb-4'>
          <div className='text-orange-700 mb-3'>
            <FaMapMarker className='inline text-lg mb-1 mr-1' />
            {event.location}
          </div>
          {
            userEvents.includes(event.id) ? (
              <button
              className="h-[36px] bg-black text-white px-4 py-2 rounded-lg text-center text-sm"
              onClick={onUnsubscribe}
              >
              Unsubscribe
            </button>
            ) : (

              <button
                className="h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm"
                onClick={onSubscribe}
                >
                Subscribe
              </button>
            )

          }
        </div>
      </div>
    </div>
  );
};
export default EventListing;
