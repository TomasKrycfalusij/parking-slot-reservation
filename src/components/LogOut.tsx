"use client"
import React from 'react';
import { useUser } from './UserContext';

const LogOut = () => {
  const { logOutUser } = useUser();

  return (
    <div>
        <button type="submit" onClick={() => logOutUser()}>Odhlásit se</button>
    </div>
  )
}

export default LogOut