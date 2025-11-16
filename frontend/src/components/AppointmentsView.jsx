import { useState } from "react"
import axios from "axios"

function AppointmentsView({ appointments, setAppointments, userId }) {
  const [showForm, setShowForm] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    doctor: "",
    date: "",
    time: "",
  })

  const handleChange = (e) => {
    setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { title, doctor, date, time } = newAppointment
    if (!title || !doctor || !date || !time) {
      alert("Please fill all fields.")
      return
    }

    const newAppt = { userId, title, doctor, date, time }
    try {
      const res = await axios.post("https://pcod-healthcare.onrender.com/api/appointments", newAppt)
      setAppointments([res.data, ...appointments])
      setShowForm(false)
      setNewAppointment({ title: "", doctor: "", date: "", time: "" })
      alert("Appointment scheduled successfully!")
    } catch (err) {
      console.error("Error creating appointment:", err)
      alert("Failed to schedule appointment.")
    }
  }

  const handleReschedule = async (id) => {
    const date = prompt("Enter new date (e.g., 30 May 2025):")
    const time = prompt("Enter new time (e.g., 4:00 PM):")

    if (date && time) {
      const res = await axios.put(`https://pcod-healthcare.onrender.com/api/appointments/${id}`, { date, time })
      setAppointments(appointments.map((a) => (a._id === id ? res.data : a)))
      alert("Appointment rescheduled successfully!")
    }
  }

  const handleCancel = async (id) => {
    if (window.confirm("Cancel this appointment?")) {
      await axios.delete(`https://pcod-healthcare.onrender.com/api/appointments/${id}`)
      setAppointments(appointments.filter((a) => a._id !== id))
      alert("Appointment cancelled successfully.")
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 relative">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>

      {appointments.length > 0 ? (
        <div className="space-y-4 mb-6">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{appointment.title}</h3>
                <span className="text-sm text-gray-500">{appointment.date}</span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-gray-700">
                  <span className="font-medium">Time:</span> {appointment.time}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Doctor:</span> {appointment.doctor}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleReschedule(appointment._id)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => handleCancel(appointment._id)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6">You have no upcoming appointments.</p>
      )}

      <button
        onClick={() => setShowForm(true)}
        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Schedule New Appointment
      </button>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
              Schedule New Appointment
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Appointment Title</label>
                <input
                  type="text"
                  name="title"
                  value={newAppointment.title}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="e.g., Dental Checkup"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Doctor's Name</label>
                <input
                  type="text"
                  name="doctor"
                  value={newAppointment.doctor}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="e.g., Dr. Sharma"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newAppointment.date}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={newAppointment.time}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentsView