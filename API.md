## API Endpoints Reference

### Admin API
Base path: `/api/admin`
| Method | Endpoint | Purpose | Request Parameters | Example Response |
|--------|----------|---------|--------------------|------------------|
| GET | `/api/admin/pledges` | Get all pledges | Optional query: `hospitalId` | List of pledge records |
| GET | `/api/admin/donors` | Get donor pledges only | Optional query: `hospitalId` | List of donor records |
| GET | `/api/admin/recipients` | Get recipient pledges only | Optional query: `hospitalId` | List of recipient records |
| GET | `/api/admin/stats` | Get dashboard stats | None | Stats map |
| GET | `/api/admin/hospitals` | Get hospitals list | None | List of hospitals |
| GET | `/api/admin/matches` | Get match records | Optional query: `hospitalId` | List of match records |
| POST | `/api/admin/manual-match` | Manually create a match | Body: `donorHash`, `recipientHash`, `organId`, `organType` | Match confirmation |
| GET | `/api/admin/blockchain/live` | Get live blockchain feed | None | Latest block and transactions |
| GET | `/api/admin/documents/download?file=...` | Download document | Query: `file` | PDF file |
| GET | `/api/admin/matches/{id}` | Get match details | Path: `id` | Match record |

### Auth API
Base path: `/api/auth`
| Method | Endpoint | Purpose | Request Parameters | Example Response |
|--------|----------|---------|--------------------|------------------|
| POST | `/api/auth/login` | Login admin or patient | Body: `abhaId`, `password`, `role` | Success token and user info |
| POST | `/api/auth/verify-otp` | Verify OTP for login flow | Body: `abhaId`, `otp` | Success token or error |

### Organ API
Base path: `/api/organ`
| Method | Endpoint | Purpose | Request Parameters | Example Response |
|--------|----------|---------|--------------------|------------------|
| GET | `/api/organs/status/{role}` | Get organs by status/role | Path: `role` | List of pledge records |
| GET | `/api/organs/stats` | Get organ statistics | None | Counts map |
| GET | `/api/organs/hospital/{hospitalId}` | Get organs for a hospital | Path: `hospitalId` | List of pledge records |
| GET | `/api/organs/verify/{pledgeId}` | Verify organ status | Path: `pledgeId` | `{ "valid": true }` |
| GET | `/api/organs/count/{status}` | Count records by status | Path: `status` | `{ "count": 10 }` |


### PatientPipelineController
Base path: `/api`

- `GET /api/security/alerts` — View active security alerts.
- `GET /api/security/status` — View security monitor status.
- `GET /api/stats/overview` — View system overview metrics.
- `GET /api/auth/abha-verify?abhaId=...` — Verify an ABHA ID.
- `POST /api/pledge/upload` — Upload and pin a pledge document to IPFS.
- `GET /api/pledge/all` — Get all pledges.
- `GET /api/pledge/logs` — Get recent pledge logs.
- `POST /api/admin/match-exec` — Execute a best-match operation.
- `POST /api/pledge/verify-witness` — Verify pledge witness data.

### SecurityLogController
Base path: `/api/admin/security-logs`

- `GET /api/admin/security-logs` — Get active security logs.
- `POST /api/admin/security-logs/{id}/ban` — Ban a log/IP entry.
- `POST /api/admin/security-logs/{id}/dismiss` — Dismiss a security log.