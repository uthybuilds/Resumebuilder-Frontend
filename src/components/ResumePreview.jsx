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
      {/* Screen Preview (Scaled & Centered) */}
      <div
        ref={contentRef}
        id="resume-preview"
        style={{
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
          width: "8.5in",
          left: "50%",
        }}
        className={
          "print:hidden border border-gray-200 bg-white absolute top-0" +
          (classes ? " " + classes : "")
        }
      >
        {renderTemplate()}
      </div>

      {/* Print Preview (Native Flow, No Transforms) */}
      <div id="print-only-resume" className="hidden print:block">
        {renderTemplate()}
      </div>

      <style>
        {`
          @page {
            size: auto;
            margin: 0mm;
          }
          @media print {
            /* 1. Hide EVERYTHING on the page by default */
            body * {
              visibility: hidden;
            }

            /* 2. Make the print-only resume visible */
            #print-only-resume,
            #print-only-resume * {
              visibility: visible;
            }

            /* 3. Position the resume at the very top-left of the paper */
            #print-only-resume {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
            }

            /* 4. Ensure backgrounds/colors print correctly */
            * {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ResumePreview;
