import axios from "axios";
import { useEffect, useState } from "react";

export default function UserDetails() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      const res = await axios.get("http://localhost:3001/admin/user-activity");
      setUserData(res.data);
    };
    getUserData();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📚 User Activity Dashboard</h1>
      {userData.map((user: any, index: number) => {
        const totalBorrowed = user.activityHistory.filter(
          (a: any) => a.action === "borrow"
        ).length;
        const totalReserved = user.activityHistory.filter(
          (a: any) => a.action === "reserve"
        ).length;
        const totalLost = user.activityHistory.filter(
          (a: any) => a.action === "lost"
        ).length;

        return (
          <div key={index} style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.userName}>{(user.name)}</h2>
              <div style={styles.badgeContainer}>
                <span style={styles.badge}>Borrowed: {totalBorrowed}</span>
                <span style={{ ...styles.badge, backgroundColor: "#F59E0B" }}>
                  Reserved: {totalReserved}
                </span>
                <span style={{ ...styles.badge, backgroundColor: "#EF4444" }}>
                  Lost: {totalLost}
                </span>
              </div>
            </div>

            <div>
              {user.activityHistory.map((activity: any, i: number) => (
                <div key={i} style={styles.activityBox}>
                  <p>
                    <strong>Action:</strong> {activity.action}
                  </p>
                  <p>
                    <strong>Item Type:</strong> {activity.itemType}
                  </p>
                  <p>
                    <strong>Title:</strong> {activity.meta.title}
                  </p>

                  {activity.action === "borrow" && (
                    <>
                      <p>
                        <strong>Start Time:</strong>{" "}
                        {new Date(activity.meta.startTime).toLocaleString()}
                      </p>
                      <p>
                        <strong>End Time:</strong>{" "}
                        {new Date(activity.meta.endTime).toLocaleString()}
                      </p>
                    </>
                  )}

                  {activity.action === "reserve" && (
                    <>
                      <p>
                        <strong>Reserve Start:</strong>{" "}
                        {new Date(
                          activity.meta.reserveStartTime
                        ).toLocaleString()}
                      </p>
                      <p>
                        <strong>Reserve End:</strong>{" "}
                        {new Date(
                          activity.meta.reserveEndTime
                        ).toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "2rem",
    backgroundColor: "#f9fafb",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#111827",
  },
  card: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  userName: {
    color: "#1F2937",
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  badgeContainer: {
    display: "flex",
    gap: "0.5rem",
  },
  badge: {
    backgroundColor: "#10B981",
    color: "#fff",
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.875rem",
  },
  activityBox: {
    backgroundColor: "#F3F4F6",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    borderLeft: "4px solid #3B82F6",
  },
};
