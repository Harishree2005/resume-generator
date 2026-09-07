import { useState } from "react";
import "./App.css";

const emptyEducation = {
  degree: "",
  institution: "",
  location: "",
  startDate: "",
  endDate: "",
  details: "",
};

const emptyExperience = {
  jobTitle: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
};

const emptyProject = {
  name: "",
  description: "",
  technologies: "",
  link: "",
};

const emptyCertification = {
  name: "",
  issuer: "",
  date: "",
};

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    targetRole: "",
    jobDescription: "",
    skills: "",
  });

  const [education, setEducation] = useState([{ ...emptyEducation }]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([{ ...emptyProject }]);
  const [certifications, setCertifications] = useState([]);

  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function updateArrayItem(setter, index, field, value) {
    setter((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addItem(setter, template) {
    setter((previous) => [...previous, { ...template }]);
  }

  function removeItem(setter, index) {
    setter((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  async function generateResume() {
    setLoading(true);
    setError("");
    setResume(null);

    const candidate = {
      ...formData,

      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),

      education: education
        .filter(
          (item) =>
            item.degree.trim() ||
            item.institution.trim() ||
            item.details.trim()
        )
        .map((item) => ({
          ...item,
        })),

      experience: experience
        .filter(
          (item) =>
            item.jobTitle.trim() ||
            item.company.trim() ||
            item.description.trim()
        )
        .map((item) => ({
          ...item,
          description: item.description
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        })),

      projects: projects
        .filter(
          (item) =>
            item.name.trim() ||
            item.description.trim() ||
            item.technologies.trim()
        )
        .map((item) => ({
          ...item,
          technologies: item.technologies
            .split(",")
            .map((technology) => technology.trim())
            .filter(Boolean),
        })),

      certifications: certifications
        .filter(
          (item) =>
            item.name.trim() ||
            item.issuer.trim() ||
            item.date.trim()
        )
        .map((item) => ({
          ...item,
        })),
    };

    try {
      const response = await fetch(
        "https://ai-resume-generator-api.onrender.com/api/resume/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(candidate),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to generate resume.");
      }

      setResume(data.resume);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-content">
          <span className="badge">AI POWERED</span>

          <h1>AI Resume Generator</h1>

          <p>
            Create a professional, ATS-friendly resume using Gemini AI and
            intelligent prompt engineering.
          </p>
        </div>
      </header>

      <main className="container">
        {/* PERSONAL INFORMATION */}

        <section className="form-card">
          <div className="section-heading">
            <h2>Personal Information</h2>
            <p>Tell us about yourself.</p>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Hari Shree"
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="field">
              <label>Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            <div className="field">
              <label>Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Chennai, India"
              />
            </div>

            <div className="field">
              <label>LinkedIn</label>
              <input
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="linkedin.com/in/yourname"
              />
            </div>

            <div className="field">
              <label>GitHub</label>
              <input
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="github.com/yourusername"
              />
            </div>

            <div className="field full-width">
              <label>Target Job Role</label>
              <input
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                placeholder="Software Developer"
              />
            </div>

            <div className="field full-width">
              <label>Skills</label>
              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="JavaScript, React, Node.js, Python"
              />
              <small>Separate skills with commas.</small>
            </div>
          </div>
        </section>

        {/* EDUCATION */}

        <section className="form-card">
          <div className="section-heading">
            <h2>Education</h2>
            <p>Add your academic background.</p>
          </div>

          {education.map((item, index) => (
            <div className="repeatable-card" key={index}>
              <div className="repeatable-header">
                <h3>Education {index + 1}</h3>

                {education.length > 1 && (
                  <button
                    className="remove-button"
                    onClick={() => removeItem(setEducation, index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-grid">
                <div className="field">
                  <label>Degree</label>
                  <input
                    value={item.degree}
                    onChange={(event) =>
                      updateArrayItem(
                        setEducation,
                        index,
                        "degree",
                        event.target.value
                      )
                    }
                    placeholder="B.Tech Computer Science"
                  />
                </div>

                <div className="field">
                  <label>Institution</label>
                  <input
                    value={item.institution}
                    onChange={(event) =>
                      updateArrayItem(
                        setEducation,
                        index,
                        "institution",
                        event.target.value
                      )
                    }
                    placeholder="ABC University"
                  />
                </div>

                <div className="field">
                  <label>Location</label>
                  <input
                    value={item.location}
                    onChange={(event) =>
                      updateArrayItem(
                        setEducation,
                        index,
                        "location",
                        event.target.value
                      )
                    }
                    placeholder="Chennai, India"
                  />
                </div>

                <div className="field">
                  <label>Start Date</label>
                  <input
                    value={item.startDate}
                    onChange={(event) =>
                      updateArrayItem(
                        setEducation,
                        index,
                        "startDate",
                        event.target.value
                      )
                    }
                    placeholder="2022"
                  />
                </div>

                <div className="field">
                  <label>End Date</label>
                  <input
                    value={item.endDate}
                    onChange={(event) =>
                      updateArrayItem(
                        setEducation,
                        index,
                        "endDate",
                        event.target.value
                      )
                    }
                    placeholder="2026"
                  />
                </div>

                <div className="field full-width">
                  <label>Details</label>
                  <textarea
                    value={item.details}
                    onChange={(event) =>
                      updateArrayItem(
                        setEducation,
                        index,
                        "details",
                        event.target.value
                      )
                    }
                    placeholder="Relevant coursework, achievements, GPA, etc."
                    rows="3"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            className="secondary-button"
            onClick={() => addItem(setEducation, emptyEducation)}
          >
            + Add Education
          </button>
        </section>

        {/* EXPERIENCE */}

        <section className="form-card">
          <div className="section-heading">
            <h2>Experience</h2>
            <p>Add internships, jobs, or other relevant experience.</p>
          </div>

          {experience.length === 0 && (
            <div className="empty-message">
              No experience added. You can leave this section empty if you are
              a fresher.
            </div>
          )}

          {experience.map((item, index) => (
            <div className="repeatable-card" key={index}>
              <div className="repeatable-header">
                <h3>Experience {index + 1}</h3>

                <button
                  className="remove-button"
                  onClick={() => removeItem(setExperience, index)}
                >
                  Remove
                </button>
              </div>

              <div className="form-grid">
                <div className="field">
                  <label>Job Title</label>
                  <input
                    value={item.jobTitle}
                    onChange={(event) =>
                      updateArrayItem(
                        setExperience,
                        index,
                        "jobTitle",
                        event.target.value
                      )
                    }
                    placeholder="Software Engineering Intern"
                  />
                </div>

                <div className="field">
                  <label>Company</label>
                  <input
                    value={item.company}
                    onChange={(event) =>
                      updateArrayItem(
                        setExperience,
                        index,
                        "company",
                        event.target.value
                      )
                    }
                    placeholder="ABC Technologies"
                  />
                </div>

                <div className="field">
                  <label>Location</label>
                  <input
                    value={item.location}
                    onChange={(event) =>
                      updateArrayItem(
                        setExperience,
                        index,
                        "location",
                        event.target.value
                      )
                    }
                    placeholder="Chennai, India"
                  />
                </div>

                <div className="field">
                  <label>Start Date</label>
                  <input
                    value={item.startDate}
                    onChange={(event) =>
                      updateArrayItem(
                        setExperience,
                        index,
                        "startDate",
                        event.target.value
                      )
                    }
                    placeholder="June 2025"
                  />
                </div>

                <div className="field">
                  <label>End Date</label>
                  <input
                    value={item.endDate}
                    onChange={(event) =>
                      updateArrayItem(
                        setExperience,
                        index,
                        "endDate",
                        event.target.value
                      )
                    }
                    placeholder="August 2025"
                  />
                </div>

                <div className="field full-width">
                  <label>Responsibilities & Achievements</label>
                  <textarea
                    value={item.description}
                    onChange={(event) =>
                      updateArrayItem(
                        setExperience,
                        index,
                        "description",
                        event.target.value
                      )
                    }
                    placeholder={`Built React components for internal tools
Improved page performance
Worked with REST APIs`}
                    rows="6"
                  />
                  <small>
                    Put each responsibility or achievement on a separate line.
                  </small>
                </div>
              </div>
            </div>
          ))}

          <button
            className="secondary-button"
            onClick={() => addItem(setExperience, emptyExperience)}
          >
            + Add Experience
          </button>
        </section>

        {/* PROJECTS */}

        <section className="form-card">
          <div className="section-heading">
            <h2>Projects</h2>
            <p>Showcase projects that demonstrate your skills.</p>
          </div>

          {projects.map((item, index) => (
            <div className="repeatable-card" key={index}>
              <div className="repeatable-header">
                <h3>Project {index + 1}</h3>

                {projects.length > 1 && (
                  <button
                    className="remove-button"
                    onClick={() => removeItem(setProjects, index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-grid">
                <div className="field">
                  <label>Project Name</label>
                  <input
                    value={item.name}
                    onChange={(event) =>
                      updateArrayItem(
                        setProjects,
                        index,
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="AI Resume Generator"
                  />
                </div>

                <div className="field">
                  <label>Project Link</label>
                  <input
                    value={item.link}
                    onChange={(event) =>
                      updateArrayItem(
                        setProjects,
                        index,
                        "link",
                        event.target.value
                      )
                    }
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="field full-width">
                  <label>Technologies</label>
                  <input
                    value={item.technologies}
                    onChange={(event) =>
                      updateArrayItem(
                        setProjects,
                        index,
                        "technologies",
                        event.target.value
                      )
                    }
                    placeholder="React, Node.js, Gemini API"
                  />
                </div>

                <div className="field full-width">
                  <label>Description</label>
                  <textarea
                    value={item.description}
                    onChange={(event) =>
                      updateArrayItem(
                        setProjects,
                        index,
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Explain what you built, how it works, and your contribution."
                    rows="5"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            className="secondary-button"
            onClick={() => addItem(setProjects, emptyProject)}
          >
            + Add Project
          </button>
        </section>

        {/* CERTIFICATIONS */}

        <section className="form-card">
          <div className="section-heading">
            <h2>Certifications</h2>
            <p>Add relevant certifications.</p>
          </div>

          {certifications.map((item, index) => (
            <div className="repeatable-card" key={index}>
              <div className="repeatable-header">
                <h3>Certification {index + 1}</h3>

                <button
                  className="remove-button"
                  onClick={() =>
                    removeItem(setCertifications, index)
                  }
                >
                  Remove
                </button>
              </div>

              <div className="form-grid">
                <div className="field">
                  <label>Certification</label>
                  <input
                    value={item.name}
                    onChange={(event) =>
                      updateArrayItem(
                        setCertifications,
                        index,
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="Google Cloud Certification"
                  />
                </div>

                <div className="field">
                  <label>Issuer</label>
                  <input
                    value={item.issuer}
                    onChange={(event) =>
                      updateArrayItem(
                        setCertifications,
                        index,
                        "issuer",
                        event.target.value
                      )
                    }
                    placeholder="Google"
                  />
                </div>

                <div className="field">
                  <label>Date</label>
                  <input
                    value={item.date}
                    onChange={(event) =>
                      updateArrayItem(
                        setCertifications,
                        index,
                        "date",
                        event.target.value
                      )
                    }
                    placeholder="2026"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            className="secondary-button"
            onClick={() =>
              addItem(setCertifications, emptyCertification)
            }
          >
            + Add Certification
          </button>
        </section>

        {/* JOB DESCRIPTION */}

        <section className="form-card">
          <div className="section-heading">
            <h2>Target Job</h2>
            <p>
              Paste the job description so Gemini can tailor your resume.
            </p>
          </div>

          <div className="field">
            <label>Job Description</label>

            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Paste the complete job description here..."
              rows="10"
            />
          </div>

          <button
            className="generate-button"
            onClick={generateResume}
            disabled={loading}
          >
            {loading ? "Generating Resume..." : "✨ Generate Resume"}
          </button>

          {error && <div className="error">{error}</div>}
        </section>

        {/* GENERATED RESUME */}

        {resume && (
          <section className="resume-card">
            <div className="resume-actions">
              <h2>Generated Resume</h2>

              <button onClick={() => window.print()}>
                Print / Save PDF
              </button>
            </div>

            <div className="resume-preview">
              <div className="resume-header">
                <h1>{resume.personalInfo?.name}</h1>

                <p>
                  {resume.personalInfo?.email}
                  {resume.personalInfo?.phone &&
                    ` • ${resume.personalInfo.phone}`}
                  {resume.personalInfo?.location &&
                    ` • ${resume.personalInfo.location}`}
                </p>

                <p>
                  {resume.personalInfo?.linkedin}
                  {resume.personalInfo?.github &&
                    ` • ${resume.personalInfo.github}`}
                </p>
              </div>

              {resume.professionalSummary && (
                <div className="resume-section">
                  <h3>Professional Summary</h3>
                  <p>{resume.professionalSummary}</p>
                </div>
              )}

              {resume.skills?.length > 0 && (
                <div className="resume-section">
                  <h3>Skills</h3>
                  <p>{resume.skills.join(" • ")}</p>
                </div>
              )}

              {resume.experience?.length > 0 && (
                <div className="resume-section">
                  <h3>Experience</h3>

                  {resume.experience.map((item, index) => (
                    <div className="resume-item" key={index}>
                      <h4>
                        {item.jobTitle}
                        {item.company && ` — ${item.company}`}
                      </h4>

                      <p className="muted">
                        {item.location}
                        {item.startDate && ` | ${item.startDate}`}
                        {item.endDate && ` - ${item.endDate}`}
                      </p>

                      <ul>
                        {item.description?.map((bullet, bulletIndex) => (
                          <li key={bulletIndex}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {resume.education?.length > 0 && (
                <div className="resume-section">
                  <h3>Education</h3>

                  {resume.education.map((item, index) => (
                    <div className="resume-item" key={index}>
                      <h4>{item.degree}</h4>

                      <p>
                        {item.institution}
                        {item.location && ` — ${item.location}`}
                      </p>

                      <p className="muted">
                        {item.startDate}
                        {item.endDate && ` - ${item.endDate}`}
                      </p>

                      {item.details && <p>{item.details}</p>}
                    </div>
                  ))}
                </div>
              )}

              {resume.projects?.length > 0 && (
                <div className="resume-section">
                  <h3>Projects</h3>

                  {resume.projects.map((project, index) => (
                    <div className="resume-item" key={index}>
                      <h4>{project.name}</h4>

                      <p>{project.description}</p>

                      {project.technologies?.length > 0 && (
                        <p>
                          <strong>Technologies:</strong>{" "}
                          {project.technologies.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {resume.certifications?.length > 0 && (
                <div className="resume-section">
                  <h3>Certifications</h3>

                  {resume.certifications.map((certification, index) => (
                    <div className="resume-item" key={index}>
                      <h4>{certification.name}</h4>

                      <p>
                        {certification.issuer}
                        {certification.date &&
                          ` • ${certification.date}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {resume.atsSuggestions?.length > 0 && (
                <div className="ats-box">
                  <h3>ATS Suggestions</h3>

                  <ul>
                    {resume.atsSuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;