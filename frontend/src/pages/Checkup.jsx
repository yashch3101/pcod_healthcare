import React, { useState } from "react";
import axios from "axios";

const Checkup = () => {
    const [formData, setFormData] = useState({
        height: "",
        weight: "",
        age: "",
        cycleLength: "",
        regularPeriods: "",
        symptoms: [],
        tsh: "",
        fsh: "",
        lh: "",
        insulin: "",
        consent: false,
    });

    const [bmi, setBmi] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const calculateBMI = (height, weight) => {
        if (height > 0 && weight > 0) {
            const heightInMeters = height / 100;
            const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
            setBmi(bmiValue);
        } else {
            setBmi("");
        }
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData({ ...formData, [name]: name === "consent" ? checked : value });

        if (name === "height" || name === "weight") {
            calculateBMI(
                name === "height" ? value : formData.height,
                name === "weight" ? value : formData.weight
            );
        }
    };

    const handleSymptomChange = (symptom) => {
        const updated = formData.symptoms.includes(symptom)
            ? formData.symptoms.filter((s) => s !== symptom)
            : [...formData.symptoms, symptom];

        setFormData({ ...formData, symptoms: updated });
    };

    const handleSubmit = async () => {
        if (!formData.consent) {
            alert("Please agree to share the information.");
            return;
        }

        setLoading(true);

        const payload = {
            "Age": Number(formData.age),
            "Weight": Number(formData.weight),
            "Height(Cm)": Number(formData.height),
            "BMI": Number(bmi),
            "Cycle(I/R)": formData.regularPeriods === "yes" ? 1 : 0,
            "Cycle length": Number(formData.cycleLength),
            "FSH(mIU/mL)": Number(formData.fsh),
            "LH(mIU/mL)": Number(formData.lh),
            "FSH/LH ratio": (formData.fsh && formData.lh && formData.lh !== "0")
                ? Number((formData.fsh / formData.lh).toFixed(2))
                : 0,
            "TSH (mIU/L)": Number(formData.tsh),
            "Hair growth": formData.symptoms.includes("Excess Hair Growth") ? 1 : 0,
            "Skin darkening": formData.symptoms.includes("Heavy Bleeding") ? 1 : 0,
            "Acne": formData.symptoms.includes("Pimples") ? 1 : 0,
            "Insulin levels (æIU/ml)": Number(formData.insulin) || 10.5,
        };

        try {
            const response = await axios.post("https://pcod-ml.onrender.com/predict", payload, {
                headers: {
                "x-api-key": "health-checker",
                "Content-Type": "application/json"
            },
            });
            setResult(response.data.message);
        } catch (error) {
            console.error(error);
            setResult("Something went wrong. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col p-8">
            <main className="flex-1 max-w-3xl mx-auto py-10 bg-white rounded-xl shadow-lg p-6 bg-gradient-to-r from-blue-300 to-pink-300">
                <h1 className="text-4xl font-bold mb-6 text-blue-600">🩺 PCOD Health Checkup</h1>
                <p className="text-gray-700 text-lg">We'll ask a few questions to personalize your care journey.</p>

                <div className="mt-8 p-6 rounded-xl bg-white shadow-md">
                    {/* Basic Details */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Basic Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                placeholder="Height (cm)"
                                className="border p-3 rounded-md transition duration-300 hover:shadow-md"
                            />
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="Weight (kg)"
                                className="border p-3 rounded-md transition duration-300 hover:shadow-md"
                            />
                            <input
                                type="text"
                                value={bmi}
                                placeholder="BMI (Auto-calculated)"
                                className="border p-3 rounded-md bg-gray-100"
                                readOnly
                            />
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Age"
                                className="border p-3 rounded-md transition duration-300 hover:shadow-md"
                            />
                            <div className="flex items-center gap-4">
                                <span>Regular Periods:</span>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="regularPeriods"
                                        value="yes"
                                        onChange={handleChange}
                                        checked={formData.regularPeriods === "yes"}
                                        className="mr-2"
                                    />
                                    Yes
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="regularPeriods"
                                        value="no"
                                        onChange={handleChange}
                                        checked={formData.regularPeriods === "no"}
                                        className="mr-2"
                                    />
                                    No
                                </label>
                            </div>
                            <input
                                type="number"
                                name="cycleLength"
                                value={formData.cycleLength}
                                onChange={handleChange}
                                placeholder="Cycle Length (days)"
                                className="border p-3 rounded-md transition duration-300 hover:shadow-md"
                            />
                        </div>
                    </section>

                    {/* Symptoms */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 text-pink-500">Symptoms & Lifestyle</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {["Heavy Bleeding", "Excess Hair Growth", "Pimples"].map((symptom) => (
                                <label key={symptom} className="flex items-center bg-pink-50 p-3 rounded-md hover:bg-pink-100 transition">
                                    <input
                                        type="checkbox"
                                        className="mr-3"
                                        checked={formData.symptoms.includes(symptom)}
                                        onChange={() => handleSymptomChange(symptom)}
                                    />
                                    {symptom}
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Medical History */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Medical History</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {["TSH", "FSH", "LH"].map((test) => (
                                <input
                                    key={test}
                                    type="number"
                                    name={test.toLowerCase()}
                                    value={formData[test.toLowerCase()]}
                                    onChange={handleChange}
                                    placeholder={`Enter ${test} level`}
                                    className="border p-3 rounded-md transition duration-300 hover:shadow-md"
                                />
                            ))}
                            {/* 🆕 Insulin input field */}
                            <input
                                type="number"
                                name="insulin"
                                value={formData.insulin}
                                onChange={handleChange}
                                placeholder="Enter Insulin Level (æIU/ml)"
                                className="border p-3 rounded-md transition duration-300 hover:shadow-md"
                            />
                        </div>
                    </section>

                    <div className="flex items-start gap-2 mb-6">
                        <input
                            type="checkbox"
                            name="consent"
                            checked={formData.consent}
                            onChange={handleChange}
                            className="mt-1"
                        />
                        <span>I agree to share the information for health evaluation process</span>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-blue-500 to-pink-500 text-white py-3 px-6 rounded-md hover:scale-105 transition"
                    >
                        {loading ? "Checking..." : "Check Your Result"}
                    </button>

                    {result && (
                        <div className="mt-6 p-4 bg-gray-100 rounded-md text-gray-800 shadow-inner">
                            <strong>Result:</strong> {result}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Checkup;
