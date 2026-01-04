import { Check, Layout } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const templates = [
    {
      id: "classic",
      name: "Classic",
      preview:
        "A clean, traditional resume format with clear sections and professional typography",
    },
    {
      id: "modern",
      name: "Modern",
      preview:
        "Sleek design with strategic use of color and modern font choices",
    },
    {
      id: "minimal-image",
      name: "Minimal Image",
      preview: "Minimal design with a single image and clean typography",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview: "Ultra-clean design that puts your content front and center",
    },
    {
      id: "sidebar",
      name: "Sidebar",
      preview: "Left sidebar layout with contact, skills, and education",
    },
    {
      id: "split",
      name: "Split",
      preview: "Two-column header with modern section layout",
    },
    {
      id: "timeline",
      name: "Timeline",
      preview: "Vertical timeline for experience with bold accents",
    },
    {
      id: "card",
      name: "Card",
      preview: "Section cards and chips with subtle shadows",
    },
  ];

  useEffect(() => {
    if (!isOpen || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const top = rect.bottom + 8;
    const margin = 8;
    const preferredLeft = rect.left;
    const maxLeft = window.innerWidth - margin - 288;
    const left = Math.max(margin, Math.min(preferredLeft, maxLeft));
    setPos({ top, left });
  }, [isOpen]);

  return (
    <div className="relative" ref={anchorRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 ring-blue-100 hover:ring transition-all px-3 py-3 rounded-lg"
      >
        <Layout size={14} /> <span className="max-sm:hidden">Template</span>
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[999] bg-transparent"
          />
          <div
            style={{ top: pos.top, left: pos.left, position: "fixed" }}
            className="min-w-[16rem] w-[calc(100vw-2rem)] sm:w-72 p-3 grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-3 z-[1000] bg-white rounded-md border border-gray-200 shadow-lg max-h-[80vh] overflow-y-auto"
          >
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => {
                  onChange(template.id);
                  setIsOpen(false);
                }}
                className={`relative p-2 sm:p-3 rounded-md cursor-pointer border transition-all ${
                  selectedTemplate === template.id
                    ? "border-blue-400 bg-blue-100"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                }`}
              >
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2">
                    <div className="size-4 sm:size-5 bg-blue-400 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-800 text-sm">
                    {template.name}
                  </h4>
                  <div className="mt-1 sm:mt-2 p-1.5 sm:p-2 bg-blue-50 rounded text-[10px] sm:text-xs text-gray-500 italic">
                    {template.preview}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateSelector;
