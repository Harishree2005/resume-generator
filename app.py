import streamlit as st
import google.generativeai as genai

genai.configure(api_key="GEMINI_API_KEY")

MODEL_NAME = "models/gemini-1.5-flash-latest"

def generate_cover_letter(profile, job_description, temperature, max_tokens):
    prompt = f"""
    Write a professional and personalized cover letter for the following job.

    Job Description:
    {job_description}

    Candidate Profile:
    {profile}

    Structure the letter with a strong opening, body highlighting relevant experience, and a professional closing.
    """
    model = genai.GenerativeModel(model_name=MODEL_NAME)

    response = model.generate_content(prompt, generation_config={
        "temperature": temperature,
        "max_output_tokens": max_tokens
    })

    return response.text

def main():
    st.set_page_config(page_title="Gemini 2.5 Flash Cover Letter Generator", page_icon="📝", layout="wide")
    st.title("📝 Cover Letter Generator (Gemini 2.5 Flash-Lite Preview)")

    profile = st.text_area("🧑 Your Profile", placeholder="Enter your education, experience, and skills")
    job_description = st.text_area("💼 Job Description", placeholder="Paste the job role or ad here")

    temperature = st.slider("🎛️ Temperature (Creativity)", 0.0, 1.0, 0.7)
    max_tokens = st.slider("🔢 Max Output Tokens", 50, 1000, 500)

    if st.button("🚀 Generate Cover Letter"):
        if profile and job_description:
            with st.spinner("Generating your cover letter..."):
                try:
                    result = generate_cover_letter(profile, job_description, temperature, max_tokens)
                    st.success("✅ Cover Letter Generated!")
                    st.text_area("📄 Your Cover Letter", value=result, height=400)
                    st.download_button("📥 Download as .txt", result, file_name="cover_letter.txt")
                except Exception as e:
                    st.error(f"❌ Error: {e}")
        else:
            st.warning("⚠️ Please provide both profile and job description.")

if __name__ == "__main__":
    main()
