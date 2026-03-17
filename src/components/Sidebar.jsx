function Sidebar() {
  return (
    <div className="w-64 bg-white p-6 flex flex-col justify-between rounded-r-3xl">
      <div>
        <a href="/">
        <h3 className="cursor-pointer text-2xl font-bold mb-8">BiteRite</h3>
        </a>

        <a href="/user">
        <div className="cursor-pointer flex items-center gap-3 mb-10" >
          <div className="w-12 h-12 rounded-full bg-gray-300" > 
            <img src="src\assets\randomAhh\pfp.jpg" alt="pfp" className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <p className="font-medium">Jeffrey Epstien</p>
            <p className="text-sm text-gray-500">  </p>
          </div>
        </div>
        </a>
        

        <nav className="space-y-4">
          <button className="w-full text-left px-4 py-2 rounded-lg bg-yellow-400 font-medium">
            Recipes
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Favorites
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Community
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
