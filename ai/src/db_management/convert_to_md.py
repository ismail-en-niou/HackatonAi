import os

def save_docs_as_md(docs, output_directory):
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    for i, doc in enumerate(docs):
        md_content = doc.export_to_markdown()
        with open(os.path.join(output_directory, f'{doc.origin.filename.split(".")[0]}.md'), 'w', encoding='utf-8') as f:
            f.write(md_content)
    print(f"Saved {len(docs)} documents to {output_directory}")
    