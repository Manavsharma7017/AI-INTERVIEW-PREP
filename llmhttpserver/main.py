from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import os

load_dotenv()
app = FastAPI()


class QA(BaseModel):
    number: int
    question: str
    answer: str


class UserSubmission(BaseModel):
    question: str
    answer: str
    responceId: str
    domain: str
    history: List[QA]


class UserSubmissionResponse(BaseModel):
    Question: str
    Answer: str
    Clarity: str
    Tone: str
    Relevance: str
    OverallScore: str
    Suggestio: str
    Nextquestion: str
    NextQuestionDifficulty: str
    Explanation: str

@app.get("/")
def root():
    return {"message": "FastAPI AI Interview Server is running."}

@app.post("/submit", response_model=UserSubmissionResponse)
def submit_user_submission(data: UserSubmission):
    try:
        history_block = ""
        for item in data.history:
            history_block += f"Q{item.number}: {item.question}\nA{item.number}: {item.answer}\n"

        prompt_template = ChatPromptTemplate.from_messages([
            ("human", """
You are a smart and professional **AI Interviewer** conducting a technical interview in the domain of **{domain}**.

Your job is to:
1. Evaluate the candidate's answer on a scale of 1 to 10.
2. Give constructive feedback.
3. Continue the interview with a follow-up question.

---

🧠 Previous Interview History:
{history_block}

---

📌 Current Question:
Q: {question}
A: {answer}

---

🎯 Return the following as JSON:

{{
  "Question": "{question}",
  "Answer": "{answer}",
  "Clarity": "1-10",
  "Tone": "1-10",
  "Relevance": "1-10",
  "OverallScore": "1-10",
  "Suggestion": "Improvement tip",
  "Nextquestion": "Follow-up question",
  "NextQuestionDifficulty": "EASY | MEDIUM | HARD",
  "Explanation": "Short explanation of *why the next question was chosen*"
}}

Only return JSON. No commentary.
""")
        ])

        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0,
            google_api_key=os.getenv("GEMINI_API_KEY")
        )

        parser = JsonOutputParser()
        chain = prompt_template | llm | parser

        chain_input = {
            "domain": data.domain,
            "history_block": history_block,
            "question": data.question,
            "answer": data.answer
        }

        response_json = chain.invoke(chain_input)

        return UserSubmissionResponse(
            Question=response_json.get("Question", ""),
            Answer=response_json.get("Answer", ""),
            Clarity=str(response_json.get("Clarity", "")),
            Tone=str(response_json.get("Tone", "")),
            Relevance=str(response_json.get("Relevance", "")),
            OverallScore=str(response_json.get("OverallScore", "")),
            Suggestio=response_json.get("Suggestion", ""),
            Nextquestion=response_json.get("Nextquestion", ""),
            NextQuestionDifficulty=response_json.get("NextQuestionDifficulty", ""),
            Explanation=response_json.get("Explanation", "")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")
