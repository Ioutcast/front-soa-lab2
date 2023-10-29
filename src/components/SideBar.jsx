import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaThList, FaFlushed, FaIceCream } from "react-icons/fa";

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const sideBarOption = [
    {
      path: "/",
      name: "Collection",
      icon: <FaThList />,
    },
    {
      path: "/extra",
      name: "Extra",
      icon: <FaIceCream />,
    },
    {
      path: "/hr",
      name: "Hr",
      icon: <FaFlushed />,
    },
  ];
  return (
    <div className="container">
      <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">
        <div className="top_section">
          <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        {sideBarOption.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeclassName="active"
          >
            <div className="icon">{item.icon}</div>
            <div
              style={{ display: isOpen ? "block" : "none" }}
              className="link_text"
            >
              {item.name}
            </div>
          </NavLink>
        ))}
      </div>
      <main>{children}</main>
    </div>
  );
};

export default SideBar;
