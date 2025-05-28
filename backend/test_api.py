import requests
import json

def test_grammar_api():
    print("Testing grammar API...")
    
    try:
        response = requests.post(
            "http://localhost:8000/check",
            headers={"Content-Type": "application/json"},
            data=json.dumps({"text": "This is a test sentence with errors."})
        )
        
        if response.status_code == 200:
            print("API is working! Response:")
            print(json.dumps(response.json(), indent=2))
            return True
        else:
            print(f"API error: Status code {response.status_code}")
            print(response.text)
            return False
    
    except Exception as e:
        print(f"Error connecting to API: {e}")
        return False

if __name__ == "__main__":
    test_grammar_api() 