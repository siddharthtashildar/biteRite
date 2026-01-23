function Navbar() {
  return (
    <div className="flex justify-between items-center">
      <div className="relative">
        <input
          type="text"
          placeholder="Search recipes..."
          className="px-4 py-2 rounded-full w-80 border focus:outline-none"
        />
      </div>

      <button className="px-5 py-2 bg-yellow-400 rounded-full font-medium">
        Premium →
      </button>
    </div>
  );
}

export default Navbar;
