# RAG Proof of Concept

## Quick start

### Setup

Copy the `.env.sample` file to `.env` and set an OpenAI API key.

```bash
cp .env.sample .env
```

### Build

```bash
make build

# or

docker compose build
```

### Run

```bash
make start

# or

docker compose up -d
```

## About the solution

To simplify the application and user interface, metadata-based search keys are extracted from the user’s query instead of using a separate metadata search.

First, a model extracts file names and page numbers if present in the user’s query. These are then used to narrow down and speed up the similarity search.

The application computes relevance using the inner product of embeddings. Since the embeddings are normalized, the inner product is equivalent to the cosine similarity which is the [suggested similarity metric](https://help.openai.com/en/articles/6824809-embeddings-frequently-asked-questions) for OpenAI embeddings.

## Sources to load documents and split text

- [LangChain Recursive Text Splitter](https://js.langchain.com/docs/how_to/recursive_text_splitter/)
- [LangChain PDF Loader](https://js.langchain.com/docs/integrations/document_loaders/file_loaders/pdf/)
