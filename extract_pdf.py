import sys
import pypdf

def extract_text(pdf_path):
    try:
        with open(pdf_path, 'rb') as file:
            reader = pypdf.PdfReader(file)
            text = ''
            for page in reader.pages:
                text += page.extract_text() + '\n'
        return text
    except Exception as e:
        return f"Error extracting text: {e}"

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python extract_pdf.py <pdf_path>")
        sys.exit(1)
    pdf_path = sys.argv[1]
    text = extract_text(pdf_path)
    print(text)