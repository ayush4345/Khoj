import { TbLadder, TbChessKnight } from "react-icons/tb";
import {
  FaChess,
  FaDice,
  FaCalendarAlt,
  FaUsers,
  FaCoins,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button.tsx";
import { useState, useMemo } from "react";

// Hardcoded hunt data for frontend-only prototype
const MOCK_HUNTS = [
  {
    id: 1,
    name: "Aptos Ecosystem Explorer",
    description:
      "Discover the vibrant Aptos ecosystem through interactive challenges and earn $GNU INU tokens!",
    startTime: "20241201",
    duration: "7 days",
    participantCount: 156,
    clues_blobId: "aptos-ecosystem-clues",
    answers_blobId: "aptos-ecosystem-answers",
    reward: "1000 $GNU INU",
    difficulty: "Beginner",
    category: "Ecosystem",
  },
  {
    id: 2,
    name: "DeFi Treasure Hunt",
    description:
      "Navigate through Aptos DeFi protocols and earn rewards in $GNU INU tokens",
    startTime: "20241205",
    duration: "5 days",
    participantCount: 89,
    clues_blobId: "defi-clues",
    answers_blobId: "defi-answers",
    reward: "750 $GNU INU",
    difficulty: "Intermediate",
    category: "DeFi",
  },
  {
    id: 3,
    name: "NFT Art Gallery Quest",
    description:
      "Explore digital art galleries and collect exclusive $GNU INU community NFTs",
    startTime: "20241210",
    duration: "3 days",
    participantCount: 234,
    clues_blobId: "nft-clues",
    answers_blobId: "nft-answers",
    reward: "500 $GNU INU + NFT",
    difficulty: "Beginner",
    category: "NFT",
  },
  {
    id: 4,
    name: "Aptos Developer Challenge",
    description:
      "Test your coding skills with Aptos Move smart contracts and earn developer rewards",
    startTime: "20241215",
    duration: "10 days",
    participantCount: 67,
    clues_blobId: "developer-clues",
    answers_blobId: "developer-answers",
    reward: "1500 $GNU INU",
    difficulty: "Advanced",
    category: "Development",
  },
  {
    id: 5,
    name: "Community Meme Hunt",
    description:
      "Create and share viral memes about Aptos and $GNU INU to earn community rewards",
    startTime: "20241220",
    duration: "4 days",
    participantCount: 445,
    clues_blobId: "meme-clues",
    answers_blobId: "meme-answers",
    reward: "300 $GNU INU",
    difficulty: "Beginner",
    category: "Community",
  },
];

interface Hunt {
  id: number;
  name: string;
  description: string;
  startTime: string;
  duration: string;
  participantCount: number;
  clues_blobId: string;
  answers_blobId: string;
  reward: string;
  difficulty: string;
  category: string;
}

export function Hunts() {
  const navigate = useNavigate();

  // Track registration status per hunt (true if registered, false if not)
  const [huntRegistrations, setHuntRegistrations] = useState<
    Record<number, boolean>
  >({});
  // Track which hunt is currently starting
  const [startingHunts, setStartingHunts] = useState<Record<number, boolean>>(
    {}
  );

  // Feature flag for hunt filtering - controlled by environment variable
  const enableHuntFiltering =
    import.meta.env.VITE_ENABLE_HUNT_FILTERING === "true";

  // Process hunts based on feature flag
  const processedHunts = useMemo(() => {
    if (!enableHuntFiltering) {
      return MOCK_HUNTS;
    }

    // Filter out hunts with 'Test' or 'hello' in name or description (case insensitive)
    // Also filter out hunts with descriptions smaller than 5 characters
    const filteredHunts = MOCK_HUNTS.filter((hunt: Hunt) => {
      const nameMatch =
        hunt.name.toLowerCase().includes("test") ||
        hunt.name.toLowerCase().includes("hello");
      const descriptionMatch =
        hunt.description.toLowerCase().includes("test") ||
        hunt.description.toLowerCase().includes("hello");
      const descriptionTooShort = hunt.description.length < 5;

      return !nameMatch && !descriptionMatch && !descriptionTooShort;
    });

    // Return only the last 5 hunts
    return filteredHunts.slice(-5);
  }, [enableHuntFiltering]);

  function formatDate(date: string) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  // Array of background colors and icons to rotate through
  const bgColors = ["bg-green", "bg-orange", "bg-yellow", "bg-pink", "bg-red"];
  const icons = [
    <TbLadder className="w-10 h-10 text-white" />,
    <TbChessKnight className="w-10 h-10 text-white" />,
    <FaChess className="w-10 h-10 text-white" />,
    <FaDice className="w-10 h-10 text-white" />,
  ];

  // Function to get button text and action based on hunt state
  const getButtonConfig = (hunt: Hunt, index: number) => {
    const huntStartTime = hunt.startTime;
    const isHuntStarted = huntStartTime <= today;
    const isRegistered = huntRegistrations[index];
    const isStarting = startingHunts[index];

    if (!isHuntStarted) {
      return {
        text: "Coming Soon",
        disabled: true,
        className:
          "bg-gray-400 cursor-not-allowed text-gray-600 border border-gray-300",
        action: null,
      };
    }

    if (!isRegistered) {
      return {
        text: "Register",
        disabled: false,
        className:
          "bg-yellow/70 border border-black text-white font-semibold hover:bg-yellow-600 hover:border-yellow-700 shadow-md hover:shadow-lg transform hover:scale-[1.02]",
        action: "register",
      };
    }

    return {
      text: isStarting ? "Starting..." : "Start",
      disabled: isStarting,
      className: isStarting
        ? "bg-gray-500 border border-gray-600 text-white font-semibold cursor-not-allowed"
        : "bg-green/70 border border-green text-white font-semibold hover:bg-green hover:border-green shadow-md hover:shadow-lg transform hover:scale-[1.02]",
      action: "start",
    };
  };

  const handleHuntStart = async (
    index: number,
    huntId: number,
    clues_blobId: string,
    answers_blobId: string
  ) => {
    // Set this hunt as starting
    setStartingHunts((prev) => ({ ...prev, [index]: true }));

    try {
      // Simulate loading time for smooth UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Starting hunt:", huntId, clues_blobId, answers_blobId);

      // Navigate to the hunt page
      navigate(`/hunt/${huntId}/clue/1`);
    } catch (error) {
      console.error("Error starting hunt:", error);
      toast.error("Failed to start hunt");
    } finally {
      // Remove this hunt from starting state
      setStartingHunts((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleRegisterSuccess = (huntIndex: number) => {
    console.log("Register success for hunt:", huntIndex);
    toast.success("Successfully registered for hunt!");

    // Update registration status for this specific hunt
    setHuntRegistrations((prev) => ({
      ...prev,
      [huntIndex]: true,
    }));
  };

  const handleRegister = (huntIndex: number) => {
    // Simulate registration process
    toast.loading("Registering for hunt...");

    setTimeout(() => {
      handleRegisterSuccess(huntIndex);
    }, 1500);
  };

  return (
    <div className="pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-[90px]">
      <h1 className="text-3xl font-bold my-8 text-green drop-shadow-xl">
        Hunts
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {processedHunts.map((hunt: Hunt, index: number) => {
          const buttonConfig = getButtonConfig(hunt, index);

          return (
            <div
              key={hunt.id}
              className="flex 
         bg-white rounded-lg h-64
        border-black 
          relative  
          before:absolute 
          before:inset-0 
          before:rounded-lg
          before:border-[16px]
          before:border-black
          before:-translate-x-2
          before:translate-y-2
          before:-z-10
          border-[3px]
          hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`w-1/4 flex items-center justify-center ${
                  bgColors[index % bgColors.length]
                }`}
              >
                {icons[index % icons.length]}
              </div>

              <div className="w-3/4 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-gray-800 h-[32px] overflow-hidden">
                      {hunt.name}
                    </h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        hunt.difficulty === "Beginner"
                          ? "bg-green/20 text-green"
                          : hunt.difficulty === "Intermediate"
                          ? "bg-yellow/20 text-yellow"
                          : "bg-red/20 text-red"
                      }`}
                    >
                      {hunt.difficulty}
                    </span>
                  </div>
                  <p className="text-[0.85rem] text-gray-600 line-clamp-2 mb-4">
                    {hunt.description}
                  </p>
                </div>

                <div className="mt-auto space-y-1.5 mb-3.5">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FaCalendarAlt className="w-3.5 h-3.5" />
                    <span>{formatDate(hunt.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FaCoins className="w-3.5 h-3.5 text-green" />
                    <span className="text-green font-medium">
                      {hunt.reward}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FaUsers className="w-3.5 h-3.5" />
                    <span>{hunt.participantCount} participants</span>
                  </div>
                </div>

                {/* Single button that changes based on state */}
                {buttonConfig.action === "register" ? (
                  <Button
                    onClick={() => handleRegister(index)}
                    className={`w-full py-1.5 text-sm font-medium rounded-md ${buttonConfig.className} transition-colors duration-300`}
                    disabled={buttonConfig.disabled}
                  >
                    {buttonConfig.text}
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      if (buttonConfig.action === "start") {
                        handleHuntStart(
                          index,
                          hunt.id,
                          hunt.clues_blobId,
                          hunt.answers_blobId
                        );
                      }
                    }}
                    className={`w-full py-1.5 text-sm font-medium rounded-md ${buttonConfig.className} transition-colors duration-300`}
                    disabled={buttonConfig.disabled}
                  >
                    {buttonConfig.text}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
