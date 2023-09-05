# eKuponXloyalty@UniSZA

This app consists of 4 different user's level:

1. Admin
2. Cafe
3. Student (b40)
4. Student (non-b40)

## Admin Module

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
- make a coupon transaction
- claim a point

## Generate Secrete Key

```bash
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```

## NOTES

### OTP utils need to be refactor

I think I should change the implementation. Use tranditional approach instead of speakeasy library.

A cafe generate an OTP key, it store in table Sale. It has expired time. Everytime a student input the key, column OTP (table Sale) will be updated with null value. This can prevent a student input same key multiple times.
