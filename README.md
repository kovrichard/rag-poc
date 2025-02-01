# RAG Proof of Concept

## First steps

Copy the `.env.sample` file to `.env` and set an OpenAI API key.

```bash
cp .env.sample .env
```

## Build

```bash
make build

# or

docker compose build
```

# Run

```bash
make start

# or

docker compose up -d
```

## Sources to load documents and split text

- [LangChain Recursive Text Splitter](https://js.langchain.com/docs/how_to/recursive_text_splitter/)
- [LangChain PDF Loader](https://js.langchain.com/docs/integrations/document_loaders/file_loaders/pdf/)

