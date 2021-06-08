import * as BufferLayout from 'buffer-layout';
export const LAYOUT = BufferLayout.union(BufferLayout.u8('instruction'));

LAYOUT.addVariant(
    0,
    BufferLayout.struct([
        BufferLayout.u8('decimals'),
        BufferLayout.blob(32, 'mintAuthority'),
        BufferLayout.u8('freezeAuthorityOption'),
        BufferLayout.blob(32, 'freezeAuthority'),
    ]),
    'initializeMint',
);

LAYOUT.addVariant(1, BufferLayout.struct([]), 'initializeKeypair');
LAYOUT.addVariant(
    3,
    BufferLayout.struct([BufferLayout.nu64('amount')]),
    'transfer',
);
LAYOUT.addVariant(
    7,
    BufferLayout.struct([BufferLayout.nu64('amount')]),
    'mintTo',
);

LAYOUT.addVariant(
  9,
  BufferLayout.struct([BufferLayout.nu64('amount')]),
  'burn',
);
LAYOUT.addVariant(9, BufferLayout.struct([]), 'closeKeypair');

export const ACCOUNT_LAYOUT = BufferLayout.struct([
    BufferLayout.blob(32, 'mint'),
    BufferLayout.blob(32, 'owner'),
    BufferLayout.nu64('amount'),
    BufferLayout.blob(93),
]);

export const MINT_LAYOUT = BufferLayout.struct([
    BufferLayout.blob(44),
    BufferLayout.u8('decimals'),
    BufferLayout.blob(37),
]);