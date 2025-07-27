import { MdRocketLaunch, MdBuild, MdGroups, MdTrendingUp, MdStar, MdToken } from "react-icons/md";
import { BsCoin, BsLightningCharge } from "react-icons/bs";
import { Label, Pie, PieChart } from "recharts";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  {
    segment: "Trust Score",
    value: Number(localStorage.getItem("trust_score")) || 7,
    fill: "#2d763f",
  },
  {
    segment: "Remaining",
    value: ((score) => 10 - score)(
      Number(localStorage.getItem("trust_score")) || 7
    ),
    fill: "#e0e0e0",
  },
];

const chartConfig = {
  value: {
    label: "Trust Score",
  },
  "Trust Score": {
    label: "Current Score",
    color: "bg-green",
  },
  Remaining: {
    label: "Remaining",
    color: "bg-gray",
  },
} satisfies ChartConfig;

interface RewardCard {
  code: string;
  description: string;
  isExpired: boolean;
  expiryDate?: string;
  icon: JSX.Element;
}

const rewardCards: RewardCard[] = [
  {
    code: "GUI1000",
    description: "Earn 1000 $GUI INU tokens for completing your first hunt!",
    isExpired: false,
    icon: <MdToken className="w-5 h-5 text-white" />,
  },
  {
    code: "BUILDER",
    description: "Get exclusive access to Aptos builder community events",
    isExpired: false,
    icon: <MdBuild className="w-5 h-5 text-white" />,
  },
  {
    code: "MEME100",
    description: "100 $GUI INU tokens for creating viral memes about Aptos",
    isExpired: false,
    icon: <BsLightningCharge className="w-5 h-5 text-white" />,
  },
  {
    code: "COMMUNITY",
    description: "Join exclusive $GUI INU community channels and groups",
    isExpired: false,
    icon: <MdGroups className="w-5 h-5 text-white" />,
  },
  {
    code: "STARTER",
    description: "500 $GUI INU tokens for new Aptos ecosystem builders",
    isExpired: true,
    expiryDate: "15 Dec",
    icon: <MdRocketLaunch className="w-5 h-5 text-white" />,
  },
  {
    code: "TRENDING",
    description: "Earn rewards for trending $GUI INU content on social media",
    isExpired: true,
    expiryDate: "20 Dec",
    icon: <MdTrendingUp className="w-5 h-5 text-white" />,
  },
  {
    code: "VIP",
    description: "VIP access to $GUI INU ecosystem events and airdrops",
    isExpired: false,
    icon: <MdStar className="w-5 h-5 text-white" />,
  },
  {
    code: "HODL",
    description: "Bonus rewards for long-term $GUI INU token holders",
    isExpired: false,
    icon: <BsCoin className="w-5 h-5 text-white" />,
  },
];

export function Rewards() {
  const trustScore = useMemo(() => {
    return Number(localStorage.getItem("trust_score")) || 7;
  }, []);

  return (
    <div className="pt-16 px-4 sm:px-6 lg:px-8 mb-8 p-4">
      <div className="mb-6">
        <h2 className="text-3xl font-bold my-8 text-green">Analytics</h2>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Card className="mt-4 w-full md:w-[400px] h-fit rounded-2xl p-4 flex flex-col gap-2 bg-white relative before:absolute before:inset-0 before:rounded-2xl before:border-8 before:border-green before:-translate-x-2 before:translate-y-2 before:-z-10 border-[3px] border-black transition-all">
            <CardHeader className="items-center pb-0">
              <CardTitle>Trust Score</CardTitle>
              <CardDescription>Your current standing</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="segment"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-white"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-white text-3xl font-bold"
                              >
                                {trustScore}/10
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-white"
                              >
                                Trust Score
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="leading-none text-muted-foreground">
                Higher trust, more rewards!
              </div>
            </CardFooter>
          </Card>
        </div>
        <h2 className="text-3xl font-bold my-8 text-green">$GUI INU Rewards</h2>
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
                  card.isExpired ? "bg-gray-500/50" : "bg-gray-700"
                }`}
              >
                {card.icon}
              </div>
              <div className="space-y-0.5">
                <h3
                  className={`text-lg font-bold ${
                    card.isExpired ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  {card.code}
                </h3>
                <p
                  className={`text-xs ${
                    card.isExpired ? "text-gray-500" : "text-gray-600"
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
