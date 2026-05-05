---
title: "eBook+Ralph+Kimball+3rd+Edition+-+The+Data+Warehouse+Toolkit"
author: "www.it-ebooks.info"
last_interaction: "2026-04-06T05:23:46.000Z"
---


# Introduction

Practitioners and pundits alike have recognized that the presentation of data must be grounded in simplicity if it is to stand any chance of success.

Data Warehousing, Business Intelligence, and Dimensional Modeling Primer

# Goals of Data Warehousing and Business Intelligence

## The DW/BI system must make information easily accessible.

The DW/BI system must present information consistently.

The DW/BI system must serve as the authoritative and trustworthy

The business community must accept the DW/BI system to deem it successful.

The DW/BI system must serve as the authoritative and trustworthy foundation for improved decision making.

## Dimensional Modeling Introduction

The term fact represents a business measure.

Each row in a fact table corresponds to a measurement event.

dimension attributes supply the report filters and labeling, whereas the fact tables supply the report’s numeric values.

> this!

## Kimball’s DW/BI Architecture

### Operational Source Systems

Think of the source systems as outside the data warehouse because presumably you have little or no control over the content and format of the data in these operational systems. The main priorities of the source systems are processing performance and availability.

a good data warehouse can relieve the source systems of much of the responsibility for representing the past.

> minimum retention preiods in source. maximum retention k

> minimum retention preiods in source. maximum retention in warehouse

Presentation Area to Support Business Intelligence

### An enterprise’s business processes cross the boundaries of organizational departments and functions. In other words, you should construct a single fact table for atomic sales metrics rather than populating separate similar, but slightly different, databases containing sales metrics for the sales, marketing, logistics, and ﬁnance teams.

Without shared, conformed dimensions, a dimensional model becomes a standalone application.

> important: a standard tracking concept needs to be shared

### Business Intelligence Applications

Restaurant Metaphor for the Kimball Architecture

### On the contrary, because of their symmetry, dimensional

Kimball Dimensional Modeling Techniques Overview

## Fundamental Concepts

Gather Business Requirements and Data Realities

### Collaborative Dimensional Modeling Workshops

Enterprise Data Warehouse Bus Matrix

## The rows of the matrix are business processes and the columns are dimensions. The shaded cells of the matrix indicate whether a dimension is associated with a given business process.

Four-Step Dimensional Design Process

## Step 1: Select the Business Process

business process is a low-level activity performed by an organization, such as taking orders, invoicing, receiving payments, handling service calls, registering students, performing a medical procedure, or processing claims.

Step 2: Declare the Grain
