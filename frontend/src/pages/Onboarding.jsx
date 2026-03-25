import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Onboarding() {

  const { user } = useUser();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [customInput, setCustomInput] = useState("");

  const [form, setForm] = useState({
    role: "",
    dietType: "",
    healthConditions: [],
    allergies: [],
    age: "",
    weight: "",
    goal: ""
  });

  const next = () => setStep(prev => prev + 1);
  const back = () => setStep(prev => prev - 1);

  const toggle = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

 const handleSubmit = async () => {
  try {
    const payload = {
      clerkId: user.id,
      name: user.fullName,
      email: user.primaryEmailAddress.emailAddress,
      ...form
    };

    console.log("📝 Submitting onboarding form:", payload);

    const res = await fetch("http://localhost:5000/api/users/onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    console.log("✅ Onboarding response:", data);

    // 🔥 FORCE RELOAD APP STATE
    window.location.href = "/";

  } catch (err) {
    console.error("❌ Onboarding failed:", err);
    alert("Error: " + err.message);
  }
};
  const cardAnimation = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f6f4ef]">

      <div className="bg-white p-8 rounded-2xl w-[420px] shadow-xl">

        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-2 rounded mb-6">
          <div
            className="bg-green-500 h-2 rounded"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 1 - ROLE SELECTION */}
          {step === 1 && (
            <motion.div key="step1" {...cardAnimation}>
              <h2 className="text-xl font-bold mb-4">What's Your Role?</h2>

              <button
                onClick={() => {
                  setForm({ ...form, role: "user" });
                  next();
                }}
                className="w-full mb-3 p-3 rounded-lg border hover:bg-green-100"
              >
                👤 Regular User
              </button>

              <button
                onClick={() => {
                  setForm({ ...form, role: "dietician" });
                  next();
                }}
                className="w-full mb-3 p-3 rounded-lg border hover:bg-blue-100"
              >
                🏥 Dietician
              </button>
            </motion.div>
          )}

          {/* STEP 2 - DIET TYPE */}
          {step === 2 && (
            <motion.div key="step2" {...cardAnimation}>
              <h2 className="text-xl font-bold mb-4">Diet Type</h2>

              {["Veg", "Non-Veg", "Vegan"].map(item => (
                <button
                  key={item}
                  onClick={() => {
                    setForm({ ...form, dietType: item });
                    next();
                  }}
                  className="w-full mb-3 p-3 rounded-lg border hover:bg-green-100"
                >
                  {item}
                </button>
              ))}

              {/* OTHER OPTION */}
              <input
                type="text"
                placeholder="Other..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full border p-3 rounded mb-3"
              />

              <button
                onClick={() => {
                  if (customInput.trim()) {
                    setForm({ ...form, dietType: customInput });
                    next();
                  }
                }}
                className="w-full mb-3 bg-gray-200 py-2 rounded"
              >
                Use Other
              </button>

              {/* SKIP */}
              <button
                onClick={next}
                className="w-full text-gray-500 underline"
              >
                Skip
              </button>
            </motion.div>
          )}

          {/* STEP 3 - HEALTH CONDITIONS */}
          {step === 3 && (
            <motion.div key="step3" {...cardAnimation}>
              <h2 className="text-xl font-bold mb-4">Health Conditions</h2>

              {["Diabetes", "BP", "Cholesterol"].map(item => (
                <button
                  key={item}
                  onClick={() => toggle("healthConditions", item)}
                  className={`w-full mb-3 p-3 rounded-lg border ${form.healthConditions.includes(item)
                    ? "bg-green-500 text-white"
                    : "hover:bg-gray-100"
                    }`}
                >
                  {item}
                </button>
              ))}

              <button onClick={next} className="mt-4 w-full bg-black text-white py-2 rounded">
                Next
              </button>
              <button
                onClick={next}
                className="mt-2 w-full text-gray-500 underline"
              >
                Skip
              </button>
            </motion.div>
          )}

          {/* STEP 4 - ALLERGIES */}
          {step === 4 && (
            <motion.div key="step4" {...cardAnimation}>
              <h2 className="text-xl font-bold mb-4">Allergies</h2>

              {["Nuts", "Dairy", "Gluten"].map(item => (
                <button
                  key={item}
                  onClick={() => toggle("allergies", item)}
                  className={`w-full mb-3 p-3 rounded-lg border ${form.allergies.includes(item)
                    ? "bg-green-500 text-white"
                    : "hover:bg-gray-100"
                    }`}
                >
                  {item}
                </button>
              ))}

              <button onClick={next} className="mt-4 w-full bg-black text-white py-2 rounded">
                Next
              </button>
              <button
                onClick={next}
                className="mt-2 w-full text-gray-500 underline"
              >
                Skip
              </button>
            </motion.div>
          )}

          {/* STEP 5 - USER INFO */}
          {step === 5 && (
            <motion.div key="step5" {...cardAnimation}>
              <h2 className="text-xl font-bold mb-4">Your Info</h2>

              <input
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                className="w-full border p-3 rounded mb-3"
              />

              <input
                type="number"
                placeholder="Weight (kg)"
                value={form.weight}
                onChange={e => setForm({ ...form, weight: e.target.value })}
                className="w-full border p-3 rounded"
              />

              <button onClick={next} className="mt-4 w-full bg-black text-white py-2 rounded">
                Next
              </button>
              <button
                onClick={next}
                className="mt-2 w-full text-gray-500 underline"
              >
                Skip
              </button>
            </motion.div>
          )}

          {/* STEP 6 - GOAL */}
          {step === 6 && (
            <motion.div key="step6" {...cardAnimation}>
              <h2 className="text-xl font-bold mb-4">Goal</h2>

              {["Weight Loss", "Muscle Gain", "Maintain"].map(item => (
                <button
                  key={item}
                  onClick={() => setForm({ ...form, goal: item })}
                  className={`w-full mb-3 p-3 rounded-lg border ${form.goal === item
                    ? "bg-green-500 text-white"
                    : "hover:bg-gray-100"
                    }`}
                >
                  {item}
                </button>
              ))}

              <input
                type="text"
                placeholder="Other goal..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full border p-3 rounded mb-3"
              />

              <button
                onClick={() => {
                  if (customInput.trim()) {
                    setForm({ ...form, goal: customInput });
                  }
                  handleSubmit();
                }}
                className="w-full bg-gray-200 py-2 rounded"
              >
                Use Other
              </button>

              <button
                onClick={handleSubmit}
                className="mt-3 w-full bg-green-500 text-white py-2 rounded"
              >
                Finish
              </button>

              <button
                onClick={handleSubmit}
                className="mt-2 w-full text-gray-500 underline"
              >
                Skip
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export default Onboarding;