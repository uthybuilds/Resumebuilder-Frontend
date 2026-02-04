import { Award, Plus, Trash2 } from "lucide-react";
import React from "react";

const CertificationForm = ({ data, onChange }) => {
  const addCertification = () => {
    const newItem = {
      name: "",
      issuer: "",
      issue_date: "",
      expiration_date: "",
      credential_id: "",
      credential_url: "",
    };
    onChange([...(data || []), newItem]);
  };

  const removeCertification = (index) => {
    const updated = (data || []).filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateCertification = (index, field, value) => {
    const updated = [...(data || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Certifications
          </h3>
          <p className="text-sm text-gray-500">
            Add licenses and certifications
          </p>
        </div>
        <button
          onClick={addCertification}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors"
        >
          <Plus className="size-4" />
          Add Certification
        </button>
      </div>

      {(data || []).length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No certifications added yet.</p>
          <p className="text-sm">Click "Add Certification" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((cert, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4>Certification #{index + 1}</h4>
                <button
                  onClick={() => removeCertification(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={cert.name || ""}
                  onChange={(e) =>
                    updateCertification(index, "name", e.target.value)
                  }
                  placeholder="Certification name (e.g., AWS Solutions Architect)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={cert.issuer || ""}
                  onChange={(e) =>
                    updateCertification(index, "issuer", e.target.value)
                  }
                  placeholder="Issuing organization (e.g., Amazon Web Services)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="month"
                  value={cert.issue_date || ""}
                  onChange={(e) =>
                    updateCertification(index, "issue_date", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="month"
                  value={cert.expiration_date || ""}
                  onChange={(e) =>
                    updateCertification(index, "expiration_date", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="text"
                  value={cert.credential_id || ""}
                  onChange={(e) =>
                    updateCertification(index, "credential_id", e.target.value)
                  }
                  placeholder="Credential ID (optional)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  value={cert.credential_url || ""}
                  onChange={(e) =>
                    updateCertification(index, "credential_url", e.target.value)
                  }
                  placeholder="Credential URL (optional)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificationForm;

