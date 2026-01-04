import React from "react";

const LogoIcon = ({ className = "", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g transform="translate(5, 0)">
        <path
          d="M5 0H25C27.7614 0 30 2.23858 30 5V35C30 37.7614 27.7614 40 25 40H5C2.23858 40 0 37.7614 0 35V5C0 2.23858 2.23858 0 5 0Z"
          fill="#4F46E5"
        />
        <rect
          x="6"
          y="10"
          width="18"
          height="3"
          rx="1.5"
          fill="white"
          fillOpacity="0.9"
        />
        <rect
          x="6"
          y="18"
          width="18"
          height="3"
          rx="1.5"
          fill="white"
          fillOpacity="0.9"
        />
        <rect
          x="6"
          y="26"
          width="12"
          height="3"
          rx="1.5"
          fill="white"
          fillOpacity="0.9"
        />
        <path
          d="M28 0L29.5 3.5L33 5L29.5 6.5L28 10L26.5 6.5L23 5L26.5 3.5L28 0Z"
          fill="#F59E0B"
          stroke="white"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};

export default LogoIcon;
