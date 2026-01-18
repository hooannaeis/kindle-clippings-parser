---
title: "How Kafka Works - by Neo Kim and Stanislav Kozlovski"
author: "open.substack.com"
last_interaction: "2025-12-29T20:10:44.000Z"
---


Kafka is a messaging system that was originally developed by LinkedIn in 2010. In 2011, it was open-sourced and donated to the Apache Foundation.

## 💡 open-source (1/8)

## pub-sub messaging system (2/8) -

It is append-only; you can only add records to the end of the log (no deletes or updates allowed). Reads go from left to right, in the order the records were added.

The key thing to remember is that the key/value pairs are raw bytes. Kafka does not inherently support types (e.g., int64, string, etc.) nor schemas (specific message structures).

### Topics

### Partitions

Just as in a database, you would create separate tables for user accounts and customer orders; in Kafka, you would create separate topics.

It’s common for a Kafka cluster to have hundreds to thousands of topics.

## 💡 distributed (3/8)

Its greatest strength is its horizontal scalability.

## 💡 scalable (4/8)

records are simply appended to the end and cannot be updated, nor individually deleted. Messages within a partition are independent of each other. They have no higher-level guarantees like unique keys. This reduces the need for locking and allows Kafka to append to the Log structure as fast as the disk will allow.

## 💡 durable (5/8)

Once you start maintaining copies of data in a distributed system, you open yourself to a lot of edge cases.

Kafka uses a straightforward single-leader replication model. At any time, one replica serves as the leader. The other two replicas act as followers

## 💡 fault-tolerant (6/8)

Kafka durably stores all metadata changes in a special single-partition topic called __cluster_metadata.

Every broker in the cluster is subscribed to this topic. In real time, each broker pulls the latest committed updates.

“It’s an open-source, distributed, durable, very scalable, fault-tolerant pub/sub message system with rich integration and stream processing capabilities.”
