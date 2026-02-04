import { Mail, Phone, MapPin, Linkedin, Globe, Github } from "lucide-react";

const JakeTemplate = ({ data }) => {
  // Helper to format dates (e.g., "2023-01" -> "Jan 2023")
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const str = String(dateStr);
    const parts = str.split("-");
    if (parts.length === 1) {
      const yearOnly = parts[0];
      return yearOnly;
    }
    const [year, month] = parts;
    const date = new Date(Number(year), Number(month) - 1);
    if (isNaN(date.getTime())) {
      return `${year}-${month}`;
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const renderDateRange = (start, end, isCurrent) => {
    const startDate = formatDate(start);
    const endDate = isCurrent ? "Present" : formatDate(end);
    return `${startDate} – ${endDate}`;
  };

  // Helper to process bullet points from description
  const renderDescription = (description) => {
    if (!description) return null;

    // Split by newlines to create list items
    const lines = description.split("\n").filter((line) => line.trim());

    return (
      <ul className="list-disc ml-5 space-y-0.5 mt-1">
        {lines.map((line, i) => (
          <li key={i} className="text-gray-900 text-[16px] leading-tight">
            {line.replace(/^[•-]\s*/, "")}
          </li>
        ))}
      </ul>
    );
  };

  const getFieldOfStudy = (edu) =>
    edu?.field ||
    edu?.field_of_study ||
    edu?.fieldOfStudy ||
    edu?.major ||
    edu?.course ||
    edu?.program ||
    edu?.study ||
    edu?.department ||
    edu?.specialization ||
    edu?.discipline ||
    "";

  const getWorkType = (exp) =>
    exp?.work_type ||
    exp?.workType ||
    exp?.type ||
    exp?.employment_type ||
    exp?.employmentType ||
    "";

  const getCertName = (c) =>
    c?.name || c?.title || c?.certificate || c?.certification || "";
  const getIssuer = (c) =>
    c?.issuer || c?.organization || c?.authority || c?.provider || "";

  return (
    <div className="max-w-[800px] w-full mx-auto p-8 bg-white text-gray-900 font-serif leading-relaxed min-h-screen">
      {/* Header */}
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-1 text-gray-900">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        {(data.personal_info?.profession ||
          data.personal_info?.title ||
          data.profession) && (
          <p className="text-[16px] font-semibold text-gray-800">
            {data.personal_info?.profession ||
              data.personal_info?.title ||
              data.profession}
          </p>
        )}

        <div className="flex flex-wrap justify-center items-center gap-1 text-[14px] text-gray-900">
          {data.personal_info?.email && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <a
                href={`mailto:${data.personal_info.email}`}
                className="hover:underline text-gray-900"
              >
                {data.personal_info.email}
              </a>
              <span className="text-gray-900">|</span>
            </span>
          )}
          {(data.personal_info?.linkedin ||
            data.personal_info?.linkedin_url) && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <a
                href={
                  data.personal_info?.linkedin ||
                  data.personal_info?.linkedin_url
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-gray-900"
              >
                {data.personal_info?.linkedin ||
                  data.personal_info?.linkedin_url}
              </a>
              <span className="text-gray-900">|</span>
            </span>
          )}
          {(data.personal_info?.github ||
            data.personal_info?.github_url ||
            data.personal_info?.gitHub ||
            data.personal_info?.githubLink) && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <a
                href={
                  data.personal_info?.github ||
                  data.personal_info?.github_url ||
                  data.personal_info?.gitHub ||
                  data.personal_info?.githubLink
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-gray-900"
              >
                {data.personal_info?.github ||
                  data.personal_info?.github_url ||
                  data.personal_info?.gitHub ||
                  data.personal_info?.githubLink}
              </a>
              {(data.personal_info?.website ||
                data.personal_info?.portfolio ||
                data.personal_info?.site ||
                data.personal_info?.phone) && (
                <span className="text-gray-900">|</span>
              )}
            </span>
          )}
          {(data.personal_info?.website ||
            data.personal_info?.portfolio ||
            data.personal_info?.site) && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <a
                href={
                  data.personal_info?.website ||
                  data.personal_info?.portfolio ||
                  data.personal_info?.site
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-gray-900"
              >
                {data.personal_info?.website ||
                  data.personal_info?.portfolio ||
                  data.personal_info?.site}
              </a>
              {data.personal_info?.phone && (
                <span className="text-gray-900">|</span>
              )}
            </span>
          )}
          {data.personal_info?.phone && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              {data.personal_info.phone}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.professional_summary && (
        <section className="mb-4">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 mb-2 pb-0.5 tracking-wide text-gray-900">
            Professional Summary
          </h2>
          <p className="text-[16px] text-gray-900 leading-normal">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 mb-2 pb-0.5 tracking-wide text-gray-900">
            Work Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp, index) => (
              <div key={index}>
                {/* Role and Date */}
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900 text-[12pt]">
                    {exp.position}
                  </h3>
                  <span className="text-[14px] text-gray-900 font-bold">
                    {renderDateRange(
                      exp.start_date || exp.startDate,
                      exp.end_date || exp.endDate,
                      exp.is_current ?? exp.current ?? false,
                    )}
                  </span>
                </div>
                {/* Company and Location */}
                <div className="flex justify-between items-baseline mb-1">
                  <p className="text-[14px] italic text-gray-900">
                    {exp.company}
                  </p>
                  <span className="text-[14px] text-gray-900 italic">
                    {exp.location || "Location"}
                    {getWorkType(exp) && ` (${getWorkType(exp)})`}
                  </span>
                </div>
                {renderDescription(exp.description)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 mb-2 pb-0.5 tracking-wide text-gray-900">
            Technical Skills
          </h2>
          <div className="text-[16px] text-gray-900">
            <div className="flex flex-wrap gap-x-1">
              <span>
                {data.skills.map((skill, i) => {
                  const skillName =
                    typeof skill === "object" ? skill.name : skill;
                  return (
                    <span key={i}>
                      {skillName}
                      {i < data.skills.length - 1 ? ", " : ""}
                    </span>
                  );
                })}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {data.project && data.project.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 mb-2 pb-0.5 tracking-wide text-gray-900">
            Projects
          </h2>
          <div className="space-y-3">
            {data.project.map((proj, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="flex-1 pr-4">
                    <span className="font-bold text-gray-900 text-[12pt]">
                      {proj.name || proj.title}
                    </span>
                    {proj.technologies && (
                      <span className="text-[14px] text-gray-900 italic ml-1">
                        | {proj.technologies}
                      </span>
                    )}
                  </div>
                  {(proj.start_date ||
                    proj.end_date ||
                    proj.startDate ||
                    proj.endDate) && (
                    <span className="text-[14px] text-gray-900 font-bold whitespace-nowrap">
                      {renderDateRange(
                        proj.start_date || proj.startDate,
                        proj.end_date || proj.endDate,
                        proj.is_current ?? proj.current ?? false,
                      )}
                    </span>
                  )}
                </div>
                {renderDescription(proj.description)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 mb-2 pb-0.5 tracking-wide text-gray-900">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900 text-[12pt]">
                    {edu.institution || edu.school}
                  </h3>
                  <span className="text-[14px] text-gray-900 font-bold">
                    {edu.graduation_date ||
                    edu.graduationDate ||
                    edu.grad_date ||
                    edu.end_date ||
                    edu.endDate
                      ? formatDate(
                          edu.graduation_date ||
                            edu.graduationDate ||
                            edu.grad_date ||
                            edu.end_date ||
                            edu.endDate,
                        )
                      : ""}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <div className="text-[14px] italic text-gray-900">
                    {edu.degree || getFieldOfStudy(edu)}
                    {(edu.degree && getFieldOfStudy(edu)) ? ` in ${getFieldOfStudy(edu)}` : ""}
                  </div>
                  <span className="text-[14px] text-gray-900 italic">
                    {edu.location || "Location"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12pt] font-bold uppercase border-b border-gray-400 mb-2 pb-0.5 tracking-wide text-gray-900">
            Certifications
          </h2>
          <div className="space-y-2">
            {data.certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-gray-900 text-[12pt]">
                    {getCertName(cert)}
                  </h3>
                  <p className="text-[14px] italic text-gray-900">
                    {getIssuer(cert)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[14px] text-gray-900 font-bold block">
                    {formatDate(cert.issue_date || cert.issued || cert.date) ||
                      ""}
                  </span>
                  {(cert.credential_id || cert.credential_url) && (
                    <a
                      href={cert.credential_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-blue-600 hover:underline block"
                    >
                      {cert.credential_id ? `ID: ${cert.credential_id}` : "View Credential"}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default JakeTemplate;
