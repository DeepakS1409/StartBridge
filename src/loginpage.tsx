

import React, { useState } from "react";
import "./LoginPage.css";

type Role = "developer" | "investor" | "founder";

interface LoginPageProps {
  onLogin: (user: {
    name: string;
    email: string;
    role: Role;
  }) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<Role>("developer");
  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [theme, setTheme] = useState("Healthcare");
  const [project, setProject] = useState("");
  const [funding, setFunding] = useState("");
  const [patent, setPatent] = useState("Yes");

  const roleInfo = {
    developer: {
      icon: "💻",
      title: "Startup Developer",
      description: "I have developed a product or prototype.",
      question: "Tell us about your startup project",
    },
    investor: {
      icon: "📈",
      title: "Investor",
      description: "I am interested in funding startups.",
      question: "What are you interested in investing in?",
    },
    founder: {
      icon: "💡",
      title: "Idea Founder",
      description: "I have a startup idea and need support.",
      question: "Tell us about your startup idea",
    },
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password || (isSignup && !name)) {
      alert("Please fill in all required fields.");
      return;
    }

    // Frontend demonstration only.
    // Connect this function to your authentication backend.
    onLogin({
      name: name || email.split("@")[0],
      email,
      role,
    });
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="brand">
          <div className="brand-logo">SB</div>
          <div>
            <h2>Start<span>Bridge</span></h2>
            <small>INDIA PRE-SEED INNOVATION NETWORK</small>
          </div>
        </div>

        <div className="header-tag">INNOVATION CONNECTS US</div>
      </header>

      <main className="login-container">
        <section className="login-left">
          <div className="eyebrow">
            ✦ INDIA PRE-SEED INNOVATION NETWORK
          </div>

          <h1>
            Where Ideas Meet
            <span> Angel Capital.</span>
          </h1>

          <p className="intro">
            Connect innovative minds, discover promising startups
            and build the future together. Start your journey with
            India's startup innovation network.
          </p>

          <div className="feature-list">
            <div>✓ Discover innovative startups</div>
            <div>✓ Connect with verified investors</div>
            <div>✓ Turn your ideas into reality</div>
            <div>✓ Explore opportunities across industries</div>
          </div>

          <div className="login-stats">
            <div>
              <strong>01</strong>
              <small>Choose your role</small>
            </div>
            <div>
              <strong>02</strong>
              <small>Create your profile</small>
            </div>
            <div>
              <strong>03</strong>
              <small>Start connecting</small>
            </div>
          </div>
        </section>

        <section className="login-card">
          <div className="card-heading">
            <span className="welcome-label">WELCOME TO STARTBRIDGE</span>
            <h2>{isSignup ? "Create Your Account" : "Get Started"}</h2>
            <p>Select your account type to continue.</p>
          </div>

          <div className="role-options">
            {(Object.keys(roleInfo) as Role[]).map((item) => (
              <button
                type="button"
                key={item}
                className={`role-option ${role === item ? "selected" : ""}`}
                onClick={() => setRole(item)}
              >
                <span className="role-icon">
                  {roleInfo[item].icon}
                </span>
                <span className="role-text">
                  <strong>{roleInfo[item].title}</strong>
                  <small>{roleInfo[item].description}</small>
                </span>
                <span className="radio-circle">
                  {role === item ? "●" : "○"}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="selected-role">
              <span>{roleInfo[role].icon}</span>
              <div>
                <strong>{roleInfo[role].title}</strong>
                <small>{roleInfo[role].question}</small>
              </div>
            </div>

            {isSignup && (
              <label>
                Full Name
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            )}

            <label>
              Email Address
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {isSignup && (
              <div className="role-questions">

                {role === "developer" && (
                  <>
                    <label>
                      Startup / Product Name
                      <input
                        placeholder="Enter your product name"
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                      />
                    </label>

                    <label>
                      Product Theme
                      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                        <option>Healthcare</option>
                        <option>Education</option>
                        <option>Agriculture</option>
                        <option>Environment</option>
                        <option>Technology</option>
                        <option>Other</option>
                      </select>
                    </label>

                    <label>
                      Does your product have patent/copyright documentation?
                      <select value={patent} onChange={(e) => setPatent(e.target.value)}>
                        <option>Yes</option>
                        <option>Patent pending</option>
                        <option>No</option>
                      </select>
                    </label>
                  </>
                )}

                {role === "investor" && (
                  <>
                    <label>
                      Preferred Investment Theme
                      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                        <option>Healthcare</option>
                        <option>Education</option>
                        <option>Agriculture</option>
                        <option>Environment</option>
                        <option>Technology</option>
                        <option>All Industries</option>
                      </select>
                    </label>

                    <label>
                      Preferred Funding Range
                      <select value={funding} onChange={(e) => setFunding(e.target.value)}>
                        <option value="">Select funding range</option>
                        <option>Below ₹1 Lakh</option>
                        <option>₹1–5 Lakhs</option>
                        <option>₹5–10 Lakhs</option>
                        <option>₹10–50 Lakhs</option>
                        <option>Above ₹50 Lakhs</option>
                      </select>
                    </label>
                  </>
                )}

                {role === "founder" && (
                  <>
                    <label>
                      Startup Idea Title
                      <input
                        placeholder="What is your idea?"
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                      />
                    </label>

                    <label>
                      Startup Theme
                      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                        <option>Healthcare</option>
                        <option>Education</option>
                        <option>Agriculture</option>
                        <option>Environment</option>
                        <option>Technology</option>
                        <option>Other</option>
                      </select>
                    </label>
                  </>
                )}
              </div>
            )}

            <button type="submit" className="submit-btn">
              {isSignup ? "Create Account →" : "Continue to StartBridge →"}
            </button>
          </form>

          <div className="switch-account">
            {isSignup
              ? "Already have an account?"
              : "New to StartBridge?"}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Login" : "Create an Account"}
            </button>
          </div>

          <div className="secure-note">
            ✦ StartBridge Innovation Network
          </div>
        </section>
      </main>

      <footer className="login-footer">
        © 2026 StartBridge · Connecting Ideas, Developers & Investors
      </footer>
    </div>
  );
}
