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

### Usage

Open Swagger on [http://localhost:8080](http://localhost:8080) to interact with the API.

Upload any TXT or PDF file to the `/upload` endpoint.

Send queries to the `/search` endpoint.

#### Authorization

Set `Bearer dev-secret` as the authorization token.

## Example queries

### Upload

Upload each example file from the `examples` directory.

- [test.pdf](examples/test.pdf)
- [test.txt](examples/test.txt)
- [the-fermi-paradox.pdf](examples/the-fermi-paradox.pdf)

### Search

Examples questions to ask:

- What is the Great Filter?
  + It should return page 7 of `the-fermi-paradox.pdf` as the first result.
- Page 10 of the Fermi Paradox post
  + It should return 3 items from page 10 of `the-fermi-paradox.pdf`.
- How old is the lost ark?
    + It should return page 1 of `test.pdf` containing the info that if the ark is real, it would be ~3000 years old.

## About the solution

### Metadata

To simplify the application and user interface, metadata-based search keys are extracted from the user’s query instead of using a separate metadata search.

First, a model extracts file names and page numbers if present in the user’s query. These are then used to narrow down and speed up the similarity search.

When storing the vectors, the metadata is extracted from the document and stored in the database along with the vector.

### Similarity search

The application computes relevance using the inner product of embeddings. Since the embeddings are normalized, the inner product is equivalent to the cosine similarity which is the [suggested similarity metric](https://help.openai.com/en/articles/6824809-embeddings-frequently-asked-questions) for OpenAI embeddings.

### HNSW

As more and more documents are added to the index, the search time increases linearly. To address this, the application uses a Hierarchical Navigable Small World (HNSW) index to speed up the search while maintaining high retrieval quality.

Since I was focusing on speed, I chose HNSW over IVFFlat, [sacrificing size for speed](https://tembo.io/blog/vector-indexes-in-pgvector).

### Chunking

I arbitrarily chose 1000 characters as the maximum chunk size with a 200 character overlap. Multiple blog posts used the same or similar values, and this configuration yielded good results while manually testing the application.

The application uses a [`RecursiveCharacterTextSplitter`](https://js.langchain.com/docs/how_to/recursive_text_splitter/) to split the text into chunks. The default separators for the splitter are `["\n\n", "\n", " ", ""]`. This means that the app will first try to split the text by paragraphs, then by sentences, and finally by words, ensuring the highest possible semantic meaning in each chunk.

## Sources to load documents and split text

- [LangChain Recursive Text Splitter](https://js.langchain.com/docs/how_to/recursive_text_splitter/)
- [LangChain PDF Loader](https://js.langchain.com/docs/integrations/document_loaders/file_loaders/pdf/)
