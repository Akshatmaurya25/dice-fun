Installation

Copy page

Install Wallet SDK using npm or yarn.

npm

Yarn

Bun

pnpm

Copy

Ask AI
npm install @reown/walletkit @walletconnect/utils @walletconnect/core
​
Next Steps
Now that you’ve installed WalletKit, you’re ready to start integrating it. The next section will walk you through the process of setting up your project to use the SDK.
Usag

# Usage

## Overview

WalletConnect makes distributing your Web wallet (such as Safe, Abstract Global Wallet, and many more) much faster. By integrating the Wallet SDK, your web wallet will be able to connect to any dApp that supports WalletConnect and will be available in the list of wallets on both WalletConnect, Reown AppKit, and others.

<Frame caption="Web Wallet in Reown AppKit & WalletButtons">
  <img height="400" width="300" src="https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/web-wallet-safe.png" alt="Web Wallet in Reown AppKit" />

  <img height="600" width="300" src="https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/web-wallet-button.png" alt="Web Wallet in WalletConnect" />
</Frame>

Additionally, you don't need to build SDKs in native languages such as Swift, Kotlin, Flutter, Unity, or React Native. This means your wallet can be available not just for web dApps, but also for native dApps, all from a single codebase.

This section provides instructions on how to initialize the WalletKit client, approve sessions with supported namespaces, and respond to session requests, enabling easy integration of Web3 wallets with dApps through a simple and intuitive interface.

## User Experience

### Default Integration

This integration automatically opens a new web wallet tab when a user clicks "Connect" in a dApp. The wallet handles the WalletConnect URI automatically, meaning users don't need to manually copy and paste the URI. This provides a seamless, one-click connection experience.

<Frame caption="Abstract Global Wallet to Wolfswap">
  <video controls autoPlay className="w-full aspect-video" src="https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/web-wallet-demo.mp4" />
</Frame>

### QR Code Integration

This integration only handles the session proposal and approval via the WalletConnect QR code. The user will need to manually copy and paste the WalletConnect URI into the wallet.

<Frame caption="Safe Wallet Connecting to AppKit Lab">
  <video controls autoPlay className="w-full aspect-video" src="https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/web-wallet-qr-demo.mp4" />
</Frame>

## Cloud Configuration

Create a new project on WalletConnect Dashboard at [https://dashboard.reown.com](https://dashboard.reown.com) and obtain a new project ID.

<Info>
  **Don't have a project ID?**

  Head over to WalletConnect Dashboard and create a new project now!

  <Card title="Get started" href="https://dashboard.reown.com/?utm_source=cloud_banner&utm_medium=docs&utm_campaign=backlinks" />
</Info>

## Initialization

Create a new instance from Core and initialize it with a projectId created from installation. Next, create WalletKit instance by calling init on walletKit. Passing in the options object containing metadata about the app and an optional relay URL.

<Info>
  Make sure you initialize `walletKit` globally and use the same instance for all your sessions. For React-based apps, you can initialize it in the root component and export it to use in other components.
</Info>

```javascript
import { Core } from "@walletconnect/core";
import { WalletKit } from "@reown/walletkit";

const core = new Core({
  projectId: process.env.PROJECT_ID,
});

const walletKit = await WalletKit.init({
  core, // <- pass the shared `core` instance
  metadata: {
    name: "Demo app",
    description: "Demo Client as Wallet/Peer",
    url: "https://reown.com/walletkit",
    icons: [],
  },
});
```

### Core Instance Sharing

Starting from newer versions of WalletKit, Core instances are shared globally by default to optimize resource usage. This means that multiple Core instances with the same configuration will reuse the same underlying Core.

**For parallel testing scenarios** where you need isolated Core instances, you have two options:

#### Option 1: Use customStoragePrefix

```javascript
const core = new Core({
  projectId: process.env.PROJECT_ID,
  customStoragePrefix: `test-${Date.now()}`, // Unique prefix for each test
});
```

<Warning>
  Don't use randomly generated `customStoragePrefix` in production - this will cause the client to create new storage each time it is initialized. The client will not be able to persist/read existing data and all existing sessions will be lost after each reload.
</Warning>

#### Option 2: Disable global Core sharing

```javascript
// Set environment variable before initializing Core
process.env.DISABLE_GLOBAL_CORE = "true";

const core = new Core({
  projectId: process.env.PROJECT_ID,
});
```

<Note>
  The global Core sharing behavior was introduced to prevent resource waste when multiple SDK instances are created. If you're running parallel tests and experiencing cross-test interference, use one of the solutions above to ensure proper test isolation.
</Note>

## Session

A session is a connection between a dapp and a wallet. It is established when a user approves a session proposal from a dapp. A session is active until the user disconnects from the dapp or the session expires.

### Handling Session Proposals

You can connect your web wallet to a dApp in three ways:

1. Retrieve the WC URI from the dApp via query parameters
2. Implement a scanner to read the WC URI from a WalletConnect QR code
3. Allow users to manually enter the WC URI in an input field

When opening the wallet directly from the dApp, the `WC_URI` will be in the following format in the query parameters:

```
{YOUR_WALLET_URL}/wc?uri={WC_URI}
```

We recommend closing the web wallet tab after the user approves the request and redirecting back to the dApp. For web requests, redirect to the original browser tab, and for mobile requests, redirect to the native mobile dApp.

<Note>
  To test your web wallet connection flow, use our [Appkit Laboratory](https://appkit-lab.reown.com/) by adding a custom wallet with your web wallet URL.
</Note>

### Handling Session Requests

When a dApp sends a session request to your wallet, the request will be available in the following format in the query parameters:

```
{YOUR_WALLET_URL}/wc?requestId={requestId}&sessionTopic={session.Topic}
```

This format allows your wallet to identify both the specific request and the session it belongs to.

<Note>
  To test your web wallet connection flow, use our [Appkit Laboratory](https://appkit-lab.reown.com/) by adding a custom wallet with your web wallet URL.
</Note>

### Handling Redirects

When handling redirects after session approval or request completion, you should:

1. For web dApps:
   * Redirect back to the original browser tab using `window.opener.location.href`
   * Close the current wallet tab using `window.close()`

2. For native dApps:
   * Check the peer metadata for a `redirect` URL in the session proposal
   * If available, use deep linking to redirect to the native app
   * If no redirect URL is found, display a "Return to App" message to the user

Example implementation:

```javascript
function handleRedirect(session) {
  // Check if this is a native app
  const isNativeApp = session.peer.metadata.redirect !== undefined;
  
  if (isNativeApp) {
    // Redirect to native app if URL is available
    if (session.peer.metadata.redirect) {
      window.location.href = session.peer.metadata.redirect;
    } else {
      // Show "Return to App" message
      showReturnToAppMessage();
    }
  } else {
    // For web dApps, redirect back to original tab
    if (window.opener) {
      window.opener.location.href = session.peer.metadata.url;
      window.close();
    }
  }
}
```

### Namespace Builder

With WalletKit (and @walletconnect/utils) we've published a helper utility that greatly reduces the complexity of parsing the `required` and `optional` namespaces. It accepts as parameters a `session proposal` along with your user's `chains/methods/events/accounts` and returns ready-to-use `namespaces` object.

```javascript
// util params
{
  proposal: ProposalTypes.Struct; // the proposal received by `.on("session_proposal")`
  supportedNamespaces: Record< // your Wallet's supported namespaces
    string, // the supported namespace key e.g. eip155
    {
      chains: string[]; // your supported chains in CAIP-2 format e.g. ["eip155:1", "eip155:2", ...]
      methods: string[]; // your supported methods e.g. ["personal_sign", "eth_sendTransaction"]
      events: string[]; // your supported events e.g. ["chainChanged", "accountsChanged"]
      accounts: string[] // your user's accounts in CAIP-10 format e.g. ["eip155:1:0x453d506b1543dcA64f57Ce6e7Bb048466e85e228"]
      }
  >;
};
```

Example usage

```javascript
// import the builder util
import { WalletKit, WalletKitTypes } from '@reown/walletkit'
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils'

async function onSessionProposal({ id, params }: WalletKitTypes.SessionProposal){
  try{
    // ------- namespaces builder util ------------ //
    const approvedNamespaces = buildApprovedNamespaces({
      proposal: params,
      supportedNamespaces: {
        eip155: {
          chains: ['eip155:1', 'eip155:137'],
          methods: ['eth_sendTransaction', 'personal_sign'],
          events: ['accountsChanged', 'chainChanged'],
          accounts: [
            'eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb',
            'eip155:137:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb'
          ]
        }
      }
    })
    // ------- end namespaces builder util ------------ //

    const session = await walletKit.approveSession({
      id,
      namespaces: approvedNamespaces
    })
  }catch(error){
    // use the error.message to show toast/info-box letting the user know that the connection attempt was unsuccessful
    ....
    await walletKit.rejectSession({
      id: proposal.id,
      reason: getSdkError("USER_REJECTED")
    })
  }
}


walletKit.on('session_proposal', onSessionProposal)
```

If your wallet supports multiple namespaces e.g. `eip155`,`cosmos` & `near`
Your `supportedNamespaces` should look like the following example.

```javascript
// ------- namespaces builder util ------------ //
const approvedNamespaces = buildApprovedNamespaces({
    proposal: params,
    supportedNamespaces: {
        eip155: {...},
        cosmos: {...},
        near: {...}
    },
});
// ------- end namespaces builder util ------------ //
```

### Get Active Sessions

You can get the wallet active sessions using the `getActiveSessions` function.

```js
const activeSessions = walletKit.getActiveSessions();
```

### EVM methods & events

In @walletconnect/ethereum-provider, (our abstracted EVM SDK for apps) we support by default the following Ethereum methods and events:

```ts
{
  //...
  methods: [
    "eth_accounts",
    "eth_requestAccounts",
    "eth_sendRawTransaction",
    "eth_sign",
    "eth_signTransaction",
    "eth_signTypedData",
    "eth_signTypedData_v3",
    "eth_signTypedData_v4",
    "eth_sendTransaction",
    "personal_sign",
    "wallet_switchEthereumChain",
    "wallet_addEthereumChain",
    "wallet_getPermissions",
    "wallet_requestPermissions",
    "wallet_registerOnboarding",
    "wallet_watchAsset",
    "wallet_scanQRCode",
    "wallet_sendCalls",
    "wallet_getCallsStatus",
    "wallet_showCallsStatus",
    "wallet_getCapabilities",
  ],
  events: [
    "chainChanged",
    "accountsChanged",
    "message",
    "disconnect",
    "connect",
  ]
}
```

### Session Approval

The `session_proposal` event is emitted when a dapp initiates a new session with a user's wallet. The event will include a `proposal` object with information about the dapp and requested permissions. The wallet should display a prompt for the user to approve or reject the session. If approved, call `approveSession` and pass in the `proposal.id` and requested `namespaces`.

The `pair` method initiates a WalletConnect pairing process with a dapp using the given `uri` (QR code from the dapps). To learn more about pairing, checkout out the [docs](/advanced/api/core/pairing).

```javascript
walletKit.on(
  "session_proposal",
  async (proposal: WalletKitTypes.SessionProposal) => {
    const session = await walletKit.approveSession({
      id: proposal.id,
      namespaces,
    });
  }
);
await walletKit.pair({ uri });
```

### 🛠️ Usage examples

* [in a demo wallet app](https://github.com/WalletConnect/web-examples/blob/a50c8eb5a10666f25911713c5358e78f1ca576d6/advanced/wallets/react-wallet-v2/src/views/SessionProposalModal.tsx#L264)
* [in integration tests](https://github.com/reown-com/reown-walletkit-js/blob/main/packages/walletkit/test/sign.spec.ts#L55)

### ⚠️ Expected Errors

* `No matching key. proposal id doesn't exist: 1`

This rejection means the SDK can't find a record with the given `proposal.id` - in this example `1`.
This can happen when the proposal has expired (by default 5 minutes) or if you attempt to respond to a proposal that has already been approved/rejected.
If you are seeing this error, please make sure that you are calling `approveSession` with the correct `proposal.id` that is available within the proposal payload.

* `Error: Missing or invalid. approve(), namespaces should be an object with data`

This error means that the `namespaces` parameter passed to `approveSession` is either missing or invalid. Please check that you are passing a valid `namespaces` object that satisfies all required properties.

* `Non conforming namespaces. approve() namespaces <property> don't satisfy required namespaces.`

This error indicates that some value(s) in your `namespaces` object do not satisfy the required namespaces requested by the dapp.
To provide additional guidance, the message might include info about the exact property that is missing or invalid e.g. `Required: eip155:1 Approved: eip155:137`.
Please check [CAIP-25](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-25.md) to familiarize yourself with the standard and it's nuances.
Additionally, we highly recommend you to use our `namespace` builder utility that would greatly simplify the process of parsing & building a valid `namespaces` object.

### Session Rejection

In the event you want to reject the session proposal, call the `rejectSession` method. The `getSDKError` function comes from the `@walletconnect/utils` [library](https://github.com/WalletConnect/walletconnect-monorepo/tree/v2.0/packages/utils).

```javascript
walletKit.on(
  "session_proposal",
  async (proposal: WalletKitTypes.SessionProposal) => {
    await walletKit.rejectSession({
      id: proposal.id,
      reason: getSdkError("USER_REJECTED_METHODS"),
    });
  }
);
```

### 🛠️ Usage examples

* [in a demo wallet app](https://github.com/WalletConnect/web-examples/blob/a50c8eb5a10666f25911713c5358e78f1ca576d6/advanced/wallets/react-wallet-v2/src/views/SessionProposalModal.tsx#L287)
* [in integration tests](https://github.com/reown-com/reown-walletkit-js/blob/main/packages/walletkit/test/sign.spec.ts#L79)

### ⚠️ Expected Errors

* `No matching key. proposal id doesn't exist: 1`

This rejection means the SDK can't find a record with the given `proposal.id` - in this example `1`.
This can happen when the proposal has expired (by default 5 minutes) or if you attempt to respond to a proposal that has already been approved/rejected.
If you are seeing this error, please make sure that you are calling `rejectSession` with the correct `proposal.id` that is available within the proposal payload.

* `Error: Missing or invalid. reject() reason:`

This rejection means the `reason` parameter passed to `rejectSession` is either missing or invalid.
We recommend using the `getSDKError` function from the `@walletconnect/utils` library that will populate & format the parameter for you.

### Responding to Session requests

The `session_request` event is emitted when the SDK received a request from the peer and it needs the wallet to perform a specific action, such as signing a transaction. The event contains a `topic` and a `request` object, which will vary depending on the action requested.

To respond to the request, you can access the `topic` and `request` object by destructuring them from the event payload. To see a list of possible `request` and `response` objects, refer to the relevant JSON-RPC Methods for [Ethereum](../../advanced/multichain/rpc-reference/ethereum-rpc.md), [Solana](../../advanced/multichain/rpc-reference/solana-rpc.md), [Cosmos](../../advanced/multichain/rpc-reference/cosmos-rpc.md), or [Stellar](../../advanced/multichain/rpc-reference/stellar-rpc.md).

As an example, if the dapp requests a `personal_sign` method, you can extract the `params` array from the `request` object. The first item in the array is the hex version of the message to be signed, which can be converted to UTF-8 and assigned to a `message` variable. The second item in `params` is the user's wallet address.

To sign the message, you can use your wallet's `signMessage` method and pass in the message. The signed message, along with the `id` from the event payload, can then be used to create a `response` object, which can be passed into `respondSessionRequest`.

```javascript
walletKit.on(
  "session_request",
  async (event: WalletKitTypes.SessionRequest) => {
    const { topic, params, id } = event;
    const { request } = params;
    const requestParamsMessage = request.params[0];

    // convert `requestParamsMessage` by using a method like hexToUtf8
    const message = hexToUtf8(requestParamsMessage);

    // sign the message
    const signedMessage = await wallet.signMessage(message);

    const response = { id, result: signedMessage, jsonrpc: "2.0" };

    await walletKit.respondSessionRequest({ topic, response });
  }
);
```

To reject a session request, the response should be similar to this.

```javascript
const response = {
  id,
  jsonrpc: "2.0",
  error: {
    code: 5000,
    message: "User rejected.",
  },
};
```

### 🛠️ Usage examples

* [in a demo wallet app](https://github.com/WalletConnect/web-examples/blob/a50c8eb5a10666f25911713c5358e78f1ca576d6/advanced/wallets/react-wallet-v2/src/views/SessionSignModal.tsx#L36)
* [in integration tests](https://github.com/reown-com/reown-walletkit-js/blob/main/packages/walletkit/test/sign.spec.ts#L165)

### ⚠️ Expected Errors

* `Error: No matching key. session topic doesn't exist: 'xyz...'`

This rejection means the SDK can't find a session with the given `topic` - in this example `xyz...`.
This can happen when the session has been disconnected by either the wallet or the dapp while the session request was being processed or if a session with such topic doesn't exist.
If you are seeing this error, please make sure that you are using a correct topic that is available within the request payload.

* `Error: Missing or invalid. respond() response:`

This rejection means the `response` parameter passed to `respondSessionRequest` is either missing or invalid. The response should be a valid [JSON-RPC 2.0](https://www.jsonrpc.org/specification) response object.
We recommend you to use our `formatJsonRpcResult` utility from `"@walletconnect/jsonrpc-utils"` that will format the response for you.

Example usage:
`id` argument being the request id from the request payload.

```javascript
import { formatJsonRpcResult } from "@walletconnect/jsonrpc-utils";

const signature = await cryptoWallet.signTransaction(signTransaction);
const response = await walletKit.respondSessionRequest({
  topic: session.topic,
  response: formatJsonRpcResult(id, signature),
});
```

### Updating a Session

If you wish to include new accounts or chains or methods in an existing session, `updateSession` allows you to do so.
You need pass in the `topic` and a new `Namespaces` object that contains all of the existing namespaces as well as the new data you wish to include.
After you update the session, the other peer will receive a `session_update` event.

An example adding a new account to an existing session:

```javascript
const namespaces = session.namespaces;
const accounts = [
  "eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",
  "eip155:1:0x1234567890123456789012345678901234567890",
];
const updatedNamespaces = {
  ...namespaces,
  eip155: {
    ...namespaces.eip155,
    accounts,
  },
};
const { acknowledged } = await walletKit.updateSession({
  topic: session.topic,
  namespaces: updatedNamespaces,
});
// If you wish to be notified when the dapp acknowledges the update.
// note that if the dapp is offline `acknowledged` will not resolve until it comes back online
await acknowledged();
```

An example adding a new chain to an existing session:

```javascript
const namespaces = session.namespaces;
const chains = ["eip155:1", "eip155:137"];
const accounts = [
  "eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",
  "eip155:137:0x1234567890123456789012345678901234567890",
];
const updatedNamespaces = {
  ...namespaces,
  eip155: {
    ...namespaces.eip155,
    accounts,
    chains,
  },
};
await walletKit.updateSession({
  topic: session.topic,
  namespaces: updatedNamespaces,
});
```

### 🛠️ Usage examples

* [in a demo wallet app](https://github.com/WalletConnect/web-examples/blob/a50c8eb5a10666f25911713c5358e78f1ca576d6/advanced/wallets/react-wallet-v2/src/pages/session.tsx#L77)
* [in integration tests](https://github.com/reown-com/reown-walletkit-js/blob/main/packages/walletkit/test/sign.spec.ts#L98)

### ⚠️ Expected Errors

Note that all `namespaces` validation applies and you still have to satisfy the required namespaces requested by the dapp.

* `Error: No matching key. session topic doesn't exist: 'xyz...'`

This rejection means the SDK can't find a session with the given `topic` - in this example `xyz...`.
This can happen when the session you're trying to update has already been disconnected by either the wallet or the dapp or if a session with such topic doesn't exist.
If you are seeing this error, please make sure that you are using a correct topic of an active session.

* `Error: Missing or invalid. update(), namespaces should be an object with data`

This error means that the `namespaces` parameter passed to `updateSession` is either missing or invalid. Please check that you are passing a valid `namespaces` object that satisfies all required properties.

* `Non conforming namespaces. update() namespaces <property> don't satisfy required namespaces.`

This error indicates that some value(s) in your `namespaces` object do not satisfy the required namespaces requested by the dapp.
To provide additional guidance, the message might include info about the exact property that is missing or invalid e.g. `Required: eip155:1 Approved: eip155:137`.
Please check [CAIP-25](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-25.md) to familiarize yourself with the standard and it's nuances.
Additionally, we highly recommend you to use our `namespace` builder utility that would greatly simplify the process of parsing & building a valid `namespaces` object.

### Extending a Session

Sessions have a default expiry of 7 days. To extend a session by an additional 7 days, call `.extendSession` method and pass in the `topic` of the session you wish to extend.

```javascript
const { acknowledged } = await walletKit.extendSession({ topic });
// if you wish to be notified when the dapp acks the extend
// note that if the dapp is offline `acknowledged` will not resolve until it comes back online
await acknowledged();
```

### 🛠️ Usage examples

* [in integration tests](https://github.com/reown-com/reown-walletkit-js/blob/main/packages/walletkit/test/sign.spec.ts#L130)

### ⚠️ Expected Errors

* `Error: No matching key. session topic doesn't exist: 'xyz...'`

This rejection means the SDK can't find a session with the given `topic` - in this example `xyz...`.
This can happen when the session you're trying to update has already been disconnected by either the wallet or the dapp or if a session with such topic doesn't exist.
If you are seeing this error, please make sure that you are using a correct topic of an active session.

### Session Disconnect

To initiate disconnect from a session(think session delete), call `.disconnectSession` by passing a `topic` & `reason` for the disconnect.
The other peer will receive a `session_delete` and be notified that the session has been disconnected.

<Note>
  **Note**

  It's important that you're subscribed to the `session_delete` event as well, to be notified when the other peer initiates a disconnect.
</Note>

<Tip>
  We recommend using the `getSDKError` utility function, that will provide ready-to-use `reason` payloads and is available in the `@walletconnect/utils` [library](https://github.com/WalletConnect/walletconnect-monorepo/tree/v2.0/packages/utils).
</Tip>

```javascript
await walletKit.disconnectSession({
  topic,
  reason: getSdkError("USER_DISCONNECTED"),
});
```

### 🛠️ Usage examples

* [in integration tests](https://github.com/reown-com/reown-walletkit-js/blob/main/packages/walletkit/test/sign.spec.ts#L222)

### ⚠️ Expected Errors

* `Error: No matching key. session topic doesn't exist: 'xyz...'`

This rejection means the SDK can't find a session with the given `topic` - in this example `xyz...`.
This can happen when the session you're trying to update has already been disconnected by either the wallet or the dapp or if a session with such topic doesn't exist.
If you are seeing this error, please make sure that you are using a correct topic of an active session.

### Emitting Session Events

To emit session events, call the `emitSessionEvent` and pass in the params. If you wish to switch to chain/account that is not approved (missing from `session.namespaces`) you will have to update the session first. In the following example, the wallet will emit `session_event` that will instruct the dapp to switch the active accounts.

```javascript
await walletKit.emitSessionEvent({
  topic,
  event: {
    name: "accountsChanged",
    data: ["0xab16a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"],
  },
  chainId: "eip155:1",
});
```

In the following example, the wallet will emit `session_event` when the wallet switches chains.

```javascript
await walletKit.emitSessionEvent({
  topic,
  event: {
    name: "chainChanged",
    data: 1,
  },
  chainId: "eip155:1",
});
```
--

# One-click Auth

## Introduction

This section outlines an innovative protocol method that facilitates the initiation of a Sign session and the authentication of a wallet through a [Sign-In with Ethereum](https://eips.ethereum.org/EIPS/eip-4361) (SIWE) message, enhanced by [ReCaps](https://eips.ethereum.org/EIPS/eip-5573) (ReCap Capabilities).

This enhancement not only offers immediate authentication for dApps, paving the way for prompt user logins, but also integrates informed consent for authorization. Through this mechanism, dApps can request the delegation of specific capabilities to perform actions on behalf of the wallet user. These capabilities, encapsulated within SIWE messages as ReCap URIs, detail the scope of actions authorized by the user in an explicit and human-readable form.

By incorporating ReCaps, this method extends the utility of SIWE messages, allowing dApps to combine authentication with a nuanced authorization model. This model specifies the actions a dApp is authorized to execute on the user's behalf, enhancing security and user autonomy by providing clear consent for each delegated capability. As a result, dApps can utilize these consent-backed messages to perform predetermined actions, significantly enriching the interaction between dApps, wallets, and users within the Ethereum ecosystem.

<Frame>
    <img src="https://mintlify.s3.us-west-1.amazonaws.com/test-walletconnect/images/w3w/authenticatedSessions-light.png" alt="" />
</Frame>

## Handling Authentication Requests

To handle incoming authentication requests, subscribe to the `session_authenticate` event. This will notify you of any authentication requests that need to be processed, allowing you to either approve or reject them based on your application logic.

```typescript
walletKit.on("session_authenticate", async (payload) => {
  // Process the authentication request here.
  // Steps include:
  // 1. Populate the authentication payload with the supported chains and methods
  // 2. Format the authentication message using the payload and the user's account
  // 3. Present the authentication message to the user
  // 4. Sign the authentication message(s) to create a verifiable authentication object(s)
  // 5. Approve the authentication request with the authentication object(s)
});
```

## Authentication Objects/Payloads

```typescript
import { populateAuthPayload } from "@walletconnect/utils";

// EVM chains that your wallet supports
const supportedChains = ["eip155:1", "eip155:2", 'eip155:137'];
// EVM methods that your wallet supports
const supportedMethods = ["personal_sign", "eth_sendTransaction", "eth_signTypedData"];
// Populate the authentication payload with the supported chains and methods
const authPayload = populateAuthPayload({
  authPayload: payload.params.authPayload,
  chains: supportedChains,
  methods: supportedMethods,
});
// Prepare the user's address in CAIP10(https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-10.md) format
const iss = `eip155:1:0x0Df6d2a56F90e8592B4FfEd587dB3D5F5ED9d6ef`;
// Now you can use the authPayload to format the authentication message
const message = walletKit.formatAuthMessage({
  request: authPayload,
  iss
});

// Present the authentication message to the user
...
```

## Approving Authentication Requests

<Note>
  **Note**

  1. The recommended approach for secure authentication across multiple chains involves signing a SIWE (Sign-In with Ethereum) message for each chain and account. However, at a minimum, one SIWE message must be signed to establish a session. It is possible to create a session for multiple chains with just one issued authentication object.
  2. Sometimes a dapp may want to only authenticate the user without creating a session, not every approval will result with a new session.
</Note>

```typescript
// Approach 1
// Sign the authentication message(s) to create a verifiable authentication object(s)
const signature = await cryptoWallet.signMessage(message, privateKey);
// Build the authentication object(s)
const auth = buildAuthObject(
  authPayload,
  {
    t: "eip191",
    s: signature,
  },
  iss
);

// Approve
await walletKit.approveSessionAuthenticate({
  id: payload.id,
  auths: [auth],
});

// Approach 2
// Note that you can also sign multiple messages for every requested chain/address pair
const auths = [];
authPayload.chains.forEach(async (chain) => {
  const message = walletKit.formatAuthMessage({
    request: authPayload,
    iss: `${chain}:${cryptoWallet.address}`,
  });
  const signature = await cryptoWallet.signMessage(message);
  const auth = buildAuthObject(
    authPayload,
    {
      t: "eip191", // signature type
      s: signature,
    },
    `${chain}:${cryptoWallet.address}`
  );
  auths.push(auth);
});

// Approve
await walletKit.approveSessionAuthenticate({
  id: payload.id,
  auths,
});
```

## Rejecting Authentication Requests

If the authentication request cannot be approved or if the user chooses to reject it, use the rejectSession method.

```typescript
import { getSdkError } from "@walletconnect/utils";

await walletKit.rejectSessionAuthenticate({
  id: payload.id,
  reason: getSdkError("USER_REJECTED"), // or choose a different reason if applicable
});
```

## Testing One-click Auth

You can use [AppKit Lab](https://appkit-lab.reown.com/library/ethers-siwe/) to test and verify that your wallet supports One-click Auth properly.

<Card title="Test One-click Auth" href="https://appkit-lab.reown.com/library/ethers-siwe/" />


---

# Verify API

Verify API is a security-focused feature that allows wallets to notify end-users when they may be connecting to a suspicious or malicious domain, helping to prevent phishing attacks across the industry.
Once a wallet knows whether an end-user is on uniswap.com or eviluniswap.com, it can help them to detect potentially harmful connections through Verify's combined offering of WalletConnect's domain registry.

When a user initiates a connection with an application, Verify API enables wallets to present their users with four key states that can help them determine whether the domain they’re about to connect to might be malicious.

These are:

<Frame>
  ![Verify Banner](https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/verify-banner.png)
</Frame>

## Disclaimer

Verify API is not designed to be bulletproof but to make the impersonation attack harder and require a somewhat sophisticated attacker. We are working on a new standard with various partners to close those gaps and make it bulletproof.

## Domain risk detection

The Verify security system will discriminate session proposals & session requests with distinct validations that can be either `VALID`, `INVALID` or `UNKNOWN`.

* Domain match: The domain linked to this request has been verified as this application's domain.
  * This interface appears when the domain a user is attempting to connect to has been ‘verified’ in our domain registry as the registered domain of the application the user is trying to connect to, and the domain has not returned as suspicious from either of the security tools we work with. The `verifyContext` included in the request will have a validation of `VALID`.
* Unverified: The domain sending the request cannot be verified.
  * This interface appears when the domain a user is attempting to connect to has not been verified in our domain registry, but the domain has not returned as suspicious from either of the security tools we work with. The `verifyContext` included in the request will have a validation of `UNKNOWN`.
* Mismatch: The application's domain doesn't match the sender of this request.
  * This interface appears when the domain a user is attempting to connect to has been flagged as a different domain to the one this application has verified in our domain registry, but the domain has not returned as suspicious from either of the security tools we work with. The `verifyContext` included in the request will have a validation of `INVALID`
* Threat: This domain is flagged as malicious and potentially harmful.
  * This interface appears when the domain a user is attempting to connect to has been flagged as malicious on one or more of the security tools we work with. The `verifyContext` included in the request will contain parameter `isScam` with value `true`.

### Implementation

To check the Verify API validations and whether or not your user is interacting with potentially malicious app, you can do so by accessing the `verifyContext` included in the request payload.

```javascript
...
walletKit.on("auth_request", async (authRequest) => {
  const { verifyContext } = authRequest
  const validation = verifyContext.verified.validation // can be VALID, INVALID or UNKNOWN
  const origin = verifyContext.verified.origin // the actual verified origin of the request
  const isScam = verifyContext.verified.isScam // true if the domain is flagged as malicious

  // if the domain is flagged as malicious, you should warn the user as they may lose their funds - check the `Threat` case for more info
  if(isScam) {
    // show a warning screen to the user
    // and proceed only if the user accepts the risk
  }

  switch(validation) {
    case "VALID":
      // proceed with the request - check the `Domain match` case for more info
      break
    case "INVALID":
      // show a warning dialog to the user - check the `Mismatch` case for more info
      // and proceed only if the user accepts the risk
      break
    case "UNKNOWN":
      // show a warning dialog to the user - check the `Unverified` case for more info
      // and proceed only if the user accepts the risk
      break
  }
})
```

For live demo examples of the intended Verify API flows, check out our demo apps:

* [Demo Wallet](https://react-wallet.walletconnect.com)
* [Demo App](https://react-app.walletconnect.com/) - you can toggle between the verify states by clicking on the `gear` & selecting the decided Validation before connecting to the wallet
* [Demo Malicious App](https://malicious-app-verify-simulation.vercel.app/) - this app is flagged as malicious and will have the `isScam` parameter set to `true` in the `verifyContext` of the request
---

# Wallet Call API

WalletConnect supports [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792#atomicbatch-capability), which defines new JSON-RPC methods that enable apps to ask a wallet to process a batch of onchain write calls and to check on the status of those calls.
Applications can specify that these onchain calls be executed taking advantage of specific capabilities previously expressed by the wallet; an additional, a novel wallet RPC is defined to enable apps to query the wallet for those capabilities.

* `wallet_sendCalls`: Requests that a wallet submits a batch of calls.
* `wallet_getCallsStatus`: Returns the status of a call batch that was sent via wallet\_sendCalls.
* `wallet_showCallsStatus`: Requests that a wallet shows information about a given call bundle that was sent with wallet\_sendCalls.
* `wallet_getCapabilities`: This RPC allows an application to request capabilities from a wallet (e.g. batch transactions, paymaster communication).

## Usage

<AccordionGroup>
  <Accordion title="wallet_getCapabilities" defaultOpen>
    ## Capabilities in CAIP-25 Connection Requests

    CAIP-25 defines how capabilities can be expressed in wallet-to-dapp connections. These capabilities control how methods like `wallet_sendCalls` behave.

    ### Session Properties

    In a connection request, dapps can request capabilities via `sessionProperties`. These can be universal (across all chains) or chain-specific:

    ```json
    "sessionProperties": {
      "expiry": "2022-12-24T17:07:31+00:00",
      "caip154": {
        "supported": "true"
      },
      "flow-control": {
        "loose": [], 
        "strict": [],
        "exoticThirdThing": []
      },
      "atomic": {
        "status": "supported"
      }
    }
    ```

    ### Scoped Properties

    For chain-specific capabilities, dapps use `scopedProperties`:

    ```json
    "scopedProperties": {
      "eip155:8453": {
        "paymasterService": {
          "supported": true
        },
        "sessionKeys": {
          "supported": true
        }
      },
      "eip155:84532": {
        "auxiliaryFunds": {
          "supported": true
        }
      }
    }
    ```

    ### Wallet Response

    A wallet's response should indicate which capabilities it actually supports, following EIP-5792 and CAIP-25:

    ```json
    "sessionProperties": {
      "expiry": "2022-12-24T17:07:31+00:00",
      "caip154": {
        "supported": "true"
      },
      "flow-control": {
        "loose": ["halt", "continue"],
        "strict": ["continue"]
      },
      "atomic": {
        "status": "ready"
      }
    },
    "scopedProperties": {
      "eip155:1": {
        "atomic": {
          "status": "supported"
        }
      },
      "eip155:137": {
        "atomic": {
          "status": "unsupported"
        }
      },
      "eip155:84532": {
        "eip155:83532:0x0910e12C68d02B561a34569E1367c9AAb42bd810": {
          "auxiliaryFunds": {
            "supported": false
          },
          "atomic": {
            "status": "supported"
          }
        }
      }
    }
    ```

    * Capabilities shared across all address in a namespace can be expressed at top-level
    * Address-specific capabilities can include exceptions to scope-wide capabilities

    ### Atomic Capability

    According to EIP-5792, the `atomic` capability specifies how the wallet will execute batches of transactions. It has three possible values:

    * `supported` - The wallet will execute calls atomically and contiguously
    * `ready` - The wallet can upgrade to support atomic execution pending user approval
    * `unsupported` - The wallet provides no atomicity guarantees

    This capability is expressed per chain and is crucial for determining how `wallet_sendCalls` with `atomicRequired: true` will be handled.

    ### Example

    The `wallet_getCapabilities` method is used to request information about what capabilities a wallet supports. Following EIP-5792, here's how it should be implemented:

    #### Request

    ```json
    {
      "id": 1,
      "jsonrpc": "2.0",
      "method": "wallet_getCapabilities",
      "params": ["0xd46e8dd67c5d32be8058bb8eb970870f07244567", ["0x2105", "0x14A34"]]
    }
    ```

    #### Response

    The wallet should return a response following EIP-5792, where capabilities are organized by chain ID:

    ```json
    {
      "id": 1,
      "jsonrpc": "2.0",
      "result": {
        "0x2105": {
          "atomic": {
            "status": "supported"
          }
        },
        "0x14A34": {
          "atomic": {
            "status": "unsupported"
          }
        }
      }
    }
    ```
  </Accordion>

  <Accordion title="wallet_sendCalls">
    ### Implementation

    When implementing `wallet_sendCalls`, wallets must follow these requirements:

    #### Connection Approval

    * Only approve this method during the connection approval flow if your wallet can implement it correctly
    * Define the `atomic` capability per chain/account in the CAIP-25 response

    #### Request Format

    ```json
    {
      "id": 12345,
      "version": "2.0",
      "method": "wc_sessionRequest",
      "params": {
        "chainId": "caip-2-chain-id",
        "request": {
          "method": "wallet_sendCalls",
          "params": {
            "from": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
            "chainId": "0x01",
            "atomicRequired": true,
            "calls": [
              {
                "to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
                "value": "0x9184e72a",
                "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
              },
              {
                "to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
                "value": "0x182183",
                "data": "0xfbadbaf01"
              }
            ]
          }
        }
      }
    }
    ```

    #### Core Implementation Requirements

    * Execute calls in the exact order specified in the request
    * Do not wait for any calls to be finalized before completing the batch
    * If the user rejects the request, do not send any calls

    #### Atomic Execution Behavior

    When `atomicRequired` is `true`:

    * Execute all calls atomically (either all succeed or none have any effect)
    * Execute all calls contiguously (no other transactions between batch calls)
    * If your wallet can upgrade from `ready` to `supported` atomicity, do so before executing

    When `atomicRequired` is `false`:

    * You may execute calls sequentially without atomicity guarantees
    * You may execute atomically if your wallet supports it
    * You may upgrade to `supported` atomicity and execute atomically

    #### Response Enrichment

    To enhance the user experience and eliminate the need for app switching, wallets can enrich the wallet\_sendCalls response with caip2 id and transactionHash to let the Universal Provider resolve the transaction hash.

    ```json
    {
      "id": "...",
      "capabilities": {
        "caip345": {
          "caip2": "eip155:1",
          "transactionHashes": ["..."],
        }
      }
    }
    ```
  </Accordion>

  <Accordion title="wallet_getCallsStatus">
    ### Example

    To enhance the user experience and eliminate the need for app switching, wallets can enrich the wallet\_sendCalls response with caip2 id and transactionHash to let the Universal Provider resolve the transaction hash.

    To implement this functionality, the response for wallet\_sendCalls should be enriched with capabilities:

    ```json
    {
      "id": "...",
      "capabilities": {
        "caip345": {
          "caip2": "eip155:1",
          "transactionHashes": ["..."],
        }
      }
    }
    ```

    Specify the `scopedProperties` when approving a session:

    ```json
    "scopedProperties": {
      "eip155": {
        "walletService": [{
          "url": "<wallet service URL>",
          "methods": ["wallet_getCallsStatus"]
        }]
      }
    }
    ```

    ### Response Format

    The response format for `wallet_getCallsStatus` varies based on the execution method:

    #### For Atomic Execution

    ```json
    {
      "receipts": [/* single receipt or array of receipts */],
      "atomic": true
    }
    ```

    #### For Non-Atomic Execution

    ```json
    {
      "receipts": [/* array of receipts for all transactions */],
      "atomic": false
    }
    ```

    <Note>
      For non-atomic execution, include all transactions in the receipts array, even those that were included on-chain but eventually reverted.
    </Note>
  </Accordion>
</AccordionGroup>

## References

* EIP-5792: [https://eips.ethereum.org/EIPS/eip-5792#atomicbatch-capability](https://eips.ethereum.org/EIPS/eip-5792#atomicbatch-capability)
* CAIP-25 namespaces: [https://github.com/ChainAgnostic/namespaces/blob/main/eip155/caip25.md](https://github.com/ChainAgnostic/namespaces/blob/main/eip155/caip25.md)
---

    # Chain Abstraction

<Info>
  💡 Chain Abstraction is in early access.
</Info>

Chain Abstraction in WalletConnect Wallet SDK enables users with stablecoins on any network to spend them on-the-fly on a different network. Our Chain Abstraction solution provides a toolkit for wallet developers to integrate this complex functionality using Wallet SDK.

For example, when an app requests a 100 USDC payment on Base network but the user only has USDC on Arbitrum, Wallet SDK offers methods to detect this mismatch, generate necessary transactions, track the cross-chain transfer, and complete the original transaction after bridging finishes.

## How It Works

<Info>
  Apps need to pass `gas` as null, while sending a transaction to allow proper gas estimation by the wallet. Refer to this [guide](../../../appkit/next/early-access/chain-abstraction) for more details.
</Info>

When sending a transaction, you need to:

1. Check if the required chain has enough funds to complete the transaction
2. If not, use the `prepare` method to generate necessary bridging transactions
3. Sign routing and initial transaction hashes, prepared by the prepare method
4. Use `execute` method to broadcast routing and initial transactions and wait for it to be completed

The following sequence diagram illustrates the complete flow of a chain abstraction operation, from the initial dapp request to the final transaction confirmation

<Frame caption="Chain Abstraction Flow">
  <img src="https://mintcdn.com/test-walletconnect/-Ka0aJtTgliZnNlz/images/chain-abstraction-sequence.png?fit=max&auto=format&n=-Ka0aJtTgliZnNlz&q=85&s=cdf7a83ec44a6f01df1ead42d9beb04d" data-og-width="741" width="741" data-og-height="780" height="780" data-path="images/chain-abstraction-sequence.png" data-optimize="true" data-opv="2" srcset="https://mintcdn.com/test-walletconnect/-Ka0aJtTgliZnNlz/images/chain-abstraction-sequence.png?w=280&fit=max&auto=format&n=-Ka0aJtTgliZnNlz&q=85&s=20606c08a9227295bae1daa7bbdba650 280w, https://mintcdn.com/test-walletconnect/-Ka0aJtTgliZnNlz/images/chain-abstraction-sequence.png?w=560&fit=max&auto=format&n=-Ka0aJtTgliZnNlz&q=85&s=0dc53f7cccfe37a2355bd2866c0c9330 560w, https://mintcdn.com/test-walletconnect/-Ka0aJtTgliZnNlz/images/chain-abstraction-sequence.png?w=840&fit=max&auto=format&n=-Ka0aJtTgliZnNlz&q=85&s=b46e4cf6572d801d327a58cabf0df079 840w, https://mintcdn.com/test-walletconnect/-Ka0aJtTgliZnNlz/images/chain-abstraction-sequence.png?w=1100&fit=max&auto=format&n=-Ka0aJtTgliZnNlz&q=85&s=37f5591e2c04f024f6633a796ab40611 1100w, https://mintcdn.com/test-walletconnect/-Ka0aJtTgliZnNlz/images/chain-abstraction-sequence.png?w=1650&fit=max&auto=format&n=-Ka0aJtTgliZnNlz&q=85&s=3c0477807a721784acea3e996cf3d971 1650w, https://mintcdn.com/test-walletconnect/-Ka0aJtTgliZnNlz/images/chain-abstraction-sequence.png?w=2500&fit=max&auto=format&n=-Ka0aJtTgliZnNlz&q=85&s=ec0c479b952e0b4eacafb2e049a4b592 2500w" />
</Frame>

## Methods

<Info>
  Make sure you are using canary version of `@reown/walletkit`.
</Info>

Following are the methods from WalletKit that you will use in implementing chain abstraction.

### Prepare

This method checks if a transaction requires additional bridging transactions beforehand.

```typescript
public abstract prepare(params: {
  transaction: ChainAbstractionTypes.PartialTransaction;
}): ChainAbstractionTypes.PrepareResponse;
```

### Execute

Helper method used to broadcast the bridging and initial transactions and wait for them to be completed.

```typescript
public abstract execute(params: {
  orchestrationId: ChainAbstractionTypes.OrchestrationId;
  bridgeSignedTransactions: ChainAbstractionTypes.SignedTransaction[];
  initialSignedTransaction: ChainAbstractionTypes.SignedTransaction;
}): ChainAbstractionTypes.ExecuteResult;
```

## Usage

When sending a transaction, first check if chain abstraction is needed using the `prepare` method.
If it is needed, you must sign all the fulfillment transactions and use the `execute` method.
Here's a complete example:

```typescript
// Check if chain abstraction is needed
const result = await walletKit.chainAbstraction.prepare({
  transaction: {
    from: transaction.from as `0x${string}`,
    to: transaction.to as `0x${string}`,
    // @ts-ignore - cater for both input or data
    input: transaction.input || (transaction.data as `0x${string}`),
    chainId: chainId,
  },
});

// Handle the prepare result
if ('success' in result) {
  if ('notRequired' in result.success) {
    // No bridging required, proceed with normal transaction
    console.log('no routing required');
  } else if ('available' in result.success) {
    const available = result.success.available;
    
    // Sign all bridge transactions and initial transaction
    const bridgeTxs = available.route.map(tx => tx.transactionHashToSign);
    const signedBridgeTxs = bridgeTxs.map(tx => wallet.signAny(tx));
    const signedInitialTx = wallet.signAny(available.initial.transactionHashToSign);

    // Execute the chain abstraction
    const result = await walletKit.chainAbstraction.execute({
      bridgeSignedTransactions: signedBridgeTxs,
      initialSignedTransaction: signedInitialTx,
      orchestrationId: available.routeResponse.orchestrationId,
    });
  }
}
```

For example, check out implementation of chain abstraction in [sample wallet](https://github.com/reown-com/web-examples/tree/main/advanced/wallets/react-wallet-v2) built with React.

## Error Handling

When implementing Chain Abstraction, you may encounter different types of errors. Here's how to handle them effectively:

### Application-Level Errors

These errors (`PrepareError`) indicate specific issues that need to be addressed and typically require user action:

* **Insufficient Gas Fees**: User needs to add more gas tokens to their wallet
* **Malformed Transaction Requests**: Transaction parameters are invalid or incomplete
* **Minimum Bridging Amount Not Met**: Currently set at \$0.60
* **Invalid Token or Network Selection**: Selected token or network is not supported

When handling these errors, you should display clear, user-friendly error messages that provide specific guidance on how to resolve the issue. Allow users to modify their transaction parameters and consider implementing validation checks before initiating transactions.

### Retryable Errors

These errors (`Result::Err`) indicate temporary issues that may be resolved by retrying the operation.
Examples of these types of issues include network connection timeouts, TLS negotiation issues, service outages, or other transient errors.

For retryable errors, show a generic "oops" message to users and provide a retry button. Log detailed error information to your error tracking service, but avoid displaying technical details to end users.

<Note>
  For errors in the `execute()` method, a retry may not resolve the issue. In such cases, allow users to cancel the transaction, return them to the application, and let the application initiate a new transaction.
</Note>

### Critical Errors

Critical errors indicate bugs or implementation issues that should be treated as high-priority incidents: incorrect usage of WalletKit API, wrong data encoding or wrong fields passed to WalletKit, or WalletKit internal bugs.

## Testing

To test Chain Abstraction, you can use the [AppKit laboratory](https://appkit-lab.reown.com/library/wagmi/) and try sending [USDC/USDT](../../../wallet-sdk/features/chain-abstraction#what-are-the-supported-tokens-and-networks%3F) with any chain abstraction supported wallet.
You can also use this [sample wallet](https://react-wallet.walletconnect.com) for testing.

<video controls autoPlay width="100%" height="100%" style={{ borderRadius: '10px' }}>
  <source src="https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/assets/chain-abstraction-demo.mp4" type="video/mp4" />
</video>

---

# Best Practices

The purpose of this guide is to show the best practices in regards of the WalletKit client usage. The goal is to provide the best user experience that just works in every circumstances.

<Info>
  In order to ensure the best user experience and flawless connection flow, please make sure that WalletKit is initialized immediately after your app launch, especially if launched via a WalletConnect Deep Link. It guarantees that websocket connection is opened immediately and all requests are received by your wallet
</Info>

## Pairing

A pairing is a connection between a wallet and a dapp that has fixed permissions to only allow a dapp to propose a session through it. Dapp can propose infinite number of sessions on one pairing. Wallet must use a pair method from WalletKit client to pair with dapp.

```typescript
const uri = 'xxx'; // pairing uri
try {
    await walletKit.pair({ uri });
} catch (error) {
    // some error happens while pairing - check Expected errors section
}
```

### Pairing Expiry

A pairing expiry event is triggered whenever a pairing is expired. The expiry for inactive pairing is 5 mins, whereas for active pairing is 30 days. A pairing becomes active when a session proposal is received and user successfully approves it. This event helps to know when given pairing expires and update UI accordingly.

```typescript
core.pairing.events.on("pairing_expire", (event) => {
    // pairing expired before user approved/rejected a session proposal
    const { topic } = topic;
});
```

### Expected User flow

### Pairing Flow

<Frame>
  <img className="rounded-lg" src="https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/assets/pairing.gif" style={{ width: '75%', height: '100%' }} />
</Frame>

### Pairing Error

<Frame>
  <img className="rounded-lg" src="https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/assets/pairing_error.gif" style={{ width: '75%', height: '100%' }} />
</Frame>

### Expected Errors

While pairing the following errors might occur:

* No Internet connection error or pairing timeout when scanning QR with no Internet connection
  * User should pair again with Internet connection
* Pairing expired error when scanning a QR code with expired pairing
  * User should refresh a QR code and scan again
* Pairing with existing pairing is not allowed
  * User should refresh a QR code and scan again. I usually happens when user scans an already paired QR code.

## Session Proposal

A session proposal is a handshake sent by a dapp and it's purpose is to define a session rules. Whenever a user wants to establish a connection between a wallet and a dapp, one should approve a session proposal.

### User Action Feedback

Whenever user approves or rejects a session proposal, wallet should show loading indicators in a moment of the button press until Relay acknowledgement is received for any of this actions.

Approving session

```typescript
    try {
        await walletKit.approveSession(params);
        // update UI -> remove the loader
    } catch (error) {
        // present error to the user
    }
```

Rejecting session

```typescript
    try {
        await walletKit.rejectSession(params);
        // update UI -> remove the loader
    } catch (error) {
        // present error to the user
    }
```

### Session Proposal Expiry

A session proposal expiry is 5 mins. It means a given proposal is stored for 5 mins in the SDK storage and user has 5 mins for approval or rejection decision. After that time the below event is emitted and proposal modal should be removed from the app's UI.

```typescript
walletKit.on("proposal_expire", (event) => {
    // proposal expired and any modal displaying it should be removed
    const { id } = event;
});
```

### Expected User flow

### Approve or Reject Session Proposal

<Frame>
  <img className="rounded-lg" src="https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/assets/pairing.gif" style={{ width: '75%', height: '100%' }} />
</Frame>

### Error Handling

<Frame>
  <img className="rounded-lg" src="https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/assets/proposal_error.gif" style={{ width: '75%', height: '100%' }} />
</Frame>

### Expected Errors

While approving or rejecting a session proposal the following errors might occurs:

* No Internet connection
  * It happens when a user tries to approve or reject session proposal with no Internet connection
* Session proposal expired
  * It happens when users tries to approve or reject expired session proposal
* Invalid namespaces
  * It happens when a validation of session namespaces fails
* Timeout
  * It happens when Relay doesn't acknowledge session settle publish within 10s

## Session Request

A session request represents the request sent by a dapp to a wallet.

### User Action Feedback

Whenever user approves or rejects a session request, wallet should show loading indicators in a moment of the button press until Relay acknowledgement is received for any of this actions.

```typescript
    try {
        await walletKit.respondSessionRequest(params);
        // update UI -> remove the loader
    } catch (error) {
        // present error to the user
    }
```

### Session Request Expiry

A session request expiry is defined by a dapp. It's value must be between now() + 5mins and now() + 7 days. After the session request expires the below event is emitted and session request modal should be removed from the app's UI.

```typescript
walletKit.on("session_request_expire", (event) => {
    // request expired and any modal displaying it should be removed
    const { id } = event;
});
```

### Expected User flow

### Approve or Reject Session Proposal

<Frame>
  <img className="rounded-lg" src="https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/assets/session_request.gif" style={{ width: '75%', height: '100%' }} />
</Frame>

### Error Handling

<Frame>
  <img className="rounded-lg" src="https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/assets/session_request_error.gif" style={{ width: '75%', height: '100%' }} />
</Frame>

### Expected Errors

While approving or rejecting a session request the following error might occur:

* Invalid session
  * This error might happen when user approves or rejects a session request on expired session
* Session request expired
  * This error might happen when user approves or rejects a session request that already expires
* Timeout
  * It happens when Relay doesn't acknowledge session settle publish within 10s

## Web Socket Connection State

The Web Socket connection state tracks the connection with the relay server, event is emitted whenever a connection state changes.

```typescript
core.relayer.on("relayer_connect", () => {
    // connection to the relay server is established
})

core.relayer.on("relayer_disconnect", () => {
// connection to the relay server is lost
})

```

### Expected User flow

### Connection State

<Frame>
  ![](https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/assets/connection_state.gif)
</Frame>

