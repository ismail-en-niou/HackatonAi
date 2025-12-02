from docling.chunking import HybridChunker
from langchain_core.documents import Document
from docling_core.transforms.chunker.hierarchical_chunker import (
    ChunkingDocSerializer,
    ChunkingSerializerProvider,
)
from docling_core.transforms.serializer.markdown import MarkdownTableSerializer

def is_table_chunk(chunk) -> bool:
    """Detect if the chunk contains a table (Markdown-style)."""
    # Here we just check for a '|' symbol in the first line
    lines = chunk.text.splitlines()
    return len(lines) > 0 and '|' in lines[0]

def extract_table_header(chunk_text: str) -> str:
    """
    Extracts the header lines from a Markdown table.
    Assumes first line = header, second line = separator (---|---)
    """
    lines = chunk_text.splitlines()
    if len(lines) >= 2 and '-|-' in lines[1]:
        return "\n".join(lines[:2])
    return ""

def add_header_to_chunks(chunk_iter):
    """
    Takes an iterator of Docling chunks and ensures
    the table header is at the start of each chunk.
    """
    processed_chunks = []
    table_header = None

    for chunk in chunk_iter:
        text = chunk.text  # or str(chunk) depending on Docling version

        if is_table_chunk(chunk):
            if table_header is None:
                # First chunk of this table: extract header
                table_header = extract_table_header(text)
            else:
                # Subsequent chunks: prepend header
                text = f"{table_header}\n{text}"
        else:
            # Reset table header when leaving a table
            table_header = None
        chunk.text = text
        processed_chunks.append(chunk)

    return processed_chunks

class MDTableSerializerProvider(ChunkingSerializerProvider):
    def get_serializer(self, doc):
        return ChunkingDocSerializer(
            doc=doc,
            table_serializer=MarkdownTableSerializer(),  # configuring a different table serializer
        )

chunker = HybridChunker(
    serializer_provider=MDTableSerializerProvider(),
)

def split_documents(docs):
    chunks = []
    for doc in docs:
        chunk_iter = chunker.chunk(dl_doc=doc)
        chunk_iter = add_header_to_chunks(chunk_iter)
        for i, chunk in enumerate(chunk_iter):
            enriched = chunker.contextualize(chunk=chunk)
            chunks.append(Document(page_content=enriched, metadata={"source": doc.origin.filename}))
            # print(f"=== {i} ===")
            # print(f"src: {doc.origin.filename}\nchunk.enriched:\n{enriched}")
            # print()
    return chunks