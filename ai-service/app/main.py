from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import joblib
import numpy as np
import os
import json
import threading
import re
import io

app = FastAPI(title="AI Career Predictor API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
MODEL_PATH = "app/models/saved"
CUSTOM_SKILLS_PATH = "app/models/custom_skills.json"

# Thread lock for safe file writes
_custom_skills_lock = threading.Lock()

try:
    classifier = joblib.load(f"{MODEL_PATH}/career_classifier.pkl")
    clusterer = joblib.load(f"{MODEL_PATH}/career_clusterer.pkl")
    scaler = joblib.load(f"{MODEL_PATH}/scaler.pkl")
    cluster_labels = joblib.load(f"{MODEL_PATH}/cluster_labels.pkl")
    feature_names = joblib.load(f"{MODEL_PATH}/feature_names.pkl")
    print("[OK] Models loaded successfully")
except Exception as e:
    print(f"[ERROR] Error loading models: {e}")
    print("[WARN]  Please run 'python train_models.py' first")

# ── Custom skills registry ────────────────────────────────────────────
def _load_custom_skills() -> Dict[str, str]:
    """Load custom skills from JSON file. Returns { display_name: feature_key }."""
    if os.path.exists(CUSTOM_SKILLS_PATH):
        try:
            with open(CUSTOM_SKILLS_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def _save_custom_skills(skills: Dict[str, str]):
    """Persist custom skills dict to JSON."""
    with _custom_skills_lock:
        with open(CUSTOM_SKILLS_PATH, "w", encoding="utf-8") as f:
            json.dump(skills, f, indent=2, ensure_ascii=False)

# Load once on startup
custom_skills_registry: Dict[str, str] = _load_custom_skills()

# Request model
class AssessmentData(BaseModel):
    technicalSkills: List[str] = []
    softSkills: List[str] = []
    interests: Dict[str, int] = {}
    gpa: float = 0.0
    strongSubjects: List[str] = []
    projectsCompleted: int = 0
    internshipExperience: str = "none"
    preferredWorkStyle: str = "flexible"

# Built-in skill mapping
SKILL_MAPPING = {
    'Python': 'python',
    'JavaScript': 'javascript',
    'Java': 'java',
    'C++': 'cpp',
    'SQL': 'sql',
    'React': 'react',
    'Node.js': 'nodejs',
    'Machine Learning': 'ml',
    'Data Analysis': 'data_analysis',
    'Cloud Computing': 'cloud',
    'Docker': 'docker',
    'Kubernetes': 'kubernetes',
    'Git': 'git',
    'AWS': 'aws',
    'Azure': 'azure',
    'MongoDB': 'mongodb',
    'PostgreSQL': 'postgresql',
    'TensorFlow': 'tensorflow',
    'PyTorch': 'pytorch',
    'Figma': 'figma',
    'Adobe XD': 'adobe_xd',
    'UI/UX Design': 'uiux_design',
    'Cybersecurity': 'cybersecurity',
    'Networking': 'networking',
    'Linux': 'linux',
    'DevOps': 'devops',
    'CI/CD': 'cicd',
    'Communication': 'communication',
    'Leadership': 'leadership',
    'Teamwork': 'teamwork',
    'Problem Solving': 'problem_solving',
    'Critical Thinking': 'critical_thinking',
    'Time Management': 'time_management',
    'Adaptability': 'adaptability',
    'Creativity': 'creativity',
    'Attention to Detail': 'attention_to_detail',
    'Presentation Skills': 'presentation_skills',
}

def _make_feature_key(display_name: str) -> str:
    """Convert a display skill name to a safe feature key."""
    return "custom_" + display_name.lower().replace(" ", "_").replace("/", "_").replace("-", "_").replace(".", "_")

def _register_custom_skill(display_name: str) -> str:
    """Register a new custom skill if it isn't already known. Returns the feature key."""
    global custom_skills_registry

    # Already in built-in mapping?
    if display_name in SKILL_MAPPING:
        return SKILL_MAPPING[display_name]

    # Already registered as custom?
    if display_name in custom_skills_registry:
        return custom_skills_registry[display_name]

    # New – register it
    feature_key = _make_feature_key(display_name)
    custom_skills_registry[display_name] = feature_key
    _save_custom_skills(custom_skills_registry)
    print(f"📝 Registered new custom skill: {display_name} → {feature_key}")
    return feature_key


def prepare_features(data: AssessmentData) -> tuple:
    """Convert assessment data to feature vector.
    Returns (feature_vector, custom_skill_count) where custom_skill_count
    is the number of skills the user has that aren't in the trained model's
    feature set (used to boost readiness score).
    """
    
    # Initialize feature dict
    features = {fn: 0 for fn in feature_names}
    custom_skill_count = 0
    
    # Map technical skills
    for skill in data.technicalSkills:
        feature_name = SKILL_MAPPING.get(skill)
        if feature_name and feature_name in features:
            features[feature_name] = 1
        else:
            # Register the custom skill for future retraining
            fk = _register_custom_skill(skill)
            # If the model was retrained with this skill, use it
            if fk in features:
                features[fk] = 1
            else:
                # Not yet in the model – count for readiness bonus
                custom_skill_count += 1
    
    # Map soft skills
    for skill in data.softSkills:
        feature_name = SKILL_MAPPING.get(skill)
        if feature_name and feature_name in features:
            features[feature_name] = 1
    
    # Map interests
    features['coding_interest'] = data.interests.get('coding', 3)
    features['design_interest'] = data.interests.get('design', 3)
    features['analytics_interest'] = data.interests.get('analytics', 3)
    features['management_interest'] = data.interests.get('management', 3)
    features['research_interest'] = data.interests.get('research', 3)
    
    # Map academic and experience
    features['gpa'] = data.gpa
    features['projects_completed'] = data.projectsCompleted
    
    # Map internship experience to months
    internship_map = {
        'none': 0,
        '1-3 months': 2,
        '3-6 months': 4,
        '6+ months': 7,
    }
    features['internship_months'] = internship_map.get(data.internshipExperience, 0)
    
    # Convert to numpy array in correct order
    feature_vector = np.array([features[fn] for fn in feature_names]).reshape(1, -1)
    
    return feature_vector, custom_skill_count

def calculate_interest_alignment(career: str, interests: Dict[str, int]) -> float:
    """Calculate interest alignment score for a specific career (0-15 points)"""
    
    # Define which interests are most relevant for each career
    career_interest_mapping = {
        'Data Scientist': {
            'analytics': 3.0,  # Weight
            'research': 2.0,
            'coding': 2.0,
        },
        'Backend Developer': {
            'coding': 3.5,
            'analytics': 1.0,
        },
        'Frontend Developer': {
            'coding': 2.5,
            'design': 3.0,
        },
        'DevOps Engineer': {
            'coding': 2.5,
            'analytics': 1.5,
        },
        'UI/UX Designer': {
            'design': 4.0,
            'analytics': 1.0,
        },
        'Business Analyst': {
            'analytics': 3.0,
            'management': 2.5,
        },
        'Cybersecurity Analyst': {
            'coding': 2.0,
            'analytics': 2.5,
        },
        'AI Engineer': {
            'coding': 2.5,
            'research': 3.0,
            'analytics': 1.5,
        },
        'Product Manager': {
            'management': 3.5,
            'analytics': 2.0,
        },
    }
    
    # Get relevant interests for this career
    relevant_interests = career_interest_mapping.get(career, {})
    
    if not relevant_interests:
        return 7.5  # Default mid-score if career not mapped
    
    # Calculate weighted interest score
    total_weight = sum(relevant_interests.values())
    weighted_score = 0
    
    for interest_name, weight in relevant_interests.items():
        user_interest_level = interests.get(interest_name, 3)  # Default to 3 if not provided
        # Normalize (1-5 scale) to contribution
        normalized = (user_interest_level / 5.0) * weight
        weighted_score += normalized
    
    # Scale to 0-15 points
    max_possible = total_weight
    interest_score = (weighted_score / max_possible) * 15
    
    return round(interest_score, 2)


@app.get("/")
def read_root():
    return {
        "message": "AI Career Predictor API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "models_loaded": True
    }

@app.get("/skills")
def get_all_skills():
    """Return all known skills: built-in technical + custom."""
    builtin_technical = [
        k for k in SKILL_MAPPING.keys()
        if SKILL_MAPPING[k] not in (
            'communication', 'leadership', 'teamwork', 'problem_solving',
            'critical_thinking', 'time_management', 'adaptability',
            'creativity', 'attention_to_detail', 'presentation_skills',
        )
    ]
    custom = list(custom_skills_registry.keys())
    return {
        "builtin": builtin_technical,
        "custom": custom,
        "all": builtin_technical + custom,
    }

@app.post("/predict")
async def predict_career(data: AssessmentData):
    """Predict career paths based on assessment data"""
    
    try:
        # Prepare features (now also returns custom_skill_count)
        features, custom_skill_count = prepare_features(data)
        
        # Get career predictions with probabilities
        probabilities = classifier.predict_proba(features)[0]
        classes = classifier.classes_
        
        # Get top 3 predictions
        top_3_indices = np.argsort(probabilities)[-3:][::-1]
        predictions = [
            {
                "career": classes[idx],
                "probability": round(float(probabilities[idx]) * 100, 2)
            }
            for idx in top_3_indices
        ]
        
        # Get cluster prediction
        features_scaled = scaler.transform(features)
        cluster_id = clusterer.predict(features_scaled)[0]
        cluster_group = cluster_labels.get(cluster_id, "Unknown")
        
        # Calculate readiness score (0-100)
        # Based on: skills count, projects, internship, GPA, interest alignment, and custom skills
        skill_count = len(data.technicalSkills) + len(data.softSkills)
        skill_score = min(skill_count * 2, 25)  # Max 25 points
        project_score = min(data.projectsCompleted * 3, 20)  # Max 20 points
        
        internship_scores = {'none': 0, '1-3 months': 10, '3-6 months': 15, '6+ months': 20}
        internship_score = internship_scores.get(data.internshipExperience, 0)
        
        gpa_score = min((data.gpa / 10) * 20, 20)  # Max 20 points
        
        # Interest alignment score (Max 15 points)
        top_career = predictions[0]["career"]
        interest_score = calculate_interest_alignment(top_career, data.interests)

        # Custom skills bonus: each unknown-to-the-model skill adds a small bonus
        # Capped at 5 extra points so it doesn't dominate
        custom_bonus = min(custom_skill_count * 1.5, 5)
        
        readiness_score = round(
            skill_score + project_score + internship_score + gpa_score + interest_score + custom_bonus,
            2
        )
        # Cap at 100
        readiness_score = min(readiness_score, 100)
        
        return {
            "success": True,
            "predictions": predictions,
            "cluster": cluster_group,
            "readiness_score": readiness_score,
            "breakdown": {
                "skill_score": skill_score,
                "project_score": project_score,
                "internship_score": internship_score,
                "gpa_score": round(gpa_score, 2),
                "interest_alignment_score": interest_score,
                "custom_skill_bonus": custom_bonus,
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/careers")
def get_supported_careers():
    """Get list of supported career predictions"""
    return {
        "careers": list(classifier.classes_)
    }

# ── Resume Analyzer ──────────────────────────────────────────────────

# Load skill dictionary
SKILL_DICT_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "skill_dictionary.json")
try:
    with open(SKILL_DICT_PATH, "r", encoding="utf-8") as _f:
        SKILL_DICTIONARY: Dict[str, List[str]] = json.load(_f)
    print(f"[OK] Skill dictionary loaded: {len(SKILL_DICTIONARY)} categories")
except Exception as _e:
    print(f"[WARN] Could not load skill_dictionary.json: {_e}")
    SKILL_DICTIONARY = {}

# Try to load spaCy (graceful fallback to regex if unavailable)
try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
    SPACY_AVAILABLE = True
    print("[OK] spaCy model loaded")
except Exception:
    SPACY_AVAILABLE = False
    print("[WARN] spaCy not available - using regex-based tokenisation")


def _extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF bytes. Tries pdfminer first, then PyPDF2 as fallback."""
    # Primary: pdfminer.six
    try:
        from pdfminer.high_level import extract_text as pdfminer_extract
        text = pdfminer_extract(io.BytesIO(file_bytes))
        if text and len(text.strip()) > 20:
            return text
    except Exception:
        pass

    # Fallback: PyPDF2
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        pages = [page.extract_text() or "" for page in reader.pages]
        text = "\n".join(pages)
        if text and len(text.strip()) > 20:
            return text
    except Exception:
        pass

    return ""


def _clean_text(text: str) -> str:
    """Lowercase, collapse whitespace, remove non-alpha junk."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s/\.\+\#]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


# Keywords with length <= this threshold use word-boundary matching to avoid false positives
_BOUNDARY_THRESHOLD = 8


def _kw_pattern(kw: str) -> re.Pattern:
    """Return a compiled regex pattern for a keyword.
    Short keywords use word boundaries; longer ones use simple substring with surrounding spaces.
    """
    kw_esc = re.escape(kw)
    if len(kw) <= _BOUNDARY_THRESHOLD:
        return re.compile(r"(?<![a-z0-9])" + kw_esc + r"(?![a-z0-9])", re.I)
    else:
        return re.compile(r"(?<![a-z])" + kw_esc + r"(?![a-z])", re.I)


# Build patterns once at load time for performance
_SKILL_PATTERNS: Dict[str, List[tuple]] = {}
for _cat, _kws in SKILL_DICTIONARY.items():
    _SKILL_PATTERNS[_cat] = [(_kw, _kw_pattern(_kw.lower())) for _kw in _kws]


def _extract_skills(text: str) -> Dict[str, List[str]]:
    """
    Match predefined skill keywords against cleaned resume text.
    Uses word-boundary regex for short keywords to avoid false positives.
    Returns {category: [matched_keywords]}.
    """
    cleaned = _clean_text(text)

    # Also get lemmatised tokens from spaCy if available
    if SPACY_AVAILABLE:
        doc = nlp(cleaned[:100_000])   # limit length for perf
        lemma_text = " ".join([t.lemma_ for t in doc if not t.is_stop and not t.is_punct])
    else:
        lemma_text = ""

    search_targets = [cleaned, lemma_text] if lemma_text else [cleaned]

    found: Dict[str, List[str]] = {}
    for category, kw_patterns in _SKILL_PATTERNS.items():
        matched_kw: List[str] = []
        for kw, pattern in kw_patterns:
            for target in search_targets:
                if pattern.search(target):
                    matched_kw.append(kw)
                    break
        if matched_kw:
            found[category] = matched_kw

    return found


@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    """Extract skills from a PDF resume using local NLP."""

    # Accept any pdf-like content type (octet-stream is sent when forwarded via Node)
    ct = (file.content_type or "").lower()
    if "pdf" not in ct and ct not in ("application/octet-stream", ""):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must not exceed 5 MB.")

    try:
        raw_text = _extract_text_from_pdf(contents)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Failed to extract text from PDF: {exc}")

    if not raw_text or len(raw_text.strip()) < 20:
        raise HTTPException(status_code=422, detail="Could not extract meaningful text from the PDF.")

    matched_skills = _extract_skills(raw_text)
    # Return category names (human-readable keys like 'python', 'machine learning')
    extracted_skill_names = list(matched_skills.keys())

    total_categories = len(SKILL_DICTIONARY)
    confidence_score = round(len(extracted_skill_names) / max(total_categories, 1), 2)

    return {
        "success": True,
        "extracted_skills": extracted_skill_names,
        "skill_details": matched_skills,
        "confidence_score": confidence_score,
        "text_length": len(raw_text),
    }


# ── Resume Parser (Structured Extraction) ─────────────────────────────

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")
PHONE_RE = re.compile(r"(?:\+?\d{1,3}[\s\-]?)?\(?\d{3,4}\)?[\s\-]?\d{3,4}[\s\-]?\d{4}")
LINKEDIN_RE = re.compile(r"(?:linkedin\.com/in/|linkedin\.com/pub/|linkedin:\s*)[a-zA-Z0-9\-_/]+", re.I)
GITHUB_RE = re.compile(r"(?:github\.com/)[a-zA-Z0-9\-_/]+", re.I)

# Common job-title words that should NOT be treated as a person's name
_JOB_TITLE_WORDS = re.compile(
    r"(?:engineer|developer|designer|analyst|manager|consultant|specialist|"
    r"architect|intern|lead|senior|junior|associate|director|officer|"
    r"resume|curriculum|vitae|cv|profile|portfolio|address|city|state|country)",
    re.I,
)

# Common section header keywords — used to skip those lines when detecting the name
_SECTION_WORDS = re.compile(
    r"^(?:education|experience|skills|projects|certifications|summary|objective|"
    r"professional|work|employment|academic|qualification|contact|references)$",
    re.I,
)

SECTION_HEADERS = {
    "summary": re.compile(
        r"^\s*(?:summary|professional\s+summary|career\s+summary|career\s+objective|"
        r"objective|about\s+me|profile|professional\s+profile|overview)\s*$",
        re.I | re.MULTILINE,
    ),
    "education": re.compile(
        r"^\s*(?:education|educational\s+background|academic|academic\s+background|"
        r"qualifications?|academic\s+qualifications?)\s*$",
        re.I | re.MULTILINE,
    ),
    "experience": re.compile(
        r"^\s*(?:experience|work\s+experience|professional\s+experience|employment|"
        r"work\s+history|professional\s+background|career\s+history|internship)\s*$",
        re.I | re.MULTILINE,
    ),
    "projects": re.compile(
        r"^\s*(?:projects?|personal\s+projects?|academic\s+projects?|"
        r"key\s+projects?|notable\s+projects?)\s*$",
        re.I | re.MULTILINE,
    ),
    "skills": re.compile(
        r"^\s*(?:skills?|technical\s+skills?|core\s+skills?|competenc(?:ies|e)|"
        r"technical\s+competenc(?:ies|e)|key\s+skills?|technologies)\s*$",
        re.I | re.MULTILINE,
    ),
    "certifications": re.compile(
        r"^\s*(?:certifications?|certificates?|licenses?|licences?|"
        r"professional\s+certifications?)\s*$",
        re.I | re.MULTILINE,
    ),
}


def _extract_name(raw_text: str, lines: List[str]) -> str:
    """Extract the candidate's name with high accuracy.

    Strategy (in priority order):
    1. spaCy PERSON NER on the first 2000 chars.
    2. First line heuristic: skip lines that look like job titles, section headers,
       email addresses, phone numbers, URLs, or are all-uppercase words > 2.
    """
    # 1. spaCy PERSON NER
    if SPACY_AVAILABLE:
        doc = nlp(raw_text[:3000])
        for ent in doc.ents:
            if ent.label_ == "PERSON" and len(ent.text.split()) >= 2:
                candidate = ent.text.strip()
                # Reject if it contains job-title words
                if not _JOB_TITLE_WORDS.search(candidate):
                    return candidate

    # 2. Heuristic: scan first 10 non-empty lines
    url_re = re.compile(r"https?://|www\.", re.I)
    digit_heavy = re.compile(r"\d{3}")
    for line in lines[:10]:
        line = line.strip()
        if not line:
            continue
        if len(line) > 60 or len(line) < 2:
            continue
        if EMAIL_RE.search(line):
            continue
        if PHONE_RE.search(line) or digit_heavy.search(line):
            continue
        if url_re.search(line):
            continue
        if _JOB_TITLE_WORDS.search(line):
            continue
        if _SECTION_WORDS.match(line):
            continue
        # Reject lines that are all-uppercase with >2 words (likely a header)
        words = line.split()
        if len(words) > 2 and all(w.isupper() for w in words if w.isalpha()):
            continue
        # Reject lines that look like addresses (contain digits and common address words)
        if re.search(r"\d", line) and re.search(r"(?:road|street|ave|avenue|lane|nagar|colony|near|block)", line, re.I):
            continue
        # Accept the first line that passes all checks
        return line

    return ""


def _split_section_entries(text: str) -> List[str]:
    """Split a resume section (education / experience / projects) into individual entries.

    Splitting triggers:
    - Two or more consecutive blank lines
    - A line that starts a new entry: begins with a 4-digit year, a bullet/dash,
      or looks like a title line (Title-cased phrase ending before a dash/comma/year).
    """
    # Normalise carriage returns
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Patterns that signal the start of a new entry
    new_entry_re = re.compile(
        r"(?:"
        r"^\s*[•\-–—➢►\*]\s+"          # bullet point
        r"|^\s*\d{4}\s*[-–—]"           # year range like "2020 -"
        r"|^\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* "  # month
        r")",
        re.M | re.I,
    )

    # First, split on 2+ blank lines
    chunks = re.split(r"\n{2,}", text)

    entries: List[str] = []
    for chunk in chunks:
        chunk = chunk.strip()
        if not chunk or len(chunk) < 5:
            continue
        # Further split within a chunk if new-entry patterns appear mid-chunk
        sub_splits = new_entry_re.split(chunk)
        # Re-attach the delimiters
        sub_entries = []
        parts = new_entry_re.findall(chunk)
        raw_parts = new_entry_re.split(chunk)
        rebuilt = [raw_parts[0]]
        for delim, part in zip(parts, raw_parts[1:]):
            rebuilt.append(delim + part)
        for part in rebuilt:
            part = part.strip()
            if part and len(part) > 5:
                sub_entries.append(part)
        if sub_entries:
            entries.extend(sub_entries)
        else:
            entries.append(chunk)

    return entries


def _extract_structured_data(raw_text: str) -> dict:
    """Parse raw resume text into structured JSON using regex + spaCy NER."""
    lines = [l.strip() for l in raw_text.splitlines() if l.strip()]

    # ── Contact info ─────────────────────────────────────────────────
    email_match = EMAIL_RE.search(raw_text)
    email = email_match.group(0).strip() if email_match else ""

    phone_match = PHONE_RE.search(raw_text)
    phone = phone_match.group(0).strip() if phone_match else ""

    linkedin_match = LINKEDIN_RE.search(raw_text)
    linkedin = linkedin_match.group(0).strip() if linkedin_match else ""

    github_match = GITHUB_RE.search(raw_text)
    github = github_match.group(0).strip() if github_match else ""

    # ── Name extraction ───────────────────────────────────────────────
    name = _extract_name(raw_text, lines)

    # ── Section splitting ────────────────────────────────────────────
    # Find the start position of each recognised section header
    section_positions: List[tuple] = []  # (start_char, section_name)
    for sec_name, pattern in SECTION_HEADERS.items():
        match = pattern.search(raw_text)
        if match:
            section_positions.append((match.start(), match.end(), sec_name))
    section_positions.sort(key=lambda x: x[0])

    sections: Dict[str, str] = {}
    for i, (start, end, sec_name) in enumerate(section_positions):
        # Content begins right after the header line match
        content_start = end
        content_end = section_positions[i + 1][0] if i + 1 < len(section_positions) else len(raw_text)
        sections[sec_name] = raw_text[content_start:content_end].strip()

    # ── Summary ───────────────────────────────────────────────────────
    summary = ""
    if "summary" in sections:
        # Take up to first 5 non-empty lines of the summary section
        summary_lines = [l.strip() for l in sections["summary"].splitlines() if l.strip()]
        summary = " ".join(summary_lines[:5])

    # ── Education, Experience, Projects ──────────────────────────────
    education = _split_section_entries(sections.get("education", ""))
    experience = _split_section_entries(sections.get("experience", ""))
    projects = _split_section_entries(sections.get("projects", ""))

    # ── Certifications ────────────────────────────────────────────────
    certs_text = sections.get("certifications", "")
    certifications = [
        c.strip().lstrip("•\-–—*► ")
        for c in re.split(r"[\n,;]", certs_text)
        if c.strip() and len(c.strip()) > 3
    ]

    # ── Skills ────────────────────────────────────────────────────────
    skills_section_text = sections.get("skills", "")

    # Parse skills from the dedicated skills section
    raw_skill_tokens = re.split(r"[,•|;\n/]", skills_section_text)
    skills_from_section: List[str] = []
    seen_lower: set = set()
    for tok in raw_skill_tokens:
        tok = tok.strip().strip("•\-–—*► ()[]")
        # Filter: must be between 2 and 50 chars, not pure digits, not a section header
        if 2 <= len(tok) <= 50 and not tok.isdigit() and not _SECTION_WORDS.match(tok):
            tok_lower = tok.lower()
            if tok_lower not in seen_lower:
                seen_lower.add(tok_lower)
                skills_from_section.append(tok)

    # Also pull skills detected across the entire document via skill dictionary
    dict_skills = list(_extract_skills(raw_text).keys())

    # Merge: section skills first (they have user-facing display names), then dict categories
    for ds in dict_skills:
        if ds.lower() not in seen_lower:
            seen_lower.add(ds.lower())
            skills_from_section.append(ds)

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "summary": summary,
        "skills": skills_from_section,
        "education": education,
        "experience": experience,
        "projects": projects,
        "certifications": certifications,
    }


@app.post("/extract-resume")
async def extract_resume(file: UploadFile = File(...)):
    """Extract structured data from a PDF resume."""
    ct = (file.content_type or "").lower()
    if "pdf" not in ct and ct not in ("application/octet-stream", ""):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must not exceed 5 MB.")

    try:
        raw_text = _extract_text_from_pdf(contents)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Failed to extract text: {exc}")

    if not raw_text or len(raw_text.strip()) < 20:
        raise HTTPException(status_code=422, detail="Could not extract meaningful text.")

    structured = _extract_structured_data(raw_text)
    return {"success": True, "data": structured}


# ── PDF Generation ────────────────────────────────────────────────────

from fastapi.responses import StreamingResponse  # noqa: E402


def _generate_pdf_bytes(resume_data: dict, template: str = "modern") -> bytes:
    """Generate a professional PDF resume from structured data using reportlab."""
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    from reportlab.lib.colors import HexColor
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4,
                            leftMargin=18*mm, rightMargin=18*mm,
                            topMargin=15*mm, bottomMargin=15*mm)
    styles = getSampleStyleSheet()

    # Template colour schemes
    schemes = {
        "modern":  {"accent": "#7c3aed", "heading": "#1f2937", "body": "#374151"},
        "classic": {"accent": "#1e3a5f", "heading": "#111827", "body": "#1f2937"},
        "minimal": {"accent": "#6b7280", "heading": "#111827", "body": "#374151"},
    }
    cs = schemes.get(template, schemes["modern"])

    name_style = ParagraphStyle("Name", parent=styles["Title"],
                                fontSize=22, textColor=HexColor(cs["accent"]),
                                spaceAfter=2*mm)
    contact_style = ParagraphStyle("Contact", parent=styles["Normal"],
                                   fontSize=9, textColor=HexColor(cs["body"]),
                                   spaceAfter=4*mm)
    section_style = ParagraphStyle("Section", parent=styles["Heading2"],
                                   fontSize=13, textColor=HexColor(cs["accent"]),
                                   spaceBefore=5*mm, spaceAfter=2*mm,
                                   borderWidth=0)
    body_style = ParagraphStyle("Body", parent=styles["Normal"],
                                fontSize=10, textColor=HexColor(cs["body"]),
                                leading=14, spaceAfter=2*mm)
    bullet_style = ParagraphStyle("Bullet", parent=body_style,
                                  bulletIndent=5*mm, leftIndent=10*mm)

    story = []
    pi = resume_data.get("personalInfo") or resume_data.get("personal_info") or {}
    name = pi.get("name", resume_data.get("name", ""))
    email = pi.get("email", resume_data.get("email", ""))
    phone = pi.get("phone", resume_data.get("phone", ""))
    linkedin = pi.get("linkedin", resume_data.get("linkedin", ""))
    summary = pi.get("summary", resume_data.get("summary", ""))

    # Name
    if name:
        story.append(Paragraph(name, name_style))

    # Contact line
    contact_parts = [p for p in [email, phone, linkedin] if p]
    if contact_parts:
        story.append(Paragraph(" &nbsp;|&nbsp; ".join(contact_parts), contact_style))

    # Divider
    story.append(HRFlowable(width="100%", thickness=0.5, color=HexColor(cs["accent"])))

    # Summary
    if summary:
        story.append(Paragraph("PROFESSIONAL SUMMARY", section_style))
        story.append(Paragraph(summary, body_style))

    # Skills
    skills = resume_data.get("skills", [])
    if skills:
        story.append(Paragraph("SKILLS", section_style))
        if isinstance(skills[0], str):
            story.append(Paragraph(" &bull; ".join(skills), body_style))
        else:
            story.append(Paragraph(" &bull; ".join([s.get("name", str(s)) for s in skills]), body_style))

    # Experience
    experience = resume_data.get("experience", [])
    if experience:
        story.append(Paragraph("EXPERIENCE", section_style))
        for entry in experience:
            if isinstance(entry, dict):
                title = entry.get("title") or entry.get("role", "")
                company = entry.get("company", "")
                duration = entry.get("duration", "")
                desc = entry.get("description", "")
                header = f"<b>{title}</b>"
                if company:
                    header += f" — {company}"
                if duration:
                    header += f" <i>({duration})</i>"
                story.append(Paragraph(header, body_style))
                if desc:
                    story.append(Paragraph(desc, bullet_style))
            else:
                story.append(Paragraph(str(entry), body_style))

    # Education
    education = resume_data.get("education", [])
    if education:
        story.append(Paragraph("EDUCATION", section_style))
        for entry in education:
            if isinstance(entry, dict):
                deg = entry.get("degree") or entry.get("title", "")
                inst = entry.get("institution") or entry.get("school", "")
                yr = entry.get("year") or entry.get("duration", "")
                line = f"<b>{deg}</b>"
                if inst:
                    line += f" — {inst}"
                if yr:
                    line += f" <i>({yr})</i>"
                story.append(Paragraph(line, body_style))
            else:
                story.append(Paragraph(str(entry), body_style))

    # Projects
    projects = resume_data.get("projects", [])
    if projects:
        story.append(Paragraph("PROJECTS", section_style))
        for entry in projects:
            if isinstance(entry, dict):
                pname = entry.get("name") or entry.get("title", "")
                desc = entry.get("description", "")
                line = f"<b>{pname}</b>"
                if desc:
                    line += f" — {desc}"
                story.append(Paragraph(line, body_style))
            else:
                story.append(Paragraph(str(entry), body_style))

    # Certifications
    certs = resume_data.get("certifications", [])
    if certs:
        story.append(Paragraph("CERTIFICATIONS", section_style))
        for c in certs:
            story.append(Paragraph(f"&bull; {c}" if isinstance(c, str) else f"&bull; {c.get('name', str(c))}", body_style))

    doc.build(story)
    return buf.getvalue()


class ResumeInput(BaseModel):
    resumeData: dict
    template: str = "modern"


@app.post("/generate-pdf")
async def generate_pdf(payload: ResumeInput):
    """Generate a PDF from structured resume JSON."""
    try:
        pdf_bytes = _generate_pdf_bytes(payload.resumeData, payload.template)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {exc}")

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=resume.pdf"},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
