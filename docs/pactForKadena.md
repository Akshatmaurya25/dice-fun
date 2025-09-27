Smart contract development
Kadena Developer documentation is organized into three main content areas:

The Smart contracts portion of the documentation is all about learning to write smart contracts and build applications using the Pact smart contract programming language for the Kadena blockchain network. This part of the documentation provides explanations and examples that describe programming language features, introduce Pact-specific concepts and terminology, and expose common programming patterns to help you design and build robust and secure applications.
The Reference portion of the documentation provides complete reference information for the Pact programming language—including syntax, keywords, and built-in functions—and the command-line interfaces you can use to interact with Pact smart contracts and the Kadena blockchain in a development, test, or production environment.
The Coding projects portion of the documentation provides you with opportunities to apply the information covered in Smart contracts to sample projects with hands-on coding challenges.
Get started with Pact
In Get started, you'll get an introduction to smart contract development, Pact design principles, and how to navigate the documentation. After the introduction, topics align loosely with the software development life cycle, moving from basic concepts and simple examples to more complex topics as you explore Pact language features and common coding patterns. At a high level, topics are organized to cover the following stages of the software development life cycle:

Learn the fundamentals of the programming language.
Build programs with common core components like functions and tables.
Test and debug your code to verify and improve its functionality.
Iterate and update code when changes are required.
Integrate user experiences and frontend frameworks.
Deploy smart contracts for further testing or into production.
Reference
The Reference content area is where you'll find the information you most frequently need to look up. For example, the Reference content area contains the descriptions and examples for all of the Pact built-in functions. In general, reference information is organized alphabetically and easiest to find by using Search.

Coding projects
The Coding projects content area provides instructional material for working with the sample projects located in the pact-coding-projects repository. The topics that correspond with the sample projects illustrate concepts in action and complement explanation topics with hands-on exercises and coding challenges. The projects themselves highlight common use cases that can be adapted to many scenarios or extended to address new use cases.

---

Get started: An Introduction to Pact
This part of the Kadena developer documentation is focused on writing smart contracts and developing applications to run on a blockchain. To get started, it's important to know what smart contracts are and the kinds of challenges that you might face in writing them.

Smart contracts
A smart contract is a program that can automatically execute agreements—in the form of transactions—on the blockchain without any external oversight. The contract ensures that the specific conditions, defined in the code logic to describe the terms of the agreement, are met before executing the transaction programmatically. Smart contracts are deployed and executed on blockchain networks because the blockchain provides a decentralized, immutable, and publicly accessible record of all transactions. This transparency and traceability ensures that the programmatic execution of the contract can be considered trustworthy and verifiable.

However, there are several unique challenges involved in writing smart contracts. For example, it's important to ensure that smart contracts can't be accessed by unauthorized parties, that transactions can't be intercepted or manipulated, and that code execution and data storage don't overload blockchain resources.

Because a blockchain is a resource-constrained environment, it's particularly important for smart contracts to perform well even when network activity is at its peak. For example, if the code in a smart contract isn't efficient, it can be costly to execute the contract functions. Inefficient code can also delay transaction execution and block validation, affecting the throughput for the entire blockchain network.

If a smart contract performs unbounded operations, excessive looping, or recursion, the contract might strain or overload the computational capacity that the blockchain has access to. In worst case scenarios, bugs in a smart contract can result in lost funds for participants or stall the progress of the blockchain.

With these challenges and risks in mind, you can see why it's important to avoid common pitfalls and write smart contracts that execute transactions efficiently and securely.

Pact smart contracts
Pact is an open-source programming language designed specifically for writing smart contracts and developing applications to run on a blockchain. Pact was built to help developers create programs that overcome the challenges associated with writing smart contracts.

Pact reflects many of the same approaches to writing smart contracts that are used in other programming languages—such as Solidity or Rust—but with a goal of making contracts less error-prone and less vulnerable to exploits and attacks. Pact is similar to many general purpose languages in its syntax, function declarations, module definitions, and imperative style. However, Pact has several features that make it a safe and performant language for blockchain applications, including the following:

Pact supports a straight-forward database model for storing and manipulating state using database schemas and tables.
Pact contracts can be written and deployed using composable modules, enabling you to iterate, update, and upgrade contract functionality when needed.
Pact limits computational overhead by preventing unbound looping and recursion at the language level.
Pact code is designed to provide transparency that can be inspected in plain text as part of the public record.
Pact transactions can be executed in a single step or as a sequence of steps guaranteed to be executed in a specific order.
These features and constraints reduce the risks of writing faulty smart contract code, limit costly performance bottlenecks, and improve readability and reliability of programs running on the blockchain. You'll learn about these language features and more as you progress through the Smart contracts topics.

Writing contracts in other languages
It's possible to write contracts in other languages, as long as the transactions conform to the expected message format when submitted to a Chainweb node. For example, it's possible to write programs using JavaScript, TypeScript, or Python to emulate Pact smart contracts. However, Pact provides many built-in features and native functions that make smart contract development more efficient and produce more readable results without requiring external libraries to construct compatible commands.

Navigating documentation and resources
The Smart contracts documentation is for programmers and non-programmers interested in learning how to write programs using the Pact smart contract programming language. This part of the documentation is focused on language features and examples.

How the documentation is organized
In addition to the language-focused topics in Smart contracts, Kadena developer documentation includes the following top-level sections:

The How-to guides provide examples of the different ways you can perform common tasks. You can use these guides as a quick reference when working with accounts, transactions, or contracts to see instructions for tasks like creating an account, submitting a transaction, or calling a contract function.

Under API, you'll find reference information for the Pact, Peer-to-Peer, and Service REST API endpoints, including query parameters, request and response schemas, and call examples.

The Reference section provides reference information for the Pact programming language—including syntax, keywords, and built-in functions—and the command-line interfaces you can use to interact with Pact smart contracts and the Kadena blockchain in a development, test, or production environment.

In Coding projects, you'll find companion documentation for the sample projects located in the pact-coding-projects repository.

Under Resources, there are links to additional resources, such as the Kadena video library, contributor guidelines, and other tools and projects.

Documentation conventions
The following conventions are used in the Kadena documentation:

Fixed-width font is used for inline sample code, program names, program output, file names, and commands that you type at the command line.
Bold type is used to highlight menus, commands, buttons, or user interface elements, and to introduce new terms.
Italic type is used for titles, to emphasize specific words, or to indicate variables for which you should substitute an appropriate value.
Square brackets ([ ]) indicate optional arguments in command reference or list data types in the Pact language reference.
Curly braces () indicate objects with key-value pairs in the Pact language reference.
Vertical bars (|) separate alternative values from which you must make a selection.
An ellipsis (...) indicates that the preceding element can be repeated.
The generic data type <a> is used if an argument represents a type-bound parameter.
Contributing to documentation or code
As a member of the Kadena community, you are invited and encouraged to contribute to Kadena technical documentation and to the Kadena project code base. There are a lot of ways to get involved. For example, you can contribute by:

Submitting issues.
Offering suggestions for improvements to existing content.
Adding review comments to existing pull requests.
Proposing new content.
Creating new pull requests to fix issues yourself.
Creating pull request for new content other community members might find useful.
We value, respect, and appreciate all contributions from the developer community and only ask that you agree to abide by our Code of conduct and Community guidelines.

Contribute to documentation
Kadena documentation is open source and hosted on GitHub in the kadena-docs repository. To report an issue or make a documentation request, open a New Issue and add the documentation label to it. If you have a GitHub account and want to suggest changes to the documentation, create a branch and open a pull request as described in Contribute to documentation.

For details about getting started as a contributor to documentation, see How to contribute to Kadena documentation. For recommendation regarding writing style, documentation conventions, and topic templates, see the Writer's style guide.

Contribute to the codebase
The Kadena codebase is open source and hosted on GitHub in repositories under two organizations: kadena-io and kadena-community.

Repositories in kadena-io are focused on the Kadena network infrastructure and foundational components like chainweb-node and pact.

Repositories in kadena-community are focused on tooling and projects to help developers build applications on the Kadena network like the TypeScript libraries in kadena.js.

For details about getting started as a contributor, see How to contribute as a developer.

---


Basic concepts
The main purpose of a blockchain is to record transactions. Typically, transactions are business events that transfer some form of digital asset from one owner or entity to another. Through the use of modern cryptography, a blockchain can provide guarantees about the authenticity and integrity of the transactions recorded without relying on any central authority or under the control of any government, corporation, or other institution.

The decentralized nature of the blockchain depends on having its computational resources distributed across many individual computers. The individual computers in the network—called nodes—run the blockchain software and communicate with each other as a peer-to-peer (P2P) network using the internet and publicly-accessible IP addresses. Nodes provide the bandwidth, processors, memory, and storage capacity to handle incoming transaction requests and validate the transactions results that change the blockchain state.

Consensus models
The method that a blockchain uses to validate transactions, insert transactions into blocks, and submit blocks to continue the chain is called its consensus model or consensus algorithm. For the Kadena blockchain, the method of adding new blocks to the blockchain is a variation of a proof of work consensus model used by Bitcoin. With the proof-of-work consensus model, the first node to solve a computational problem for a transaction adds the transaction to a block. As new transactions are added to blocks and new blocks are produced, all of the nodes in the network attempt to stay in sync with each other so that there's a consistent view of the blockchain state.

The computers used to solve the mathematical problems that validate transactions typically run specialized hardware and are commonly referred to as miners because they earn rewards for the work they do to keep the chain going. The rewards take the form of KDA tokens that are deposited in accounts owned by the node operators. The Kadena proof-of-work consensus model is unique in its use of multiple chains to support horizontal scaling and in the use of degree and diameter network design to identify adjacent peers.

Chainweb and parallel chains
Networks that rely on a proof-of-work consensus model provide security and decentralization, but are often limited by scalability issues, including:

The number of transactions they can process.
The speed at which they can process transactions.
The energy consumption required to validate transactions.
The high cost of transaction fees when the network is busy.
These factors have limited the effectiveness of blockchain networks to handle modern economic activity.

The Kadena proof-of-work consensus model is designed to address these scalability issues and deliver a blockchain built for business. The core of the Kadena blockchain is defined in its Chainweb architecture. The Chainweb architecture is based on a proof-of-work consensus model, but introduces the concept of parallel blockchains to minimize latency and maximize throughput. The parallel chains are connected through peer nodes in an adjacency graph that makes efficient use of cross-chain hops for transaction execution and validation. The optimized network connections enable the chains to operate simultaneously to increase transaction processing capacity and reduce transaction costs across all of the chains in the network.

The nodes that participate in the network run chainweb-node software to communicate as a peer-to-peer network and to execute transactions. Each parallel chain includes block hashes (Merkle roots) from blocks on peer chains into their headers. By referencing block hashes from peer chains, each chain can validate the consistency of its peer chains and provide a trustless oracle for cross-chain transfers of funds. With this mechanism, the chains are braided together into a single canonical chain that offers an effective hash power that is the sum of the hash rate of each individual chain.

Each chain in the network mints its own coin, but all of the chains use same cryptocurrency. Because the chains share a common currency, coins can be transferred cross-chain using a trustless, two-step simple payment verification (SPV) at the smart contract level.

Applications and smart contracts
Applications that run on a blockchain—often referred to as decentralized applications or dApps—are typically web applications that are written using frontend frameworks like React, Angular, Vue, or Next.js but depend on backend smart contracts to capture, store, modify, and read application data.

A smart contract is a program that executes specific instructions under specific conditions that can be programmatically-enforced to ensure that the outcome is recorded and immutable. Smart contracts can be written in different languages for different blockchain networks. For the Kadena network, most smart contracts are written using the Pact smart contract programming language. Pact has several key features that make it well-suited to writing business applications that run as smart contracts on the Kadena network and Chainweb nodes.

Namespaces and modules
Two important concepts in Pact are namespaces and modules. A namespace is a logical ownership boundary for smart contracts that are controlled by a specific entity. Smart contracts include a namespace declaration to provide a unique prefix for everything—including modules, functions, keysets, and interfaces—that are defined within the namespace scope. The root namespace in the Kadena test and main networks is reserved for built-in contracts like the coin contract. You can't deploy contracts directly in the unpartitioned root namespace. However, Kadena provides the free namespace and the user namespace as publicly-accessible namespaces for testing and training purposes. For local development, you can deploy contracts directly in the local root namespace or define custom namespaces. For public blockchains like the Kadena test and main networks, you must define and register custom namespaces for your projects.

Within a namespace, modules are the fundamental building blocks that provide the logic used in all Pact smart contracts. All of the functions and data definitions that are required to complete a set of related business operations are defined within the context of a module. Individual modules are often self-contained logical units that implement a related set of functions.

Keysets, capabilities, and guards
Keysets define authorization rules for smart contracts. They often determine who can access specific functions in a program and the keys required to sign specific transactions. Capabilities define specific privileges or permissions that must be granted or acquired to perform specific operations within a section of code. Guards provide a way to enforce specific conditions, including that a required keyset is being used or a specific capability token has been granted. A keyset is itself a type of guard.

Cross chain and multi-step transactions
Pact supports cross-chain and multi-step transactions by enabling you to define a sequence of steps in a defpact declaration. With a defpact declaration, you can emulate an escrow service or orchestrate a process that must be completed in a specific order.

Execution modes
Pact is designed to use distinct execution modes to address the performance requirements of rapid linear execution on a blockchain. These execution modes are:

Contract deployment.
Transaction execution.
Queries and local execution.
Contract deployment
When a contract is deployed, the deployment transaction that's sent to the blockchain is comprised of modules, tables, and authorization data. The transaction can also include code that modifies the database, for example, to initialize information that the contract requires. As a general rule, the transaction that you use to deploy a contract on the blockchain should be sent as a single message, so that any error will rollback the entire smart contract as a unit.

When contracts are initialized on the blockchain, they identify a namespace that provides context for the contract code and a unique prefix for modules and interfaces defined in the contract. Modules contain the main business logic for the application or service you want to deploy. Interfaces provide access to constant definitions and typed function signatures that are defined outside of a module to be implemented and used in a module. Deploying a contract also requires you to define one or more authorization keysets that have administrative control over the contract modules and tables. Keysets that are defined as data in the runtime environment are then stored in the global keyset database.

After setting the runtime context, Pact executes the module and interface declarations and creates required tables to complete the contract deployment.

Transaction execution
Most of the transactions executed on the blockchain are intended to record business events. For example, business events often involve the handling of assets, payments, ownership transfers, or the completion of contractual agreements. These types of transactions are typically executed using a single call to a specific module function. However, there is no limit on the number statements you can execute in a transaction and you can define transactions that are executed as a sequence of steps. Note that the difference between transaction execution and contract deployment is simply the kind of code executed. There's no difference in how the code itself is evaluated.

Queries and local execution
In general, querying data that's stored on the blockchain isn't considered a business event where execution and performance are more critical. In addition, queries can often involve larger data payloads that could introduce overhead, bandwidth, and latency issues. To reduce the impact of queries on network operations, queries are handled as local execution requests on the node receiving the message. Historical queries use a transaction hash as a point of reference to avoid race conditions and to allow asynchronous query execution.

Pact code doesn't distinguish between transactional execution and local execution. However, the Pact API provides separate endpoints to execute transactions on the blockchain and submit local execution requests. For more information about using the Pact API endpoints, see Pact API.

---

Accounts, keys, and principals
With most blockchains, accounts and account addresses that can send and receive funds are based on generating public and secret key pairs then using your public key as your account name. This “one-to-one” model keeps things simple, but runs into problems when you want to use multiple keys for a single account. For example, you might want an account to represent joint-ownership for partners in a relationship or the officers in a board of directors who must approve expenditures by a majority vote.

To handle situations where an account must represent more than one owner, Kadena makes a distinction between keys and accounts. This distinction enables multiple keys to be associated with the same account name.

In simple terms, an account name is a unique name on the blockchain that can hold funds with one or more public and secret key pairs that grant access to the account. The keys determine ownership of an account. The rules for how many keys are required to act on behalf of the account are defined in a construct called a keyset.

Defining a keyset
A keyset is a specific type of guard that consists of one or more public keys and a predicate function that specifies how many of the keys are required to perform an operation. In JSON, a keyset object looks similar to the following example:

{
  "keys": [
    "1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4",
    "4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0",
    "58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c"
    ],
  "pred": "keys-any"
}

In this keyset, there are three public keys defined as owners associated with this keyset. The predicate function of keys-any means that any of the three public keys can sign transactions and act on the behalf of the account associated with this keyset. To make this keyset usable for practical purposes in a smart contract, it's assigned a name. You can then reference the name to check whether an action is valid by verifying at least one (keys-any) of these three public keys has authorized it.

{
  "my-keyset-name": {
    "keys": [
      "1d5a5e10eb15355422ad66b6c12167bdbb23b1e1ef674ea032175d220b242ed4",
      "4fe7981d36997c2a327d0d3ce961d3ae0b2d38185ac5e5cd98ad90140bc284d0",
      "58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c"
    ],
    "pred": "keys-any"
  }
}

In this example, you evaluate the keyset name my-keyset-name and, if the result is true, allow the action to be performed.

Defining accounts
Keysets are important because they are one part what it takes to define an account. An account is an entry in the Kadena coin contract, the ledger that keeps track of all transfers from one account to another. In the coin contract, an account consists of the following parts:

Key: An account name in the form of a string of 3 to 256 LATIN-1 characters (key).
Vale: An account object that holds the decimal balance of funds in the account and the keyset that governs the account.
key: "Valencia-HOA" -> value: { 0.0, { ["1d5a5e10...",""4fe7981d...",""58705e86..."], "keys-any" }}

As you saw in the previous example, the keyset consists of one or more public keys and the predicate function that specifies the number of keys that must sign a transaction for the account.

There are three built-in predicate options:

keys-all
keys-any
keys-2
For most accounts—where there's only one public key with ownership of the account—the default predicate of keys-all works as you would expect it to, granting ownership of the account to a single party. However, the predicate function is important to consider when creating accounts that require multiple signatures or have multiple owners. For example, the keys-2 predicate requires that at least two public keys defined in the keyset for the account must sign a transaction to authorize the execution of that transaction.

The following diagram illustrates the relationship between keys, keysets, and accounts:

Keys, keysets, and accounts on the Kadena network

If you would like to learn more about keys and accounts in Kadena, see Beginner's Guide to Kadena: Accounts + Keysets.

Accounts on a multi-chain network
The Kadena network is a scalable proof-of-work blockchain with a consensus model that weaves the transactions and blocks from multiple parallel chains into a single and consistent view of the blockchain state. For a visual introduction to how the Kadena Chainweb protocol weaves connections from multiple chains into a single view of state, watch the 3-minute video How Chainweb Works: A Simple Animation.

Ultimately, this single view of state is one network. However, each of the parallel chains in the network operates independently. When you create and fund an account on any chain, it only exists on that chain. You can create accounts on more than one chain, but they are essentially independent accounts, with separate account balances and potentially different keysets and owners. Because the chains operate independently, you should always pay close attention to the network and chain identifier you have selected when you are signing and submitting transactions.

It's also important to remember that the account name—on its own—doesn't determine the ownership of an account. The keyset associated with an account determines ownership. You could own an account named Alice on chain 0, and someone else could own an account named Alice on chain 5. If you want to own a specific account name across all of the chains in the network, you would need to be the first person to create that account with your keys on each chain. To create a one-to-one relationship between a specific account name and a specific keyset, Kadena introduced the concept of principal accounts.

Account names and principals
As mentioned in Defining accounts, an account name can be any string. Using an arbitrary string as an account name can be convenient. For example, you might want to create an account with a name that identifies it as a personal or primary account, for example, Lola-Pistola, so that it's easy to differentiate it from an account that you own jointly with another party or a group, for example, Las-Pistolas.

However, using arbitrary or vanity account names like these examples can make your account vulnerable to certain kinds of attacks. For example, an attacker might try to frontrun a transaction that creates an account or transfers funds by changing the keyset associated with the account name. One way to prevent an an attacker from trying to impersonate you with a frontrunning attack is to create principal account. A principal is a way to enforce a one-to-one relationship between a guard and a resource that the guard is there to protect, like an account name to protect the ownership of an account balance. If an attacker tries to intercept a transaction by changing an account keyset—the most common type of guard—the new keyset won't match the one defined in the underlying ledger, so the transaction would fail.

Keysets and principals
Keysets represent the most-commonly used type of guard and are the most similar to how most blockchains protect access to accounts using public and secret keys. As you've already seen, a keyset holds a collection of one or more public keys and a predicate function that defines how many of those keys must sign to authorize an action. In Pact, a guard is an assertion of ownership, for example, the ownership of a particular keyset, capability, or user attribute. By calling a function to enforce the guard, Pact produces a Boolean value that must return true for an associated action to take place.

By default, when you define a principal account with a single public key and the keys-all predicate, the result is an account name that starts with the k: prefix, followed by the public key for the account. This naming convention creates a principal account for an individual key.

You can use the create-principal built-in function to create a principal account name for a specified keyset guard. The create-principal function returns a string that represents the principal identified by the specified keyset guard. In the following example, the create-principal function creates a principal from the keyset guard with the name valencia-keyset:

(env-data {"valencia-keyset":{ "keys": ["fe4b6da3...27f608b7"], "pred": "keys-all" } })
"Setting transaction data"

(create-principal (read-keyset "valencia-keyset"))
"k:fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7"

You can also create principal accounts for keysets that have multiple keys and that use either built-in or custom predicate rules. For example, you can define a keyset with two public keys and the built-in predicate keys-any. If you create a principal for this account, the keyset information is used to generate a unique hash and the account is created using the w: prefix, followed by the hash for the guard.

In the following example, the create-principal function creates a principal from the keyset guard with the name valencia-hoa:

(env-data {"valencia-board":{ "keys": ["fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7","5ec41b89d323398a609ffd54581f2bd6afc706858063e8f3e8bc76dc5c35e2c0"], "pred": "keys-any" } })
"Setting transaction data"

(create-principal (read-keyset "valencia-board"))
"w:kar3UPhvtWsLsn5cr5VtNde7CRykgAknLNlDD6BkOPI:keys-any"


Other types of guards
In addition to keysets, Pact supports several other types of guards that you can implement in smart contracts. These guards give you flexibility for handling different types of authorization scenarios, and in general, you can use any type of guard to create a principal account by generating a unique hash.

Each type of principal and guard uses a unique prefix, so they are easy to recognize. If you create principal accounts for the guards, you'll see that the principal accounts use the following set of prefixes:

k: for single key keysets
w: for multiple keys keysets
u: for user guards
c: for capability guards
To learn more about different types of guards and how to use them, see Guards.

Transfers within and between chains
There are two main ways to move Kadena tokens (KDA) between accounts:

Transfer coins between accounts on the same chain.
Transfer coins between accounts on different chains
The primary different between these two types of transfers is who pays the transaction fee to have the transaction included in a block.

With same-chain transfers, the sender must pay the transaction fee.
With cross-chain transfers, the sender and the recipient must both pay a transaction fee.
With a cross-chain transfer, you interact with two different blockchains, which requires two separate transactions, one on each chain.

If you attempt to send a cross-chain transfer to a recipient with no funds on the destination chain, the transfer operation won't be able to complete. However, anyone with funds on the destination chain can help to pay the required fee, allowing the transfer to finish as intended. Kadena has also set up gas stations cover the cost of transaction fees for cross-chain transfers. If you have an incomplete cross-chain transfer, you can use the Transfer assistant to finish the transaction on the destination chain.

To learn more about transfers in Kadena, see Getting started with transfers.

---

Pact features and conventions
Pact has a lot in common with other programming languages, but some of its conventions and intentional restrictions are either unique or unlike other programming languages you might be familiar with. This part of the documentation presents an overview of Pact language features and conventions you should be familiar with as you start reading and writing smart contract code.

Command-line interpreter
In the Quick start, you got a first look at writing Pact smart contract code and using the Pact command-line interpreter, also referred to as the Pact read-eval-print-loop (REPL) environment. The Pact REPL enables you to write and execute Pact code interactively from the command-line. but its real power lies in the ability to execute code in smart contract modules—that is, .pact files—or in test files with the .repl file extension that help you test your code as you go. With test .repl files, you can execute .pact module code and take advantage of features that are only available to use in.repl files run by the Pact REPL interpreter. For example, .repl files can include functions to set up environment data that's required for testing, but that is otherwise difficult to replicate in a test. In most cases, you can use the features provided by the Pact REPL in combination with an integrated development environment (IDE), like Visual Studio Code, to provide an end-to-end development environment.

Parenthesis
Pact uses parentheses to enclose each statement in the code. The statements enclosed by parentheses are often referred to as symbolic expressions or S-expressions. Parentheses enclose all module declarations, all function declarations, and any related logic. Often, the code requires nested parenthetical statements to resolve the logic. For example, the outermost parentheses in the following code contain the helloWorld module:

(module helloWorld 'admin-keyset
  (defun hello (name)
    (format "Hello {}!" [name]))
)

Within the module helloworld declaration, the next set of parentheses contain a hello function declaration that includes an expression—also enclosed by parentheses—that uses the format built-in function.

Comments
There are several ways that you can embed comments in Pact programs. The most common convention is to use semicolons (;) at the start or end of a line to add comments in smart contracts. With this notation, all comments are introduced by a single semi-colon followed by text to the end of the line. Although there's no difference between using a single semi-colon and multiple semi-colons, it's common for code to follow a convention similar to the following for readability:

A single semicolon (;) for short notes on a single line of code.

; First Pact module
(module greeting GOVERNANCE
    (defcap GOVERNANCE () true)
      (defun say-hello(name:string)
        (format "Hello, {}! ~ from Kadena" [name])
      )
 )

(say-hello "Pistolas") ; Call the hello function

Two semicolons (;;) inside or above definitions that describe functions or other top-level forms.

;;  In this example, the module defines a table for storing greeting
;;  names and two functions:
;;
;;  - (say-hello-to "name")
;;  - (greet)

Three semicolons (;;;) or more file-level comments or to separate larger sections of code.

;;; Accounts module demonstrates using row-level keysets, defpact steps, and escrow.
;;; Version: 0.2
;;; Author: Stuart Popejoy

Depending on where you want to add a comment, you can also enclose strings using double quotation marks (" ") with or without the @doc metadata tag. The following is an example of a multi-line documentation string that describes the create-token function the :

@doc "Initializes a TOKEN with given policies and parameters, \
\ and executes the enforce-init function for each listed policy."

The @doc metadata tag is optional. For example, a module definition, function definition, or table definition can include comments in strings without the @doc tag:

(module helloWorld 'admin-keyset
  "A smart contract to greet the world."
  (defun hello (name)
    "Do the hello-world dance"
    (format "Hello {}!" [name]))
)
...
(deftable accounts:{account}
    "Main table for accounts module.")

For more information about metadata, see Pact syntax.

Data types
Pact, like most programming languages, supports the data types that you would expect. For example, Pact allows you define the following types of data:

Data type	Description	Examples
Integer	Any whole number value—positive or negative—that doesn't include a decimal.	1, 2, -19
Decimal	Any number value that includes a decimal. Decimal precision is represented as m*10^(-e) in which m is unbounded, but e has, at most, a value of 255. As a result, decimal values have, at most, 255 decimal places, but the total number can be unbounded with a potentially unlimited precision.	1.0, 23.5, 3.14159265359
String	Any text within quotes. You can represent strings using double quotes. It's also possible to prepend strings used as function names or table names with a single quotation mark (').	“Hello”, "Welcome to the show", 'balances
Boolean	Anything that is represented by true and false literals.	true, false
List	List literals are created inside square brackets ([ ]). List items can be separated with spaces or commas. If all of the items in the list have the same type, then the type is defined by the content of the list. Otherwise, the type is just defined as a “list”.	[1,2,3] or [1 2 3] is an integer list, [1 2 true] is a list
Object	Objects are dictionaries specifying key-value pairs created inside curly braces ({ }).	{“house”:”blue”, “locked”:”no”}
For more information about data types, see Pact syntax.

If you aren't sure about the data type when you are working in Pact, you can check its data type by using the Pact typeof built-in function.

To try it yourself:

Open a terminal shell on your local computer.

Start the Pact REPL interpreter you installed in Install Pact by running the following command:

pact

Use the typeof built-in function to test different data types.

In Pact, functions are enclosed by parenthesis, so to test a list data type, for example:

(typeof [1,2,3])

After you run the command, the typeof function returns that this is a list with any type of data items:

"[list]"

String operations
In most cases, you use double quotation marks (" ") around strings to support whitespace or multi-line strings. However, you can also represent strings by prepending the string with a single quotation mark (').

Typically, you use a single quotation mark to identify strings that are used as function names or table names. You can't identify a string with a single quotation mark if the string includes whitespace or requires multiple lines, but this can be a helpful way to identify certain type of strings more succinctly.

For more information about using a single quotation mark for function or table names, see symbols.

To work with strings:

Open a terminal shell on your local computer.

Start the Pact REPL interpreter you installed in Install Pact by running the following command:

pact

Use double quotation marks to identify a string.

pact> "Where the wild things are"
"Where the wild things are"

Use a single quotation mark to identify a string.

pact> 'hello
"hello"

Concatenate two strings using the built-in add function.

pact> (+ 'Hello " darkness my old friend")
"Hello darkness my old friend"

List and object operations
Pact allows you to express lists using square brackets and objects using curly braces. Pact objects are similar to JavaScript objects defined using key-value pairs.

To create lists and objects:

Open a terminal shell on your local computer.

Start the Pact REPL interpreter you installed in Install Pact by running the following command:

pact

Use double quotation marks to identify strings in a list using square brackets.

pact> ["Alice" "Dinesh" "Lee"]
["Alice" "Dinesh" "Lee"]

Use double quotation marks to identify strings in an object that describes a cat named Scratchy who’s 6 years old.

pact> { "type": "cat", "name": "Scratchy", "age": 6 }
{"type": "cat", "name": "Scratchy", "age": 6}

Make a list that that contains two objects that describe a cat named Scratchy and a dog named Fluffy.

pact> [ { "type": "cat", "name": "Scratchy", "age": 6 } { "type": "dog", "name": "Fluffy", "age": 3 } ]
[{"type": "cat","name": "Scratchy","age": 6}
{"type": "dog","name": "Fluffy","age": 3}]


Time formats
Pact supports many different time properties and formats. The following example illustrates using a format-time built-in function to format the time specified using the time built-in function:

pact> (format-time "%Y-%m-%d %H:%M:%S%N" (time "2024-07-23T13:30:45Z"))
"2024-07-23 13:30:45+00:00"

The time function constructs a time object from a UTC value using the ISO8601 format (%Y-%m-%dT%H:%M:%SZ). The format-time built-in functions takes a format argument and a time argument to produce the specified time in the specified format. The following table provides a summary of time formats used in the previous example:

Format	Purpose
%Y	Year, no padding.
%m	Month of the year, zero-padded to two characters, "01"–"12"
%d	Day of the month, zero-padded to two characters, "01"–"31"
%H	Hour of the day using a 24-hour clock, zero-padded to two characters, "00"–"23"
%M	Minute of of the hour, zero0-padded to two characters, "00"–"59"
%S	Second of the minute, zero-padded to two characters, "00"–"60"
%N	ISO 8601 style numeric time zone (for example, "-06:00" or "+01:00")
There are many other formatting options than included in the previous example. For example, you can replace the numeric representing the month of the year with the short or long name for the month.

pact> (format-time "%Y-%b-%d" (time "2024-07-24T13:30:45Z"))
"2024-Jul-24"

For more information about all of the formats supported, see Time formats.

Operators
Pact provides operator functions to perform common arithmetic, comparison, and logical operations. The most common of these operator functions are listed in this section. For a complete list with more information about each function, including function signatures and examples, see Operators.

Arithmetic operators
+: Addition
-: Subtraction
*: Multiplication
/: Division
^: Exponentiation
Comparison operators
=: Equality
!=: Inequality
<: Less than
<=: Less than or equal to
>: Greater than
>=: Greater than or equal to
Logical operators
and: Logical AND
or: Logical OR
not: Logical NOT
Bitwise operators
&: Bitwise AND
|: Bitwise OR
~: Bitwise NOT
xor: Bitwise XOR
shift: Bitwise shift
Math-related operators
mod: Modulus
abs: Absolute value
round: Rounding
ceiling: Ceiling
floor: Floor
Functions
Functions are an important part of any programming language, whether you are working with built-in libraries or writing your own functions. In addition to the operator functions, Pact provides many other built-in functions to handle different types of tasks. The functions are grouped into the following categories:

Capabilities
Database
General
Guards
Keysets
Operators
Repl
Time
Click a category to see a complete list of the functions in that category. Within each category, you can click individual function names to see more information, including function signatures and examples. You can also view information about built-in functions using the Pact command-line interpreter and interactive REPL.

Defpacts
One of the key features of the Pact programming language is support for multi-step transactions using coroutines—called defpacts—that can start, stop, continue, or rollback the execution of specific operations in a transaction.

With defpacts, you can define the steps to be executed by different parties as sequential operations on the blockchain. For example, defpacts are used for cross-chain transfers where a burn operation takes place on the first chain and a mint operation takes place on the second chain. Because defpacts enable you to orchestrate a series of transactions in a strict sequence, they have two primary use cases:

For public two-party transactions—similar to an escrow process—with rules for the operations that are required to be performed by each participant to complete the transaction.
For private, confidential transactions that can be serialized and executed in a sequence and recorded in a private log and, predominately, involving the exchange of encrypted messages outside of the blockchain state. Note that private multi-step transactions aren't supported in Pact-5 or later.
With defpacts, you can enable each participant to run only a subset of functions—for example, as a buyer who can make an offer or a seller who can start a sale—while preserving the integrity of the transaction as a whole. For more information about defining and using defpacts, see the syntax description for the defpact reserved keyword. For a more detailed example of using defpact in a smart contract, see the Marmalade ledger contract.

---
Functions, variables, and types
In Language features and conventions, you were introduced to Pact built-in functions and function categories. In this part of the documentation, you'll begin working with common built-in functions and writing your own function declarations that include variables and types.

View built-in functions
To view information about Pact built-in functions:

Open a terminal shell on your local computer.

Display the list of built-in functions by running the following command:

pact --builtins

You might want to save the output from this command to a file for quick reference. For example:

pact --builtins > builtin-functions.txt

Start the Pact REPL interpreter by running the following command:

pact

View usage information for a specific built-in function by typing the function name in the interpreter.

For example, to see information about the format function, type format at the pact> prompt:

pact> format

After you enter the function name, you'll see information about the function in the interpreter. For example:

native `format`

  Interpolate VARS into TEMPLATE using {}.

  Type:
  template:string vars:[*] -> string

  Examples:
  > (format "My {} has {}" ["dog" "fleas"])

Use common functions
Pact includes many built-in functions that enable you to perform common tasks like manipulating lists, assigning values, and formatting strings with variables. A few of the most common general purpose functions include the following:

at
bind
map
format
You can use the at built-in function to return a value from a list or an object. The bind built-in function allows you to map a variable to a value from within an object. You can use the map built-in function to apply a specific operation to all elements in a list and return the results. The format built-in function allows you to create messages using strings and variables.

Let's try a few simple examples to see how these functions work.

To use the common general functions:

Open a terminal shell on your local computer.

Start the Pact REPL interpreter you installed in Install Pact by running the following command:

pact

Select an item from a list using its place—its index location—in the list.

(at 1 ["red" 4 true])
4

The index location starts with position 0, so at index position 1, the result is 4. As this example illustrates, the list can include different data types. If you change the index to 0, the result is "red". If you change the index to 2, the result is true.

Select a value from an object by specifying the object key.

pact > (at "name" { "type": "cat", "name": "Scratchy", "age": 6 })
"Scratchy"

In this example, you use the "name" key instead of an index location to return the value—"Scratchy"—from that key.

Bind a variable from a source object to a value in another object using the := symbol.

pact > (bind { "a": 1, "b": 2 } { "a" := a-value } a-value)
1

In this example, the value from the "a" key in the source object is assigned to the a-value variable, so the value returned by the a-value variable is 1.

A more common use case for binding values using the := symbol is when you want to bind the values from a table object to a variable. The following example illustrates how you might bind a value from a table in a function:

(defun pay (from to)
    (with-read payments from { "balance":= from-bal }
    ...code
    )
)

This example reads a table named payments that includes a user from that is sending a balance. A binding is used in this case to map the balance column in the payments table to the value of from-bal variable that is provided by the user. In this example,the function calls the balance of the user using the balance variable rather than the from-bal variable.

Apply a specific operation to each element in a list and return the results using the map built-in function.

pact > (map (+ 1) [1 2 3])
[2 3 4]

This expression adds the value 1 to each element in the specified list then returns the result in a new list. You can also use the map function with other values, including strings, and with any of the operators available in Pact. For example, if you have a list of names, you can map “Hello ” to each of them to returning a friendly message for each list item.

pact> (map (+ "Hello ") ["Kadena" "Pact" "Standard Library"])
["Hello Kadena" "Hello Pact" "Hello Standard Library"]

Format a message using strings, curly braces ({ }) for placeholders and a list of values or variables.

(format "My {} has {}" ["dog" "fleas"])
"My dog has fleas"

The first set of curly braces is the placeholder for the first value in the list. The second set of curly braces is the placeholder for the second value in the list. You can create as many placeholders and list values as you need for your messages. In a more typical use case, you would use the format function to create dynamic strings with variables inserted into specific locations in Pact contracts.

Close the Pact REPL interpreter session by pressing Control-d.

Prepare to write functions
Now that you've experimented with several built-in functions in Pact, you’re ready to write some simple functions of your own. In Pact, functions are always defined in the context of a module. As you learned in Pact smart contracts, modules are one of the core components of the Pact programming language. A module definition must include information about who has ownership of the module using either an administrator keyset or by defining a GOVERNANCE capability. So, before you start writing functions, you need to create a module and identify the module owner.

To prepare to write your first functions:

Open a code editor—such as Visual Studio Code—on your computer.

Create a new file named myModule.pact for your new Pact module.

Add a module definition and a GOVERNANCE capability to the file with the following lines of code:

(module myModule GOVERNANCE
    (defcap GOVERNANCE() true)

    ;; DEFINE FUNCTION HERE
)

The defcap function is a reserved keyword that defines a capability that controls the ownership of your contract. It must evaluate to true to allow changes to the module. You'll learn more about the power of capabilities in later tutorials and examples. These lines of code represent the bare minimum required to define a module. Before moving on to writing functions within the module, you can test that the module runs using the Pact REPL interpreter.

Start the Pact REPL interpreter by running the following command:

pact

Load the myModule.pact file by running a command similar to the following with the path to the myModule.pact file:

pact> (load "myModule.pact")

You should see output similar to the following:

"Loading myModule.pact..."
"Loaded module myModule, hash lt47sdWmlQKnqv66VwNBolJqjRg1TcZpteGps5H0xCc"

Define a function
Functions are the core units of logic in a module. They define all of the operations you want your application to offer and all of the features that your users want to access. Although Pact includes many built-in functions for you to use, you typically need to define most of a contract's logic using your own functions. Functions definitions start with the reserved keyword defun in Pact. After the defun keyword, you must provide the function name followed by any arguments or other functions that the function uses.

The following is a simple example of the syntax to define a function in Pact:

(defun returnPhrase (a b) ;; Start of function declaration
    ;; COMMANDS GO HERE
)                         ;; End of function declaration

The defun function is a reserved keyword that signals the start of a function declaration. In this example, the function is named returnPhrase and the function accepts inputs with the variable identifiers a and b. The function includes comments by using two semi-colons (;;) to start each comment.

Let's add this function to your module.

To define your first function:

Open the code editor—such as Visual Studio Code—on your computer.

Open the myModule.pact file you created for your new Pact module.

Define the function in the module by replacing the comment with the following lines of code:

(module myModule GOVERNANCE          ;; Start of module definition
  (defcap GOVERNANCE() true)

  (defun returnPhrase (a b)          ;; Start of function declaration
   (format "My {} has {}" [a b])
  )                                  ;; End of function declaration
)                                    ;; End of module definition

The returnPhrase function can now take any two inputs and return a formatted string value.

Start the Pact REPL interpreter by running the following command:

pact

Load the myModule.pact file by running the following command:

pact> (load "myModule.pact")

You should see output similar to the following:

"Loading myModule.pact..."
"Loaded module myModule, hash sa059rM_ifArkCn4vDWpc20C1FThTMtWRNIMpVcrE6w"

Call the returnPhrase function by running the following command:

(returnPhrase "car" "bright lights")
"My car has bright lights"

You can now change these inputs to any values you’d like.

Add calculator functions
Now that you have a working module with one function, you can add functions for the math operations that take any two numbers as input, and return the result.

To add simple calculator functions:

Open the code editor—such as Visual Studio Code—on your computer.

Open the myModule.pact file you created for your new Pact module.

Define functions for adding, subtracting, multiplying, or dividing any input values:

 (defun addNumbers (a b)
   (+ a b)
 )

 (defun subtractNumbers (a b)
   (- a b)
 )

 (defun multiplyNumbers (a b)
   (* a b)
 )

 (defun divNumbers (a b)
   (/ a b)
 )

Call the functions with different values to see the results.

For example:

pact> (addNumbers 3 4)
7
pact> (subtractNumbers 23 4)
19
pact> (multiplyNumbers 12 4)
48
(round (divNumbers 63.5 4.1) 8)
15.48780488

It's important to note that these simple calculator functions are valid, but could be improved by explicitly specifying the data type expected. For example, in the current form, you could execute the addNumbers function to concatenate two strings:

(addNumbers "Hello " "Kadena")
"Hello Kadena"

To prevent errors or unintentional behavior, you can explicitly define the type for each function. For example, you might want to explicitly set the data type to integer or decimal:

(defun addNumbers (a:integer b:integer)
   (+ a b)
 )

For more information about specifying types, see Typing in variable declarations.

Variables
In the previous examples, you used the variable identifiers a and b to represent input arguments in your function declarations. Variables represent and store any type of data that you want to reference and manipulate in a program.

Constant values
In Pact, you can define variables for constant values using the defconst reserved keyword.

(defconst variable_name variable_value [optional_text])

For example, the following statement illustrates defining the constant PI with eight decimal places followed by an optional comment:

(defconst PI 3.14159265 "Pi to 8 decimals")

The following example illustrates defining the constant PENNY with an explicit type of decimal:

(defconst PENNY:decimal 0.1)

By convention, constant variables use all uppercase letters. However, this convention isn't required.

To use a constant in your module:

Open the code editor—such as Visual Studio Code—on your computer.

Open the myModule.pact file.

Add the constant variable for PI to your module and save your changes.

Load the myModule.pact file.

Call the addNumbers function with the PI constant.

(addNumbers 1.0 PI)
4.14159265

You can experiment with using the PI constant in other functions. However, you should note that the data type for PI is a decimal value. Therefore, the other values you pass should also be decimal values—as in this example with 1.0—and not the integer values.

Changeable values
You can also define variables for values that can be changed using let expressions. Within functions, you can use the let keyword to bind a variable identifier to a value. For example, you can assign the variable identifier x a value of 10 and perform a simple addition by entering the following in the Pact terminal:

(let ((x 10))
 (+ x 5)
)

This expression returns the result of adding 5 to x with the value 15.

You can also use the let keyword to reference previously-declared variables in the same let declaration. The following example illustrates referencing a previously-declared variable in the same let declaration:

(let ((x 2) (y (* x 10))) (+ x y))
22

Typing in variable declarations
Most of the examples you've seen so far haven't explicitly specified the data type being used. However, in practice, you should explicitly identify the data type for each variable you define in a program. By identifying the data type—for example, integer, decimal, boolean, or string—you can ensure that variables can be set and manipulated correctly and without introducing unexpected behavior by mismatching types.

For example, to specify that the variable x is an integer, you can add the integer data type to the declaration like this:

(let ((x:integer 10))x)

You can specify a variable is a decimal value like this:

(let ((x:decimal 10.0))x)

You can specify a variable is a string value like this:

(let ((state:string "CA"))state)
"CA"

More built-in functions
You've already seen how to use several common built-in Pact functions. However, there are many more built-in functions that you'll use frequently in Pact smart contracts, including the following general functions:

namespace
hash
if
enforce
Entering a namespace
In the Kadena ecosystem, a namespace is conceptually similar to a domain name except that the name is a static prefix that establishes a private boundary for the contracts, keys, and other elements that you control. When you are building, testing, and deploying smart contracts on your local development network, you don't need to define a namespace. Your work is isolated from others because your blockchain—and any smart contracts you deploy—run exclusively on your local computer.

However, if you want to deploy a smart contract on the Kadena test network or another public blockchain, the contract must have a unique name that distinguishes your Pact module from all the others. If you try to deploy a Pact module with a name that's already being used on the network where you are trying to deploy, the deployment will fail with an error and you'll pay a transaction fee for the failed attempt.

To prevent name collisions on the same network, Kadena allows you to define your own unique namespace on the blockchain. The namespace segregates your work—your smart contracts, keysets, and Pact modules—from applications and modules created and deployed by others. Within your namespace, you can define whatever keysets and modules you need and control who can update the namespace with changes. As long as you choose a unique name for your namespace, everything you define inside of that namespace is automatically unique, too.

Pact provides the define-namespace and namespace built-in functions for you define or enter the namespace you want to use as your current working environment. After you declare the namespace you want to work with, all of the modules and functions you define are contained within that namespace.

You can access the modules and functions in a namespace by using their fully qualified name. The fully-qualified name includes the namespace string as a prefix before the module name. For example, if you declare a principal namespace such as ns-my-local-dev for the module my-calculator, you can call functions in the module using a fully-qualified name similar to the following:

ns-my-local-dev.my-calculator.add

To define and enter a namespace:

Open a terminal shell on your local computer.

Start the Pact command-line interpreter to open the Pact terminal.

Add a user-keyset guard and an admin-keyset guard to your working environment by entering the following lines:

(env-data
 { 'user-keyset :
   { 'keys : [ 'user-public-key ]
   , 'pred : 'keys-all
   }
 , 'admin-keyset :
   { 'keys : [ 'admin-public-key ]
   , 'pred : 'keys-all
   }
 }
)

The user-keyset and admin-keyset are required to define a new namespace. In the terminal, you should see this information added to your working environment:

pact> (env-data
....>  { 'user-keyset :
....>    { 'keys : [ 'user-public-key ]
....>    , 'pred : 'keys-all
....>    }
....>  , 'admin-keyset :
....>    { 'keys : [ 'admin-public-key ]
....>    , 'pred : 'keys-all
....>    }
....>  }
....> )
"Setting transaction data"

Define a new namespace by running the following command:

pact>  (define-namespace 'ns-my-local-dev (read-keyset 'user-keyset) (read-keyset 'admin-keyset))


In the terminal, you should see this information added to your working environment:

"Namespace defined: ns-my-local-dev"

Enter the new namespace by running the following command:

pact> (namespace 'ns-my-local-dev)

In the terminal, you should see this information added to your working environment:

"Namespace set to ns-my-local-dev"

If you define a module in this workspace, you would set the first line to specify the namespace before any of the module code. For example:

(namespace "ns-my-local-dev")

(module myModule GOVERNANCE
    (defcap GOVERNANCE() true)
    ...
)

The module is created with the fully-qualified ns-my-local-dev.[contract_name] name.

Hashing values
The hash function enables you to compute a unique Base64Url-encoded string for a specified value using the BLAKE2b 256-bit hashing algorithm. Using a hashing algorithm is a common operation for blockchain networks when you need to create unique values. You can create hashes for any type of data. Strings values are converted directly. Other data type values are converted using their JSON representation.

The following example demonstrates how to use the hash function to create a unique index for the "hello" string value:

pact> (hash "hello")
"Mk3PAn3UowqTLEQfNlol6GsXPe-kuOWJSCU0cbgbcs8"

Because "hello" is a string value, the hash function computes the BLAKE2b 256-bit hash of the string "hello" and returns the hash value. If you change the string to “hello1”, the hash function returns different value. For example:

(hash "hello1")
"zbEgnuUZLD7FFPPH9VD91-Ah9KzCeCLqBVL2hGAg8d4"

You can also use the hash function to compute the hash for lists, objects, and other data types. For example:

(hash [1 2 3])
"qPorDZllGgkv-ZaODZMQE0tUgv2ghZ4G86OTDmKANXg"

The following example computes the hash for the JSON representation of an object and returns the hash value:

(hash { 'foo: 1 })
"h9BZgylRf_M4HxcBXr15IcSXXXSz74ZC2IAViGle_z4"

The hash enables you to reference and manipulate the specific data in complex ways.

Defining conditions with if statements
Because Pact doesn't support recursion or unbounded looping, the if function is particularly useful for testing conditions. The basic format for testing conditions with if statements looks like this:

(if condition then else)

If the specified condition is true, evaluate the then expression. If the specified condition is false, evaluate the else expression.

The following example demonstrates the use of if to test a condition—whether (2 + 2 =4)—in the Pact REPL:

pact>(if (= (+ 2 2) 4) "Sanity prevails" "Chaos reigns")
"Sanity prevails"

In this example, the condition (= (+ 2 2) 4) evaluates to true, so the expression "Sanity prevails" is returned.

pact>(if (= (+ 2 2) 5) "Sanity prevails" "Chaos reigns")
"Chaos reigns"

In this example, the condition (= (+ 2 2) 5) evaluates to false, so the expression "Chaos reigns" is returned.

Enforcing conditions
Pact provides several enforce functions that enable you to evaluate conditions and allow or block further operations based on the result. One critical function in Pact is enforce. If you hit an enforce block and invalidate it, it will stop you from executing any further.

With the enforce function, you can test whether a specified expression evaluates to true or false. If the specified expression evaluates to true, the function returns true and operation continues. If the specified expression evaluates to false, the function halts execution and displays a specified error message.

The following example tests the expression (1 + 3 != 5):

pact> (enforce (!= (+ 1 3) 5) "whoops")
true

Because the specified expression (4 != 5) is true, the function returns true and the operation continues.

The following example demonstrates how to use the enforce function to evaluate the expression (2 + 2) != 4:

pact> (enforce (!= (+ 2 2) 4) "The expression is false")
The expression is false
 at <interactive>:0:0: (enforce (native `!=`  True if X does not equal Y.  Type: x... "The expression is false")


There are many situations where the enforcement functions are useful for testing specific behavior. For example, one of the most common enforcement functions is the enforce-guard function. This function ensures that the logic for a specified guard or keyset is enforced before protected operations can be executed. You'll learn more about guards and enforcing guard logic in Guards.

---


Modules and interfaces
The fundamental building blocks for all Pact smart contracts are defined in Pact modules and interfaces. As Pact code, modules and interfaces have some similarities, but they are used differently have different usage rules.

A a high level:

Module are typically self-contained logical units with all of the code necessary to create an application or a service—including schemas and tables—and can be upgraded after they are deployed.
Interfaces enable modules to interact by defining constant values and typed function signatures for common operations that can't be changed except by defining a new interface.
Module declaration
All of the functions and data definitions required to complete business operations are defined within the context of a module. For simple contracts, all of the business logic might be defined in a single module. You can also use modules as composable units that interoperate if iit makes complex logic easier to navigate. Whether you are building a contract as a single, self-contained Pact module or using multiple modules, module declarations typically include the following components:

Capability definitions
Schema definitions
Table definitions
Function definitions
Multi-step defpact definitions
Constant value definitions
There are also components that are required by smart contracts that aren't part of the module declaration, but are defined outside of the module code. For example, the code related to the following components is considered to be outside of and separate from the module declaration:

Namespace definition
Keyset definitions
Table creation
Function calls
In addition to the module declaration and the components that aren't included in the module declaration, modules often require information passed in as message data, separate from the Pact code, but part of the transaction payload. For example, a module might require keys or environment data that's referenced in Pact code, but provided as part of the JSON object to be executed as a transaction.

Modules and smart contracts
When you start working with Pact, you typically create single modules that contain the full functionality of your smart contract, much like most of the examples in the coding projects. Using a single module to define a contract keeps your codebase simple and straightforward because there's only one file to keep track of. However, as you begin writing more complex or sophisticated programs, you might find it more convenient to split the smart contract logic into multiple modules that work together to compose the complete application. In a typical smart contract—the full application—each individual module can provide a focused set of functionality with clear organizational logic.

Because a smart contract can be defined using one module or many modules and interfaces, the logic in individual Pact file—with the .pact file extension—is always referred to as a module or an interface.

Module keyword and owner
You can start a module declaration by typing the module keyword, followed by the module name and the keyset or governance capability that owns the module. The following example illustrates a module named example that is governed by the admin-keyset referenced in the first line of the module declaration:

;; Define and read keysets

(module example "admin-keyset"
    ;; module code goes here

    ;; function calls
)

The entire example module consists of the code within the opening and closing parentheses. Top-level code, like namespace definitions and keyset definitions, are outside of these parentheses. For example, you enter a namespace and define a keyset for a module before starting the module declaration like this:

;; Enter a namespace
(namespace "free")

;; Define and read a keyset
(define-keyset "free.admin-keyset" (read-keyset "admin-keyset"))

(module example "admin-keyset"
    ;; module code goes here

    ;; function calls
)

Module governance
With keyset governance like the previous example, the admin-keyset is defined outside of the module and checked and enforced at the module level. Any attempt to upgrade the module, write to module tables, or access table functions directly requires the admin-keyset to sign the transaction.

As an alternative to strict keyset enforcement, you can specify a governance capability in the module declaration to support a more generalized form of module governance. By using a governance capability that references a defcap declaration in the module body, you can define more flexible models for enforcing access to Pact modules, tables, and functions.

For example, you can implement the same governance for the example module using a governance capability named GOVERNANCE like this:

(module example GOVERNANCE
  ...
  (defcap GOVERNANCE ()
    (enforce-guard "admin-keyset"))
  ...
)

Note that the capability name has no significance, except to indicate the purpose of the capability. Its placement at the beginning of the module declaration is what identifies this capability as a module governance capability.

It's worth noting that, when you initially deploy a module, the module governance capability is not invoked. This behavior is different than when you use a keyset. With a keyset, the keyset must always be defined and evaluated to ensure that the keyset exists before a module can be deployed. The module governance capability is enforces after a module is deployed, when it's accessed or upgraded.

Invoking governance
Because the module governance capability is defined using the defcap keyword, its elevated administrative function cannot be called directly. The module administrator elevated permissions are only automatically invoked in the following situations:

When a module upgrade is attempted.
When module tables are directly accessed from outside of the module code.
Transactions that attempt to upgrade a module or access module tables can only be executed by the module owner specified by the module administrator capability—in this example, the GOVERNANCE capability. If the conditions specified for the GOVERNANCE capability are met, full administrative rights are granted.

Module administrator scope
The module administrator capability, once automatically invoked, stays in scope for the rest of the calling transaction. This is unlike other capabilities that can only be acquired in a fixed scope specified by the body of a with-capability function call. The reason for this difference in behavior is to ensure that a governance capability doesn't rely on transient information that can change during a single transaction. This is important, for example, in the case of module upgrades. A module upgrade might change the governance capability itself. If the module administrator capability didn't remain in scope through the completion of the transaction, the upgrade might fail because the administrative capability is required to migrate table data as part of the upgrade process.

Stakeholder upgrade vote
The following example demonstrates how to upgrade a module based on a stakeholder vote. The upgrade is designed as a Pact transaction, and its hash and code are distributed to stakeholders, who vote for or against the upgrade. After the upgrade transaction is distributed, the vote is tallied in the governance capability, and if a simple majority is found, the code is upgraded.

(module govtest count-votes
  "Demonstrate programmable governance showing votes \
 \ for upgrade transaction hashes"
  (defschema vote
    vote-hash:string)

  (deftable votes:{vote})

  (defun vote-for-hash (user hsh)
    "Register a vote for a particular transaction hash"
    (write votes user { "vote-hash": hsh })
  )

  (defcap count-votes ()
    "Governance capability to tally votes for the upgrade hash".
    (let* ((h (tx-hash))
           (tally (fold (do-count h)
                        { "for": 0, "against": 0 }
                        (keys votes)))
          )
      (enforce (> (at 'for tally) (at 'against tally))
               (format "vote result: {}, {}" [h tally])))
  )

  (defun do-count (hsh tally u)
    "Add to TALLY if U has voted for HSH"
    (bind tally { "for" := f, "against" := a }
      (with-read votes u { 'vote-hash := v }
        (if (= v hsh)
            { "for": (+ 1 f), "against": a }
          { "for": f, "against": (+ 1 a) })))
  )
)

Module properties and components
As you've seen, module declarations start with the module keyword and a name. Module names must be unique within a namespace. You can define custom namespaces for local development. However, you must deploy modules to a registered namespace in the Kadena test or production networks.

Module declarations use the following keywords to define module components:

defun to define module functions.
defschema to define schemas for module tables.
deftable to define the tables to create for a module.
defpact to define multi-step transactions in the module.
defconst to define constant value variables in the module.
defcap to define capabilities in the module.
use to import functions from other modules into the module.
implements to implement functions from interfaces exposed in other modules into the module.
Modules can also include different types of metadata, such as documentation strings or information for emitted events.

When a module is declared, all references to native functions, interfaces, or definitions from other modules are resolved. Resolution failure results in transaction rollback.

Module versioning and dependencies
Module versioning is not supported, except by including a version identifier in the module name, for example, accounts-v1 or marmalade-v2. However, you can use module hashes to import a specific version of a module with the use keyword. By specifying a module hash when you import the module, you can link your code to a particular release of a module that's identified by the hash.

By combining module imports with module hashes, you can ensure that updated module code will fail to import if a dependent module has subsequently changed on the chain.

Module table creation
Tables are created at the same time as modules and include the module name as a prefix to the table name. With this naming convention, the module acts as a guard to protect access to tables using database functions that are controlled by the module owner. You can create any number of tables in a module.

It’s important to note that you define table schemas, the tables that use the schemas, and the functions that insert, read, and modify database records inside of module code, but you create tables outside of module code. That is, tables are defined in modules, but they are created after the module declaration. This separation allows module code to be potentially updated without recreating the table.

Interfaces
In Pact, interfaces represent an abstract API that modules can implement to make use of the constants and typed function signatures that an interface defines.

To make use of the components defined in an interface, module declarations can include one or more implements statements to specify the interface from which the module wants to implement features. A single module can implement multiple interfaces. However, if you implement interfaces with conflicting function names, you must resolve the conflict in your code or by redefining the interfaces to remove the conflict.

Interface properties and components
You can declare an interface using the interface keyword followed by the name for the interface. Interface names must be unique within a namespace. Interfaces can't be upgraded and aren't governed by keysets or a governance capability.

Interfaces can import definitions from other modules with use statements to construct new constant definitions, or make use of types or functions defined in the imported module.

Modules can implement interfaces that include the following components:

function signatures
constant values
schema definitions
defpact specifications
capability specifications
imported definitions from other modules
The following example illustrates how to declare and implement an interface with one function signature and one constant value:

(interface my-interface
    (defun hello-number:string (number:integer)
      @doc "Return the string \"Hello, $number!\" when given a string"
        )

    (defconst SOME_CONSTANT 3)
)

(module my-module (read-keyset 'my-keyset)
    (implements my-interface)

    (defun hello-number:string (number:integer)
        (format "Hello, {}!" [number]))

    (defun square-three ()
        (* my-interface.SOME_CONSTANT my-interface.SOME_CONSTANT))
)

As you can see in this example, the my-module module implements the hello-number function signature. The constant declared in the interface is accessed directly by its fully qualified name namespace.interface.const.

Implements and use keywords
You can create complex and layered relationships between interfaces and modules. One important way you can create this layered relationships is by using combinations of the implements and use keywords. The use keyword enables you to import elements from the specified module into a namespace, interface, or module. For example, you can specify the use keyword in an interface declaration to import table schemas and types from a specified module.

You can also include use statements at the top-level of a contract or within a module declaration to make all or parts of a specified module available in the current module context. For example, you can specify a list of functions, constants, and schema names to import from the specified module. If you explicitly define the function, constant, and schema names to import, only those items are available in the module body.

You can also specify a hash argument in use statements to check that an imported module's hash matches the hash you expect, and fail if the hashes are not the same. By including the hash argument in a use statement, you can perform a simplified form of version control or dependency checking.

The following example is an excerpt from the marmalade-v2.ledger module that illustrates the relationships created by combining implements and use statements. In this example, marmalade-v2 is the primary namespace where the ledger contract is deployed.

(namespace (read-string 'ns))

(module ledger GOVERNANCE

  (implements marmalade-v2.ledger-v2)
  (implements kip.poly-fungible-v3)

  (use kip.poly-fungible-v3 [account-details sender-balance-change receiver-balance-change])
  (use kip.token-policy-v2 [token-info])
  (use util.fungible-util)
  (use marmalade-v2.policy-manager)
     ...
)

This module implements the ledger-v2 interface that defines a set of capabilities.

(interface ledger-v2

  (defcap INIT-CALL:bool (id:string precision:integer uri:string)
    @doc
      "Capability securing the modref call for enforce-init "
  )
  ...

)

The module also implements the poly-fungible-v3 interface and imports the specified functions.

(interface poly-fungible-v3

  (defschema account-details
    @doc
      " Account details: token ID, account name, balance, and guard."
    id:string
    account:string
    balance:decimal
    guard:guard)

  (defschema sender-balance-change
    @doc "For use in RECONCILE events"
    account:string
    previous:decimal
    current:decimal
  )

  (defschema receiver-balance-change
    @doc "For use in RECONCILE events"
    account:string
    previous:decimal
    current:decimal
  )
...
)

For more information about the syntax for using these keywords, see the implements and use syntax descriptions.

Module references
Pact module references enable you to support use-cases that require polymorphism. For example, a Uniswap-like exchange allows users to specify pairs of tokens to allow trading between them. The Pact fungible-v2 interface allows tokens to offer identical operations such as transfer-create. However, without a way to abstract over different fungible-v2 implementations, an exchange smart contract would have to be upgraded for each token pair with custom code for every operation.

For example:

;;; simplified DEX example with hardcoded dispatching on token symbols
(defun swap
  ( a-token:string a-amount:decimal a-account:string
    b-token:string b-amount:decimal b-account:string
  )
  (with-read pair-accounts (format "{}:{}" [a-token b-token])
    { 'pair-a-account := pair-a-account
    , 'pair-b-account := pair-b-account
    }
    (cond
      ((= "KDA" a-token)
       (coin.transfer a-account pair-a-account a-amount))
      ((= "KBTC" a-token)
       (kbtc.ledger.transfer a-account pair-a-account a-amount))
      ((= "KUSD" a-token)
       (kusd.ledger.transfer a-account pair-a-account a-amount))
      "Unrecognized a-token value")
    (cond
      ((= "KDA" b-token)
       (coin.transfer b-pair-account b-account b-amount))
      ((= "KBTC" b-token)
       (kbtc.ledger.transfer b-pair-account b-account b-amount))
      ((= "KUSD" b-token)
       (kusd.ledger.transfer b-pair-account b-account b-amount))
      "Unrecognized b-token value"))
)

With module references, an exchange-type smart contract can accept pairs of values where each value references a concrete module that implements the fungible-v2 interface, giving it the ability to call fungible-v2 operations using those values.

For example:

;;; simplified DEX example with module references in a dynamic dispatch
(defun swap
  ( a-token:module{fungible-v2} a-amount:decimal a-account:string
    b-token:module{fungible-v2} b-amount:decimal b-account:string
  )
  (with-read pair-accounts (format "{}:{}" [a-token b-token])
    { 'pair-a-account := pair-a-account
    , 'pair-b-account := pair-b-account
    }
    (a-token::transfer a-account pair-a-account a-amount)
    (b-token::transfer pair-b-account b-account b-amount))
)

To invoke the swap function, the module names are directly referenced in code.


(swap coin a-amount a-account
      kbtc.ledger b-amount b-account)


Module reference values are normal Pact values that can be stored in the database, referenced in events, and returned from functions.

;;; simplified DEX example with stored pair module reference values
(defun swap
  ( pair-symbol:string
    a-amount:decimal a-account:string
    b-amount:decimal b-account:string
  )
  (with-read pair-accounts pair-symbol
    { 'pair-a-account := pair-a-account:string
    , 'a-token := a-token:module{fungible-v2}
    , 'pair-b-account := pair-b-account:string
    , 'b-token := b-token:module{fungible-v2}
    }
    (a-token::transfer a-account pair-a-account a-amount)
    (b-token::transfer pair-b-account b-account b-amount))
)

Polymorphism
Module reference values provide polymorphism for use cases like the previous example with an emphasis on interoperability. A module reference is specified with one or more interfaces, allowing for values to reference modules that implement those interfaces.

In the previous example, the module reference a-token:module{fungible-v2} accepts a reference to the Kadena coin KDA token module, because coin implements fungible-v2. There's nothing special about the fungible-v2 interface. Module references can specify any defined interface and accept any module that implements the specified interface.

The Pact module reference polymorphism is similar to generics in Java or traits in Rust, and should not be confused with more object-oriented polymorphism like that found with Java classes or TypeScript types. Modules cannot extend one another. They can only offer operations that match some interface specification, and interfaces themselves cannot extend other interface.

You should note that module references introduce indirection and, therefore, can increase the overall complexity of Pact smart contracts, making contract logic harder to understand and reason about. You should only use module references when you need to provide flexible interoperation between smart contracts. If all of the modules are your own code, you should use direct references instead of external module references whenever possible.

Reference value binding
Module references use the latest upgraded version of the referenced module when you invoke a module operation. For example, consider a module reference to a payments module stored in the database when the payments module is at version 1. Sometime later, the payments module is upgraded to version 2. The module reference in the database will refer to the upgraded version 2 of the payments module when the reference is called. This behavior is different from Pact direct references, which are not late-binding, so you should consider this difference in module reference behavior to prevent returning unexpected results.

Referencing untrusted code
Because module references allow external modules to interoperate with your code, you should not assume that the external code is safe. Instead, you should treat any module reference call as a call to untrusted code. In particular, you should be aware that invoking module references in the context of acquiring a capability can result in unintended privilege escalation.

For example, the following data-market module has a public collect-data function that is intended to allow external modules to provide some data, resulting in the one-time payment of a fee. The external modules implement a data-collector interface with a collect function to get the data and a get-fee-recipient function to identify the receiving account. In this example, the data-market module code acquires the COLLECT capability, and uses this capability to prevent collect and a get-fee-recipient functions from being called directly.

However, with the wrong code, this seemingly benign code can be exploited by a malicious module reference implementation:

(module data-market GOVERNANCE
  ...

  (defun collect-data (collector:module{data-collector})
    "Provide data, get paid!"
    ;; BAD: capability acquired before modref calls
    (with-capability (COLLECT)
      ;; BAD: modref invoked with capability in scope!
      (store-data (collector::collect))
      (pay-fee (collector::get-fee-recipient)))
  )

  (defun pay-fee (account:string)
    "Private function to pay one-time fee for collection"
    (require-capability (COLLECT))
    (coin.transfer FEE_BANK account FEE))

  (defun store-data (data:object{data-schema})
    "Private function to update database with data collection results"
    (require-capability (COLLECT))
    ...)
)

The problem with the module code is that the with-capability call happens before the calls to the module reference operations, such that while the external module code is executing, the COLLECT capability is in scope. While the COLLECT capability is in scope, the pay-fee and store-data functions can be called from anywhere. Malicious code could exploit this code with a module reference that calls the data-market.pay-fee function repeatedly in the seemingly innocent calls to the collect or get-fee-recipient functions. Malicious code could also call the data-market.store-data function and wreak havoc that way. The important point in this example is that once a capability is in scope, the protections provided by the require-capability function aren't available.

Fortunately, you can avoid this situation by keeping module reference calls outside of the scope of the sensitive capability. For example:

(defun collect-data (collector:module{data-collector})
  "Provide data, get paid!"
  ;; GOOD: modref invoked before with-capability call
  (let ((data (collector::collect))
        (account (collector::get-fee-recipient)))
    (with-capability (COLLECT)
      (store-data data)
      (pay-fee account))))

In this example, the module reference calls have safely returned before the COLLECT capability is acquired. A malicious implementation has no way to invoke the sensitive code.

Coding with module references
You can reference modules and interfaces directly by issuing their name in code. For example:

(module foo 'k
  (defun bar () 0))

(namespace ns)

(interface bar
  (defun quux:string ()))

(module zzz 'k
  (implements bar)
  (defun quux:string () "zzz"))

foo ;; module reference to 'foo', of type 'module'
ns.bar ;; module reference to `bar` interface, also of type 'module'
ns.zzz ;; module reference to `zzz` module, of type 'module{ns.bar}'

Using a module reference in a function is accomplished by specifying the type of the module reference argument, and using the dereference operator :: to invoke a member function of the interface specified in the type.

(interface baz
  (defun quux:bool (a:integer b:string))
  (defconst ONE 1)
  )
(module impl 'k
  (implements baz)
  (defun quux:bool (a:integer b:string)
    (> (length b) a))
  )

...

(defun foo (bar:module{baz})
  (bar::quux 1 "hi")   ;; dereferences 'quux' on whatever module is passed in
  bar::ONE             ;; directly references interface const
)

...

(foo impl) ;; 'impl' references the module defined above, of type 'module{baz}'

You should use module reference calls in use cases that require dynamic evaluation of a function or interface or when an interface requires multiple implementations. For example, decentralized exchanges and liquidity pools typically require module references. You should avoid using use module reference calls where you have a capability that you are using to guard resources could be brought into scope in an external module.

For example, if you are using the INTERNAL_FUNDS_CAP to guard account funds in the mymodule module, you shouldn't bring that capability into scope before calling the external module:

(module mymodule GOVERNANCE
  ...
  (defcap INTERNAL_FUNDS_CAP true) ; my capability for funds owned by this module
  (defconst MODULE_ACCOUNT_GUARD (create-capability-guard (INTERNAL_FUNDS_CAP))
  (defconst MODULE_ACCOUNT (create-principal MODULE_ACCOUNT_GUARD))
  
  (defun withdraw (person:string amount:decimal mref:module{fungible-v2}) 
    (with-capability (INTERNAL_FUNDS_CAP)
      (mref::transfer person MODULE_ACCOUNT amount)
      (coin.transfer MODULE_ACCOUNT person amount))))

In this example, the INTERNAL_FUNDS_CAP capability—which should only be brought into scope for the coin.transfer call—is in scope for both the external mref::transfer call and the coin.transfer call. With this vulnerability, a malicious user could write a module that satisfies the fungible-v2 interface that drains all of the funds from mymodule because the INTERNAL_FUNDS_CAP is in scope.

To fix the issue, you need to change where the call that grants the INTERNAL_FUNDS_CAP capability is brought into scope:

(defun withdraw (person:string amount:decimal mref:module{fungible-v2}) 
    (mref::transfer person MODULE_ACCOUNT amount)
    (with-capability (INTERNAL_FUNDS_CAP)
       (coin.transfer MODULE_ACCOUNT person amount))))

Securing module reference calls
Pact has always relied on restricting loops and preventing recursion to provide security guarantees. These security measure ensure that your program can never enter into an infinite loop and functions can't call into themselves. However, module references introduced a potential vulnerability that Turing incompleteness alone didn't address. In particular, virtual calls to module code that were not controlled by the module caller have been difficult for module authors to make secure. While functions are not allowed to recurse, module references don't prevent virtual calls from reentering the calling module. If the virtual call then calls a separate credit or debit function, that call isn't considered recursion down the call stack. For applications that rely on module references to provide the function interfaces they use, this behavior— combined with the importance of controlling capability scope—has made it difficult for contract authors to write secure contract code.

As a security enhancement, Pact 5.3 introduces module reference calls that are ready-only by default. With Pact 5.3, any module reference function call that reenters the originating module is treated as a read-only call to prevent database modification and code reentry attacks. For example, assume you have a my-token module with the module reference fungible::transfer-create. If the fungible module tries to call back into the my-token module to execute a withdraw-funds or deposit-funds function, the operation isn't allowed because all calls from the fungible module reference are read-only by default.

(module my-token GOVERNANCE
  ...
  (defconst MODULE_GUARD (create-capability-guard (SOME-SECURE-CAP)))
  (defconst MODULE_OWNED_ACCOUNT:string (create-principal ...))

(defun withdraw-funds (account:string destination:module{fungible-v2})
  (require-capability (SOME-SECURE-CAP))
   # Code withdraws funds and transfers them to a particular account
  )

  (defun deposit-funds (account:string amount:decimal fung:module{fungible-v2})
    (with-capability (SOME-SECURE-CAP)
      (fungible::transfer-create account MODULE_OWNED_ACCOUNT MODULE_GUARD amount)))

 )

If the fungible::transfer-create function were written to call back into my-token, calls back into my-token from the fungible module reference would be allowed to retrieve information, such as account details, but not modify balances or any database entries that are part of the my-token module.

For projects like decentralized exchanges (DEX) and bridges that require virtual calls, this enhancement enables Pact to provide module-level security guarantees against reentry attacks.

---

Capabilities
At a high level, Pact capabilities are a straightforward access control model for smart contracts. With capabilities, you can define specific conditions to authorize specific actions for specific users. Capabilities provide an explicit and transparent way to protect privileged operations, enforce rules before allowing transactions to execute, and ensure smart contract users authorize actions that are performed on their behalf.

Because capabilities are a core feature in the Pact smart contract programming language and powerful in how they enable you to manage permissions and resources, it's important to understand what they are, how they work, and how to define them correctly to achieve intended results.

Permissions, resources, and events
Before getting into the details of how capabilities are defined, you should consider that there are three distinct—but related—use cases for capabilities. You can define capabilities to do the following:

Authorize access to a specific privileged operation.
Manage updates for a specific protected resource.
Report events from operations executed in a transaction.
In the most common use case, you define capabilities to manage permissions by enforcing one or more conditions. In combination with guards, these permission-driven capabilities act as gatekeepers to grant access to smart contract functions if the user or contract that controls the guard allows the operation to continue. In general, capabilities protect privileged operations—such as coin.transfer operations—that users must authorize by signing the transaction with their keys or verify in some other way. However, as a contract author, you can define capabilities verify other conditions—such as the account balance or how long it's been since the last transfer operation—before granting the permission requested. If the permission isn't granted, the code where the capability is called won't be executed.

You can think of the capabilities that are used to manage permissions as basic capabilities. For more information about defining, acquiring, and scoping basic capabilities, see Expressing basic capabilities

In addition to permissions, you can use capabilities to manage values for specified resources. Capabilities that manage resources are called managed capabilities. Managed capabilities have slightly different properties enable users or other contracts to set and update the value for a specified parameter. As a contract author, you can define managed capabilities to allow contract users to manage a resource value, for example, to set a limit on the amount that can be transferred in a given transaction or to define the maximum supply of a resource. For more information about defining and using managed capabilities, see Managed capabilities.

Capabilities can also emit events in transaction results. For more information about using capabilities to emit events, see Events.

Expressing basic capabilities
Basic capabilities enable you to manage permissions by specifying the conditions that allow access to a particular resource or contract function. Therefore, in most cases, you define capabilities inside of the same module declaration as the functions that should use them. Within the module declaration, you define capabilities by specifying the defcap reserved keyword and providing the following information:

A capability name that describes the permission to be acquired or the operation to be protected.
Optional parameters that specify input arguments, properties, or conditions for the capability.
A capability body with the predicate function that determines whether the capability is granted or rejected.
This predicate function is evaluated during capability acquisition.
The following example defines a basic ALLOW_ENTRY capability in a registration module:

(module registration GOVERNANCE
  (defcap GOVERNANCE () true)
  
  (defcap ALLOW_ENTRY (user-id:string)
    "Govern entry operation."
    (with-read users-table user-id
      { "guard" := guard, "active" := active }
      (enforce-guard guard)
      (enforce active "Only active users allowed entry"))
  )
)

In this example, the defcap declaration for the ALLOW_ENTRY capability consists of the following:

ALLOW_ENTRY is the name of the capability.

user-id is a parameter that is passed to the capability body to be evaluated.

with-read is the capability body that implements the predicate function. The capability body is evaluated when the with-capability function is called with a specific user-id parameter. For example, if the user-id is bob, the capability body is evaluated when (with-capability (ALLOW_ENTRY "bob") ...) is called.

In its simplest form, the capability body evaluates one or more conditions to determine whether the permission is granted. If the conditions are met—without exiting or throwing an error—the capability is granted and operations continue. In general, you should test all of the conditions you want to define in the defcap declaration using enforce statements, so that the permission won't be granted if any condition fails.

Evaluating and granting permissions
The defcap declaration defines the conditions to evaluate to determine whether a permission should be granted (true) or rejected (false). You use the with-capability built-in function whenever you want to check these conditions before allowing a user to perform a privileged operation.

For example, the following entry function calls the with-capability function to evaluate the ALLOW_ENTRY capability before executing two protected operations:

(defun entry (user-id:string)
  (with-capability (ALLOW_ENTRY user-id)
    (add-entry user-id)            ;; call a protected operation within the with-capability block
    (update-entry-status user-id)  ;; update a database within the with-capability block
  )
  (record-audit "ENTRY" user-id)   ;; call an unprotected operation outside of the with-capability block
)


As illustrated in this example, the capability applies to the protected operations inside of the with-capability code block. If the capability is granted, it remains in scope for all operations contained within the scope of the with-capability function. In this example, the ALLOW_ENTRY capability remains in scope for the add-entry and update-entry-status functions. After the code block containing the call to the with-capability function exits, the capability is no longer in scope. In this example, the ALLOW_ENTRY capability is removed from scope before executing the record-audit function that's outside of the with-capability block. Restricting the capability to the code contained within the with-capability block prevents duplicate testing of the predicate. Capabilities that have already been acquired and that are currently in scope are not re-evaluated.

Requiring a capability
The with-capability function enables smart contract users to attempt to acquire a specified capability that allows them to perform an operation within a limited scope. The require-capability function requires smart contract users to have already been granted the specified capability before they can execute an operation. The require-capability function doesn't evaluate the conditions to grant a capability. If the required capability wasn't acquired in the context of another function, the function calling the require-capability function fails.

For example, you can require the ALLOW_ENTRY capability to have been acquired and currently in scope before executing the add-entry function like this:

(defun entry (user-id)
  (with-capability (ALLOW_ENTRY user-id)
    (add-entry user-id)            
    (update-entry-status user-id)
  )
  (record-audit "ENTRY" user-id)
)

(defun add-entry (user-id)
  (require-capability (ALLOW_ENTRY user-id)) ;; require a previously acquired capability
  ...
)

By requiring a capability, you can define private or restricted functions than cannot be called directly. In this example, the add-entry function can only be called by code inside the module that grants the ALLOW_ENTRY capability and can only be called for this user-id in particular, restricting the function to that user.

However, it's important to note that the require-capability function doesn't scope to a body of code. The position at which you insert it affects the semantics of the function call and the operations that happen first, before the capability requirement is applied. If you insert the require-capability call at an inappropriate position, you might see unexpected behavior or error messages. In general, you should insert the require-capability call at the beginning of a function call.

Composing capabilities
A defcap declaration can also include other capabilities, for modular factoring of guard code or to compose an outer capability from smaller, inner capabilities. For example, the following ALLOW_ENTRY capability declaration includes an inner capability—the DB_LOG capability—that's defined its own separate defcap declaration:

(defcap ALLOW_ENTRY (user-id:string)
  "Govern entry operation."
  (with-read users-table user-id
    { "guard" := guard, "active" := active }
    (enforce-guard guard)
    (enforce active "Only active users allowed entry")
    (compose-capability DB_LOG) ;; allow db logging while ALLOW_ENTRY is in scope
    )
)
(defcap DB_LOG () true)

Composed capabilities must be defined using defcap declarations in the same module as the parent capability and are only in scope when their parent capability is granted.

In many cases, you can use the compose-capability function to improve code logic with clear separation of concerns. The following example illustrates separating the transfer, debit, and credit functions—and corresponding capabilities—so that debit is always called with a corresponding credit operation with the TRANSFER capability being a "no-guard" capability that simply encloses the debit and credit calls:

(defcap TRANSFER:bool (from:string to:string amount:decimal)
  (compose-capability (DEBIT from))
  (compose-capability (CREDIT to)))

(defcap DEBIT (from:string)
  (enforce-guard (at 'guard (read table from))))

(defcap CREDIT (to:string)
  (check-account-exists to))

(defun transfer (from:string to:string amount:decimal)
  (with-capability (TRANSFER from to amount)
    (debit from amount)
    (credit to amount)))

(defun debit (user amount)
  (require-capability (DEBIT user))
    (update accounts user ...))

(defun credit (user amount)
  (require-capability (CREDIT user)
    (update accounts user ...)))

In this example:

The TRANSFER capability protects the debit and credit calls from being used independently.
The DEBIT capability governs the ability to debit, enforcing the guard.
The CREDIT simply creates a restricted capability for the credit function.
Calling basic capabilities
To give you better insight into how to call capabilities, it's important to consider the concept of scope in Pact modules. Potentially, there are several layers of scope that can you might need to navigate, including:

Top-level scope
Module scope
Outer capability scope for composing capabilities
Inner capability scope for composed capabilities
Signature-based scope
You've seen an example of outer and inner capability scope in Composing capabilities. However, it's equally important to know the difference between top-level scope and module scope for capabilities.

Top-level scope
In Pact, the functions and expressions that you execute outside of a module declaration are often referred to as top-level expressions. Functions and expressions that are defined within a module declaration are within the scope of that module. For example, top-level expressions can include direct calls to built-in functions like the following:

(+ 1 2)
(map (- 1) [10 20 30])

In addition, there are several top-level expressions that set context for a module that must be defined outside of the module declaration. For example, you use top-level expressions to define and enter a namespace, define keysets, create tables, and read messages from transaction data.

;; Before module declaration

(define-namespace dev-namespace (read-keyset "user-account" ) (read-keyset "dev-ks-account" ))
(define-keyset "dev-namespace.dev-ks-account" (read-keyset "dev-ks-account" ))

;; Module declaration
(
    ...
)

;; After module declaration

(if (read-msg 'upgrade)
  ["upgrade"]
  [
    (create-table order-table)
  ]
)

Module scope
The functions and expressions that are defined in a module declaration are included in the scope of that module. For example, if you define the awards function in the league module declaration, the function is within the scope of the league module.

(module league GOVERNANCE 
  (defcap GOVERNANCE () true)
   (defun awards (tier:integer)
     (+ tier 2) 
   )
)

Acquire a capability inside of a module
In most cases, capabilities are defined within the scope of a module and you can acquire the access token from within the body of any function defined in the module if you meet the conditions specified in the body of the defcap declaration.

(module league GOVERNANCE
  (defcap GOVERNANCE ()
    (enforce-keyset league_admin))
  (defcap LEAGUE_OPS ()
    ;; one or more conditions that must pass
  )

  (defun awards (tier:integer)
     (with-capability (LEAGUE_OPS) (+ tier 2)) ; operation succeeds if the conditions for LEAGUE_OPS are met     
  )
)


For example, you can acquire the league.LEAGUE_OPS capability by using the with-capability call in any function declaration or defpact step in the league module where the LEAGUE_OPS capability is declared.

(module league GOVERNANCE
  (defcap GOVERNANCE ()
    (enforce-keyset league_admin))
  (defcap LEAGUE_OPS ()
    ;; one or more conditions that must pass
  )

  (defun awards (tier:integer)
     (with-capability (LEAGUE_OPS) (+ tier 2)) ; operation succeeds if the conditions for LEAGUE_OPS are met     
  )
  
  (defpact transfer-portal ()
    (step (with-capability (LEAGUE_OPS) ... )) ; operation succeeds if the conditions for LEAGUE_OPS are met
    (step ...)
  )
)


These examples demonstrate the most common way you acquire the privileges associated with a capability is by calling the with-capability built-in function within a defun or defpact declaration inside of a module declaration. If the conditions specified in the body of the capability declaration are met, permissions are granted and the operation proceeds. The conditions you specify in the body of the capability declaration can vary, but typically enforce some type of guard or key signature.

You should also note that you can't acquire a capability inside of a capability declaration. For example, if you try to acquire a capability in the body of a capability declaration, you'll see an error similar to the following:

"Loading league.pact..."
league.pact:13:7: with-capability form not allowed within defcap
 13 |       ((with-capability (LEAGUE_OPS) (* tier 2)))
    |        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Acquire a capability outside of a module
You can acquire a capability in the top-level—that is, outside of the scope of a module—or within the scope of another module if, and only if, you have the administrative privileges to control the module and satisfy the conditions to acquire the capability.

The following example illustrates a module declaration for the west-conf module that defines a GOVERNANCE capability and an UMPIRE capability with conditions set to true to always succeed:

(module west-conf GOVERNANCE
  (defcap GOVERNANCE () true)
  (defcap UMPIRE () true)
  ...
)

If you deploy this module or load it into the Pact REPL, the GOVERNANCE capability grants you the administrative privileges for the transactions immediately following the deployment of the module. For example, after you load the west-conf module in the Pact REPL, you can acquire the UMPIRE capability to perform an operation:

(with-capability (west-conf.UMPIRE) (* 3 8))
24

Because deploying a module grants you administrative privileges for the module, you can perform other privileged operations—like upgrading modules and creating tables—in the same deployment transaction. In this example, there are no conditions that must be met to acquire the UMPIRE capability. If there were conditions to enforce in the body of the defcap declaration for the UMPIRE capability, those conditions would need to be satisfied to perform the requested operation.

The previous example demonstrates the principle of using module administrator privileges to bring a capability into scope. However, this example doesn't represent a typical use-case. In most cases, you want to carefully control and restrict access to capabilities to prevent unintended privilege elevation. If access to the module administrator privileges is managed in any way—for example, owned by a specific keyset or guard or if a module is not upgradable—you must be able to acquire the module administrator rights to bring a capability into scope.

To acquire module administrator rights for testing purposes in the Pact REPL, you can use the env-module-admin and acquire-module-admin built-in functions.

The following example demonstrates using the acquire-module-admin function to access module administrator rights for module-test to upgrade a module:

pact> (module west-conf GOVERNANCE (defcap GOVERNANCE () (enforce false "non-upgradable")))
Loaded module west-conf, hash v4XXlmt7RI-HVZvPb69lQhFbh8k-luKCtWtm4OVJVU8
pact> (begin-tx "Begin a new transaction after deployment")
"Begin Tx 0 Begin a new transaction after deployment"
pact> (use west-conf)
Loaded imports from west-conf
pact> (with-capability (GOVERNANCE) (* 3 8))
(interactive):1:51: non-upgradable
 1 |  (with-capability (GOVERNANCE) (* 3 8))
   |                                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  at(west-conf.GOVERNANCE.{v4XXlmt7RI-HVZvPb69lQhFbh8k-luKCtWtm4OVJVU8}):(interactive):0:1-0:39
pact> (acquire-module-admin west-conf)
"Module admin for module west-conf acquired"
pact> (with-capability (GOVERNANCE) (* 3 8))
24

To limit module administrator privileges for a capability to a specific transaction block, you can use the env-module-admin built-in function.

pact> (begin-tx "Get module admin privileges for a transaction")
"Begin Tx 1 Get module admin privileges for a transaction"
pact> (use west-conf)
Loaded imports from west-conf
pact> (with-capability (GOVERNANCE) (* 6 9))
(interactive):1:51: non-upgradable
 1 | (with-capability (GOVERNANCE) (* 6 9))
   |                                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
pact> (env-module-admin west-conf)
"Acquired module admin for: west-conf"
pact> (with-capability (GOVERNANCE) (* 6 9))
54

Managed capabilities
Most capabilities control permissions to access protected operations. However, Pact also supports managed capabilities. Managed capabilities provide an additional layer of security that requires all parties involved in a transaction to specify the actions they are authorizing with their signature or a guard. By requiring a signature or guard to authorize an action, managed capabilities enable smart contract users to safely interact with otherwise untrusted code.

As a smart contract author, you specify that a capability is a managed capability by adding the @managed metadata tag in the defcap declaration body. You can define managed capabilities to manage resources in two different ways:

To update a specific resource dynamically through a management function.
To automatically update a resource once without using a management function.
Managed capabilities that use a management function can be called multiple times. Managed capabilities that don't specify a management function can only be called once.

Using management functions
One of the most common use cases for managed capabilities with management functions is for transfer operations. The following example illustrates this use case with the TRANSFER managed capability and the TRANSFER_mgr management function:

  (defcap TRANSFER:bool (sender:string receiver:string amount:decimal)
    @managed amount TRANSFER-mgr
    (enforce (!= sender receiver) "same sender and receiver")
    (enforce (> amount 0.0) "Positive amount")
    (compose-capability (DEBIT sender))
    (compose-capability (CREDIT receiver))
  )

  (defun TRANSFER-mgr:decimal (managed:decimal requested:decimal)
    (let ((newbal (- managed requested))) ;; update managed quantity for next time
      (enforce (>= newbal 0.0)            ;; check that the new balance doesn't exceed the managed quantity
        (format "TRANSFER exceeded for balance {}" [managed]))
      newbal)
  )


In this example, the TRANSFER capability allows the sender to approve any number of transfer operations to the receiver up to the managed resource specified by the @managed keyword. In this case, the resource is the amount value and the TRANSFER_mgr function checks and updates that resource value each time the TRANSFER capability is called for in the transfer function:

(defun transfer:string (sender:string receiver:string amount:decimal)
    (enforce (!= sender receiver) "sender cannot be the receiver of a transfer")
    (enforce (> amount 0.0) "transfer amount must be positive")

    (with-capability (TRANSFER sender receiver amount)
      (debit sender amount)
      (with-read coin-table receiver
        { "guard" := g }

        (credit receiver g amount))
    )
)

If transfer operations exceed the amount value, the TRANSFER capability can no longer be brought into scope.

Smart contract users set the values for the transfer operation and TRANSFER capability and approve the operation by signing for the capability when they send the transaction to the blockchain. Typically, you allow smart contract users to set the transfer values and approve the operation through the frontend of a smart wallet or a similar application. For example, as a smart contract author, you enable smart contract users to construct and submit transactions that set the sender, receiver, and amount parameters and sign for the TRANSFER capability when they call the transfer operation. In the Pact REPL, you can emulate setting the keys in the environment data and signing the capability. For example:

(env-data {"alice":["alice"], "bob":["bob"]})
(env-sigs [{"key":"alice", "caps":[(pistolas-coin.TRANSFER "alice" "bob" 50.0)]}])
(pistolas-coin.transfer "alice" "bob" 40.0)

You should note that managed capabilities always require smart contract users to explicitly approve the operation to be performed. If a transaction includes a managed capability, all capabilities involved in the transaction require a signature. Unrestricted keys aren't allowed if a transaction includes a managed capability.

In most cases, managed resources represent decimal or integer values, but you can use managed capabilities and management functions to manage any type of resource. For example, you could specify a list or an object as the resource you want to manage, then write a management function that removes names from the list or updates object properties based on some condition. However, the @managed keyword only allows you to specify a single resource to be managed—that is, updated—by the management function.

Single-use managed capabilities
Managed capabilities that specify a management function update the managed resource dynamically each time the requested capability is acquired. If a managed capability doesn't specify a management function, the requested capability can only be called once in a transaction. Further attempts will fail after the initial grant goes out of scope.

In the following example, the VOTE capability is automatically managed to ensure that a validated member can only vote once:

(defcap VOTE (member:string)
  @managed
  (validate-member member))

Scoped signatures and verifiers
In Pact transaction messages, transaction signers can scope their signature to one or more specific capabilities. By scoping signatures to specific capabilities, smart contract users can restrict guard operations based on that signature. These explicitly-authorized actions are separate from the Pact code that's executed in the transaction. Regardless of the code that runs during the transaction, scoped capabilities ensure that only authorized actions can be performed on the user's behalf.

Unlike managed capabilities that require a signature or a guard and a managed resource, most capabilities allow users to sign transactions using an unrestricted signing key. Scoped capabilities provide a transparent way for transaction signers to safely call untrusted code. For example, the sender of a transaction can explicitly sign for the GAS capability to authorize gas payments in the coin contract. By scoping the signature to this capability, the account signature can't be used to access any other code that might be called by the transaction.

If a user authorizes a specific capability, the capability is attached to the signature list for the transaction. For example, the following transaction excerpt attaches two capabilities—coin.TRANSFER and coin.GAS—to the public key "fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7" signature:

{
    "signers": [
        {
            "pubKey": "fe4b6da332193cce4d3bd1ebdc716a0e4c3954f265c5fddd6574518827f608b7",
            "clist": [
            {
                "name": "coin.TRANSFER",
                "args": ["k:fe4b6da3...27f608b7" "k:4fe7981d...0bc284d0\",2]},
            {
                "name": "coin.GAS",
                "args":[]}
            ]
        }
    ]
}

The following example illustrates an accounts module with a PAY capability that isn't managed:

(begin-tx)
(module accounts GOVERNANCE
  (defcap GOVERNANCE ()
    (enforce false "NON-UPGRADABLE")
  )

  (defschema account
    balance:decimal
    account-guard:guard
  )
  (deftable accounts-table:{account})

  (defcap PAY (sender:string receiver:string amount:decimal)
    (enforce-guard (at 'account-guard (read accounts-table sender))))

  (defun pay (sender:string receiver:string amount:decimal)
    (with-capability (PAY sender receiver amount)
      (transfer sender receiver amount)))
  
  (defun transfer (sender:string receiver:string amount:decimal)
    (with-read accounts-table sender
      { "balance" := b}
      (with-read accounts-table receiver
        {"balance" := to-balance}
          (update accounts-table receiver {"balance":(+ to-balance amount)})
          (update accounts-table sender {"balance":(- b amount)})
      )
    )
  )
)
(create-table accounts-table)
(env-data {"alice":["alice"], "bob":["bob"]})
(write accounts-table "alice" {"balance":100.0, "account-guard":(read-keyset "alice")})
(write accounts-table "bob" {"balance":100.0, "account-guard":(read-keyset "bob")})
(commit-tx)

In the Pact REPL, you can attach the signature for the alice key to the accounts.PAY capability by using the env-sigs built-in function as follows:

(env-sigs [{"key": "alice", "caps": [(accounts.PAY "alice" "bob" 10.0)]}])
(accounts.pay "alice" "bob" 10.0) ;; works as the cap matches the signature caps

If you modify the scoped capability to use a different receiver or amount, the transaction returns a keyset failure.

(env-sigs [{"key": "alice", "caps": [(accounts.PAY "alice" "carol" 10.0)]}])
(accounts.pay "alice" "bob" 10.0)

For example:

cope-pay.repl:14:4: Keyset failure (keys-all): [alice...]
 14 |     (enforce-guard (at 'account-guard (read accounts-table sender))))
    |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  at(accounts.PAY.{z5Kc3VKBgIr085VLRK2n1rMdlmIxi-NN-P7lYfA6xqg} "alice" "bob" 10.0):scope-pay.repl:16:4-17:40
  at(accounts.pay.{z5Kc3VKBgIr085VLRK2n1rMdlmIxi-NN-P7lYfA6xqg} "alice" "bob" 10.0):scope-pay.repl:40:0-40:33


Scoped capabilities can also be installed by verifier plug-ins. Capabilities that are installed by verifier plug-ins are also scoped to the specific capabilities that they install. Verifier plugins are external to Pact. However, they are similar to signature capabilities in that they enable you to specify some type of trusted entity—for example, a signature or a generated proof—that grants the capabilities to perform some type of protected operation. A signature capability can use the (enforce-guard g) function to check that the keyset guard g includes the signer's key. A capability granted by a verifier plug-in can use the (enforce-verifier 'name) function to check that "name" is the name of the verifier plug-in.

Events
In Pact, events are emitted as part of transaction execution and are included in the transaction results. With events, you can monitor transaction results to determine if a specific operation occurred and prove the outcome using a simple payment verification proof.

Events are treated as capabilities because they share the following characteristics:

Events, like capabilities, allow arbitrary data to be published under a topic or a name. With capabilities, the capability name is the topic, and the arguments are the data.
Granting permission to acquire a managed capability is, in itself, an event recorded for transaction. Events complete the managed capability lifecycle, where you might install or approve a capability of some quantity on the way in, but not necessarily see what quantity was used. With events, the output of the acquired capability is present in the transaction results.
Capabilities are protected such that they can only be acquired in module code, which is appropriate for events as well.
You can emit events for any basic capability by including the @event metadata tag in the defcap declaration. For example:

(defcap BURN:decimal (qty:decimal)
  @event
  ...
)

If you include the @event metadata tag in the defcap declaration, the event is emitted any time that capability is successfully acquired. Basic capabilities that aren't managed can emit events any number of times.

Managed capabilities emit events automatically without specifying the @event metadata tag. The event for a managed capability is emitted once when the capability is first installed or acquired. Events from managed capabilities include the parameters specified when the capability was installed or acquired.

You can use the env-events built-in function to test for emitted events in .repl scripts

---

Guards
In Pact, guards provide a flexible way for you to enforce authorization rules that grant or restrict access based on specific conditions. Guards generalize the behavior of keysets and capabilities to specify conditions that must be met before granting access to an account, a privileged operation, or any type of information that the guard is there to protect.

Although Pact provides several types of guards to handle different scenarios and use cases, a guard is essentially a predicate function that enables you to test whether a condition is present (true) or not (false) with an enforce-guard function.

As you've already seen, a keyset is the most common type of guard. It specifies a list of keys and a predicate function to verify how many keys were used to sign the current transaction. The keyset predicate references a function that compares the public keys in the keyset to the key or keys used to sign the blockchain message. The function accepts two arguments—count and matched—where count is the number of keys in the keyset and matched is how many keys in the message signature match a keyset key. The enforce-keyset function tests whether the required number of matching keys is true or false, determining whether the transaction succeeds with the required number of matched keys or fails because the required number of matched weren't found in the signing set.

The following examples illustrate other use cases for guard predicate functions:

Ensure that a user is a member of a privileged group that can execute a certain function.
Verify that a user has provided some secret, such as the preimage data for a hash function, as is often done for atomic swaps.
Enforce that a module is the only owner that can execute a specific function, for example, to debit a protected account.
Guards enable you combine all of these types of checks into a single, enforceable rule. For example:

Verify the user Alicia is a member of the Executive Board authorized to access the General Fund AND has provided the preimage data AND the transaction is only executable by the module general-fy2025".

Supported guards
Guards can have different properties based on what they are intended to protect access to, but can also interoperate with each other seamlessly. You can include any or all of the following Pact guards in a smart contract:

Keyset guard
KeysetRef guard
User guard
Capability guard
Module guard (DEPRECATED)
Pact guard (DEPRECATED)
Note that the module guard and Pact guard are DEPRECATED because they are considered unsafe.

You can store guards in the Pact database using the guard type. Although Pact defines these different guards to handle different use cases, the most important point to consider in selecting a guard is ensuring it enforces the appropriate conditions to allow or deny access to the appropriate entity, whether that entity is an account balance, a privileged operation, or a customizable user function.

Guards and capabilities
Guards and capabilities provide similar functionality in terms of authorizing access based on specific conditions. However, there are a few fundamental differences between guards and capabilities:

Guards allow you to define a rule that must be satisfied for an operation or transaction to proceed. They simply provide a way to declare a pass-fail condition—the predicate function—without granting any type of privilege or authorized activity. The Pact guard system is flexible enough to express any rule you can code.

Capabilities allow you to declare how a rule is deployed to grant some authority. In doing so, they enumerate the critical rights that are extended to users of the smart contract, and protect code from being called incorrectly.

In addition, you can only grant capabilities inside the module code that declares them. Guards are simply data that can be tested anywhere. For capabilities, this is an important distinction because it ensures an attacker can't elevate privileges from outside of the module code.

Keyset guards
The keyset guard is the backward-compatible keyset as originally defined in Pact. This guard is also referred to as a concrete keyset that's defined in the environment. Using the keyset type is the one instance where you can restrict a guard subtype. For all other guards, the guard type obscures the implementation type to discourage you from using guard-specific control flow, which would be against best practices. In general, you should use the guard type unless you have a specific need to use a keyset.

Examples
To create a keyset guard with the name admin-keyset:

{
  "admin-keyset": {
    "keys": [
      "58705e8699678bd15bbda2cf40fa236694895db614aafc82cf1c06c014ca963c"
    ],
    "pred": "keys-all"
  }
}

To define a keyset by reading a keyset object:

(define-keyset "admin-keyset" (read-keyset "admin-keyset"))
(enforce-guard (read-keyset "admin-keyset"))

Principal account prefix
Each type of principal and guard uses a unique prefix, so they are easy to recognize. If you use the create-principal function to a create principal account for a keyset guard, the principal account uses one of the following prefixes:

k: for single key keysets
w: for multiple keys keysets
KeysetRef guard
You can install concrete keyset guards in the REPL environment by using the define-keyset function. However, if you want to store a reference to a defined keyset, you must use a string type. To make REPL environment keysets interoperate with concrete keysets and other guards, you can use the KeysetRef guard to indicate that a defined keyset is used instead of a concrete keyset.

Examples
(enforce-guard (keyset-ref-guard "foo"))

(update accounts user { "guard": (keyset-ref-guard "foo") })

User guard
User guards allow you to design an arbitrary predicate function to enforce the guard, given some initial data. With user guards, you can implement any type custom predicate logic that can't be expressed by other built-in guard types.

For example, you might want to customize the guard to allow one of two different keysets to sign:

One keyset registers the keys for the members of a board of directors.
A second keyset registers the keys for union representatives.
You can then design a user guard to require two separate keysets to be enforced:

(defun both-sign (board union)
  (enforce-keyset board)
  (enforce-keyset union))

(defun install-both-guard ()
  (write guard-table "both"
    { "guard":
      (create-user-guard
        (both-sign (read-keyset "board) (read-keyset "union")))
    }))


(defun enforce-both-guard ()
  (enforce-guard (at "guard" (read guard-table "both"))))

User guards can be very flexible and powerful. They can be stored in the database and passed around like plain data. However, user guards are pure functions that don't allow access to a database during evaluation of the guard.

Examples
The following example illustrates how to write a custom hash timelock guard to implement atomic swaps.


(create-hashlock-guard (secret-hash timeout signer-ks)
  (create-user-guard (enforce-hashlock secret-hash timeout signer-ks)))

(defun enforce-hashlock (secret-hash timeout signer-ks)
  (enforce-one [
    (enforce (= (hash (read-msg "secret")) secret-hash))
    (and
      (enforce-keyset signer-ks)
      (enforce (> (at "block-time" (chain-data)) timeout) "Timeout not passed"))
      ]))

Principal account prefix
Each type of principal and guard uses a unique prefix, so they are easy to recognize. If you use the create-user-guard function to create a principal account for a user guard, the principal account uses the following prefix:

u: for user guards
Capability guard
Capabilities are in-module rights that can only be enforced within the declaring module, and offer scoping and the other benefits.

Because user guards are required to be pure functions, they can't take database state into account. If you need to access database state, you can define a guard that requires a capability to be brought into scope. With this type of guard, you can retrieve database state when you bring the capability into scope.

Principal account prefix
Each type of principal and guard uses a unique prefix, so they are easy to recognize. If you use the create-capability-guard function to create a principal account for a capability guard, the principal account uses the following prefix:

c: for capability guards

---

Database model
Kadena blockchain nodes store information in two different data stores. On each Chainweb node, there's a RocksDB key-value store that keeps track of information about the peer network, chains, and blocks. Each node also hosts a set of SQLite database files that store information about Pact smart contracts and transaction results with one file for each chain in the network.

The following diagram presents a simplified view of this separation of concerns.

Data store overview

As a smart contract developer, you're primarily interested in writing to and reading from the Pact state, but it's helpful to know how data is organized and optimized for different execution modes and to perform different tasks. The RocksDb database—sometimes referred to as the chain database—is optimized for efficient network communication and resiliency. Pact database operations are optimized for transaction performance.

Working with Pact tables
Tables are a core component of Pact smart contracts because they enable you to store, manipulate, and read data using familiar patterns. Interacting with Pact databases is much like interacting with any other type of database, but with constraints that reflect the unique requirements of blockchain execution. For example, working with Pact databases is similar to working with other SQL-based databases, with similar database operations. There are built-in functions to insert, read, and update values stored in tables.

Function type	Description
Insert	Insert new rows into a table.
Read	Read values from a table.
Update	Update values for a column that contains data in a table.
Write	Write values for a column in a table, regardless of whether the column contains data or not.
Delete	Not available in Pact.
If you've worked with other databases or programming languages, you should be familiar with similar functions that enable you to create, read, update, and delete (CRUD) information. However, in Pact, you use the insert function in place of the create functionality to add rows to a table and there isn't a function to delete rows from a table.

Although Pact doesn't provide a delete function, you can use an active column in tables to mark table rows as active or inactive. For more information about using an active column to indicate active and inactive rows, see Identifying active and inactive rows.

Data access model
Most smart contracts use one or more tables to store all of the information required for the application or service that the smart contract provides. You access the information stored in Pact tables by using the table's key-row structure. This access model is similar to using a primary key to access table data in other relational databases.

With the Pact key-row model, you access a row of column values by using a single key. As a result of this access model, Pact doesn't support joining tables in a way that an online analytical processing database would support if populated from data exported from the Pact database. However, Pact can record transactions using relational techniques. For example, if you have a Customer table with keys used in a Sales table, a Pact smart contract could include code to look up the Customer record before writing to the Sales table.

Null values aren't allowed
The Pact database model doesn't support NULL values as a safety feature to ensure totality for transactions and to avoid unsafe control-flow for handling null values. The main function for working with database results is the with-read function. This function will return an error if any column value it attempts to read isn't found. To prevent transactions from failing with these errors, you should ensure that there are values in the columns you attempt to read in a transaction.

Versioned history
The key-row model is augmented by every change to column values being versioned by a transaction identifier. For example, if you have a table with columns for name, age, and role, you might update the name column in a transaction with the identifier 100, and later update the age and role columns in a transaction identified as 102. If you retrieve historical data for the table, only the change to the name column is returned for transaction identifier 100 and only the change to age and role columns are returned for transaction 102.

Table creation
Tables are defined by schemas in module declarations. The schema defines the table columns, field values, and field types. The module declaration also specifies the table name to associate with each schema you define. There's no restriction on the number of tables you can create.

The tables specified in the module declaration are created after the module declaration, and the table name is prepended with the module name, so that the module becomes the table owner.

It’s important to note this distinction between when tables are defined and when tables are created. You define table schemas, the table associated with each schema, and the functions that insert, read, and modify database records inside of module code. You create the tables outside of module code. The module acts as a guard to protect access to database functions and database records. This separation also allows module code to be updated without necessarily recreating the table in Pact state.

Table schemas
Before you create a table in Pact, you must define its schema. The schema describes the structure of the table by specifying the columns and data types for the values to be stored in the table. Schemas are defined within the Pact module declarations by using the defschema keyword and consist of a series of field names and field types.

Each field name specifies a column in the table, and each field type specifies the type of data held in that field.

In the following example, the accounts table has three columns with the field names balance, amount, and currency:

Field name	Field type
balance	decimal
amount	decimal
currency	string
In this example, the balance and amount columns require decimal as the data type and the currency column requires data to be a string value. You can create the schema for this table in Pact like this:

(defschema accounts
  "Schema for accounts table."
  balance:decimal
  amount:decimal
  currency:string
)

All table schemas you create look similar to this example, but with different field names and data types. Field names must start with a valid alphabetic character, but can contain alphabetic, numeric, and special characters. In general, you should use field names that are short but recognizable. For each field, the field type must be one the data types that Pact supports.

Types that are declared in code are enforced at runtime when expressions are evaluated. For tables, any write to a table is type-checked against the table schema to ensure the data matches the expected type. Execution fails if type checking fails.

For information about the data types that Pact supports, see Data types.

Table definition
In Pact, tables are defined inside of the module declaration by using the deftable keyword. The table definition accomplishes two goals:

It associates a table name with a specific table schema of columns and data types.
It defines the table inside of the module namespace.
There's no limit to the number of tables you can define in a module. Because the table is defined inside of a module, direct access to the table using database functions is only authorized for the module owner, that is, its administrative keyset or governance capability. However, module functions have unrestricted access to the table by default. With this default behavior, the module acts as the main entry point for all user interaction. You can restrict access to tables inside of the module by using row-level keysets and enforcing the keyset guard for specific functions.

The following example illustrates using the deftable keyword to define an accounts-table table that uses the accounts schema:

(deftable accounts-table:{accounts})

Notice that the table and schema are represented as a pair, separated by a colon (:). The curly braces ({ }) around the schema name are there because the schema is an object.

The schema name and table name must be different from one another. In general, you should use table and schema names that are similar to each other or follow a consistent convention to avoid confusion: For example:

(deftable cat-table:{cats})
(deftable asset-tracker:{assets})

Create module tables
After you have defined all of the tables for your module inside of the module declaration, you can create those tables outside of the module. Creating the table outside of the module ensures that other parts of the module logic can be redefined or updated without recreating the table.

You can created tables after the module declaration by using the create-table function followed by the table name as it's defined in the module declaration. For example:

(create-table accounts-table)
(create-table cat-table)
(create-table asset-tracker)

Insert
You can use the insert function to add new data to a table. You can use insert function to add any type of new artifact with a key value. For example, you can use a key value to add a row of data about accounts, customers, loans, or assets.

The following example illustrates adding a row to the accounts-table using the insert function with the key value "account-1".

(insert accounts-table “account-1” { "balance": 12.3, "amount": 0.0, "currency":"USD"})

Note that the key must be a string value. This example adds the following row to the accounts-table:

key	balance	amount	currency
account-1	12.3	0.0	USD
You can also use the insert function inside of another function to add new data to rows in a table from the input values for the function. For example:

(defun create-account (id balance amount currency)
  (insert accounts-table id
       { "balance": balance,
         "amount" : amount,
         "currency": currency })
)

In this example, the row inserted into the accounts-table takes the values entered for the create-account function.

Read
You can use the read function to read a row of data from a specified table for a specified key value.

In the following example, the accounts-table has two rows of data storing the account balance and currency for account-1 and account-2:

key	balance	currency
account-1	4.00	USD
account-2	3.00	USD
You can use the read function to retrieve the information for the key value. For example, you can get the balance and currency information for account-1 like this:

(read accounts-table account-1 ['balance 'ccy])

You can also use the read function inside of another function like this.

(defun read-accounts (1)
  (read accounts id [‘balance ‘ccy])
)

In each example, the read functions returns the following values:

balance	currency
4.00	USD
Update
You can use the update function to update one or more values in an existing row of a table. Updates enable you to change the status of a column or amend the initial dataset to record a new value.

With the update function, you specify the key for the row you want to update, the field you want to update, and the new value for the field in that that row. In most cases, you use update functions in other functions to allow users to input new values.

(update table-name id {"field": new-value})

The following example illustrates updating the status field for an asset in the assets-table. Before updating the assetPrice, the assets-table has the following fields and values.

assetID	assetName	assetPrice	status
asset-1	My Asset	5.0	todo
For this example, the asset-update function updates the status column, then reads the value of the updated column.

(defun asset-update (assetId:string new-status:string)
  (update assets-table assetId {
    "status": new-status
  })
  (read asset-table assetId)
)

Select
You can use the select function to select values from one or more rows in a table. The select function is similar to the read function except that the read function retrieves information for a single key-row value. The select function enables you to retrieve multiple rows from a table based on the criteria you provide. Because you can specify other criteria and not just a single key-row value, the select function provides you with more flexibility in what information you choose to return.

The syntax for the Pact select function is similar to the syntax for standard SQL SELECT statements. In its simplest form, the select statement retrieves all values from a specified table. In the following example, the select statement is used in a select-assets function to return all values from the assets-table:

  (defun select-assets ()
    (select assets-table (constantly true))
  )

This query returns all of the values currently stored in the assets-table fields. For example:

assetId	assetName	assetPrice	status
asset-1	My Asset	5.0	todo
asset-2	Asset 2	6.0	in progress
asset-3	Asset 3	7.0	done
Like standard SQL SELECT statements, you can use a where clause to refine your results. For example, you can return only the assetName and assetPrice for a specific asset name like this:

  (select assets-table ['assetName,'assetPrice] (where 'assetName (= "Asset 2")))

This query returns the following values from the sample assets-table:

assetName	assetPrice
Asset 2	6.0
You can also specify operators—such as greater than (>) or less than (<)—from within the where clause. For example:

  (select assets-table (where 'assetPrice (> 6.0)))

This query returns the following values from the sample assets-table:

key	assetName	assetPrice	status
asset-3	Asset 3	7.0	done
Select queries and performance
You should note that when you write queries using the Pact select function, the select and where operations provide a streaming interface that applies filters to the specified table, then operates on the row set as a list data structure using sort and other functions. Because of the computational overhead, you should avoid using select statements to work with on-chain data.

Although it can be convenient to use select statements to retrieve data, you can often return the same results more efficiently using other functions. For example, the following query selects Programmers with salaries >= 90000 and sorts by age in descending order:

(reverse (sort ['age]
  (select 'employees ['first-name,'last-name,'age]
    (and? (where 'title (= "Programmer"))
          (where 'salary (<= 90000))))))

You can write the same query using the filter function and sorting the resulting list like this:

(reverse (sort ['age]
  (filter (and? (where 'title (= "Programmer"))
                (where 'salary (< 90000)))
          employees))
)

For performance reasons, Pact database interactions are optimized for single-row reads and writes. Queries that use the select statement to scan multiple rows in a table can be slow and prohibitively expensive computationally. Therefore, the best practice is to use select statements in local, non-transactional operations and to avoid using select on large tables in functions that perform transactional operations.

Transactional and local execution
Pact doesn't distinguish between transactional and local execution. However, transactions typically involve business events that must be executed and recorded in a timely fashion. Queries rarely represent a business event, and can often involve data payloads that could impact performance. The best practice is to query data locally on a node by using the /local endpoint. You can also query historical data using the /local endpoint and a transaction identifier as a point of reference.

For transactions, you should use the /send endpoint.

For more information about transaction execution, see Transaction lifecycle. For more information about Pact endpoints, see Pact API.

Keys
You can use the keys function from within a module to return all of the key values in a table. For example, you can return the key values for the sample assets-table with the following code:

(module asset-manager ADMIN
  (defcap ADMIN () true)

  (defschema assets
     assetId:string
     assetName:string
     assetPrice:decimal
     status:string
  )

  (deftable assets-table:{assets})
  ...

  (keys assets-table)
)

You can also use the keys function within another function. For example:

  (defun get-keys (table-name)
    (keys table-name)
  )

Row-level keysets
Keysets can be stored as a column value in a row, allowing for row-level authorization. The following code indicates how this might be achieved:

(defun create-account (id)
  (insert accounts-table id { "balance": 0.0, "keyset": (read-keyset "owner-keyset") }))

(defun read-balance (id)
  (with-read accounts-table id { "balance":= bal, "keyset":= ks }
    (enforce-keyset ks)
    (format "Your balance is {}" [bal])))

In this example, the create-account function reads the owner-keyset definition from the message payload using read-keyset, then stores it in the keyset column in the accounts-table table. The read-balance function only allows the owner-keyset to read the balance by first enforcing the keyset using enforce-keyset function.

Changing a table schema
As noted in Create module tables, you can update contract functions without updating or recreating database tables. However, you can't modify the table schema when you update a contract. In general, Pact doesn't support database migration or schema and table upgrades. To update a database, you must declare new tables and define any data migration functions as part of a module load step for the new module that contains the modified table schema.

To update a table schema:

Create a new module and declare the new table schema.
Add functions to read rows from the old table and write them to the new table.
Deploy the updated module with the new table schema on the network.
The original table and database state remain unchanged on the blockchain, but won't receive any new information after you deploy the new module.

Identifying active and inactive rows
Pact doesn't provide a delete function because of the potential issues with performance, data integrity, and data migration that row-level delete operations can introduce. In addition, being able to delete rows or tables violates one of the most important properties of a blockchain environment: that it provides an immutable record of state.

Because deleting information from tables could also cause problems for replaying transactions or synchronizing nodes and leave the chain in an unhealthy state, Pact doesn't support deleting rows or tables. However, you can use an active column in tables to identify active table rows on insert, then later flag rows with obsolete information as inactive. Inactive rows remain in the database, but you can write logic to prevent them from being updated or retrieved.

For example, you might define the user schema and users-table like this:

   (defschema user
       nickname:string
       keyset:guard
       active:bool
   )

   (deftable users-table:{user})

To add new users to the table, you might define a create-user function similar to the following:

   (defun create-user (id:string nickname:string keyset:guard active:bool)
      (enforce-keyset "free.operate-admin")
      (insert users-table id {
          "keyset": keyset,
          "nickname": nickname,
          "active": true
        }
      )
    )

You can then define a separate function to identify rows—using the id key-row—that are no longer active similar to the following:


    (defun tombstone:string (id:string)
       "Mark the specified row as inactive"
       (update users-table id { "active" : false })
    )

You can then check whether the active column is true or false for a specific row before allowing the row to be updated with code similar to the following:

   (defun change-nickname (id:string new-name:string)
      (with-read users-table id {"active" := active}
        (if (= active true)
          (update users-table id { "nickname": new-name })
          (format "Update NOT ALLOWED for user {}" [id])))
    )

For example, you can set the active column to false for the row identified by tai with a call similar to this:

(tombstone "tai")
"Write succeeded"

If you then attempt to update the nickname column for the tai row, you'll see the message that the change isn't allowed:

(change-nickname "tai" "INACTIVE USER Tai's Nickname")
"Update NOT ALLOWED for user tai"

---

