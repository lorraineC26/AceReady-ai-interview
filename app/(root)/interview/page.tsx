import Agent from '@/components/Agent';
import React from 'react'

const page = () => {
  return (
    <>
      <h3>Interview Generation</h3>

      {/* type generate to create an interview; type take to participate */}
      <Agent userName = "You" userId = "user1" type="generate"/>
    </>
  )
}

export default page