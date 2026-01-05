import React from 'react'
import HeroSection from '../components/HeroSection'
import TestimonialsSection from '../components/Testimonial'
import HelpSection from '../components/HelpSection'
import HomeworkForm from '../components/HomeworkForm'
import NoCheating from '../components/NoCheating'
import StepByStepSection from '../components/StepByStepSection'
import TopCategoryCarousel from '../components/TopCategoryCarousel'
const Home = () => {
  return (
    <>
      <HeroSection />
      <HomeworkForm />
      <NoCheating />
      <TopCategoryCarousel />
      <StepByStepSection />
      <HelpSection />
      <TestimonialsSection />
    </>
  )
}

export default Home