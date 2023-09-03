const { faker } = require("@faker-js/faker");

exports.name = faker.person.fullName();
exports.email = faker.internet.email();
exports.address = faker.location.streetAddress();
exports.matricNo = faker.string.numeric(6, {
  allowLeadingZeros: true,
});
exports.phoneNo = faker.phone.number("01########");
exports.icNo = faker.string.numeric(12, {
  allowLeadingZeros: true,
});
exports.b40 = faker.datatype.boolean();
exports.accountNo = faker.finance.accountNumber();
exports.cafeId = faker.internet.userName();
exports.cafeName = `Cafe ${faker.person.firstName()}`;
