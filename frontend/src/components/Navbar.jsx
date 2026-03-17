function Navbar() {
  return (
    <div className="flex justify-between items-center">
      <input
        type="text"
        placeholder="Search recipes..."
        className="px-4 py-2 rounded-full w-80 border"
      />

      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-yellow-400 rounded-full font-medium">
          Premium
        </button>

        <div className="w-10 h-10 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}

export default Navbar;