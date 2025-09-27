React
Installation

Open in ChatGPT

​
Requirements
React 18 or higher
TypeScript 5 or higher
​
Installation
Install the Privy React SDK using your package manager of choice:

npm

pnpm

yarn

Report incorrect code

Copy

Ask AI
npm install @privy-io/react-auth@latest
Solana dependencies

---

Setup

Open in ChatGPT

​
Prerequisites
Before you begin, make sure you have set up your Privy app and obtained your app ID from the Privy Dashboard.
Deploying your app across multiple domains or environments? Learn how to use app clients to customize Privy’s behavior for different environments.
​
Initializing Privy
In your project, import the PrivyProvider component and wrap your app with it. The PrivyProvider must wrap any component or page that will use the Privy React SDK, and it is generally recommended to render it as close to the root of your application as possible.
If you’re new to React and using contexts, check out these resources!
Ethereum
Solana

NextJS

Create React App

Report incorrect code

Copy

Ask AI
'use client';

import {PrivyProvider} from '@privy-io/react-auth';

export default function Providers({children}: {children: React.ReactNode}) {
return (
<PrivyProvider
appId="your-privy-app-id"
clientId="your-app-client-id"
config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets'
          }
        }
      }} >
{children}
</PrivyProvider>
);
}
​
Configuration
The PrivyProvider component accepts the following props:
​
appId
stringrequired
Your Privy App ID. You can find this in the Privy Dashboard.
​
clientId
string
(Optional) A client ID to be used for this app client. Learn more about app clients here.
​
config
Object
Configuration options for the Privy SDK.
For more information on the config object, look under React > Advanced for guides like customizing appearance for our UI components and configuring networks.
​
Waiting for Privy to be ready
When the PrivyProvider is first rendered on your page, the Privy SDK will initialize some state about the current user. This might include checking if the user has a wallet connected, refreshing expired auth tokens, fetching up-to-date user data, and more.
It’s important to wait until the PrivyProvider has finished initializing before you consume Privy’s state and interfaces, to ensure that the state you consume is accurate and not stale.
To determine whether the Privy SDK has fully initialized on your page, check the ready Boolean returned by the usePrivy hook. When ready is true, Privy has completed initialization, and your app can consume Privy’s state and interfaces.

Report incorrect code

Copy

Ask AI
import {usePrivy} from '@privy-io/react-auth';

function YourComponent() {
const {ready} = usePrivy();

if (!ready) {
return <div>Loading...</div>;
}

// Now it's safe to use other Privy hooks and state
return <div>Privy is ready!</div>;
}

---

Quickstart

Open in ChatGPT

Learn how to authenticate users, create embedded wallets, and send transactions in your React app

​ 0. Prerequisites
This guide assumes that you have completed the Setup guide.
​

1. Enable a user to log in via email
   This quickstart guide will demonstrate how to authenticate a user with a one time password as an example, but Privy supports many authentication methods. Explore our Authentication docs to learn about other methods such as socials, passkeys, and external wallets to authenticate users in your app.
   To authenticate a user via their email address, use the React SDK’s useLoginWithEmail hook.

Report incorrect code

Copy

Ask AI
import {useLoginWithEmail} from '@privy-io/react-auth';
...
const {sendCode, loginWithCode} = useLoginWithEmail();
Ensure that this hook is mounted in a component that is wrapped by the PrivyProvider. You can use the returned methods sendCode and loginWithCode to authenticate your user per the instructions below.
​
Send an OTP
Send a one-time passcode (OTP) to the user’s email by passing their email address to the sendCode method returned from useLoginWithEmail:

Report incorrect code

Copy

Ask AI
import {useState} from 'react';
import {useLoginWithEmail} from '@privy-io/react-auth';

export default function LoginWithEmail() {
const [email, setEmail] = useState('');
const [code, setCode] = useState('');
const {sendCode, loginWithCode} = useLoginWithEmail();

return (
<div>
<input onChange={(e) => setEmail(e.currentTarget.value)} value={email} />
<button onClick={() => sendCode({email})}>Send Code</button>
<input onChange={(e) => setCode(e.currentTarget.value)} value={code} />
<button onClick={() => loginWithCode({code})}>Login</button>
</div>
);
}
​ 2. Create an embedded wallet for the user
Your app can configure Privy to automatically create wallets for your users as part of their login flow. The embedded wallet will be generated and linked to the user object upon authentication.
Alternatively your app can manually create wallets for users when required.
Privy can provision wallets for your users on both Ethereum and Solana.
​ 3. Send a transaction with the embedded wallet
EVM
Solana
With the users’ embedded wallet, your application can now prompt the user to sign and send transactions.

Report incorrect code

Copy

Ask AI
import {useSendTransaction} from '@privy-io/react-auth';
export default function SendTransactionButton() {
const {sendTransaction} = useSendTransaction();
const onSendTransaction = async () => {
sendTransaction({
to: '0xE3070d3e4309afA3bC9a6b057685743CF42da77C',
value: 100000
});
};

return <button onClick={onSendTransaction}>Send Transaction</button>;
}
Learn more about sending transactions with the embedded wallet. Privy enables you to take many actions on the embedded wallet, including sign a message, sign typed data, and sign a transaction.
Congratulations, you have successfully been able to integrate Privy authentication and wallet into your React application!
Setup

---

Features

Open in ChatGPT

Learn about the features supported by the React SDK

​
Supported features
Authentication
Email ✅
SMS ✅
OAuth ✅
SIWE (Sign In with Ethereum) ✅
SIWS (Sign In with Solana) ✅
Farcaster ✅
Telegram ✅
Custom Auth ✅
Passkeys ✅
Farcaster
SIWF ✅
Embedded Wallets
Creating wallets manually
Creating wallets automatically
Pregenerating wallets
Signing messages and transactions
Broadcasting transactions
Native smart wallets
Automatic recovery
User controlled recovery
Transaction MFA
Key Export
Key Import
HD wallets
Session signers
Global wallets (Cross App Accounts)
Custom EVM (Ethereum) network support
Custom SVM (Solana) network support
Connectors
External wallets
Wagmi
Viem
Ethers
@solana/web3.js
Funding
Transfer or bridge from wallet
Transfer from exchange
Pay with card
