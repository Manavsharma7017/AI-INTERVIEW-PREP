import React, { useEffect, useState } from "react";
import { Users, Filter } from "lucide-react";
import { Card } from "../ui/Card";
import type { AdminUser } from "../../types/types";
import { adminService } from "../../services/admin";

export const AdminUsers: React.FC = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAdminUsers();
  }, [filters, adminUsers]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const users = await adminService.getAllAdmins();
      setAdminUsers(users);
    } catch (error) {
      console.error("Failed to load admin users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAdminUsers = () => {
    const filtered = adminUsers.filter((user) => {
      return (
        (!filters.username || user.username.toLowerCase().includes(filters.username.toLowerCase())) &&
        (!filters.email || user.email.toLowerCase().includes(filters.email.toLowerCase()))
      );
    });
    setFilteredAdmins(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage admin users</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Filter by username"
              value={filters.username}
              onChange={(e) => setFilters({ ...filters, username: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            type="text"
            placeholder="Filter by email"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="text-sm text-gray-600">
            Showing {filteredAdmins.length} of {adminUsers.length} users
          </div>
        </div>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredAdmins.map((user) => (
          <Card key={user.id} className="p-4 sm:p-6 hover" hover>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{user.username}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredAdmins.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your filters or ensure data is loaded.</p>
        </Card>
      )}
    </div>
  );
};
