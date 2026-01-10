import React, { useEffect, useRef, useState } from "react";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";
import SidebarTemplate from "./templates/SidebarTemplate";
import SplitTemplate from "./templates/SplitTemplate";
import TimelineTemplate from "./templates/TimelineTemplate";
import CardTemplate from "./templates/CardTemplate";

const ResumePreview = ({ data, template, accentColor, classes = "" }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.offsetWidth;
      const targetWidth = 816; // Approx A4/Letter width (8.5in * 96dpi)
      const padding = 24; // keep some breathing space
      const available = Math.max(parentWidth - padding, 0);
      const newScale = Math.min(available / targetWidth, 1.15);

      setScale(newScale);

      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight * newScale);
      }
    };

    // Initial calculation
    handleResize();

    // Use ResizeObserver for more robust sizing
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [data, template]);

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />;
      case "sidebar":
        return <SidebarTemplate data={data} accentColor={accentColor} />;
      case "split":
        return <SplitTemplate data={data} accentColor={accentColor} />;
      case "timeline":
        return <TimelineTemplate data={data} accentColor={accentColor} />;
      case "card":
        return <CardTemplate data={data} accentColor={accentColor} />;

      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };
  return (
    <div
      id="resume-preview-container"
      className="w-full bg-gray-100 overflow-hidden relative"
      ref={containerRef}
      style={{ height: height ? `${height}px` : "auto" }}
    >
      <div
        ref={contentRef}
        id="resume-preview"
        style={{
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
          width: "8.5in", // Fixed width for consistent rendering (matches print size)
          left: "50%",
        }}
        className={
          "border border-gray-200 print:shadow-none print:border-none bg-white absolute top-0" +
          (classes ? " " + classes : "")
        }
      >
        {renderTemplate()}
      </div>
      <style>
        {`
          @page {
            size: auto;
            margin: 0mm;
          }
          @media print {
            html,
            body {
              width: 8.5in;
              height: 100%;
              overflow: visible;
              margin: 0;
              padding: 0;
            }
            body * {
              visibility: hidden;
            }
            #resume-preview-container {
               position: static !important;
               overflow: visible !important;
               height: auto !important;
               background: none !important;
               display: block !important;
            }
            #resume-preview,
            #resume-preview * {
              visibility: visible;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            #resume-preview {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              margin: 0;
              padding: 0;
              box-shadow: none !important;
              border: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ResumePreview;
