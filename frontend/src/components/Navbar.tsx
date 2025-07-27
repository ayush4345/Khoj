import { RiTreasureMapFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import WalletWrapper from "@/helpers/WalletWrapper";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <RiTreasureMapFill className="text-green text-2xl" />
              Khoj
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-green">
                Hunts
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-green">
                Profile
              </Link>
              <Link
                to="/hunt/create"
                className="text-gray-700 hover:text-green"
              >
                Create Hunt
              </Link>
            </div>
          </div>

          {/* Wallet Connect */}
          <div className="flex items-center text-black ml-1 md:ml-2">
            <WalletWrapper
              className="bg-yellow/80 border border-black text-black rounded-xl
                hover:bg-yellow/80 px-2 py-1 text-xs md:text-sm font-medium"
              text="Connect Wallet"
              withWalletAggregator={true}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
