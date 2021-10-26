# mycotopia-be
Express backend for Mycotopia


## Dev Commands
Run Database: `docker run --rm --name postgres-mycotopia -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres:13-alpine`
Run Redis: `docker run --rm --name some-redis -p 6379:6379 -d redis:alpine`

## API Docs

### SignUp Route
> Route: /signup/

Expected data:

```json
{
    "fullName": "Full Name",
    "username": "username",
    "emailAddress": "email",
    "password": "password"
}
```

Responses:

> User created
> Status Code: 201

```json
{
    "email": "email address"
}
```

<br>

> Cannot create user (Duplicate record)
> > Status Code: 409
```json
{ 
    "message": "Duplicate username or email." 
}
```