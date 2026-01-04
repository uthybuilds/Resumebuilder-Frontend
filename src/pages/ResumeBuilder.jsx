import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const loadExistingResume = useCallback(async () => {
    try {
      const { data } = await api.get("/api/resumes/get/" + resumeId, {
        headers: {
          Authorization: token,
        },
      });

      if (data.resume) {
        const r = data.resume;
        preventAutoSave.current = true;
        const normalizedEducation = Array.isArray(r.education)
          ? r.education.map((e) => {
              if (!e?.institution && e?.company) {
                const { company, ...rest } = e;
                return { institution: company, ...rest };
              }
              return e;
            })
          : [];
        setResumeData({
          _id: r._id || "",
          title: r.title || "",
          personal_info: r.personal_info || {},
          professional_summary:
            typeof r.professional_summary === "string"
              ? r.professional_summary
              : "",
          experience: Array.isArray(r.experience) ? r.experience : [],
          education: normalizedEducation,
          project: Array.isArray(r.project) ? r.project : [],
          skills: Array.isArray(r.skills) ? r.skills : [],
          template: r.template || "classic",
          accent_color: r.accent_color || "#6366F1",
          public: r.public ?? false,
        });

        document.title = r.title;
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [resumeId, token]);

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const preventAutoSave = useRef(true);
  const [showShare, setShowShare] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const sections = [
    {
      id: "personal",
      name: "Personal info",
      icon: User,
    },
    {
      id: "summary",
      name: "Summary",
      icon: FileText,
    },
    {
      id: "skills",
      name: "Skills",
      icon: Sparkles,
    },
    {
      id: "experience",
      name: "Experience",
      icon: Briefcase,
    },
    {
      id: "education",
      name: "Education",
      icon: GraduationCap,
    },
    {
      id: "projects",
      name: "Projects",
      icon: FolderIcon,
    },
  ];

  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    if (resumeId) {
      loadExistingResume();
    }
  }, [resumeId, loadExistingResume]);

  const changeResumeVisibility = async () => {
    try {
      const nextPublic = !resumeData.public;
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify({ public: nextPublic }));
      await api.put("/api/resumes/update", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      setResumeData({ ...resumeData, public: nextPublic });
      toast.success(
        nextPublic ? "Visibility set to Public" : "Visibility set to Private"
      );
    } catch (error) {
      console.error("Error saving Resume:", error);
    }
  };

  const enhanceSummary = async () => {
    const summary = resumeData.professional_summary;
    const profession = resumeData.personal_info?.profession;

    if (!summary?.trim() && !profession?.trim()) {
      toast.error("Please enter a profession or write a draft summary first.");
      return;
    }

    try {
      const { data } = await api.post(
        "/api/ai/enhance-pro-sum",
        {
          userContent:
            summary?.trim() ||
            `Write a professional summary for a ${profession}`,
        },
        { headers: { Authorization: token } }
      );
      if (data.enhancedContent) {
        setResumeData((prev) => ({
          ...prev,
          professional_summary: data.enhancedContent,
        }));
        toast.success("Summary enhanced");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const saveResume = useCallback(
    async (payload, silent = false) => {
      try {
        const currentData = payload || resumeData;
        let updatedResumeData = structuredClone(currentData);

        if (
          updatedResumeData.personal_info &&
          typeof updatedResumeData.personal_info.image === "object"
        ) {
          delete updatedResumeData.personal_info.image;
        }

        const formData = new FormData();
        formData.append("resumeId", resumeId);
        formData.append("resumeData", JSON.stringify(updatedResumeData));
        removeBackground && formData.append("removeBackground", "yes");
        typeof currentData.personal_info?.image === "object" &&
          formData.append("image", currentData.personal_info.image);

        const { data } = await api.put("/api/resumes/update", formData, {
          headers: { Authorization: token },
        });
        if (!silent) {
          preventAutoSave.current = true;
          setResumeData(data.resume);
          toast.success(data.message || "Saved Successfully");
        }
        return data;
      } catch (error) {
        if (!silent) {
          toast.error(error?.response?.data?.message || error.message);
        }
        throw error;
      }
    },
    [resumeId, token, removeBackground, resumeData]
  );

  useEffect(() => {
    if (preventAutoSave.current) {
      preventAutoSave.current = false;
      return;
    }
    const t = setTimeout(() => {
      saveResume(null, true);
    }, 800);
    return () => clearTimeout(t);
  }, [resumeData, saveResume]);

  const handleShare = () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = frontendUrl + "/view/" + resumeId;
    setShareUrl(resumeUrl);
    setShowShare(true);
  };

  const downloadResume = () => {
    window.print();
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to={"/app"}
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* left panel - form */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/* progress bar using activeSectionIndex */}
              <div className="relative h-1 mb-6">
                <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
                <hr
                  className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 border-none transition-all duration-700 rounded-full"
                  style={{
                    width: `${
                      (activeSectionIndex * 100) / (sections.length - 1)
                    }%`,
                  }}
                />
              </div>

              {/* section navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />

                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accent_color: color,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prevIndex) =>
                          Math.max(prevIndex - 1, 0)
                        )
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      disabled={activeSectionIndex === 0}
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex((prevIndex) =>
                        Math.min(prevIndex + 1, sections.length - 1)
                      )
                    }
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1 && "opacity-50"
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                    onEnhance={enhanceSummary}
                  />
                )}

                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "projects" && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        project: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: data,
                      }))
                    }
                  />
                )}
              </div>

              <button
                onClick={() => {
                  saveResume();
                }}
                className="bg-gradient-to-br from-indigo-100 to-indigo-200 ring-indigo-300 text-indigo-600 ring hover:ring-indigo-400 transition-all rounded-md px-6 py-2 mt-6 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* right panel - Preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full pb-14">
              {/* buttons */}
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
                  >
                    <Share2Icon className="size-4" /> Share
                  </button>
                )}

                <button
                  onClick={changeResumeVisibility}
                  className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-lg ring-purple-300 hover:ring transition-colors"
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? "Public" : "Private"}
                </button>

                <button
                  onClick={downloadResume}
                  className="flex items-center py-2 px-6 gap-2 text-xs bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 rounded-lg ring-indigo-300 hover:ring transition-colors"
                >
                  <DownloadIcon className="size-4" /> Download
                </button>
              </div>
            </div>

            {/* resume preview */}
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
      {showShare && (
        <div
          onClick={() => setShowShare(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-20 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white border shadow-md rounded-lg w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-3">Share Resume</h2>
            <p className="text-sm text-gray-600 mb-2">
              Copy and share this public link:
            </p>
            <div className="flex items-center gap-2">
              <input
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border rounded"
              />
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    toast.success("Link copied");
                  } catch {
                    toast.error("Copy failed");
                  }
                }}
                className="px-3 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Copy
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Open Link
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
