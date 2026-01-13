authRouter
- POST /signup ✅
- POST /login ✅
- POST /logout ✅

profileRouter
- GET /profite/view ✅
- PATCH /profile/edit ✅
- PATCH /profite/password

connectionRequestRouter
- POST /request/send/intereted/:userld ✅
- POST /request/send/ignored/:userld ✅
- POST /request/review/accepted/ : requestld ✅
- POST /request/review/rejected/: requestld ✅

userRouter
- GET /user/requests/received - All the requests
- GET /user/connections - All the connection 
- GET /user/feed - Gets you the profiles of other users on platform

## Pagination

```
/feed?page=1&limit=10 -> first 10 users -> 1 - 10
/feed?page=2&limit=10 -> next 10 users -> 11 - 20
/feed?page=3&limit=10 -> next 10 users -> 21 - 30
```