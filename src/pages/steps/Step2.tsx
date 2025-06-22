// src/pages/steps/Step2.tsx
import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setIndustryAndInterests } from '@/store/registrationSlice'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Props = {
  onNext: () => void
  onBack: () => void
}

const PREDEFINED_INDUSTRIES = ['EdTech', 'FinTech', 'HealthTech', 'Other']

export default function Step2({ onNext, onBack }: Props) {
  const dispatch = useAppDispatch()
  const { industry: savedIndustry, interests: savedInterests } =
    useAppSelector((s) => s.registration)

  const [selected, setSelected] = useState<string[]>([])
  const [customIndustries, setCustomIndustries] = useState<string[]>([])
  const [customInput, setCustomInput] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [interestInput, setInterestInput] = useState('')

  // ---- seed from persisted Redux once on mount ----
  useEffect(() => {
    // populate pills
    const predefined = savedIndustry.filter((i) =>
      PREDEFINED_INDUSTRIES.includes(i) && i !== 'Other'
    )
    const customs = savedIndustry.filter(
      (i) => !PREDEFINED_INDUSTRIES.includes(i)
    )
    setSelected(predefined.concat(customs.length ? ['Other'] : []))
    setCustomIndustries(customs)
    setInterests(savedInterests)
  }, [])

  // ---- handlers ----
  const toggleIndustry = (opt: string) => {
    setSelected((prev) => {
      const on = prev.includes(opt)
      // if untoggling Other, clear customs
      if (opt === 'Other' && on) {
        setCustomIndustries([])
        setCustomInput('')
      }
      return on ? prev.filter((i) => i !== opt) : [...prev, opt]
    })
  }

  const addCustomIndustry = () => {
    const v = customInput.trim()
    if (!v || customIndustries.includes(v)) return
    setCustomIndustries((prev) => [...prev, v])
    setCustomInput('')
  }

  const addInterest = () => {
    const v = interestInput.trim()
    if (!v || interests.includes(v)) return
    setInterests((prev) => [...prev, v])
    setInterestInput('')
  }

  // final list combines pills (minus "Other") + customs
  const finalIndustries = [
    ...selected.filter((i) => i !== 'Other'),
    ...customIndustries,
  ]

  const canNext = finalIndustries.length > 0 && interests.length > 0

  const handleNext = () => {
    dispatch(
      setIndustryAndInterests({
        industry: finalIndustries,
        interests,
      })
    )
    onNext()
  }

  // ---- render ----
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-lg bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Step 2 of 3</CardTitle>
          <CardDescription>
            Which industry are you in, and what topics interest you?
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Pills */}
          <div>
            <Label>Industry (choose one or more)</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PREDEFINED_INDUSTRIES.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleIndustry(opt)}
                  className={`px-4 py-2 rounded-full border font-medium transition ${
                    selected.includes(opt)
                      ? 'bg-blue-100 border-blue-600 text-blue-600'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom industry input */}
          {selected.includes('Other') && (
            <div>
              <Label htmlFor="customIndustry">Add Other Industry</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="customIndustry"
                  placeholder="e.g. Banking"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addCustomIndustry())
                  }
                  className="flex-1"
                />
                <Button
                  onClick={addCustomIndustry}
                  disabled={!customInput.trim()}
                >
                  Add
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {customIndustries.map((ci) => (
                  <span
                    key={ci}
                    className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-full text-sm"
                  >
                    {ci}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          <div>
            <Label>Your Interests</Label>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Type interest"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), addInterest())
                }
                className="flex-1"
              />
              <Button onClick={addInterest} disabled={!interestInput.trim()}>
                Add
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {interests.map((i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-full text-sm"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canNext}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
