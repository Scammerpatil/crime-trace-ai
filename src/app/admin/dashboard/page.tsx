"use client";
import { Suspect } from "@/types/Suspect";
import { IconClock, IconFile, IconShield } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [users, setUsers] = useState<Suspect[]>([]);
  const [data, setData] = useState({
    suspects: 0,
    investigators: 0,
    cases: 0,
    activeCases: 0,
    differencePercentage: 0,
  });

  const fetchUser = async () => {
    const response = await axios.get("/api/dashboard/admin");
    console.log(response.data);
    setUsers(response.data.suspects);
    setData(response.data.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Dashboard
      </h1>

      <div className="stats shadow w-full bg-base-300">
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconFile size={40} />
          </div>
          <div className="stat-title">Total Suspects</div>
          <div className="stat-value text-primary">{data.suspects}</div>
          <div className="stat-desc">21% more than last month</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <IconClock size={40} />
          </div>
          <div className="stat-title">Total Active Cases</div>
          <div className="stat-value text-secondary">{data.activeCases}</div>
          <div className="stat-desc">21% more than last month</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <IconShield size={40} />
          </div>
          <div className="stat-title">Total Cases</div>
          <div className="stat-value text-success">{data.cases}</div>
          <div className="stat-desc">21% more than last month</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="avatar online">
              <div className="w-16 rounded-full">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/9703/9703596.png"
                  alt="user"
                />
              </div>
            </div>
          </div>
          <div className="stat-value">{data.differencePercentage} %</div>
          <div className="stat-title">Cases Pending</div>
          <div className="stat-desc text-secondary">31 tasks remaining</div>
        </div>
      </div>
      <div className="overflow-x-auto mt-6 rounded-box border border-base-content/5 bg-base-300">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {users.length > 0 ? (
              users.map((user: Suspect, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={user.profileImage} alt={user.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-sm opacity-50">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.contact}</td>
                  <td>{user.age}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center">
                  No Suspect found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
