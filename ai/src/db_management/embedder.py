from sentence_transformers import SentenceTransformer
from langchain_core.embeddings import Embeddings

class NomicLocalEmbeddings(Embeddings):
    # def __init__(self, model_id="nomic-ai/nomic-embed-text-v1.5", cache_dir="./models/nomic"):
    #     self.model = SentenceTransformer(model_id, cache_folder=cache_dir, trust_remote_code=True)

    def __init__(self, model_id="BAAI/bge-small-en-v1.5", cache_dir="./models/bge-small-en"):
        self.model = SentenceTransformer(model_id, cache_folder=cache_dir, trust_remote_code=True)

    def embed_documents(self, texts):
        return self.model.encode(
            texts,
            batch_size=32,
            normalize_embeddings=True
        ).tolist()

    def embed_query(self, text):
        return self.model.encode(
            [text],
            normalize_embeddings=True
        )[0].tolist()
