---
title: "RAG Setup for Code Repositories"
version: "0.1.0"
created: "2025-08-21"
last_updated: "2025-08-21"
status: "Active"
target_audience: ["developers", "devops", "ai-assistants"]
tags: ["rag-implementation", "vector-databases", "ai-integration", "code-retrieval"]
category: "Implementation Guides"
description: "Complete guide to implementing Retrieval-Augmented Generation for your codebase."
---

# RAG Setup for Code Repositories

Complete guide to implementing Retrieval-Augmented Generation for your codebase.

## Overview

RAG (Retrieval-Augmented Generation) addresses the fundamental limitation of AI coding assistants: they can only handle small pieces of code at a time. RAG essentially gives AI assistants a "memory upgrade" and direct access to your team's collective knowledge.

### Benefits

- **Contextual Code Generation**: AI understands your entire codebase patterns
- **Consistent Architecture**: Maintains architectural decisions across sessions
- **Knowledge Preservation**: Team knowledge persists beyond individual interactions
- **Scalable Context**: Works with codebases of any size

## Architecture Components

### Core Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Code Files    │───▶│   Embedding     │───▶│  Vector Store   │
│                 │    │   Pipeline      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
┌─────────────────┐    ┌─────────────────┐             │
│  User Query     │───▶│   Retrieval     │◄────────────┘
│                 │    │   Engine        │
└─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐
│  AI Assistant   │◄───│  Context +      │
│                 │    │  Retrieved Code │
└─────────────────┘    └─────────────────┘
```

### Data Flow

1. **Indexing Phase**: Process codebase into searchable chunks
2. **Embedding Phase**: Convert code to vector representations
3. **Storage Phase**: Store embeddings in vector database
4. **Query Phase**: Convert user requests to embeddings
5. **Retrieval Phase**: Find relevant code chunks
6. **Generation Phase**: Provide context to AI assistant

## Implementation Guide

### Step 1: Choose Your Stack

#### Vector Databases
- **Chroma**: Easy to use, good for local development
- **Pinecone**: Managed service, good for production
- **Weaviate**: Open source, feature-rich
- **Qdrant**: High performance, good for large codebases

#### Embedding Models
- **OpenAI text-embedding-ada-002**: General purpose, good quality
- **CodeBERT**: Specialized for code understanding
- **Sentence-BERT**: Good for semantic similarity
- **Cohere Embed**: Good performance/cost ratio

#### Orchestration
- **LangChain**: Comprehensive RAG framework
- **LlamaIndex**: Focused on document retrieval
- **Haystack**: Production-ready search framework
- **Custom**: Roll your own for specific needs

### Step 2: Chunking Strategy

Different file types require different approaches:

#### Source Code Files

```python
def chunk_source_code(file_content, file_type):
    """
    Chunk source code by logical units
    """
    if file_type in ['py', 'js', 'ts']:
        # Chunk by functions/classes
        chunks = extract_functions_and_classes(file_content)
    elif file_type in ['html', 'jsx', 'tsx']:
        # Chunk by components
        chunks = extract_components(file_content)
    elif file_type in ['css', 'scss']:
        # Chunk by selectors/rules
        chunks = extract_css_rules(file_content)
    
    # Enhance each chunk with context
    enhanced_chunks = []
    for chunk in chunks:
        enhanced_chunk = {
            'content': chunk.content,
            'metadata': {
                'file_path': chunk.file_path,
                'function_name': chunk.name,
                'dependencies': extract_dependencies(chunk.content),
                'imports': extract_imports(file_content),
                'class_context': get_class_context(chunk),
                'docstring': extract_docstring(chunk.content),
                'complexity_score': calculate_complexity(chunk.content)
            }
        }
        enhanced_chunks.append(enhanced_chunk)
    
    return enhanced_chunks
```

#### Documentation Files

```python
def chunk_documentation(file_content, file_path):
    """
    Chunk documentation by sections
    """
    sections = split_by_headers(file_content)
    
    chunks = []
    for section in sections:
        chunk = {
            'content': section.content,
            'metadata': {
                'file_path': file_path,
                'section_title': section.title,
                'section_level': section.level,
                'related_code': find_related_code_examples(section.content),
                'cross_references': extract_links(section.content),
                'last_modified': get_file_modification_date(file_path)
            }
        }
        chunks.append(chunk)
    
    return chunks
```

#### Configuration Files

```python
def chunk_config_files(file_content, file_type):
    """
    Chunk configuration files by logical groups
    """
    if file_type == 'json':
        chunks = chunk_json_by_sections(file_content)
    elif file_type in ['yaml', 'yml']:
        chunks = chunk_yaml_by_services(file_content)
    elif file_type == 'toml':
        chunks = chunk_toml_by_sections(file_content)
    
    # Add context about configuration relationships
    for chunk in chunks:
        chunk['metadata'].update({
            'config_type': file_type,
            'related_configs': find_related_configs(chunk.content),
            'environment': detect_environment(chunk.content),
            'dependencies': extract_service_dependencies(chunk.content)
        })
    
    return chunks
```

### Step 3: Embedding Pipeline

```python
import openai
from typing import List, Dict
import hashlib

class CodeEmbeddingPipeline:
    def __init__(self, model_name="text-embedding-ada-002"):
        self.model_name = model_name
        self.cache = {}
    
    def create_embedding(self, text: str) -> List[float]:
        """Create embedding with caching"""
        # Create cache key
        cache_key = hashlib.md5(text.encode()).hexdigest()
        
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        # Create embedding
        response = openai.Embedding.create(
            model=self.model_name,
            input=text
        )
        
        embedding = response['data'][0]['embedding']
        self.cache[cache_key] = embedding
        
        return embedding
    
    def process_chunk(self, chunk: Dict) -> Dict:
        """Process a code chunk into embeddable format"""
        # Combine content with relevant metadata
        embeddable_text = self.format_for_embedding(chunk)
        
        # Create embedding
        embedding = self.create_embedding(embeddable_text)
        
        return {
            'id': self.generate_chunk_id(chunk),
            'content': chunk['content'],
            'metadata': chunk['metadata'],
            'embedding': embedding,
            'embeddable_text': embeddable_text
        }
    
    def format_for_embedding(self, chunk: Dict) -> str:
        """Format chunk for optimal embedding"""
        content = chunk['content']
        metadata = chunk['metadata']
        
        # Create contextual text
        context_parts = [
            f"File: {metadata.get('file_path', 'unknown')}",
            f"Function: {metadata.get('function_name', 'N/A')}",
            f"Dependencies: {', '.join(metadata.get('dependencies', []))}",
            "",
            content
        ]
        
        if metadata.get('docstring'):
            context_parts.insert(-1, f"Documentation: {metadata['docstring']}")
            context_parts.insert(-1, "")
        
        return "\n".join(context_parts)
```

### Step 4: Vector Store Setup

```python
import chromadb
from chromadb.config import Settings

class CodebaseVectorStore:
    def __init__(self, collection_name="codebase", persist_directory="./chroma_db"):
        self.client = chromadb.Client(Settings(
            persist_directory=persist_directory,
            chroma_db_impl="duckdb+parquet"
        ))
        
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"description": "Codebase embeddings for RAG"}
        )
    
    def add_chunks(self, processed_chunks: List[Dict]):
        """Add processed chunks to vector store"""
        ids = [chunk['id'] for chunk in processed_chunks]
        embeddings = [chunk['embedding'] for chunk in processed_chunks]
        documents = [chunk['embeddable_text'] for chunk in processed_chunks]
        metadatas = [chunk['metadata'] for chunk in processed_chunks]
        
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )
    
    def search(self, query_embedding: List[float], n_results: int = 5) -> Dict:
        """Search for similar code chunks"""
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            include=['documents', 'metadatas', 'distances']
        )
        
        return results
    
    def update_chunk(self, chunk_id: str, new_chunk: Dict):
        """Update existing chunk"""
        self.collection.update(
            ids=[chunk_id],
            embeddings=[new_chunk['embedding']],
            documents=[new_chunk['embeddable_text']],
            metadatas=[new_chunk['metadata']]
        )
```

### Step 5: Retrieval Engine

```python
class CodeRetrievalEngine:
    def __init__(self, vector_store, embedding_pipeline):
        self.vector_store = vector_store
        self.embedding_pipeline = embedding_pipeline
    
    def retrieve_context(self, query: str, max_results: int = 5) -> List[Dict]:
        """Two-stage retrieval: vector search + LLM filtering"""
        
        # Stage 1: Vector similarity search
        query_embedding = self.embedding_pipeline.create_embedding(query)
        candidates = self.vector_store.search(
            query_embedding, 
            n_results=max_results * 3  # Get more candidates for filtering
        )
        
        # Stage 2: LLM-based filtering and ranking
        relevant_chunks = self.llm_filter_results(query, candidates)
        
        return relevant_chunks[:max_results]
    
    def llm_filter_results(self, query: str, candidates: Dict) -> List[Dict]:
        """Use LLM to filter and rank results by relevance"""
        filtering_prompt = f"""
        Query: {query}
        
        Rank these code chunks by relevance to the query (1-10 scale):
        
        {self.format_candidates_for_filtering(candidates)}
        
        Return only chunks with relevance score >= 7, ordered by relevance.
        """
        
        # Call LLM for filtering (implementation depends on your LLM setup)
        filtered_results = self.call_llm_for_filtering(filtering_prompt, candidates)
        
        return filtered_results
    
    def retrieve_related_chunks(self, chunk_id: str) -> List[Dict]:
        """Retrieve chunks related to a specific chunk"""
        # Get the chunk metadata
        chunk = self.vector_store.get_by_id(chunk_id)
        
        # Find related chunks based on:
        # 1. Same file
        # 2. Same class/module
        # 3. Dependency relationships
        
        related_queries = [
            f"file:{chunk['metadata']['file_path']}",
            f"class:{chunk['metadata'].get('class_name', '')}",
            f"depends_on:{chunk['metadata'].get('dependencies', [])}",
        ]
        
        related_chunks = []
        for query in related_queries:
            if query.split(':')[1]:  # Only query if there's content after ':'
                chunks = self.retrieve_context(query, max_results=3)
                related_chunks.extend(chunks)
        
        # Remove duplicates and original chunk
        unique_related = self.deduplicate_chunks(related_chunks, exclude_id=chunk_id)
        
        return unique_related[:5]  # Limit to 5 related chunks
```

### Step 6: Integration with AI Assistant

```python
class RAGEnhancedAssistant:
    def __init__(self, retrieval_engine, llm_client):
        self.retrieval_engine = retrieval_engine
        self.llm_client = llm_client
    
    def generate_with_context(self, user_query: str, max_context_chunks: int = 5) -> str:
        """Generate response with retrieved context"""
        
        # Retrieve relevant context
        relevant_chunks = self.retrieval_engine.retrieve_context(
            user_query, 
            max_results=max_context_chunks
        )
        
        # Build context for LLM
        context_prompt = self.build_context_prompt(user_query, relevant_chunks)
        
        # Generate response
        response = self.llm_client.generate(context_prompt)
        
        return response
    
    def build_context_prompt(self, query: str, chunks: List[Dict]) -> str:
        """Build prompt with retrieved context"""
        
        context_sections = []
        for i, chunk in enumerate(chunks, 1):
            context_section = f"""
            ## Context {i}: {chunk['metadata']['file_path']}
            ```{chunk['metadata'].get('file_extension', '')}
            {chunk['content']}
            ```
            """
            context_sections.append(context_section)
        
        prompt = f"""
        You are a coding assistant with access to the following relevant code context:
        
        {''.join(context_sections)}
        
        Based on this context and following the established patterns, please respond to:
        {query}
        
        Make sure your response:
        1. Follows the patterns shown in the context
        2. Uses similar naming conventions
        3. Maintains consistency with the existing codebase
        4. References specific examples from the context when relevant
        """
        
        return prompt
```

## Advanced Features

### 1. Automatic Index Updates

```python
import watchdog
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class CodebaseWatcher(FileSystemEventHandler):
    def __init__(self, rag_system):
        self.rag_system = rag_system
    
    def on_modified(self, event):
        if event.is_directory:
            return
        
        file_path = event.src_path
        if self.should_index_file(file_path):
            self.rag_system.update_file_index(file_path)
    
    def should_index_file(self, file_path: str) -> bool:
        """Check if file should be indexed"""
        indexed_extensions = {'.py', '.js', '.ts', '.md', '.json', '.yaml'}
        excluded_patterns = {'node_modules', '.git', '__pycache__', '.env'}
        
        # Check extension
        if not any(file_path.endswith(ext) for ext in indexed_extensions):
            return False
        
        # Check excluded patterns
        if any(pattern in file_path for pattern in excluded_patterns):
            return False
        
        return True
```

### 2. Context Quality Scoring

```python
def calculate_context_quality(chunks: List[Dict], query: str) -> float:
    """Calculate quality score for retrieved context"""
    
    scores = {
        'relevance': 0.0,      # How relevant are the chunks?
        'completeness': 0.0,   # Do we have enough context?
        'freshness': 0.0,      # How up-to-date is the code?
        'diversity': 0.0,      # Do we have varied examples?
    }
    
    # Calculate relevance (average similarity scores)
    relevance_scores = [chunk.get('similarity_score', 0) for chunk in chunks]
    scores['relevance'] = sum(relevance_scores) / len(relevance_scores) if relevance_scores else 0
    
    # Calculate completeness (do we have related chunks?)
    file_coverage = len(set(chunk['metadata']['file_path'] for chunk in chunks))
    scores['completeness'] = min(file_coverage / 3, 1.0)  # Normalize to 0-1
    
    # Calculate freshness (how recently were files modified?)
    from datetime import datetime, timedelta
    now = datetime.now()
    freshness_scores = []
    for chunk in chunks:
        last_modified = chunk['metadata'].get('last_modified', now)
        age_days = (now - last_modified).days
        freshness_score = max(0, 1 - (age_days / 365))  # Decay over a year
        freshness_scores.append(freshness_score)
    
    scores['freshness'] = sum(freshness_scores) / len(freshness_scores) if freshness_scores else 0
    
    # Calculate diversity (different types of code constructs)
    construct_types = set()
    for chunk in chunks:
        if 'function_name' in chunk['metadata']:
            construct_types.add('function')
        if 'class_name' in chunk['metadata']:
            construct_types.add('class')
        if chunk['metadata'].get('file_path', '').endswith('.md'):
            construct_types.add('documentation')
    
    scores['diversity'] = len(construct_types) / 4  # Normalize by max types
    
    # Weighted average
    weights = {'relevance': 0.4, 'completeness': 0.3, 'freshness': 0.2, 'diversity': 0.1}
    overall_score = sum(scores[key] * weights[key] for key in scores)
    
    return overall_score
```

## Configuration Template

```yaml
# rag_config.yaml
rag_setup:
  # Vector store configuration
  vector_store:
    type: "chroma"  # chroma, pinecone, weaviate, qdrant
    persist_directory: "./vector_db"
    collection_name: "codebase"
    
  # Embedding configuration  
  embedding:
    model: "text-embedding-ada-002"  # OpenAI model
    batch_size: 100
    cache_embeddings: true
    
  # Chunking configuration
  chunking:
    max_chunk_size: 1000
    overlap_size: 200
    chunk_by: "function"  # function, class, file, semantic
    
  # File inclusion/exclusion
  indexing:
    include_extensions: [".py", ".js", ".ts", ".md", ".json", ".yaml"]
    exclude_patterns: ["node_modules", ".git", "__pycache__", ".env"]
    exclude_files: [".gitignore", "package-lock.json"]
    
  # Retrieval configuration
  retrieval:
    max_results: 5
    similarity_threshold: 0.7
    enable_llm_filtering: true
    context_window_tokens: 4000
    
  # Update configuration
  auto_update:
    enabled: true
    watch_directories: ["./src", "./docs"]
    batch_updates: true
    update_interval: 300  # seconds
```

## Performance Optimization

### 1. Embedding Caching

```python
import pickle
import os
from hashlib import md5

class EmbeddingCache:
    def __init__(self, cache_dir="./embedding_cache"):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)
    
    def get_cache_path(self, text: str) -> str:
        text_hash = md5(text.encode()).hexdigest()
        return os.path.join(self.cache_dir, f"{text_hash}.pkl")
    
    def get(self, text: str) -> List[float]:
        cache_path = self.get_cache_path(text)
        if os.path.exists(cache_path):
            with open(cache_path, 'rb') as f:
                return pickle.load(f)
        return None
    
    def set(self, text: str, embedding: List[float]):
        cache_path = self.get_cache_path(text)
        with open(cache_path, 'wb') as f:
            pickle.dump(embedding, f)
```

### 2. Batch Processing

```python
def batch_process_files(file_paths: List[str], batch_size: int = 50):
    """Process files in batches for better performance"""
    
    for i in range(0, len(file_paths), batch_size):
        batch = file_paths[i:i + batch_size]
        
        # Process batch
        chunks = []
        for file_path in batch:
            file_chunks = process_file(file_path)
            chunks.extend(file_chunks)
        
        # Create embeddings in batch
        embeddings = create_batch_embeddings([chunk['content'] for chunk in chunks])
        
        # Update chunks with embeddings
        for chunk, embedding in zip(chunks, embeddings):
            chunk['embedding'] = embedding
        
        # Store in vector database
        vector_store.add_chunks(chunks)
        
        print(f"Processed batch {i//batch_size + 1}/{(len(file_paths) + batch_size - 1) // batch_size}")
```

## Monitoring and Metrics

Track RAG performance with these metrics:

```python
class RAGMetrics:
    def __init__(self):
        self.metrics = {
            'queries_processed': 0,
            'average_response_time': 0.0,
            'context_quality_scores': [],
            'retrieval_accuracy': 0.0,
            'cache_hit_rate': 0.0
        }
    
    def log_query(self, query_time: float, context_quality: float):
        self.metrics['queries_processed'] += 1
        self.metrics['context_quality_scores'].append(context_quality)
        
        # Update average response time
        total_time = self.metrics['average_response_time'] * (self.metrics['queries_processed'] - 1)
        self.metrics['average_response_time'] = (total_time + query_time) / self.metrics['queries_processed']
    
    def get_summary(self) -> Dict:
        return {
            'total_queries': self.metrics['queries_processed'],
            'avg_response_time': f"{self.metrics['average_response_time']:.2f}s",
            'avg_context_quality': f"{sum(self.metrics['context_quality_scores']) / len(self.metrics['context_quality_scores']):.2f}" if self.metrics['context_quality_scores'] else "N/A",
            'cache_hit_rate': f"{self.metrics['cache_hit_rate']:.1%}"
        }
```

This RAG setup will transform your AI coding experience, giving your assistants the memory and context they need to work effectively with large codebases while maintaining consistency across long development sessions.