import { MdOutlineRestaurant, MdOutlineLocalMall } from "react-icons/md";
import { CiCoffeeCup } from "react-icons/ci";
import { FaEthereum, FaTshirt } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";

interface RewardCard {
  code: string;
  description: string;
  isExpired: boolean;
  expiryDate?: string;
  icon: JSX.Element;
}

const rewardCards: RewardCard[] = [
  {
    code: "FREE Coffee",
    description: "Get a free Coffee at Starbucks",
    isExpired: true,
    expiryDate: "8 Aug",
    icon: <CiCoffeeCup className="w-5 h-5 text-white" />,
  },
  {
    code: "BINGE150",
    description: "Get 10% OFF upto ₹150 on your next dining bill",
    isExpired: false,
    icon: <CiCoffeeCup className="w-5 h-5 text-white" />,
  },
  {
    code: "WEB3START",
    description: "Earn 0.01 ETH cashback on your first crypto transaction",
    isExpired: false,
    icon: <FaEthereum className="w-5 h-5 text-white" />,
  },
  {
    code: "WEB3START",
    description: "Earn 0.01 ETH cashback on your first crypto transaction",
    isExpired: true,
    icon: <FaEthereum className="w-5 h-5 text-white" />,
  },
  {
    code: "NFTLOOT",
    description: "Get a free NFT on purchases above ₹5000",
    isExpired: false,
    icon: <FaEthereum className="w-5 h-5 text-white" />,
  },
  {
    code: "SHOP200",
    description: "Get ₹200 OFF on your next shopping bill",
    isExpired: false,
    icon: <AiOutlineShoppingCart className="w-5 h-5 text-white" />,
  },
  {
    code: "CART100",
    description: "Flat ₹100 OFF on your cart value above ₹1000",
    isExpired: true,
    expiryDate: "3 Dec",
    icon: <MdOutlineLocalMall className="w-5 h-5 text-white" />,
  },
];

export function Rewards() {
  return (
    <div className="pt-16 px-4 sm:px-6 lg:px-8 mb-8 p-4">
      <div className="mb-6">
        <h2 className="text-3xl font-bold my-8 text-green">Your Rewards</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {rewardCards.map((card, index) => (
            <div
              key={index}
              className={`
                rounded-2xl 
                p-4 
                flex 
                flex-col 
                gap-2 
                bg-white 
                relative  
                before:absolute 
                before:inset-0 
                before:rounded-2xl
                before:border-8
                before:border-green
                before:-translate-x-2
                before:translate-y-2
                before:-z-10
                border-[3px]
                border-black
                transition-all
              `}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  card.isExpired ? "bg-gray-700" : "bg-green-600"
                }`}
              >
                {card.icon}
              </div>
              <div className="space-y-0.5">
                <h3
                  className={`text-lg font-bold ${
                    card.isExpired ? "text-gray-500" : "text-green-600"
                  }`}
                >
                  {card.code}
                </h3>
                <p
                  className={`text-xs ${
                    card.isExpired ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {card.description}
                </p>
              </div>
              <div className="border-t border-dashed border-gray-300 my-2"></div>
              {card.isExpired ? (
                <p className="text-gray-500 text-xs">
                  Expired on {card.expiryDate}
                </p>
              ) : (
                <button className="text-red-400 text-xs font-medium hover:text-red-500 transition-colors">
                  View details
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
