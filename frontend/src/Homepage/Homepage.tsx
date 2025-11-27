import React from 'react'
import Sidebar from '../LeftNavBar/Sidebar'

function Homepage() {
  const handleNewChat = () => {
    console.log('New chat clicked')
    // Add your new chat logic here
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar onNewChat={handleNewChat} />
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1>Homepage</h1>
        <p>Welcome to your homepage!</p>
      </div>
    </div>
  )
}

export default Homepage