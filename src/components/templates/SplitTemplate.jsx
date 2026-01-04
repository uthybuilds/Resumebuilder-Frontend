import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const SplitTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const s = String(dateStr).trim();
    if (!s || s.toLowerCase().includes("invalid")) return "";
    if (/^\d{4}$/.test(s)) {
      return new Date(parseInt(s, 10), 0, 1).toLocaleDateString("en-US", { year: "numeric" });
    }
    const iso = s.match(/^(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?$/);
    if (iso) {
      const y = parseInt(iso[1], 10);
      const m = parseInt(iso[2], 10);
      if (y && m >= 1 && m <= 12) {
        return new Date(y, m - 1, 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
      }
    }
    const word = s.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (word) {
      const map = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,sept:8,oct:9,nov:10,dec:11,
        january:0,february:1,march:2,april:3,june:5,july:6,august:7,september:8,october:9,november:10,december:11 };
      const key = word[1].toLowerCase();
      const mo = map[key];
      const y = parseInt(word[2], 10);
      if (mo !== undefined) {
        return new Date(y, mo, 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
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
      <header className="grid grid-cols-2 gap-6 p-8 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            {data.personal_info?.full_name || "Your Name"}
          </h1>
          <p className="text-sm text-gray-600">
            {data?.personal_info?.profession || "Profession"}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end text-sm">
          {data.personal_info?.email && (
            <div className="flex items-center gap-2">
              <Mail className="size-4" style={{ color: accentColor }} />
              <span className="break-all">{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4" style={{ color: accentColor }} />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4" style={{ color: accentColor }} />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <a
              target="_blank"
              href={data.personal_info.linkedin}
              className="flex items-center gap-2"
            >
              <Linkedin className="size-4" style={{ color: accentColor }} />
              <span className="break-all text-xs">
                {data.personal_info.linkedin.split("https://www.")[1]
                  ? data.personal_info.linkedin.split("https://www.")[1]
                  : data.personal_info.linkedin}
              </span>
            </a>
          )}
          {data.personal_info?.website && (
            <a
              target="_blank"
              href={data.personal_info.website}
              className="flex items-center gap-2"
            >
              <Globe className="size-4" style={{ color: accentColor }} />
              <span className="break-all text-xs">
                {data.personal_info.website.split("https://")[1]
                  ? data.personal_info.website.split("https://")[1]
                  : data.personal_info.website}
              </span>
            </a>
          )}
        </div>
      </header>

      <div className="p-8">
        {data.professional_summary && (
          <section className="mb-8">
            <h2
              className="text-xs uppercase tracking-widest font-semibold mb-3"
              style={{ color: accentColor }}
            >
              Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {data.professional_summary}
            </p>
          </section>
        )}

        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-xs uppercase tracking-widest font-semibold mb-4"
              style={{ color: accentColor }}
            >
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.position}</h3>
                      <p className="text-sm" style={{ color: accentColor }}>
                        {exp.company}
                      </p>
                    </div>
                    {(() => {
                      const start = formatDate(exp.start_date);
                      const end = exp.is_current ? "Present" : formatDate(exp.end_date);
                      const hasDate = !!start || !!end;
                      return hasDate ? (
                        <div className="text-xs text-gray-500">
                          {start}{start && end ? " - " : ""}{end}
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
              className="text-xs uppercase tracking-widest font-semibold mb-4"
              style={{ color: accentColor }}
            >
              Projects
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.project.map((p, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="text-md font-medium">{p.name}</h3>
                  {p.description && (
                    <p className="text-sm text-gray-700 mt-1">{p.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills && data.skills.length > 0 && (
          <section>
            <h2
              className="text-xs uppercase tracking-widest font-semibold mb-3"
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
  );
};

export default SplitTemplate;
