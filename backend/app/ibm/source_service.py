from typing import Optional, TypedDict

class SourceDict(TypedDict):
    title: str
    source: str
    topic: str
    year: Optional[str]

class Source:
    def __init__(self, title: str, source: str, topic: str, year: Optional[str] = None):
        self.title = title
        self.source = source
        self.topic = topic
        self.year = year

    def to_dict(self) -> SourceDict:
        return {
            "title": self.title,
            "source": self.source,
            "topic": self.topic,
            "year": self.year
        }

def format_source_attribution(sources: list[dict]) -> str:
    """
    Formats a list of sources for insertion into prompt contexts.
    """
    if not sources:
        return "No sources cited."
    
    formatted = []
    for idx, s in enumerate(sources, 1):
        year_str = f" ({s.get('year')})" if s.get('year') else ""
        formatted.append(f"[{idx}] {s.get('title')} - Published by {s.get('source')}{year_str}. Topic: {s.get('topic')}")
        
    return "\n".join(formatted)
