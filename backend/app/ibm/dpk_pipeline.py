import re
from pathlib import Path
from typing import TypedDict, Optional

class DocumentChunk(TypedDict):
    content: str
    title: str
    source: str
    topic: str
    year: Optional[str]
    doc_type: str
    chunk_index: int

class DPKPipeline:
    """
    Implements a Python pipeline reflecting the IBM Data Prep Kit steps:
    1. Extraction -> 2. Cleaning -> 3. Normalization -> 4. Chunking -> 5. Metadata Tagging
    """

    @staticmethod
    def extract_text(file_path: str) -> str:
        """
        1. EXTRACTION: Reads the text/markdown content from the local filesystem.
        """
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"Source file not found at: {file_path}")
        return path.read_text(encoding="utf-8")

    @staticmethod
    def clean_text(text: str) -> str:
        """
        2. CLEANING: Strips markup, filters out unwanted characters, and removes HTML tags.
        """
        # Strip HTML tags
        cleaned = re.sub(r"<[^>]+>", "", text)
        # Remove consecutive empty lines
        cleaned = re.sub(r"\n\s*\n", "\n\n", cleaned)
        return cleaned

    @staticmethod
    def normalize_text(text: str) -> str:
        """
        3. NORMALIZATION: Normalizes spacing, standardizes lowercase representations for indexing.
        """
        # Standardize whitespace (but keep newlines)
        normalized = re.sub(r"[ \t]+", " ", text)
        return normalized.strip()

    @staticmethod
    def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100) -> list[str]:
        """
        4. CHUNKING: Splits normalized text into overlapping character segments.
        """
        chunks = []
        if len(text) <= chunk_size:
            return [text]
            
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunk = text[start:end]
            chunks.append(chunk)
            start += chunk_size - overlap
            
        return chunks

    @classmethod
    def process_file(cls, file_path: str, default_metadata: dict) -> list[DocumentChunk]:
        """
        Runs the full IBM Data Prep Kit pipeline:
        Reads a file, extracts metadata, cleans, normalizes, chunks, and attaches metadata.
        """
        # 1. Extraction
        raw_content = cls.extract_text(file_path)

        # Separate metadata frontmatter if exists (enclosed in --- at the top of markdown)
        metadata = default_metadata.copy()
        content_body = raw_content

        if raw_content.startswith("---"):
            parts = raw_content.split("---", 2)
            if len(parts) >= 3:
                frontmatter_text = parts[1]
                content_body = parts[2]
                
                # Simple YAML-like parsing for metadata fields
                for line in frontmatter_text.strip().split("\n"):
                    if ":" in line:
                        k, v = line.split(":", 1)
                        metadata[k.strip().lower()] = v.strip()

        # 2. Cleaning
        cleaned_body = cls.clean_text(content_body)

        # 3. Normalization
        normalized_body = cls.normalize_text(cleaned_body)

        # 4. Chunking
        raw_chunks = cls.chunk_text(normalized_body)

        # 5. Metadata Tagging
        processed_chunks: list[DocumentChunk] = []
        for idx, chunk in enumerate(raw_chunks):
            processed_chunks.append({
                "content": chunk.strip(),
                "title": metadata.get("title", "Unknown"),
                "source": metadata.get("source", "Trusted Educational Source"),
                "topic": metadata.get("topic", "Skin Health"),
                "year": metadata.get("year", "2026"),
                "doc_type": metadata.get("doc_type", "Article"),
                "chunk_index": idx
            })

        return processed_chunks
