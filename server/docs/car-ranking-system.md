# Car Ranking System

## Purpose

This module provides a separate ranking pipeline for car assets without changing existing listing or asset endpoints.

It computes a score for each active car, saves rank snapshots, and exposes dedicated ranking APIs.

## Where It Is Wired

- Route registration: server/index.js
- Ranking route logic: server/routes/car-ranking.routes.js
- Ranking profile model: server/models/CarRankingProfile.model.js
- Ranking snapshot model: server/models/CarRankingSnapshot.model.js

## Existing Database Collections Used

The ranking system reads live signals from existing collections:

- CarAsset collection (model: CarAsset)
  - Reads active cars and core fields such as views, likes, media/spec completeness, and createdAt
- Lead collection (model: Lead)
  - Reads car inquiries using assetModel = CarAsset and assetId
- UserActivity collection (model: UserActivity)
  - Reads inquiry-related actions like INQUIRY, CALL_AGENT, BUY_REQUEST, RENT_REQUEST

No schema changes were made to these existing collections.

## New Collections Added

### 1) CarRankingProfile

Stored by model: CarRankingProfile

Purpose:

- Stores ranking configuration that comes from request body
- Defines scoring weights and time windows

Main fields:

- name
- isActive
- windowDays
- maxFreshnessDays
- weights.views
- weights.likes
- weights.inquiries
- weights.freshness
- weights.completeness

### 2) CarRankingSnapshot

Stored by model: CarRankingSnapshot

Purpose:

- Stores computed ranking result per car
- Makes top ranking reads fast

Main fields:

- carAssetId
- profileName
- windowDays
- computedAt
- rank
- breakdown (viewsScore, likesScore, inquiriesScore, freshnessScore, completenessScore, totalScore)
- signals (views, likes, inquiries, ageDays, completenessRatio)

## End-to-End Flow

### A) Configure profile

Endpoint:

- PUT /api/car-ranking/profile

Behavior:

- Reads configuration from req.body
- Creates profile if not found using req.body values
- Updates existing active profile with req.body values
- Keeps only one active profile when isActive is true

### B) Rebuild ranking

Endpoint:

- POST /api/car-ranking/rebuild

Behavior:

1. Loads active profile from CarRankingProfile
2. Reads all active cars from CarAsset
3. Reads inquiry counts from Lead and UserActivity within profile windowDays
4. Computes score components for each car
5. Sorts by total score descending
6. Upserts each result to CarRankingSnapshot (one document per car)

### C) Read ranking results

Endpoints:

- GET /api/car-ranking/top
- GET /api/car-ranking/car/:carId

Behavior:

- Reads from CarRankingSnapshot
- Joins back to CarAsset for presentation fields
- Can rebuild first when requested with forceRebuild=true on top endpoint

## Scoring Formula

For each car:

- viewsScore = log10(views + 1) * weight.views
- likesScore = log10(likes + 1) * weight.likes
- inquiriesScore = log10(inquiries + 1) * weight.inquiries
- freshnessScore = freshnessRatio * weight.freshness
- completenessScore = completenessRatio * weight.completeness

Total:

- totalScore = viewsScore + likesScore + inquiriesScore + freshnessScore + completenessScore

Notes:

- freshnessRatio decreases as listing age increases
- completenessRatio is based on key listing fields (title, description, media, specs, docs)

## How It Connects To Existing Database

Connection reuse:

- The module uses the same Mongoose connection initialized by server/db.js and server/index.js.
- No separate database or connection is created.

Read path:

- CarAsset, Lead, and UserActivity are queried directly through existing models.

Write path:

- Only CarRankingProfile and CarRankingSnapshot are written by ranking APIs.
- Existing operational collections are not modified by ranking rebuild.

## API Quick Guide

### Create or update profile

Method and path:

- PUT /api/car-ranking/profile

Body example:

{
  "name": "my-car-ranking-v1",
  "isActive": true,
  "windowDays": 45,
  "maxFreshnessDays": 120,
  "weights": {
    "views": 12,
    "likes": 18,
    "inquiries": 35,
    "freshness": 20,
    "completeness": 15
  }
}

### Rebuild with current profile

Method and path:

- POST /api/car-ranking/rebuild

Optional body:

{
  "windowDays": 30
}

### Fetch top list

Method and path:

- GET /api/car-ranking/top?limit=10&forceRebuild=false

### Fetch one car rank detail

Method and path:

- GET /api/car-ranking/car/:carId

## Operational Notes

- If no active ranking profile exists, create one with PUT /api/car-ranking/profile first.
- Rebuild can be triggered manually or scheduled later via cron/job worker.
- Ranking module is isolated, so existing listing and home endpoints keep current behavior.
