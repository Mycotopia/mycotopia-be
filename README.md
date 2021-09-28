# mycotopia-be
Express backend for Mycotopia


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