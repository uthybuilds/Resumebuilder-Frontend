import { Briefcase, Plus, Sparkles, Trash2 } from "lucide-react";
import React from "react";
import api from "../configs/api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ExperienceForm = ({ data, onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [loadingIndex, setLoadingIndex] = React.useState(null);
  const sanitizeDescription = (text) => {
    const lines = String(text)
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((l) =>
        l
          .replace(/^\s*(?:[-*••]|[0-9]+[.)]|[a-zA-Z][.)]|–|—)\s+/, "")
          .replace(/\s+/g, " ")
          .trim()
      );
    return lines.join("\n");
  };

  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };
  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };
  const enhanceDescription = async (index) => {
    if (loadingIndex !== null) return;
    const exp = data[index] || {};
    const desc = (exp.description || "").trim();
    const position = (exp.position || "").trim();
    const company = (exp.company || "").trim();
    if (!desc && !position) {
      toast.error("Please add a job title or write a draft description first.");
      return;
    }
    try {
      setLoadingIndex(index);
      const { data: resp } = await api.post(
        "/api/ai/enhance-job-desc",
        {
          userContent:
            desc ||
            `Write a concise, achievement-focused job description for a ${position}${
              company ? " at " + company : ""
            }. Use 1–2 ATS-friendly sentences.`,
        },
        { headers: { Authorization: token } }
      );
      if (resp.enhancedContent) {
        updateExperience(
          index,
          "description",
          sanitizeDescription(resp.enhancedContent)
        );
        toast.success("Description enhanced");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoadingIndex(null);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Professional Experience
          </h3>
          <p className="text-sm text-gray-500">Add your job experience</p>
        </div>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors"
        >
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience added yet.</p>
          <p className="text-sm">Click 'Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((experience, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4>Experience #{index + 1}</h4>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={experience.company || ""}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                  placeholder="Company name"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={experience.position || ""}
                  onChange={(e) =>
                    updateExperience(index, "position", e.target.value)
                  }
                  placeholder="Job Title"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="month"
                  value={experience.start_date || ""}
                  onChange={(e) =>
                    updateExperience(index, "start_date", e.target.value)
                  }
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="month"
                  value={experience.end_date || ""}
                  disabled={experience.is_current}
                  onChange={(e) =>
                    updateExperience(index, "end_date", e.target.value)
                  }
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={experience.is_current || false}
                  onChange={(e) => {
                    updateExperience(
                      index,
                      "is_current",
                      e.target.checked ? true : false
                    );
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Currently working here
                </span>
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Job Description
                  </label>
                  <button
                    onClick={() => enhanceDescription(index)}
                    disabled={loadingIndex === index}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    {loadingIndex === index
                      ? "Enhancing..."
                      : "Enhance With AI"}
                  </button>
                </div>
                <textarea
                  value={experience.description || ""}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  onPaste={(e) => {
                    e.preventDefault();
                    const text = e.clipboardData.getData("text/plain");
                    updateExperience(index, "description", text);
                  }}
                  rows={4}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe your key responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
