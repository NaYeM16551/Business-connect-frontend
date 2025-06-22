// src/pages/CompleteRegistration.tsx
import { useState } from 'react'
import Step1 from './steps/Step1'
import Step2 from './steps/Step2'
import Step3 from './steps/Step3'

export default function CompleteRegistration() {
  const [step, setStep] = useState(1)

  return (
    <>
      {step === 1 && <Step1 onNext={() => setStep(2)} />}
      {step === 2 && <Step2 onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <Step3 onBack={() => setStep(2)} />}
    </>
  )
}
