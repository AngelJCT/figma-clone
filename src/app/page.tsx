export default function Home() {
  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col">
      <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4">
        <h1 className="text-lg font-semibold">Figma Clone</h1>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Figma Clone</h2>
          <p className="text-gray-400 mb-6">
            A simplified multi-device web design tool
          </p>
          <div className="text-sm text-gray-500">
            Phase 1 Complete: Project setup with TypeScript, Tailwind CSS, and Zustand
          </div>
        </div>
      </main>
    </div>
  );
}
