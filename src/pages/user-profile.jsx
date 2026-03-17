import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  UserIcon,
  HeartIcon,
  SparklesIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";

// ── tiny helpers ──────────────────────────────────────────────
function Badge({ children, color = "yellow" }) {
  const map = {
    yellow: "bg-yellow-100 text-yellow-800",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${map[color]}`}>
      {children}
    </span>
  );
}

function Field({ label, value, editing, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </span>
      {editing ? (
        <input
          className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 transition"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <span className="text-sm text-gray-800 font-medium">{value}</span>
      )}
    </div>
  );
}

function SectionCard({ title, icon: Icon, editing, onEdit, onSave, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* card header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center">
            <Icon className="h-4 w-4 text-yellow-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>

        {!editing ? (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <PencilIcon className="h-3.5 w-3.5" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-yellow-400 hover:bg-yellow-500 rounded-lg transition"
            >
              <CheckIcon className="h-3.5 w-3.5" />
              Save
            </button>
            
          </div>
        )}
      </div>

      {/* card body */}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────
function UserInfo() {
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingHealth, setEditingHealth] = useState(false);
  const [editingDiet, setEditingDiet] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    gender: "Male",
    activity: "Moderate",
    sleep: "7 hours",
    lifestyle: "Active",
    occupation: "Student",
  });

  const [healthInfo, setHealthInfo] = useState({
    allergies: "None",
    conditions: "None",
    bp: "Normal",
    diabetes: "No",
    goal: "Weight Loss",
  });

  const [dietInfo, setDietInfo] = useState({
    type: "Vegetarian",
    cuisine: "Indian",
    meals: "4 meals/day",
    style: "Jain",
    avoids: "Processed sugar",
  });

  // draft copies so cancel works properly
  const [pDraft, setPDraft] = useState(personalInfo);
  const [hDraft, setHDraft] = useState(healthInfo);
  const [dDraft, setDDraft] = useState(dietInfo);

  return (
    <div className="flex min-h-screen bg-[#f6f4ef]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 p-8 max-w-4xl w-full mx-auto space-y-6">

          {/* ── Profile Header ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* banner */}
            <div className="h-24 bg-gradient-to-r from-yellow-300 via-yellow-200 to-amber-100 relative">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fbbf24 0%, transparent 60%), radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 50%)" }}
              />
            </div>

            {/* avatar + info row */}
            <div className="px-6 pb-5">
              <div className="flex items-end justify-between -mt-10 mb-4">
                {/* avatar */}
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white shadow-md">
                    <img
                      src="https://i.pravatar.cc/150"
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <CameraIcon className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              {/* name + stats */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">John Pork</h2>
                  <p className="text-sm text-gray-500 mt-0.5 max-w-md">
                    Loves cooking healthy meals and experimenting with balanced nutrition.
                  </p>
                </div>

                {/* stat pills */}
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Badge color="gray">Age: 67</Badge>
                  <Badge color="gray">175 cm</Badge>
                  <Badge color="gray">70 kg</Badge>
                  <Badge color="green">High Protein</Badge>
                  <Badge color="yellow">Muscle Gain</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* ── Personal Information ── */}
          <SectionCard
            title="Personal Information"
            icon={UserIcon}
            editing={editingPersonal}
            onEdit={() => { setPDraft(personalInfo); setEditingPersonal(true); }}
            onSave={() => { setPersonalInfo(pDraft); setEditingPersonal(false); }}
            
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
              <Field label="Gender" value={pDraft.gender} editing={editingPersonal}
                onChange={(v) => setPDraft({ ...pDraft, gender: v })} />
              <Field label="Activity Level" value={pDraft.activity} editing={editingPersonal}
                onChange={(v) => setPDraft({ ...pDraft, activity: v })} />
              <Field label="Sleep" value={pDraft.sleep} editing={editingPersonal}
                onChange={(v) => setPDraft({ ...pDraft, sleep: v })} />
              <Field label="Lifestyle" value={pDraft.lifestyle} editing={editingPersonal}
                onChange={(v) => setPDraft({ ...pDraft, lifestyle: v })} />
              <Field label="Occupation" value={pDraft.occupation} editing={editingPersonal}
                onChange={(v) => setPDraft({ ...pDraft, occupation: v })} />
            </div>
          </SectionCard>

          {/* ── Health Details ── */}
          <SectionCard
            title="Health Details"
            icon={HeartIcon}
            editing={editingHealth}
            onEdit={() => { setHDraft(healthInfo); setEditingHealth(true); }}
            onSave={() => { setHealthInfo(hDraft); setEditingHealth(false); }}
         
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
              <Field label="Allergies" value={hDraft.allergies} editing={editingHealth}
                onChange={(v) => setHDraft({ ...hDraft, allergies: v })} />
              <Field label="Medical Conditions" value={hDraft.conditions} editing={editingHealth}
                onChange={(v) => setHDraft({ ...hDraft, conditions: v })} />
              <Field label="Blood Pressure" value={hDraft.bp} editing={editingHealth}
                onChange={(v) => setHDraft({ ...hDraft, bp: v })} />
              <Field label="Diabetes" value={hDraft.diabetes} editing={editingHealth}
                onChange={(v) => setHDraft({ ...hDraft, diabetes: v })} />
              <Field label="Fitness Goal" value={hDraft.goal} editing={editingHealth}
                onChange={(v) => setHDraft({ ...hDraft, goal: v })} />
            </div>
          </SectionCard>

          {/* ── Dietary Preferences ── */}
          <SectionCard
            title="Dietary Preferences"
            icon={SparklesIcon}
            editing={editingDiet}
            onEdit={() => { setDDraft(dietInfo); setEditingDiet(true); }}
            onSave={() => { setDietInfo(dDraft); setEditingDiet(false); }}
          
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
              <Field label="Diet Type" value={dDraft.type} editing={editingDiet}
                onChange={(v) => setDDraft({ ...dDraft, type: v })} />
              <Field label="Cuisine Preference" value={dDraft.cuisine} editing={editingDiet}
                onChange={(v) => setDDraft({ ...dDraft, cuisine: v })} />
              <Field label="Meal Frequency" value={dDraft.meals} editing={editingDiet}
                onChange={(v) => setDDraft({ ...dDraft, meals: v })} />
              <Field label="Food Style" value={dDraft.style} editing={editingDiet}
                onChange={(v) => setDDraft({ ...dDraft, style: v })} />
              <Field label="Avoids" value={dDraft.avoids} editing={editingDiet}
                onChange={(v) => setDDraft({ ...dDraft, avoids: v })} />
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
}

export default UserInfo;