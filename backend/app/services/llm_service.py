import os
import google.generativeai as genai
import requests
from typing import Optional, List
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")


class LLMService:
    """Service for interacting with Gemini LLM"""
    
    def __init__(self):
        if GEMINI_API_KEY:
            genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-pro")
    
    def generate_response(self, prompt: str, context: Optional[str] = None, temperature: float = 0.7) -> str:
        """Generate response from Gemini"""
        try:
            full_prompt = prompt
            if context:
                full_prompt = f"Context:\n{context}\n\nQuery:\n{prompt}"
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=temperature,
                    max_output_tokens=1000
                )
            )
            return response.text
        except Exception as e:
            print(f"Error generating response: {e}")
            return f"Error: Unable to generate response - {str(e)}"


class WebSearchService:
    """Service for web search using SerpAPI"""
    
    @staticmethod
    def search(query: str, num_results: int = 5) -> List[dict]:
        """Search the web using SerpAPI"""
        if not SERPAPI_API_KEY:
            return []
        
        try:
            url = "https://serpapi.com/search"
            params = {
                "q": query,
                "api_key": SERPAPI_API_KEY,
                "num": num_results
            }
            response = requests.get(url, params=params)
            response.raise_for_status()
            
            results = response.json().get("organic_results", [])
            return [
                {
                    "title": r.get("title"),
                    "link": r.get("link"),
                    "snippet": r.get("snippet")
                }
                for r in results
            ]
        except Exception as e:
            print(f"Error searching web: {e}")
            return []


llm_service = LLMService()
web_search_service = WebSearchService()
