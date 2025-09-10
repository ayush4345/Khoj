import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { huntABI } from "../assets/hunt_abi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TransactionButton } from "./TransactionButton";
import { CONTRACT_ADDRESSES, SUPPORTED_CHAINS } from "../lib/utils";

const BACKEND_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL;
const IPFS_GATEWAY = import.meta.env.VITE_PUBLIC_IPFS_GATEWAY || "harlequin-fantastic-giraffe-234.mypinata.cloud";

// Type guard to ensure address is a valid hex string
function isValidHexAddress(address: string): address is `0x${string}` {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

interface Clue {
  id: number;
  lat: number;
  long: number;
  description: string;
  answer: string;
}

interface ClueData {
  id: number;
  description: string;
}

interface AnswerData {
  id: number;
  answer: string;
  lat: number;
  long: number;
}

interface IPFSResponse {
  clues_blobId: string;
  answers_blobId: string;
}

export function Create() {
  const account = useActiveAccount();
  const address = account?.address;

  const [huntName, setHuntName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(() => {
    // Set default start date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [duration, setDuration] = useState("");
  const [clues, setClues] = useState<Clue[]>([]);
  const [currentClue, setCurrentClue] = useState<Partial<Clue>>({
    id: 1,
    description: "",
    answer: "",
    lat: 0,
    long: 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedCIDs, setUploadedCIDs] = useState<IPFSResponse | null>(null);
  const [cluesCID, setCluesCID] = useState("");
  const [answersCID, setAnswersCID] = useState("");
  const [healthCheckStatus, setHealthCheckStatus] = useState<string | null>(null);
  
  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedImageCID, setUploadedImageCID] = useState<string>("");
  const [nftMetadataCID, setNftMetadataCID] = useState<string>("");
  
  // New state variables for previously hardcoded fields
  const [teamsEnabled, setTeamsEnabled] = useState(false);
  const [maxTeamSize, setMaxTeamSize] = useState("1");
  const [theme, setTheme] = useState("general");

  // Add this to get current network from localStorage
  const currentNetwork = localStorage.getItem("current_network") || "assetHub";
  console.log("Create: Current Network: ", currentNetwork);
  const contractAddress =
    CONTRACT_ADDRESSES[currentNetwork as keyof typeof CONTRACT_ADDRESSES] ??
    "0x0000000000000000000000000000000000000000";

  // Get chain ID for the current network
  const chainId =
    SUPPORTED_CHAINS[currentNetwork as keyof typeof SUPPORTED_CHAINS].id;
  console.log("Create: Chain ID: ", chainId);

  if (!isValidHexAddress(contractAddress)) {
    toast.error("Invalid contract address format");
    return null;
  }

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

  const getTransactionArgs = () => {
    if (
      !huntName ||
      !description ||
      !startDate ||
      !duration ||
      !cluesCID ||
      !answersCID ||
      !nftMetadataCID
    ) {
      return null;
    }

    // Convert date to YYYYMMDD format
    const formattedDate = startDate.split("-").join("");
    // Convert duration to seconds
    const durationInSeconds = parseInt(duration) * 3600; // Convert hours to seconds

    return [
      huntName,
      description,
      BigInt(formattedDate),
      cluesCID,
      answersCID,
      BigInt(durationInSeconds),
      teamsEnabled, // teamsEnabled
      BigInt(parseInt(maxTeamSize)), // maxTeamSize
      theme, // theme
      `ipfs://${nftMetadataCID}`, // nftMetadataURI
    ];
  };

  const handleTransactionSuccess = () => {
    toast.success("Hunt created successfully!");
    resetForm();
  };

  const handleTransactionError = (error: any) => {
    console.error("Error creating hunt:", error);
    toast.error(error.message || "Failed to create hunt");
  };

  const testBackendHealth = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        console.log("Backend health check response:", BACKEND_URL, data);
        setHealthCheckStatus("✅ Backend is healthy");
        toast.success("Backend is working!");
      } else {
        setHealthCheckStatus(`❌ Backend error: ${response.status}`);
        toast.error(`Backend error: ${response.status}`);
      }
    } catch (error) {
      setHealthCheckStatus("❌ Backend unreachable");
      toast.error("Backend is unreachable");
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch(`${BACKEND_URL}/upload-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setUploadedImageCID(data.imageCID);
      toast.success("Image uploaded successfully!");
      
      // Auto-generate NFT metadata
      await createNFTMetadata(data.imageCID);
      
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const createNFTMetadata = async (imageCID: string) => {
    try {
      // Create NFT metadata following OpenSea standard
      const metadata = {
        name: huntName || "ETHunt NFT",
        description: description || "Participation NFT for ETHunt",
        image: `ipfs://${imageCID}`,
        attributes: [
          {
            trait_type: "Hunt Name",
            value: huntName || "Unknown Hunt"
          },
          {
            trait_type: "Created At",
            value: new Date().toISOString()
          }
        ],
        external_url: "", // Could be set to hunt URL later
      };

      // Upload metadata to IPFS via backend
      const response = await fetch(`${BACKEND_URL}/upload-metadata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload NFT metadata to IPFS');
      }

      const data = await response.json();
      setNftMetadataCID(data.metadataCID);
      toast.success("NFT metadata created and uploaded!");
      
    } catch (error) {
      console.error("Error creating NFT metadata:", error);
      toast.error("Failed to create NFT metadata");
    }
  };

  const uploadToIPFS = async () => {
    if (clues.length === 0) {
      toast.error("Please add at least one clue before uploading");
      return;
    }

    setIsUploading(true);

    try {
      // Prepare clues and answers data
      const cluesData: ClueData[] = clues.map(({ id, description }) => ({
        id,
        description,
      }));

      const answersData: AnswerData[] = clues.map(
        ({ id, answer, lat, long }) => ({
          id,
          answer,
          lat,
          long,
        })
      );

      const response = await fetch(`${BACKEND_URL}/encrypt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clues: cluesData,
          answers: answersData,
          userAddress: address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload to IPFS");
      }

      const data = await response.json();
      setUploadedCIDs(data);
      
      // Automatically populate the IPFS configuration fields with the returned blob IDs
      setCluesCID(data.clues_blobId);
      setAnswersCID(data.answers_blobId);
      
      toast.success(
        "Successfully uploaded to IPFS! CIDs have been automatically added to the configuration."
      );
    } catch (err) {
      console.error("Error uploading to IPFS:", err);
      toast.error("Failed to upload to IPFS");
    } finally {
      setIsUploading(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setHuntName("");
    setDescription("");
    setStartDate("");
    setDuration("");
    setClues([]);
    setCurrentClue({
      id: 1,
      description: "",
      answer: "",
      lat: 0,
      long: 0,
    });
    setCluesCID("");
    setAnswersCID("");
    setUploadedCIDs(null);
    setSelectedImage(null);
    setImagePreview(null);
    setUploadedImageCID("");
    setNftMetadataCID("");
    setTeamsEnabled(false);
    setMaxTeamSize("1");
    setTheme("general");
  };

  const transactionArgs = getTransactionArgs();
  const canCreateHunt = transactionArgs !== null && account;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Hunt</h1>

      {/* Simple Backend Health Check */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <div className="flex items-center gap-4">
          <Button onClick={testBackendHealth} variant="outline" size="sm">
            Test Backend
          </Button>
          {healthCheckStatus && (
            <span className="text-sm">{healthCheckStatus}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="huntName">Hunt Name</Label>
            <Input
              id="huntName"
              value={huntName}
              onChange={(e) => setHuntName(e.target.value)}
              placeholder="Enter hunt name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter hunt description"
            />
          </div>

          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration (hours)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration in hours"
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <input
                id="teamsEnabled"
                type="checkbox"
                checked={teamsEnabled}
                onChange={(e) => setTeamsEnabled(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="teamsEnabled">Enable Teams</Label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Allow participants to form teams for this hunt
            </p>
          </div>

          <div>
            <Label htmlFor="maxTeamSize">Max Team Size</Label>
            <Input
              id="maxTeamSize"
              type="number"
              min="1"
              value={maxTeamSize}
              onChange={(e) => setMaxTeamSize(e.target.value)}
              placeholder="Enter maximum team size"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum number of participants per team
            </p>
          </div>

          <div>
            <Label htmlFor="theme">Theme</Label>
            <Input
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Enter hunt theme (e.g., general, adventure, mystery)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Theme or category for this hunt
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">NFT Image</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nftImage">Hunt NFT Image</Label>
                <Input
                  id="nftImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select an image for the hunt participation NFT (Max 10MB)
                </p>
              </div>

              {imagePreview && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Preview:</p>
                  <img
                    src={imagePreview}
                    alt="NFT Preview"
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                  <Button
                    onClick={uploadImage}
                    disabled={isUploadingImage}
                    variant="outline"
                    className="bg-blue-50"
                  >
                    {isUploadingImage ? "Uploading..." : "Upload Image to IPFS"}
                  </Button>
                </div>
              )}

              {uploadedImageCID && (
                <div className="p-3 bg-green-50 rounded-md">
                  <p className="text-sm font-medium text-green-800">✅ Image Uploaded Successfully!</p>
                  <p className="text-xs text-green-600">Image CID: {uploadedImageCID}</p>
                  <a 
                    href={`https://${IPFS_GATEWAY}/ipfs/${uploadedImageCID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    🔗 View Image on IPFS
                  </a>
                  {nftMetadataCID && (
                    <>
                      <p className="text-xs text-green-600 mt-2">Metadata CID: {nftMetadataCID}</p>
                      <a 
                        href={`https://${IPFS_GATEWAY}/ipfs/${nftMetadataCID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 underline block"
                      >
                        🔗 View Metadata on IPFS
                      </a>
                      <p className="text-xs text-green-600 mt-1">✅ NFT metadata created! Ready to create hunt.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">IPFS Configuration</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="cluesCID">Clues CID</Label>
                <Input
                  id="cluesCID"
                  value={cluesCID}
                  onChange={(e) => setCluesCID(e.target.value)}
                  placeholder="Enter clues CID"
                />
              </div>

              <div>
                <Label htmlFor="answersCID">Answers CID</Label>
                <Input
                  id="answersCID"
                  value={answersCID}
                  onChange={(e) => setAnswersCID(e.target.value)}
                  placeholder="Enter answers CID"
                />
              </div>
            </div>
          </div>

          {canCreateHunt ? (
            <TransactionButton
              contractAddress={contractAddress}
              abi={huntABI}
              functionName="createHunt"
              args={transactionArgs}
              text="Create Hunt"
              className="w-full bg-yellow/40 border border-black text-black hover:bg-orange/90 py-2 rounded-md font-medium"
              onSuccess={handleTransactionSuccess}
              onError={handleTransactionError}
            />
          ) : (
            <Button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-2 rounded-md font-medium"
            >
              {!account
                ? "Connect Wallet to Create Hunt"
                : !nftMetadataCID
                ? "Upload NFT image to continue"
                : "Fill in all fields to create hunt"}
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add Clue</h2>
              {clues.length > 0 && (
                <Button
                  onClick={uploadToIPFS}
                  disabled={isUploading}
                  variant="outline"
                  className="bg-green-50"
                >
                  {isUploading ? "Uploading..." : "Upload Clues to IPFS"}
                </Button>
              )}
            </div>

            <div>
              <Label htmlFor="clueDescription">Clue Description</Label>
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
              <Label htmlFor="clueAnswer">Clue Answer</Label>
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
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={currentClue.lat}
                  onChange={(e) =>
                    setCurrentClue((prev) => ({
                      ...prev,
                      lat: parseFloat(e.target.value),
                    }))
                  }
                  placeholder="Enter latitude"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={currentClue.long}
                  onChange={(e) =>
                    setCurrentClue((prev) => ({
                      ...prev,
                      long: parseFloat(e.target.value),
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
            <h3 className="font-semibold">Added Clues:</h3>
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
            {uploadedCIDs && (
              <div className="mt-4 p-3 bg-green-50 rounded-md">
                <p className="text-sm font-medium text-green-800">
                  IPFS Upload Complete
                </p>
                <p className="text-xs text-green-600">
                  Clues CID: {uploadedCIDs.clues_blobId}
                </p>
                <p className="text-xs text-green-600">
                  Answers CID: {uploadedCIDs.answers_blobId}
                </p>
                <p className="text-xs text-amber-600 mt-2">
                  Please copy these CIDs to the respective fields in the IPFS
                  Configuration section
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
