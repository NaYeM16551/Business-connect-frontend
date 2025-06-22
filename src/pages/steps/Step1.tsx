// src/pages/steps/Step1.tsx
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCredentials } from '@/store/registrationSlice'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Label }  from '@/components/ui/label'
import { Input }  from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Props = {
  onNext: () => void
}

export default function Step1({ onNext }: Props) {
  const dispatch = useAppDispatch()

  // grab any persisted values
  const storedUsername = useAppSelector((s) => s.registration.username)
  const storedPassword = useAppSelector((s) => s.registration.password)

  // seed local state from Redux
  const [username, setUsername] = useState(storedUsername)
  const [password, setPassword] = useState(storedPassword)

  // if persisted values change (on rehydrate), update inputs
  useEffect(() => {
    setUsername(storedUsername)
    setPassword(storedPassword)
  }, [storedUsername, storedPassword])

  const handleSubmit = () => {
    dispatch(setCredentials({ username, password }))
    onNext()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Step 1: Account</CardTitle>
          <CardDescription>
            Choose a username and password for your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="mt-1 w-full"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Pick a strong password"
              className="mt-1 w-full"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!username || !password}
            className="w-full"
          >
            Next
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
