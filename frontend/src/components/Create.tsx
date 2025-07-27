import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface Clue {
  id: number;
  lat: number;
  long: number;
  description: string;
  answer: string;
}

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
  clues: Clue[];
}

export function Create() {
  const navigate = useNavigate();

  const [huntName, setHuntName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [participantCount, setParticipantCount] = useState("0");
  const [reward, setReward] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [category, setCategory] = useState("General");
  const [clues, setClues] = useState<Clue[]>([]);
  const [currentClue, setCurrentClue] = useState<Partial<Clue>>({
    id: 1,
    description: "",
    answer: "",
    lat: 0,
    long: 0,
  });

  const handleAddClue = () => {
    if (
      currentClue.lat !== undefined &&
      currentClue.long !== undefined &&
      currentClue.description &&
      currentClue.answer &&
      currentClue.id
    ) {
      setClues((prev) => [...prev, currentClue as Clue]);
      setCurrentClue({
        id: (currentClue.id || 0) + 1,
        description: "",
        answer: "",
        lat: 0,
        long: 0,
      });
      toast.success("Clue added successfully!");
    } else {
      toast.error("Please fill in all clue details");
    }
  };

  const handleCreateHunt = () => {
    // Validate required fields
    if (
      !huntName ||
      !description ||
      !startDate ||
      !duration ||
      !reward ||
      clues.length === 0
    ) {
      toast.error(
        "Please fill in all required fields and add at least one clue"
      );
      return;
    }

    // Generate unique ID
    const huntId = Date.now();

    // Convert date to YYYYMMDD format
    const formattedDate = startDate.split("-").join("");

    // Convert duration to a string format (e.g., "7 hours", "5 hours")
    const durationText = `${duration} ${
      parseInt(duration) === 1 ? "hour" : "hours"
    }`;

    // Create hunt object
    const newHunt: Hunt = {
      id: huntId,
      name: huntName,
      description: description,
      startTime: formattedDate,
      duration: durationText,
      participantCount: parseInt(participantCount) || 0,
      clues_blobId: `clues-${huntId}`,
      answers_blobId: `answers-${huntId}`,
      reward: reward,
      difficulty: difficulty,
      category: category,
      clues: clues,
    };

    // Get existing custom hunts from localStorage
    const existingHunts = JSON.parse(
      localStorage.getItem("custom_hunts") || "[]"
    );

    console.log("Creating new hunt:", newHunt);
    console.log("Existing hunts:", existingHunts);

    // Add new hunt
    const updatedHunts = [...existingHunts, newHunt];

    console.log("Updated hunts to save:", updatedHunts);

    // Save to localStorage
    localStorage.setItem("custom_hunts", JSON.stringify(updatedHunts));

    // Store clues data separately for hunt gameplay
    localStorage.setItem(`hunt_clues_${huntId}`, JSON.stringify(clues));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("huntsUpdated"));

    toast.success("Hunt created successfully!");

    // Reset form
    resetForm();

    // Navigate to hunts page
    navigate("/");
  };

  const resetForm = () => {
    setHuntName("");
    setDescription("");
    setStartDate("");
    setDuration("");
    setParticipantCount("0");
    setReward("");
    setDifficulty("Beginner");
    setCategory("General");
    setClues([]);
    setCurrentClue({
      id: 1,
      description: "",
      answer: "",
      lat: 0,
      long: 0,
    });
  };

  const canCreateHunt =
    huntName &&
    description &&
    startDate &&
    duration &&
    reward &&
    clues.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Hunt</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="huntName">Hunt Name *</Label>
            <Input
              id="huntName"
              value={huntName}
              onChange={(e) => setHuntName(e.target.value)}
              placeholder="Enter hunt name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter hunt description"
            />
          </div>

          <div>
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration (hours) *</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration in hours"
            />
          </div>

          <div>
            <Label htmlFor="participantCount">Expected Participants</Label>
            <Input
              id="participantCount"
              type="number"
              value={participantCount}
              onChange={(e) => setParticipantCount(e.target.value)}
              placeholder="Expected number of participants"
            />
          </div>

          <div>
            <Label htmlFor="reward">Reward *</Label>
            <Input
              id="reward"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="e.g., 1000 $GNU INU, NFT + Tokens"
            />
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="General">General</option>
              <option value="Ecosystem">Ecosystem</option>
              <option value="DeFi">DeFi</option>
              <option value="NFT">NFT</option>
              <option value="Development">Development</option>
              <option value="Community">Community</option>
            </select>
          </div>

          <Button
            onClick={handleCreateHunt}
            disabled={!canCreateHunt}
            className={`w-full py-2 rounded-md font-medium ${
              canCreateHunt
                ? "bg-yellow/40 border border-black text-black hover:bg-orange/90"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            {canCreateHunt
              ? "Create Hunt"
              : "Fill in required fields and add clues"}
          </Button>
        </div>

        <div className="space-y-6">
          <div className="p-4 border rounded-lg space-y-4">
            <h2 className="text-xl font-semibold">Add Clue</h2>

            <div>
              <Label htmlFor="clueDescription">Clue Description *</Label>
              <Textarea
                id="clueDescription"
                value={currentClue.description}
                onChange={(e) =>
                  setCurrentClue((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter clue description"
              />
            </div>

            <div>
              <Label htmlFor="clueAnswer">Clue Answer *</Label>
              <Input
                id="clueAnswer"
                value={currentClue.answer}
                onChange={(e) =>
                  setCurrentClue((prev) => ({
                    ...prev,
                    answer: e.target.value,
                  }))
                }
                placeholder="Enter the answer to this clue"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={currentClue.lat}
                  onChange={(e) =>
                    setCurrentClue((prev) => ({
                      ...prev,
                      lat: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="Enter latitude"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={currentClue.long}
                  onChange={(e) =>
                    setCurrentClue((prev) => ({
                      ...prev,
                      long: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="Enter longitude"
                />
              </div>
            </div>

            <Button
              onClick={handleAddClue}
              className="w-full"
              variant="outline"
            >
              Add Clue
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Added Clues: ({clues.length})</h3>
            {clues.map((clue) => (
              <div key={clue.id} className="p-3 bg-gray-100 rounded-md">
                <p className="font-medium">Clue {clue.id}</p>
                <p className="text-sm text-gray-600">{clue.description}</p>
                <p className="text-xs text-gray-500">
                  Location: {clue.lat}, {clue.long}
                </p>
                <p className="text-xs text-gray-500">Answer: {clue.answer}</p>
              </div>
            ))}
            {clues.length === 0 && (
              <p className="text-gray-500 text-sm">
                No clues added yet. Add at least one clue to create the hunt.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
