
const MinimalTemplate = ({ data, accentColor }) => {
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
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-4xl font-thin mb-4 tracking-wide">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    {data.personal_info?.email && <span>{data.personal_info.email}</span>}
                    {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                    {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    {data.personal_info?.linkedin && (
                        <a href={data.personal_info.linkedin} target="_blank" rel="noopener noreferrer" className="break-all hover:underline">{data.personal_info.linkedin}</a>
                    )}
                    {data.personal_info?.github && (
                        <a href={data.personal_info.github} target="_blank" rel="noopener noreferrer" className="break-all hover:underline">{data.personal_info.github}</a>
                    )}
                    {data.personal_info?.website && (
                        <a href={data.personal_info.website} target="_blank" rel="noopener noreferrer" className="break-all hover:underline">{data.personal_info.website}</a>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-10">
                    <p className=" text-gray-700 whitespace-pre-line">
                        {data.professional_summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Experience
                    </h2>

                    <div className="space-y-6">
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-medium">{exp.position}</h3>
                                    {(() => {
                                        const start = formatDate(exp.start_date);
                                        const end = exp.is_current ? "Present" : formatDate(exp.end_date);
                                        const hasDate = !!start || !!end;
                                        return hasDate ? (
                                            <span className="text-sm text-gray-500">
                                                {start}{start && end ? " - " : ""}{end}
                                            </span>
                                        ) : null;
                                    })()}
                                </div>
                                <p className="text-gray-600 mb-2">{exp.company}</p>
                                {exp.description && (
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.project && data.project.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Projects
                    </h2>

                    <div className="space-y-4">
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex flex-col gap-2 justify-between items-baseline">
                                <h3 className="text-lg font-medium ">{proj.name}</h3>
                                <p className="text-gray-600">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Education
                    </h2>

                    <div className="space-y-4">
                        {data.education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-medium">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-600">{edu.institution}</p>
                                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                                </div>
                                {(() => {
                                    const grad = formatDate(edu.graduation_date);
                                    return grad ? (
                                        <span className="text-sm text-gray-500">
                                            {grad}
                                        </span>
                                    ) : null;
                                })()}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section>
                    <h2 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: accentColor }}>
                        Skills
                    </h2>

                    <div className="text-gray-700">
                        {data.skills.join(" • ")}
                    </div>
                </section>
            )}
        </div>
    );
}

export default MinimalTemplate;
