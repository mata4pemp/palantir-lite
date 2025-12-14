import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  chatCount: number;
}

interface Stats {
  totalUsers: number;
  totalAdmins: number;
  totalRegularUsers: number;
  totalChats: number;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch users
      const usersResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch stats
      const statsResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(usersResponse.data.users);
      setStats(statsResponse.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load admin data");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Regular Users</h3>
            <p className="stat-number">{stats.totalRegularUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Admins</h3>
            <p className="stat-number">{stats.totalAdmins}</p>
          </div>
          <div className="stat-card">
            <h3>Total Chats</h3>
            <p className="stat-number">{stats.totalChats}</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="users-section">
        <h2>All Users</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Chats Created</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </td>
                <td>{user.chatCount}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
