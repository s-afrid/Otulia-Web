# Car Ranking Implementation Notes

This document explains what the car ranking system uses from the existing schema, what new files were introduced, and how the ranking/filter flow differs from the base car data model.

## What Already Exists

The ranking system does not replace the existing car workflow. It reads from these existing models:

- `CarAsset` for the main car data
- `Lead` for inquiry counts
- `UserActivity` for interaction counts

### Existing `CarAsset` fields used by ranking

The ranking logic reads the following kinds of data from `CarAsset`:

- Core listing data: `title`, `description`, `price`, `location`, `images`, `brand`, `variant`, `videoUrl`
- Spec data: `keySpecifications`, `specification`
- Engagement fields: `views`, `likes`, `createdAt`
- Status fields: `status`, `category`, `type`, `acquisition`, `isTrending`, `popularity`
- Metadata: `keywords`, `documents`, `agent`, `listingReference`

### Existing collections used for signals

- `Lead` is used to count car inquiries
- `UserActivity` is used to count inquiry-related activity such as `INQUIRY`, `CALL_AGENT`, `BUY_REQUEST`, and `RENT_REQUEST`

## New Files Introduced

### 1. `server/models/CarRankingProfile.model.js`

This model stores the active ranking configuration.

Main purpose:

- Stores ranking weights and timing settings
- Keeps the ranking profile editable from request body
- Ensures only one active profile is used at a time

Main fields:

- `name`
- `isActive`
- `windowDays`
- `maxFreshnessDays`
- `weights.views`
- `weights.likes`
- `weights.inquiries`
- `weights.freshness`
- `weights.completeness`

### 2. `server/models/CarRankingSnapshot.model.js`

This model stores the computed ranking result for each car.

Main purpose:

- Saves one ranking snapshot per car
- Makes ranking reads fast without recalculating every time
- Stores filterable car data alongside the score

Main fields:

- `carAssetId`
- `profileName`
- `windowDays`
- `computedAt`
- `rank`
- `breakdown`
- `signals`
- `carData`
- `filterFields`

### 3. `server/routes/car-ranking.routes.js`

This route file contains the ranking API.

Main endpoints:

- `GET /api/car-ranking/profile`
- `PUT /api/car-ranking/profile`
- `POST /api/car-ranking/rebuild`
- `GET /api/car-ranking/top`
- `GET /api/car-ranking/car/:carId`
- `GET /api/car-ranking/all-filter-cars`

### 4. `server/docs/car-ranking-postman-collection.json`

Postman collection for testing the ranking endpoints.

### 5. `server/docs/car-ranking-system.md`

High-level system documentation for the ranking flow.

## How It Works Differently From the Existing Schema

### Existing `CarAsset` model

`CarAsset` remains the source of truth for live car data.

It is not modified by the ranking flow.

### Ranking snapshot model

`CarRankingSnapshot` is a denormalized copy made for ranking and filtering.

It differs from `CarAsset` in these ways:

- Stores computed score data
- Stores ranking position
- Stores read-optimized `carData`
- Stores `filterFields` for query filtering
- Avoids joining the live car collection for most ranking reads

### Why this difference matters

The ranking system needs to filter and sort quickly.
Instead of querying `CarAsset` and recalculating ranking each time, it stores a snapshot that already contains:

- the score breakdown
- the ranking signals
- the car fields needed for display
- the fields needed for filtering

## Filter Data Added to Ranking Snapshots

The snapshot now stores a separate `filterFields` object so ranking results can be filtered without depending on the live car collection.

Common filter fields stored:

- `price`
- `location`
- `brand`
- `model`
- `variant`
- `yearOfConstruction`
- `mileage`
- `status`
- `acquisition`
- `category`
- `type`
- `isPriceOnRequest`
- `countryOfFirstDelivery`
- `fuel`
- `transmission`
- `body`
- `usageStatus`
- `condition`
- `steering`
- `drive`
- `exteriorColor`
- `interiorColor`
- `company`
- `latitude`
- `longitude`
- `numberOfOwners`

These fields are written during rebuild from the original `CarAsset` document.

## Preset Filter Queries

The ranking endpoints also support preset-style queries for common car discovery use cases.

Supported examples:

- `preset=hypercar` or `preset=best-hypercar`
- `preset=luxury-suv` or `preset=best-luxury-suv`
- `preset=electric` or `preset=best-electric-cars`
- `search=Tesla` for text-style matching across title, description, brand, variant, and keywords

These presets are applied on top of normal filters such as `brand`, `variant`, `minPrice`, `maxPrice`, and `location`.

## Ranking Flow

### 1. Create or update profile

Use:

- `PUT /api/car-ranking/profile`

The profile is created or updated from `req.body`.

### 2. Rebuild ranking

Use:

- `POST /api/car-ranking/rebuild`

This:

- reads active `CarAsset` records
- counts leads and user actions
- computes score
- stores snapshots in `CarRankingSnapshot`

### 3. Read ranked data

Use:

- `GET /api/car-ranking/top`
- `GET /api/car-ranking/car/:carId`
- `GET /api/car-ranking/all-filter-cars`

These endpoints read from the snapshot collection and use the stored filter fields.

## What Is New vs What Is Existing

### Existing models reused

- `CarAsset`
- `Lead`
- `UserActivity`

### New ranking models

- `CarRankingProfile`
- `CarRankingSnapshot`

### New ranking behavior

- Score calculation
- Snapshot persistence
- Filterable ranking queries
- Separate profile management
- Dedicated ranking routes

## Summary

The ranking system is an isolated layer on top of the existing car schema.

It does not replace `CarAsset`; it reads from it, copies the useful fields into a snapshot, and adds score/filter data so ranking can be queried quickly and consistently.
