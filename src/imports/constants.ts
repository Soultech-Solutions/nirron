export const IMPORT_DOCUMENT_TYPES = {
  INVOICE: 'invoice',
  BL: 'bl',
  CE_MERCANTE: 'ce_mercante',
  DI: 'di',
  DUIMP: 'duimp',
} as const

export const IMPORT_DOCUMENT_TYPE_LABELS: Record<
  (typeof IMPORT_DOCUMENT_TYPES)[keyof typeof IMPORT_DOCUMENT_TYPES],
  string
> = {
  [IMPORT_DOCUMENT_TYPES.INVOICE]: 'Invoice',
  [IMPORT_DOCUMENT_TYPES.BL]: 'Conhecimento de Embarque (BL)',
  [IMPORT_DOCUMENT_TYPES.CE_MERCANTE]: 'CE Mercante',
  [IMPORT_DOCUMENT_TYPES.DI]: 'Declaração de Importação (DI)',
  [IMPORT_DOCUMENT_TYPES.DUIMP]: 'DUIMP',
}

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'BRL'] as const

export const SUPPORTED_INCOTERMS = ['FOB', 'CIF', 'CFR', 'EXW', 'FCA'] as const
