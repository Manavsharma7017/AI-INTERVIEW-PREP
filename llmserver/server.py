import grpc
from concurrent import futures
import time
import json
import os
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from dotenv import load_dotenv

# LangChain + Gemini (v1)
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# gRPC generated code
import a_pb2
import a_pb2_grpc

# Load environment variables
load_dotenv()
PORT = os.getenv("PORT", "50051")

# Dummy HTTP server for Render/Railway detection
def start_http_server():
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"gRPC server is running.")

    server = HTTPServer(('', 80), Handler)
    print("🌐 Dummy HTTP server running on port 80...")
    server.serve_forever()


class UserSubmissionServiceServicer(a_pb2_grpc.UserSubmittionServiceServicer):
    def SubmitUserSubmittion(self, request, context):
        print("\n🟢 Received User Submission from client:")
        print(f"  📌 Question: {request.Question}")
        print(f"  📌 Answer: {request.Answer}")
        print(f"  📌 Domain: {request.Domain}")
        print(f"  📌 ResponseID: {request.ResponceId}")
        print(f"  🕘 History ({len(request.History)} items):")

        history_block = ""
        for item in request.History:
            print(f"    ➤ Q{item.number}: {item.question}")
            print(f"      ↳ Ans: {item.answer}")
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

        try:
            llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                temperature=0,
                google_api_key=os.getenv("GEMINI_API_KEY")
            )

            parser = JsonOutputParser()
            chain = prompt_template | llm | parser

            chain_input = {
                "domain": request.Domain,
                "history_block": history_block,
                "question": request.Question,
                "answer": request.Answer
            }

            response_json = chain.invoke(chain_input)

            print("\n🧠 Gemini Processed Output (via LangChain):\n", json.dumps(response_json, indent=2))

            return a_pb2.UserSubmittionResponse(
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
            print(f"❌ Error during Gemini processing: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Gemini API error: {str(e)}")
            return a_pb2.UserSubmittionResponse()


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    a_pb2_grpc.add_UserSubmittionServiceServicer_to_server(UserSubmissionServiceServicer(), server)
    server.add_insecure_port(f'0.0.0.0:{PORT}')
    server.start()
    print(f"🚀 gRPC Python server running on 0.0.0.0:{PORT}")
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        print("🛑 Server shutting down.")
        server.stop(0)


if __name__ == "__main__":
    # Start dummy HTTP server in background
    threading.Thread(target=start_http_server, daemon=True).start()
    serve()
