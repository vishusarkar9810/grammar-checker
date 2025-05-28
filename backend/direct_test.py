from grammar_model import correct_text

def test_direct_correction():
    """Test grammar correction directly without the API."""
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
    
    print("Testing direct grammar correction...\n")
    all_passed = True
    
    for i, test_case in enumerate(test_cases):
        input_text = test_case["input"]
        expected_contains = test_case["expected_output_contains"]
        
        print(f"Test case {i+1}:")
        print(f"Input: \"{input_text}\"")
        
        try:
            corrected_text = correct_text(input_text)
            print(f"Output: \"{corrected_text}\"")
            
            if expected_contains.lower() in corrected_text.lower():
                print("✅ PASSED: Output contains expected text")
            else:
                print("❌ FAILED: Output does not contain expected text")
                all_passed = False
            
            # Check that content isn't being deleted
            if len(corrected_text) < len(input_text) * 0.7:
                print("⚠️ WARNING: Output is significantly shorter than input")
        except Exception as e:
            print(f"❌ ERROR: {e}")
            all_passed = False
        
        print("-" * 40)
    
    if all_passed:
        print("\n✅ All tests passed!")
    else:
        print("\n❌ Some tests failed.")

if __name__ == "__main__":
    test_direct_correction() 