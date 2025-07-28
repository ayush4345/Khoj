import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import {
  BsArrowLeft,
  BsGeoAlt,
  BsCheckCircle,
  BsXCircle,
  BsArrowRepeat,
} from "react-icons/bs";
import { FaYoutube, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";
import { toast } from "sonner";

// Mock clue data for frontend-only prototype
const MOCK_CLUES = [
  {
    id: 1,
    riddle:
      "Find the heart of the city where dreams come alive. Look for the place where people gather to celebrate the future of finance and technology. **Hint: It's a famous landmark in your city's downtown area.**",
    location: "Downtown City Center",
  },
  {
    id: 2,
    riddle:
      "Seek the digital oasis where innovation meets community. Find the space where developers and creators build the next generation of web3 applications. **Hint: Look for a modern tech hub or innovation center.**",
    location: "Tech Innovation Hub",
  },
];

export function Clue() {
  const { huntId, clueId } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(3);
  const [verificationState, setVerificationState] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [_, setShowSuccessMessage] = useState(false);
  const [clueData, setClueData] = useState<any[]>([]);
  const [isInHuddleRoom, setIsInHuddleRoom] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const currentClue = parseInt(clueId || "0");

  // Load clues for this hunt (custom or mock)
  useEffect(() => {
    const loadClueData = () => {
      // Try to load custom hunt clues first
      const customClues = localStorage.getItem(`hunt_clues_${huntId}`);
      if (customClues) {
        try {
          const parsedClues = JSON.parse(customClues);
          // Transform custom clues to match expected format
          const transformedClues = parsedClues.map((clue: any) => ({
            id: clue.id,
            riddle: clue.description,
            location: `Lat: ${clue.lat}, Long: ${clue.long}`,
            answer: clue.answer,
            lat: clue.lat,
            long: clue.long,
          }));
          setClueData(transformedClues);
          console.log("Loaded custom clues for hunt", huntId, transformedClues);
        } catch (error) {
          console.error("Error parsing custom clues:", error);
          setClueData(MOCK_CLUES);
        }
      } else {
        // Fall back to mock clues
        setClueData(MOCK_CLUES);
        console.log("Using mock clues for hunt", huntId);
      }
    };

    if (huntId) {
      loadClueData();
    }
  }, [huntId]);

  // Get hunt data from localStorage (stored when hunt was started)
  const getHuntData = () => {
    const storedData = localStorage.getItem(`hunt_data_${huntId}`);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return {
        title: parsedData.title,
        description: parsedData.description,
        difficulty: parsedData.difficulty,
        category: parsedData.category,
        reward: parsedData.reward,
        totalClues: clueData?.length || 0,
        currentClue: parseInt(clueId || "1"),
      };
    }

    // Fallback to default data if no stored data found
    return {
      title: "GNU INU Treasure Hunt",
      description:
        "Discover the vibrant GNU INU ecosystem through interactive challenges!",
      totalClues: clueData?.length || 0,
      currentClue: parseInt(clueId || "1"),
    };
  };

  const huntData = getHuntData();

  useEffect(() => {
    setVerificationState("idle");

    // Wait for clue data to be loaded before doing validation
    if (clueData.length === 0) return;

    // Progress validation: prevent skipping ahead
    const progressKey = `hunt_progress_${huntId}`;
    let progress = JSON.parse(localStorage.getItem(progressKey) || "[]");
    // Only allow access to the next unsolved clue or any previous clue
    const allowedClue = (progress.length || 0) + 1;
    if (currentClue > allowedClue) {
      navigate(`/hunt/${huntId}/clue/${allowedClue}`);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          console.log("Location detected:", latitude, longitude);
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Please enable location access to continue");
        }
      );
    }
  }, [clueId, huntId, navigate, clueData]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      toast.error("Please allow location access to continue");
      return;
    }

    setIsSubmitting(true);
    setVerificationState("verifying");

    try {
      // Simulate API call delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Frontend-only prototype: Always pass verification for all hunts
      const isCorrect = true;

      if (isCorrect) {
        // Update progress in localStorage
        const progressKey = `hunt_progress_${huntId}`;
        let progress = JSON.parse(localStorage.getItem(progressKey) || "[]");
        if (!progress.includes(currentClue)) {
          progress.push(currentClue);
          localStorage.setItem(progressKey, JSON.stringify(progress));
        }

        setVerificationState("success");
        setShowSuccessMessage(true);

        toast.success("Location verified! Moving to next clue...");

        // Wait 2 seconds before navigating
        setTimeout(() => {
          const nextClueId = currentClue + 1;
          if (clueData && nextClueId <= clueData.length) {
            navigate(`/hunt/${huntId}/clue/${nextClueId}`);
          } else {
            // User has completed all clues - mark hunt as completed
            if (huntId) {
              const huntCompletions = JSON.parse(
                localStorage.getItem("hunt_completions") || "{}"
              );
              huntCompletions[huntId] = true;
              localStorage.setItem(
                "hunt_completions",
                JSON.stringify(huntCompletions)
              );
            }

            toast.success("Congratulations! You've completed the hunt!");
            navigate(`/hunt/${huntId}/end`);
          }
        }, 2000);
      } else {
        setVerificationState("error");
        setAttempts((prev) => prev - 1);
        toast.error("Verification failed. Try again!");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationState("error");
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinHuddleRoom = async () => {
    if (!isInHuddleRoom) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setVideoStream(stream);
        setIsInHuddleRoom(true);
        setIsAudioMuted(false);
        setIsVideoOff(false);
        toast.success("Joined Huddle Room!");
        
        // Set video stream to video element
        if (videoRef) {
          videoRef.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast.error("Failed to access camera. Please allow camera permissions.");
      }
    } else {
      // Leave room
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
      if (videoRef) {
        videoRef.srcObject = null;
      }
      setIsInHuddleRoom(false);
      setIsAudioMuted(false);
      setIsVideoOff(false);
      toast.success("Left Huddle Room!");
    }
  };

  const toggleAudio = () => {
    if (videoStream) {
      const audioTrack = videoStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (videoStream) {
      const videoTrack = videoStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  useEffect(() => {
    // Cleanup video stream on component unmount
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

  const getButtonStyles = () => {
    if (!location) return "bg-gray-400 cursor-not-allowed";
    switch (verificationState) {
      case "verifying":
        return "bg-gray-800 hover:bg-gray-800";
      case "success":
        return "bg-green hover:bg-green/90";
      case "error":
        return "bg-red hover:bg-red";
      default:
        return "bg-black hover:bg-gray-800";
    }
  };

  const getButtonText = () => {
    if (!location) return "Waiting for location...";
    switch (verificationState) {
      case "verifying":
        return "Verifying location...";
      case "success":
        return "Correct Answer!";
      case "error":
        return `Wrong location - ${attempts} attempts remaining`;
      default:
        return "Verify Location";
    }
  };

  if (attempts === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <BsXCircle className="w-16 h-16 text-red-500 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No More Attempts
            </h2>
            <p className="text-gray-600 mb-8">
              You've used all your attempts for this clue. Try another hunt or
              come back later.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-black hover:bg-gray-800 text-white px-8"
              size="lg"
            >
              <BsArrowLeft className="mr-2" />
              Return to Hunts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 mb-[90px]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border-2 border-black min-h-[calc(100vh-180px)] md:h-[calc(100vh-180px)] justify-between flex flex-col">
          <div className="bg-green p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <BsArrowLeft className="mr-2" />
                Back to Hunts
              </Button>
              <div className="text-2xl font-bold">
                # {currentClue}/{clueData?.length}
              </div>
            </div>

            <h1 className="text-xl font-bold mb-2">{huntData?.title}</h1>
          </div>

          <div className="prose max-w-none p-6 h-full">
            <h1 className="text-xl font-semibold mb-2">Clue</h1>
            <ReactMarkdown className="text-lg">
              {clueData?.[currentClue - 1]?.riddle}
            </ReactMarkdown>
          </div>

          <div className="mt-8 border-t pt-6 p-6 flex flex-col">
            <div className="flex flex-col space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <BsGeoAlt className="mr-2" />
                {location ? "Location detected" : "Detecting location..."}
              </div>
              <div className="text-gray-600">
                Attempts remaining: {attempts}/3
              </div>
            </div>

            <form onSubmit={handleVerify}>
              <Button
                type="submit"
                size="lg"
                className={cn(
                  "w-full text-white transition-colors duration-300",
                  getButtonStyles()
                )}
                disabled={
                  !location ||
                  verificationState === "verifying" ||
                  verificationState === "success"
                }
              >
                {verificationState === "success" && (
                  <BsCheckCircle className="mr-2" />
                )}
                {verificationState === "error" && (
                  <BsXCircle className="mr-2" />
                )}
                {isSubmitting && (
                  <BsArrowRepeat className="mr-2 animate-spin" />
                )}
                {getButtonText()}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Huddle Room Controls */}
      <div className="px-4 pb-6">
        <div className="flex flex-col gap-2">
          <Button
            className={cn(
              "w-full text-white rounded-lg py-2 font-medium",
              isInHuddleRoom 
                ? "bg-gray-600 hover:bg-gray-700" 
                : "bg-blue-600 hover:bg-blue-700"
            )}
            size="lg"
            onClick={handleJoinHuddleRoom}
          >
            {isInHuddleRoom ? "Leave Huddle Room" : "Join Huddle Room"}
          </Button>

          <Button
            size="lg"
            className="w-full bg-red text-white rounded-lg py-2 font-medium"
          >
            <FaYoutube className="mr-2 h-5 w-5" />
            Stream to YouTube
          </Button>
        </div>
        
        {/* Small Video Window */}
        {isInHuddleRoom && (
          <div className="mt-4 bg-black rounded-lg overflow-hidden shadow-lg relative">
            <div className="bg-gray-800 px-3 py-2 text-white text-sm font-medium">
              Your Video
            </div>
            <div className="relative">
              <video
                ref={(el) => {
                  setVideoRef(el);
                  if (el && videoStream) {
                    el.srcObject = videoStream;
                  }
                }}
                autoPlay
                muted
                playsInline
                className="w-full h-32 object-cover"
              />
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2">
                <Button
                  size="sm"
                  onClick={toggleAudio}
                  className={cn(
                    "w-8 h-8 rounded-full p-0",
                    isAudioMuted 
                      ? "bg-red-600 hover:bg-red-700" 
                      : "bg-gray-700 hover:bg-gray-600"
                  )}
                >
                  {isAudioMuted ? (
                    <FaMicrophoneSlash className="w-3 h-3" />
                  ) : (
                    <FaMicrophone className="w-3 h-3" />
                  )}
                </Button>
                
                <Button
                  size="sm"
                  onClick={toggleVideo}
                  className={cn(
                    "w-8 h-8 rounded-full p-0",
                    isVideoOff 
                      ? "bg-red-600 hover:bg-red-700" 
                      : "bg-gray-700 hover:bg-gray-600"
                  )}
                >
                  {isVideoOff ? (
                    <FaVideoSlash className="w-3 h-3" />
                  ) : (
                    <FaVideo className="w-3 h-3" />
                  )}
                </Button>
              </div>
              
              {/* Video Off Overlay */}
              {isVideoOff && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <FaVideoSlash className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
