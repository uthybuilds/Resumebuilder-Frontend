import { GraduationCap, Hand, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import api from "../configs/api";

const NIGERIA_SEED = [
  "University of Lagos",
  "University of Ibadan",
  "Obafemi Awolowo University",
  "University of Nigeria",
  "University of Ilorin",
  "University of Benin",
  "University of Port Harcourt",
  "University of Calabar",
  "University of Jos",
  "University of Maiduguri",
  "University of Abuja",
  "University of Uyo",
  "University of Agriculture, Abeokuta",
  "Lagos State University",
  "Olabisi Onabanjo University",
  "Adekunle Ajasin University",
  "Federal University of Technology Akure",
  "Federal University of Technology Minna",
  "Federal University of Technology Owerri",
  "Nnamdi Azikiwe University",
  "Ahmadu Bello University",
  "Bayero University Kano",
  "Usmanu Danfodiyo University",
  "Ekiti State University",
  "Ambrose Alli University",
  "Delta State University",
  "Rivers State University",
  "Abia State University",
  "Imo State University",
  "Anambra State University",
  "Osun State University",
  "Benue State University",
  "Kwara State University",
  "Niger Delta University",
  "Kaduna State University",
  "Taraba State University",
  "Ebonyi State University",
  "Yobe State University",
  "Gombe State University",
  "Borno State University",
  "Sokoto State University",
  "Plateau State University",
  "Kogi State University",
  "Enugu State University of Science and Technology",
  "Cross River University of Technology",
  "Michael Okpara University of Agriculture",
  "Alex Ekwueme Federal University Ndufu-Alike",
  "Federal University Oye-Ekiti",
  "Federal University Dutse",
  "Federal University Dutsin-Ma",
  "Federal University Lafia",
  "Federal University Kashere",
  "Federal University Wukari",
  "Federal University Birnin Kebbi",
  "Federal University Gusau",
  "Federal University Lokoja",
  "Babcock University",
  "Covenant University",
  "Bowen University",
  "Igbinedion University",
  "Afe Babalola University",
  "American University of Nigeria",
];

const EducationForm = ({ data, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [nigeriaAll, setNigeriaAll] = useState([]);
  const [globalAll, setGlobalAll] = useState([]);

  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };
  const updateEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };
  const fetchUniversities = async (q) => {
    try {
      setLoading(true);
      const currentReq = ++requestIdRef.current;
      const { data } = await api.get("/api/ai/universities", {
        params: { q },
      });
      let names = Array.isArray(data?.suggestions) ? data.suggestions : [];
      // Client-side fallback if server returns no matches
      if ((!names || names.length === 0) && typeof fetch === "function") {
        const tryJSON = async (url) => {
          try {
            const r = await fetch(url);
            if (!r.ok) return [];
            const j = await r.json();
            return Array.isArray(j) ? j : [];
          } catch {
            return [];
          }
        };
        // Prefer Nigeria results first
        let r1 = await tryJSON(
          `https://universities.hipolabs.com/search?name=${encodeURIComponent(
            q
          )}&country=Nigeria`
        );
        let r2 = [];
        if (!r1 || r1.length === 0) {
          r2 = await tryJSON(
            `https://universities.hipolabs.com/search?name=${encodeURIComponent(
              q
            )}`
          );
        }
        if (
          (!r1 || r1.length === 0) &&
          (!r2 || r2.length === 0) &&
          q.toLowerCase().includes("university")
        ) {
          r1 = await tryJSON(
            "http://universities.hipolabs.com/search?country=Nigeria"
          );
        }
        const seen = new Set();
        names = [];
        [...(r1 || []), ...(r2 || [])].forEach((u) => {
          const n = u?.name?.trim();
          if (n && !seen.has(n)) {
            names.push(n);
            seen.add(n);
          }
        });
      }
      if (currentReq === requestIdRef.current) {
        setSuggestions(names);
        setHasSearched(true);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };
  const loadAllLists = async () => {
    try {
      setLoading(true);
      const [ng, gl] = await Promise.all([
        api.get("/api/ai/universities/all", { params: { country: "Nigeria" } }),
        api.get("/api/ai/universities/all"),
      ]);
      setNigeriaAll(
        Array.isArray(ng.data?.suggestions) ? ng.data.suggestions : []
      );
      setGlobalAll(
        Array.isArray(gl.data?.suggestions) ? gl.data.suggestions : []
      );
      let merged = Array.from(
        new Set([
          ...(ng.data?.suggestions || []),
          ...(gl.data?.suggestions || []),
          ...NIGERIA_SEED,
        ])
      );
      if (merged.length === 0) merged = NIGERIA_SEED;
      setSuggestions(merged);
      setHasSearched(true);
    } catch {
      setSuggestions(NIGERIA_SEED);
      setNigeriaAll(NIGERIA_SEED);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAllLists();
  }, []);
  const handleInstitutionChange = (index, value) => {
    updateEducation(index, "institution", value);
    setActiveIndex(index);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = value;
    if (!q || q.trim().length < 1) {
      debounceRef.current = setTimeout(() => {
        const merged = Array.from(
          new Set([...(nigeriaAll || []), ...(globalAll || [])])
        );
        setSuggestions(merged);
        setHasSearched(false);
      }, 200);
      return;
    }
    // Prefer client-side filtering first if we have full lists
    const merged = Array.from(
      new Set([...(nigeriaAll || []), ...(globalAll || [])])
    );
    if (merged.length > 0) {
      debounceRef.current = setTimeout(() => {
        const qLower = q.toLowerCase().trim();
        const source = merged.length > 0 ? merged : NIGERIA_SEED;
        let filtered =
          qLower.length === 1
            ? source.filter((n) => n.toLowerCase().startsWith(qLower))
            : source.filter((n) => n.toLowerCase().includes(qLower));
        setSuggestions(filtered.length > 0 ? filtered : source);
        setHasSearched(true);
      }, 150);
    } else {
      debounceRef.current = setTimeout(() => fetchUniversities(q.trim()), 250);
    }
  };
  const applySuggestion = (index, name) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    updateEducation(index, "institution", name);
    setSuggestions([]);
    setHasSearched(false);
    setActiveIndex(null);
  };
  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              Education
            </h3>
            <p className="text-sm text-gray-500">Add your education details</p>
          </div>
          <button
            onClick={addEducation}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors"
          >
            <Plus className="size-4" />
            Add Education
          </button>
        </div>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No education background added yet.</p>
            <p className="text-sm">Click "Add Education" to get started now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((education, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h4>Education #{index + 1}</h4>
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={education.institution || ""}
                      onChange={(e) =>
                        handleInstitutionChange(index, e.target.value)
                      }
                      onFocus={() => {
                        setActiveIndex(index);
                        const cur = (education.institution || "").trim();
                        if (cur.length < 2) {
                          loadAllLists();
                        }
                      }}
                      onBlur={() =>
                        setTimeout(
                          () => setActiveIndex((i) => (i === index ? null : i)),
                          200
                        )
                      }
                      placeholder="Institution name"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {activeIndex === index && (loading || hasSearched) && (
                      <div className="absolute left-0 top-full mt-1 w-full border border-gray-200 rounded-lg bg-white shadow-lg z-50 max-h-60 overflow-y-auto">
                        {loading && (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            Searching…
                          </div>
                        )}
                        {!loading &&
                          suggestions.length > 0 &&
                          suggestions.map((s, i) => (
                            <button
                              key={i}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applySuggestion(index, s);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 block truncate"
                            >
                              {s}
                            </button>
                          ))}
                        {!loading &&
                          suggestions.length === 0 &&
                          hasSearched && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No matches
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={education.degree || ""}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                    placeholder="Degree (e.g, Bachelor's, Masters...)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={education.field || ""}
                    onChange={(e) =>
                      updateEducation(index, "field", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Field of study"
                  />
                  <input
                    type="month"
                    value={education.graduation_date || ""}
                    onChange={(e) =>
                      updateEducation(index, "graduation_date", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <input
                  type="text"
                  value={education.gpa || ""}
                  onChange={(e) =>
                    updateEducation(index, "gpa", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="GPA (optional)"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationForm;
