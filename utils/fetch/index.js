import { signOut } from 'next-auth/client';

let defaultFetchHeaders = {
  'Content-type': 'application/json; charset=UTF-8',
};

export const fetcher = async (
  method,
  url,
  params = {},
  mutator,
  overrideHeaders = {}
) => {
  const headers = {
    ...defaultFetchHeaders,
    ...overrideHeaders,
  };

  let response;
  if (method === 'GET') {
    const searchParams = new URLSearchParams(params);
    response = await fetch(`${url}?${searchParams}`, {
      method: 'GET',
      headers,
    });
  } else if (method === 'POST') {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
  } else {
    return;
  }

  // There has been an unauthorized request. Either the user has gotten access to something they aren't allowed to or their auth token
  // is bad or expired. Log them out and kick them back to login screen.
  if (response.status === 401) {
    // TODO: Notify the user in someway that they have been logged out for inactivity.
    signOut();
    return;
  }

  const resp = await response.json();

  return mutator ? mutator(resp) : resp;
};
