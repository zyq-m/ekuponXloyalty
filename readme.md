# eKuponXloyalty@UniSZA

This app consists of 4 different user's level:

1. Admin
2. Cafe
3. Student (b40)
4. Student (non-b40)

## Admin Module

Actions:

- view all user's transactions
- view all users
- suspend users
- assign student's(b40) wallet
- register users
- generate transactions report in PDF & TXT format

## Cafe Module

Actions:

- view profile
- get QR code or OTP code
- view transaction

### Transaction

A cafe can request transaction in PDF format

## Student Module

Actions:

- view profile
- view transactions history
- make a coupon transaction (only-b40)
- claim a point

## Generate Secrete Key

```bash
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```

## NOTES

### OTP utils need to be refactor

I think I should change the implementation. Use tranditional approach instead of speakeasy library.

A cafe generate an OTP key, it store in table Sale. It has expired time. Everytime a student input the key, column OTP (table Sale) will be updated with null value. This can prevent a student input same key multiple times.

### Role

Role based middleware have been created. Dont forget to implement in every routes. Here's roles available:

```bash
id | name
----+---------
1 | B40
2 | NON-B40
3 | ADMIN
4 | CAFE
```

### Prisma

Every time you need to modify your prisma model, use this command to avoid creating a new migration file.

```bash
npx prisma db push
```

### PDF

PDF generator have been created. Just need to create a pdf template (in html) depend on your use cases.

## Setup

Make sure before migrate, stop your server to avoid error. Run the following command to load database

```bash
npm run prisma-migrate
```

## Rest API Reference

### Admin API

#### Get request

```javascript
// Get student info
axios.get("/api/admin/student");
// response
{
  data: [
    {
      matricNo: "482503",
      icNo: "097883983187",
      b40: true,
      userId: "clmyiz00n0000vzhgqdh194ih",
    },
    ...
  ];
}

// Get cafe info
axios.get("/api/admin/cafe");
// response
{
  data: [
    {
      "id": "Nathanael24",
      "name": "Cafe Armando",
      "accountNo": "94005966",
      "userId": "clmzqqxko0000vzucbb7hd8a5"
    },
    ...
  ];
}

// Get student transactions (coupon)
axios.get("/api/admin/student/transactions");
// response
{
  data: [
     {
      "icNo": "699206388500",
      "matricNo": "686098",
      "transaction": [
        {
          "id": "clmztmcid0001vz001o9681ex",
          "cafeId": "Nathanael24",
          "matricNo": "686098",
          "amount": "1",
          "createdAt": "2023-09-26T04:32:05.054Z"
        },
        ...
      ]
    ...
  ];
}

// Get cafe transaction (coupon)
axios.get("/api/admin/cafe/transactions");
// response
{
  data: [
      {
      "id": "Nathanael24",
      "name": "Cafe Armando",
      "transaction": [
        {
          "id": "clmztmcid0001vz001o9681ex",
          "cafeId": "Nathanael24",
          "matricNo": "686098",
          "amount": "1",
          "createdAt": "2023-09-26T04:32:05.054Z"
        },
        ...
       ]
    ...
  ];
}

// Get point transactions
axios.get("/api/admin/student/points", {
    b40: true, // true or false
});
// response
{
    "data": [
        {
        "icNo": "699206388500",
        "matricNo": "686098",
        "transaction": [
            {
            "id": "clmztmcid0001vz001o9681ex",
            "cafeId": "Nathanael24",
            "matricNo": "686098",
            "amount": "1",
            "createdAt": "2023-09-26T04:32:05.054Z"
            },
            ...
        }
    ...
    ]
}
```

#### Post request

```javascript
// Varify cafe's transactions for claim
// Coming soon...
axios.post("/api/admin/cafe/claim", {
  //
});
// response
// coming soon...

// Register student
axios.post("/api/admin/user/register/student", {
    matricNo, // string
    icNo, // string
    b40, //boolean
    name, // string
    phoneNo, // string
    address, // string
});
// response
{
    data: {
        // student data
    },
}

// Register cafe
axios.post("/api/admin/user/register/cafe", {
    cafeId, // string
    cafeName, // string
    accountNo, //boolean
    name, // string
    phoneNo, // string
    address, // string
});
// response
{
    data: {
        // cafe data
    },
}

// Register admin
// Coming soon...
```

#### Put request

```javascript
// Suspend a user
axios.put("/api/admin/user/suspend", {
  id: // can be matric no or cafeId
  active: false, // use 'true' to activate the user
});
// response
{
    data: {
        // user data
    },
    message: "success"
}

// Update b40 wallet amount
axios.put("/api/admin/student/wallet", {
    matricNo, // string
    amount, // int
});
```

### Student API

#### GET

```javascript
// Get student by matric no
axios.get("/api/student/123456)
// response
// {
//     "data": {
//         "matricNo": string,
//         "icNo": string,
//         "user": {
//             "profile": {
//                 "id": string,
//                 "name": string,
//                 "phoneNo": string,
//                 "address": string,
//                 "userId": string
//             }
//         },
//     }
// }

// Get wallet (coupon) transaction
axios.get('/api/student/transaction/wallet/123456')
// Get wallet (coupon) transaction by date
axios.get('/api/student/transaction/wallet/from/to/123456')

// response
// {
//     "data": [
//         {
//             "id": "clmztmcid0001vz001o9681ex",
//             "cafeId": "Nathanael24",
//             "matricNo": "686098",
//             "amount": "1",
//             "createdAt": "2023-09-26T04:32:05.054Z",
//             "walletTransaction": [
//                 {
//                     "id": "clmztmciv0003vz00psu3vimg",
//                     "transactionId": "clmztmcid0001vz001o9681ex",
//                     "pointId": 1
//                 }
//             ]
//         },

// Get point transaction
axios.get('/api/student/transaction/point/123456')
// Get point transaction by date
axios.get('/api/student/transaction/point/from/to/123456')
// response
// {
//     "data": [
//         {
//             "id": "clmztmcid0001vz001o9681ex",
//             "cafeId": "Nathanael24",
//             "matricNo": "686098",
//             "amount": "1",
//             "createdAt": "2023-09-26T04:32:05.054Z",
//             "walletTransaction": [
//                 {
//                     "id": "clmztmciv0003vz00psu3vimg",
//                     "transactionId": "clmztmcid0001vz001o9681ex",
//                     "pointId": 1
//                 }
//             ]
//         },
```

#### POST

```javascript
// Pay (coupon)
axios.get("/api/student/pay", {
  matricNo: string,
  cafeId: string,
  amount: int,
});
// response
// {
//   data: {
//     id: string;
//     transactionId: string;
//     approved: boolean;
//   }
// }

// Collect points
axios.get("/api/student/pay", {
  matricNo: string,
  cafeId: string,
  amount: int,
  pointId: int,
});
// response
// {
//   data: {
//     id: string;
//     transactionId: string;
//     pointId: number;
//   }
// }
```

### Cafe API

#### GET

```javascript
// Get url for ekupon
axios.get("/api/cafe/qr/ekupon/cafe1");
// response
// {
//     "data": {
//         "url": url
//     }
// }

// Get url for point
axios.get("/api/cafe/qr/loyalty/cafe1");
// response
// {
//     "data": {
//         "url": url
//     }
// }

// Get url for point
axios.get("/api/cafe/one-time/cafe1");
// response
// {
//     "data": {
//         "otp": string
//     }
// }

// Get transactions
axios.get("/api/cafe/transaction/cafe1");
// response
// {
//   "data": [
//       {
//           "id": "cln8etgwy0001vz5s8fui32e3",
//           "cafeId": "Sage.Weimann",
//           "matricNo": "482503",
//           "amount": "1",
//           "createdAt": "2023-10-02T04:47:38.700Z"
//       },

// Get transaction by date
axios.get("/api/cafe/transaction/from/to/cafe1");
// response
// {
//   "data": [
//       {
//           "id": "cln8etgwy0001vz5s8fui32e3",
//           "cafeId": "Sage.Weimann",
//           "matricNo": "482503",
//           "amount": "1",
//           "createdAt": "2023-10-02T04:47:38.700Z"
//       },

// Get transaction by date in pdf format
axios.get("/api/cafe/transaction/from/to/cafe1");
// response
// download pdf
```

### Websocket Events

```javascript
io.on("admin:get-overall", data => {
  // data response
  // {
  //   student: 4,
  //   cafe: 5,
  //   coupon: 5,
  //   point: 10,
  // }
});
```
