## Flux Authentication Guide

By default, Flux ships with a very simple, insecure identity workflow. A user can "login" to Flux by providing an email address. This email address serves as their identity for their session while making posts and comments. However there is no password or email verification, meaning anyone else can also do the same with the same email.

This design is intentional and the only purpose is to allow you and a small team to quickly assess Flux as a product. **Please do not use Flux for confidential, collaborative efforts without first providing your own trusted authentication system.**

### next-auth

Flux is written in NextJS and therefore can benefit from the power of [next-auth](https://next-auth.js.org/). `next-auth` will enable you to provide your own authentication solution(s), you can check out all the supported providers [here](https://next-auth.js.org/configuration/providers).

### Configuring your own Provider

After reading the documentation provided by `next-auth` and once you have decided on which provider(s) you will use, it's time to configure.

#### Remove the default credentials provider

As mentioned above, the default authentication is insecure, it should not even be exposed as an option. The first thing you'll want to do is go to the [API routes file](../pages/api/[...nextauth].js) and remove the `Credentials` provider found there.

#### Add your own provider.

In the same routes file is where you will add your provider(s). Follow the official `next-auth` docs for your chosen provider, or create your own.

#### Create your login form component

The last step is to expose your auth provider to your users by creating the UI form for it. This can be done in 2 steps.

1. In the [authentication/components directory](./authentication/components) add a NextJs component for your provider. It is suggested to copy the existing [provider](./authentication/components/NoAuthEmail.js) and work off of that example. This component should contain the UI and actions required for the style of auth you are performing.

_example1: For the NoAuthEmail provider, a simple email input is exposed and on submit a signIn('credentials') action is fired based off next-auth docs._ _example2: For a Google OAuth provider, you would want to expose a button that when clicked fires a signIn('google') action._

2. Lastly, export the provider component you made in this [file](./components/index.js).

Once complete, the login page will pick up on all provider components in the [authentication/components](./authentication/components) directory and render them.

### Conclusion

We are continuing to work to make configuring authentication simpler. Flux is an open source project and we would appreciate helpful updates to the guide and examples to help others.
