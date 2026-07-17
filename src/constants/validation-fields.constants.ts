import { BLOCKAGE_LEVELS, VALIDATION_STAGES } from './validation.constants'
import type { BlockageLevel, ValidationStage } from '@/types'

/**
 * Catálogo de campos por etapa — alinhado ao PDF NIRRON (apresentacao.pdf)
 * e à documentação de regras de validação.
 */

export interface StageFieldRule {
  field: string
  label: string
  /** Chaves possíveis em extracted_fields / body_fields (Directus) */
  aliases: string[]
  blockageLevel: BlockageLevel
  /** Documento(s) de origem esperados no cruzamento */
  sourceA: 'invoice' | 'di' | 'duimp' | 'bl' | 'ce_mercante' | 'body'
  sourceB: 'invoice' | 'di' | 'duimp' | 'bl' | 'ce_mercante' | 'body'
}

export const STAGE_FIELD_RULES: Record<ValidationStage, StageFieldRule[]> = {
  [VALIDATION_STAGES.DOCUMENTAL]: [
    { field: 'exporter_name', label: 'Exportador (Nome)', aliases: ['exporter_name', 'exportador', 'exporter', 'shipper_name'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'invoice', sourceB: 'di' },
    { field: 'exporter_country', label: 'Exportador (País)', aliases: ['exporter_country', 'pais_exportador', 'country_of_origin'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'invoice', sourceB: 'di' },
    { field: 'importer_name', label: 'Importador (Razão Social)', aliases: ['importer_name', 'importador', 'importer', 'consignee_name'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'invoice', sourceB: 'di' },
    { field: 'importer_cnpj', label: 'Importador (CNPJ)', aliases: ['importer_cnpj', 'cnpj', 'cnpj_importador'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'invoice', sourceB: 'di' },
    { field: 'incoterm', label: 'Incoterm', aliases: ['incoterm', 'Incoterm'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'invoice', sourceB: 'di' },
    { field: 'currency', label: 'Moeda', aliases: ['currency', 'moeda', 'currency_code'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'invoice', sourceB: 'di' },
    { field: 'quantity', label: 'Quantidade', aliases: ['quantity', 'quantidade', 'qty'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'invoice', sourceB: 'di' },
    { field: 'total_fob_value', label: 'Valor Total FOB', aliases: ['total_fob_value', 'valor_fob', 'total_fob', 'fob_total', 'amount'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'invoice', sourceB: 'di' },
    { field: 'unit_value', label: 'Valor Unitário', aliases: ['unit_value', 'valor_unitario', 'unit_price'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'invoice', sourceB: 'di' },
    { field: 'weight_net', label: 'Peso Líquido', aliases: ['weight_net', 'peso_liquido', 'net_weight'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_2, sourceA: 'invoice', sourceB: 'di' },
    { field: 'weight_gross', label: 'Peso Bruto', aliases: ['weight_gross', 'peso_bruto', 'gross_weight'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_2, sourceA: 'invoice', sourceB: 'di' },
  ],

  [VALIDATION_STAGES.BL]: [
    { field: 'house_bl', label: 'House BL', aliases: ['house_bl', 'bl_number', 'bl', 'bill_of_lading'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'bl', sourceB: 'invoice' },
    { field: 'container', label: 'Container', aliases: ['container', 'container_number', 'cntr'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'bl', sourceB: 'invoice' },
    { field: 'shipment_date', label: 'Data de Embarque', aliases: ['shipment_date', 'data_embarque', 'on_board_date', 'etd'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_2, sourceA: 'bl', sourceB: 'invoice' },
    { field: 'exporter_name', label: 'Exportador', aliases: ['exporter_name', 'exportador', 'shipper'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'bl', sourceB: 'invoice' },
    { field: 'weight_gross', label: 'Peso Bruto', aliases: ['weight_gross', 'peso_bruto', 'gross_weight'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_2, sourceA: 'bl', sourceB: 'invoice' },
    { field: 'weight_net', label: 'Peso Líquido', aliases: ['weight_net', 'peso_liquido', 'net_weight'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_2, sourceA: 'bl', sourceB: 'invoice' },
  ],

  [VALIDATION_STAGES.CE_MERCANTE]: [
    { field: 'ce_number', label: 'Número CE Mercante', aliases: ['ce_number', 'ce_mercante', 'ce', 'conhecimento_eletronico'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'ce_mercante', sourceB: 'bl' },
    { field: 'house_bl', label: 'BL', aliases: ['house_bl', 'bl_number', 'bl'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'ce_mercante', sourceB: 'bl' },
    { field: 'container', label: 'Container', aliases: ['container', 'container_number'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'ce_mercante', sourceB: 'bl' },
    { field: 'cubage', label: 'Cubagem', aliases: ['cubage', 'cubagem', 'cubagem_m3', 'cbm', 'volume'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_2, sourceA: 'ce_mercante', sourceB: 'bl' },
    { field: 'weight_gross', label: 'Peso', aliases: ['weight_gross', 'peso_bruto', 'peso_bruto_kg', 'peso', 'gross_weight'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_2, sourceA: 'ce_mercante', sourceB: 'invoice' },
    { field: 'consignee', label: 'Consignatário', aliases: ['consignee', 'consignatario', 'consignee_name', 'cpf_cnpj_consignatario', 'cnpj_consignatario', 'cnpj'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'ce_mercante', sourceB: 'bl' },
  ],

  [VALIDATION_STAGES.NCM]: [
    { field: 'ncm', label: 'NCM Declarada', aliases: ['ncm', 'NCM', 'ncm_code', 'codigo_ncm'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'invoice', sourceB: 'di' },
    { field: 'product_description', label: 'Descrição da Mercadoria', aliases: ['product_description', 'descricao', 'description', 'goods_description'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'invoice', sourceB: 'di' },
    { field: 'product_code', label: 'Código do Produto', aliases: ['product_code', 'sku', 'part_number', 'codigo_produto'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_2, sourceA: 'invoice', sourceB: 'body' },
  ],

  [VALIDATION_STAGES.BENEFICIOS]: [
    { field: 'ex_tarifario', label: 'Ex-Tarifário', aliases: ['ex_tarifario', 'ex_tariff', 'ex'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'di', sourceB: 'body' },
    { field: 'drawback', label: 'Drawback', aliases: ['drawback', 'ato_concessorio'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'di', sourceB: 'body' },
    { field: 'cat68', label: 'CAT 68', aliases: ['cat68', 'cat_68'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_2, sourceA: 'di', sourceB: 'body' },
    { field: 'antidumping', label: 'Antidumping', aliases: ['antidumping', 'anti_dumping'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'di', sourceB: 'body' },
    { field: 'import_license', label: 'Licença de Importação (LI)', aliases: ['import_license', 'li', 'licenca_importacao'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'di', sourceB: 'body' },
  ],

  [VALIDATION_STAGES.TRIBUTACAO]: [
    { field: 'customs_value', label: 'Valor Aduaneiro', aliases: ['customs_value', 'valor_aduaneiro', 'cif'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'di', sourceB: 'body' },
    { field: 'ii', label: 'Imposto de Importação (II)', aliases: ['ii', 'imposto_importacao'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'di', sourceB: 'body' },
    { field: 'ipi', label: 'IPI', aliases: ['ipi'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'di', sourceB: 'body' },
    { field: 'pis', label: 'PIS', aliases: ['pis'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'di', sourceB: 'body' },
    { field: 'cofins', label: 'COFINS', aliases: ['cofins'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_1, sourceA: 'di', sourceB: 'body' },
    { field: 'icms', label: 'ICMS', aliases: ['icms'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_2, sourceA: 'di', sourceB: 'body' },
    { field: 'afrmm', label: 'AFRMM', aliases: ['afrmm'], blockageLevel: BLOCKAGE_LEVELS.LEVEL_2, sourceA: 'di', sourceB: 'body' },
  ],
}

export const STAGE_ORDER: ValidationStage[] = [
  VALIDATION_STAGES.DOCUMENTAL,
  VALIDATION_STAGES.BL,
  VALIDATION_STAGES.CE_MERCANTE,
  VALIDATION_STAGES.NCM,
  VALIDATION_STAGES.BENEFICIOS,
  VALIDATION_STAGES.TRIBUTACAO,
]

export const PLANNED_RULES_COUNT = Object.values(STAGE_FIELD_RULES).reduce((acc, rules) => acc + rules.length, 0)
