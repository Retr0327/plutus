export function makeMockCampaignRepository() {
  return {
    findById: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
  };
}

export function makeMockInvoiceRepository() {
  return {
    findById: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
  };
}

export function makeMockAuditLogRepository() {
  return {
    findByEntity: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    saveWithTx: jest.fn(),
  };
}

export function makeMockDataSource() {
  return {
    transaction: jest.fn((cb: (tx: unknown) => Promise<void>) => cb({})),
  };
}
