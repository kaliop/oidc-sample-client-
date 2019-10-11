const formatUserInfo = (userInfo, scopes) => {
  const formatted = {};

  if (scopes.includes('openid')) {
    formatted.sub = userInfo.sub;
  }

  if (scopes.includes('profile')) {
    for (const attr of ['family_name', 'given_name', 'birthdate']) {
      formatted[attr] = userInfo[attr];
    }
  }

  if (scopes.includes('email')) {
    formatted.email = userInfo.email;
  }

  if (scopes.includes('phone')) {
    formatted.phone_number = userInfo.phone;
  }

  if (scopes.includes('address')) {
    formatted.address = {};
    for (const attr of ['street_address', 'postal_code', 'locality', 'country']) {
      formatted.address[attr] = userInfo[attr];
    }
  }

  return formatted;
}

module.exports = {
  formatUserInfo,
};
