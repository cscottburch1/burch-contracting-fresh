import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function GET(request: Request) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get lead counts by status
    const statusStats = await query<{ status: string; count: number }>(
      'SELECT status, COUNT(*) as count FROM leads GROUP BY status'
    );

    // Get lead counts by priority
    const priorityStats = await query<{ priority: string; count: number }>(
      'SELECT priority, COUNT(*) as count FROM leads GROUP BY priority'
    );

    // Get total estimated value
    const valueStats = await query<{ total_value: number }>(
      'SELECT SUM(estimated_value) as total_value FROM leads WHERE status NOT IN ("lost")'
    );

    // Get recent activity
    const recentLeads = await query(
      'SELECT COUNT(*) as count FROM leads WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );

    // Get conversion rate
    const wonLeads = await query('SELECT COUNT(*) as count FROM leads WHERE status = "won"');
    const totalLeads = await query('SELECT COUNT(*) as count FROM leads');

    const conversionRate = (totalLeads[0] as any).count > 0
      ? ((wonLeads[0] as any).count / (totalLeads[0] as any).count) * 100
      : 0;

    return NextResponse.json({
      statistics: {
        byStatus: statusStats,
        byPriority: priorityStats,
        totalValue: (valueStats[0] as any)?.total_value || 0,
        recentCount: (recentLeads[0] as any).count || 0,
        conversionRate: conversionRate.toFixed(1)
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
