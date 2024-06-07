
const RegisterPage = () => {

    return (
        <section className="bg-blue-50 px-4 py-20">
            <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">Create Your Account</h2>
                <form action="register" method="POST">
                    <div className="p-4">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700">User Name</label>
                            <input type="text" id="name" name="name" required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">Email Address</label>
                            <input type="email" id="email" name="email" required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700">Password</label>
                            <input type="password" id="password" name="password" required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirm-password" className="block text-gray-700">Confirm Password</label>
                            <input type="password" id="confirm-password" name="confirm-password" required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-gray-700">Phone Number</label>
                            <input type="tel" id="phone" name="phone" required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="info" className="block text-gray-700">Description</label>
                            <textarea id="info" name="info"
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <button type="submit"
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md text-lg font-semibold">Register</button>
                    </div>
                    <div className="text-center text-gray-700">
                        Already have an account? <a href="/login"
                            className="text-indigo-500 hover:text-indigo-700">Login</a>
                    </div>
                </form>
            </div>
        </section >
    )
}

export default RegisterPage;