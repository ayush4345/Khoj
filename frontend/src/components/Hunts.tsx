import { TbLadder, TbChessKnight } from "react-icons/tb";
import {
  FaChess,
  FaDice,
  FaCalendarAlt,
  FaUsers,
  FaCoins,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button.tsx";
import { useState, useMemo, useEffect } from "react";

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
  // Track completion status per hunt
  const [huntCompletions, setHuntCompletions] = useState<
    Record<number, boolean>
  >({});
  // Track which hunt is currently starting
  const [startingHunts, setStartingHunts] = useState<Record<number, boolean>>(
    {}
  );
  // Track if initial load is complete to prevent premature saving
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Load registration and completion states from localStorage on component mount
  useEffect(() => {
    const loadPersistedStates = () => {
      try {
        // Load registration states
        const savedRegistrations = localStorage.getItem("hunt_registrations");
        let parsedRegistrations: Record<number, boolean> = {};
        if (savedRegistrations) {
          parsedRegistrations = JSON.parse(savedRegistrations);
          setHuntRegistrations(parsedRegistrations);
          console.log(
            "Loaded registrations from localStorage:",
            parsedRegistrations
          );
        }

        // Load completion states
        const savedCompletions = localStorage.getItem("hunt_completions");
        let parsedCompletions: Record<number, boolean> = {};
        if (savedCompletions) {
          parsedCompletions = JSON.parse(savedCompletions);
          setHuntCompletions(parsedCompletions);
          console.log(
            "Loaded completions from localStorage:",
            parsedCompletions
          );
        }

        // Auto-detect registrations and completions based on hunt progress
        // If a user has any progress on a hunt, consider them registered
        MOCK_HUNTS.forEach((hunt) => {
          const progressKey = `hunt_progress_${hunt.id}`;
          const progress = JSON.parse(
            localStorage.getItem(progressKey) || "[]"
          );
          const huntDataKey = `hunt_data_${hunt.id}`;
          const huntData = localStorage.getItem(huntDataKey);

          // If user has progress or hunt data, they should be considered registered
          if (
            (progress.length > 0 || huntData) &&
            !parsedRegistrations[hunt.id]
          ) {
            console.log(
              `Auto-registering hunt ${hunt.id} based on existing progress`
            );
            setHuntRegistrations((prev) => ({
              ...prev,
              [hunt.id]: true,
            }));
          }

          // Check if hunt is completed (assuming 2 clues per hunt based on MOCK_CLUES in Clue.tsx)
          if (progress.length >= 2 && !parsedCompletions[hunt.id]) {
            console.log(`Auto-completing hunt ${hunt.id} based on progress`);
            setHuntCompletions((prev) => ({
              ...prev,
              [hunt.id]: true,
            }));
          }
        });

        setIsInitialLoadComplete(true);
      } catch (error) {
        console.error("Error loading persisted hunt states:", error);
        setIsInitialLoadComplete(true);
      }
    };

    loadPersistedStates();
  }, []);

  // Save registration state to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isInitialLoadComplete && Object.keys(huntRegistrations).length > 0) {
      console.log("Saving registrations to localStorage:", huntRegistrations);
      localStorage.setItem(
        "hunt_registrations",
        JSON.stringify(huntRegistrations)
      );
    }
  }, [huntRegistrations, isInitialLoadComplete]);

  // Save completion state to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isInitialLoadComplete && Object.keys(huntCompletions).length > 0) {
      console.log("Saving completions to localStorage:", huntCompletions);
      localStorage.setItem("hunt_completions", JSON.stringify(huntCompletions));
    }
  }, [huntCompletions, isInitialLoadComplete]);

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
    const isRegistered = huntRegistrations[hunt.id];
    const isCompleted = huntCompletions[hunt.id];
    const isStarting = startingHunts[index];

    // Check if hunt is completed
    if (isCompleted) {
      return {
        text: "Completed",
        disabled: true,
        className:
          "bg-green/90 border border-green text-white font-semibold cursor-default",
        action: null,
        icon: <FaCheckCircle className="w-4 h-4 mr-2" />,
      };
    }

    if (!isHuntStarted) {
      return {
        text: "Coming Soon",
        disabled: true,
        className:
          "bg-gray-400 cursor-not-allowed text-gray-600 border border-gray-300",
        action: null,
        icon: null,
      };
    }

    if (!isRegistered) {
      return {
        text: "Register",
        disabled: false,
        className:
          "bg-yellow/70 border border-black text-white font-semibold hover:bg-yellow-600 hover:border-yellow-700 shadow-md hover:shadow-lg transform hover:scale-[1.02]",
        action: "register",
        icon: null,
      };
    }

    return {
      text: isStarting ? "Starting..." : "Start",
      disabled: isStarting,
      className: isStarting
        ? "bg-gray-500 border border-gray-600 text-white font-semibold cursor-not-allowed"
        : "bg-green/70 border border-green text-white font-semibold hover:bg-green hover:border-green shadow-md hover:shadow-lg transform hover:scale-[1.02]",
      action: "start",
      icon: null,
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

      // Store hunt data in localStorage for access in Clue component
      const currentHunt = processedHunts.find((hunt) => hunt.id === huntId);
      if (currentHunt) {
        localStorage.setItem(
          `hunt_data_${huntId}`,
          JSON.stringify({
            title: currentHunt.name,
            description: currentHunt.description,
            difficulty: currentHunt.difficulty,
            category: currentHunt.category,
            reward: currentHunt.reward,
          })
        );
      }

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

  const handleRegisterSuccess = (huntId: number) => {
    console.log("Register success for hunt:", huntId);
    toast.success("Successfully registered for hunt!");

    // Update registration status for this specific hunt using hunt ID
    setHuntRegistrations((prev) => ({
      ...prev,
      [huntId]: true,
    }));
  };

  const handleRegister = (huntId: number) => {
    // Simulate registration process
    const loadingToast = toast.loading("Registering for hunt...");

    setTimeout(() => {
      toast.dismiss(loadingToast);
      handleRegisterSuccess(huntId);
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
                    onClick={() => handleRegister(hunt.id)}
                    className={`w-full py-1.5 text-sm font-medium rounded-md ${buttonConfig.className} transition-colors duration-300`}
                    disabled={buttonConfig.disabled}
                  >
                    {buttonConfig.icon}
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
                    className={`w-full py-1.5 text-sm font-medium rounded-md ${buttonConfig.className} transition-colors duration-300 flex items-center justify-center`}
                    disabled={buttonConfig.disabled}
                  >
                    {buttonConfig.icon}
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
