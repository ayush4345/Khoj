import { SiPolkadot, SiCoinbase } from "react-icons/si";
import { RiTreasureMapFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import WalletWrapper from "@/helpers/WalletWrapper";
import { SUPPORTED_CHAINS } from "../lib/utils";
import { useState, useEffect } from "react";

// Mapping for user-friendly labels and icons
const NETWORK_META: Record<string, { label: string; icon: JSX.Element }> = {
  moonbeam: {
    label: "Moonbeam",
    icon: <SiPolkadot className="w-5 h-5 text-pink-600" />,
  },
  base: {
    label: "Base",
    icon: <SiCoinbase className="w-5 h-5 text-blue-500" />,
  },
  assetHub: {
    label: "Paseo AssetHub",
    icon: <SiPolkadot className="w-5 h-5 text-pink-600" />,
  },
};

export function Navbar() {
  const [currentNetwork, setCurrentNetwork] = useState<string>(
    Object.keys(SUPPORTED_CHAINS)[0]
  );

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("current_network");
    if (stored && SUPPORTED_CHAINS[stored as keyof typeof SUPPORTED_CHAINS])
      setCurrentNetwork(stored);
  }, []);

  const handleNetworkChange = (network: string) => {
    setCurrentNetwork(network);
    localStorage.setItem("current_network", network);

    // Switch the network in the wallet
    const chainId =
      SUPPORTED_CHAINS[network as keyof typeof SUPPORTED_CHAINS].id;
    console.log("chainId", chainId);
  };

  const renderSelectedNetwork = () => {
    return (
      NETWORK_META[currentNetwork]?.icon || (
        <SiPolkadot className="w-5 h-5 text-blue-500" />
      )
    );
  };

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

          {/* Navigation Links and Network Selector */}
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

            {/* Custom Network Selector */}
            <div className="relative">
              <select
                aria-label="Select network"
                value={currentNetwork}
                onChange={(e) => handleNetworkChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md 
                  w-24 h-10 pl-8 pr-2
                  hover:border-gray-400 focus:outline-none focus:ring-1 
                  focus:ring-green/20 focus:border-green cursor-pointer"
                style={{ textIndent: "-999px" }}
              >
                {Object.keys(SUPPORTED_CHAINS).map((key) => (
                  <option key={key} value={key}>
                    {NETWORK_META[key]?.label || key}
                  </option>
                ))}
              </select>
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                {renderSelectedNetwork()}
              </div>
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
