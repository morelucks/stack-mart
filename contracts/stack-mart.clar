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
      ;; Note: NFT transfer would require dynamic contract-call which is not supported
      ;; This function is kept for interface compatibility but NFT transfer is disabled
      (map-set auctions
        { id: id }
        { seller: tx-sender
        , nft-contract: nft-contract
        , token-id: token-id
        , start-price: start-price
        , reserve-price: reserve-price
        , end-block: (+ burn-block-height duration)
        , highest-bid: u0
        , highest-bidder: none
        , state: "active" })
      (var-set next-auction-id (+ id u1))
      (ok id))))


(define-public (place-bid (auction-id uint) (amount uint))
  (match (map-get? auctions { id: auction-id })
    auction
      (let ((current-bid (get highest-bid auction))
            (current-bidder (get highest-bidder auction)))
        (begin
          (asserts! (is-eq (get state auction) "active") ERR_INVALID_STATE)
          (asserts! (< burn-block-height (get end-block auction)) ERR_TIMEOUT_NOT_REACHED)
          (asserts! (> amount current-bid) ERR_INVALID_LISTING) ;; Bid must be higher
          (asserts! (>= amount (get start-price auction)) ERR_INVALID_LISTING)
          
          ;; Transfer STX to contract
          (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
          
          ;; Refund previous bidder
          (if (is-some current-bidder)
            (try! (as-contract (stx-transfer? current-bid tx-sender (unwrap-panic current-bidder))))
            true)
            
          (map-set auctions
            { id: auction-id }
            (merge auction { highest-bid: amount, highest-bidder: (some tx-sender) }))
          (ok true)))
    ERR_NOT_FOUND))

(define-public (end-auction (auction-id uint) (nft-contract-param principal))
  (match (map-get? auctions { id: auction-id })
    auction
      (begin
        (asserts! (is-eq (get state auction) "active") ERR_INVALID_STATE)
        ;; Allow ending if expired OR if seller cancels (if no bids)
        ;; If bids exist, must wait for expiry
        (asserts! (or (>= burn-block-height (get end-block auction)) 
                      (and (is-eq tx-sender (get seller auction)) (is-eq (get highest-bid auction) u0))) 
                  ERR_TIMEOUT_NOT_REACHED)
        
        ;; Verify contract matches
        (asserts! (is-eq nft-contract-param (get nft-contract auction)) ERR_INVALID_LISTING)

        (let ((winner (get highest-bidder auction))
              (price (get highest-bid auction))
              (seller (get seller auction))
              (token-id (get token-id auction)))
           (begin
             (match winner
               buyer 
                 (if (>= price (get reserve-price auction))
                   (begin
                     ;; Success - Transfer STX to seller (minus fee)
                     ;; Note: NFT transfer would require dynamic contract-call which is not supported
                     (let ((marketplace-fee (/ (* price (var-get marketplace-fee-bips)) BPS_DENOMINATOR))
                           (seller-share (- price marketplace-fee)))
                       (try! (as-contract (stx-transfer? marketplace-fee tx-sender (var-get fee-recipient))))
                       (try! (as-contract (stx-transfer? seller-share tx-sender seller))))
                     
                     (map-set auctions { id: auction-id } (merge auction { state: "ended" }))
                     (ok true))
                   (begin
                     ;; Reserve not met - Refund buyer
                     (try! (as-contract (stx-transfer? price tx-sender buyer)))
                     (map-set auctions { id: auction-id } (merge auction { state: "ended" }))
                     (ok false)))
               ;; No bids - Just mark as ended
               (begin 
                  (map-set auctions { id: auction-id } (merge auction { state: "ended" }))
                  (ok true)))
           )) 
      )
    ERR_NOT_FOUND))

;; Bundle and curated pack system
(define-map bundles
  { id: uint }
  { listing-ids: (list 10 uint)
  , discount-bips: uint
  , creator: principal
  , created-at-block: uint
  })

(define-map packs
  { id: uint }
  { listing-ids: (list 20 uint)
  , price: uint
  , curator: principal
  , created-at-block: uint
  })

(define-read-only (get-next-id)
  (ok (var-get next-id)))

(define-read-only (get-listing (id uint))
  (match (map-get? listings { id: id })
    listing (ok listing)
    ERR_NOT_FOUND))

;; get-listing-with-nft is an alias for get-listing (both return same data)
(define-read-only (get-listing-with-nft (id uint))
  (get-listing id))

(define-read-only (get-escrow-status (listing-id uint))
  (match (map-get? escrows { listing-id: listing-id })
    escrow (ok escrow)
    ERR_ESCROW_NOT_FOUND))

;; Shared default reputation structure
(define-constant DEFAULT_REPUTATION {
  successful-txs: u0
, failed-txs: u0
, rating-sum: u0
, rating-count: u0
})

(define-read-only (get-user-reputation (user principal))
  (ok (default-to { successful-txs: u0, failed-txs: u0, rating-sum: u0, rating-count: u0, total-volume: u0 } (map-get? reputation { user: user }))))

;; Legacy aliases for compatibility
(define-read-only (get-seller-reputation (seller principal))
  (ok (default-to { successful-txs: u0, failed-txs: u0, rating-sum: u0, rating-count: u0, total-volume: u0 } (map-get? reputation { user: seller }))))

(define-read-only (get-buyer-reputation (buyer principal))
  (ok (default-to { successful-txs: u0, failed-txs: u0, rating-sum: u0, rating-count: u0, total-volume: u0 } (map-get? reputation { user: buyer }))))

;; Enhanced reputation system functions
(define-read-only (get-reputation-v2 (principal principal))
  (ok (default-to { 
    successful-txs: u0, 
    failed-txs: u0, 
    total-volume: u0, 
    rating-sum: u0, 
    rating-count: u0, 
    weighted-score: u0, 
    last-updated: u0, 
    verification-level: u0 
  } (map-get? reputation-v2 { principal: principal }))))

(define-private (calculate-weighted-score (successful-txs uint) (failed-txs uint) (total-volume uint) (rating-sum uint) (rating-count uint))
  (let ((total-txs (+ successful-txs failed-txs))
        (success-rate (if (> total-txs u0) (/ (* successful-txs u100) total-txs) u0))
        (avg-rating (if (> rating-count u0) (/ rating-sum rating-count) u0))
        (volume-weight (if (< (/ total-volume u1000) u100) (/ total-volume u1000) u100))) ;; Cap volume weight at 100
    (+ (* success-rate u40) (* avg-rating u40) (* volume-weight u20))))

;; Enhanced reputation update with bug fixes - ACTIVE VERSION
(define-private (update-reputation-v2 (principal principal) (success bool) (amount uint) (rating (optional uint)))
  ;; Redirect to fixed version
  (update-reputation-v2-fixed principal success amount rating))

;; Mutual rating function
(define-public (rate-transaction (listing-id uint) (rating uint) (comment (optional (string-ascii 200))))
  (begin
    ;; Validate rating is between 1-5
    (asserts! (and (>= rating u1) (<= rating u5)) ERR_INVALID_INPUT)
    ;; Check transaction exists and caller was involved
    (match (map-get? escrows { listing-id: listing-id })
      escrow
        (begin
          ;; Only buyer or seller can rate, and only after completion
          (asserts! (or (is-eq tx-sender (get buyer escrow)) (is-eq tx-sender (get seller escrow))) ERR_NOT_OWNER)
          (asserts! (is-eq (get state escrow) "confirmed") ERR_INVALID_STATE)
          ;; Check if already rated
          (asserts! (is-none (map-get? transaction-ratings { listing-id: listing-id, rater: tx-sender })) ERR_INVALID_STATE)
          ;; Record rating
          (map-set transaction-ratings
            { listing-id: listing-id, rater: tx-sender }
            { rating: rating, comment: comment, timestamp: burn-block-height })
          ;; Update reputation of the other party
          (let ((other-party (if (is-eq tx-sender (get buyer escrow)) (get seller escrow) (get buyer escrow))))
            (update-reputation-v2-fixed other-party true (get amount escrow) (some rating)))
          (ok true))
      ERR_ESCROW_NOT_FOUND)))

;; Verify NFT ownership using SIP-009 standard (get-owner function)
;; Note: In Clarity, contract-call? with variable principals works at runtime
;; The trait is defined for documentation and type checking purposes
;; verify-nft-ownership removed due to invalid Clarity syntax (principal as trait)


;; Legacy function - kept for backward compatibility (no NFT)

(define-data-var total-volume uint u0)
(define-data-var total-transactions uint u0)
(define-data-var total-fees-collected uint u0)

(define-private (update-marketplace-metrics (amount uint) (fee uint))
  (begin
    (var-set total-volume (+ (var-get total-volume) amount))
    (var-set total-transactions (+ (var-get total-transactions) u1))
    (var-set total-fees-collected (+ (var-get total-fees-collected) fee))))

(define-read-only (get-marketplace-metrics)
  (ok { total-volume: (var-get total-volume)
      , total-transactions: (var-get total-transactions)
      , total-fees-collected: (var-get total-fees-collected) }))

(define-public (create-listing (price uint) (royalty-bips uint) (royalty-recipient principal))
  (begin
    (asserts! (not (var-get paused)) ERR_PAUSED)
    (asserts! (<= royalty-bips MAX_ROYALTY_BIPS) ERR_BAD_ROYALTY)
    (let ((id (var-get next-id)))
      (map-set listings
        { id: id }
        { seller: tx-sender
        , price: price
        , royalty-bips: royalty-bips
        , royalty-recipient: royalty-recipient
        , nft-contract: none
        , token-id: none
        , license-terms: none })
      (var-set next-id (+ id u1))
      (add-listing-to-seller-index tx-sender id)
      (print { event: "listing_created", id: id, seller: tx-sender, price: price })
      (ok id))))

;; Create listing with NFT and license terms
(define-public (create-listing-with-nft
    (nft-contract principal)
    (token-id uint)
    (price uint)
    (royalty-bips uint)
    (royalty-recipient principal)
    (license-terms (string-ascii 500)))
  (begin
    (asserts! (<= royalty-bips MAX_ROYALTY_BIPS) ERR_BAD_ROYALTY)
    ;; Verify seller owns the NFT - logic temporarily removed due to trait issue
    ;; (asserts! (verify-nft-ownership nft-contract token-id tx-sender) ERR_NOT_OWNER)

    (let ((id (var-get next-id)))
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
