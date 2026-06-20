import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { getUserInfo } from "../Keycloak";

interface UserMenuProps {
  username: string | null;
  onLogout: () => void;
  onChangePassword: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ username, onLogout, onChangePassword }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const user = getUserInfo();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="dropdown" ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        className="btn btn-outline-dark"
        style={{
            borderRadius: 20,
            minWidth: 110,
            fontWeight: "bold",
            maxWidth: 150,           
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}
        onClick={() => setOpen((o) => !o)}
      >
        <i className="fas fa-user-circle mr-2"></i>
        <span
            style={{
            display: "inline-block",
            maxWidth: 70,        
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            verticalAlign: "middle",
            }}
            title={username || "User"}
        >
            {username || "User"}
        </span>
        <span className="ml-2"><i className="fas fa-caret-down"></i></span>
      </button>
      {open && (
        <div
          className="dropdown-menu show"
          style={{
            right: 0,
            left: "auto",
            minWidth: 200,
            position: "absolute",
            zIndex: 2000,
          }}
        >
            <button
            className="dropdown-item"
            onClick={() => {
              setInfoOpen(true);
              setOpen(false);
            }}
          >
            <i className="fas fa-info-circle mr-2"></i>
            My Information
          </button>
          <button className="dropdown-item" onClick={onChangePassword}>
            <i className="fas fa-key mr-2"></i>
            Change my password
          </button>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item text-danger" onClick={onLogout}>
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      )}

    <Dialog
        header="My Information"
        visible={infoOpen}
        style={{ width: "350px" }}
        onHide={() => setInfoOpen(false)}
      >
        <div>
          <div><strong>Username:</strong> {user.username || "-"}</div>
          <div><strong>Email:</strong> {user.email || "-"}</div>
          <div><strong>Name:</strong> {user.name || "-"}</div>
          {/* <div><strong>Roles:</strong> {user.roles?.join(", ") || "-"}</div>
          <div><strong>Groups:</strong> {user.groups?.join(", ") || "-"}</div> */}
        </div>
      </Dialog>
    </div>
  );
};

export default UserMenu;
