"use client";

export default function Footer() {
  const handleCallWaiter = () => {
    alert("Waiter has been notified and will arrive at your table shortly!");
  };

  return (
    <footer className="bg-white text-white fixed bottom-0 w-full p-4 shadow-lg flex justify-center z-50">
      <button
        onClick={handleCallWaiter}
        className="bg-customYellow text-white px-6 py-2 rounded-full shadow-md hover:bg-customYellow hover:text-white transition-all flex items-center gap-2 border border-customYellow"
      >
        <i className="fas fa-bell"></i> Call Waiter
      </button>
    </footer>
  );
}
