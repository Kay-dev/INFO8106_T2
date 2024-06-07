import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddEventPage = ({ addEventSubmit }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [host, setHost] = useState('');

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();

    const newJob = {
      title,
      type,
      location,
      description,
      host
    };

    addEventSubmit(newJob);

    toast.success('Job Added Successfully');

    return navigate('/jobs');
  };

  return (
    <section className='bg-indigo-50'>
      <div className='container m-auto max-w-2xl py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <form onSubmit={submitForm}>
            <h2 className='text-3xl text-center font-semibold mb-6'>Add Event</h2>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2"
                >Event Title</label
              >
              <input
                type="text"
                id="title"
                name="title"
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="eg. Join us In Miami"
                required
              />
            </div>


            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-700 font-bold mb-2"
                >Event Type</label
              >
              <select
                id="type"
                name="type"
                className="border rounded w-full py-2 px-3"
                required
              >
                <option value="Webinars">Webinars</option>
                <option value="Public Lectures">Public Lectures</option>
                <option value="Educational Seminars">Educational Seminars</option>
                <option value="Hands-on Activities">Hands-on Activities</option>
                <option value="Exhibitions">Exhibitions</option>
              </select>
            </div>


            <div className='mb-4'>
              <label className='block text-gray-700 font-bold mb-2'>
               Event Host
              </label>
              <input
                type='text'
                id='location'
                name='location'
                className='border rounded w-full py-2 px-3 mb-2'
                placeholder='Event Host'
                required           
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 font-bold mb-2"
                >Description</label
              >
              <textarea
                id="description"
                name="description"
                className="border rounded w-full py-2 px-3"
                rows="4"
                placeholder="Add any event description here"
              ></textarea>
            </div>


            <div className='mb-4'>
              <label className='block text-gray-700 font-bold mb-2'>
                Location
              </label>
              <input
                type='text'
                id='location'
                name='location'
                className='border rounded w-full py-2 px-3 mb-2'
                placeholder='Event Location'
                required           
              />
            </div>

            <div className='mb-4'>
              <label className='block text-gray-700 font-bold mb-2'>
                Time
              </label>
              <input
                type='text'
                id='time'
                name='time'
                className='border rounded w-full py-2 px-3 mb-2'
                placeholder='Event Time'
                required           
              />
            </div>

            <div className='mb-4'>
              <label className='block text-gray-700 font-bold mb-2'>
                Max Participants
              </label>
              <input
                type='number'
                min='1'
                max='100'
                id='maxParticipants'
                name='maxParticipants'
                className='border rounded w-full py-2 px-3 mb-2'
                placeholder='Max Participants'
                required           
              />
            </div>

            <div>
              <button
                className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
                type='submit'
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
export default AddEventPage;
