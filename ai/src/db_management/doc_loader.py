import os
from docling.document_converter import DocumentConverter

def load_documents_from_directory(directory):
    docs = []
    converter = DocumentConverter()

    for file in os.listdir(directory):
        try:
            doc = converter.convert(os.path.join(directory, file)).document
            # print(doc.export_to_markdown())
            docs.append(doc)
        except Exception as e:
            print(f"Error processing {file}: {e}")
            continue

    return docs