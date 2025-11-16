import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ExerciseList } from "@/components/ExerciseList"
import { MonthlyCalendar } from "@/components/MonthlyCalendar"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function TrackerDetail() {
  const [selectedExercises, setSelectedExercises] = useState([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (selectedExercises.length === 0) {
      setProgress(0)
      return
    }

    const completedCount = selectedExercises.filter((ex) => ex.completed).length
    const newProgress = Math.round((completedCount / selectedExercises.length) * 100)
    setProgress(newProgress)
  }, [selectedExercises])

  useEffect(() => {
    if (progress === 100) {
      const userId = localStorage.getItem("userId") || "demoUser";

      axios.post("https://pcod-healthcare.onrender.com/api/progress/complete", { userId })
        .then(() => {
          toast.success("🎉 Great job! All exercises completed today!");
        })
        .catch((err) => console.error("Error updating progress:", err));
    }
  }, [progress]);

  const toggleExerciseCompletion = (id) => {
    setSelectedExercises((prev) => prev.map((ex) => (ex.id === id ? { ...ex, completed: !ex.completed } : ex)))
  }

  const addExercise = (exercise) => {
    setSelectedExercises((prev) => [...prev, exercise])
  }

  return (
    <>
   {/* <Navbar/> */}
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Daily Exercises</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-full">
                    + Add Exercise
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Exercise</DialogTitle>
                  </DialogHeader>
                  <ExerciseList onSelectExercise={addExercise} />
                </DialogContent>
              </Dialog>
            </div>

            {selectedExercises.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No exercises added yet. Click "Add Exercise" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {selectedExercises.map((exercise) => (
                  <div key={exercise.id} className="flex items-center border rounded-lg p-4">
                    <Checkbox
                      id={exercise.id}
                      checked={exercise.completed}
                      onCheckedChange={() => toggleExerciseCompletion(exercise.id)}
                      className="mr-4"
                    />
                    <div className="flex-1">
                      <label htmlFor={exercise.id} className="font-medium cursor-pointer">
                        {exercise.name}
                      </label>
                      <p className="text-sm text-gray-500">{exercise.duration}</p>
                    </div>
                    <img
                      src={exercise.image || "/placeholder.svg"}
                      alt={exercise.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Daily Progress</h2>
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-purple-600">{progress}%</span>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="8"
                      strokeDasharray={`${(2 * Math.PI * 40 * progress) / 100} ${(2 * Math.PI * 40 * (100 - progress)) / 100}`}
                      strokeDashoffset={2 * Math.PI * 40 * 0.25}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Monthly Progress</h2>
              <MonthlyCalendar />
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  )
}
