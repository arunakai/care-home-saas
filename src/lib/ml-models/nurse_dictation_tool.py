import os
import speech_recognition as sr
from transformers import pipeline
import torch
import json
import datetime

# Define the directory for saving models and transcriptions
MODEL_DIR = '/home/ubuntu/care-home-saas/care-home-saas/src/lib/ml-models'
TRANSCRIPTION_DIR = '/home/ubuntu/care-home-saas/care-home-saas/src/lib/transcriptions'
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(TRANSCRIPTION_DIR, exist_ok=True)

class NurseDictationTool:
    def __init__(self):
        # Check if CUDA is available
        self.device = 0 if torch.cuda.is_available() else -1
        
        # Initialize the speech recognizer
        self.recognizer = sr.Recognizer()
        
        # Initialize the text generation pipeline for clinical note formatting
        self.clinical_formatter = pipeline(
            "text2text-generation",
            model="t5-base",  # Using T5 as a base model
            device=self.device
        )
    
    def transcribe_audio(self, audio_path):
        """Transcribe speech from an audio file to text."""
        try:
            with sr.AudioFile(audio_path) as source:
                audio_data = self.recognizer.record(source)
                text = self.recognizer.recognize_google(audio_data)
                return text
        except Exception as e:
            raise Exception(f"Error transcribing audio: {str(e)}")
    
    def format_clinical_note(self, transcription, note_type="progress"):
        """Format the transcription into a structured clinical note."""
        # Define prompts based on note type
        prompts = {
            "progress": "Format this into a clinical progress note with sections for subjective, objective, assessment, and plan: ",
            "assessment": "Format this into a clinical assessment note with sections for findings, interpretation, and recommendations: ",
            "incident": "Format this into an incident report with sections for description, actions taken, and follow-up needed: ",
            "medication": "Format this into a medication administration note with sections for medications given, dosages, routes, and patient response: ",
            "other": "Format this into a structured clinical note with appropriate sections: "
        }
        
        prompt = prompts.get(note_type, prompts["other"])
        
        # Generate formatted note
        formatted_note = self.clinical_formatter(
            prompt + transcription,
            max_length=512,
            min_length=100,
            do_sample=False
        )
        
        return formatted_note[0]['generated_text'] if formatted_note else transcription
    
    def save_transcription(self, resident_id, user_id, audio_path, transcription, formatted_note, note_type):
        """Save the transcription and formatted note to a file."""
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"dictation_{resident_id}_{timestamp}.json"
        filepath = os.path.join(TRANSCRIPTION_DIR, filename)
        
        data = {
            "resident_id": resident_id,
            "user_id": user_id,
            "timestamp": datetime.datetime.now().isoformat(),
            "audio_path": audio_path,
            "note_type": note_type,
            "raw_transcription": transcription,
            "formatted_note": formatted_note
        }
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        return filepath
    
    def process_dictation(self, audio_path, resident_id, user_id, note_type="progress"):
        """Process a dictation audio file and return formatted clinical note."""
        try:
            # Transcribe audio to text
            transcription = self.transcribe_audio(audio_path)
            
            # Format into clinical note
            formatted_note = self.format_clinical_note(transcription, note_type)
            
            # Save transcription and note
            saved_path = self.save_transcription(
                resident_id, 
                user_id, 
                audio_path, 
                transcription, 
                formatted_note, 
                note_type
            )
            
            return {
                "success": True,
                "transcription": transcription,
                "formatted_note": formatted_note,
                "saved_path": saved_path
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

# Function to initialize and return the dictation tool
def get_nurse_dictation_tool():
    return NurseDictationTool()

if __name__ == "__main__":
    # Example usage
    dictation_tool = NurseDictationTool()
    print("Nurse Dictation Tool initialized and ready for use.")
