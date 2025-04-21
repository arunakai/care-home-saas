import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

# Define the directory for saving models
MODEL_DIR = '/home/ubuntu/care-home-saas/care-home-saas/src/lib/ml-models'
os.makedirs(MODEL_DIR, exist_ok=True)

class LLMSupportAgent:
    def __init__(self):
        # Check if CUDA is available
        self.device = 0 if torch.cuda.is_available() else -1
        
        # Initialize the text generation pipeline
        self.generator = pipeline(
            "text-generation",
            model="gpt2-medium",  # Using GPT-2 medium as a base model
            device=self.device
        )
        
        # Load specialized prompts for different scenarios
        self.prompts = {
            "ethical_dilemma": (
                "As an AI ethics consultant for long-term care, I'll help analyze this ethical dilemma. "
                "Let's consider multiple perspectives and relevant ethical principles:\n\n"
            ),
            "policy_interpretation": (
                "As a policy expert in long-term care, I'll help interpret this policy. "
                "Here's a clear explanation of what this means in practice:\n\n"
            ),
            "critical_incident": (
                "As a critical incident management advisor, I'll help with this situation. "
                "Here are the recommended steps to take:\n\n"
            ),
            "on_call_support": (
                "As an on-call support advisor, I'll help you determine if this situation requires "
                "contacting the on-call manager. Here's my assessment and recommendation:\n\n"
            )
        }
    
    def generate_response(self, query, scenario_type, max_length=500):
        """Generate a response for the given query and scenario type."""
        # Get the appropriate prompt for the scenario
        prompt = self.prompts.get(scenario_type, "")
        
        # Combine prompt and query
        full_prompt = prompt + query
        
        # Generate response
        response = self.generator(
            full_prompt,
            max_length=max_length,
            num_return_sequences=1,
            temperature=0.7,
            top_p=0.9,
            do_sample=True
        )
        
        # Extract and clean the generated text
        generated_text = response[0]['generated_text']
        
        # Remove the prompt from the response
        if generated_text.startswith(full_prompt):
            generated_text = generated_text[len(full_prompt):].strip()
        
        return generated_text
    
    def handle_ethical_dilemma(self, query):
        """Handle an ethical dilemma query."""
        response = self.generate_response(query, "ethical_dilemma")
        
        # Add structured ethical analysis
        principles = [
            "Autonomy: Respect for the resident's right to make their own decisions.",
            "Beneficence: Acting in the best interest of the resident.",
            "Non-maleficence: Avoiding harm to the resident.",
            "Justice: Fair and equitable treatment of all residents.",
            "Dignity: Respecting the inherent worth of each resident."
        ]
        
        structured_response = "Ethical Analysis:\n\n"
        structured_response += response + "\n\n"
        structured_response += "Key Ethical Principles to Consider:\n"
        for principle in principles:
            structured_response += f"• {principle}\n"
        
        structured_response += "\nRecommended Approach:\n"
        structured_response += "1. Consult with the interdisciplinary team\n"
        structured_response += "2. Document all discussions and decisions\n"
        structured_response += "3. Involve the resident and/or family when appropriate\n"
        structured_response += "4. Follow up to ensure the resolution aligns with ethical standards"
        
        return structured_response
    
    def handle_policy_interpretation(self, query):
        """Handle a policy interpretation query."""
        response = self.generate_response(query, "policy_interpretation")
        
        structured_response = "Policy Interpretation:\n\n"
        structured_response += response + "\n\n"
        structured_response += "Practical Application:\n"
        structured_response += "• Document your actions according to this policy\n"
        structured_response += "• Ensure all team members understand their responsibilities\n"
        structured_response += "• When in doubt, consult with your supervisor\n"
        
        return structured_response
    
    def handle_critical_incident(self, query):
        """Handle a critical incident query."""
        response = self.generate_response(query, "critical_incident")
        
        structured_response = "Critical Incident Response:\n\n"
        structured_response += response + "\n\n"
        structured_response += "Immediate Actions:\n"
        structured_response += "1. Ensure resident safety first\n"
        structured_response += "2. Notify appropriate personnel\n"
        structured_response += "3. Document the incident thoroughly\n"
        structured_response += "4. Preserve any evidence or relevant information\n\n"
        structured_response += "Follow-up Actions:\n"
        structured_response += "1. Conduct a debrief with the team\n"
        structured_response += "2. Identify preventive measures for the future\n"
        structured_response += "3. Update care plans if necessary\n"
        structured_response += "4. Provide support for affected residents and staff"
        
        return structured_response
    
    def handle_on_call_support(self, query):
        """Handle an on-call support query."""
        response = self.generate_response(query, "on_call_support")
        
        structured_response = "On-Call Assessment:\n\n"
        structured_response += response + "\n\n"
        structured_response += "Decision Framework:\n"
        structured_response += "• Immediate danger to resident(s): Contact on-call manager immediately\n"
        structured_response += "• Facility systems failure: Contact on-call manager immediately\n"
        structured_response += "• Staffing emergency: Contact on-call manager immediately\n"
        structured_response += "• Non-urgent clinical question: Follow standard protocols, document, and report during regular hours\n"
        structured_response += "• Administrative issue: Can wait until regular business hours unless affecting resident care\n"
        
        return structured_response
    
    def process_query(self, query, scenario_type):
        """Process a query based on the scenario type."""
        try:
            if scenario_type == "ethical_dilemma":
                response = self.handle_ethical_dilemma(query)
            elif scenario_type == "policy_interpretation":
                response = self.handle_policy_interpretation(query)
            elif scenario_type == "critical_incident":
                response = self.handle_critical_incident(query)
            elif scenario_type == "on_call_support":
                response = self.handle_on_call_support(query)
            else:
                response = self.generate_response(query, "")
            
            return {
                "success": True,
                "response": response,
                "scenario_type": scenario_type
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

# Function to initialize and return the LLM support agent
def get_llm_support_agent():
    return LLMSupportAgent()

if __name__ == "__main__":
    # Example usage
    agent = LLMSupportAgent()
    print("LLM Support Agent initialized and ready for use.")
