import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createUser } from '../services/user';
import { toast } from 'react-toastify';
import {useNavigate} from "react-router-dom";
import { Link } from 'react-router-dom';


const RegisterPage = () => {

    const navigator = useNavigate()

    return (
        <section className="bg-blue-50 px-4 py-20">
            <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">Create Your Account</h2>

                <Formik
                    initialValues={{
                        username: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        phone: '',
                        description: ''
                    }}
                    validationSchema={Yup.object({
                        username: Yup.string().required('username is required'),
                        email: Yup.string().email('Invalid email address').required('email is required'),
                        password: Yup.string().required('password is required'),
                        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('password is required'),
                        phone: Yup.number().required('phone number is required'),
                        description: Yup.string().max(255, 'Must be 255 characters or less'),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            await createUser(values)
                            setSubmitting(false);
                            toast.success('You are successfully registered.');
                            navigator("/login")
                        } catch (error) {
                            console.log(JSON.stringify(error));
                            toast.error(error.message);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="p-4">
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-gray-700">User Name</label>
                                    <Field type="text" id="username" name="username" required
                                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                    <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-2" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-700">Email Address</label>
                                    <Field type="email" id="email" name="email" required
                                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-2" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="block text-gray-700">Password</label>
                                    <Field type="password" id="password" name="password" required
                                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-2" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
                                    <Field type="password" id="confirmPassword" name="confirmPassword" required
                                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-2" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="phone" className="block text-gray-700">Phone Number</label>
                                    <Field type="tel" id="phone" name="phone" required
                                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                    <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-2" />
                                </div>
                                {/* <div className="mb-4">
                                    <label htmlFor="description" className="block text-gray-700">Description</label>
                                    <Field id="description" name="description" as="textarea"
                                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-2" />
                                </div> */}
                            </div>
                            <div className="mb-4">
                                <button type="submit" disabled={isSubmitting}
                                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md text-lg font-semibold">Register</button>
                            </div>
                            <div className="text-center text-gray-700">
                                Already have an account? <Link to="/login"
                                    className="text-indigo-500 hover:text-indigo-700">Login</Link>
                            </div>
                        </Form>)}
                </Formik>
            </div>
        </section >
    )
}

export default RegisterPage;