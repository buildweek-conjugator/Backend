# Conjugator API




## Open Endpoints

Open endpoints require no Authentication.
<details>
  <summary>Register : <code>POST /api/register/</code></summary>
    <p>

  # Create New User Account

  Get the details of the currently Authenticated User along with basic
  subscription information.

  **URL** : `/api/register/`

  **Method** : `POST`

  **Auth required** : NO

  **Permissions required** : None

  **Data constraints**

  Email must be unique.

  ```json
  {
      "email": "[unicode 255 chars max]"
  }
  ```
  **Data example**

  All fields must be sent.


  ```json
  {
      "first_name": "Peter",
      "last_name": "Griffin",
      "email": "BirdIsTheWord@quahog.com",
      "password": "Tom Brady"
  }
  ```

  ## Success Response

  **Code** : `201 CREATED`

  **Content examples**

  ```json
  {
    "id": 5,
    "first_name": "Peter",
    "last_name": "Griffin",
    "email": "BirdIsTheWord@quahog.com",
    "password": "$2a$10$vncwoY0avJfBxYCCBv3wDeSZw51hrqhXCDkfJA22m6zckcyGjoVY6"
  }
  ```

  ## Error Responses

  **Condition** : If Account already exists for User.

  **Code** : `500 SEE OTHER`

  **Headers** : `Location: http://testserver/api/accounts/123/`

  **Content** : `{}`

  ### Or

  **Condition** : If fields are missed.

  **Code** : `400 BAD REQUEST`

  **Content example**

  ```json
  {
      "first_name": [
          "This field is required."
      ]
  }
  ```

  </p>
</details>

<details>
  <summary>Login : <code>POST /api/login/</code></summary>
    <p>

  # Login

Used to collect a Token for a registered User.

**URL** : `/api/login/`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "username": "[valid email address]",
    "password": "[password in plain text]"
}
```

**Data example**

```json
{
    "username": "iloveauth@example.com",
    "password": "abcd1234"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "token": "93144b288eb1fdccbe46d6fc0f241a51766ecd3d"
}
```

## Error Response

**Condition** : If 'username' and 'password' combination is wrong.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "non_field_errors": [
        "Unable to login with provided credentials."
    ]
}
```

  </p>
</details>


## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. A Token can be acquired from the Login view above.

### Current User related

Each endpoint manipulates or displays information related to the User whose
Token is provided with the request:

* [Show user info](user/get.md) : `GET /api/user/`
* [Update user info](user/put.md) : `PUT /api/user/`


<details>
  <summary>Get User Settings : <code>GET /api/user/settings</code></summary>
    <p>

  # Get Settings

  Get the settings for the currently authenticated user. 

  **URL** : `/api/user/settings`

  **Method** : `GET`

  **Auth required** : YES

  **Permissions required** : Authentication Token

  **Data constraints**
  Authentication token must be valid and match current user id.

  ## Success Response

  **Code** : `200 OK`

  **Content examples**

  ```json
{
  "id": 99,
  "settings": {
    "mood": {
      "Indicative": true,
      "Subjunctive": false,
      "Imperative Affirmative": true,
      "Imperative Negative": true
    },
    "tense": {
      "Present": true,
      "Future": true,
      "Imperfect": true,
      "Preterite": true,
      "Conditional": true,
      "Present Perfect": false,
      "Future Perfect": true,
      "Past Perfect": true,
      "Preterite (Archaic)": true,
      "Conditional Perfect": true
    },
    "vosotros": false
  }
}
  ```

  ## Error Responses

  **Condition** : Server error, likely could not user in db.

  **Code** : `500 INTERNAL SERVER ERROR`

  **Content example**

  ```json
{
  "err": {},
  "message": "Ay dios mio!"
}
  ```

  </p>
</details>

<details>
  <summary>Update User Settings : <code>PUT /api/user/settings</code></summary>
    <p>

  # Update Settings

  Update the settings for the currently authenticated user. 

  **URL** : `/api/user/settings`

  **Method** : `PUT`

  **Auth required** : YES

  **Permissions required** : Authentication Token

  **Data constraints**
  None

  **Data example**

  Must contain settings object with all required fields.

  ```json
{
    "mood": {
      "Indicative": false,
      "Subjunctive": false,
      "Imperative Affirmative": true,
      "Imperative Negative": true
    },
    "tense": {
      "Present": true,
      "Future": true,
      "Imperfect": true,
      "Preterite": true,
      "Conditional": true,
      "Present Perfect": true,
      "Future Perfect": true,
      "Past Perfect": true,
      "Preterite (Archaic)": true,
      "Conditional Perfect": true
    },
    "vosotros": false
}
  ```

  ## Success Response

  **Code** : `200 OK`

  **Content examples**

  ```json
{
  "success": true,
  "records_updated": 1,
  "message": "Hurra! Bueno! Peter, your settings have been updated."
}
  ```

  ## Error Responses

  **Condition** : Server error, likely could not user in db.

  **Code** : `500 INTERNAL SERVER ERROR`

  **Content example**

  ```json
{
  "err": {},
  "message": "Ay dios mio!"
}
  ```

  </p>
</details>





### Admin related

Endpoints for viewing and manipulating the Accounts that the Authenticated Admin User
has permissions to access.

* [Master user list](accounts/get.md) : `GET /api/admin/users`


## DB Schemas

### Users Schema

| field       | data type        | metadata                                            |
| :---------- | :--------------- | :-------------------------------------------------- |
| id          | unsigned integer | primary key, auto-increments, generated by database |
| first_name  | string           | required                                            |
| last_name   | string           | required                                            |
| email       | string           | required                                            |
| password    | string           | required                                            |
