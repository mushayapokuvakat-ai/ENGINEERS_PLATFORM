export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-5xl font-bold text-navy-500 mb-6">
          AU Engineers Platform
        </h1>
        <p className="text-xl text-gray-700 mb-10 leading-relaxed">
          A private engineering collaboration network for Africa University students focused on project building, team formation, accountability, and technical growth.
        </p>
        
        <div className="flex gap-4 justify-center">
          <a href="/login" className="btn-primary text-lg px-8 py-3">
            Sign In
          </a>
          <a href="/register" className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-lg px-8 py-3 rounded-md transition-all shadow-sm">
            Sign Up
          </a>
        </div>
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl px-4">
        <div className="card p-6">
          <h3 className="text-xl font-bold text-navy-500 mb-2">Build Projects</h3>
          <p className="text-gray-600">Collaborate on real-world engineering solutions.</p>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-bold text-navy-500 mb-2">Form Teams</h3>
          <p className="text-gray-600">Find teammates with the technical skills you need.</p>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-bold text-navy-500 mb-2">Technical Growth</h3>
          <p className="text-gray-600">Learn through mandatory project cycles and peer reviews.</p>
        </div>
      </div>
    </div>
  );
}
