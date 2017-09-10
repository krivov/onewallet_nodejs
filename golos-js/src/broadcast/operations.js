module.exports = [
  {
    "roles": ["posting"],
    "operation": "vote",
    "params": [
      "voter",
      "author",
      "permlink",
      "weight"
    ]
  },
  {
    "roles": ["posting"],
    "operation": "comment",
    "params": [
      "parent_author",
      "parent_permlink",
      "author",
      "permlink",
      "title",
      "body",
      "json_metadata"
    ]
  },
  {
    "roles": ["active", "owner"],
    "operation": "transfer",
    "params": [
      "from",
      "to",
      "amount",
      "memo"
    ]
  },
  {
    "roles": ["active"],
    "operation": "transfer_to_vesting",
    "params": [
      "from",
      "to",
      "amount"
    ]
  },
  {
    "roles": ["active"],
    "operation": "withdraw_vesting",
    "params": [
      "account",
      "vesting_shares"
    ]
  },
  {
    "roles": ["active"],
    "operation": "limit_order_create",
    "params": [
      "owner",
      "order_id",
      "amount_to_sell",
      "min_to_receive",
      "fill_or_kill",
      "expiration"
    ]
  },
  {
    "roles": ["active"],
    "operation": "limit_order_cancel",
    "params": [
      "owner",
      "order_id"
    ]
  },
  {
    "roles": ["active"],
    "operation": "price",
    "params": [
      "base",
      "quote"
    ]
  },
  {
    "roles": ["active"],
    "operation": "feed_publish",
    "params": [
      "publisher",
      "exchange_rate"
    ]
  },
  {
    "roles": ["active"],
    "operation": "convert",
    "params": [
      "owner",
      "requestid",
      "amount"
    ]
  },
  {
    "roles": ["active"],
    "operation": "account_create",
    "params": [
      "fee",
      "creator",
      "new_account_name",
      "owner",
      "active",
      "posting",
      "memo_key",
      "json_metadata"
    ]
  },
  {
    "roles": ["owner", "active"],
    "operation": "account_update",
    "params": [
      "account",
      "owner",
      "active",
      "posting",
      "memo_key",
      "json_metadata"
    ]
  },
  {
    "roles": ["active"],
    "operation": "witness_update",
    "params": [
      "owner",
      "url",
      "block_signing_key",
      "props",
      "fee"
    ]
  },
  {
    "roles": ["posting"],
    "operation": "account_witness_vote",
    "params": [
      "account",
      "witness",
      "approve"
    ]
  },
  {
    "roles": ["posting"],
    "operation": "account_witness_proxy",
    "params": [
      "account",
      "proxy"
    ]
  },
  {
    "roles": ["active"],
    "operation": "pow",
    "params": [
      "worker",
      "input",
      "signature",
      "work"
    ]
  },
  {
    "roles": ["active"],
    "operation": "custom",
    "params": [
      "required_auths",
      "id",
      "data"
    ]
  },
  {
    "roles": ["posting"],
    "operation": "delete_comment",
    "params": [
      "author",
      "permlink"
    ]
  },
  {
    "roles": ["posting", "active"],
    "operation": "custom_json",
    "params": [
      "required_auths",
      "required_posting_auths",
      "id",
      "json"
    ]
  },
  {
    "roles": ["posting"],
    "operation": "comment_options",
    "params": [
      "author",
      "permlink",
      "max_accepted_payout",
      "percent_steem_dollars",
      "allow_votes",
      "allow_curation_rewards",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "set_withdraw_vesting_route",
    "params": [
      "from_account",
      "to_account",
      "percent",
      "auto_vest"
    ]
  },
  {
    "roles": ["active"],
    "operation": "limit_order_create2",
    "params": [
      "owner",
      "order_id",
      "amount_to_sell",
      "fill_or_kill",
      "exchange_rate",
      "expiration"
    ]
  },
  {
    "roles": ["posting"],
    "operation": "challenge_authority",
    "params": [
      "challenger",
      "challenged",
      "require_owner"
    ]
  },
  {
    "roles": ["active", "owner"],
    "operation": "prove_authority",
    "params": [
      "challenged",
      "require_owner"
    ]
  },
  {
    "roles": ["active"],
    "operation": "request_account_recovery",
    "params": [
      "recovery_account",
      "account_to_recover",
      "new_owner_authority",
      "extensions"
    ]
  },
  {
    "roles": ["owner"],
    "operation": "recover_account",
    "params": [
      "account_to_recover",
      "new_owner_authority",
      "recent_owner_authority",
      "extensions"
    ]
  },
  {
    "roles": ["owner"],
    "operation": "change_recovery_account",
    "params": [
      "account_to_recover",
      "new_recovery_account",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "escrow_transfer",
    "params": [
      "from",
      "to",
      "agent",
      "escrow_id",
      "sbd_amount",
      "steem_amount",
      "fee",
      "ratification_deadline",
      "escrow_expiration",
      "json_meta"
    ]
  },
  {
    "roles": ["active"],
    "operation": "escrow_dispute",
    "params": [
      "from",
      "to",
      "agent",
      "who",
      "escrow_id"
    ]
  },
  {
    "roles": ["active"],
    "operation": "escrow_release",
    "params": [
      "from",
      "to",
      "agent",
      "who",
      "receiver",
      "escrow_id",
      "sbd_amount",
      "steem_amount"
    ]
  },
  {
    "roles": ["active"],
    "operation": "pow2",
    "params": [
      "input",
      "pow_summary"
    ]
  },
  {
    "roles": ["active"],
    "operation": "escrow_approve",
    "params": [
      "from",
      "to",
      "agent",
      "who",
      "escrow_id",
      "approve"
    ]
  },
  {
    "roles": ["active"],
    "operation": "transfer_to_savings",
    "params": [
      "from",
      "to",
      "amount",
      "memo"
    ]
  },
  {
    "roles": ["active"],
    "operation": "transfer_from_savings",
    "params": [
      "from",
      "request_id",
      "to",
      "amount",
      "memo"
    ]
  },
  {
    "roles": ["active"],
    "operation": "cancel_transfer_from_savings",
    "params": [
      "from",
      "request_id"
    ]
  },
  {
    "roles": ["posting", "active", "owner"],
    "operation": "custom_binary",
    "params": [
      "id",
      "data"
    ]
  },
  {
    "roles": ["owner"],
    "operation": "decline_voting_rights",
    "params": [
      "account",
      "decline"
    ]
  },
  {
    "roles": ["active"],
    "operation": "reset_account",
    "params": [
      "reset_account",
      "account_to_reset",
      "new_owner_authority"
    ]
  },
  {
    "roles": ["owner", "posting"],
    "operation": "set_reset_account",
    "params": [
      "account",
      "current_reset_account",
      "reset_account"
    ]
  },
  {
    "roles": ["posting"],
    "operation": "claim_reward_balance",
    "params": [
      "account",
      "reward_steem",
      "reward_sbd",
      "reward_vests"
    ]
  },
  {
    "roles": ["active"],
    "operation": "delegate_vesting_shares",
    "params": [
      "delegator",
      "delegatee",
      "vesting_shares"
    ]
  },
  {
    "roles": ["active"],
    "operation": "account_create_with_delegation",
    "params": [
      "fee",
      "delegation",
      "creator",
      "new_account_name",
      "owner",
      "active",
      "posting",
      "memo_key",
      "json_metadata",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "fill_convert_request",
    "params": [
      "owner",
      "requestid",
      "amount_in",
      "amount_out"
    ]
  },
  {
    "roles": ["posting"],
    "operation": "comment_reward",
    "params": [
      "author",
      "permlink",
      "payout"
    ]
  },
  {
    "roles": ["active"],
    "operation": "liquidity_reward",
    "params": [
      "owner",
      "payout"
    ]
  },
  {
    "roles": ["active"],
    "operation": "interest",
    "params": [
      "owner",
      "interest"
    ]
  },
  {
    "roles": ["active"],
    "operation": "fill_vesting_withdraw",
    "params": [
      "from_account",
      "to_account",
      "withdrawn",
      "deposited"
    ]
  },
  {
    "roles": ["posting"],
    "operation": "fill_order",
    "params": [
      "current_owner",
      "current_orderid",
      "current_pays",
      "open_owner",
      "open_orderid",
      "open_pays"
    ]
  },
  {
    "roles": ["posting"],
    "operation": "fill_transfer_from_savings",
    "params": [
      "from",
      "to",
      "amount",
      "request_id",
      "memo"
    ]
  },
  {
    "roles": ["active"],
    "operation": "asset_create",
    "params": [
      "issuer",
      "asset_name",
      "precision",
      "common_options",
      "bitasset_opts",
      "is_prediction_market",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "asset_global_settle",
    "params": [
      "issuer",
      "asset_to_settle",
      "settle_price",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "asset_settle",
    "params": [
      "account",
      "amount",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "asset_force_settle",
    "params": [
      "account",
      "amount",
      "settlement_id",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "asset_fund_fee_pool",
    "params": [
      "from_account",
      "asset_name",
      "amount",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "asset_update",
    "params": [
      "issuer",
      "asset_to_update",
      "new_issuer",
      "new_options",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "asset_update_bitasset",
    "params": [
      "issuer",
      "asset_to_update",
      "new_options",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "asset_update_feed_producers",
    "params": [
      "issuer",
      "asset_to_update",
      "new_feed_producers",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "asset_publish_feed",
    "params": [
      "publisher",
      "asset_name",
      "feed",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "asset_issue",
    "params": [
      "issuer",
      "asset_to_issue",
      "issue_to_account",
      "memo",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "asset_reserve",
    "params": [
      "payer",
      "amount_to_reserve",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "asset_claim_fees",
    "params": [
      "issuer",
      "amount_to_claim",
      "extensions"
    ]
  },
  {
    "roles": ["active"],
    "operation": "call_order_update",
    "params": [
      "funding_account",
      "delta_collateral",
      "delta_debt"
    ]
  }
];
