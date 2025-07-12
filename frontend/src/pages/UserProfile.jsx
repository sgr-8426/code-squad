import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function UserProfile() {
  const { userId } = useParams(); // Assuming URL: /profile/:userId
  const [user, setUser] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from backend
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`);
        if (res.data.isPrivate) {
          setIsPrivate(true);
        } else {
          setUser(res.data);
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSwapRequest = async () => {
    try {
      await axios.post('/api/swaps/request', {
        toUserId: userId,
        offeredSkill: 'React', // Replace with user selection
        requestedSkill: 'UI Design', // Replace with user selection
      });
      alert('Swap request sent');
    } catch (err) {
      alert('Failed to send request');
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (isPrivate) return <div>This profile is private.</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.location}</p>
      <p>Skills Offered: {user.skillsOffered.join(', ')}</p>
      <p>Skills Wanted: {user.skillsWanted.join(', ')}</p>
      <p>Availability: {user.availability}</p>
      <button onClick={handleSwapRequest}>Request Skill Swap</button>
    </div>
  );
}

export default UserProfile;