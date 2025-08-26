# API tree Server [TypeScript - Node.js]
Backend API Server to add new nodes to trees.

Running the repo for the first time?  See [getting started](#getting-started)

## Table of Contents

[Getting started](#getting-started)

[How to run tests](#how-to-run-tests)

[Documentation overview](#documentation-overview)

[Github guidelines](#github-guidelines)

## Getting started

### 🔧 System Requirements

- **Node.js**: 20.x or higher
- **npm**: 9.x or higher
- **Docker**: Latest stable version
- **Docker Compose**: Latest stable version

### Quick start guide
  * Clone the repo

  ```bash
    git clone https://github.com/GustavoSilvaNavarro/shn_gsn_tree.git

    cd shn_gsn_tree
  ```

### Run Server using Docker
  * To spin up docker containers locally use:
  ```bash
  # Single commands spins up the entire server with all the external services it needs
  # db seeding is enable by default

  make up
  ```

You can hit endpoints locally on http://localhost:8080.

### Database Schema
```
nodes (id, label, parent_id, created_at, updated_at)
```

## 🔌 API Endpoints

### Authentication
- `POST /api/tree` - Add new node (root or children)
- `GET /api/tree` - Retrieve all available trees


## How to run tests

### Run Tests
  * Unit testing:
  ```bash
  make unit
  ```

  * Integration testing:

  ```bash
  make integration
  ```

### Run Tests on Docker Desktop
  * To run integration tests, you need to run the following command:
  ```bash
  make integration
  ```

This will spin up the integration tests container.  Integration tests take a few minutes to run.
