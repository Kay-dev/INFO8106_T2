import { useEffect, useState, } from 'react';
import { useNavigate,useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DateRangePicker } from 'rsuite';
import { getHosts } from "../services/user";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';


const AddEventPage = ({ saveEventSubmit, edit=false }) => {
  const [hostList, setHostList] = useState([]);
  const [curEvent, setCurEvent] = useState({});

  const navigate = useNavigate();
  const e = useLoaderData();


  useEffect(() => {
    getHosts().then((data) => {
      setHostList(data);
    });
    if(edit) {
      setCurEvent({
        id: e.id,
        title: e.title,
        type: e.type,
        description: e.description,
        location: e.location,
        maxParticipants: e.maxParticipants,
        startTime: new Date(e.startTime),
        endTime: new Date(e.endTime),
        time: [new Date(e.startTime), new Date(e.endTime)],
        host: e.host.id
      })
    } else{
      setCurEvent({
        title: '',
        type: '',
        description: '',
        location: '',
        maxParticipants: '',
        startTime: new Date(),
        endTime: new Date(),
        time: [new Date(), new Date()],
        host: ''
      })
    }
  }, [e, edit]);

  const pageTitle = edit ? 'Edit Event' : 'Add Event';

  return (
    <section className='bg-indigo-50'>
      <div className='container m-auto max-w-2xl py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <h2 className='text-3xl text-center font-semibold mb-6'>{pageTitle}</h2>
          <Formik
            initialValues={
              curEvent
            }
            enableReinitialize={true}
            validationSchema={Yup.object({
              title: Yup.string().required('title is required'),
              type: Yup.string().required('type is required'),
              description: Yup.string().max(255, 'Must be 255 characters or less').required('description is required'),
              location: Yup.string().required('location is required'),
              maxParticipants: Yup.number().required('maxParticipants is required'),
              time: Yup.array().required('time is required'),
              host: Yup.string().required('host is required'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const { time, ...newValues } = values;
                newValues.startTime = dayjs(newValues.startTime).format('YYYY-MM-DD HH:mm:ss');
                newValues.endTime = dayjs(newValues.endTime).format('YYYY-MM-DD HH:mm:ss');
                await saveEventSubmit(newValues);
                setSubmitting(false);
                toast.success('You are successfully registered.');
                return navigate('/events');
              } catch (error) {
                setSubmitting(false);
                toast.error(error.message);
              }
            }}>
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                <Field type="hidden" name="id" value={values.id} />

                <div className="mb-4">
                  <label htmlFor="title" className="block text-gray-700 font-bold mb-2"
                  >Event Title</label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    className="border rounded w-full py-2 px-3 mb-2"
                    required
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500" />
                </div>

                <div className="mb-4">
                  <label htmlFor="type" className="block text-gray-700 font-bold mb-2"
                  >Event Type</label>
                  <Field
                    as="select"
                    id="type"
                    name="type"
                    className="border rounded w-full py-2 px-3 mb-2"
                    required
                  >
                    <option value="" label="--------Select type--------" />

                    <option value="Webinars">Webinars</option>
                    <option value="Public Lectures">Public Lectures</option>
                    <option value="Educational Seminars">Educational Seminars</option>
                    <option value="Hands-on Activities">Hands-on Activities</option>
                    <option value="Exhibitions">Exhibitions</option>
                  </Field>
                  <ErrorMessage name="type" component="div" className="text-red-500" />
                </div>

                <div className="mb-4">
                  <label htmlFor="host" className="block text-gray-700 font-bold mb-2"
                  >Event Host</label>
                  <Field
                    as="select"
                    id="host"
                    name="host"
                    className="border rounded w-full py-2 px-3 mb-2"
                    required
                  >
                    <option value="" label="--------Select host--------" />
                    {hostList.map((host) => (
                      <option key={host.id} value={host.id}>{host.username}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="host" component="div" className="text-red-500" />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-700 font-bold mb-2"
                  >Event Description</label>
                  <Field
                    as="textarea"
                    rows="5"
                    id="description"
                    name="description"
                    className="border rounded w-full py-2 px-3 mb-2"
                    required
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500" />
                </div>

                <div className="mb-4">
                  <label htmlFor="location" className="block text-gray-700 font-bold mb-2"
                  >Event Location</label>
                  <Field
                    type="text"
                    id="location"
                    name="location"
                    className="border rounded w-full py-2 px-3 mb-2"
                    placeholder="eg. New York"
                    required
                  />
                  <ErrorMessage name="location" component="div" className="text-red-500" />
                </div>

                <div className="mb-4">
                  <label htmlFor="time" className="block text-gray-700 font-bold mb-2">
                    Event Time</label>
                  <DateRangePicker 
                  id="time" 
                  name="time" 
                  format="yyyy-MM-dd HH:mm" 
                  value={values.time}
                  onChange={(value) => {
                    setFieldValue("time", value);
                    setFieldValue('startTime', value[0]);
                    setFieldValue('endTime', value[1]);
                  }}
                  />
                  <ErrorMessage name="time" component="div" className="text-red-500" />
                </div>

                <div className="mb-4">
                  <label htmlFor="maxParticipants" className="block text-gray-700 font-bold mb-2"
                  >Max Participants</label>
                  <Field
                    type="number"
                    min="1"
                    max="30"
                    id="maxParticipants"
                    name="maxParticipants"
                    className="border rounded w-full py-2 px-3 mb-2"
                    required
                  />
                  <ErrorMessage name="maxParticipants" component="div" className="text-red-500" />
                </div>

                <div className="mb-4">
                  <button type="submit" disabled={isSubmitting}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md text-lg font-semibold">Save</button>
                </div>

              </Form>
            )}
          </Formik>


        </div>
      </div>
    </section >
  );
};
export default AddEventPage;
