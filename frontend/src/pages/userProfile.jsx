import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
PencilIcon,
CheckIcon,
UserIcon,
HeartIcon,
SparklesIcon,
} from "@heroicons/react/24/outline";

// ── helpers ─────────────────────────
function Badge({ children }) {
return ( <span className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
{children} </span>
);
}

function Field({ label, value, editing, onChange }) {
return ( <div className="flex flex-col gap-1"> <span className="text-xs text-gray-400">{label}</span>


  {editing ? (
    <input
      className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded px-2 py-1"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  ) : (
    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
      {value || "Not provided"}
    </span>
  )}
</div>


);
}

function SectionCard({ title, icon: Icon, editing, onEdit, onSave, children }) {
return ( <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow-lg transition border border-gray-100 dark:border-gray-800"> <div className="flex justify-between items-center mb-4"> <div className="flex items-center gap-2"> <Icon className="h-5 w-5 text-yellow-500" /> <h3 className="font-semibold text-gray-900 dark:text-white">
{title} </h3> </div>


    {!editing ? (
      <button onClick={onEdit}>
        <PencilIcon className="h-4 w-4 text-gray-500 hover:text-yellow-500" />
      </button>
    ) : (
      <button onClick={onSave}>
        <CheckIcon className="h-4 w-4 text-green-500" />
      </button>
    )}
  </div>

  {children}
</div>


);
}

// ── main ─────────────────────────
function UserInfo() {
const { user } = useUser();
const [userData, setUserData] = useState(null);
const [editSection, setEditSection] = useState(null);

useEffect(() => {
if (!user) return;


const fetchUser = async () => {
  const res = await fetch(
    `http://localhost:5000/api/users/${user.id}`
  );
  const data = await res.json();
  setUserData(data);
};

fetchUser();


}, [user]);

const handleSave = async () => {
const res = await fetch(
`http://localhost:5000/api/users/${user.id}`,
{
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(userData),
}
);


const data = await res.json();
setUserData(data);
setEditSection(null);


};

if (!userData) return <p className="text-center mt-10">Loading...</p>;

return ( <div className="flex min-h-screen bg-gray-50 dark:bg-black transition"> <Sidebar />


  <div className="flex-1">
    <Navbar />

    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden">

        {/* gradient top */}
        <div className="h-20 bg-gradient-to-r from-yellow-300 to-orange-200 dark:from-gray-800 dark:to-gray-700"></div>

        <div className="p-6 -mt-10">
          <div className="flex items-center gap-4">
            <img
              src={user?.imageUrl}
              className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-900 shadow"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {userData.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {userData.email}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            <Badge>Age: {userData.age}</Badge>
            <Badge>{userData.weight} kg</Badge>
            <Badge>{userData.goal}</Badge>
          </div>
        </div>
      </div>

      {/* PERSONAL */}
      <SectionCard
        title="Personal Information"
        icon={UserIcon}
        editing={editSection === "personal"}
        onEdit={() => setEditSection("personal")}
        onSave={handleSave}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Name"
            value={userData.name}
            editing={editSection === "personal"}
            onChange={(v) => setUserData({ ...userData, name: v })}
          />
          <Field
            label="Email"
            value={userData.email}
            editing={editSection === "personal"}
            onChange={(v) => setUserData({ ...userData, email: v })}
          />
          <Field
            label="Age"
            value={userData.age}
            editing={editSection === "personal"}
            onChange={(v) => setUserData({ ...userData, age: v })}
          />
          <Field
            label="Weight"
            value={userData.weight}
            editing={editSection === "personal"}
            onChange={(v) => setUserData({ ...userData, weight: v })}
          />
        </div>
      </SectionCard>

      {/* HEALTH */}
      <SectionCard
        title="Health Details"
        icon={HeartIcon}
        editing={editSection === "health"}
        onEdit={() => setEditSection("health")}
        onSave={handleSave}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Allergies"
            value={userData.allergies}
            editing={editSection === "health"}
            onChange={(v) =>
              setUserData({ ...userData, allergies: v })
            }
          />
          <Field
            label="Conditions"
            value={userData.healthConditions}
            editing={editSection === "health"}
            onChange={(v) =>
              setUserData({ ...userData, healthConditions: v })
            }
          />
          <Field
            label="Goal"
            value={userData.goal}
            editing={editSection === "health"}
            onChange={(v) =>
              setUserData({ ...userData, goal: v })
            }
          />
        </div>
      </SectionCard>

      {/* DIET */}
      <SectionCard
        title="Dietary Preferences"
        icon={SparklesIcon}
        editing={editSection === "diet"}
        onEdit={() => setEditSection("diet")}
        onSave={handleSave}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Diet Type"
            value={userData.dietType}
            editing={editSection === "diet"}
            onChange={(v) =>
              setUserData({ ...userData, dietType: v })
            }
          />
        </div>
      </SectionCard>

    </div>
  </div>
</div>


);
}

export default UserInfo;
