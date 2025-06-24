// src/pages/steps/Step3.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetRegistration, setAchievements } from "@/store/registrationSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = { onBack: () => void };

export default function Step3({ onBack }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Grab everything except email from Redux:
  const { username, password, industry, interests } = useAppSelector(
    (state) => state.registration
  );

  // Read the verified email from localStorage:
  const email = localStorage.getItem("userEmail") || "";

  const [achievements, setAchievementsLocal] = useState<string[]>([]);
  const [curr, setCurr] = useState("");

  const add = () => {
    const trimmed = curr.trim();
    if (!trimmed || achievements.includes(trimmed)) return;
    setAchievementsLocal((prev) => [...prev, trimmed]);
    setCurr("");
  };

  const submitAll = async () => {
    // persist into Redux in case you need it later
    dispatch(setAchievements(achievements));

    const email = localStorage.getItem("userEmail") || "";
    const payload = {
      email,
      username,
      password,
      industry,
      interests,
      achievements,
    };

    const res = await fetch("http://57.159.26.157:8080/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("🎉 Registration complete! Please log in.");
      dispatch(resetRegistration());
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      const err = await res.json();
      alert("Error: " + (err.error || res.statusText));
    }
  };

  const isCompleteDisabled = achievements.length === 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-lg bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Step 3 of 3</CardTitle>
          <CardDescription>
            Add any achievements you’d like to showcase.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Achievement input */}
          <div>
            <Label htmlFor="achievement">Your Achievements</Label>
            <div className="mt-2 flex gap-2">
              <Input
                id="achievement"
                placeholder="e.g. Speaker at TechConf 2024"
                value={curr}
                onChange={(e) => setCurr(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), add())
                }
                className="flex-1"
              />
              <Button onClick={add} disabled={!curr.trim()}>
                Add
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {achievements.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-full text-sm"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={submitAll} disabled={isCompleteDisabled}>
              Complete Registration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
