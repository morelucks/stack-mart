;; StackMart - Decentralized Marketplace for Digital Goods

(define-trait sip009-nft-trait
  (
    (get-owner (uint) (response (optional principal) uint))
    (transfer (uint principal principal) (response bool uint))
  )
)

(define-constant ERR_NOT_FOUND (err u404))
(define-constant ERR_NOT_OWNER (err u403))
(define-constant ERR_INVALID_STATE (err u400))
(define-constant ERR_PAUSED (err u406))
(define-constant BPS_DENOMINATOR u10000)
(define-constant MAX_ROYALTY_BIPS u5000)

(define-data-var next-id uint u1)
(define-data-var admin principal tx-sender)
(define-data-var paused bool false)
(define-data-var marketplace-fee-bips uint u250)
(define-data-var fee-recipient principal tx-sender)

(define-map listings
  { id: uint }
  { seller: principal
  , nft-contract: principal
  , token-id: uint
  , price: uint
  , royalty-bips: uint
  , royalty-recipient: principal
  , active: bool
  })

(define-public (list-nft (nft-contract <sip009-nft-trait>) (token-id uint) (price uint) (royalty-bips uint) (royalty-recipient principal))
  (let ((id (var-get next-id)))
    (begin
      (asserts! (not (var-get paused)) ERR_PAUSED)
      (asserts! (<= royalty-bips MAX_ROYALTY_BIPS) ERR_INVALID_STATE)
      (try! (contract-call? nft-contract transfer token-id tx-sender (as-contract tx-sender)))
      (map-set listings
        { id: id }
        { seller: tx-sender
        , nft-contract: (contract-of nft-contract)
        , token-id: token-id
        , price: price
        , royalty-bips: royalty-bips
        , royalty-recipient: royalty-recipient
        , active: true })
      (var-set next-id (+ id u1))
      (ok id))))

(define-public (buy-nft (listing-id uint) (nft-contract <sip009-nft-trait>))
  (let ((listing (unwrap! (map-get? listings { id: listing-id }) ERR_NOT_FOUND)))
    (let ((price (get price listing))
          (seller (get seller listing))
          (royalty-bips (get royalty-bips listing))
          (royalty-recipient (get royalty-recipient listing))
          (royalty (/ (* price royalty-bips) BPS_DENOMINATOR))
          (marketplace-fee (/ (* price (var-get marketplace-fee-bips)) BPS_DENOMINATOR))
          (seller-share (- (- price royalty) marketplace-fee)))
      (begin
        (asserts! (not (var-get paused)) ERR_PAUSED)
        (asserts! (get active listing) ERR_INVALID_STATE)
        (asserts! (is-eq (contract-of nft-contract) (get nft-contract listing)) ERR_INVALID_STATE)
        
        (try! (stx-transfer? price tx-sender seller))
        (if (> royalty u0)
          (try! (stx-transfer? royalty seller royalty-recipient))
          true)
        (try! (stx-transfer? marketplace-fee seller (var-get fee-recipient)))
        (try! (as-contract (contract-call? nft-contract transfer (get token-id listing) tx-sender tx-sender)))
        
        (map-set listings { id: listing-id } (merge listing { active: false }))
        (ok true)))))

(define-public (cancel-listing (listing-id uint) (nft-contract <sip009-nft-trait>))
  (let ((listing (unwrap! (map-get? listings { id: listing-id }) ERR_NOT_FOUND)))
    (begin
      (asserts! (is-eq tx-sender (get seller listing)) ERR_NOT_OWNER)
      (asserts! (get active listing) ERR_INVALID_STATE)
      (try! (as-contract (contract-call? nft-contract transfer (get token-id listing) tx-sender (get seller listing))))
      (map-set listings { id: listing-id } (merge listing { active: false }))
      (ok true))))

(define-read-only (get-listing (id uint))
  (map-get? listings { id: id }))

(define-public (set-paused (new-paused bool))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) ERR_NOT_OWNER)
    (var-set paused new-paused)
    (ok true)))

(define-public (set-marketplace-fee (new-fee-bips uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) ERR_NOT_OWNER)
    (asserts! (<= new-fee-bips u1000) ERR_INVALID_STATE)
    (var-set marketplace-fee-bips new-fee-bips)
    (ok true)))

(define-read-only (get-marketplace-fee)
  (var-get marketplace-fee-bips))
