export default function NavHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            <a href="/">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✨</span>
                </div>
            </a>

          <div className="flex items-center gap-6">
            <a
              href="/schedule"
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              My Schedule
            </a>
            <a
              href="/create"
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Create
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}