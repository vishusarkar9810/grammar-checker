import requests
import json
import time

def test_grammar_correction():
    """Test the enhanced grammar correction model with various test cases."""
    test_cases = [
        # Basic grammar errors
        {
            "input": "She don't like ice cream.",
            "expected_output_contains": "She doesn't like ice cream."
        },
        {
            "input": "They was going to the store yesterday.",
            "expected_output_contains": "They were going to the store yesterday."
        },
        {
            "input": "I have went to the beach many times.",
            "expected_output_contains": "I have gone to the beach many times."
        },
        {
            "input": "The childrens are playing in the park.",
            "expected_output_contains": "The children are playing in the park."
        },
        
        # Complex sentences with multiple errors
        {
            "input": "He speak english very good and have many friend.",
            "expected_output_contains": "He speaks English very well and has many friends."
        },
        
        # Sentences that previously caused issues (content deletion)
        {
            "input": "This is a long sentence that needs to be preserved and not deleted by the grammar checker while still fixing any grammar issues that might be present in it.",
            "expected_output_contains": "preserved"  # Check that content isn't deleted
        },
        
        # Capitalization and punctuation
        {
            "input": "i think therefore i am",
            "expected_output_contains": "I think therefore I am"
        },
        
        # Multiple sentences
        {
            "input": "She have three cats. They is very cute. i like them.",
            "expected_output_contains": "She has three cats. They are very cute. I like them."
        }
    ]
    
    print("Testing enhanced grammar correction model...\n")
    all_passed = True
    
    for i, test_case in enumerate(test_cases):
        input_text = test_case["input"]
        expected_contains = test_case["expected_output_contains"]
        
        print(f"Test case {i+1}:")
        print(f"Input: \"{input_text}\"")
        
        try:
            start_time = time.time()
            response = requests.post(
                "http://localhost:8000/check",
                headers={"Content-Type": "application/json"},
                data=json.dumps({"text": input_text})
            )
            elapsed = time.time() - start_time
            
            if response.status_code == 200:
                corrected_text = response.json()["corrected_text"]
                print(f"Output: \"{corrected_text}\"")
                print(f"Time: {elapsed:.2f}s")
                
                if expected_contains.lower() in corrected_text.lower():
                    print("✅ PASSED: Output contains expected text")
                else:
                    print("❌ FAILED: Output does not contain expected text")
                    all_passed = False
                
                # Check that content isn't being deleted
                if len(corrected_text) < len(input_text) * 0.7:
                    print("⚠️ WARNING: Output is significantly shorter than input")
            else:
                print(f"❌ ERROR: Status code {response.status_code}")
                print(response.text)
                all_passed = False
        except Exception as e:
            print(f"❌ ERROR: {e}")
            all_passed = False
        
        print("-" * 40)
    
    if all_passed:
        print("\n✅ All tests passed!")
    else:
        print("\n❌ Some tests failed.")

if __name__ == "__main__":
    test_grammar_correction() 