const CardTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const s = String(dateStr).trim();
    if (!s || s.toLowerCase().includes("invalid")) return "";
    if (/^\d{4}$/.test(s)) {
      return new Date(parseInt(s, 10), 0, 1).toLocaleDateString("en-US", {
        year: "numeric",
      });
    }
    const iso = s.match(/^(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?$/);
    if (iso) {
      const y = parseInt(iso[1], 10);
      const m = parseInt(iso[2], 10);
      if (y && m >= 1 && m <= 12) {
        return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });
      }
    }
    const word = s.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (word) {
      const map = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        sept: 8,
        oct: 9,
        nov: 10,
        dec: 11,
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11,
      };
      const key = word[1].toLowerCase();
      const mo = map[key];
      const y = parseInt(word[2], 10);
      if (mo !== undefined) {
        return new Date(y, mo, 1).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });
      }
    }
    if (/present/i.test(s)) return "Present";
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    }
    return "";
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900">
      <div className="p-8">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold">
              {data.personal_info?.full_name || "Your Name"}
            </h1>
            <p className="text-sm text-gray-600">
              {data?.personal_info?.profession || "Profession"}
            </p>
          </div>
        </div>

        {data.professional_summary && (
          <section className="mb-8">
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: accentColor + "20" }}
            >
              <p className="text-gray-700 leading-relaxed">
                {data.professional_summary}
              </p>
            </div>
          </section>
        )}

        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-sm uppercase tracking-widest font-semibold mb-4"
              style={{ color: accentColor }}
            >
              Experience
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.experience.map((exp, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 shadow-sm"
                  style={{ borderColor: accentColor + "50" }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.position}</h3>
                      <p className="text-sm" style={{ color: accentColor }}>
                        {exp.company}
                      </p>
                    </div>
                    {(() => {
                      const start = formatDate(exp.start_date);
                      const end = exp.is_current
                        ? "Present"
                        : formatDate(exp.end_date);
                      const hasDate = !!start || !!end;
                      return hasDate ? (
                        <div className="text-xs text-gray-500">
                          {start}
                          {start && end ? " - " : ""}
                          {end}
                        </div>
                      ) : null;
                    })()}
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 mt-2 whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.project && data.project.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-sm uppercase tracking-widest font-semibold mb-4"
              style={{ color: accentColor }}
            >
              Projects
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.project.map((p, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 shadow-sm"
                  style={{ borderColor: accentColor + "50" }}
                >
                  <h3 className="text-md font-medium">{p.name}</h3>
                  {p.description && (
                    <p className="text-sm text-gray-700 mt-1">
                      {p.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {data.education && data.education.length > 0 && (
            <section>
              <h2
                className="text-sm uppercase tracking-widest font-semibold mb-3"
                style={{ color: accentColor }}
              >
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(edu.graduation_date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2
                className="text-sm uppercase tracking-widest font-semibold mb-3"
                style={{ color: accentColor }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs rounded-full"
                    style={{ backgroundColor: accentColor, color: "#fff" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardTemplate;
