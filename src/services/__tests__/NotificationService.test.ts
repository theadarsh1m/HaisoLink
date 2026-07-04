import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationService } from '../NotificationService';
import { EmailProvider } from '@/providers/EmailProvider';
import * as emailTemplates from '@/utils/emailTemplates';
import { db } from '@/lib/db';

// Mock dependencies
vi.mock('@/lib/db', () => ({
  db: {
    notificationLog: {
      create: vi.fn(),
    }
  }
}));

vi.mock('@/utils/emailTemplates', () => ({
  renderOrderCreatedHtml: vi.fn().mockResolvedValue('<p>Mock HTML</p>'),
}));

class MockEmailProvider implements EmailProvider {
  sendEmail = vi.fn().mockResolvedValue(undefined);
}

describe('NotificationService', () => {
  let mockProvider: MockEmailProvider;
  let notificationService: NotificationService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockProvider = new MockEmailProvider();
    notificationService = new NotificationService(mockProvider);
  });

  it('should generate html and call the email provider on sendOrderCreated', async () => {
    const mockOrder = {
      id: 'order-123',
      trackingNumber: 'TRK-123',
      pickupArea: { areaName: 'Pickup' },
      destinationArea: { areaName: 'Dest' },
      actualWeight: 5,
      totalCharge: 100,
    };

    const mockCustomer = {
      id: 'customer-123',
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test Customer'
      }
    };

    await notificationService.sendOrderCreated(mockOrder, mockCustomer);

    // Give the async dispatch time to execute
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(emailTemplates.renderOrderCreatedHtml).toHaveBeenCalled();
    expect(mockProvider.sendEmail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Your Order Has Been Created',
      html: '<p>Mock HTML</p>'
    });
    
    expect(db.notificationLog.create).toHaveBeenCalled();
  });
});
