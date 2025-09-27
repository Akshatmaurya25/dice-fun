(namespace "free")

(module dice-tipping GOVERNANCE
  "Dice.fun Simple Tipping Contract"

  (defcap GOVERNANCE ()
    "Only governance can update this contract"
    (enforce-guard (keyset-ref-guard "dice-tipping-admin")))

  (defcap TIP (from:string to:string amount:decimal)
    "Capability for tipping operations"
    (enforce (> amount 0.0) "Tip amount must be positive")
    (enforce (!= from to) "Cannot tip yourself")
    (enforce-guard (at 'guard (coin.details from))))

  (defschema tip-record
    from:string
    to:string
    amount:decimal
    timestamp:time
    message:string)

  (deftable tips:{tip-record})

  (defun tip (from:string to:string amount:decimal message:string)
    "Send a tip from one user to another"
    (with-capability (TIP from to amount)
      (let ((tip-id (hash [from to amount (at 'block-time (chain-data))])))
        (coin.transfer from to amount)
        (insert tips tip-id {
          "from": from,
          "to": to,
          "amount": amount,
          "timestamp": (at 'block-time (chain-data)),
          "message": message
        })
        tip-id)))

  (defun get-tips ()
    "Get all tips"
    (select tips (constantly true)))

  (defun get-tip-count ()
    "Get total number of tips"
    (length (keys tips)))

  (defun get-tips-by-sender (sender:string)
    "Get all tips sent by a specific user"
    (select tips (where 'from (= sender))))

  (defun get-tips-by-receiver (receiver:string)
    "Get all tips received by a specific user"
    (select tips (where 'to (= receiver))))
)

(create-table tips)