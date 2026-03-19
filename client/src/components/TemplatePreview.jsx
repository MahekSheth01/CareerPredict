import { motion } from 'framer-motion';

const templateThemes = {
    modern: {
        accent: '#7c3aed',
        accentLight: '#ede9fe',
        heading: '#1f2937',
        body: '#374151',
        divider: '#7c3aed',
        bg: '#ffffff',
        nameFontSize: '1.5rem',
    },
    classic: {
        accent: '#1e3a5f',
        accentLight: '#dbeafe',
        heading: '#111827',
        body: '#1f2937',
        divider: '#1e3a5f',
        bg: '#fefefe',
        nameFontSize: '1.4rem',
    },
    minimal: {
        accent: '#6b7280',
        accentLight: '#f3f4f6',
        heading: '#111827',
        body: '#374151',
        divider: '#d1d5db',
        bg: '#ffffff',
        nameFontSize: '1.3rem',
    },
};

const TemplatePreview = ({ data, template = 'modern' }) => {
    const theme = templateThemes[template] || templateThemes.modern;
    const pi = data?.personalInfo || {};
    const skills = data?.skills || [];
    const education = data?.education || [];
    const experience = data?.experience || [];
    const projects = data?.projects || [];
    const certifications = data?.certifications || [];

    const contactParts = [pi.email, pi.phone, pi.linkedin].filter(Boolean);

    const SectionHeading = ({ children }) => (
        <div style={{ marginTop: '14px', marginBottom: '6px' }}>
            <h3 style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: theme.accent,
                margin: 0,
                paddingBottom: '3px',
                borderBottom: `2px solid ${theme.divider}`,
            }}>
                {children}
            </h3>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="origin-top"
            style={{
                background: theme.bg,
                color: theme.body,
                fontFamily: template === 'classic'
                    ? "'Georgia', 'Times New Roman', serif"
                    : "'Inter', 'Segoe UI', sans-serif",
                fontSize: '0.7rem',
                lineHeight: 1.5,
                padding: '28px 24px',
                minHeight: '500px',
                borderRadius: '8px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb',
            }}
        >
            {/* Name */}
            {pi.name && (
                <h1 style={{
                    fontSize: theme.nameFontSize,
                    fontWeight: 700,
                    color: template === 'minimal' ? theme.heading : theme.accent,
                    margin: '0 0 2px 0',
                    letterSpacing: template === 'classic' ? '0.02em' : '0',
                }}>
                    {pi.name}
                </h1>
            )}

            {/* Contact line */}
            {contactParts.length > 0 && (
                <p style={{ fontSize: '0.65rem', color: theme.body, margin: '0 0 8px 0' }}>
                    {contactParts.join('  •  ')}
                </p>
            )}

            {/* Divider */}
            <hr style={{ border: 'none', borderTop: `1px solid ${theme.divider}`, margin: '8px 0' }} />

            {/* Summary */}
            {pi.summary && (
                <>
                    <SectionHeading>Professional Summary</SectionHeading>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.68rem' }}>{pi.summary}</p>
                </>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <>
                    <SectionHeading>Skills</SectionHeading>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                        {skills.filter(Boolean).map((s, i) => (
                            <span key={i} style={{
                                display: 'inline-block',
                                padding: '1px 8px',
                                borderRadius: template === 'minimal' ? '2px' : '10px',
                                background: theme.accentLight,
                                color: theme.accent,
                                fontSize: '0.6rem',
                                fontWeight: 500,
                            }}>
                                {s}
                            </span>
                        ))}
                    </div>
                </>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <>
                    <SectionHeading>Experience</SectionHeading>
                    {experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <span style={{ fontWeight: 600, color: theme.heading, fontSize: '0.72rem' }}>
                                    {exp.title || 'Untitled Role'}
                                    {exp.company && <span style={{ fontWeight: 400 }}> — {exp.company}</span>}
                                </span>
                                {exp.duration && (
                                    <span style={{ fontSize: '0.6rem', color: theme.body, fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                                        {exp.duration}
                                    </span>
                                )}
                            </div>
                            {exp.description && (
                                <p style={{ margin: '2px 0 0 0', fontSize: '0.65rem' }}>{exp.description}</p>
                            )}
                        </div>
                    ))}
                </>
            )}

            {/* Education */}
            {education.length > 0 && (
                <>
                    <SectionHeading>Education</SectionHeading>
                    {education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <span style={{ fontWeight: 600, color: theme.heading, fontSize: '0.72rem' }}>
                                    {edu.degree || 'Degree'}
                                    {edu.institution && <span style={{ fontWeight: 400 }}> — {edu.institution}</span>}
                                </span>
                                {edu.year && (
                                    <span style={{ fontSize: '0.6rem', color: theme.body, fontStyle: 'italic' }}>
                                        {edu.year}
                                    </span>
                                )}
                            </div>
                            {edu.description && (
                                <p style={{ margin: '2px 0 0 0', fontSize: '0.65rem' }}>{edu.description}</p>
                            )}
                        </div>
                    ))}
                </>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <>
                    <SectionHeading>Projects</SectionHeading>
                    {projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: '5px' }}>
                            <span style={{ fontWeight: 600, color: theme.heading, fontSize: '0.72rem' }}>
                                {proj.name || 'Project'}
                            </span>
                            {proj.technologies && (
                                <span style={{ fontSize: '0.6rem', color: theme.accent, marginLeft: '6px' }}>
                                    [{proj.technologies}]
                                </span>
                            )}
                            {proj.description && (
                                <p style={{ margin: '2px 0 0 0', fontSize: '0.65rem' }}>{proj.description}</p>
                            )}
                        </div>
                    ))}
                </>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
                <>
                    <SectionHeading>Certifications</SectionHeading>
                    <ul style={{ margin: '0', paddingLeft: '16px', listStyleType: template === 'classic' ? 'square' : 'disc' }}>
                        {certifications.filter(Boolean).map((c, i) => (
                            <li key={i} style={{ fontSize: '0.65rem', marginBottom: '2px' }}>{c}</li>
                        ))}
                    </ul>
                </>
            )}

            {/* Empty state */}
            {!pi.name && skills.length === 0 && education.length === 0 && experience.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 500 }}>Start filling the form to see your resume preview</p>
                    <p style={{ fontSize: '0.65rem' }}>Your resume will appear here in real time</p>
                </div>
            )}
        </motion.div>
    );
};

export default TemplatePreview;
