Update at {time}

Project structure here: file and folder

Architecture: pipeline chạy thế nào...maybe, hoặc giải thích về công nghệ

Ví dụ
Structure...
tree command here

ATI_PhAnh_group/
├── .devcontainer/
│   ├── devcontainer.json
│   └── Dockerfile
├── knowledge/
│   ├── templates/
│   │   ├── architectureTemplates.md
│   │   └── taskFilesTemplate.md
│   ├── apiDocs.md
│   ├── architecture.md
│   ├── configuration.md
│   ├── metaDocsExplain.md
│   ├── projectOverview.md
│   └── workflows.md
├── requestFromUsers/
│   └── task_30_09.md
└── state/
    ├── task_30_09_state.md
    └── taskSummary.md

Architecutre
Techstack here
Pipeline here

Example

# 1. Tech Stack Overview

The system leverages a **Modern Data Stack** optimized for real-time data streaming and large-scale analytical workloads:

* **Ingestion:** Apache Kafka, Debezium (CDC)
* **Processing & Orchestration:** Apache Spark, Apache Airflow
* **Storage & Data Lakehouse:** Apache Iceberg, MinIO / AWS S3
* **Data Warehouse:** Snowflake / ClickHouse
* **Transformation & Modeling:** dbt (data build tool)
* **Serving & Visualization:** Metabase, FastAPI

---

# 2. Data Pipeline Architecture

The following flowchart illustrates the end-to-end data lifecycle from operational source databases through ingestion, transformation, and down to serving layers.

```mermaid
flowchart TD
    %% Source Layer
    subgraph Sources ["1. Data Sources"]
        A1[PostgreSQL App DB]
        A2[User Activity Logs]
        A3[Third-party APIs]
    end

    %% Ingestion Layer
    subgraph Ingestion ["2. Ingestion Layer"]
        B1[Debezium CDC]
        B2[Fluentd / Vector]
        B3[Airflow API Extractors]
    end

    %% Streaming & Buffer
    subgraph Messaging ["3. Event Streaming"]
        C1[Kafka Event Topics]
    end

    %% Processing & Storage
    subgraph Storage ["4. Raw & Lakehouse (Bronze/Silver)"]
        D1[Spark Streaming]
        D2[MinIO / S3 - Iceberg Format]
    end

    %% Transformation
    subgraph Analytics ["5. Data Warehouse & Transformation (Gold)"]
        E1[dbt Data Modeling]
        E2[ClickHouse / Snowflake]
    end

    %% Serving Layer
    subgraph Serving ["6. Serving Layer"]
        F1[FastAPI Microservices]
        F2[Metabase Dashboards]
        F3[ML Feature Store]
    end

    %% Relationships
    A1 -->|Change Data Capture| B1
    A2 -->|Stream Logs| B2
    A3 -->|Scheduled Batch| B3

    B1 --> C1
    B2 --> C1
    B3 -->|Raw Files| D2

    C1 -->|Consume Streams| D1
    D1 -->|Write Parquet/Iceberg| D2

    D2 -->|Transform & Clean| E1
    E1 -->|Load Data Marts| E2

    E2 -->|SQL Query| F1
    E2 -->|Analytics| F2
    E2 -->|Model Input| F3