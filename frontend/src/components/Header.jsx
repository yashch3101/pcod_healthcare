import { Menu } from "lucide-react";
import WalletConnect from "./WalletConnect";

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <button className="text-gray-500 hover:text-gray-700 md:hidden">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-600 font-medium hover:text-gray-800">
            Health
          </a>
          <a href="#" className="text-gray-600 font-medium hover:text-gray-800">
            Community
          </a>
          <a href="#" className="text-gray-600 font-medium hover:text-gray-800">
            CycleTracker
          </a>
          <a href="#" className="text-gray-600 font-medium hover:text-gray-800">
            Dashboard
          </a>
        </div>
      </div>

      {/* 🟢 WalletConnect button here */}
      <WalletConnect />
    </header>
  );
}

export default Header;
