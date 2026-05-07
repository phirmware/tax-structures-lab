// All current UK tax figures used in the app.
// IMPORTANT: tax law changes every budget. Treat these as illustrative.
// Update RATES_AS_OF when you refresh them.

export const RATES_AS_OF = '2025/26 tax year (illustrative)';
export const RATES_LAST_REVIEWED = '2026-05-07';

// Income tax (rUK — Scotland differs)
export const PERSONAL_ALLOWANCE = 12_570;
// PA tapers by £1 for every £2 over £100k, fully gone at £125,140
export const PA_TAPER_START = 100_000;
export const PA_TAPER_END = 125_140;

export const BASIC_RATE_LIMIT = 50_270; // top of basic rate band (income)
export const HIGHER_RATE_LIMIT = 125_140; // top of higher rate band

export const IT_BASIC = 0.2;
export const IT_HIGHER = 0.4;
export const IT_ADDITIONAL = 0.45;

// Dividend tax
export const DIVIDEND_ALLOWANCE = 500;
export const DIV_BASIC = 0.0875;
export const DIV_HIGHER = 0.3375;
export const DIV_ADDITIONAL = 0.3935;

// Class 1 NI (employee) — main rate cut to 8% (post-Apr 2024)
export const NI_PT = 12_570; // primary threshold (annualised)
export const NI_UEL = 50_270; // upper earnings limit
export const NI_MAIN = 0.08;
export const NI_UPPER = 0.02;

// Employer NI
export const NI_ER_THRESHOLD = 5_000; // illustrative — was 9,100; lowered in 2025
export const NI_ER_RATE = 0.15; // illustrative rate post-Apr-2025

// Class 4 NI (self-employed)
export const C4_LOWER = 12_570;
export const C4_UPPER = 50_270;
export const C4_MAIN = 0.06;
export const C4_UPPER_RATE = 0.02;
// Class 2 NI: voluntary from 2024/25 if profits below threshold; ignored here

// Corporation tax
export const CT_SMALL_PROFITS = 50_000;
export const CT_MAIN_THRESHOLD = 250_000;
export const CT_SMALL_RATE = 0.19;
export const CT_MAIN_RATE = 0.25;
// Marginal relief fraction for the band 50k–250k
export const CT_MARGINAL_FRACTION = 3 / 200;

// Capital gains
export const CGT_ANNUAL_EXEMPTION = 3_000;
export const CGT_BASIC = 0.18; // post-Oct 2024 increase
export const CGT_HIGHER = 0.24;
// BADR
export const BADR_RATE = 0.14; // post-Apr 2025 illustrative (was 10%)
export const BADR_LIFETIME_LIMIT = 1_000_000;

// VAT
export const VAT_REGISTRATION_THRESHOLD = 90_000;
export const VAT_STANDARD_RATE = 0.2;

// Pension
export const PENSION_ANNUAL_ALLOWANCE = 60_000;
export const PENSION_MIN_AGE = 55; // rising to 57 from 2028

// EIS / SEIS
export const EIS_INCOME_TAX_RELIEF = 0.3;
export const SEIS_INCOME_TAX_RELIEF = 0.5;
export const EIS_INVESTMENT_LIMIT = 1_000_000;
export const SEIS_INVESTMENT_LIMIT = 200_000;

// ISA / LISA
export const ISA_ALLOWANCE = 20_000;
export const LISA_ALLOWANCE = 4_000;
export const LISA_BONUS = 0.25;

// IHT
export const IHT_NIL_RATE_BAND = 325_000;
export const IHT_RESIDENCE_NIL_RATE = 175_000;
export const IHT_RATE = 0.4;

export const HMRC_LABEL = 'HMRC';
export const CURRENCY = 'GBP';

export const DISCLAIMER_LONG = `This is educational, not advisory. Tax law is jurisdiction-specific, changes frequently, and depends on individual circumstances. The principles taught here are durable, but specific numbers, thresholds and rules may be out of date. Always consult a qualified accountant or tax adviser before making real decisions. The goal of this app is to help you ask your accountant better questions, not replace them.`;

export const DISCLAIMER_SHORT = `Educational only — not advice. Verify current rates with a qualified adviser before acting.`;
