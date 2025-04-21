import os
import re
import PyPDF2
from transformers import pipeline
import torch

# Define the directory for saving models
MODEL_DIR = '/home/ubuntu/care-home-saas/care-home-saas/src/lib/ml-models'
os.makedirs(MODEL_DIR, exist_ok=True)

class PDFSummarizer:
    def __init__(self):
        # Check if CUDA is available
        self.device = 0 if torch.cuda.is_available() else -1
        
        # Initialize the summarization pipeline
        self.summarizer = pipeline(
            "summarization", 
            model="facebook/bart-large-cnn",
            device=self.device
        )
    
    def extract_text_from_pdf(self, pdf_path):
        """Extract text content from a PDF file."""
        try:
            text = ""
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    text += page.extract_text() + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
    
    def preprocess_text(self, text):
        """Clean and preprocess the extracted text."""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove page numbers
        text = re.sub(r'\b\d+\b\s*$', '', text, flags=re.MULTILINE)
        
        # Remove headers/footers (simplified approach)
        lines = text.split('\n')
        filtered_lines = []
        for line in lines:
            # Skip very short lines that might be headers/footers
            if len(line.strip()) > 10:
                filtered_lines.append(line)
        
        return ' '.join(filtered_lines)
    
    def chunk_text(self, text, max_chunk_size=1000):
        """Split text into chunks for processing."""
        words = text.split()
        chunks = []
        current_chunk = []
        
        for word in words:
            current_chunk.append(word)
            if len(current_chunk) >= max_chunk_size:
                chunks.append(' '.join(current_chunk))
                current_chunk = []
        
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        
        return chunks
    
    def summarize_text(self, text, max_length=150, min_length=50):
        """Generate a summary of the given text."""
        # For very short texts, return as is
        if len(text.split()) < min_length:
            return text
        
        # For longer texts, chunk and summarize each part
        chunks = self.chunk_text(text)
        summaries = []
        
        for chunk in chunks:
            # Skip very short chunks
            if len(chunk.split()) < 30:
                continue
                
            # Generate summary for this chunk
            summary = self.summarizer(
                chunk,
                max_length=max_length,
                min_length=min_length,
                do_sample=False
            )
            
            if summary and len(summary) > 0:
                summaries.append(summary[0]['summary_text'])
        
        # Combine chunk summaries
        combined_summary = ' '.join(summaries)
        
        # If the combined summary is still too long, summarize again
        if len(combined_summary.split()) > max_length * 2:
            final_summary = self.summarizer(
                combined_summary,
                max_length=max_length * 2,
                min_length=max_length,
                do_sample=False
            )
            return final_summary[0]['summary_text']
        
        return combined_summary
    
    def extract_key_points(self, summary, max_points=5):
        """Extract key points from the summary."""
        sentences = re.split(r'(?<=[.!?])\s+', summary)
        
        # Filter out very short sentences
        sentences = [s for s in sentences if len(s.split()) > 5]
        
        # Limit to max_points
        key_points = sentences[:max_points]
        
        # Format as numbered list
        formatted_points = []
        for i, point in enumerate(key_points, 1):
            formatted_points.append(f"{i}) {point}")
        
        return formatted_points
    
    def summarize_pdf(self, pdf_path):
        """Main function to summarize a PDF document."""
        try:
            # Extract text from PDF
            text = self.extract_text_from_pdf(pdf_path)
            
            # Preprocess the text
            processed_text = self.preprocess_text(text)
            
            # Generate summary
            summary = self.summarize_text(processed_text)
            
            # Extract key points
            key_points = self.extract_key_points(summary)
            
            return {
                "success": True,
                "summary": summary,
                "key_points": key_points,
                "original_length": len(processed_text.split()),
                "summary_length": len(summary.split())
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

# Function to initialize and return the summarizer
def get_pdf_summarizer():
    return PDFSummarizer()

if __name__ == "__main__":
    # Example usage
    summarizer = PDFSummarizer()
    print("PDF Summarizer initialized and ready for use.")
